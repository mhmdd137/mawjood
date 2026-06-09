'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { updateProfileSchema } from '@/lib/validations'

type UpdateProfileState = {
  error: string | null
  success: boolean
  fieldErrors?: Partial<Record<'full_name' | 'location' | 'bio', string[]>>
}

export async function updateProfile(
  _prev: UpdateProfileState,
  formData: FormData
): Promise<UpdateProfileState> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const raw = Object.fromEntries(formData)
  const parsed = updateProfileSchema.safeParse(raw)

  if (!parsed.success) {
    const flat = parsed.error.flatten()
    return {
      error: 'يوجد خطأ في البيانات المدخلة',
      success: false,
      fieldErrors: flat.fieldErrors as UpdateProfileState['fieldErrors'],
    }
  }

  const { full_name, location, bio, skills, time_slot } = parsed.data

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  const updateData: Record<string, unknown> = { full_name, location, bio }

  if (profile?.role === 'volunteer') {
    updateData.skills = skills
    updateData.time_slot = time_slot
  }

  const { error } = await supabase
    .from('profiles')
    .update(updateData)
    .eq('id', user.id)

  if (error) return { error: error.message, success: false }

  revalidatePath('/dashboard/profile')
  revalidatePath('/dashboard', 'layout')
  return { error: null, success: true }
}

// ← حذفنا signedUrl من الـ return type — مش مولود هون
export async function uploadAvatar(
  formData: FormData
): Promise<{ error: string | null; success: boolean }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const file = formData.get('avatar') as File | null
  if (!file || file.size === 0)
    return { error: 'لم يتم اختيار ملف', success: false }
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type))
    return { error: 'نوع الملف غير مدعوم — يُرجى رفع JPG أو PNG', success: false }
  if (file.size > 2 * 1024 * 1024)
    return { error: 'حجم الملف يتجاوز 2MB', success: false }

  const filePath = `${user.id}/avatar.jpg`
  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(filePath, file, { upsert: true, contentType: file.type })

  if (uploadError) return { error: uploadError.message, success: false }

  const { error: updateError } = await supabase
    .from('profiles')
    .update({ avatar_url: filePath })
    .eq('id', user.id)

  if (updateError) return { error: updateError.message, success: false }

  revalidatePath('/dashboard/profile')
  revalidatePath('/dashboard', 'layout')
  return { error: null, success: true }
}

export async function uploadSignature(
  formData: FormData
): Promise<{ error: string | null; success: boolean }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'org') return { error: 'غير مصرح', success: false }

  const file = formData.get('signature') as File | null
  if (!file || file.size === 0)
    return { error: 'لم يتم اختيار ملف', success: false }
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type))
    return { error: 'نوع الملف غير مدعوم', success: false }
  if (file.size > 1 * 1024 * 1024)
    return { error: 'حجم الملف يتجاوز 1MB', success: false }

  const filePath = `${user.id}/signature.png`
  const { error: uploadError } = await supabase.storage
    .from('signatures')
    .upload(filePath, file, { upsert: true, contentType: file.type })

  if (uploadError) return { error: uploadError.message, success: false }

  const { error: updateError } = await supabase
    .from('profiles')
    .update({ signature_path: filePath })
    .eq('id', user.id)

  if (updateError) return { error: updateError.message, success: false }

  revalidatePath('/dashboard/profile')
  return { error: null, success: true }
}