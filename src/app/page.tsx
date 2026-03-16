import Link from 'next/link'
import { CheckCircle2, Phone, CreditCard, LayoutGrid, Zap, ShieldCheck } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-brand-900 text-white py-20 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/20 rounded-full -mr-48 -mt-48 blur-3xl" />
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full border border-white/10 text-brand-100 text-xs font-bold uppercase tracking-widest">
              <Zap className="w-3 h-3 fill-current" />
              Built for Indian Library Owners
            </div>
            <h1 className="text-5xl md:text-7xl font-serif leading-tight">
              Manage Your Library <span className="text-blue-300 italic">From Your Phone.</span>
            </h1>
            <p className="text-xl text-brand-100/80 max-w-xl leading-relaxed">
              Stop using registers and Excel. Manage seats, collect fees, and send WhatsApp reminders automatically with LibraryOS.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link 
                href="/library-register" 
                className="bg-brand-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-brand-700 transition-all shadow-xl shadow-brand-500/20 text-center"
              >
                Register Your Library
              </Link>
              <Link 
                href="/demo" 
                className="bg-white/10 text-white border border-white/20 px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/20 transition-all text-center"
              >
                See Live Demo
              </Link>
            </div>
            <div className="flex items-center gap-6 pt-4 text-xs font-bold text-brand-100/60 uppercase tracking-widest">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                No Install Needed
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                ₹0 Setup Fee
              </div>
            </div>
          </div>
          
          <div className="hidden lg:block relative">
            <div className="bg-gradient-to-tr from-brand-500 to-blue-400 p-1 rounded-[2.5rem] shadow-2xl rotate-3">
              <div className="bg-gray-950 rounded-[2.3rem] overflow-hidden aspect-[9/19.5] w-[320px] mx-auto border-8 border-gray-900">
                <div className="bg-white h-full p-4 space-y-6 overflow-hidden">
                  <div className="h-4 w-20 bg-gray-100 rounded-full mx-auto" />
                  <div className="flex justify-between items-center">
                    <div className="w-10 h-10 bg-brand-500 rounded-lg" />
                    <div className="w-8 h-8 bg-gray-100 rounded-full" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="h-24 bg-brand-50 rounded-2xl border border-brand-100" />
                    <div className="h-24 bg-amber-50 rounded-2xl border border-amber-100" />
                  </div>
                  <div className="space-y-3">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="h-16 bg-gray-50 rounded-xl border border-gray-100" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pain Points Section */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <h2 className="text-sm font-bold text-brand-500 uppercase tracking-[0.2em]">The Old Way</h2>
            <p className="text-4xl md:text-5xl font-serif text-brand-900 leading-tight">
              Registers and Excel are <span className="text-red-500">killing</span> your efficiency.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Data Loss', desc: 'Registers get old, torn, or lost. Excel files get corrupted or deleted.', icon: '📉' },
              { title: 'Manual Reminders', desc: 'Calling every student for fees is exhausting and unprofessional.', icon: '📞' },
              { title: 'Shift Conflicts', desc: 'Double-booking a seat during different shifts is a nightmare to manage.', icon: '🤯' },
            ].map(item => (
              <div key={item.title} className="p-8 rounded-3xl bg-gray-50 border border-gray-100 space-y-4">
                <div className="text-4xl">{item.icon}</div>
                <h3 className="text-xl font-bold text-gray-900">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section className="py-24 px-4 bg-brand-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl md:text-5xl font-serif text-brand-900 leading-tight">
                Everything you need to <span className="text-brand-500">grow</span> your business.
              </h2>
              
              <div className="space-y-6">
                {[
                  { title: 'Interactive Seat Map', desc: 'Visual grid showing occupied, free, and expiring seats in real-time.', icon: LayoutGrid },
                  { title: 'Automatic WhatsApp', desc: 'Send fee reminders and admission receipts with one tap.', icon: Phone },
                  { title: 'Multi-Shift Management', desc: 'Support for Morning, Afternoon, Evening, and Night shifts without conflicts.', icon: Zap },
                  { title: 'Fee History & Reports', desc: 'Track every rupee and see your revenue growth month-over-month.', icon: CreditCard },
                ].map(feature => (
                  <div key={feature.title} className="flex gap-4">
                    <div className="bg-white p-3 rounded-2xl shadow-sm h-fit border border-brand-100 text-brand-500">
                      <feature.icon className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-bold text-gray-900">{feature.title}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-brand-900 rounded-[3rem] p-12 text-white space-y-8 shadow-2xl relative overflow-hidden">
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-500/20 rounded-full -ml-32 -mb-32 blur-3xl" />
              <ShieldCheck className="w-12 h-12 text-brand-500" />
              <h3 className="text-3xl font-serif">Security first approach.</h3>
              <ul className="space-y-4 text-brand-100/80">
                <li className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-500" />
                  Cloud-based storage (Never lose data)
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-500" />
                  Role-based access for your staff
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-500" />
                  Encrypted personal information
                </li>
              </ul>
              <div className="pt-4">
                <Link href="/library-register" className="inline-block bg-white text-brand-900 px-8 py-3 rounded-xl font-bold hover:bg-brand-100 transition-colors">
                  Join 100+ Libraries →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-white text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <h2 className="text-5xl font-serif text-brand-900 leading-tight">Ready to modernize your library?</h2>
          <p className="text-xl text-gray-600">Join the smart owners who are saving 10+ hours every week.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link 
              href="/library-register" 
              className="bg-brand-500 text-white px-12 py-4 rounded-xl font-bold text-lg hover:bg-brand-700 transition-all shadow-xl shadow-brand-500/20"
            >
              Register Now
            </Link>
            <Link 
              href="/pricing" 
              className="bg-gray-100 text-gray-800 px-12 py-4 rounded-xl font-bold text-lg hover:bg-gray-200 transition-all"
            >
              View Pricing
            </Link>
          </div>
          <p className="text-sm text-gray-600 font-medium">INSTANT SETUP · NO CREDIT CARD REQUIRED</p>
        </div>
      </section>
    </div>
  )
}
