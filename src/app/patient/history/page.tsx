import { createClient } from '@/utils/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, Clock, MapPin, FileText } from 'lucide-react'

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
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-900">Medical History</h1>
      </div>

      <div className="space-y-6">
        {appointments && appointments.length > 0 ? (
          appointments.map((apt) => (
            <Card key={apt.id} className="overflow-hidden">
              <div className="bg-slate-50 border-b p-4 flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center text-slate-600 font-medium">
                    <Calendar className="mr-2 h-4 w-4" />
                    {new Date(apt.appointment_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
                  <div className="flex items-center text-slate-500">
                    <Clock className="mr-2 h-4 w-4" />
                    {apt.appointment_time.slice(0, 5)}
                  </div>
                </div>
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                  apt.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                  apt.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                  apt.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {apt.status.toUpperCase()}
                </span>
              </div>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">Dr. {(apt.dentists as any)?.name || (apt.dentists as any)?.[0]?.name}</h3>
                    <p className="text-slate-500 mb-4">{(apt.dentists as any)?.specialization || (apt.dentists as any)?.[0]?.specialization}</p>
                    <div className="flex items-start text-sm text-slate-600">
                      <MapPin className="mr-2 h-4 w-4 mt-0.5 shrink-0" />
                      <span>
                        {(apt.clinic_branches as any)?.branch_name || (apt.clinic_branches as any)?.[0]?.branch_name}<br/>
                        {(apt.clinic_branches as any)?.address || (apt.clinic_branches as any)?.[0]?.address}
                      </span>
                    </div>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-lg border">
                    <div className="flex items-center mb-2 font-medium text-slate-700">
                      <FileText className="mr-2 h-4 w-4" />
                      Dentist Notes
                    </div>
                    {(apt.medical_notes as any)?.length > 0 ? (
                      <div className="space-y-3">
                        {(apt.medical_notes as any).map((note: any) => (
                          <p key={note.id} className="text-sm text-slate-600 italic">"{note.note}"</p>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-slate-400 italic">No notes recorded for this visit.</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <FileText className="h-16 w-16 text-slate-200 mb-4" />
              <h3 className="text-xl font-medium text-slate-900 mb-2">No Medical History Found</h3>
              <p className="text-slate-500 max-w-sm">You haven't had any appointments yet. Once you complete a visit, your records will appear here.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
