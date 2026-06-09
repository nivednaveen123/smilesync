import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DollarSign } from 'lucide-react'

export default function PaymentsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-900">Payment History</h1>
      </div>

      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <DollarSign className="h-16 w-16 text-slate-200 mb-4" />
          <h3 className="text-xl font-medium text-slate-900 mb-2">No Payments Recorded</h3>
          <p className="text-slate-500 max-w-sm">
            You have no past payment records. Note: SmileSync is currently operating without an integrated payment gateway. All payments are handled directly at the clinic.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
