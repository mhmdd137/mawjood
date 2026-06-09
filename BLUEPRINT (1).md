# Mawjood — Design Blueprint
> ملف مرجعي كامل للمشروع. كل قرار تقني تم الاتفاق عليه مسبقاً موثق هنا.

---

## 1. Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| Frontend | Next.js 15 + Tailwind CSS | App Router, TypeScript strict mode |
| Backend | Next.js Server Actions | للـ mutations |
| API Routes | Next.js API Routes | بس لصفحة verify (public endpoint) |
| Database | Supabase (PostgreSQL) | |
| Auth | Supabase Auth | |
| File Storage | Supabase Storage | Private buckets + Signed URLs |
| Deployment | Vercel | Auto-deploy من GitHub |

---

## 2. Architecture Decisions

- **Server Components by default** — كل الصفحات Server Components إلا لما في تفاعل
- **Server Actions للـ mutations** — forms, updates, deletes
- **API Route واحدة فقط** — `/api/verify/[code]` للتحقق من الشهادات (public, no login)
- **Signed URLs للشهادات** — الملفات في private bucket، URL مؤقت صالح ساعة بس
- **Feature-based folder structure** — كل feature عندها كومبوننتس وأكشنز خاصة فيها

---

## 3. Database Schema

### 3.1 `profiles`
| الحقل | النوع | ملاحظة |
|-------|-------|---------|
| `id` | `uuid` | نفس الـ id من Supabase Auth |
| `full_name` | `text` | |
| `role` | `text` | `volunteer` / `org` / `admin` |
| `location` | `text` | من قائمة محددة |
| `skills` | `text[]` | للمتطوع بس |
| `time_slot` | `text` | للمتطوع بس — `morning` / `afternoon` / `flexible` |
| `bio` | `text` | |
| `avatar_url` | `text` | path في Supabase Storage |
| `is_verified` | `boolean` | للمنظمات بس — default: false |
| `signature_path` | `text` | للمنظمات بس — path التوقيع في Supabase Storage |
| `created_at` | `timestamp` | |

### 3.2 `opportunities`
| الحقل | النوع | ملاحظة |
|-------|-------|---------|
| `id` | `uuid` | |
| `org_id` | `uuid` | FK → profiles.id |
| `title` | `text` | |
| `description` | `text` | وصف حر |
| `category` | `text` | من قائمة محددة |
| `location` | `text` | من قائمة محددة |
| `required_skills` | `text[]` | من نفس قائمة الـ skills |
| `time_slot` | `text` | `morning` / `afternoon` / `flexible` — اختياري |
| `start_date` | `date` | |
| `end_date` | `date` | |
| `status` | `text` | `draft` / `open` / `closed` / `completed` |
| `created_at` | `timestamp` | |

### 3.3 `applications`
| الحقل | النوع | ملاحظة |
|-------|-------|---------|
| `id` | `uuid` | |
| `volunteer_id` | `uuid` | FK → profiles.id |
| `opportunity_id` | `uuid` | FK → opportunities.id `ON DELETE RESTRICT` |
| `message` | `text` | رسالة تحفيزية من المتطوع |
| `status` | `text` | `pending` / `accepted` / `rejected` |
| `applied_at` | `timestamp` | |

**Constraints:**
- `UNIQUE(volunteer_id, opportunity_id)` — يمنع المتطوع من التقديم على نفس الفرصة أكثر من مرة
- `ON DELETE RESTRICT` على `opportunity_id` — يمنع حذف فرصة عليها تقديمات، يحمي سجلات المتطوعين

### 3.4 `certificates`
| الحقل | النوع | ملاحظة |
|-------|-------|---------|
| `id` | `uuid` | |
| `volunteer_id` | `uuid` | FK → profiles.id |
| `application_id` | `uuid` | FK → applications.id |
| `hours_logged` | `integer` | عدد ساعات التطوع |
| `issue_date` | `date` | |
| `file_path` | `text` | path داخل الـ bucket مش URL كامل |
| `verification_code` | `uuid` | للـ QR والتحقق العام |
| `status` | `text` | `active` / `revoked` |
| `issued_at` | `timestamp` | |

### 3.5 `notifications`
| الحقل | النوع | ملاحظة |
|-------|-------|---------|
| `id` | `uuid` | |
| `user_id` | `uuid` | FK → profiles.id |
| `type` | `text` | نوع الإشعار |
| `message` | `text` | نص الإشعار |
| `is_read` | `boolean` | default: false |
| `related_id` | `uuid` | id الفرصة أو التقديم المرتبط |
| `created_at` | `timestamp` | |

**أنواع الإشعارات (`type`):**
- `new_opportunity` — فرصة جديدة تناسب المتطوع
- `application_accepted` — تم قبول التقديم
- `application_rejected` — تم رفض التقديم
- `new_application` — متطوع جديد قدّم على فرصة المنظمة
- `org_verified` — تم التحقق من المنظمة

### 3.6 Table Relationships
- `profiles` → `opportunities` : one org → many opportunities
- `profiles` → `applications` : one volunteer → many applications
- `opportunities` → `applications` : one opportunity → many applications
- `applications` → `certificates` : one accepted application → one certificate
- `profiles` → `notifications` : one user → many notifications

---

## 4. Predefined Lists

### Locations (Gaza)
```
غزة الشمالية | غزة | دير البلح | خانيونس | رفح
```

### Categories
```
طبي | تعليمي | لوجستي | دعم نفسي | تقني | إغاثي
```

### Skills
```
تمريض | إسعافات أولية | تدريس | دعم نفسي | لوجستيات | برمجة | تصميم | إدارة | طبخ | نقل
```

---

## 5. Routes

### Public Routes (أي حدا)
```
/                          ← الصفحة الرئيسية
/opportunities             ← قائمة الفرص
/opportunities/[id]        ← تفاصيل فرصة
/verify/[code]             ← التحقق من شهادة
/profile/[id]              ← بروفايل عام لمتطوع أو منظمة
/login
/register
```

### Protected Routes (مسجلين فقط)
```
/dashboard                         ← يتغير حسب الـ role
/dashboard/opportunities           ← للمنظمة: فرصها
/dashboard/opportunities/new       ← إنشاء فرصة جديدة
/dashboard/opportunities/[id]      ← تفاصيل وإدارة فرصة
/dashboard/applications            ← للمتطوع: تقديماته / للمنظمة: المتقدمين
/dashboard/certificates            ← للمتطوع: شهاداته
/dashboard/notifications           ← للكل
/dashboard/profile                 ← للكل
/dashboard/admin                   ← للأدمن بس
```

### API Routes
```
/api/verify/[code]         ← GET: التحقق من شهادة (public, no auth)
```

---

## 6. Folder Structure

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── register/
│   │       └── page.tsx
│   ├── (public)/
│   │   ├── page.tsx
│   │   ├── opportunities/
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   ├── verify/
│   │   │   └── [code]/
│   │   │       └── page.tsx
│   │   └── profile/
│   │       └── [id]/
│   │           └── page.tsx
│   ├── dashboard/
│   │   ├── page.tsx
│   │   ├── opportunities/
│   │   │   ├── page.tsx
│   │   │   ├── new/
│   │   │   │   └── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   ├── applications/
│   │   │   └── page.tsx
│   │   ├── certificates/
│   │   │   └── page.tsx
│   │   ├── notifications/
│   │   │   └── page.tsx
│   │   ├── profile/
│   │   │   └── page.tsx
│   │   └── admin/
│   │       └── page.tsx
│   └── api/
│       └── verify/
│           └── [code]/
│               └── route.ts
├── features/
│   ├── auth/
│   │   ├── components/
│   │   │   ├── LoginForm.tsx
│   │   │   └── RegisterForm.tsx
│   │   └── actions/
│   │       └── auth.actions.ts
│   ├── opportunities/
│   │   ├── components/
│   │   │   ├── OpportunityCard.tsx
│   │   │   ├── OpportunityList.tsx
│   │   │   ├── OpportunityFilters.tsx
│   │   │   └── OpportunityForm.tsx
│   │   ├── hooks/
│   │   │   └── useFilters.ts
│   │   └── actions/
│   │       └── opportunities.actions.ts
│   ├── applications/
│   │   ├── components/
│   │   │   ├── ApplicationCard.tsx
│   │   │   └── ApplicationForm.tsx
│   │   └── actions/
│   │       └── applications.actions.ts
│   ├── certificates/
│   │   ├── components/
│   │   │   ├── CertificateCard.tsx
│   │   │   └── VerificationResult.tsx
│   │   └── actions/
│   │       └── certificates.actions.ts
│   ├── notifications/
│   │   ├── components/
│   │   │   ├── NotificationItem.tsx
│   │   │   └── NotificationList.tsx
│   │   └── actions/
│   │       └── notifications.actions.ts
│   ├── profiles/
│   │   ├── components/
│   │   │   ├── ProfileForm.tsx
│   │   │   ├── VolunteerProfile.tsx
│   │   │   └── OrgProfile.tsx
│   │   └── actions/
│   │       └── profiles.actions.ts
│   └── admin/
│       ├── components/
│       │   ├── StatsCard.tsx
│       │   ├── OrgVerificationCard.tsx
│       │   └── RecentActivity.tsx
│       └── actions/
│           └── admin.actions.ts
├── components/
│   └── ui/
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Modal.tsx
│       ├── Avatar.tsx
│       ├── Badge.tsx
│       └── Card.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   └── server.ts
│   └── utils.ts
├── types/
│   └── index.ts
└── middleware.ts
```

---

## 7. Authentication Flow

### طريقتا التسجيل:
1. **Email + Password** — تقليدي
2. **Google OAuth** — مع صفحة إكمال البيانات بعدها

### خطوات التسجيل:
```
Email/Password أو Google OAuth
        ↓
Supabase Auth يخلق الـ user ويعطيه id
        ↓
يتحقق: هل في profile موجود؟
        ↓
لو لا → صفحة "أكمل تسجيلك" (role + location + skills)
لو نعم → /dashboard مباشرة
```

### بعد إكمال البروفايل:
- `volunteer` → `/dashboard` مباشرة
- `org` → `/dashboard` مع رسالة "حسابك قيد المراجعة"

---

## 8. RLS Policies

### `profiles`
- `SELECT` → الكل
- `UPDATE` → بس لو `id = auth.uid()`

### `opportunities`
- `SELECT` → الكل لو `status = 'open'` — أو المنظمة صاحبتها تشوف كل فرصها
- `INSERT` → بس المنظمات الـ `is_verified = true`
- `UPDATE` / `DELETE` → بس لو `org_id = auth.uid()`

### `applications`
- `SELECT` → المتطوع لو `volunteer_id = auth.uid()` — المنظمة لو الفرصة تبعتها
- `INSERT` → بس المتطوع
- `UPDATE` → بس المنظمة صاحبة الفرصة، وبس على حقل `status`

### `certificates`
- `SELECT` → المتطوع لو `volunteer_id = auth.uid()`
- `INSERT` → المنظمة صاحبة الفرصة بس
- `UPDATE` → المنظمة بس، عشان تعدل `status` لـ `revoked`
- التحقق العام → عن طريق API Route مش RLS

### `notifications`
- `SELECT` → بس لو `user_id = auth.uid()`
- `INSERT` → عن طريق Server Actions بـ service role key بس
- `UPDATE` → بس لو `user_id = auth.uid()`، وبس على `is_read`

---

## 9. Filtering & Scoring Logic

### المعايير والنقاط:
| المعيار | النقاط | المنطق |
|---------|--------|--------|
| التخصص | 50 | لو في أي تطابق واحد بين skills المتطوع و required_skills الفرصة |
| الموقع | 30 | لو location المتطوع = location الفرصة |
| التاريخ | 20 | لو start_date الفرصة >= اليوم |
| التوقيت | 10 | لو time_slot المتطوع = time_slot الفرصة (يُتجاهل لو الفرصة `flexible`) |

### الكود:
```typescript
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

// الترتيب
const scored = opportunities
  .map(op => ({ ...op, score: scoreOpportunity(op, volunteer) }))
  .sort((a, b) => b.score - a.score)
```

### ملاحظات:
- كل الفرص الـ `open` تظهر — مش بس اللي score فوق 0
- الفرص مرتبة من الأعلى score للأقل
- الـ scoring يصير على السيرفر في Server Component

---

## 10. Certificate Generation

### الخطوات:
```
المنظمة تسجل الساعات وتضغط "إصدار شهادة"
        ↓
Server Action:
  1. يجيب بيانات المتطوع + الفرصة + المنظمة
  2. يولد UUID جديد (verification_code)
  3. يبني الـ PDF بـ @react-pdf/renderer
  4. يرفع الـ PDF لـ Supabase Storage (private bucket)
  5. يحفظ في جدول certificates
  6. يبعت إشعار للمتطوع
```

### محتوى الشهادة:
```
┌─────────────────────────────────────┐
│           [لوجو Mawjood]            │
│         شهادة تطوع                  │
│  يُشهد بأن: [اسم المتطوع]          │
│  شارك في: [عنوان الفرصة]           │
│  المنظمة: [اسم المنظمة]            │
│  المدة: [X] ساعة                   │
│  التاريخ: [issue_date]             │
│  [توقيع المنظمة]                   │
│  [QR Code]  رمز التحقق: [UUID]     │
└─────────────────────────────────────┘
```

### تحميل الشهادة (Signed URL):
```typescript
const { data } = await supabase.storage
  .from('certificates')
  .createSignedUrl(certificate.file_path, 3600) // صالح ساعة
```

### التحقق العام (بدون login):
```
GET /api/verify/[code]
  → SELECT من certificates WHERE verification_code = code
  → يعرض: اسم المتطوع، المنظمة، الفرصة، الساعات، التاريخ، الـ status
```

### المكتبة:
```
@react-pdf/renderer
```

---

## 11. Component Breakdown

### `/` — الصفحة الرئيسية
```
page.tsx (Server Component) ← يجيب آخر 3 فرص مفتوحة
├── HeroSection
├── FeaturesSection
├── LatestOpportunities
│   └── OpportunityCard       ← reuse من features/opportunities
└── CTASection
```

---

### `/opportunities` — قائمة الفرص
```
page.tsx (Server Component) ← يقرأ searchParams ويجيب الفرص مع الـ scoring
├── OpportunityFilters (Client Component) ← يقرأ ويحدث الـ URL
│   └── filters: category | location | time_slot
└── OpportunityList (Server Component)
    └── OpportunityCard
```

**ملاحظة:** الـ filtering يصير عن طريق URL params — مثال: `/opportunities?category=طبي&location=غزة`

---

### `/opportunities/[id]` — تفاصيل فرصة
```
page.tsx (Server Component) ← يجيب بيانات الفرصة + بيانات المنظمة
├── OpportunityDetails        ← العنوان، الوصف، التاريخ، الموقع، المهارات المطلوبة
├── OrgCard                   ← اسم المنظمة + صورتها + رابط لـ /profile/[id]
└── ApplyButton (Client Component)
    ← مش مسجل → يروح على /login
    ← مسجل وقدّم مسبقاً → disabled "قدّمت على هاي الفرصة"
    ← مسجل ولم يقدم → يفتح modal
        └── ApplicationModal (Client Component) ← حقل الرسالة + زر إرسال
```

---

### `/verify/[code]` — التحقق من شهادة
```
page.tsx (Server Component) ← يجيب البيانات من /api/verify/[code]
└── VerificationResult
    ← شهادة active → اسم المتطوع + المنظمة + الفرصة + الساعات + التاريخ + شارة "✓ موثّقة"
    ← شهادة غير موجودة أو revoked → رسالة "هاي الشهادة غير صالحة"
```

**ملاحظة:** لا يوجد زر تحميل — صفحة الـ verify للإثبات فقط، التحميل من `/dashboard/certificates`

---

### `/profile/[id]` — البروفايل العام
```
page.tsx (Server Component) ← يجيب بيانات الـ profile حسب الـ id
├── VolunteerProfile          ← صورة + اسم + موقع + بايو + مهارات
└── OrgProfile                ← صورة + اسم + موقع + بايو + شارة "موثّقة ✓" إن وجدت
```

---

### `/login`
```
page.tsx
└── LoginForm (Client Component) ← email/password + Google OAuth
```

---

### `/register`
```
page.tsx
└── RegisterForm (Client Component) ← multi-step
    ├── Step 1: RoleSelect    ← متطوع / منظمة
    └── Step 2: Details       ← يتغير حسب الـ role (اسم + موقع + مهارات)
```

---

### `/dashboard` — الرئيسية بعد الـ login
```
page.tsx (Server Component) ← يجيب البيانات حسب الـ role
├── VolunteerOverview
│   ├── StatsCards            ← عدد التقديمات + عدد الشهادات
│   └── LatestOpportunities   ← reuse OpportunityCard (مع الـ scoring)
│       └── EmptyState        ← "ما قدّمت على أي فرصة بعد" + زر "استكشف الفرص"
├── OrgOverview
│   └── StatsCards            ← فرص مفتوحة + متقدمين جدد + آخر تقديم
└── AdminOverview
    └── StatsCards            ← إحصائيات المنصة
```

---

### `/dashboard/opportunities` — فرص المنظمة
```
page.tsx (Server Component) ← يجيب فرص المنظمة
├── NewOpportunityButton      ← يروح على /dashboard/opportunities/new
└── OrgOpportunityList
    └── OrgOpportunityCard    ← العنوان + status + عدد المتقدمين + أزرار (عدّل / غيّر status / احذف)
```

---

### `/dashboard/opportunities/new` — إنشاء فرصة جديدة
```
page.tsx (Server Component)
└── OpportunityForm (Client Component)
    ← بعد النشر → يرجع على /dashboard/opportunities
```

**الحقول:** العنوان | الوصف | الـ category | الموقع | المهارات المطلوبة | الـ time_slot | تاريخ البداية والنهاية | الـ status (draft/open)

---

### `/dashboard/opportunities/[id]` — إدارة فرصة
```
page.tsx (Server Component) ← يجيب بيانات الفرصة + المتقدمين
└── OpportunityTabs (Client Component)
    ├── Tab 1: OpportunityForm    ← reuse (edit mode)
    └── Tab 2: ApplicationsList
        └── ApplicationCard       ← اسم المتطوع + مهاراته + رسالته + أزرار قبول/رفض
```

---

### `/dashboard/applications` — التقديمات
```
page.tsx (Server Component) ← يجيب البيانات حسب الـ role
├── VolunteerApplicationsList
│   └── ApplicationCard           ← عنوان الفرصة + المنظمة + الـ status
└── OrgApplicationsList
    └── OpportunityApplicationsGroup  ← لكل فرصة وتحتها متقدميها
        └── ApplicationCard           ← اسم المتطوع + رسالته + الـ status
```

---

### `/dashboard/certificates` — الشهادات (للمتطوع)
```
page.tsx (Server Component) ← يجيب شهادات المتطوع
└── CertificatesList
    └── CertificateCard (Client Component)
        ← عنوان الفرصة + المنظمة + الساعات + التاريخ + الـ status
        ← زر "تحميل" → يولد Signed URL (صالح ساعة)
        ← زر "مشاركة" → يكوبي رابط /verify/[code]
```

---

### `/dashboard/notifications` — الإشعارات
```
page.tsx (Server Component) ← يجيب إشعارات المستخدم
└── NotificationList (Client Component) ← عشان markAsRead
    ├── "اقرأ الكل" Button
    └── NotificationItem
        ← مقروء / غير مقروء (highlighted)
        ← عند الضغط → يروح على الصفحة المرتبطة (related_id)
```

---

### `/dashboard/profile` — تعديل البروفايل
```
page.tsx (Server Component) ← يجيب بيانات المستخدم الحالي
└── ProfileForm (Client Component)
    ├── AvatarUpload              ← للكل
    ├── Fields: اسم + موقع + بايو + مهارات (للمتطوع)
    └── SignatureUpload            ← للمنظمات بس
```

---

### `/dashboard/admin` — لوحة الأدمن
```
page.tsx (Server Component) ← يجيب الإحصائيات + المنظمات + النشاط الأخير
├── StatsCards                    ← متطوعين + منظمات + فرص + تقديمات + شهادات
├── PendingOrgsList
│   └── OrgVerificationCard       ← اسم المنظمة + البايو + أزرار قبول/رفض
├── VerifiedOrgsList
│   └── OrgVerificationCard       ← زر "إلغاء التوثيق"
└── RecentActivity
    ├── RecentOpportunities
    ├── RecentApplications
    └── RecentCertificates
```

---

## 12. TypeScript Interfaces

```typescript
// src/types/index.ts

// Base Types
interface Profile {
  id: string
  full_name: string
  role: 'volunteer' | 'org' | 'admin'
  location: string
  skills: string[]
  time_slot: 'morning' | 'afternoon' | 'flexible' | null
  bio: string
  avatar_url: string | null
  signature_path: string | null
  is_verified: boolean
  created_at: string
}

interface Opportunity {
  id: string
  org_id: string
  title: string
  description: string
  category: string
  location: string
  required_skills: string[]
  time_slot: 'morning' | 'afternoon' | 'flexible' | null
  start_date: string
  end_date: string
  status: 'draft' | 'open' | 'closed' | 'completed'
  created_at: string
}

interface Application {
  id: string
  volunteer_id: string
  opportunity_id: string
  message: string
  status: 'pending' | 'accepted' | 'rejected'
  applied_at: string
}

interface Certificate {
  id: string
  volunteer_id: string
  application_id: string
  hours_logged: number
  issue_date: string
  file_path: string
  verification_code: string
  status: 'active' | 'revoked'
  issued_at: string
}

interface Notification {
  id: string
  user_id: string
  type: 'new_opportunity' | 'application_accepted' | 'application_rejected' | 'new_application' | 'org_verified'
  message: string
  is_read: boolean
  related_id: string | null
  created_at: string
}

// Extended Types
interface OpportunityWithOrg extends Opportunity {
  org: Pick<Profile, 'id' | 'full_name' | 'avatar_url'>
}

interface ApplicationWithDetails extends Application {
  volunteer: Pick<Profile, 'id' | 'full_name' | 'avatar_url' | 'skills' | 'location'>
  opportunity: Pick<Opportunity, 'id' | 'title'>
}
```

---

## 13. Server Actions

> **ملاحظة:** كل Server Action يستخدم **Zod** للتحقق من البيانات قبل إرسالها لقاعدة البيانات.

### `auth.actions.ts`
```typescript
signUpWithEmail(email, password)
completeProfile(role, full_name, location, skills) // للـ Email والـ Google
signInWithGoogle()
signInWithEmail(email, password)
signOut()
```

### `opportunities.actions.ts`
```typescript
getOpportunities(volunteerProfile)        // مع الـ scoring
getOpportunityById(id)
getOrgOpportunities()                     // للمنظمة في الداشبورد
createOpportunity(data)
updateOpportunity(id, data)
updateOpportunityStatus(id, status)
deleteOpportunity(id)
```

### `applications.actions.ts`
```typescript
checkExistingApplication(opportunity_id) → boolean
createApplication(opportunity_id, message)
getMyApplications()
getApplicationsByOpportunity(opportunity_id)
updateApplicationStatus(application_id, status)
```

### `certificates.actions.ts`
```typescript
getCertificateByApplication(application_id) → Certificate | null
issueCertificate(application_id, hours_logged)
getMyCertificates()
getCertificateDownloadUrl(file_path)
verifyCertificate(verification_code)
revokeCertificate(certificate_id)
```

### `notifications.actions.ts`
```typescript
getUnreadCount() → number
getMyNotifications()
markAsRead(notification_id)
markAllAsRead()
sendNotification(user_id, type, message, related_id) // داخلي بس
```

### `profiles.actions.ts`
```typescript
getMyProfile()
getProfileById(id)
updateProfile(data)
uploadAvatar(file)
uploadSignature(file) // للمنظمات بس
```

### `admin.actions.ts`
```typescript
getPendingOrganizations()
approveOrganization(profile_id)
rejectOrganization(profile_id)
revokeOrganization(profile_id)
getPlatformStats() → {
  totalVolunteers: number
  totalOrgs: number
  totalOpportunities: number
  totalApplications: number
  totalCertificates: number
}
getRecentActivity() → {
  recentOpportunities: Opportunity[]
  recentApplications: ApplicationWithDetails[]
  recentCertificates: Certificate[]
}
```
