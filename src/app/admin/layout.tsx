import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { logout } from '@/app/login/actions'
import { LayoutDashboard, Users, UserRoundCog, Building, CreditCard, Settings, LogOut, Bell } from 'lucide-react'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || user.app_metadata?.role !== 'ADMIN') {
    redirect('/login')
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-slate-100">
      <aside className="w-64 border-r bg-white p-6 hidden md:flex md:flex-col shadow-sm">
        <div className="mb-8 px-3">
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">Admin Portal</h2>
        </div>
        <nav className="flex-1 space-y-1">
          <Link href="/admin" className="flex items-center space-x-3 px-3 py-2.5 rounded-lg bg-teal-50 text-teal-700 font-medium">
            <LayoutDashboard className="h-5 w-5" />
            <span>Dashboard</span>
          </Link>
          <Link href="/admin/appointments" className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
            <Bell className="h-5 w-5" />
            <span>Appointments</span>
          </Link>
          <Link href="/admin/patients" className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
            <Users className="h-5 w-5" />
            <span>Patients</span>
          </Link>
          <Link href="/admin/dentists" className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
            <UserRoundCog className="h-5 w-5" />
            <span>Dentists</span>
          </Link>
          <Link href="/admin/branches" className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
            <Building className="h-5 w-5" />
            <span>Branches</span>
          </Link>
          <Link href="/admin/payments" className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
            <CreditCard className="h-5 w-5" />
            <span>Payments</span>
          </Link>
          <Link href="/admin/settings" className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
            <Settings className="h-5 w-5" />
            <span>System Settings</span>
          </Link>
        </nav>
        <form action={logout} className="mt-auto pt-8">
          <button className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors">
            <LogOut className="h-5 w-5" />
            <span>Log Out</span>
          </button>
        </form>
      </aside>

      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  )
}
