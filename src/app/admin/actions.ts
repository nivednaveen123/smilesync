'use server'

import { createClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'

// Note: We use the service role key to bypass RLS and create auth users
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
)

export async function addClinicBranch(formData: FormData) {
  const branchName = formData.get('branch_name') as string
  const address = formData.get('address') as string
  const phone = formData.get('phone') as string

  const { error } = await supabaseAdmin
    .from('clinic_branches')
    .insert({ branch_name: branchName, address, phone })

  if (error) {
    throw new Error('Failed to add clinic branch: ' + error.message)
  }

  revalidatePath('/admin')
  return { success: true }
}

export async function addDentist(formData: FormData) {
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const specialization = formData.get('specialization') as string
  const consultationFee = parseFloat(formData.get('consultation_fee') as string)

  // 1. Create the auth user
  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email: email,
    password: password,
    email_confirm: true,
    user_metadata: { full_name: name },
    app_metadata: { role: 'DENTIST' }
  })

  if (authError || !authData.user) {
    throw new Error('Failed to create dentist account: ' + authError?.message)
  }

  // 2. Insert into public.dentists
  const { error: dentistError } = await supabaseAdmin
    .from('dentists')
    .insert({
      id: authData.user.id,
      name,
      specialization,
      consultation_fee: consultationFee
    })

  if (dentistError) {
    // Rollback user creation if insertion fails
    await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
    throw new Error('Failed to add dentist profile: ' + dentistError.message)
  }

  revalidatePath('/admin')
  return { success: true }
}
