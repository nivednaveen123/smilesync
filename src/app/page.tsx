import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Calendar, ShieldCheck, Clock, CreditCard, Sparkles, ArrowRight, Heart, Star } from 'lucide-react'

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse-soft" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-accent/5 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: '1.5s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-primary/3 to-accent/3 rounded-full blur-3xl" />
        </div>
        
        <div className="flex flex-col items-center justify-center text-center px-6 pt-24 pb-20 md:pt-32 md:pb-28 max-w-5xl mx-auto">
          {/* Trust badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10 text-primary text-sm font-medium mb-8 animate-fade-up">
            <Sparkles className="h-4 w-4" />
            <span>Trusted by 500+ dental clinics across India</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-foreground mb-6 animate-fade-up leading-[1.1]" style={{ animationDelay: '0.1s' }}>
            Modern Dental Care,{' '}
            <br className="hidden md:block"/>
            <span className="gradient-text">Simplified.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl animate-fade-up leading-relaxed" style={{ animationDelay: '0.2s' }}>
            Experience seamless appointment booking, secure patient records, and a personalized portal — all in one powerful platform built for India&apos;s dental professionals.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-up" style={{ animationDelay: '0.3s' }}>
            <Link href="/login">
              <Button size="lg" className="bg-gradient-to-r from-primary to-primary/85 hover:from-primary/90 hover:to-primary/75 text-primary-foreground text-lg px-8 h-13 shadow-xl shadow-primary/25 hover:shadow-2xl hover:shadow-primary/30 transition-all duration-300 font-semibold group">
                Book Appointment
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/#features">
              <Button size="lg" variant="outline" className="text-lg px-8 h-13 border-border/60 hover:bg-secondary/80 transition-all duration-300 font-medium">
                Explore Features
              </Button>
            </Link>
          </div>

          {/* Social proof */}
          <div className="flex items-center gap-6 mt-12 animate-fade-up" style={{ animationDelay: '0.4s' }}>
            <div className="flex -space-x-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 border-2 border-background flex items-center justify-center">
                  <Heart className="h-3 w-3 text-primary/60" />
                </div>
              ))}
            </div>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
              ))}
              <span className="text-sm text-muted-foreground ml-2">4.9/5 from 200+ reviews</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <span className="inline-block text-sm font-semibold text-primary tracking-wider uppercase mb-3">Why SmileSync?</span>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4 tracking-tight">
              Everything your clinic needs
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              A complete ecosystem designed to streamline operations and deliver exceptional patient experiences.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard 
              icon={<Calendar className="h-6 w-6" />}
              title="Smart Scheduling"
              description="Book your preferred slot in seconds. Intelligent conflict detection prevents double-bookings."
              color="from-primary/10 to-primary/5"
              iconColor="text-primary"
            />
            <FeatureCard 
              icon={<ShieldCheck className="h-6 w-6" />}
              title="Secure Records"
              description="Bank-grade encryption protects your medical data. Accessible only to you and your doctor."
              color="from-accent/10 to-accent/5"
              iconColor="text-accent"
            />
            <FeatureCard 
              icon={<Clock className="h-6 w-6" />}
              title="Instant Alerts"
              description="Automated WhatsApp and email reminders so your patients never miss a scheduled visit."
              color="from-chart-3/10 to-chart-3/5"
              iconColor="text-chart-3"
            />
            <FeatureCard 
              icon={<CreditCard className="h-6 w-6" />}
              title="Simple Payments"
              description="Seamless payment tracking with instant digital receipts and financial overview."
              color="from-chart-4/10 to-chart-4/5"
              iconColor="text-chart-4"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="relative rounded-3xl bg-gradient-to-br from-primary via-primary/90 to-accent p-12 md:p-16 text-center overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1),transparent_50%)]" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-2xl" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
                Ready to transform your practice?
              </h2>
              <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
                Join hundreds of dental clinics across India already using SmileSync to deliver better patient care.
              </p>
              <Link href="/login">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90 text-lg px-8 h-13 shadow-xl font-semibold group">
                  Start Today — It&apos;s Free
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-10 mt-auto">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-2.5">
            <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Sparkles className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="font-bold text-foreground">SmileSync</span>
          </div>
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} SmileSync Dental Management. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description, color, iconColor }: { icon: React.ReactNode, title: string, description: string, color: string, iconColor: string }) {
  return (
    <div className="group hover-lift rounded-2xl border border-border/50 bg-card p-6 shadow-sm hover:shadow-xl hover:border-border transition-all duration-300">
      <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${color} mb-5 group-hover:scale-110 transition-transform duration-300`}>
        <span className={iconColor}>{icon}</span>
      </div>
      <h3 className="text-lg font-semibold mb-2 text-foreground">{title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
    </div>
  )
}
