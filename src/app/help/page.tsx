'use client'

import React, { useState } from 'react'
import { ChevronDown, Mail, MessageSquare, Send, CheckCircle2, AlertCircle } from 'lucide-react'

const faqs = [
  {
    q: "Is there a free trial?",
    a: "No, we don't offer a free trial. You can start with our most affordable 1-month plan for ₹500 to test the features."
  },
  {
    q: "Can I manage multiple libraries?",
    a: "Yes, once you register your first library, you can add more from your dashboard. All libraries are accessible through a single account."
  },
  {
    q: "Can my staff use it too?",
    a: "Yes, you can add staff members from your dashboard and control their permissions."
  },
  {
    q: "What happens if I lose my phone?",
    a: "Your data is securely stored on the cloud. Just log in from any other phone or laptop to continue where you left off."
  },
  {
    q: "How do I send WhatsApp messages?",
    a: "We provide deep links to WhatsApp. One click from your student list will open WhatsApp with a pre-filled message ready to send."
  }
]

export default function HelpPage() {
  const [formData, setFormData] = useState({ name: '', phone: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.phone || !formData.message) return
    
    setStatus('loading')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      if (res.ok) {
        setStatus('success')
        setFormData({ name: '', phone: '', message: '' })
        setTimeout(() => setStatus('idle'), 5000)
      } else {
        setStatus('error')
      }
    } catch (err) {
      setStatus('error')
    }
  }

  return (
    <div className="py-20 px-4">
      <div className="max-w-4xl mx-auto space-y-20">
        
        {/* FAQ Section */}
        <div className="space-y-12">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-serif text-brand-900">How can we help?</h1>
            <p className="text-gray-500 max-w-lg mx-auto">
              Everything you need to know about LibraryOS. Can't find an answer? Contact us below.
            </p>
          </div>

          <div className="grid gap-4">
            {faqs.map((faq, i) => (
              <details key={i} className="group bg-white border border-gray-100 rounded-3xl overflow-hidden transition-all hover:border-brand-500/30">
                <summary className="p-6 flex justify-between items-center cursor-pointer font-bold text-gray-900 select-none">
                  {faq.q}
                  <ChevronDown className="w-5 h-5 text-gray-600 group-open:rotate-180 transition-transform" />
                </summary>
                <div className="px-6 pb-6 text-gray-600 leading-relaxed text-sm">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <div id="contact" className="bg-brand-900 rounded-[3rem] p-8 md:p-12 text-white scroll-mt-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <h2 className="text-4xl font-serif">Get in touch.</h2>
              <p className="text-brand-100/60 leading-relaxed">
                Whether you have a feature request, found a bug, or just want to say hi—we are all ears.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                    <Mail className="w-5 h-5 text-brand-500" />
                  </div>
                  <p className="font-bold">sonuraj1abc@gmail.com</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-brand-500" />
                  </div>
                  <p className="font-bold">WhatsApp: +91 8306709245</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 space-y-4 shadow-2xl relative">
              {status === 'success' && (
                <div className="absolute inset-0 bg-white rounded-3xl z-10 flex flex-col items-center justify-center text-center p-8 space-y-4">
                  <CheckCircle2 className="w-16 h-16 text-green-500" />
                  <h3 className="text-2xl font-serif text-brand-900">Message Sent!</h3>
                  <p className="text-gray-500">We'll get back to you within 24 hours.</p>
                  <button onClick={() => setStatus('idle')} className="text-brand-500 font-bold hover:underline">Send another message</button>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Your Name</label>
                <input 
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2 text-gray-900 text-sm focus:border-brand-500 outline-none transition-colors" 
                  placeholder="John Doe" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Phone Number</label>
                <input 
                  required
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2 text-gray-900 text-sm focus:border-brand-500 outline-none transition-colors" 
                  placeholder="8306709245" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Message</label>
                <textarea 
                  required
                  rows={4} 
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2 text-gray-900 text-sm focus:border-brand-500 outline-none resize-none transition-colors" 
                  placeholder="How can we help?" 
                />
              </div>

              {status === 'error' && (
                <div className="p-3 bg-red-50 text-red-600 rounded-xl text-xs font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" /> Failed to send message. Please try again.
                </div>
              )}

              <button 
                type="submit" 
                disabled={status === 'loading'}
                className="w-full bg-brand-500 text-white py-3 rounded-xl font-bold hover:bg-brand-700 transition-colors shadow-lg shadow-brand-500/20 disabled:opacity-50"
              >
                {status === 'loading' ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
