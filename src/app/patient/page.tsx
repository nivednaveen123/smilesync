import { createClient } from '@/utils/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, MapPin } from 'lucide-react'
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
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-900">Patient Dashboard</h1>
        <Link href="/patient/book" className={buttonVariants({ className: "bg-teal-600 hover:bg-teal-700" })}>
          Book Appointment
        </Link>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Upcoming Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            {appointments && appointments.length > 0 ? (
              <div className="space-y-4">
                {appointments.map((apt) => (
                  <div key={apt.id} className="p-4 border rounded-lg bg-slate-50 flex flex-col space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-slate-900">Dr. {(apt.dentists as any)?.name || (apt.dentists as any)?.[0]?.name}</p>
                        <p className="text-sm text-slate-500">{(apt.dentists as any)?.specialization || (apt.dentists as any)?.[0]?.specialization}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        apt.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        apt.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-slate-100 text-slate-800'
                      }`}>
                        {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-slate-600">
                      <div className="flex items-center">
                        <Calendar className="mr-1 h-4 w-4" />
                        {new Date(apt.appointment_date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        <Clock className="mr-1 h-4 w-4" />
                        {apt.appointment_time}
                      </div>
                    </div>
                    <div className="flex items-center text-sm text-slate-600">
                      <MapPin className="mr-1 h-4 w-4" />
                      {(apt.clinic_branches as any)?.branch_name || (apt.clinic_branches as any)?.[0]?.branch_name}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500">
                <p>No upcoming appointments found.</p>
                <Link href="/patient/book" className={buttonVariants({ variant: "link", className: "mt-2" })}>
                  Book one now
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/patient/history" className={buttonVariants({ variant: "outline", className: "w-full justify-start h-12" })}>
              View Medical History
            </Link>
            <Link href="/patient/payments" className={buttonVariants({ variant: "outline", className: "w-full justify-start h-12" })}>
              Payment History
            </Link>
            <Link href="/patient/profile" className={buttonVariants({ variant: "outline", className: "w-full justify-start h-12" })}>
              Update Profile
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
