import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { createClient } from '@/utils/supabase/server'

export async function Navbar() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let dashboardLink = '/login'
  if (user) {
    const role = user.app_metadata?.role
    if (role === 'ADMIN') dashboardLink = '/admin'
    else if (role === 'DENTIST') dashboardLink = '/dentist'
    else dashboardLink = '/patient'
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center mx-auto px-4">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold text-2xl text-teal-700">SmileSync</span>
          </Link>
          <div className="hidden md:flex gap-6">
            <Link href="/services" className="text-sm font-medium transition-colors hover:text-primary">
              Services
            </Link>
            <Link href="/dentists" className="text-sm font-medium transition-colors hover:text-primary">
              Our Dentists
            </Link>
            <Link href="/about" className="text-sm font-medium transition-colors hover:text-primary">
              About
            </Link>
          </div>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            {/* Search or other elements could go here */}
          </div>
          <nav className="flex items-center space-x-2">
            {user ? (
              <Button variant="default" className="bg-teal-600 hover:bg-teal-700">
                <Link href={dashboardLink}>Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button variant="ghost">
                  <Link href="/login">Login</Link>
                </Button>
                <Button className="bg-teal-600 hover:bg-teal-700">
                  <Link href="/login">Book Appointment</Link>
                </Button>
              </>
            )}
          </nav>
        </div>
      </div>
    </nav>
  )
}
