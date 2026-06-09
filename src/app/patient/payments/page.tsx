import { Card, CardContent } from '@/components/ui/card'
import { CreditCard } from 'lucide-react'

export default function PaymentsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Payments</h1>
        <p className="text-muted-foreground text-sm mt-1">Track your transaction history and receipts.</p>
      </div>

      <Card className="border-border/50 shadow-sm">
        <CardContent className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mb-4">
            <CreditCard className="h-7 w-7 text-muted-foreground/40" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">No Payments Recorded</h3>
          <p className="text-muted-foreground max-w-sm text-sm">
            You have no past payment records. All payments are currently handled directly at the clinic during your visit.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
