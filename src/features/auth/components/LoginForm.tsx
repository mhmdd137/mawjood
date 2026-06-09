'use client'

import { useActionState, useTransition } from 'react'
import { useFormStatus } from 'react-dom'
import Link from 'next/link'
import { loginAction, signInWithGoogleAction, type LoginState } from '../actions/auth.actions'

// ─── Submit button — reads pending state from form context ────────────────────
function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      className="w-full rounded-lg py-3 text-sm font-medium text-white transition-opacity duration-150 disabled:opacity-70"
      style={{ backgroundColor: '#3C3489', border: '0.5px solid #26215C' }}
    >
      {pending ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
    </button>
  )
}

// ─── Google button ────────────────────────────────────────────────────────────
function GoogleButton() {
  const [isPending, startTransition] = useTransition()

  function handleGoogle() {
    startTransition(async () => {
      const result = await signInWithGoogleAction()
      if ('url' in result) {
        window.location.href = result.url
      }
    })
  }

  return (
    <button
      type="button"
      onClick={handleGoogle}
      disabled={isPending}
      aria-busy={isPending}
      className="w-full flex items-center justify-center gap-3 rounded-lg py-3 text-sm font-medium transition-colors duration-150 disabled:opacity-70"
      style={{
        backgroundColor: 'white',
        border: '0.5px solid #E5E5E5',
        color: '#1A1A1A',
      }}
    >
      {/* Google SVG icon */}
      <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
        <path fill="#4285F4" d="M44.5 20H24v8.5h11.8C34.7 33.9 29.8 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z" />
        <path fill="#34A853" d="M6.3 14.7l7 5.1C15 16.1 19.1 13 24 13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 16.3 2 9.7 7.4 6.3 14.7z" />
        <path fill="#FBBC05" d="M24 46c5.5 0 10.5-1.9 14.4-5l-6.7-5.5C29.8 37 27 38 24 38c-5.8 0-10.7-3.9-12.4-9.3l-7 5.4C8.1 41.2 15.5 46 24 46z" />
        <path fill="#EA4335" d="M44.5 20H24v8.5h11.8c-.9 2.6-2.6 4.8-4.8 6.5l6.7 5.5C41.8 36.8 45 30.8 45 24c0-1.3-.2-2.7-.5-4z" />
      </svg>
      {isPending ? 'جاري التوجيه...' : 'المتابعة عبر Google'}
    </button>
  )
}

// ─── Field error ──────────────────────────────────────────────────────────────
function FieldError({ messages }: { messages?: string[] }) {
  if (!messages?.length) return null
  return (
    <p className="mt-1 text-xs" style={{ color: '#A32D2D' }} role="alert">
      {messages[0]}
    </p>
  )
}

// ─── Main form ────────────────────────────────────────────────────────────────
const initialState: LoginState = { error: null }

export default function LoginForm() {
  const [state, formAction] = useActionState(loginAction, initialState)

  return (
    <div>
      <div className="mb-8 text-right">
        <h1 className="text-2xl font-medium" style={{ color: '#1A1A1A' }}>
          مرحباً بعودتك
        </h1>
        <p className="mt-1 text-sm" style={{ color: '#666666' }}>
          سجّل دخولك للوصول إلى فرص التطوع
        </p>
      </div>

      {/* Global error */}
      {state.error && (
        <div
          role="alert"
          className="mb-5 rounded-lg px-4 py-3 text-sm"
          style={{
            backgroundColor: '#FCEBEB',
            color: '#A32D2D',
            border: '0.5px solid #F0CECE',
          }}
        >
          {state.error}
        </div>
      )}

      <form action={formAction} noValidate>
        {/* Email */}
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium mb-1.5 text-right"
            style={{ color: '#1A1A1A' }}
          >
            البريد الإلكتروني
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            placeholder="example@email.com"
            aria-describedby={state.fieldErrors?.email ? 'email-error' : undefined}
            aria-invalid={!!state.fieldErrors?.email}
            className="w-full rounded-lg px-4 py-3 text-sm text-right outline-none transition-colors duration-150"
            style={{
              border: state.fieldErrors?.email
                ? '0.5px solid #A32D2D'
                : '0.5px solid #E5E5E5',
              backgroundColor: 'white',
              color: '#1A1A1A',
            }}
          />
          <span id="email-error">
            <FieldError messages={state.fieldErrors?.email} />
          </span>
        </div>

        {/* Password */}
        <div className="mb-2">
          <label
            htmlFor="password"
            className="block text-sm font-medium mb-1.5 text-right"
            style={{ color: '#1A1A1A' }}
          >
            كلمة المرور
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            aria-describedby={state.fieldErrors?.password ? 'password-error' : undefined}
            aria-invalid={!!state.fieldErrors?.password}
            className="w-full rounded-lg px-4 py-3 text-sm text-right outline-none transition-colors duration-150"
            style={{
              border: state.fieldErrors?.password
                ? '0.5px solid #A32D2D'
                : '0.5px solid #E5E5E5',
              backgroundColor: 'white',
              color: '#1A1A1A',
            }}
          />
          <span id="password-error">
            <FieldError messages={state.fieldErrors?.password} />
          </span>
        </div>

        {/* Forgot password */}
        <div className="flex justify-start mb-6">
          <Link
            href="/forgot-password"
            className="text-xs transition-opacity duration-150 hover:opacity-80"
            style={{ color: '#3C3489' }}
          >
            نسيت كلمة المرور؟
          </Link>
        </div>

        <SubmitButton />
      </form>

      {/* Divider */}
      <div className="flex items-center gap-4 my-5">
        <div className="flex-1 h-px" style={{ backgroundColor: '#E5E5E5' }} />
        <span className="text-xs" style={{ color: '#666666' }}>
          أو
        </span>
        <div className="flex-1 h-px" style={{ backgroundColor: '#E5E5E5' }} />
      </div>

      <GoogleButton />

      {/* Register link */}
      <p className="mt-6 text-center text-sm" style={{ color: '#666666' }}>
        ليس لديك حساب؟{' '}
        <Link
          href="/register"
          className="font-medium transition-opacity duration-150 hover:opacity-80"
          style={{ color: '#3C3489' }}
        >
          أنشئ حساباً
        </Link>
      </p>
    </div>
  )
}