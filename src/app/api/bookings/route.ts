import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { dentist_id, branch_id, appointment_date, appointment_time } = body

    // Generate Booking Reference
    const booking_reference = `BK-${Date.now().toString().slice(-6)}`

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
        return NextResponse.json({ error: 'Slot already booked. Please select another time.' }, { status: 409 })
      }
      return NextResponse.json({ error: 'Failed to create reservation' }, { status: 500 })
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
            appointment 
          })
        })
      }
    } catch (webhookError) {
      console.error('Failed to trigger n8n communication webhooks:', webhookError)
      // Non-blocking error, we still return success to the patient
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
            patient_name: appointment.patient_profiles.full_name,
            phone: appointment.patient_profiles.phone || '',
            email: appointment.patient_profiles.email || '',
            dentist: appointment.dentists.name,
            date: appointment.appointment_date,
            time: appointment.appointment_time
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
