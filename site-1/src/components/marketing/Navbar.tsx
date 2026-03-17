'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const navLinks = [
    { label: 'Features', href: '/features' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Demo', href: '/demo' },
    { label: 'Help', href: '/help' },
  ]

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-brand-500 w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold">L</div>
            <span className="text-xl font-serif text-brand-900">LibraryOS</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link 
                key={link.label} 
                href={link.href}
                className="text-sm font-medium text-gray-600 hover:text-brand-500 transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <Link 
              href="/library-register" 
              className="bg-brand-500 text-white px-5 py-2 rounded-lg font-bold text-sm hover:bg-brand-700 transition-colors shadow-lg shadow-brand-100"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="text-gray-600"
              aria-label={isOpen ? "Close menu" : "Open menu"}
            >
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 px-4 py-6 space-y-4">
          {navLinks.map((link) => (
            <Link 
              key={link.label} 
              href={link.href}
              className="block text-lg font-medium text-gray-900"
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link 
            href="/library-register" 
            className="block w-full bg-brand-500 text-white text-center py-3 rounded-lg font-bold"
            onClick={() => setIsOpen(false)}
          >
            Register Your Library
          </Link>
        </div>
      )}
    </nav>
  )
}
