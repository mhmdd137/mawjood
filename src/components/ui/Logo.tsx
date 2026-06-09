import Image from 'next/image';
import Link from 'next/link';

interface LogoProps {
  variant?: 'horizontal' | 'stacked' | 'icon-only';
  inverted?: boolean; // إذا كان true، سيتحول اللوجو للون الأبيض
  className?: string;
}

export default function Logo({ variant = 'horizontal', inverted = false, className = "" }: LogoProps) {
  // خدعة الـ CSS Filter لتحويل اللون الأزرق الداكن إلى أبيض ناصع
  const filterStyle = inverted ? { filter: 'brightness(0) invert(1)' } : {};

  return (
    <Link href="/" className={`inline-flex items-center gap-3 select-none ${className}`}>
      
      {/* 1. أيقونة الشعار (Balanced Premium) */}
      <div style={filterStyle} className="transition-all duration-300">
        <Image
          src="/logo-icon.png"
          alt="موجود - Mawjood"
          width={variant === 'stacked' ? 60 : 40}
          height={variant === 'stacked' ? 60 : 40}
          priority
          className="object-contain"
        />
      </div>

      {/* 2. كلمة موجود حسب الـ Layout المطلوبة */}
      {variant !== 'icon-only' && (
        <span 
          style={filterStyle}
          className={`font-bold text-indigo-700  transition-colors duration-300 ${
            variant === 'stacked' 
              ? 'block text-center text-xl mt-1' 
              : 'text-2xl tracking-wide'
          }`}
        >
          {/* يفضل كتابتها نصاً لتطابق الصورة، أو استبدالها بـ <Image src="/logo-text.png" /> */}
          موجود
        </span>
      )}
    </Link>
  );
}