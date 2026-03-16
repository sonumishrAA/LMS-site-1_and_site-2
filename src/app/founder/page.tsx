'use client'

import { Mail, Linkedin, Twitter, ExternalLink, MapPin, MessageCircle, Code2, Cpu, Globe, Rocket, Award, GraduationCap } from 'lucide-react'
import Link from 'next/link'

export default function FounderPage() {
  return (
    <div className="py-20 px-4 bg-white min-h-screen">
      <div className="max-w-5xl mx-auto space-y-20">
        
        {/* Profile Hero */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-4 space-y-6">
            <div className="aspect-square rounded-[3rem] bg-gray-100 overflow-hidden border-8 border-gray-50 shadow-2xl relative group">
              <img 
                src="/sonu.jpg" 
                alt="Sonu Mishra" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback if image not found
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.parentElement!.innerHTML = '<div class="w-full h-full bg-brand-900 flex items-center justify-center text-white text-7xl font-serif">S</div>';
                }}
              />
              <div className="absolute inset-0 bg-brand-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-serif text-brand-900">Sonu Mishra</h1>
                <p className="text-brand-500 font-bold uppercase tracking-widest text-xs">Founder, LibraryOS</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-[10px] font-bold uppercase">NIT Rourkela '26</span>
                <span className="px-3 py-1 bg-brand-50 text-brand-600 rounded-full text-[10px] font-bold uppercase">SaaS Builder</span>
              </div>
            </div>
          </div>

          <div className="md:col-span-8 space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl font-serif text-gray-900 leading-tight">
                "I build production-grade software from scratch — <span className="text-brand-500">alone, on deadline, and under real constraints.</span>"
              </h2>
              <div className="flex flex-wrap gap-6 text-sm font-medium text-gray-500">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-brand-500" /> Patna, Bihar, India
                </div>
                <a href="mailto:sonuraj1abc@gmail.com" className="flex items-center gap-2 hover:text-brand-500 transition-colors">
                  <Mail className="w-4 h-4 text-brand-500" /> sonuraj1abc@gmail.com
                </a>
                <a href="https://wa.me/918306709245" className="flex items-center gap-2 hover:text-brand-500 transition-colors">
                  <MessageCircle className="w-4 h-4 text-brand-500" /> wa.me/918306709245
                </a>
              </div>
            </div>
            
            <p className="text-xl text-gray-600 leading-relaxed font-medium">
              I'm Sonu Mishra — a B.Tech student at NIT Rourkela and a self-taught full-stack developer specializing in system design, software architecture, and AI-powered products.
            </p>
          </div>
        </section>

        {/* Core Philosophy */}
        <section className="bg-brand-900 rounded-[3rem] p-12 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/20 rounded-full -mr-32 -mt-32 blur-3xl" />
          <div className="max-w-3xl space-y-6 relative z-10">
            <h3 className="text-3xl font-serif">I don't just write code. I architect systems.</h3>
            <p className="text-brand-100/80 leading-relaxed text-lg">
              Multi-tenant SaaS platforms, encrypted communication layers, real-time dashboards, conflict-detection engines, and marketplace backends — all built solo, from requirements to production deployment.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-8 border-t border-white/10">
              <div className="space-y-1">
                <p className="text-2xl font-bold font-mono">3×</p>
                <p className="text-[10px] uppercase font-bold text-brand-500 tracking-widest">SaaS Built</p>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold font-mono">1×</p>
                <p className="text-[10px] uppercase font-bold text-brand-500 tracking-widest">Open Source</p>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold font-mono">Go</p>
                <p className="text-[10px] uppercase font-bold text-brand-500 tracking-widest">Specialization</p>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold font-mono">AI</p>
                <p className="text-[10px] uppercase font-bold text-brand-500 tracking-widest">Integrated</p>
              </div>
            </div>
          </div>
        </section>

        {/* Experience & Projects */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4 space-y-12">
            <section className="space-y-6">
              <h3 className="text-xs font-bold text-gray-600 uppercase tracking-widest flex items-center gap-2">
                <GraduationCap className="w-4 h-4" /> Credentials
              </h3>
              <div className="space-y-6">
                <div className="group">
                  <p className="font-bold text-gray-900 group-hover:text-brand-500 transition-colors">NIT Rourkela</p>
                  <p className="text-sm text-gray-500">B.Tech — Ceramic Engineering</p>
                  <p className="text-xs font-mono text-gray-600">Batch 2022 – 2026</p>
                </div>
                <div className="group">
                  <p className="font-bold text-gray-900 group-hover:text-brand-500 transition-colors flex items-center gap-2">
                    Open Source <Award className="w-3.5 h-3.5 text-brand-500" />
                  </p>
                  <p className="text-sm text-gray-500">projectdiscovery/nuclei</p>
                  <p className="text-xs text-gray-600 leading-snug">XSS Context Analyzer — Merged + Bounty Awarded</p>
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <h3 className="text-xs font-bold text-gray-600 uppercase tracking-widest flex items-center gap-2">
                <Code2 className="w-4 h-4" /> Core Stack
              </h3>
              <div className="flex flex-wrap gap-2">
                {['React', 'Next.js', 'Angular', 'Node.js', 'Express', 'Go', 'PostgreSQL', 'Supabase', 'AI APIs'].map(s => (
                  <span key={s} className="px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold text-gray-600">{s}</span>
                ))}
              </div>
            </section>
          </div>

          <div className="lg:col-span-8 space-y-12">
            <section className="space-y-8">
              <h3 className="text-xs font-bold text-gray-600 uppercase tracking-widest flex items-center gap-2">
                <Rocket className="w-4 h-4" /> Production Builds
              </h3>
              
              <div className="space-y-12">
                {/* LibraryOS */}
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-2xl font-serif text-brand-900">LibraryOS — Management SaaS</h4>
                      <p className="text-sm font-bold text-brand-500">libraryos-lms.vercel.app · 2026 · Current</p>
                    </div>
                    <div className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-[10px] font-bold">LIVE</div>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Designed from first principles to solve shift-based seat conflicts in Indian study libraries. Features real-time seat mapping, role-based access, and automated WhatsApp reminders for Tier-2 India's constraints.
                  </p>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-xs text-gray-500">
                    <li className="flex gap-2"> <div className="w-1 h-1 bg-brand-500 rounded-full mt-1.5 shrink-0" /> Multi-tenant PostgreSQL architecture</li>
                    <li className="flex gap-2"> <div className="w-1 h-1 bg-brand-500 rounded-full mt-1.5 shrink-0" /> 15+ combo shift conflict engine</li>
                    <li className="flex gap-2"> <div className="w-1 h-1 bg-brand-500 rounded-full mt-1.5 shrink-0" /> 8-step atomic onboarding flow</li>
                    <li className="flex gap-2"> <div className="w-1 h-1 bg-brand-500 rounded-full mt-1.5 shrink-0" /> Supabase Edge Functions (Deno)</li>
                  </ul>
                </div>

                {/* Bharat Security */}
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-2xl font-serif text-brand-900">Bharat Security — Cyber Platform</h4>
                      <p className="text-sm font-bold text-brand-500">bharatsecurity.net · 2025-2026</p>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    A secure service platform for a cybersecurity firm. Built solo in 2 months, featuring end-to-end AES encryption and a custom coordinate-based WYSIWYG CMS.
                  </p>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-xs text-gray-500">
                    <li className="flex gap-2"> <div className="w-1 h-1 bg-brand-500 rounded-full mt-1.5 shrink-0" /> CryptoJS AES client/server encryption</li>
                    <li className="flex gap-2"> <div className="w-1 h-1 bg-brand-500 rounded-full mt-1.5 shrink-0" /> HTTP Short Polling via RxJS</li>
                    <li className="flex gap-2"> <div className="w-1 h-1 bg-brand-500 rounded-full mt-1.5 shrink-0" /> Custom coordinate CMS grid system</li>
                    <li className="flex gap-2"> <div className="w-1 h-1 bg-brand-500 rounded-full mt-1.5 shrink-0" /> Automated secure credentials</li>
                  </ul>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* How I Build */}
        <section className="bg-gray-50 rounded-[3rem] p-12 grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-6">
            <h3 className="text-2xl font-serif text-gray-900 leading-tight">I start with architecture — not code.</h3>
            <p className="text-gray-600 leading-relaxed">
              Before writing a single line, I map out the data model, the permission boundaries, the failure points, and the user flows. This is why my systems tend to hold up under real usage.
            </p>
            <p className="text-gray-600 leading-relaxed italic border-l-4 border-brand-500 pl-6">
              "Failed startups teach you more than successful ones. UWC did not scale — but the marketplace architecture, OTP flows, and payment integration I built there directly influenced LibraryOS."
            </p>
          </div>
          <div className="space-y-8">
            <div className="p-6 bg-white rounded-3xl shadow-sm border border-gray-100">
              <h4 className="font-bold text-gray-900 mb-2">Obsessed with Constraints</h4>
              <p className="text-sm text-gray-500">The best solutions come from understanding what you can't do — not what you can. Every architectural choice has a reason.</p>
            </div>
            <div className="p-6 bg-white rounded-3xl shadow-sm border border-gray-100">
              <h4 className="font-bold text-gray-900 mb-2">Clear Communication</h4>
              <p className="text-sm text-gray-500">I've taught JEE/NEET Mathematics and Physics. I write code the same way I'd explain it to a student: clearly, with no unnecessary complexity.</p>
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="text-center space-y-8 pb-20">
          <div className="space-y-2">
            <h2 className="text-4xl font-serif text-brand-900">Available for Hire</h2>
            <p className="text-gray-500">Complex projects, production architecture, full-stack builds.</p>
          </div>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="mailto:sonuraj1abc@gmail.com" className="bg-brand-500 text-white px-10 py-4 rounded-2xl font-bold shadow-xl shadow-brand-500/20 hover:bg-brand-700 transition-all">
              Email Sonu
            </a>
            <a href="https://wa.me/918306709245" className="bg-white border border-gray-200 text-gray-800 px-10 py-4 rounded-2xl font-bold hover:bg-gray-50 transition-all">
              WhatsApp Me
            </a>
          </div>
          <p className="text-xs font-bold text-gray-600 uppercase tracking-widest">© 2026 Sonu Mishra · LibraryOS</p>
        </section>

      </div>
    </div>
  )
}
