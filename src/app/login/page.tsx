import { login } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Sparkles, Phone, Mail, Lock, ArrowRight, Info } from 'lucide-react'
import Link from 'next/link'

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ message?: string }> }) {
  const params = await searchParams

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-6 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md animate-fade-up">
        {/* Logo */}
        <div className="flex items-center justify-center mb-8">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-2xl tracking-tight text-foreground">
              Smile<span className="gradient-text">Sync</span>
            </span>
          </Link>
        </div>

        <Card className="border-border/50 shadow-xl shadow-black/5 backdrop-blur-sm">
          <CardContent className="pt-8 pb-8 px-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-foreground tracking-tight mb-2">Welcome back</h1>
              <p className="text-muted-foreground text-sm">Sign in to manage your appointments</p>
            </div>

            {/* Notice */}
            <div className="flex items-start gap-3 rounded-xl bg-primary/5 border border-primary/10 p-4 text-sm text-primary mb-6">
              <Info className="h-4 w-4 mt-0.5 shrink-0" />
              <span>Please use valid credentials so we can proceed with the inquiry.</span>
            </div>

            <form>
              <div className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="identifier" className="text-sm font-medium text-foreground">
                    Phone Number or Email
                  </Label>
                  <div className="relative">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/60">
                      <Phone className="h-4 w-4" />
                    </div>
                    <Input 
                      id="identifier" 
                      name="identifier" 
                      type="text" 
                      placeholder="9876543210 or email@example.com" 
                      required 
                      className="pl-10 h-12 rounded-xl bg-secondary/30 border-border/60 focus:bg-background transition-colors"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    Indian numbers auto-prefixed with +91
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-foreground">Password</Label>
                  <div className="relative">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/60">
                      <Lock className="h-4 w-4" />
                    </div>
                    <Input 
                      id="password" 
                      name="password" 
                      type="password" 
                      required 
                      placeholder="Enter your password"
                      className="pl-10 h-12 rounded-xl bg-secondary/30 border-border/60 focus:bg-background transition-colors"
                    />
                  </div>
                </div>

                {params?.message && (
                  <div className="rounded-xl bg-destructive/5 border border-destructive/15 p-3 text-sm font-medium text-destructive flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-destructive shrink-0" />
                    {params.message}
                  </div>
                )}

                <Button type="submit" formAction={login} className="w-full h-12 rounded-xl bg-gradient-to-r from-primary to-primary/85 hover:from-primary/90 hover:to-primary/75 text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 font-semibold group text-base">
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </form>

            <p className="text-center text-xs text-muted-foreground mt-6">
              New patients are automatically registered upon first login.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
