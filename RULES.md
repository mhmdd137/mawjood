# Mawjood — Development Rules
> هاي القواعد تُرفق مع كل prompt على Antigravity. الـ AI يجب أن يلتزم بها في كل ملف يكتبه.

---

## 1. Stack — لا تحيد عنه

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 — App Router |
| Language | TypeScript — strict mode |
| Styling | Tailwind CSS فقط — لا inline styles |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| Storage | Supabase Storage — private buckets |
| Validation | Zod — في كل Server Action |
| PDF | @react-pdf/renderer |
| Deployment | Vercel |

**محظور تماماً:**
- لا Prisma — Supabase client مباشرة
- لا Redux — لا Context للـ state المتغير
- لا axios — fetch مباشرة أو Supabase client
- لا any library غير موجودة في القائمة أعلاه بدون موافقة

---

## 2. Component Rules

```
✅ Server Component by default — كل صفحة وكومبوننت
✅ 'use client' بس لما في: useState / useEffect / event handlers / browser APIs
✅ كل صفحة فيها loading.tsx و error.tsx
✅ استخدم React Suspense للـ streaming
❌ لا تحط fetch أو data logic مباشرة في JSX
❌ لا تحط business logic في الكومبوننت — حطها في actions أو utils
```

---

## 3. Folder Structure — ثابت لا يتغير

```
src/
├── app/                          ← الـ routes بس
│   ├── (auth)/login/page.tsx
│   ├── (auth)/register/page.tsx
│   ├── (public)/page.tsx
│   ├── (public)/opportunities/page.tsx
│   ├── (public)/opportunities/[id]/page.tsx
│   ├── (public)/verify/[code]/page.tsx
│   ├── (public)/profile/[id]/page.tsx
│   ├── dashboard/page.tsx
│   ├── dashboard/opportunities/page.tsx
│   ├── dashboard/opportunities/new/page.tsx
│   ├── dashboard/opportunities/[id]/page.tsx
│   ├── dashboard/applications/page.tsx
│   ├── dashboard/certificates/page.tsx
│   ├── dashboard/notifications/page.tsx
│   ├── dashboard/profile/page.tsx
│   ├── dashboard/admin/page.tsx
│   └── api/verify/[code]/route.ts
├── features/                     ← كل feature منفصلة
│   ├── auth/components/ + actions/
│   ├── opportunities/components/ + actions/ + hooks/
│   ├── applications/components/ + actions/
│   ├── certificates/components/ + actions/
│   ├── notifications/components/ + actions/
│   ├── profiles/components/ + actions/
│   └── admin/components/ + actions/
├── components/ui/                ← shared UI فقط
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Modal.tsx
│   ├── Avatar.tsx
│   ├── Badge.tsx
│   └── Card.tsx
├── lib/supabase/
│   ├── client.ts                 ← للـ Client Components
│   └── server.ts                 ← للـ Server Components + Actions
├── types/index.ts
└── middleware.ts
```

---

## 4. TypeScript Rules

```typescript
// ✅ دائماً explicit types
interface Props { name: string; age: number }

// ✅ type للـ unions
type Role = 'volunteer' | 'org' | 'admin'
type Status = 'pending' | 'accepted' | 'rejected'

// ❌ ممنوع any
const data: any = {} // ❌

// ✅ استخدم unknown لو مش عارف النوع
const data: unknown = {}

// ✅ كل الـ interfaces في src/types/index.ts
```

---

## 5. Supabase Rules

### Client Setup
```typescript
// src/lib/supabase/server.ts — للـ Server Components والـ Actions
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createClient() {
  const cookieStore = cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (name) => cookieStore.get(name)?.value } }
  )
}

// src/lib/supabase/client.ts — للـ Client Components فقط
import { createBrowserClient } from '@supabase/ssr'
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

### Query Rules
```typescript
// ✅ دايماً handle الـ error
const { data, error } = await supabase.from('profiles').select('*')
if (error) throw new Error(error.message)

// ✅ Signed URL للشهادات — صالح ساعة بس
const { data } = await supabase.storage
  .from('certificates')
  .createSignedUrl(filePath, 3600)

// ❌ لا تخزن الـ URL الكامل في الـ DB — خزّن الـ path بس
// ✅ file_path: 'certificates/uuid.pdf' — مش URL
```

---

## 6. Server Actions Rules

```typescript
'use server'
import { z } from 'zod'

// ✅ كل action يبدأ بـ Zod validation
const schema = z.object({
  title: z.string().min(1).max(200),
  category: z.enum(['طبي', 'تعليمي', 'لوجستي', 'دعم نفسي', 'تقني', 'إغاثي']),
})

export async function createOpportunity(formData: FormData) {
  // 1. Validate
  const parsed = schema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { error: parsed.error.flatten() }

  // 2. Auth check
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  // 3. DB operation
  const { error } = await supabase.from('opportunities').insert({...})
  if (error) return { error: error.message }

  // 4. Revalidate + redirect
  revalidatePath('/dashboard/opportunities')
  redirect('/dashboard/opportunities')
}
```

---

## 7. Predefined Lists — لا تتغير

```typescript
// src/lib/constants.ts
export const LOCATIONS = ['غزة الشمالية', 'غزة', 'دير البلح', 'خانيونس', 'رفح'] as const
export const CATEGORIES = ['طبي', 'تعليمي', 'لوجستي', 'دعم نفسي', 'تقني', 'إغاثي'] as const
export const SKILLS = ['تمريض', 'إسعافات أولية', 'تدريس', 'دعم نفسي', 'لوجستيات', 'برمجة', 'تصميم', 'إدارة', 'طبخ', 'نقل'] as const
export const TIME_SLOTS = ['morning', 'afternoon', 'flexible'] as const
```

---

## 8. Scoring Algorithm — ثابت لا يتغير

```typescript
// src/features/opportunities/utils/scoring.ts
function scoreOpportunity(opportunity: Opportunity, volunteer: Profile): number {
  let score = 0

  // التخصص — 50 نقطة
  const hasSkillMatch = opportunity.required_skills.some(
    skill => volunteer.skills.includes(skill)
  )
  if (hasSkillMatch) score += 50

  // الموقع — 30 نقطة
  if (opportunity.location === volunteer.location) score += 30

  // التاريخ — 20 نقطة
  const today = new Date()
  const startDate = new Date(opportunity.start_date)
  if (startDate >= today) score += 20

  // التوقيت — 10 نقاط
  if (
    opportunity.time_slot &&
    opportunity.time_slot !== 'flexible' &&
    volunteer.time_slot === opportunity.time_slot
  ) score += 10

  return score
}
```

**قواعد الـ scoring:**
- كل الفرص الـ `open` تظهر — مش بس اللي score فوق 0
- الفرص مرتبة من الأعلى score للأقل
- الـ scoring يصير على السيرفر في Server Component

---

## 9. RLS Policies — تُطبَّق في Supabase Dashboard

### profiles
```sql
-- SELECT: الكل
CREATE POLICY "profiles_select" ON profiles FOR SELECT USING (true);
-- UPDATE: صاحب الـ profile بس
CREATE POLICY "profiles_update" ON profiles FOR UPDATE USING (auth.uid() = id);
```

### opportunities
```sql
-- SELECT: الكل لو مفتوحة، أو المنظمة صاحبتها
CREATE POLICY "opps_select" ON opportunities FOR SELECT USING (
  status = 'open' OR org_id = auth.uid()
);
-- INSERT: منظمات موثّقة بس
CREATE POLICY "opps_insert" ON opportunities FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_verified = true AND role = 'org')
);
-- UPDATE/DELETE: صاحبة الفرصة بس
CREATE POLICY "opps_update" ON opportunities FOR UPDATE USING (org_id = auth.uid());
CREATE POLICY "opps_delete" ON opportunities FOR DELETE USING (org_id = auth.uid());
```

### applications
```sql
-- SELECT: المتطوع يشوف تقديماته، المنظمة تشوف تقديمات فرصها
CREATE POLICY "apps_select" ON applications FOR SELECT USING (
  volunteer_id = auth.uid() OR
  EXISTS (SELECT 1 FROM opportunities WHERE id = opportunity_id AND org_id = auth.uid())
);
-- INSERT: المتطوعين بس
CREATE POLICY "apps_insert" ON applications FOR INSERT WITH CHECK (
  volunteer_id = auth.uid() AND
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'volunteer')
);
-- UPDATE: المنظمة صاحبة الفرصة بس
CREATE POLICY "apps_update" ON applications FOR UPDATE USING (
  EXISTS (SELECT 1 FROM opportunities WHERE id = opportunity_id AND org_id = auth.uid())
);
```

### certificates
```sql
-- SELECT: المتطوع يشوف شهاداته
CREATE POLICY "certs_select" ON certificates FOR SELECT USING (volunteer_id = auth.uid());
-- INSERT/UPDATE: المنظمة صاحبة الفرصة
CREATE POLICY "certs_insert" ON certificates FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM applications a
    JOIN opportunities o ON a.opportunity_id = o.id
    WHERE a.id = application_id AND o.org_id = auth.uid()
  )
);
```

### notifications
```sql
-- SELECT/UPDATE: صاحب الإشعار بس
CREATE POLICY "notifs_select" ON notifications FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "notifs_update" ON notifications FOR UPDATE USING (user_id = auth.uid());
```

---

## 10. Middleware — Route Protection

```typescript
// src/middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Public routes — لا تحتاج auth
  const publicRoutes = ['/', '/opportunities', '/login', '/register', '/verify', '/profile', '/api']
  const isPublic = publicRoutes.some(route => pathname.startsWith(route))
  if (isPublic) return NextResponse.next()

  // Protected routes — تحتاج auth
  const supabase = createServerClient(...)
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Admin route — تحتاج role = admin
  if (pathname.startsWith('/dashboard/admin')) {
    const { data: profile } = await supabase
      .from('profiles').select('role').eq('id', user.id).single()
    if (profile?.role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*']
}
```

---

## 11. API Route — التحقق من الشهادة

```typescript
// src/app/api/verify/[code]/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { code: string } }
) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('certificates')
    .select(`
      *,
      volunteer:profiles!volunteer_id(full_name),
      application:applications!application_id(
        opportunity:opportunities!opportunity_id(title, org:profiles!org_id(full_name))
      )
    `)
    .eq('verification_code', params.code)
    .single()

  if (error || !data) {
    return NextResponse.json({ valid: false }, { status: 404 })
  }

  return NextResponse.json({
    valid: true,
    status: data.status,
    volunteer_name: data.volunteer.full_name,
    opportunity_title: data.application.opportunity.title,
    org_name: data.application.opportunity.org.full_name,
    hours_logged: data.hours_logged,
    issue_date: data.issue_date,
  })
}
```

---

## 12. Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=      ← للـ Server Actions اللي تحتاج bypass RLS
NEXT_PUBLIC_APP_URL=            ← للـ QR codes و verify links
```

---

## 13. Code Quality Rules

```
✅ كل component يعالج: loading state + error state + empty state
✅ aria-label على كل زر وأيقونة تفاعلية
✅ dir="rtl" على الـ html tag
✅ lang="ar" على الـ html tag
✅ كل نص ظاهر للمستخدم بالعربي
❌ لا commented-out code في الكود النهائي
❌ لا console.log في الكود النهائي
❌ لا TODO comments — اكتب الكود أو لا تكتبه
```
