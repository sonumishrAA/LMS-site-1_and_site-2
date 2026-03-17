export default function TermsPage() {
  return (
    <div className="py-20 px-4 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-[3rem] p-8 md:p-16 shadow-sm border border-gray-100">
          <div className="space-y-4 mb-12 border-b border-gray-100 pb-8">
            <h1 className="text-5xl font-serif text-brand-900">Terms of Service</h1>
            <p className="text-gray-500 font-medium uppercase tracking-widest text-xs">Last updated: March 14, 2026</p>
          </div>

          <div className="prose prose-lg prose-brand text-gray-700 space-y-8">
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-brand-900">1. Acceptance of Terms</h2>
              <p>
                By registering your library on LibraryOS, you agree to comply with these terms. Our service is designed specifically for Indian study room and reading library owners to manage their physical premises and student records.
              </p>
            </section>
            
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-brand-900">2. Subscription & Payments</h2>
              <p>
                LibraryOS operates on a prepaid subscription model. Fees are paid in advance for selected durations (1, 3, 6, or 12 months). All payments are processed securely through Razorpay. Access to management features is granted only upon successful payment verification.
              </p>
            </section>
            
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-brand-900">3. Data Retention & Deletion</h2>
              <p>
                To ensure system performance, we enforce a strict data retention policy. If your subscription expires and remains unpaid for more than 15 days, LibraryOS reserves the right to permanently delete your library records, including student data and payment history. We send multiple reminders via email before this action is taken.
              </p>
            </section>
            
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-brand-900">4. Fair Usage of Automation</h2>
              <p>
                The automated WhatsApp feature is intended for operational communication only (fee receipts, renewal reminders). You agree not to use this feature for marketing, spam, or any activity that violates WhatsApp's own terms of service.
              </p>
            </section>
            
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-brand-900">5. Limitation of Liability</h2>
              <p>
                LibraryOS is provided "as is". While we strive for 100% uptime and data integrity, we are not liable for any business loss, data entry errors by the user, or temporary service interruptions beyond our control.
              </p>
            </section>
          </div>

          <div className="mt-16 pt-8 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-500">By using our services, you acknowledge that you have read and understood these terms.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
