// src/lib/validations.ts
import { z } from 'zod'
import { LOCATIONS, CATEGORIES, SKILLS, TIME_SLOTS } from '@/lib/constants'

// ─── Profile ──────────────────────────────────────────────────────────────────

export const updateProfileSchema = z.object({
  full_name: z.string().min(1, 'الاسم مطلوب').max(100, 'الاسم طويل جداً'),
  location: z.string().refine(
    val => (LOCATIONS as readonly string[]).includes(val),
    { message: 'الموقع غير صالح' }
  ),
  bio: z.string().max(500, 'النبذة طويلة جداً').optional().default(''),
  skills: z
    .string()
    .transform((val) => {
      try { return JSON.parse(val) as string[] } catch { return [] }
    })
    .pipe(
      z.array(
        z.string().refine(
          val => (SKILLS as readonly string[]).includes(val),
          { message: 'مهارة غير صالحة' }
        )
      )
    )
    .optional()
    .default([]),              // ← كان '[]' string — غلط، الصح []
  time_slot: z
    .string()
    .refine(
      val => val === '' || (TIME_SLOTS as readonly string[]).includes(val),
      { message: 'التوقيت غير صالح' }
    )
    .transform(val => val === '' ? null : val)
    .optional()
    .default(''),
})

// ─── Opportunity ──────────────────────────────────────────────────────────────

export const createOpportunitySchema = z.object({
  title: z.string().min(1, 'العنوان مطلوب').max(200, 'العنوان طويل جداً'),
  description: z.string().min(1, 'الوصف مطلوب').max(2000, 'الوصف طويل جداً'),
  category: z.string().refine(
    val => (CATEGORIES as readonly string[]).includes(val),
    { message: 'التصنيف غير صالح' }
  ),
  location: z.string().refine(
    val => (LOCATIONS as readonly string[]).includes(val),
    { message: 'الموقع غير صالح' }
  ),
  required_skills: z
    .string()
    .transform((val) => {
      try { return JSON.parse(val) as string[] } catch { return [] }
    })
    .pipe(
      z.array(
        z.string().refine(
          val => (SKILLS as readonly string[]).includes(val),
          { message: 'مهارة غير صالحة' }
        )
      )
    ),
  time_slot: z
    .string()
    .refine(
      val => val === '' || (TIME_SLOTS as readonly string[]).includes(val),
      { message: 'التوقيت غير صالح' }
    )
    .transform(val => val === '' ? null : val)
    .optional()
    .default(''),
  start_date: z.string().min(1, 'تاريخ البداية مطلوب'),
  end_date: z.string().min(1, 'تاريخ النهاية مطلوب'),
  status: z.string()
    .refine(val => ['draft', 'open'].includes(val), { message: 'الحالة غير صالحة' })
    .default('draft'),
})

export const updateOpportunitySchema = createOpportunitySchema.partial()

// ─── Application Action ───────────────────────────────────────────────────────

export const applicationActionSchema = z.object({
  application_id: z.string().uuid('معرّف التقديم غير صالح'),
  action: z.string().refine(
    val => ['accepted', 'rejected'].includes(val),
    { message: 'الإجراء غير صالح' }
  ),
})

// ─── Admin: Verify Org ────────────────────────────────────────────────────────

export const verifyOrgSchema = z.object({
  org_id: z.string().uuid('معرّف المنظمة غير صالح'),
  action: z.string().refine(
    val => ['approve', 'reject'].includes(val),
    { message: 'الإجراء غير صالح' }
  ),
})