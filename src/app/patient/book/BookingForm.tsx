'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

export default function BookingForm({ dentists, branches }: { dentists: any[], branches: any[] }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [branchId, setBranchId] = useState('')
  const [dentistId, setDentistId] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')

  const availableTimes = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30']

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          branch_id: branchId,
          dentist_id: dentistId,
          appointment_date: date,
          appointment_time: time
        })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to book appointment')
      }

      toast.success('Appointment booked successfully!')
      router.push('/patient')
      router.refresh()
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="branch">Clinic Branch</Label>
        <Select required value={branchId} onValueChange={(val) => setBranchId(val || '')}>
          <SelectTrigger>
            <SelectValue placeholder="Select a clinic location" />
          </SelectTrigger>
          <SelectContent>
            {branches.map(b => (
              <SelectItem key={b.id} value={b.id}>{b.branch_name} - {b.address}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="dentist">Dentist</Label>
        <Select required value={dentistId} onValueChange={(val) => setDentistId(val || '')}>
          <SelectTrigger>
            <SelectValue placeholder="Select a dentist" />
          </SelectTrigger>
          <SelectContent>
            {dentists.map(d => (
              <SelectItem key={d.id} value={d.id}>Dr. {d.name} ({d.specialization})</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Input 
            type="date" 
            id="date" 
            required 
            min={new Date().toISOString().split('T')[0]} 
            value={date} 
            onChange={e => setDate(e.target.value)} 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="time">Time</Label>
          <Select required value={time} onValueChange={(val) => setTime(val || '')}>
            <SelectTrigger>
              <SelectValue placeholder="Select a time" />
            </SelectTrigger>
            <SelectContent>
              {availableTimes.map(t => (
                <SelectItem key={t} value={`${t}:00`}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700" disabled={loading}>
        {loading ? 'Confirming...' : 'Confirm Booking'}
      </Button>
    </form>
  )
}
