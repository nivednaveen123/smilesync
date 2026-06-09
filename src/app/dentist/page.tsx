import { createClient } from '@/utils/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, User, Sparkles, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import AppointmentActions from './AppointmentActions'

export default async function DentistDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch today's appointments for the dentist
  const today = new Date().toISOString().split('T')[0]
  
  const { data: appointments } = await supabase
    .from('appointments')
    .select(`
      id, appointment_time, status,
      patient_profiles (full_name, phone)
    `)
    .eq('dentist_id', user?.id)
    .eq('appointment_date', today)
    .order('appointment_time', { ascending: true })

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Today&apos;s Schedule</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-border/50 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Calendar className="h-4 w-4 text-primary" />
              </div>
              Appointments ({appointments?.length || 0})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {appointments && appointments.length > 0 ? (
              <div className="space-y-3">
                {appointments.map((apt) => (
                  <div key={apt.id} className="group p-4 rounded-xl border border-border/50 bg-secondary/20 hover:bg-secondary/40 hover:border-border flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all duration-200">
                    <div className="flex items-start gap-4">
                      <div className="bg-primary/10 text-primary font-bold p-3 rounded-xl text-center min-w-[70px] text-sm">
                        {apt.appointment_time.slice(0, 5)}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{(apt.patient_profiles as any)?.full_name || (apt.patient_profiles as any)?.[0]?.full_name}</p>
                        <div className="flex items-center gap-3 mt-1.5">
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <User className="h-3 w-3" /> Patient
                          </span>
                          <span className={`px-2 py-0.5 text-xs font-semibold rounded-lg ${
                            apt.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' :
                            apt.status === 'completed' ? 'bg-primary/10 text-primary border border-primary/20' :
                            'bg-secondary text-muted-foreground border border-border'
                          }`}>
                            {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                      <Link href={`/dentist/patients/${apt.id}`} className={buttonVariants({ variant: "outline", size: "sm", className: "flex-1 md:flex-none rounded-lg border-border/60" })}>
                        Details
                      </Link>
                      <AppointmentActions appointmentId={apt.id} status={apt.status} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="h-7 w-7 text-muted-foreground/40" />
                </div>
                <p className="text-foreground font-medium mb-1">No appointments today</p>
                <p className="text-sm text-muted-foreground">Enjoy your free time or check upcoming schedules.</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-1 border-border/50 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-accent" />
              </div>
              At a Glance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center p-3.5 rounded-xl bg-secondary/20 border border-border/40">
              <span className="text-sm text-muted-foreground">Patients Today</span>
              <span className="text-2xl font-bold text-foreground">{appointments?.length || 0}</span>
            </div>
            <div className="flex justify-between items-center p-3.5 rounded-xl bg-secondary/20 border border-border/40">
              <span className="text-sm text-muted-foreground">Pending Reviews</span>
              <span className="text-2xl font-bold text-foreground">0</span>
            </div>
            <Link href="/dentist/schedule" className={buttonVariants({ className: "w-full rounded-xl bg-gradient-to-r from-primary to-primary/85 hover:from-primary/90 hover:to-primary/75 shadow-md shadow-primary/20 font-medium group" })}>
              View Full Schedule
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
