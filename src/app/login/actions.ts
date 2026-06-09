'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  let identifier = formData.get('identifier') as string
  const password = formData.get('password') as string

  if (!identifier || !password) {
    return redirect('/login?message=Please provide both credentials')
  }

  // Clean identifier
  identifier = identifier.trim()

  // Format phone number if it's exactly 10 digits
  const isPhone = /^\d{10}$/.test(identifier)
  if (isPhone) {
    // Virtual email mapping to bypass expensive SMS providers
    identifier = `+91${identifier}@phone.smilesync.com`
  } else if (!identifier.includes('@')) {
    return redirect('/login?message=Please enter a valid 10-digit phone number or email')
  }

  // 1. Attempt Login
  let { error } = await supabase.auth.signInWithPassword({
    email: identifier,
    password: password,
  })

  // 2. Seamless Auto-Signup if they don't exist
  if (error && error.message.includes('Invalid login credentials')) {
    const { error: signUpError } = await supabase.auth.signUp({
      email: identifier,
      password: password,
      options: {
        data: {
          // Use phone number as name placeholder if it's a phone login
          full_name: isPhone ? `Patient (${identifier.slice(3, 13)})` : 'New Patient',
        }
      }
    })

    if (signUpError) {
      return redirect('/login?message=Could not create account: ' + signUpError.message)
    }
    
    // Note: If 'Confirm Email' is turned ON in Supabase, the user won't be logged in yet.
    // They must turn it OFF for seamless login to work perfectly.
  } else if (error) {
    return redirect('/login?message=' + error.message)
  }

  // Fetch user role
  const { data: { user } } = await supabase.auth.getUser()
  const role = user?.app_metadata?.role

  revalidatePath('/', 'layout')
  
  if (role === 'ADMIN') {
    redirect('/admin')
  } else if (role === 'DENTIST') {
    redirect('/dentist')
  } else {
    redirect('/patient')
  }
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
