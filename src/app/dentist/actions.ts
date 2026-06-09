'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addMedicalNote(appointmentId: string, note: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Unauthorized')

  // Verify dentist owns this appointment
  const { data: apt } = await supabase
    .from('appointments')
    .select('dentist_id')
    .eq('id', appointmentId)
    .single()

  if (!apt || apt.dentist_id !== user.id) {
    throw new Error('Unauthorized or appointment not found')
  }

  // Insert medical note
  const { error: noteError } = await supabase
    .from('medical_notes')
    .insert({
      appointment_id: appointmentId,
      dentist_id: user.id,
      note: note
    })

  if (noteError) throw new Error('Failed to save medical note')

  // Update appointment status to completed
  const { error: updateError } = await supabase
    .from('appointments')
    .update({ status: 'completed' })
    .eq('id', appointmentId)

  if (updateError) throw new Error('Failed to update appointment status')

  revalidatePath('/dentist')
  return { success: true }
}
