import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { createClient } from '@/utils/supabase/server'
import { Sparkles } from 'lucide-react'

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
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-white/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60">
      <div className="container flex h-16 items-center mx-auto px-6">
        <div className="mr-4 flex">
          <Link href="/" className="mr-8 flex items-center space-x-2.5 group">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-md shadow-primary/20 group-hover:shadow-lg group-hover:shadow-primary/30 transition-shadow">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-foreground">
              Smile<span className="gradient-text">Sync</span>
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-1">
            <Link href="/#features" className="text-sm font-medium px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-all duration-200">
              Features
            </Link>
            <Link href="/#about" className="text-sm font-medium px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-all duration-200">
              About
            </Link>
          </div>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-3">
          {user ? (
            <Link href={dashboardLink}>
              <Button className="bg-gradient-to-r from-primary to-primary/85 hover:from-primary/90 hover:to-primary/75 text-primary-foreground shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 font-medium">
                Dashboard
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" className="text-muted-foreground hover:text-foreground font-medium">
                  Login
                </Button>
              </Link>
              <Link href="/login">
                <Button className="bg-gradient-to-r from-primary to-primary/85 hover:from-primary/90 hover:to-primary/75 text-primary-foreground shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 font-medium">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
