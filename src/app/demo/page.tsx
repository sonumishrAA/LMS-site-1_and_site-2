'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Bell, Home, Grid, Users, Settings, Search, Filter, Phone, RefreshCcw } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function DemoPage() {
  const [activeTab, setActiveTab] = useState('home')
  const [showDetail, setShowDetail] = useState(false)

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="mb-8 text-center space-y-2">
        <h1 className="text-3xl font-serif text-brand-900">Try LibraryOS</h1>
        <p className="text-gray-600">This is a fully interactive live demo. Click around!</p>
      </div>

      {/* iPhone Mockup */}
      <div className="relative mx-auto border-8 border-gray-900 rounded-[3rem] h-[720px] w-[340px] bg-white shadow-2xl overflow-hidden">
        {/* Notch */}
        <div className="absolute top-0 inset-x-0 h-6 bg-gray-900 z-50 rounded-b-2xl w-32 mx-auto" />
        
        {/* Status Bar */}
        <div className="h-12 bg-white flex items-end justify-between px-8 pb-2">
          <span className="text-xs font-bold">9:41</span>
          <div className="flex gap-1.5 items-center">
            <div className="w-4 h-4 bg-gray-900 rounded-sm" />
            <div className="w-4 h-4 bg-gray-900 rounded-sm" />
          </div>
        </div>

        {/* Content Area */}
        <div className="h-full overflow-y-auto pb-32">
          {activeTab === 'home' && <DemoDashboard />}
          {activeTab === 'seats' && <DemoSeatMap onSeatClick={() => setShowDetail(true)} />}
          {activeTab === 'students' && <DemoStudents />}
        </div>

        {/* Bottom Nav */}
        <div className="absolute bottom-0 inset-x-0 bg-white border-t border-gray-100 h-20 flex items-center justify-around px-2 z-40">
          {[
            { id: 'home', icon: Home, label: 'Home' },
            { id: 'seats', icon: Grid, label: 'Seats' },
            { id: 'students', icon: Users, label: 'Students' },
            { id: 'settings', icon: Settings, label: 'More' },
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex flex-col items-center gap-1 transition-colors",
                activeTab === tab.id ? "text-brand-500" : "text-gray-600"
              )}
            >
              <tab.icon className={cn("w-6 h-6", activeTab === tab.id && "fill-brand-500/10")} />
              <span className="text-[10px] font-bold uppercase tracking-wider">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Detail Sheet Mockup */}
        {showDetail && (
          <div className="absolute inset-0 bg-black/40 z-50 flex items-end">
            <div className="bg-white w-full rounded-t-3xl p-6 space-y-6 animate-in slide-in-from-bottom duration-300">
              <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto" />
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-gray-950">Rahul Kumar</h3>
                  <p className="text-xs text-gray-500">Seat M4 · Morning + Afternoon</p>
                </div>
                <button onClick={() => setShowDetail(false)} className="text-gray-600 font-bold">✕</button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button className="bg-green-500 text-white p-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2">
                  <Phone className="w-4 h-4 fill-white" /> WhatsApp
                </button>
                <button className="bg-brand-500 text-white p-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2">
                  <RefreshCcw className="w-4 h-4" /> Renew
                </button>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Payment Status</span>
                  <span className="text-green-600 font-bold">Paid ✓</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Expires on</span>
                  <span className="text-gray-800 font-bold">15 Sep 2026</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-12 flex flex-col items-center gap-4">
        <p className="text-gray-500 font-medium">Ready to see it with your own data?</p>
        <Link 
          href="/library-register" 
          className="bg-brand-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-brand-700 transition-all shadow-xl shadow-brand-500/20"
        >
          Create Your Library Now
        </Link>
      </div>
    </div>
  )
}

function DemoDashboard() {
  return (
    <div className="p-4 space-y-6 pt-12">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-serif text-brand-900">Sunrise Library</h2>
        <Bell className="w-6 h-6 text-gray-600" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
          <p className="text-2xl font-bold text-blue-900">42</p>
          <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Students</p>
        </div>
        <div className="bg-green-50 p-4 rounded-2xl border border-green-100">
          <p className="text-2xl font-bold text-green-900">₹8.5k</p>
          <p className="text-[10px] font-bold text-green-600 uppercase tracking-widest">Revenue</p>
        </div>
      </div>
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-gray-600 uppercase tracking-widest">Action Needed</h3>
        {[1, 2].map(i => (
          <div key={i} className="bg-red-50 p-4 rounded-2xl border border-red-100 flex justify-between items-center">
            <div className="space-y-1">
              <p className="text-sm font-bold text-red-900">Plan Expired</p>
              <p className="text-[10px] text-red-600 font-medium">Student {i} needs renewal</p>
            </div>
            <button className="text-[10px] font-bold bg-white text-red-600 px-3 py-1 rounded-full shadow-sm">FIX</button>
          </div>
        ))}
      </div>
    </div>
  )
}

function DemoSeatMap({ onSeatClick }: { onSeatClick: () => void }) {
  return (
    <div className="p-4 pt-12 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-serif text-brand-900">Seat Map</h2>
        <Filter className="w-5 h-5 text-gray-600" />
      </div>
      <div className="grid grid-cols-4 gap-2">
        {Array.from({ length: 24 }).map((_, i) => {
          const status = i % 5 === 0 ? 'expired' : i % 3 === 0 ? 'free' : 'occupied'
          return (
            <button 
              key={i} 
              onClick={onSeatClick}
              className={cn(
                "aspect-square rounded-xl border-2 flex items-center justify-center font-bold text-xs transition-transform active:scale-90",
                status === 'free' ? 'bg-white border-gray-100 text-gray-300' :
                status === 'expired' ? 'bg-red-100 border-red-500 text-red-800' :
                'bg-brand-50 border-brand-500 text-brand-800'
              )}
            >
              {i + 1}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function DemoStudents() {
  return (
    <div className="p-4 pt-12 space-y-6">
      <h2 className="text-xl font-serif text-brand-900">Students</h2>
      <div className="relative">
        <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-600" />
        <input disabled placeholder="Search..." className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2 text-sm" />
      </div>
      <div className="space-y-3">
        {['Rahul Kumar', 'Priya Singh', 'Amit Verma', 'Suresh Prasad'].map(name => (
          <div key={name} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-center">
            <div className="flex gap-3 items-center">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-500">{name[0]}</div>
              <p className="font-bold text-sm text-gray-800">{name}</p>
            </div>
            <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded">PAID</span>
          </div>
        ))}
      </div>
    </div>
  )
}
