import { createClient } from '@/utils/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, User, FileText } from 'lucide-react'
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
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-900">Today's Schedule</h1>
        <div className="text-slate-500 font-medium">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Appointments ({appointments?.length || 0})</CardTitle>
          </CardHeader>
          <CardContent>
            {appointments && appointments.length > 0 ? (
              <div className="space-y-4">
                {appointments.map((apt) => (
                  <div key={apt.id} className="p-4 border rounded-lg bg-white shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                    <div className="flex items-start space-x-4">
                      <div className="bg-slate-100 text-slate-700 font-bold p-3 rounded-lg text-center min-w-[80px]">
                        {apt.appointment_time.slice(0, 5)}
                      </div>
                      <div>
                        <p className="font-semibold text-lg text-slate-900">{(apt.patient_profiles as any)?.full_name || (apt.patient_profiles as any)?.[0]?.full_name}</p>
                        <div className="flex items-center text-sm text-slate-500 space-x-3 mt-1">
                          <span className="flex items-center"><User className="mr-1 h-3 w-3"/> Patient</span>
                          <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                            apt.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                            apt.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                            'bg-slate-100 text-slate-800'
                          }`}>
                            {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2 w-full md:w-auto">
                      <Link href={`/dentist/patients/${apt.id}`} className={buttonVariants({ variant: "outline", size: "sm", className: "flex-1 md:flex-none" })}>
                        View Details
                      </Link>
                      <AppointmentActions appointmentId={apt.id} status={apt.status} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-slate-500 bg-slate-50 rounded-lg border border-dashed">
                <Calendar className="mx-auto h-12 w-12 text-slate-300 mb-3" />
                <p className="text-lg font-medium text-slate-900">No appointments today</p>
                <p>Enjoy your free time or check upcoming schedules.</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>At a Glance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-between items-center pb-4 border-b">
              <span className="text-slate-600">Total Patients Today</span>
              <span className="text-2xl font-bold text-slate-900">{appointments?.length || 0}</span>
            </div>
            <div className="flex justify-between items-center pb-4 border-b">
              <span className="text-slate-600">Pending Reviews</span>
              <span className="text-2xl font-bold text-slate-900">0</span>
            </div>
            <Link href="/dentist/schedule" className={buttonVariants({ className: "w-full bg-slate-900 hover:bg-slate-800 text-white" })}>
              View Full Week Schedule
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
