import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { DatabaseIcon, HomeIcon, InsightsIcon } from './Icons'
import GlassCard from './GlassCard'

function DockButton({ active, onClick, title, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-label={title}
      className={[
        'h-10 w-10 md:h-11 md:w-11 rounded-xl border transition flex items-center justify-center',
        active ? 'bg-white/12 border-white/20' : 'bg-white/5 border-white/10 hover:bg-white/10',
      ].join(' ')}
    >
      {children}
    </button>
  )
}

export default function DockNav() {
  const nav = useNavigate()
  const loc = useLocation()

  return (
    <div className="fixed bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 z-40">
      <GlassCard className="px-3 py-2">
        <div className="flex items-center gap-2">
          <DockButton active={loc.pathname === '/'} onClick={() => nav('/')} title="Home">
            <HomeIcon />
          </DockButton>
          <DockButton active={loc.pathname === '/insights'} onClick={() => nav('/insights')} title="Insights">
            <InsightsIcon />
          </DockButton>
          <DockButton active={loc.pathname === '/startups'} onClick={() => nav('/startups')} title="Startups">
            <DatabaseIcon />
          </DockButton>
        </div>
      </GlassCard>
    </div>
  )
}
