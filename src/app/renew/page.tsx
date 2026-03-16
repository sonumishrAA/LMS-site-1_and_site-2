'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Building2, CheckCircle2, AlertTriangle, ShieldCheck, CreditCard, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import Script from 'next/script'

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface Plan {
  months: number
  price: number
  label: string
  popular?: boolean
}

const PLANS: Plan[] = [
  { months: 1, price: 500, label: '1 Month' },
  { months: 3, price: 1200, label: '3 Months', popular: true },
  { months: 6, price: 2200, label: '6 Months' },
  { months: 12, price: 4000, label: '1 Year' }
]

function RenewContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [library, setLibrary] = useState<any>(null)
  const [payload, setPayload] = useState<any>(null)
  
  const [selectedPlan, setSelectedPlan] = useState<Plan>(PLANS[1])
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    if (!token) {
      setError('Missing token. Please initiate renewal from your dashboard.')
      setLoading(false)
      return
    }

    async function verify() {
      try {
        const res = await fetch(`/api/verify-token?token=${token}&purpose=renew`)
        const data = await res.json()

        if (!res.ok) throw new Error(data.error || 'Verification failed')
        
        setLibrary(data.library)
        setPayload(data.payload)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    verify()
  }, [token])

  const handlePayment = async () => {
    if (!window.Razorpay) {
      alert('Payment system is loading. Please try again in a moment.')
      return
    }

    setProcessing(true)
    try {
      // 1. Create order
      const orderRes = await fetch('/api/create-renewal-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          library_id: payload.library_id,
          plan_months: selectedPlan.months
        })
      })
      const orderData = await orderRes.json()
      if (!orderRes.ok) throw new Error(orderData.error)

      // 2. Open Razorpay
      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: 'INR',
        name: 'LibraryOS',
        description: `Renewing ${library?.name}`,
        order_id: orderData.order_id,
        handler: function (response: any) {
          // Success! Redirect back to dashboard Let webhook update DB
          window.location.href = 'https://app.libraryos.in?renewed=true'
        },
        prefill: {
          email: payload.owner_email,
        },
        theme: {
          color: '#0f172a' // brand-900
        }
      }

      const rzp = new window.Razorpay(options)
      rzp.on('payment.failed', function (response: any) {
        alert(response.error.description)
        setProcessing(false)
      })
      rzp.open()

    } catch (err: any) {
      alert(err.message)
      setProcessing(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-white animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-brand-900 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-[2rem] p-8 text-center space-y-4">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Access Denied</h2>
            <p className="text-sm text-gray-500 mt-2">{error}</p>
          </div>
          <a href="https://app.libraryos.in/select-library" className="block w-full py-3 bg-brand-900 text-white rounded-xl font-bold mt-4">
            Return to Dashboard
          </a>
        </div>
      </div>
    )
  }

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <div className="min-h-screen bg-brand-900 flex flex-col items-center justify-center p-6 py-12">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-serif text-white">Secure Renewal</h1>
          <p className="text-white/60 text-sm mt-2 font-medium">Verified Owner Session: {payload.owner_email}</p>
        </div>

        {/* Main Card */}
        <div className="max-w-md w-full bg-white rounded-[2rem] p-6 shadow-xl space-y-8 animate-in slide-in-from-bottom-4">
          
          {/* Library Info */}
          <div className="bg-brand-50 p-4 rounded-2xl flex items-start gap-4">
            <div className="w-12 h-12 bg-white rounded-xl shadow-sm text-brand-600 flex items-center justify-center font-black text-xl shrink-0">
              {library?.name?.slice(0, 1).toUpperCase()}
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-brand-400 mb-1">Renewing Access For</p>
              <h2 className="text-lg font-bold text-brand-950 leading-tight">{library?.name}</h2>
              <p className="text-xs font-medium text-brand-600 mt-1 capitalize flex items-center gap-1.5">
                <span className={cn(
                  "w-1.5 h-1.5 rounded-full inline-block",
                  library?.subscription_status === 'active' ? 'bg-green-500' : 'bg-red-500'
                )} />
                {library?.subscription_status} (Until {new Date(library?.subscription_end).toLocaleDateString()})
              </p>
            </div>
          </div>

          {/* Plan Selection */}
          <div className="space-y-3">
            <p className="text-[11px] font-black tracking-widest uppercase text-gray-400">Select Extension Plan</p>
            <div className="grid grid-cols-2 gap-3">
              {PLANS.map((plan) => (
                <button
                  key={plan.months}
                  onClick={() => setSelectedPlan(plan)}
                  className={cn(
                    "relative p-4 rounded-2xl border-2 text-left transition-all",
                    selectedPlan.months === plan.months 
                      ? "border-brand-500 bg-brand-50 ring-4 ring-brand-500/10" 
                      : "border-gray-100 hover:border-brand-200"
                  )}
                >
                  {plan.popular && (
                    <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-brand-900 text-white text-[9px] font-black tracking-widest uppercase px-2 py-0.5 rounded-full whitespace-nowrap">
                      Most Popular
                    </div>
                  )}
                  <div className="flex items-center justify-between mb-2">
                    <p className={cn(
                      "font-bold text-sm",
                      selectedPlan.months === plan.months ? "text-brand-900" : "text-gray-900"
                    )}>{plan.label}</p>
                    {selectedPlan.months === plan.months && (
                      <CheckCircle2 className="w-4 h-4 text-brand-500" />
                    )}
                  </div>
                  <p className={cn(
                    "text-xl font-black font-mono leading-none",
                    selectedPlan.months === plan.months ? "text-brand-600" : "text-gray-600"
                  )}>₹{plan.price}</p>
                  <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase">Per Library</p>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handlePayment}
            disabled={processing}
            className="w-full bg-brand-900 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-brand-800 transition-colors disabled:opacity-50"
          >
            {processing ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <CreditCard className="w-5 h-5" />
                Pay ₹{selectedPlan.price} Securely
              </>
            )}
          </button>
        </div>
      </div>
    </>
  )
}

export default function RenewPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-brand-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-white animate-spin" />
      </div>
    }>
      <RenewContent />
    </Suspense>
  )
}
