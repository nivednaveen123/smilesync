// Quick seed script to add clinic branch and dentist to cloud database
const { createClient } = require('@supabase/supabase-js')

// Cloud Supabase credentials
const SUPABASE_URL = 'https://cdylyrodxjrjutobvudz.supabase.co'

// Read service role key from command line argument
const SERVICE_ROLE_KEY = process.argv[2]

if (!SERVICE_ROLE_KEY) {
  console.error('Usage: node seed-cloud.js <SERVICE_ROLE_KEY>')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false }
})

async function seed() {
  console.log('🏥 Adding clinic branch: Talap, Kannur...')
  const { data: branch, error: branchError } = await supabase
    .from('clinic_branches')
    .insert({
      branch_name: 'SmileSync Kannur',
      address: 'Talap, Kannur, Kerala',
      phone: '+91 9876543210'
    })
    .select()
    .single()

  if (branchError) {
    console.error('Branch error:', branchError.message)
  } else {
    console.log('✅ Branch added:', branch.branch_name)
  }

  console.log('👨‍⚕️ Creating dentist account: Dr. Hanish Humayun...')
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email: 'dr.hanish@smilesync.com',
    password: 'SmileSync@2024',
    email_confirm: true,
    user_metadata: { full_name: 'Dr. Hanish Humayun' },
    app_metadata: { role: 'DENTIST' }
  })

  if (authError) {
    console.error('Auth error:', authError.message)
    return
  }

  console.log('✅ Auth user created:', authData.user.id)

  const { error: dentistError } = await supabase
    .from('dentists')
    .insert({
      id: authData.user.id,
      name: 'Hanish Humayun',
      specialization: 'MBBS - General Dentistry',
      consultation_fee: 500,
      status: 'active'
    })

  if (dentistError) {
    console.error('Dentist error:', dentistError.message)
    await supabase.auth.admin.deleteUser(authData.user.id)
  } else {
    console.log('✅ Dentist profile added: Dr. Hanish Humayun MBBS')
  }

  console.log('\n🎉 Seeding complete!')
  console.log('Dentist Login: dr.hanish@smilesync.com / SmileSync@2024')
}

seed()
