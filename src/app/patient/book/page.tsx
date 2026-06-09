import { createClient } from '@/utils/supabase/server'
import BookingForm from './BookingForm'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

export default async function BookAppointmentPage() {
  const supabase = await createClient()

  // Fetch all active dentists
  const { data: dentists } = await supabase
    .from('dentists')
    .select('id, name, specialization, consultation_fee')
    .eq('status', 'active')

  // Fetch all clinic branches
  const { data: branches } = await supabase
    .from('clinic_branches')
    .select('id, branch_name, address')

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-900">Book Appointment</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Schedule a Visit</CardTitle>
          <CardDescription>Select a clinic, dentist, and your preferred time slot.</CardDescription>
        </CardHeader>
        <CardContent>
          <BookingForm dentists={dentists || []} branches={branches || []} />
        </CardContent>
      </Card>
    </div>
  )
}
