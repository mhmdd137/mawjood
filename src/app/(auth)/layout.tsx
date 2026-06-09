// src/features/auth/components/AuthLayout.tsx
import React from 'react'
import Image from 'next/image'

const STATS = [
  { value: '+240', label: 'متطوع مسجل' },
  { value: '+38', label: 'منظمة موثّقة' },
  { value: '+120', label: 'شهادة صادرة' },
] as const

const TESTIMONIAL = {
  quote: 'وجدت فرصتي الأولى في التطوع عبر موجود، وكانت تجربة غيّرت حياتي.',
  name: 'أحمد علي',
  role: 'متطوع في خانيونس',
} as const

interface AuthLayoutProps {
  children: React.ReactNode
  testimonial?: typeof TESTIMONIAL
}

export default function AuthLayout({ children, testimonial = TESTIMONIAL }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex flex-row" lang="ar">
      {/* Left side — brand panel */}
      <aside
        className="hidden lg:flex lg:w-[45%] flex-col justify-between px-12 py-10"
        style={{ backgroundColor: '#3C3489' }}
        aria-label="معلومات المنصة"
      >
        {/* New Mapped Logo + Brand Name (Balanced Premium Stacked) */}
        <div className="flex flex-col items-center text-center">
          {/* حاوية اللوجو مع استخدام خدعة الفلتر لقلب اللون الأزرق الشفاف إلى أبيض ناصع */}
          <div 
            style={{ filter: 'brightness(0) invert(1)' }} 
            className="mb-3 transition-transform duration-300 hover:scale-105"
          >
            <Image
              src="/logo-icon.png" // تأكد من وجود الصورة الشفافة بهذا المسار داخل مجلد public
              alt="شعار موجود"
              width={64}
              height={64}
              priority
              className="object-contain"
            />
          </div>
          
          <div>
            <p className="text-2xl font-bold text-white tracking-wide">موجود</p>
            <p className="text-xs mt-1" style={{ color: '#AFA9EC' }}>
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
              <p
                className="text-2xl font-medium text-white"
                aria-label={`${stat.value} ${stat.label}`}
              >
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