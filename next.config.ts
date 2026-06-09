// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // انقلها من داخل experimental إلى هنا مباشرة
  serverExternalPackages: ["اسم-المكتبة-التي-وضعتها-هنا"], 
  
  experimental: {
    // احذف السطر القديم من هنا
  },
};

export default nextConfig;