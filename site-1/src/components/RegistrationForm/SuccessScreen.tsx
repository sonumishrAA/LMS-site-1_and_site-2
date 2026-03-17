'use client'

import { RegistrationData } from './RegistrationForm'

export default function SuccessScreen({ data }: { data: RegistrationData }) {
  return (
    <div className="max-w-2xl mx-auto py-12 px-4 text-center space-y-8">
      <div className="space-y-4">
        <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto text-4xl animate-bounce">
          ✓
        </div>
        <h1 className="text-3xl font-serif text-brand-900">Your library is ready!</h1>
        <p className="text-gray-600">
          We've set up <strong>{data.library.name}</strong>. You can now log in to the management app.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden text-left">
        <div className="bg-brand-900 p-4 text-white">
          <p className="text-xs uppercase tracking-widest font-bold opacity-70">Login Credentials</p>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase">Management App URL</label>
            <p className="text-brand-500 font-medium">app.libraryos-lms.vercel.app/login</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase">Email</label>
              <p className="text-gray-800 font-mono text-sm">{data.owner.email}</p>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase">Password</label>
              <p className="text-gray-800 font-mono text-sm">•••••••• (set by you)</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-center">
        <button
          onClick={() => window.open('https://app.libraryos-lms.vercel.app', '_blank')}
          className="bg-brand-500 text-white px-8 py-3 rounded-lg font-bold hover:bg-brand-700 transition-colors shadow-lg shadow-brand-100"
        >
          Open Management App →
        </button>
      </div>

      <p className="text-xs text-gray-600">
        A welcome email with these details has been sent to {data.owner.email}.
      </p>
    </div>
  )
}
