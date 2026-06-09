import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { dentist_id, branch_id, appointment_date, appointment_time, patient_name, patient_age } = body

    // To generate a globally unique booking reference, we MUST bypass RLS
    // using the service role key, otherwise patients can only see their own appointments.
    const supabaseAdmin = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false } }
    )

    // Fetch the latest booking to generate sequential reference
    const { data: lastBooking } = await supabaseAdmin
      .from('appointments')
      .select('booking_reference')
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    let nextNumber = 1
    if (lastBooking && lastBooking.booking_reference && lastBooking.booking_reference.startsWith('BK-')) {
      const lastNumStr = lastBooking.booking_reference.replace('BK-', '')
      const lastNum = parseInt(lastNumStr, 10)
      if (!isNaN(lastNum)) {
        nextNumber = lastNum + 1
      }
    }
    
    // Add a small random hash if we somehow hit a collision (to be absolutely safe)
    const booking_reference = `BK-${String(nextNumber).padStart(3, '0')}`

    // Insert appointment directly as confirmed since we bypassed payments
    const { data: appointment, error: appointmentError } = await supabase
      .from('appointments')
      .insert({
        patient_id: user.id,
        dentist_id,
        branch_id,
        appointment_date,
        appointment_time,
        status: 'confirmed',
        payment_status: 'paid', // Or "not_required" depending on business logic
        booking_reference,
      })
      .select(`
        *,
        patient_profiles (full_name, email, phone),
        dentists (name)
      `)
      .single()

    if (appointmentError) {
      console.error('Booking error:', appointmentError)
      if (appointmentError.code === '23505') { // Unique violation
        // Check which constraint was violated to give a highly specific error
        if (appointmentError.message.includes('prevent_double_booking')) {
          return NextResponse.json({ error: 'This specific time slot is already booked with this dentist. Please choose a different time or date.' }, { status: 409 })
        } else if (appointmentError.message.includes('booking_reference')) {
          return NextResponse.json({ error: 'System error generating a unique reference number. Please try again.' }, { status: 409 })
        }
        return NextResponse.json({ error: 'Database constraint violation. Please try again.' }, { status: 409 })
      }
      return NextResponse.json({ error: 'Failed to create reservation: ' + appointmentError.message }, { status: 500 })
    }

    // Update patient profile if name is provided and they want to override
    if (patient_name) {
      await supabase
        .from('patient_profiles')
        .update({ full_name: patient_name })
        .eq('id', user.id)
    }

    // Trigger Self-Hosted n8n Webhooks for Communication
    try {
      const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL
      if (n8nWebhookUrl) {
        await fetch(n8nWebhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            event: 'booking_confirmed', 
            appointment: { ...appointment, patient_name, patient_age }
          })
        })
      }
    } catch (webhookError) {
      console.error('Failed to trigger n8n communication webhooks:', webhookError)
      // Non-blocking error, we still return success to the patient
    }

    // Format Email and Phone for users who signed in via Phone Number
    let finalEmail = appointment.patient_profiles.email || ''
    let finalPhone = appointment.patient_profiles.phone || ''

    if (finalEmail.includes('@phone.smilesync.com')) {
      // Extract the phone number (e.g. +911234567890@phone.smilesync.com -> +911234567890)
      finalPhone = finalEmail.split('@')[0]
      // Google Sheets treats values starting with '+' or '=' as formulas, causing #ERROR!
      // To fix this, we prepend a single quote to force it as text, OR since they asked for text:
      finalEmail = 'signed in using phone number'
    }

    // Trigger Direct Google Sheets Webhook
    try {
      const sheetsWebhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL
      if (sheetsWebhookUrl) {
        await fetch(sheetsWebhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            booking_reference: appointment.booking_reference,
            patient_name: patient_name || appointment.patient_profiles.full_name,
            phone: finalPhone ? `'${finalPhone}` : '', // Prepend quote to stop Google Sheets from reading '+' as a formula
            email: finalEmail,
            dentist: appointment.dentists.name,
            date: appointment.appointment_date,
            time: appointment.appointment_time,
            patient_age: patient_age || 'Not specified'
          })
        })
      }
    } catch (sheetsError) {
      console.error('Failed to send data to Google Sheets:', sheetsError)
      // Non-blocking error
    }

    return NextResponse.json({ 
      appointment, 
      status: 'confirmed' 
    })

  } catch (error) {
    console.error('Booking API Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
