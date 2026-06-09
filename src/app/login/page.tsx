import { login } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ message?: string }> }) {
  const params = await searchParams

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold tracking-tight text-teal-700">SmileSync</CardTitle>
          <CardDescription>
            Manage your dental appointments effortlessly
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="space-y-4">
              <div className="rounded-md bg-amber-50 p-3 text-sm text-amber-800 border border-amber-200">
                Please use valid credentials so we can proceed with the inquiry.
              </div>
              <div className="space-y-2">
                <Label htmlFor="identifier">Phone Number or Email</Label>
                <Input id="identifier" name="identifier" type="text" placeholder="9876543210 or email@example.com" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" required />
              </div>
              {params?.message && (
                <div className="text-sm font-medium text-destructive">{params.message}</div>
              )}
              <Button type="submit" formAction={login} className="w-full bg-teal-600 hover:bg-teal-700">
                Continue
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
