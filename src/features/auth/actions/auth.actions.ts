'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { LOCATIONS, SKILLS, TIME_SLOTS } from '@/lib/constants'

// ─── Schemas ────────────────────────────────────────────────────────────────

const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'البريد الإلكتروني مطلوب')
    .email('صيغة البريد الإلكتروني غير صحيحة'),
  password: z
    .string()
    .min(1, 'كلمة المرور مطلوبة')
    .min(8, 'كلمة المرور يجب أن تكون 8 أحرف على الأقل'),
})

const registerSchema = z.object({
  email: z
    .string()
    .min(1, 'البريد الإلكتروني مطلوب')
    .email('صيغة البريد الإلكتروني غير صحيحة'),
  password: z
    .string()
    .min(8, 'كلمة المرور يجب أن تكون 8 أحرف على الأقل')
    .regex(/[A-Z]/, 'يجب أن تحتوي على حرف كبير واحد على الأقل')
    .regex(/[0-9]/, 'يجب أن تحتوي على رقم واحد على الأقل'),
  role: z.string().refine(
    val => ['volunteer', 'org'].includes(val),
    { message: 'يرجى اختيار الدور' }
  ),
  full_name: z.string().min(2, 'الاسم يجب أن يكون حرفين على الأقل').max(100),
  location: z.string().refine(
    val => (LOCATIONS as readonly string[]).includes(val),
    { message: 'يرجى اختيار الموقع' }
  ),
  skills: z.array(z.string()).optional(),
  time_slot: z.string().refine(
    val => !val || (TIME_SLOTS as readonly string[]).includes(val),
    { message: 'التوقيت غير صالح' }
  ).optional(),
})

// ─── Types ───────────────────────────────────────────────────────────────────

export type LoginState = {
  error: string | null
  fieldErrors?: Partial<Record<'email' | 'password', string[]>>
}

export type RegisterState = {
  error: string | null
  fieldErrors?: Partial<Record<keyof z.infer<typeof registerSchema>, string[]>>
}

// ─── Actions ─────────────────────────────────────────────────────────────────

export async function loginAction(
  _prev: LoginState,
  formData: FormData
): Promise<LoginState> {
  const raw = {
    email: formData.get('email'),
    password: formData.get('password'),
  }

  const parsed = loginSchema.safeParse(raw)
  if (!parsed.success) {
    return { error: null, fieldErrors: parsed.error.flatten().fieldErrors }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  })

  if (error) return { error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function registerAction(
  _prev: RegisterState,
  formData: FormData
): Promise<RegisterState> {
  const skillsRaw = formData.get('skills')
  const skills = skillsRaw ? (JSON.parse(skillsRaw as string) as string[]) : []

  const raw = {
    email: formData.get('email'),
    password: formData.get('password'),
    role: formData.get('role'),
    full_name: formData.get('full_name'),
    location: formData.get('location'),
    skills,
    time_slot: formData.get('time_slot') || undefined,
  }

  const parsed = registerSchema.safeParse(raw)
  if (!parsed.success) {
    return { error: null, fieldErrors: parsed.error.flatten().fieldErrors }
  }

  const supabase = await createClient()

  const { data: authData, error: signUpError } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
  })

  if (signUpError) {
    if (signUpError.message.includes('already registered')) {
      return { error: 'هذا البريد الإلكتروني مسجل مسبقاً' }
    }
    return { error: 'حدث خطأ أثناء التسجيل. يرجى المحاولة مرة أخرى' }
  }

  if (!authData.user) return { error: 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى' }

  const role = parsed.data.role as 'volunteer' | 'org'

  const { error: profileError } = await supabase.from('profiles').insert({
    id: authData.user.id,
    full_name: parsed.data.full_name,
    role,
    location: parsed.data.location,
    skills: role === 'volunteer' ? (parsed.data.skills ?? []) : [],
    time_slot: role === 'volunteer' ? (parsed.data.time_slot ?? null) : null,
    bio: '',
    avatar_url: null,
    signature_path: null,
    is_verified: false,
  })

  if (profileError) {
    return { error: 'حدث خطأ أثناء حفظ البيانات. يرجى التواصل مع الدعم' }
  }

  revalidatePath('/', 'layout')
  redirect(role === 'org' ? '/dashboard?status=pending_verification' : '/dashboard')
}

export async function signInWithGoogleAction(): Promise<{ url: string } | { error: string }> {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    },
  })

  if (error || !data.url) {
    return { error: 'تعذّر تسجيل الدخول عبر Google. يرجى المحاولة مرة أخرى' }
  }

  return { url: data.url }
}

export async function signOutAction() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}

// ─── Complete Profile (Google OAuth) ─────────────────────────────────────────

const completeProfileSchema = z.object({
  full_name: z.string().min(2, 'الاسم يجب أن يكون حرفين على الأقل').max(100),
  role: z.string().refine(
    val => ['volunteer', 'org'].includes(val),
    { message: 'يرجى اختيار نوع الحساب' }
  ),
  location: z.string().refine(
    val => (LOCATIONS as readonly string[]).includes(val),
    { message: 'يرجى اختيار الموقع' }
  ),
  skills: z.array(z.string()).optional(),
  time_slot: z.string().refine(
    val => !val || (TIME_SLOTS as readonly string[]).includes(val),
    { message: 'التوقيت غير صالح' }
  ).optional(),
})

export type CompleteState = {
  error: string | null
  fieldErrors?: Partial<Record<'full_name' | 'location' | 'role', string[]>>
}

export async function completeProfileAction(
  _prev: CompleteState,
  formData: FormData
): Promise<CompleteState> {
  const skillsRaw = formData.get('skills')
  const skills = skillsRaw ? (JSON.parse(skillsRaw as string) as string[]) : []

  const raw = {
    full_name: formData.get('full_name'),
    role: formData.get('role'),
    location: formData.get('location'),
    skills,
    time_slot: formData.get('time_slot') || undefined,
  }

  const parsed = completeProfileSchema.safeParse(raw)
  if (!parsed.success) {
    return { error: null, fieldErrors: parsed.error.flatten().fieldErrors }
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'الجلسة منتهية، يرجى تسجيل الدخول مرة أخرى' }

  const role = parsed.data.role as 'volunteer' | 'org'

  const { error: profileError } = await supabase.from('profiles').insert({
    id: user.id,
    full_name: parsed.data.full_name,
    role,
    location: parsed.data.location,
    skills: role === 'volunteer' ? (parsed.data.skills ?? []) : [],
    time_slot: role === 'volunteer' ? (parsed.data.time_slot ?? null) : null,
    bio: '',
    avatar_url: null,
    signature_path: null,
    is_verified: false,
  })

  if (profileError) {
    return { error: 'حدث خطأ أثناء حفظ البيانات. يرجى المحاولة مرة أخرى' }
  }

  revalidatePath('/', 'layout')
  redirect(role === 'org' ? '/dashboard?status=pending_verification' : '/dashboard')
}