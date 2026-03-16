export default function StepProgress({ currentStep }: { currentStep: number }) {
  const steps = [
    'Info',
    'Seats',
    'Shifts',
    'Pricing',
    'Locker',
    'Account',
    'Payment',
  ]

  return (
    <div className="flex items-center justify-between w-full">
      {steps.map((label, idx) => (
        <div key={label} className="flex flex-col items-center flex-1 relative">
          {/* Connector Line */}
          {idx !== 0 && (
            <div
              className={`absolute top-4 left-[-50%] w-full h-[2px] z-0 ${
                idx < currentStep ? 'bg-brand-500' : 'bg-gray-200'
              }`}
            />
          )}

          {/* Step Circle */}
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium z-10 transition-colors ${
              idx + 1 <= currentStep
                ? 'bg-brand-500 text-white'
                : 'bg-white border-2 border-gray-200 text-gray-600'
            }`}
          >
            {idx + 1}
          </div>

          {/* Label */}
          <span
            className={`mt-2 text-[10px] md:text-xs font-medium uppercase tracking-wider ${
              idx + 1 <= currentStep ? 'text-brand-700' : 'text-gray-600'
            }`}
          >
            {label}
          </span>
        </div>
      ))}
    </div>
  )
}
