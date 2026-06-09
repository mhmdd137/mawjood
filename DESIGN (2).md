---
name: Mawjood Design System
colors:
  surface: '#fcf8ff'
  surface-dim: '#dcd8e0'
  surface-bright: '#fcf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f2fa'
  surface-container: '#f0ecf4'
  surface-container-high: '#ebe7ef'
  surface-container-highest: '#e5e1e9'
  on-surface: '#1c1b21'
  on-surface-variant: '#474551'
  inverse-surface: '#313036'
  inverse-on-surface: '#f3eff7'
  outline: '#787582'
  outline-variant: '#c8c4d3'
  surface-tint: '#5a53a9'
  primary: '#251b72'
  on-primary: '#ffffff'
  primary-container: '#3c3489'
  on-primary-container: '#a9a2ff'
  inverse-primary: '#c5c0ff'
  secondary: '#a8380f'
  on-secondary: '#ffffff'
  secondary-container: '#fd7549'
  on-secondary-container: '#661a00'
  tertiary: '#452200'
  on-tertiary: '#ffffff'
  tertiary-container: '#653400'
  on-tertiary-container: '#e49d62'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e4dfff'
  primary-fixed-dim: '#c5c0ff'
  on-primary-fixed: '#150264'
  on-primary-fixed-variant: '#423a8f'
  secondary-fixed: '#ffdbd0'
  secondary-fixed-dim: '#ffb59e'
  on-secondary-fixed: '#3a0b00'
  on-secondary-fixed-variant: '#852400'
  tertiary-fixed: '#ffdcc3'
  tertiary-fixed-dim: '#ffb77d'
  on-tertiary-fixed: '#2f1500'
  on-tertiary-fixed-variant: '#6c3a05'
  background: '#fcf8ff'
  on-background: '#1c1b21'
  surface-variant: '#e5e1e9'
  indigo-900: '#26215C'
  indigo-800: '#3C3489'
  indigo-600: '#534AB7'
  indigo-200: '#AFA9EC'
  indigo-50: '#EEEDFE'
  coral-600: '#993C1D'
  coral-400: '#D85A30'
  coral-200: '#F0997B'
  coral-50: '#FAECE7'
  status-open-bg: '#E1F5EE'
  status-open-text: '#0F6E56'
  status-completed-bg: '#FAEEDA'
  status-completed-text: '#854F0B'
  status-closed-bg: '#FCEBEB'
  status-closed-text: '#A32D2D'
  bg-surface: '#FFFFFF'
  bg-muted: '#F9F9F9'
  text-primary: '#1A1A1A'
  text-secondary: '#666666'
  border-tertiary: '#E5E5E5'
typography:
  h1:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '500'
    lineHeight: '1.4'
  h2:
    fontFamily: Plus Jakarta Sans
    fontSize: 22px
    fontWeight: '500'
    lineHeight: '1.4'
  h3:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '500'
    lineHeight: '1.4'
  body:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  small:
    fontFamily: Plus Jakarta Sans
    fontSize: 13px
    fontWeight: '400'
    lineHeight: '1.5'
  caption:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: '1.4'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  max-width: 1200px
  page-padding: 24px
  section-v: 48px
  grid-gap: 16px
  component-gap: 10px
---

# Mawjood — Design System Reference
> ملف مرجعي ثابت للهوية البصرية. يُرفق مع كل برومبت صفحة على Google Stitch.

---

## 1. Identity

- **Platform name:** Mawjood (موجود)
- **Tagline:** منصة التطوع في غزة
- **Language:** Arabic — RTL direction throughout
- **Tone:** Warm, trustworthy, human — not corporate

---

## 2. Color System

### Primary — Indigo
| Token | Hex | Usage |
|-------|-----|-------|
| `indigo-900` | `#26215C` | Dark backgrounds, hover states |
| `indigo-800` | `#3C3489` | Primary buttons, headings accent, logo |
| `indigo-600` | `#534AB7` | Mid borders, secondary elements |
| `indigo-200` | `#AFA9EC` | Light borders, disabled states |
| `indigo-50` | `#EEEDFE` | Surface backgrounds, CTA banners |

### Accent — Coral
| Token | Hex | Usage |
|-------|-----|-------|
| `coral-600` | `#993C1D` | Dark coral text |
| `coral-400` | `#D85A30` | CTA buttons (issue certificate, key actions) |
| `coral-200` | `#F0997B` | Light coral elements |
| `coral-50` | `#FAECE7` | Coral surface backgrounds |

### Status Colors
| Status | Background | Text | Usage |
|--------|-----------|------|-------|
| Open (مفتوحة) | `#E1F5EE` | `#0F6E56` | Open opportunities |
| Draft (مسودة) | `var(--bg-secondary)` | `var(--text-secondary)` | Draft items |
| Completed (مكتملة) | `#FAEEDA` | `#854F0B` | Completed items |
| Closed (مغلقة) | `#FCEBEB` | `#A32D2D` | Closed items |
| Verified (موثّقة) | `#EEEDFE` | `#3C3489` | Verified organizations |
| Pending (قيد المراجعة) | `#FAECE7` | `#993C1D` | Pending review |

### Neutral
- Backgrounds: white / light gray surface / page background
- Text: primary (near black) / secondary (muted gray) / tertiary (hints)
- Borders: 0.5px — tertiary (subtle) / secondary (hover) / primary (focus)

---

## 3. Typography

- **Font:** System Arabic sans-serif (or Noto Sans Arabic / IBM Plex Arabic)
- **Weights:** 400 (regular) and 500 (medium) only — never 600 or 700
- **Case:** Sentence case always — never ALL CAPS or Title Case

| Level | Size | Weight | Usage |
|-------|------|--------|-------|
| H1 | 32px | 500 | Hero headings |
| H2 | 20–22px | 500 | Section titles |
| H3 | 18px | 500 | Card titles, subsections |
| Body | 15–16px | 400 | Paragraphs, descriptions |
| Small | 13px | 400 | Metadata, captions |
| Caption | 11–12px | 400 | Labels, timestamps, hints |

---

## 4. Style — Warm Minimal

### Core Rules
- **No gradients** — flat solid fills only
- **No drop shadows** — use 0.5px borders for depth
- **No glassmorphism** — clean opaque surfaces
- **Generous whitespace** — breathing room between sections
- **Transitions:** `150ms ease` on hover — subtle, never flashy

### Cards
```
background: white
border: 0.5px solid (tertiary border color)
border-radius: 12px
padding: 16px 20px
```
For opportunity cards: add `border-right: 3px solid` with color reflecting match score intensity.

### Buttons
```
border-radius: 8px
border: 0.5px solid
font-size: 13px
font-weight: 500
padding: 9px 20px
```
- **Primary:** indigo-800 background, white text, indigo-900 border
- **Outline:** transparent background, indigo-800 text, indigo-600 border
- **Danger/CTA:** coral-400 background, white text, coral-600 border
- **Ghost:** transparent background, secondary text, secondary border

### Badges / Pills
```
border-radius: 99px
font-size: 11px
font-weight: 500
padding: 3px 10px
```
Use status color pairs from the Status Colors table above.

### Form Inputs
```
border: 0.5px solid (secondary border)
border-radius: 8px
padding: 9px 14px
font-size: 14px
```
Focus state: indigo-600 border, no glow.

### Match Score Indicator (Progress Bar)
```
height: 5px
background: light gray surface
border-radius: 99px
fill: indigo-600 → indigo-800
```
- Show percentage label (e.g., 80%) in indigo-800 **above** the bar, right-aligned
- Place score at the **top of the card** as a small pill badge — NOT at the bottom
- Card border-right intensity reflects score:
  - 80–100% → indigo-600 border (3px)
  - 40–79% → indigo-200 border (3px)
  - 0–39% → gray border (3px), card opacity 0.7

### NEVER do this
- No dark/colored card backgrounds (no indigo-filled cards in a grid of white cards)
- No stock photography or placeholder images inside cards
- No features outside the project scope (no Messages, no Chat, no real-time features)

---

## 5. Logo

**Mark:** Rounded square (border-radius: 14px), indigo-800 background.
**Icon inside:** Concentric circles (outer: 20% opacity, mid: 45% opacity, center: filled white) with a small person silhouette in indigo inside the center circle.
**Wordmark:** "موجود" — 15–16px, weight 500, color: primary text
**Subtitle (optional):** "منصة التطوع" — 13px, secondary text

---

## 6. Layout & Spacing

- **Max content width:** 1200px, centered
- **Page padding:** 24px horizontal
- **Section padding:** 36–52px vertical
- **Grid gaps:** 12–16px
- **Component gaps:** 8–12px internal

### Navbar
Height: ~56px. Logo right, nav links center, action buttons left (RTL).

### Section Structure
```
Section label (11px, uppercase, tertiary) → optional
H2 title (18–20px)
Content grid / list
```

---

## 7. Component Patterns

### Opportunity Card
```
[Title]                    [Status badge]
[Org name · Location]
[Skill badges]
[Date · Time slot]         [Match %]
[Progress bar]
```
Border-right: 3px, color = match intensity (see score rules above).

### Stat Card
```
background: light gray surface
border-radius: 8px
padding: 14px 16px
[Large number — indigo-800 — 22px/500]
[Label — secondary text — 12px]
```

### Notification Item
```
[Dot indicator (unread = indigo, read = gray)]
[Message text]
[Timestamp — caption]
```
Unread: slightly highlighted background.

### Certificate Card
```
[Opportunity title]
[Org name · Hours · Date]
[Status badge]
[Download button] [Share link button]
```

---

## 8. Page-specific Notes

### Public pages (/, /opportunities, /opportunities/[id], /verify/[code])
- No auth required
- Show match scores only if user is logged in — otherwise show opportunity details only
- Verify page: show certificate details + green "✓ موثّقة" badge if valid, red warning if revoked/not found

### Dashboard pages
- **Layout:** Fixed sidebar on the RIGHT (RTL) — width ~220px — content area fills the rest
- **Sidebar contains:** Logo at top → nav items with icons → role label at bottom
- **Sidebar nav item style:** Icon + label, active = indigo-50 background + indigo-800 text + 3px right border in indigo-800
- **Content area:** Search bar full-width at top → filter pills below → results grid
- Role-aware: volunteer / org / admin see different nav items
- Volunteer: stats + matched opportunities
- Org: stats + pending applications
- Admin: platform stats + pending org verifications

### Auth pages (/login, /register)
- Centered card layout
- Clean, minimal — just the form
- Register: multi-step (Step 1: role selection, Step 2: details based on role)

---

## 9. RTL Reminders

- All text right-aligned by default
- Icons and arrows flip horizontally (→ becomes ←)
- Card border accent on the **right** side (border-right)
- Sidebar on the **right** side
- Form labels above inputs, right-aligned
- Progress bars fill from **right to left**


## 10. ملاحظات التطوير (مُستخلصة من جلسة التصميم)

> هاي الملاحظات تم رصدها أثناء مراجعة كل صفحة على Stitch — يجب تطبيقها في التطوير.

### Sidebar
- يجب أن يكون **identical** في كل صفحات نفس الـ role — نفس الـ nav items، نفس الترتيب
- **Volunteer nav:** الرئيسية | استكشاف الفرص | تقديماتي | شهاداتي | الإشعارات | الإعدادات | تسجيل الخروج
- **Org nav:** الرئيسية | فرصي | المتقدمون | الإشعارات | الإعدادات | تسجيل الخروج
- **Admin nav:** لوحة التحكم | المتطوعون | المنظمات | الفرص | الإشعارات | تسجيل الخروج

### قائمة المهارات
- **ثابتة من الـ blueprint فقط — لا تُضاف مهارات من خارجها:**
`تمريض | إسعافات أولية | تدريس | دعم نفسي | لوجستيات | برمجة | تصميم | إدارة | طبخ | نقل`

### النصوص الثابتة
- Footer فورم إنشاء الفرصة: `"سيتم إشعار المتطوعين المناسبين تلقائياً"`
- Placeholder عنوان الفرصة: `"مثال: مساعد طبي في العيادة المتنقلة"`

### ألوان الـ Status Badges
| Status | Background | Text |
|--------|-----------|------|
| مفتوحة | `#E1F5EE` | `#0F6E56` |
| مكتملة | `#FAEEDA` | `#854F0B` |
| مغلقة | `#FCEBEB` | `#A32D2D` |
| قيد المراجعة | `#FAECE7` | `#993C1D` |
| موثّقة | `#EEEDFE` | `#3C3489` |

### عناصر تُحذف (اخترعها Stitch — ليست في الـ blueprint)
- كارد "سفير التطوع المتميز" في صفحة الإعدادات
- الـ stats row (أيام متبقية، نسبة القبول) في صفحة إدارة الفرصة
- زر "+ أخرى" في قائمة المهارات
- "جاري مزامنة البيانات مع السحابة"
- أي nav item غير موجود في القوائم أعلاه (جدولي، الرسائل، المساعدة...)

### Timestamps
- تُعرض بالعربي دائماً: `"منذ ساعتين"` لا `"2 hours ago"`

### Stats Cards
- حجم الأرقام في الـ stats: `22px/500` — ليس أكبر من هيك

### RTL
- الـ navbar: اللوجو على اليمين دائماً
- الـ border accent على الكاردات: `border-right` لا `border-left`
- Progress bars تمتلئ من اليمين لليسار

---

## 11. Dashboard Charts (يُنفَّذ في التطوير — ليس في Stitch)

> **ملاحظة مهمة:** صفحات Stitch تعرض placeholder cards فقط للـ charts. التنفيذ الفعلي يكون في مرحلة التطوير باستخدام مكتبة Recharts.

### المبدأ العام
- كل chart في كارد مستقلة: white bg، 0.5px border، 12px radius، padding 20px 24px
- عنوان الكارد: 15px/500، right-aligned، margin-bottom 16px
- لا gradients داخل الـ charts —ألوان solid فقط
- Tooltip مخصص بنفس style الـ cards (white bg، 0.5px border، 8px radius)
- Animation عند التحميل: `animationDuration={800}`
- المكتبة: **Recharts** — `npm install recharts`

---

### Chart 1 — للمتطوع: "حالة تقديماتي"
**النوع:** Donut Chart (PieChart + Pie مع innerRadius)

```tsx
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts'

const data = [
  { name: 'مقبول', value: 3, color: '#0F6E56' },
  { name: 'قيد المراجعة', value: 5, color: '#993C1D' },
  { name: 'مرفوض', value: 2, color: '#A32D2D' },
]

<PieChart width={280} height={220}>
  <Pie
    data={data}
    cx={140} cy={100}
    innerRadius={60} outerRadius={90}
    paddingAngle={3}
    dataKey="value"
    animationDuration={800}
  >
    {data.map((entry, index) => (
      <Cell key={index} fill={entry.color} />
    ))}
  </Pie>
  <Tooltip
    contentStyle={{
      background: 'white',
      border: '0.5px solid #E5E5E5',
      borderRadius: 8,
      fontSize: 13,
      direction: 'rtl'
    }}
  />
</PieChart>
```

**العنصر في النص (Custom Label):**
- الرقم الكلي للتقديمات — 22px/500 — #3C3489
- كلمة "تقديم" — 12px — secondary

**Legend:** أسفل الـ chart، 3 نقاط ملونة مع النص — 12px secondary

---

### Chart 2 — للمنظمة: "المتقدمون على فرصي"
**النوع:** Horizontal Bar Chart (BarChart مع layout="vertical")

```tsx
import { BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts'

const data = [
  { name: 'دعم نفسي للأسر النازحة', value: 12 },
  { name: 'تدريس الأطفال في المخيمات', value: 8 },
  { name: 'جلسات دعم جماعية', value: 5 },
  { name: 'توزيع مواد إغاثية', value: 3 },
]

<BarChart
  width={500} height={220}
  data={data}
  layout="vertical"
  margin={{ right: 16, left: 8 }}
>
  <XAxis type="number" tick={{ fontSize: 12 }} />
  <YAxis
    type="category"
    dataKey="name"
    width={180}
    tick={{ fontSize: 12, textAnchor: 'end' }}
  />
  <Tooltip
    contentStyle={{
      background: 'white',
      border: '0.5px solid #E5E5E5',
      borderRadius: 8,
      fontSize: 13,
      direction: 'rtl'
    }}
  />
  <Bar dataKey="value" radius={[0, 4, 4, 0]} animationDuration={800}>
    {data.map((_, index) => (
      <Cell
        key={index}
        fill={index === 0 ? '#3C3489' : '#AFA9EC'}
      />
    ))}
  </Bar>
</BarChart>
```

**ملاحظة:** الـ bar الأول (أكثر متقدمين) بلون indigo-800، باقيهم indigo-200 — يبرز الفرصة الأكثر اهتماماً.

---

### Chart 3 — للأدمن: "نمو المنصة"
**النوع:** Area Chart (AreaChart مع خطّان)

```tsx
import { AreaChart, Area, XAxis, YAxis, Tooltip, Legend } from 'recharts'

const data = [
  { month: 'نوفمبر', volunteers: 180, opportunities: 42 },
  { month: 'ديسمبر', volunteers: 195, opportunities: 55 },
  { month: 'يناير', volunteers: 210, opportunities: 61 },
  { month: 'فبراير', volunteers: 220, opportunities: 68 },
  { month: 'مارس', volunteers: 232, opportunities: 74 },
  { month: 'أبريل', volunteers: 240, opportunities: 85 },
]

<AreaChart
  width={600} height={240}
  data={data}
  margin={{ top: 8, right: 16, left: 0, bottom: 0 }}
>
  <defs>
    <linearGradient id="colorVolunteers" x1="0" y1="0" x2="0" y2="1">
      <stop offset="5%" stopColor="#3C3489" stopOpacity={0.15}/>
      <stop offset="95%" stopColor="#3C3489" stopOpacity={0}/>
    </linearGradient>
    <linearGradient id="colorOpportunities" x1="0" y1="0" x2="0" y2="1">
      <stop offset="5%" stopColor="#D85A30" stopOpacity={0.15}/>
      <stop offset="95%" stopColor="#D85A30" stopOpacity={0}/>
    </linearGradient>
  </defs>
  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
  <YAxis tick={{ fontSize: 12 }} />
  <Tooltip
    contentStyle={{
      background: 'white',
      border: '0.5px solid #E5E5E5',
      borderRadius: 8,
      fontSize: 13,
      direction: 'rtl'
    }}
  />
  <Area
    type="monotone"
    dataKey="volunteers"
    name="متطوعون"
    stroke="#3C3489"
    strokeWidth={2}
    fill="url(#colorVolunteers)"
    animationDuration={800}
  />
  <Area
    type="monotone"
    dataKey="opportunities"
    name="فرص"
    stroke="#D85A30"
    strokeWidth={2}
    fill="url(#colorOpportunities)"
    animationDuration={800}
  />
</AreaChart>
```

**Legend:** نقطتان ملونتان — indigo للمتطوعين، coral للفرص — 12px secondary

---

### Placeholder في Stitch (بدل الـ chart الحقيقي)
عند التصميم في Stitch، كل chart يتمثل بـ:
```
كارد بيضاء — 12px radius — 0.5px border
عنوان الكارد يمين (15px/500)
مستطيل رمادي فاتح (background: #F5F4FA، border-radius: 8px، height: 180px)
نص في المنتصف: "📊 رسم بياني — يُنفَّذ في التطوير" (13px، tertiary color)
```

---

### مكان الـ charts في الداشبورد
- **بعد** الـ stats row مباشرة
- **قبل** الـ lists (تقديمات، متقدمون، نشاط)
- عرض الكارد: كامل العرض أو نصف العرض حسب الـ chart

| Role | Chart | العرض |
|------|-------|-------|
| متطوع | حالة تقديماتي (Donut) | نصف العرض — جنب stats إضافية |
| منظمة | المتقدمون على فرصي (Bar) | كامل العرض |
| أدمن | نمو المنصة (Area) | كامل العرض |
