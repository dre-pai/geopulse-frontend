import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatRelative(iso: string): string {
  const then = new Date(iso).getTime()
  const delta = Math.max(0, Date.now() - then)
  const minutes = Math.floor(delta / 60000)
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes} min ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

export function riskTone(level?: string | null): string {
  switch ((level ?? '').toUpperCase()) {
    case 'CRITICAL':
    case 'HIGH':
      return 'text-danger'
    case 'ELEVATED':
      return 'text-alert'
    case 'MODERATE':
      return 'text-calm'
    default:
      return 'text-signal'
  }
}
