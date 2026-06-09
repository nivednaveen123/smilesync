import { createClient } from '@/utils/supabase/server'
import { Card, CardContent } from '@/components/ui/card'
import { Calendar, Clock, MapPin, FileText, Stethoscope } from 'lucide-react'

export default async function MedicalHistoryPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch past appointments and notes
  const { data: appointments } = await supabase
    .from('appointments')
    .select(`
      id, appointment_date, appointment_time, status,
      dentists (name, specialization),
      clinic_branches (branch_name, address),
      medical_notes (note, created_at)
    `)
    .eq('patient_id', user?.id)
    .order('appointment_date', { ascending: false })
    .order('appointment_time', { ascending: false })

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Medical History</h1>
        <p className="text-muted-foreground text-sm mt-1">Review your past appointments and clinical notes.</p>
      </div>

      <div className="space-y-4">
        {appointments && appointments.length > 0 ? (
          appointments.map((apt) => (
            <Card key={apt.id} className="border-border/50 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200">
              <div className="bg-secondary/30 border-b border-border/40 px-6 py-3.5 flex flex-wrap justify-between items-center gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                    <Calendar className="h-4 w-4 text-primary" />
                    {new Date(apt.appointment_date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {apt.appointment_time.slice(0, 5)}
                  </div>
                </div>
                <span className={`px-2.5 py-1 text-xs font-semibold rounded-lg ${
                  apt.status === 'completed' ? 'bg-primary/10 text-primary border border-primary/20' :
                  apt.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' :
                  apt.status === 'cancelled' ? 'bg-red-100 text-red-700 border border-red-200' :
                  'bg-amber-100 text-amber-700 border border-amber-200'
                }`}>
                  {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                </span>
              </div>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Stethoscope className="h-4 w-4 text-primary" />
                      <h3 className="font-semibold text-foreground">Dr. {(apt.dentists as any)?.name || (apt.dentists as any)?.[0]?.name}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4 ml-6">{(apt.dentists as any)?.specialization || (apt.dentists as any)?.[0]?.specialization}</p>
                    <div className="flex items-start gap-1.5 text-sm text-muted-foreground ml-6">
                      <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                      <span>
                        {(apt.clinic_branches as any)?.branch_name || (apt.clinic_branches as any)?.[0]?.branch_name}
                        <br/>
                        <span className="text-muted-foreground/70">{(apt.clinic_branches as any)?.address || (apt.clinic_branches as any)?.[0]?.address}</span>
                      </span>
                    </div>
                  </div>
                  <div className="rounded-xl bg-secondary/30 border border-border/40 p-4">
                    <div className="flex items-center gap-2 mb-3 font-medium text-foreground text-sm">
                      <FileText className="h-4 w-4 text-accent" />
                      Clinical Notes
                    </div>
                    {(apt.medical_notes as any)?.length > 0 ? (
                      <div className="space-y-2">
                        {(apt.medical_notes as any).map((note: any) => (
                          <p key={note.id} className="text-sm text-muted-foreground leading-relaxed pl-6 border-l-2 border-accent/30 italic">
                            &ldquo;{note.note}&rdquo;
                          </p>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground/60 italic">No notes recorded for this visit.</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="border-border/50">
            <CardContent className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mb-4">
                <FileText className="h-7 w-7 text-muted-foreground/40" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No Medical History</h3>
              <p className="text-muted-foreground max-w-sm text-sm">You haven&apos;t had any appointments yet. Once you complete a visit, your records will appear here.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
