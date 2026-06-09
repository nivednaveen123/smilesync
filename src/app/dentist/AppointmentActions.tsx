'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { FileText, CheckCircle2 } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { addMedicalNote } from './actions'

export default function AppointmentActions({ appointmentId, status }: { appointmentId: string, status: string }) {
  const [open, setOpen] = useState(false)
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)

  if (status === 'completed') {
    return (
      <Button size="sm" variant="outline" className="flex-1 md:flex-none" disabled>
        <CheckCircle2 className="mr-2 h-4 w-4 text-green-600" /> Completed
      </Button>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await addMedicalNote(appointmentId, note)
      toast.success('Appointment marked as completed and note saved!')
      setOpen(false)
    } catch (error: any) {
      toast.error(error.message || 'Failed to save note')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="flex-1 md:flex-none bg-slate-900 hover:bg-slate-800 text-white">
          <FileText className="mr-2 h-4 w-4" /> Notes & Complete
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Complete Appointment</DialogTitle>
          <DialogDescription>
            Add a medical note to patient history and mark this appointment as completed.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="note">Medical Notes / Prescriptions</Label>
            <Input 
              id="note" 
              required 
              value={note} 
              onChange={(e) => setNote(e.target.value)} 
              placeholder="e.g., Routine cleaning done. Recommend flossing daily."
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={loading} className="bg-teal-600 hover:bg-teal-700">
              {loading ? 'Saving...' : 'Save & Complete'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
