import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import NextTopLoader from 'nextjs-toploader';

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
});

export const metadata: Metadata = {
  title: "Mawjood | منصة موجود للتطوع",
  description: "منصة موجود - لربط المتطوعين بالفرص التطوعية في غزة",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <NextTopLoader
          color="#3C3489"
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow={false}
          initialPosition={0.1}
        />
        {children}
      </body>
    </html>
  )
}
