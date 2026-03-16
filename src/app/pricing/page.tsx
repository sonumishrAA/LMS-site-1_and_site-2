import Link from 'next/link'
import { Check } from 'lucide-react'
import { supabaseService } from '@/lib/supabase/service'

export default async function PricingPage() {
  const { data: pricingData } = await supabaseService
    .from('pricing_config')
    .select('*')
    .order('amount', { ascending: true })

  // Fallback plans if DB is empty (should not happen with migrations)
  const basePlans = [
    { key: '1m', name: '1 Month', sub: 'Single library', popular: false },
    { key: '3m', name: '3 Months', sub: 'Save ₹300', popular: true },
    { key: '6m', name: '6 Months', sub: 'Save ₹800', popular: false },
    { key: '12m', name: '12 Months', sub: 'Best Value', popular: false },
  ]

  // Map DB data to our UI structure
  const plans = basePlans.map(base => {
    const dbPlan = pricingData?.find(p => p.plan === base.key)
    const amount = dbPlan?.amount || 0
    
    // Dynamic subtitle calculation if it's a "Save" type
    let subtitle = base.sub
    if (base.key !== '1m' && pricingData) {
      const basePrice = pricingData.find(p => p.plan === '1m')?.amount || 500
      const multiplier = base.key === '3m' ? 3 : base.key === '6m' ? 6 : 12
      const savings = (basePrice * multiplier) - amount
      if (savings > 0 && base.key !== '12m') {
        subtitle = `Save ₹${savings.toLocaleString()}`
      }
    }

    return {
      ...base,
      price: `₹${amount.toLocaleString()}`,
      amount: amount,
      subtitle
    }
  })

  return (
    <div className="py-20 px-4">
      <div className="max-w-7xl mx-auto text-center space-y-4 mb-16">
        <h1 className="text-5xl font-serif text-brand-900">Simple, Transparent Pricing</h1>
        <p className="text-xl text-gray-600">No hidden fees. No setup costs. Cancel anytime.</p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {plans.map((plan) => (
          <div 
            key={plan.name} 
            className={`relative p-8 rounded-3xl border bg-white flex flex-col ${
              plan.popular ? 'border-brand-500 shadow-xl shadow-brand-100 ring-4 ring-brand-50' : 'border-gray-100'
            }`}
          >
            {plan.popular && (
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-brand-500 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                Most Popular
              </span>
            )}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-gray-900 mb-2">{plan.name}</h3>
              <p className="text-4xl font-serif text-brand-900 mb-1">{plan.price}</p>
              <p className="text-xs font-bold text-brand-500 uppercase tracking-widest">{plan.subtitle}</p>
            </div>
            
            <ul className="flex-1 space-y-4 mb-8">
              {[
                'Unlimited Students',
                'Interactive Seat Map',
                'Automatic WhatsApp',
                'Shift Management',
                'Staff Accounts (2)',
                'Daily Cloud Backup',
              ].map(feat => (
                <li key={feat} className="flex items-center gap-2 text-sm text-gray-600">
                  <Check className="w-4 h-4 text-green-500 shrink-0" />
                  {feat}
                </li>
              ))}
            </ul>

            <Link 
              href={`/library-register?plan=${plan.key}`}
              className={`w-full py-3 rounded-xl font-bold text-center transition-colors ${
                plan.popular ? 'bg-brand-500 text-white hover:bg-brand-700' : 'bg-gray-50 text-gray-800 hover:bg-gray-100'
              }`}
            >
              Get Started
            </Link>
          </div>
        ))}
      </div>

      <div className="max-w-3xl mx-auto mt-20 p-8 bg-brand-900 rounded-[2.5rem] text-white flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-2">
          <h3 className="text-2xl font-serif">Running 2+ Branches?</h3>
          <p className="text-brand-100/60 text-sm">Contact us for multi-branch discounts and custom enterprise features.</p>
        </div>
        <Link href="/help#contact" className="bg-white text-brand-900 px-8 py-3 rounded-xl font-bold whitespace-nowrap">
          Talk to Sales
        </Link>
      </div>
    </div>
  )
}
