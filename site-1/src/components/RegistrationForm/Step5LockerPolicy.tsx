'use client'

import { useState } from 'react'
import { RegistrationData } from './RegistrationForm'

const SHIFT_COMBINATIONS = [
  'M', 'A', 'E', 'N',
  'MA', 'ME', 'MN', 'AE', 'AN', 'EN',
  'MAE', 'MAN', 'MEN', 'AEN',
  'MAEN'
]

export default function Step5LockerPolicy({
  data,
  onNext,
  onBack,
}: {
  data: RegistrationData
  onNext: (policy: RegistrationData['locker_policy']) => void
  onBack: () => void
}) {
  const [eligibleCombos, setEligibleCombos] = useState<string[]>(data.locker_policy.eligible_combos)
  const [fee, setFee] = useState(data.locker_policy.monthly_fee || 150)

  const toggleCombo = (combo: string) => {
    setEligibleCombos(prev => 
      prev.includes(combo) ? prev.filter(x => x !== combo) : [...prev, combo]
    )
  }

  const toggleAll = (checked: boolean) => {
    if (checked) {
      setEligibleCombos(SHIFT_COMBINATIONS)
    } else {
      setEligibleCombos([])
    }
  }

  const isAllSelected = eligibleCombos.length === SHIFT_COMBINATIONS.length

  if (!data.lockers.has_lockers) {
    return (
      <div className="space-y-8">
        <div className="p-8 text-center space-y-4">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-gray-600 text-2xl">
            🔒
          </div>
          <h2 className="text-xl font-serif text-brand-900">No Lockers Configured</h2>
          <p className="text-sm text-gray-600 max-w-xs mx-auto">
            You skipped locker configuration in Step 2. You can go back or skip this policy step.
          </p>
        </div>
        <div className="flex justify-between pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={onBack}
            className="text-gray-600 font-medium hover:text-gray-600 transition-colors"
          >
            ← Back
          </button>
          <button
            type="button"
            onClick={() => onNext({ eligible_combos: [], monthly_fee: 0 })}
            className="bg-brand-500 text-white px-8 py-2 rounded-lg font-medium hover:bg-brand-700 transition-colors shadow-sm"
          >
            Skip Policy →
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h2 className="text-xl font-serif text-brand-900">Locker Policy</h2>
        <p className="text-sm text-gray-600">Which shift combinations qualify for a locker? And what is the monthly fee?</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Locker Fee*</label>
          <div className="relative w-40">
            <span className="absolute left-3 top-2 text-gray-600">₹</span>
            <input
              type="number"
              value={fee}
              onChange={(e) => setFee(parseFloat(e.target.value) || 0)}
              className="pl-8 pr-3 py-2 w-full rounded-md border border-gray-200 shadow-sm focus:border-brand-500 focus:ring-brand-500 font-mono"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Eligible Combinations:</p>
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={isAllSelected}
                onChange={(e) => toggleAll(e.target.checked)}
                className="w-4 h-4 text-brand-500 rounded border-gray-300 focus:ring-brand-500"
              />
              <span className="text-xs font-bold text-brand-600 group-hover:text-brand-700 uppercase tracking-tighter">Enable All Combos</span>
            </label>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {SHIFT_COMBINATIONS.map(combo => (
              <label
                key={combo}
                className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all ${
                  eligibleCombos.includes(combo)
                    ? 'bg-brand-50 border-brand-500 shadow-sm'
                    : 'bg-white border-gray-100 hover:border-gray-200'
                }`}
              >
                <input
                  type="checkbox"
                  checked={eligibleCombos.includes(combo)}
                  onChange={() => toggleCombo(combo)}
                  className="w-4 h-4 text-brand-500 rounded border-gray-300 focus:ring-brand-500"
                />
                <span className={`text-sm font-bold font-mono ${
                  eligibleCombos.includes(combo) ? 'text-brand-700' : 'text-gray-600'
                }`}>
                  {combo}
                </span>
              </label>
            ))}
          </div>
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
          onClick={() => onNext({ eligible_combos: eligibleCombos, monthly_fee: fee })}
          className="bg-brand-500 text-white px-8 py-2 rounded-lg font-medium hover:bg-brand-700 transition-colors shadow-sm"
        >
          Next Step →
        </button>
      </div>
    </div>
  )
}
