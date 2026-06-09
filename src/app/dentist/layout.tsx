import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { logout } from '@/app/login/actions'
import { CalendarDays, Users, FileText, BarChart, LogOut } from 'lucide-react'

export default async function DentistLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || (user.app_metadata?.role !== 'DENTIST' && user.app_metadata?.role !== 'ADMIN')) {
    redirect('/login')
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-slate-50">
      <aside className="w-64 border-r bg-slate-900 text-slate-300 p-6 hidden md:block">
        <div className="mb-8 px-3">
          <h2 className="text-xl font-bold text-white tracking-tight">Dentist Portal</h2>
        </div>
        <nav className="space-y-2">
          <Link href="/dentist" className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-slate-800 text-white font-medium">
            <CalendarDays className="h-5 w-5" />
            <span>Schedule</span>
          </Link>
          <Link href="/dentist/patients" className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-slate-800 hover:text-white transition-colors">
            <Users className="h-5 w-5" />
            <span>Patients</span>
          </Link>
          <Link href="/dentist/notes" className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-slate-800 hover:text-white transition-colors">
            <FileText className="h-5 w-5" />
            <span>Clinical Notes</span>
          </Link>
          <Link href="/dentist/earnings" className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-slate-800 hover:text-white transition-colors">
            <BarChart className="h-5 w-5" />
            <span>Earnings</span>
          </Link>
          <form action={logout}>
            <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-slate-800 text-red-400 hover:text-red-300 transition-colors mt-8">
              <LogOut className="h-5 w-5" />
              <span>Log Out</span>
            </button>
          </form>
        </nav>
      </aside>

      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  )
}
