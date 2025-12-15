import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

const AppCtx = createContext(null)
const STORAGE_KEY = 'sip_lang' // 'en' | 'zh'

export function AppProvider({ children }) {
  const [lang, setLang] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) || 'en'
    } catch {
      return 'en'
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, lang)
    } catch {
      // ignore storage failures (e.g., privacy mode)
    }
  }, [lang])

  const value = useMemo(() => ({ lang, setLang }), [lang])
  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>
}

export function useApp() {
  const ctx = useContext(AppCtx)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
