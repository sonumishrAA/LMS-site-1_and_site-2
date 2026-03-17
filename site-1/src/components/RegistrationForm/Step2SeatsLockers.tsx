'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const schema = z.object({
  is_gender_neutral: z.boolean(),
  male_seats: z.number().min(0),
  female_seats: z.number().min(0),
  neutral_seats: z.number().min(0),
  has_lockers: z.boolean(),
  male_lockers: z.number().min(0),
  female_lockers: z.number().min(0),
  neutral_lockers: z.number().min(0),
}).refine(data => {
  if (data.is_gender_neutral) return data.neutral_seats > 0
  return data.male_seats > 0 || data.female_seats > 0
}, {
  message: "At least one seat must be configured",
  path: ['neutral_seats']
})

type FormData = z.infer<typeof schema>

export default function Step2SeatsLockers({
  data,
  onNext,
  onBack,
}: {
  data: { seats: any, lockers: any }
  onNext: (data: { seats: any, lockers: any }) => void
  onBack: () => void
}) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { ...data.seats, ...data.lockers },
  })

  const isNeutral = watch('is_gender_neutral')
  const hasLockers = watch('has_lockers')

  const onSubmit = (values: FormData) => {
    onNext({
      seats: {
        is_gender_neutral: values.is_gender_neutral,
        male_seats: values.male_seats,
        female_seats: values.female_seats,
        neutral_seats: values.neutral_seats,
      },
      lockers: {
        has_lockers: values.has_lockers,
        male_lockers: values.male_lockers,
        female_lockers: values.female_lockers,
        neutral_lockers: values.neutral_lockers,
      }
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="space-y-1">
        <h2 className="text-xl font-serif text-brand-900">Seats & Lockers</h2>
        <p className="text-sm text-gray-600">Configure your capacity. You can rename these later.</p>
      </div>

      <div className="space-y-6">
        {/* Gender Toggle */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div>
            <p className="font-medium text-gray-800">Gender-Neutral Library?</p>
            <p className="text-xs text-gray-500">Enable if all seats are open to everyone.</p>
          </div>
          <input
            type="checkbox"
            {...register('is_gender_neutral')}
            className="w-5 h-5 text-brand-500 rounded border-gray-300 focus:ring-brand-500"
          />
        </div>

        {/* Seats Configuration */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-600">Seat Capacity</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {isNeutral ? (
              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-gray-700">Total Neutral Seats</label>
                <input
                  type="number"
                  {...register('neutral_seats', { valueAsNumber: true })}
                  className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 shadow-sm focus:border-brand-500 focus:ring-brand-500"
                />
              </div>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Male Seats</label>
                  <input
                    type="number"
                    {...register('male_seats', { valueAsNumber: true })}
                    className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 shadow-sm focus:border-brand-500 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Female Seats</label>
                  <input
                    type="number"
                    {...register('female_seats', { valueAsNumber: true })}
                    className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 shadow-sm focus:border-brand-500 focus:ring-brand-500"
                  />
                </div>
              </>
            )}
          </div>
          {errors.neutral_seats && <p className="text-xs text-red-500">{errors.neutral_seats.message}</p>}
        </div>

        {/* Lockers Configuration */}
        <div className="space-y-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-600">Lockers</h3>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">Enable Lockers</span>
              <input
                type="checkbox"
                {...register('has_lockers')}
                className="w-5 h-5 text-brand-500 rounded border-gray-300 focus:ring-brand-500"
              />
            </div>
          </div>

          {hasLockers && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {isNeutral ? (
                <div className="md:col-span-3">
                  <label className="block text-sm font-medium text-gray-700">Total Neutral Lockers</label>
                  <input
                    type="number"
                    {...register('neutral_lockers', { valueAsNumber: true })}
                    className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 shadow-sm focus:border-brand-500 focus:ring-brand-500"
                  />
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Male Lockers</label>
                    <input
                      type="number"
                      {...register('male_lockers', { valueAsNumber: true })}
                      className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 shadow-sm focus:border-brand-500 focus:ring-brand-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Female Lockers</label>
                    <input
                      type="number"
                      {...register('female_lockers', { valueAsNumber: true })}
                      className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 shadow-sm focus:border-brand-500 focus:ring-brand-500"
                    />
                  </div>
                </>
              )}
            </div>
          )}
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
          type="submit"
          className="bg-brand-500 text-white px-8 py-2 rounded-lg font-medium hover:bg-brand-700 transition-colors shadow-sm"
        >
          Next Step →
        </button>
      </div>
    </form>
  )
}
