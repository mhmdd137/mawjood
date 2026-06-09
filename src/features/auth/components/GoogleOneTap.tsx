// src/features/auth/components/GoogleOneTap.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (config: object) => void
          prompt: () => void
          cancel: () => void
        }
      }
    }
  }
}

export function GoogleOneTap() {
  const router = useRouter()
  const supabase = createClient()
  const initialized = useRef(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    const initOneTap = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) return

      const rawNonce = btoa(
        String.fromCharCode(...crypto.getRandomValues(new Uint8Array(32)))
      )
      const encoder = new TextEncoder()
      const hashBuffer = await crypto.subtle.digest(
        'SHA-256',
        encoder.encode(rawNonce)
      )
      const hashedNonce = Array.from(new Uint8Array(hashBuffer))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('')

      const script = document.createElement('script')
      script.src = 'https://accounts.google.com/gsi/client'
      script.async = true
      script.defer = true
      document.head.appendChild(script)

      script.onload = () => {
        window.google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
          nonce: hashedNonce,
          callback: async (response: { credential: string }) => {
            setIsLoading(true) // ← يظهر الـ overlay فوراً

            const { data, error } = await supabase.auth.signInWithIdToken({
              provider: 'google',
              token: response.credential,
              nonce: rawNonce,
            })

            if (error || !data.user) {
              setIsLoading(false)
              return
            }

            const { data: profile } = await supabase
              .from('profiles')
              .select('id')
              .eq('id', data.user.id)
              .single()

            router.push(profile ? '/dashboard' : '/register')
            router.refresh()
            // الـ overlay يبقى لحد ما تكتمل عملية التحويل
          },
          use_fedcm_for_prompt: true,
          cancel_on_tap_outside: false,
        })

        window.google.accounts.id.prompt()
      }
    }

    initOneTap()

    return () => {
      window.google?.accounts?.id?.cancel()
    }
  }, [])

  if (!isLoading) return null

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center gap-4"
      style={{ backgroundColor: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(4px)' }}
    >
      {/* Spinner */}
      <div
        className="w-12 h-12 rounded-full border-2 border-t-transparent animate-spin"
        style={{ borderColor: '#AFA9EC', borderTopColor: 'transparent' }}
      />

      {/* النص */}
      <div className="flex flex-col items-center gap-1 text-center">
        <p
          className="text-base font-medium"
          style={{ color: '#3C3489' }}
        >
          جاري تسجيل الدخول...
        </p>
        <p
          className="text-sm"
          style={{ color: '#666666' }}
        >
          يرجى الانتظار لحظة
        </p>
      </div>
    </div>
  )
}