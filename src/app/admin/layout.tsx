import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { logout } from '@/app/login/actions'
import { LayoutDashboard, Users, UserRoundCog, Building, CreditCard, Settings, LogOut, Bell, Sparkles, Shield } from 'lucide-react'

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
    <div className="flex min-h-[calc(100vh-4rem)]">
      <aside className="w-72 bg-sidebar text-sidebar-foreground p-6 hidden md:flex md:flex-col border-r border-sidebar-border">
        <div className="flex items-center gap-2.5 px-3 mb-10">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <Shield className="h-4 w-4 text-white" />
          </div>
          <div>
            <span className="font-bold text-sm text-sidebar-accent-foreground">Admin Console</span>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          <SidebarLink href="/admin" icon={<LayoutDashboard className="h-4.5 w-4.5" />} label="Dashboard" active />
          <SidebarLink href="/admin/appointments" icon={<Bell className="h-4.5 w-4.5" />} label="Appointments" />
          <SidebarLink href="/admin/patients" icon={<Users className="h-4.5 w-4.5" />} label="Patients" />
          <SidebarLink href="/admin/dentists" icon={<UserRoundCog className="h-4.5 w-4.5" />} label="Dentists" />
          <SidebarLink href="/admin/branches" icon={<Building className="h-4.5 w-4.5" />} label="Branches" />
          <SidebarLink href="/admin/payments" icon={<CreditCard className="h-4.5 w-4.5" />} label="Payments" />
          <SidebarLink href="/admin/settings" icon={<Settings className="h-4.5 w-4.5" />} label="Settings" />
        </nav>

        <form action={logout} className="mt-auto pt-6 border-t border-sidebar-border">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200">
            <LogOut className="h-4.5 w-4.5" />
            <span>Log Out</span>
          </button>
        </form>
      </aside>

      <main className="flex-1 p-8 bg-background overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}

function SidebarLink({ href, icon, label, active = false }: { href: string, icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <Link 
      href={href} 
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
        active 
          ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-md shadow-sidebar-primary/20' 
          : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
      }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  )
}
