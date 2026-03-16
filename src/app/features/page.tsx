import { LayoutGrid, Phone, Zap, CreditCard, ShieldCheck, UserPlus, History, BarChart3, Cloud, Search } from 'lucide-react'

export default function FeaturesPage() {
  const features = [
    { title: 'Interactive Seat Map', desc: 'Visual grid of your library. See who is sitting where, who is expiring, and which seats are vacant in one glance.', icon: LayoutGrid },
    { title: 'WhatsApp Reminders', desc: 'Send fee reminders, admission receipts, and expiration alerts directly to student phones with a single tap.', icon: Phone },
    { title: 'Multi-Shift Logic', desc: 'Manage Morning, Afternoon, Evening, and Night shifts. Our system prevents double-booking and shift overlaps.', icon: Zap },
    { title: 'Fee Tracking', desc: 'Maintain a digital ledger of every payment. Know exactly how much revenue you generated this month.', icon: CreditCard },
    { title: 'Staff Accounts', desc: 'Add up to 2 staff members. Give them restricted access to manage daily operations while you keep control.', icon: ShieldCheck },
    { title: 'Quick Admission', desc: 'Admit a student in under 60 seconds. Capture photo, address, and shift details digitally.', icon: UserPlus },
    { title: 'Renewal History', desc: 'Complete history of every student. See how long they have been with your library and their payment consistency.', icon: History },
    { title: 'Growth Reports', desc: 'Visual charts showing student growth and revenue trends. Make data-driven decisions for your business.', icon: BarChart3 },
    { title: 'Cloud Backup', desc: 'Your data is stored securely in the cloud. Even if you lose your phone, your library data is safe.', icon: Cloud },
    { title: 'Search & Filters', desc: 'Find any student by name, phone, or seat number instantly. No more flipping through pages.', icon: Search },
  ]

  return (
    <div className="py-20">
      <div className="max-w-7xl mx-auto px-4 text-center space-y-4 mb-20">
        <h1 className="text-5xl font-serif text-brand-900">Features built for your growth.</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">LibraryOS replaces 5 different tools with one simple mobile app.</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feat) => (
          <div key={feat.title} className="p-8 rounded-[2rem] bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow space-y-4">
            <div className="w-12 h-12 bg-brand-50 rounded-2xl flex items-center justify-center text-brand-500">
              <feat.icon className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">{feat.title}</h3>
            <p className="text-gray-600 text-sm leading-relaxed">{feat.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
