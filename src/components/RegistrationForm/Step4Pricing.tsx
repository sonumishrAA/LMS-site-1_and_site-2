'use client'

import { useState, useEffect } from 'react'
import { RegistrationData } from './RegistrationForm'

const PLAN_MONTHS = [1, 3, 6, 12]

const SHIFT_COMBINATIONS = [
  'M', 'A', 'E', 'N',
  'MA', 'ME', 'MN', 'AE', 'AN', 'EN',
  'MAE', 'MAN', 'MEN', 'AEN',
  'MAEN'
]

const DEFAULT_MONTHLY_PRICE = 500

export default function Step4Pricing({
  data,
  onNext,
  onBack,
}: {
  data: RegistrationData
  onNext: (combos: RegistrationData['combos']) => void
  onBack: () => void
}) {
  const [selectedMonths, setSelectedMonths] = useState<number[]>([1, 3, 6, 12])
  const [prices, setPrices] = useState<Record<string, number>>({})

  useEffect(() => {
    const initialPrices: Record<string, number> = {}
    SHIFT_COMBINATIONS.forEach(combo => {
      const shiftCount = combo.length
      const baseMonthly = shiftCount * DEFAULT_MONTHLY_PRICE
      
      PLAN_MONTHS.forEach(months => {
        const key = `${combo}-${months}`
        const existing = data.combos.find(c => c.combination_key === combo && c.months === months)
        initialPrices[key] = existing ? existing.fee : baseMonthly * months
      })
    })
    setPrices(initialPrices)
  }, [])

  const toggleMonth = (m: number) => {
    setSelectedMonths(prev => 
      prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m]
    )
  }

  const handlePriceChange = (combo: string, months: number, value: string) => {
    const numValue = parseFloat(value) || 0
    setPrices(prev => ({ ...prev, [`${combo}-${months}`]: numValue }))
  }

  const onSubmit = () => {
    const finalCombos = SHIFT_COMBINATIONS.flatMap(combo => 
      selectedMonths.map(months => ({
        combination_key: combo,
        months,
        fee: prices[`${combo}-${months}`] || 0
      }))
    )
    onNext(finalCombos)
  }

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h2 className="text-xl font-serif text-brand-900">Plans & Pricing</h2>
        <p className="text-sm text-gray-600">Which plans will you offer to your students? Set the total fee for each.</p>
      </div>

      <div className="space-y-6">
        {/* Month Selection */}
        <div className="flex flex-wrap gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <p className="w-full text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">Offer Plans for:</p>
          {PLAN_MONTHS.map(m => (
            <label key={m} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedMonths.includes(m)}
                onChange={() => toggleMonth(m)}
                className="w-4 h-4 text-brand-500 rounded border-gray-300 focus:ring-brand-500"
              />
              <span className="text-sm font-medium text-gray-700">{m} Month{m > 1 ? 's' : ''}</span>
            </label>
          ))}
        </div>

        {/* Pricing Grid */}
        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 text-[10px] font-bold uppercase tracking-wider text-gray-500">
              <tr>
                <th className="px-4 py-3 border-b border-gray-200">Combination</th>
                {selectedMonths.sort((a,b)=>a-b).map(m => (
                  <th key={m} className="px-4 py-3 border-b border-gray-200">{m} Month{m > 1 ? 's' : ''}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {SHIFT_COMBINATIONS.map(combo => (
                <tr key={combo} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-sm font-bold text-brand-700 font-mono">{combo}</td>
                  {selectedMonths.map(m => (
                    <td key={m} className="px-4 py-3">
                      <div className="relative">
                        <span className="absolute left-2 top-2 text-[10px] text-gray-600">₹</span>
                        <input
                          type="number"
                          value={prices[`${combo}-${m}`] || ''}
                          onChange={(e) => handlePriceChange(combo, m, e.target.value)}
                          className="w-24 pl-5 pr-2 py-1.5 text-xs rounded border border-gray-200 focus:border-brand-500 focus:ring-brand-500 font-mono"
                        />
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={onBack}
          className="text-gray-600 font-medium hover:text-gray-600 transition-colors"
        >
          ← Back
        </button>
        <button
          type="button"
          onClick={onSubmit}
          className="bg-brand-500 text-white px-8 py-2 rounded-lg font-medium hover:bg-brand-700 transition-colors shadow-sm"
        >
          Next Step →
        </button>
      </div>
    </div>
  )
}
