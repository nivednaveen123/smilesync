import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Calendar, ShieldCheck, Clock, CreditCard } from 'lucide-react'

export default function Home() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20 bg-gradient-to-b from-blue-50 to-white">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-6 max-w-4xl">
          Modern Dental Care, <br className="hidden md:block"/>
          <span className="text-teal-600">Simplified.</span>
        </h1>
        <p className="text-xl text-slate-600 mb-10 max-w-2xl">
          Experience seamless appointment booking, secure payments, and a personalized patient portal with SmileSync.
        </p>
        <div className="flex gap-4">
          <Button size="lg" className="bg-teal-600 hover:bg-teal-700 text-lg px-8">
            <Link href="/login">Book Appointment</Link>
          </Button>
          <Button size="lg" variant="outline" className="text-lg px-8">
            <Link href="/services">Our Services</Link>
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-900 mb-16">
            Why Choose SmileSync?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard 
              icon={<Calendar className="h-10 w-10 text-teal-600" />}
              title="Easy Scheduling"
              description="Book your preferred slot in seconds. No more waiting on hold."
            />
            <FeatureCard 
              icon={<ShieldCheck className="h-10 w-10 text-teal-600" />}
              title="Secure Records"
              description="Your medical data is encrypted and accessible only to you and your doctor."
            />
            <FeatureCard 
              icon={<Clock className="h-10 w-10 text-teal-600" />}
              title="Instant Reminders"
              description="Get automated WhatsApp and email alerts so you never miss a visit."
            />
            <FeatureCard 
              icon={<CreditCard className="h-10 w-10 text-teal-600" />}
              title="Seamless Payments"
              description="Pay online securely with Razorpay integration and instant receipts."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 bg-slate-50 mt-auto">
        <div className="container mx-auto px-4 text-center text-slate-500">
          <p>&copy; {new Date().getFullYear()} SmileSync Dental Management. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <Card className="border-none shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardContent className="pt-6 flex flex-col items-center text-center">
        <div className="mb-4 p-3 bg-teal-50 rounded-full">
          {icon}
        </div>
        <h3 className="text-xl font-semibold mb-2 text-slate-800">{title}</h3>
        <p className="text-slate-600">{description}</p>
      </CardContent>
    </Card>
  )
}
