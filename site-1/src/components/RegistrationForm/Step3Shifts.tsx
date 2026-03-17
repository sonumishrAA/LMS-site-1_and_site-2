'use client'

import { useForm, useFieldArray } from 'react-hook-form'

type Shift = {
  code: 'M' | 'A' | 'E' | 'N'
  name: string
  start_time: string
  end_time: string
}

export default function Step3Shifts({
  data,
  onNext,
  onBack,
}: {
  data: Shift[]
  onNext: (data: Shift[]) => void
  onBack: () => void
}) {
  const { register, handleSubmit, control } = useForm<{ shifts: Shift[] }>({
    defaultValues: { shifts: data },
  })

  const { fields } = useFieldArray({
    control,
    name: 'shifts',
  })

  return (
    <form onSubmit={handleSubmit((values) => onNext(values.shifts))} className="space-y-8">
      <div className="space-y-1">
        <h2 className="text-xl font-serif text-brand-900">Shift Timings</h2>
        <p className="text-sm text-gray-600">Set the start and end times for each shift.</p>
      </div>

      <div className="space-y-4">
        {fields.map((field, index) => (
          <div key={field.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-bold text-brand-700">{field.name} Shift</span>
              <span className="text-[10px] font-mono bg-brand-100 text-brand-700 px-2 py-0.5 rounded">
                CODE: {field.code}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500">Start Time</label>
                <input
                  type="time"
                  {...register(`shifts.${index}.start_time` as const)}
                  className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 text-sm shadow-sm focus:border-brand-500 focus:ring-brand-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500">End Time</label>
                <input
                  type="time"
                  {...register(`shifts.${index}.end_time` as const)}
                  className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 text-sm shadow-sm focus:border-brand-500 focus:ring-brand-500"
                />
              </div>
            </div>
          </div>
        ))}
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
          type="submit"
          className="bg-brand-500 text-white px-8 py-2 rounded-lg font-medium hover:bg-brand-700 transition-colors shadow-sm"
        >
          Next Step →
        </button>
      </div>
    </form>
  )
}
