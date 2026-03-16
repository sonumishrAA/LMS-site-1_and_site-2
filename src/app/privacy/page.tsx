export default function PrivacyPage() {
  return (
    <div className="py-20 px-4 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-[3rem] p-8 md:p-16 shadow-sm border border-gray-100">
          <div className="space-y-4 mb-12 border-b border-gray-100 pb-8">
            <h1 className="text-5xl font-serif text-brand-900">Privacy Policy</h1>
            <p className="text-gray-500 font-medium uppercase tracking-widest text-xs">Last updated: March 14, 2026</p>
          </div>

          <div className="prose prose-lg prose-brand text-gray-700 space-y-8">
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-brand-900">1. Information Collection</h2>
              <p>
                We collect information necessary to run your library management system. This includes:
              </p>
              <ul className="list-disc ml-6 space-y-2">
                <li><strong>Library Details:</strong> Name, address, phone number, and branch configuration.</li>
                <li><strong>Student Records:</strong> Name, contact details, shift timings, and seat assignments provided by you.</li>
                <li><strong>Account Info:</strong> Owner and staff email addresses used for login and authentication.</li>
              </ul>
            </section>
            
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-brand-900">2. How We Use Data</h2>
              <p>
                Your library data is yours. We use it exclusively to provide you with management features like the seat map, fee tracking, and notification system. We never sell your business data or your students' contact information to third-party advertisers.
              </p>
            </section>
            
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-brand-900">3. Data Security</h2>
              <p>
                We use industry-standard encryption and secure cloud infrastructure powered by Supabase and PostgreSQL. All sensitive information is encrypted at rest and during transit. Access to your library's data is restricted to you and the staff members you explicitly authorize.
              </p>
            </section>
            
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-brand-900">4. User Responsibility</h2>
              <p>
                As the library owner, you are responsible for the accuracy of the data you enter. You must ensure you have the necessary consent from your students to store their information in this management system.
              </p>
            </section>
            
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-brand-900">5. Contact Us</h2>
              <p>
                If you have any questions regarding your data or our privacy practices, please reach out to our privacy officer at <span className="font-bold text-brand-500">sonuraj1abc@gmail.com</span>.
              </p>
            </section>
          </div>

          <div className="mt-16 pt-8 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-500">Your privacy and data security are our top priorities.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
