// src/features/auth/components/GoogleOneTapWrapper.tsx
'use client'

import dynamic from 'next/dynamic'

const GoogleOneTap = dynamic(
  () => import('./GoogleOneTap').then(mod => mod.GoogleOneTap),
  { ssr: false }
)

export function GoogleOneTapWrapper() {
  return <GoogleOneTap />
}