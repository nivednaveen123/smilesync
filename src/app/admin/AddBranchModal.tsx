'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { addClinicBranch } from './actions'
import { Building, MapPin, Phone, Loader2 } from 'lucide-react'

export default function AddBranchModal() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    try {
      const formData = new FormData(e.currentTarget)
      await addClinicBranch(formData)
      toast.success('Clinic branch added successfully!')
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
        <Button variant="outline" className="border-border/60 hover:bg-secondary/60 font-medium">
          <Building className="mr-2 h-4 w-4" />
          Add Branch
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Branch</DialogTitle>
          <DialogDescription>Create a new clinic location for SmileSync.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="branch_name">Branch Name</Label>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/60">
                <Building className="h-4 w-4" />
              </div>
              <Input id="branch_name" name="branch_name" required placeholder="e.g., SmileSync Downtown" className="pl-10 h-11 rounded-xl bg-secondary/30 border-border/60" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/60">
                <MapPin className="h-4 w-4" />
              </div>
              <Input id="address" name="address" required placeholder="123 Dental St, City, State" className="pl-10 h-11 rounded-xl bg-secondary/30 border-border/60" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/60">
                <Phone className="h-4 w-4" />
              </div>
              <Input id="phone" name="phone" required placeholder="+91 98765 43210" className="pl-10 h-11 rounded-xl bg-secondary/30 border-border/60" />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="rounded-xl">Cancel</Button>
            <Button type="submit" disabled={loading} className="rounded-xl bg-gradient-to-r from-primary to-primary/85 hover:from-primary/90 hover:to-primary/75 shadow-md shadow-primary/20 font-medium">
              {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Adding...</> : 'Add Branch'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
