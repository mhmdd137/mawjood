import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
export { default as PageContent } from '@/app/(public)/page'

import LandingPage from '@/app/(public)/page'

export default function Page() {
  return (
    <>
      <div className='flex justify-center items-center flex-col gap-5 h-screen bg-white-700'>
        <div className= 'flex flex-col gap-5 p-6 rounded-lg ' style={{ backgroundColor: '#e7e7fa', border: '0.5px solid #b0b5f0'
          ,width: '400px'
        }}>
          <h1 className='flex justify-center text-3xl font-bold' style={{ color: '#4c4ccd'}}>موجود</h1>
        <h2 className='flex justify-center text-xl font-bold text-indigo-600' style={{ color: '#4c4ccd' }}>منصة موجود للتطوع</h2>
        </div>
      </div>
    </>
  )
}