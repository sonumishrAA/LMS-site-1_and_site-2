export default function RefundPage() {
  return (
    <div className="py-20 px-4 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-[3rem] p-8 md:p-16 shadow-sm border border-gray-100">
          <div className="space-y-4 mb-12 border-b border-gray-100 pb-8">
            <h1 className="text-5xl font-serif text-brand-900">Refund Policy</h1>
            <p className="text-gray-500 font-medium uppercase tracking-widest text-xs">Last updated: March 14, 2026</p>
          </div>

          <div className="prose prose-lg prose-brand text-gray-700 space-y-8">
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-brand-900">1. Subscription Cancellation</h2>
              <p>
                Once a subscription is paid for (1, 3, 6, or 12 months), it is considered active and non-refundable. We encourage you to fully explore the interactive demo and system features before making a payment.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-brand-900">2. Technical Issues</h2>
              <p>
                In the rare event of a prolonged system outage (more than 48 continuous hours) that prevents you from managing your library, we will extend your subscription duration by 5 days for every 24 hours of downtime. No cash refunds will be issued for downtime.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-brand-900">3. Duplicate Payments</h2>
              <p>
                If you have been charged twice for the same subscription due to a technical error at our end or the payment gateway (Razorpay), please contact us at <span className="font-bold text-brand-500">sonuraj1abc@gmail.com</span> with the transaction IDs. The duplicate amount will be refunded to the original payment source within 7-10 working days.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-brand-900">4. Policy Changes</h2>
              <p>
                LibraryOS reserves the right to modify this refund policy at any time. Changes will be updated on this page and notified via the management dashboard.
              </p>
            </section>
          </div>

          <div className="mt-16 pt-8 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-500">Questions about your payment? Contact us at <a href="mailto:sonuraj1abc@gmail.com" className="text-brand-500 font-bold hover:underline">sonuraj1abc@gmail.com</a></p>
          </div>
        </div>
      </div>
    </div>
  )
}
