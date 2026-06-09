import { createClient } from '@/utils/supabase/server'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { updateProfile } from './actions'
import { User, Mail, Phone, Save } from 'lucide-react'

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
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Your Profile</h1>
        <p className="text-muted-foreground text-sm mt-1">Update your contact details to stay informed about your appointments.</p>
      </div>

      <Card className="border-border/50 shadow-sm overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 border-b border-border/40 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-md shadow-primary/20">
              <User className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg">Personal Information</CardTitle>
              <CardDescription>Keep your information up to date.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <form action={updateProfile} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="full_name" className="text-sm font-medium">Full Name</Label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/60">
                  <User className="h-4 w-4" />
                </div>
                <Input id="full_name" name="full_name" defaultValue={profile?.full_name || ''} required className="pl-10 h-12 rounded-xl bg-secondary/30 border-border/60" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/40">
                  <Mail className="h-4 w-4" />
                </div>
                <Input id="email" name="email" type="email" defaultValue={profile?.email || ''} readOnly className="pl-10 h-12 rounded-xl bg-secondary/50 border-border/60 cursor-not-allowed opacity-60" />
              </div>
              <p className="text-xs text-muted-foreground">Email cannot be changed directly.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium">Phone Number</Label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/60">
                  <Phone className="h-4 w-4" />
                </div>
                <Input id="phone" name="phone" type="tel" defaultValue={profile?.phone || ''} placeholder="+91 98765 43210" required className="pl-10 h-12 rounded-xl bg-secondary/30 border-border/60" />
              </div>
            </div>

            {params?.message && (
              <div className="rounded-xl bg-destructive/5 border border-destructive/15 p-3 text-sm font-medium text-destructive flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-destructive shrink-0" />
                {params.message}
              </div>
            )}
            {params?.success && (
              <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-sm font-medium text-emerald-700 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                {params.success}
              </div>
            )}

            <Button type="submit" className="w-full h-12 rounded-xl bg-gradient-to-r from-primary to-primary/85 hover:from-primary/90 hover:to-primary/75 text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-xl transition-all duration-300 font-semibold text-base">
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
