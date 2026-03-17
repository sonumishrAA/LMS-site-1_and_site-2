'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Check, Loader2, AlertCircle } from 'lucide-react'
import { supabaseBrowser } from '@/lib/supabase/client'

interface PricingPlan {
  id: string
  plan: '1m' | '3m' | '6m' | '12m'
  amount: number
  name?: string
  subtitle?: string
  popular?: boolean
}

export default function PricingPage() {
  const [plans, setPlans] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchPricing() {
      try {
        console.log('Fetching pricing from Supabase...')
        const { data: pricingData, error: sbError } = await supabaseBrowser
          .from('pricing_config')
          .select('*')
          .order('amount', { ascending: true })

        if (sbError) {
          console.error('Supabase error fetching pricing:', sbError)
          setError(sbError.message)
          return
        }

        if (!pricingData || pricingData.length === 0) {
          console.warn('Pricing table is empty in the database. Raw data:', pricingData);
          setPlans([])
          return
        }

        console.log('Pricing data fetched successfully:', pricingData.length, 'records');

        // UI Metadata Mapping
        const meta = {
          '1m': { name: '1 Month', sub: 'Single library', popular: false },
          '3m': { name: '3 Months', sub: 'Save ₹300', popular: true },
          '6m': { name: '6 Months', sub: 'Save ₹800', popular: false },
          '12m': { name: '12 Months', sub: 'Best Value', popular: false },
        }

        const mappedPlans = pricingData.map((dbPlan: any) => {
          const planKey = dbPlan.plan as keyof typeof meta
          const m = meta[planKey] || { name: dbPlan.plan, sub: '', popular: false }
          const amount = Number(dbPlan.amount)
          
          let subtitle = m.sub
          // Dynamic savings calculation based on 1m price
          if (planKey !== '1m') {
            const basePriceItem = pricingData.find(p => p.plan === '1m')
            if (basePriceItem) {
              const basePrice = Number(basePriceItem.amount)
              const multiplier = planKey === '3m' ? 3 : planKey === '6m' ? 6 : 12
              const savings = (basePrice * multiplier) - amount
              if (savings > 0 && planKey !== '12m') {
                subtitle = `Save ₹${savings.toLocaleString()}`
              }
            }
          }

          return {
            key: dbPlan.plan,
            name: m.name,
            price: `₹${amount.toLocaleString()}`,
            amount: amount,
            subtitle,
            popular: m.popular
          }
        })

        setPlans(mappedPlans)
      } catch (err: any) {
        console.error('Unexpected error in PricingPage:', err)
        setError(err.message || 'An unexpected error occurred.')
      } finally {
        setLoading(false)
      }
    }

    fetchPricing()
  }, [])

  return (
    <div className="py-20 px-4 min-h-screen">
      <div className="max-w-7xl mx-auto text-center space-y-4 mb-16">
        <h1 className="text-5xl font-serif text-brand-900">Simple, Transparent Pricing</h1>
        <p className="text-xl text-gray-600">No hidden fees. No setup costs. Cancel anytime.</p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {loading ? (
          <div className="col-span-full flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-10 h-10 text-brand-500 animate-spin" />
            <p className="text-gray-500 font-medium">Loading plan details...</p>
          </div>
        ) : error ? (
          <div className="col-span-full bg-red-50 border border-red-100 rounded-2xl p-8 text-center space-y-4">
            <AlertCircle className="w-8 h-8 text-red-500 mx-auto" />
            <div className="space-y-1">
              <h3 className="text-red-900 font-bold">Failed to load pricing</h3>
              <p className="text-red-600 text-sm">{error}</p>
            </div>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-white border border-red-200 text-red-600 rounded-lg text-xs font-bold hover:bg-red-50 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : plans.length === 0 ? (
          <div className="col-span-full bg-amber-50 border border-amber-100 rounded-2xl p-20 text-center space-y-4">
            <div className="bg-white/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-2">
              <AlertCircle className="w-8 h-8 text-amber-500" />
            </div>
            <h3 className="text-amber-900 font-bold text-xl">Pricing coming soon</h3>
            <p className="text-amber-700 max-w-md mx-auto">Please set up your `pricing_config` table in the Supabase Dashboard to see live plans here.</p>
          </div>
        ) : (
          plans.map((plan) => (
            <div 
              key={plan.key} 
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
          ))
        )}
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
