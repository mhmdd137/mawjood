import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
export { default as PageContent } from '@/app/(public)/page'

import LandingPage from '@/app/(public)/page'

export default function Page() {
  return (
    <>
      <div className='flex justify-center items-center flex-col gap-5 h-screen bg-white-700'>
        <h1 className='flex justify-center text-3xl font-bold'>موجود</h1>
        <h2 className='flex justify-center text-xl font-bold text-indigo-600'>منصة موجود للتطوع</h2>
      </div>
    </>
  )
}