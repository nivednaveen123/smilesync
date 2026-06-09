import { createClient } from '@/utils/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, MapPin, ArrowRight, CalendarPlus, History, User, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'

export default async function PatientDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch upcoming appointments
  const { data: appointments } = await supabase
    .from('appointments')
    .select(`
      id, appointment_date, appointment_time, status,
      dentists (name, specialization),
      clinic_branches (branch_name, address)
    `)
    .eq('patient_id', user?.id)
    .gte('appointment_date', new Date().toISOString().split('T')[0])
    .order('appointment_date', { ascending: true })
    .order('appointment_time', { ascending: true })
    .limit(3)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Patient Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage your appointments and health records.</p>
        </div>
        <Link href="/patient/book">
          <Button className="bg-gradient-to-r from-primary to-primary/85 hover:from-primary/90 hover:to-primary/75 text-primary-foreground shadow-md shadow-primary/20 hover:shadow-lg transition-all duration-300 font-medium group">
            <CalendarPlus className="mr-2 h-4 w-4" />
            Book Appointment
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
          </Button>
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Upcoming Appointments */}
        <Card className="md:col-span-2 border-border/50 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Calendar className="h-4 w-4 text-primary" />
              </div>
              Upcoming Appointments
            </CardTitle>
          </CardHeader>
          <CardContent>
            {appointments && appointments.length > 0 ? (
              <div className="space-y-3">
                {appointments.map((apt) => (
                  <div key={apt.id} className="group p-4 rounded-xl border border-border/50 bg-secondary/20 hover:bg-secondary/40 hover:border-border transition-all duration-200">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-semibold text-foreground">Dr. {(apt.dentists as any)?.name || (apt.dentists as any)?.[0]?.name}</p>
                        <p className="text-sm text-muted-foreground">{(apt.dentists as any)?.specialization || (apt.dentists as any)?.[0]?.specialization}</p>
                      </div>
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-lg ${
                        apt.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' :
                        apt.status === 'pending' ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                        'bg-secondary text-muted-foreground border border-border'
                      }`}>
                        {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        {new Date(apt.appointment_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" />
                        {apt.appointment_time}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5" />
                        {(apt.clinic_branches as any)?.branch_name || (apt.clinic_branches as any)?.[0]?.branch_name}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="h-7 w-7 text-muted-foreground/40" />
                </div>
                <p className="text-foreground font-medium mb-1">No upcoming appointments</p>
                <p className="text-sm text-muted-foreground mb-4">Schedule a visit with one of our specialists.</p>
                <Link href="/patient/book" className={buttonVariants({ variant: "outline", className: "rounded-xl" })}>
                  Book Now
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-accent" />
              </div>
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/patient/history" className="flex items-center gap-3 p-3.5 rounded-xl border border-border/50 hover:bg-secondary/40 hover:border-border transition-all duration-200 group">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
                <History className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">Medical History</p>
                <p className="text-xs text-muted-foreground">View past visits & notes</p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-muted-foreground group-hover:translate-x-0.5 transition-all" />
            </Link>
            <Link href="/patient/payments" className="flex items-center gap-3 p-3.5 rounded-xl border border-border/50 hover:bg-secondary/40 hover:border-border transition-all duration-200 group">
              <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center group-hover:bg-accent/15 transition-colors">
                <Calendar className="h-4 w-4 text-accent" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">Payments</p>
                <p className="text-xs text-muted-foreground">Track your transactions</p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-muted-foreground group-hover:translate-x-0.5 transition-all" />
            </Link>
            <Link href="/patient/profile" className="flex items-center gap-3 p-3.5 rounded-xl border border-border/50 hover:bg-secondary/40 hover:border-border transition-all duration-200 group">
              <div className="w-9 h-9 rounded-lg bg-chart-3/10 flex items-center justify-center group-hover:bg-chart-3/15 transition-colors">
                <User className="h-4 w-4 text-chart-3" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">Update Profile</p>
                <p className="text-xs text-muted-foreground">Manage your details</p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-muted-foreground group-hover:translate-x-0.5 transition-all" />
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
