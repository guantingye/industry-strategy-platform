import React from 'react'

export function ArrowLeftIcon({ className = 'h-5 w-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function InsightsIcon({ className = 'h-5 w-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path d="M4 19V5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M8 17v-6M12 17V7M16 17v-4M20 17V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
}

export function DatabaseIcon({ className = 'h-5 w-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path d="M4 7c0-2 4-3 8-3s8 1 8 3-4 3-8 3-8-1-8-3Z" stroke="currentColor" strokeWidth="2"/>
      <path d="M4 7v5c0 2 4 3 8 3s8-1 8-3V7" stroke="currentColor" strokeWidth="2"/>
      <path d="M4 12v5c0 2 4 3 8 3s8-1 8-3v-5" stroke="currentColor" strokeWidth="2"/>
    </svg>
  )
}

export function HomeIcon({ className = 'h-5 w-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path d="M3 10.5 12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1v-10.5Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
    </svg>
  )
}
