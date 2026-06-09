import { createClient } from '@/utils/supabase/server'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { updateProfile } from './actions'

export default async function ProfilePage({ searchParams }: { searchParams: Promise<{ message?: string, success?: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const params = await searchParams

  const { data: profile } = await supabase
    .from('patient_profiles')
    .select('*')
    .eq('id', user?.id)
    .single()

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-900">Update Profile</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Update your contact details to stay informed about your appointments.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={updateProfile} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="full_name">Full Name</Label>
              <Input id="full_name" name="full_name" defaultValue={profile?.full_name || ''} required />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" name="email" type="email" defaultValue={profile?.email || ''} readOnly className="bg-slate-100" />
              <p className="text-xs text-slate-500">Email cannot be changed directly.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" name="phone" type="tel" defaultValue={profile?.phone || ''} placeholder="+1 234 567 8900" required />
            </div>

            {params?.message && (
              <div className="text-sm font-medium text-destructive">{params.message}</div>
            )}
            {params?.success && (
              <div className="text-sm font-medium text-teal-600">{params.success}</div>
            )}

            <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700">
              Save Changes
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
