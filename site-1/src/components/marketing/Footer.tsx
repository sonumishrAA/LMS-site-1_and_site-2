import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-brand-900 text-white py-12 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="bg-brand-500 w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold">L</div>
            <span className="text-xl font-serif">LibraryOS</span>
          </div>
          <p className="text-brand-100/60 text-sm leading-relaxed">
            The complete management system for Indian study rooms and reading libraries. Built for owners, loved by students.
          </p>
        </div>

        <div>
          <h3 className="font-bold mb-4 uppercase tracking-widest text-xs text-brand-100">Product</h3>
          <ul className="space-y-2 text-sm text-brand-100/80">
            <li><Link href="/features" className="hover:text-white transition-colors">Features</Link></li>
            <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
            <li><Link href="/demo" className="hover:text-white transition-colors">Interactive Demo</Link></li>
            <li><Link href="/founder" className="hover:text-white transition-colors">Meet the Founder</Link></li>
            <li><Link href="/library-register" className="hover:text-white transition-colors">Register Library</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold mb-4 uppercase tracking-widest text-xs text-brand-100">Support</h3>
          <ul className="space-y-2 text-sm text-brand-100/80">
            <li><Link href="/help" className="hover:text-white transition-colors">Help Center</Link></li>
            <li><Link href="/help#contact" className="hover:text-white transition-colors">Contact Us</Link></li>
            <li><Link href="/refund" className="hover:text-white transition-colors">Refund Policy</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold mb-4 uppercase tracking-widest text-xs text-brand-100">Legal</h3>
          <ul className="space-y-2 text-sm text-brand-100/80">
            <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
            <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-brand-100 font-medium uppercase tracking-widest">
        <p>© 2026 LibraryOS. All rights reserved.</p>
        <p>Made with ❤️ for Indian Library Owners</p>
      </div>
    </footer>
  )
}
