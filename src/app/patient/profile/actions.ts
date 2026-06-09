'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const fullName = formData.get('full_name') as string
  const phone = formData.get('phone') as string

  const { error } = await supabase
    .from('patient_profiles')
    .update({ full_name: fullName, phone: phone })
    .eq('id', user.id)

  if (error) {
    return redirect('/patient/profile?message=Failed to update profile')
  }

  revalidatePath('/patient/profile')
  redirect('/patient/profile?success=Profile updated successfully')
}
