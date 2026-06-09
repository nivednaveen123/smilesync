import { createClient } from '@/utils/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, IndianRupee, CalendarCheck, TrendingUp, Activity, ArrowUpRight } from 'lucide-react'
import AddBranchModal from './AddBranchModal'
import AddDentistModal from './AddDentistModal'

export default async function AdminDashboard() {
  const supabase = await createClient()

  const [patientsCount, appointmentsCount, paymentsSum] = await Promise.all([
    supabase.from('patient_profiles').select('*', { count: 'exact', head: true }),
    supabase.from('appointments').select('*', { count: 'exact', head: true }),
    supabase.from('payments').select('amount').eq('status', 'paid')
  ])

  const totalRevenue = paymentsSum.data?.reduce((acc, curr) => acc + curr.amount, 0) || 0

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Platform Overview</h1>
          <p className="text-muted-foreground text-sm mt-1">Monitor performance and manage your clinic operations.</p>
        </div>
        <div className="flex space-x-3">
          <AddBranchModal />
          <AddDentistModal />
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Revenue"
          value={`₹${totalRevenue.toLocaleString('en-IN')}`}
          change="+20.1%"
          icon={<IndianRupee className="h-4 w-4" />}
          gradient="from-emerald-500/10 to-emerald-500/5"
          iconColor="text-emerald-600"
        />
        <MetricCard
          title="Appointments"
          value={`${appointmentsCount.count || 0}`}
          change="+15%"
          icon={<CalendarCheck className="h-4 w-4" />}
          gradient="from-primary/10 to-primary/5"
          iconColor="text-primary"
        />
        <MetricCard
          title="Total Patients"
          value={`${patientsCount.count || 0}`}
          change="+82 new"
          icon={<Users className="h-4 w-4" />}
          gradient="from-accent/10 to-accent/5"
          iconColor="text-accent"
        />
        <MetricCard
          title="Active Dentists"
          value="5"
          change="2 branches"
          icon={<TrendingUp className="h-4 w-4" />}
          gradient="from-chart-3/10 to-chart-3/5"
          iconColor="text-chart-3"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4 border-border/50 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Activity className="h-4 w-4 text-primary" />
              </div>
              Revenue Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center rounded-xl bg-secondary/30 border border-dashed border-border/60">
              <div className="text-center">
                <Activity className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">Analytics charts coming soon</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="lg:col-span-3 border-border/50 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                <CalendarCheck className="h-4 w-4 text-accent" />
              </div>
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { text: 'New patient registered', time: '1 hour ago' },
                { text: 'Appointment confirmed', time: '2 hours ago' },
                { text: 'Payment received', time: '3 hours ago' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-secondary/40 transition-colors">
                  <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{item.text}</p>
                    <p className="text-xs text-muted-foreground">{item.time}</p>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground/40 shrink-0" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function MetricCard({ title, value, change, icon, gradient, iconColor }: {
  title: string, value: string, change: string, icon: React.ReactNode, gradient: string, iconColor: string
}) {
  return (
    <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-muted-foreground">{title}</span>
          <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center`}>
            <span className={iconColor}>{icon}</span>
          </div>
        </div>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        <p className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-0.5">
          <ArrowUpRight className="h-3 w-3" />
          {change} from last month
        </p>
      </CardContent>
    </Card>
  )
}
