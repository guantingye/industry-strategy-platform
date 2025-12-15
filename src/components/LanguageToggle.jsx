import React from 'react'
import { useApp } from '../state/appState'

export default function LanguageToggle() {
  const { lang, setLang } = useApp()
  const isEN = lang === 'en'
  return (
    <button
      className="btn btn-ghost gap-2"
      onClick={() => setLang(isEN ? 'zh' : 'en')}
      title="Toggle language"
      aria-label="Toggle language"
    >
      <span className="text-xs tracking-wide text-white/80">{isEN ? 'EN' : '中文'}</span>
      <span className="h-5 w-px bg-white/20" />
      <span className="text-xs text-white/60">{isEN ? '中文' : 'EN'}</span>
    </button>
  )
}
