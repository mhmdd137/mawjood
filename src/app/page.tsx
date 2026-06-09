import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import LandingPage from '@/app/(public)/page'

export default async function Page() {
  return (
    <>
      <Navbar />
      <main><LandingPage /></main>
      <Footer />
    </>
  )
}