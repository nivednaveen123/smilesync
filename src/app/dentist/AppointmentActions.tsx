'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { FileText, CheckCircle2, Loader2 } from 'lucide-react'
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
      <Button size="sm" variant="outline" className="flex-1 md:flex-none rounded-lg" disabled>
        <CheckCircle2 className="mr-2 h-4 w-4 text-emerald-500" /> Completed
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
        <Button size="sm" className="flex-1 md:flex-none rounded-lg bg-gradient-to-r from-primary to-primary/85 hover:from-primary/90 hover:to-primary/75 shadow-sm shadow-primary/20 font-medium">
          <FileText className="mr-2 h-4 w-4" /> Notes & Complete
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Complete Appointment</DialogTitle>
          <DialogDescription>
            Add a clinical note to patient history and mark this appointment as completed.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="note">Clinical Notes / Prescriptions</Label>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/60">
                <FileText className="h-4 w-4" />
              </div>
              <Input 
                id="note" 
                required 
                value={note} 
                onChange={(e) => setNote(e.target.value)} 
                placeholder="e.g., Routine cleaning done. Recommend flossing daily."
                className="pl-10 h-11 rounded-xl bg-secondary/30 border-border/60"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="rounded-xl">Cancel</Button>
            <Button type="submit" disabled={loading} className="rounded-xl bg-gradient-to-r from-primary to-primary/85 hover:from-primary/90 hover:to-primary/75 shadow-md shadow-primary/20 font-medium">
              {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</> : 'Save & Complete'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
