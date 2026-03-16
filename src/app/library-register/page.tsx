import RegistrationForm from '@/components/RegistrationForm/RegistrationForm'

export default function LibraryRegisterPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif text-brand-900 mb-4">Register Your Library</h1>
          <p className="text-xl text-gray-600">Join 100+ libraries managing their business smartly with LibraryOS.</p>
        </div>
        <RegistrationForm />
      </div>
    </div>
  )
}
