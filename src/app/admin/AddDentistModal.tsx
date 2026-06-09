'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { addDentist } from './actions'
import { UserRoundCog, Mail, Lock, IndianRupee, Stethoscope, Loader2 } from 'lucide-react'

export default function AddDentistModal() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    try {
      const formData = new FormData(e.currentTarget)
      await addDentist(formData)
      toast.success('Dentist registered successfully!')
      setOpen(false)
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-primary to-primary/85 hover:from-primary/90 hover:to-primary/75 shadow-md shadow-primary/20 font-medium">
          <UserRoundCog className="mr-2 h-4 w-4" />
          Register Dentist
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Register Dentist</DialogTitle>
          <DialogDescription>Create an account and profile for a new dentist.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/60">
                  <UserRoundCog className="h-4 w-4" />
                </div>
                <Input id="name" name="name" required placeholder="Dr. John Doe" className="pl-10 h-11 rounded-xl bg-secondary/30 border-border/60" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="specialization">Specialization</Label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/60">
                  <Stethoscope className="h-4 w-4" />
                </div>
                <Input id="specialization" name="specialization" required placeholder="e.g. Orthodontist" className="pl-10 h-11 rounded-xl bg-secondary/30 border-border/60" />
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email (Login ID)</Label>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/60">
                <Mail className="h-4 w-4" />
              </div>
              <Input id="email" name="email" type="email" required placeholder="dentist@smilesync.com" className="pl-10 h-11 rounded-xl bg-secondary/30 border-border/60" />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="password">Temporary Password</Label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/60">
                  <Lock className="h-4 w-4" />
                </div>
                <Input id="password" name="password" required type="password" className="pl-10 h-11 rounded-xl bg-secondary/30 border-border/60" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="consultation_fee">Fee (₹)</Label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/60">
                  <IndianRupee className="h-4 w-4" />
                </div>
                <Input id="consultation_fee" name="consultation_fee" type="number" required placeholder="500" className="pl-10 h-11 rounded-xl bg-secondary/30 border-border/60" />
              </div>
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="rounded-xl">Cancel</Button>
            <Button type="submit" disabled={loading} className="rounded-xl bg-gradient-to-r from-primary to-primary/85 hover:from-primary/90 hover:to-primary/75 shadow-md shadow-primary/20 font-medium">
              {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Registering...</> : 'Register Dentist'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
