import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { logout } from '@/app/login/actions'
import { Calendar, User, History, Settings, LogOut } from 'lucide-react'

export default async function PatientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || (user.app_metadata?.role !== 'PATIENT' && user.app_metadata?.role !== 'ADMIN')) {
    redirect('/login')
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-white p-6 hidden md:block">
        <nav className="space-y-2">
          <Link href="/patient" className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-teal-50 text-teal-700 font-medium">
            <Calendar className="h-5 w-5" />
            <span>Dashboard</span>
          </Link>
          <Link href="/patient/history" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
            <History className="h-5 w-5" />
            <span>History</span>
          </Link>
          <Link href="/patient/profile" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
            <User className="h-5 w-5" />
            <span>Profile</span>
          </Link>
          <Link href="/patient/settings" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
            <Settings className="h-5 w-5" />
            <span>Settings</span>
          </Link>
          <form action={logout}>
            <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors mt-8">
              <LogOut className="h-5 w-5" />
              <span>Log Out</span>
            </button>
          </form>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  )
}
