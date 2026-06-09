import { createClient } from '@/utils/supabase/server'
import BookingForm from './BookingForm'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { CalendarPlus, Stethoscope } from 'lucide-react'

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
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Book Appointment</h1>
        <p className="text-muted-foreground text-sm mt-1">Schedule a visit with one of our dental specialists.</p>
      </div>
      
      <Card className="border-border/50 shadow-sm overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 border-b border-border/40 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-md shadow-primary/20">
              <Stethoscope className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg">Schedule a Visit</CardTitle>
              <CardDescription className="text-muted-foreground">Select a clinic, dentist, and your preferred time slot.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <BookingForm dentists={dentists || []} branches={branches || []} />
        </CardContent>
      </Card>
    </div>
  )
}
