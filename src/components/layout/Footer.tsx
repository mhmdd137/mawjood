import Link from "next/link"

export function Footer() {
  return (
    <footer className="w-full border-t border-gray-200 bg-white py-8">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 lg:px-8">
        <p className="text-sm text-gray-500">
          © 2026 موجود - منصة التطوع الأولى في غزة. جميع الحقوق محفوظة.
        </p>
        <div className="flex items-center gap-6">
          <Link href="/terms" className="text-sm text-gray-500 hover:text-indigo-600">الشروط والأحكام</Link>
          <Link href="/privacy" className="text-sm text-gray-500 hover:text-indigo-600">سياسة الخصوصية</Link>
          <Link href="/contact" className="text-sm text-gray-500 hover:text-indigo-600">اتصل بنا</Link>
          <Link href="/faq" className="text-sm text-gray-500 hover:text-indigo-600">الأسئلة الشائعة</Link>
        </div>
      </div>
    </footer>
  )
}
