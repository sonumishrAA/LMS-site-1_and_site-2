import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// WhatsApp — always correct
export function whatsappLink(phone: string, message?: string): string {
  const base = `https://wa.me/91${phone}`
  return message ? `${base}?text=${encodeURIComponent(message)}` : base
}

// Renewal end date
export function calcRenewalEndDate(currentEndDate: string, planMonths: number): Date {
  const base = new Date(Math.max(
    new Date(currentEndDate).getTime(),
    new Date().getTime()
  ))
  base.setMonth(base.getMonth() + planMonths)
  return base
}

// Days until a date
export function daysUntil(dateStr: string): number {
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86400000)
}

// Seat status from DB query counts
export function seatStatus(
  activeCount: number,
  daysLeft: number | null,
  expiredCount: number
): 'free' | 'occupied' | 'expiring' | 'expired' {
  if (activeCount > 0 && daysLeft !== null && daysLeft <= 7) return 'expiring'
  if (activeCount > 0) return 'occupied'
  if (expiredCount > 0) return 'expired'
  return 'free'
}

// Format phone for display ("8306709245")
export function formatPhone(phone: string): string {
  return `${phone.slice(0,5)} ${phone.slice(5)}`
}
