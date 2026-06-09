import React from 'react'

const STATS = [
  { value: '+240', label: 'متطوع مسجل' },
  { value: '+38', label: 'منظمة موثّقة' },
  { value: '+120', label: 'شهادة صادرة' },
] as const

const TESTIMONIAL = {
  quote: 'وجدت فرصتي الأولى في التطوع عبر موجود، وكانت تجربة غيّرت حياتي.',
  name: 'أحمد الكفارنة',
  role: 'متطوع في خانيونس',
} as const

interface AuthLayoutProps {
  children: React.ReactNode
  testimonial?: typeof TESTIMONIAL
}

// ─── Logo Mark (inline — no external dep needed here) ────────────────────────
function LogoMark() {
  return (
    <div
      className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto"
      style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
      aria-label="شعار موجود"
    >
      {/* Concentric circles */}
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true">
        <circle cx="18" cy="18" r="16" stroke="white" strokeOpacity="0.2" strokeWidth="1.5" />
        <circle cx="18" cy="18" r="10" stroke="white" strokeOpacity="0.45" strokeWidth="1.5" />
        <circle cx="18" cy="18" r="4" fill="white" />
      </svg>
    </div>
  )
}

export default function AuthLayout({ children, testimonial = TESTIMONIAL }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex flex-row" lang="ar">
      {/* Left side — brand panel (indigo) */}
      <aside
        className="hidden lg:flex lg:w-[45%] flex-col justify-between px-12 py-10"
        style={{ backgroundColor: '#3C3489' }}
        aria-label="معلومات المنصة"
      >
        {/* Logo + name */}
        <div className="flex flex-col items-center gap-3 text-center">
          <LogoMark />
          <div>
            <p className="text-xl font-medium text-white tracking-wide">موجود</p>
            <p className="text-sm" style={{ color: '#AFA9EC' }}>
              منصة التطوع في غزة
            </p>
          </div>
        </div>

        {/* Testimonial */}
        <blockquote
          className="rounded-2xl px-7 py-6"
          style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}
        >
          <span
            className="block text-5xl leading-none mb-3 select-none font-serif"
            style={{ color: '#AFA9EC' }}
            aria-hidden="true"
          >
            "
          </span>
          <p className="text-white text-base leading-relaxed mb-5">
            {testimonial.quote}
          </p>
          <footer className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium text-white flex-shrink-0"
              style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
              aria-hidden="true"
            >
              أ
            </div>
            <div>
              <p className="text-white text-sm font-medium">{testimonial.name}</p>
              <p className="text-xs" style={{ color: '#AFA9EC' }}>
                {testimonial.role}
              </p>
            </div>
          </footer>
        </blockquote>

        {/* Stats */}
        <div
          className="flex items-center justify-around pt-6"
          style={{ borderTop: '0.5px solid rgba(255,255,255,0.15)' }}
          aria-label="إحصائيات المنصة"
        >
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-2xl font-medium text-white" aria-label={`${stat.value} ${stat.label}`}>
                {stat.value}
              </p>
              <p className="text-xs mt-0.5" style={{ color: '#AFA9EC' }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </aside>

      {/* Right side — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-white" dir="rtl">
        <div className="w-full max-w-[420px]">{children}</div>
      </div>
    </div>
  )
}