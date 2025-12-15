import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import GlassCard from '../components/GlassCard'
import LanguageToggle from '../components/LanguageToggle'
import ThreeGlobe from '../components/ThreeGlobe'
import { HUBS } from '../data/hubs'
import { STR } from '../i18n/strings'
import { useApp } from '../state/appState'
import { fetchHubs } from '../services/repositories/hubsRepo'

export default function Home() {
  const nav = useNavigate()
  const { lang } = useApp()
  const t = STR[lang]

  const [hubs, setHubs] = useState(() => HUBS)
  const [selectedId, setSelectedId] = useState(() => HUBS[0]?.id)

  useEffect(() => {
    let cancelled = false

    fetchHubs()
      .then((remote) => {
        if (cancelled) return
        if (!remote?.length) return

        setHubs(remote)
        setSelectedId((prev) => remote.find((h) => h.id === prev)?.id || remote[0]?.id)
      })
      .catch(() => {
        // Silent fallback to local seed.
      })

    return () => {
      cancelled = true
    }
  }, [])

  const selected = hubs.find((h) => h.id === selectedId) || hubs[0]

  return (
    <div className="relative min-h-full w-full overflow-hidden">
      {/* cosmic background (no external images) */}
      <div className="pointer-events-none absolute inset-0 cosmic-dust opacity-[0.9]" />
      <div className="pointer-events-none absolute inset-0 cosmic-stars opacity-[0.40] mix-blend-screen" />
      <div className="pointer-events-none absolute inset-0 cosmic-stars-2 opacity-[0.26] mix-blend-screen" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/65 via-black/35 to-black/85" />

      <div className="fixed top-4 right-4 md:top-6 md:right-6 z-50 flex items-center gap-2">
        <LanguageToggle />
      </div>

      <div className="mx-auto max-w-[1440px] px-4 md:px-6 pt-24 md:pt-28 pb-12">
        <div className="grid grid-cols-12 gap-10 items-center">
          {/* Left: title block */}
          <div className="col-span-12 lg:col-span-5">
            <div className="badge w-fit">
              <span className="h-2 w-2 rounded-full bg-cyan-300/80 shadow-[0_0_24px_rgba(103,232,249,0.55)]" />
              <span className="text-white/75">Strategy Intelligence Platform</span>
            </div>
            <h1 className="mt-5 text-4xl md:text-5xl font-semibold tracking-tight leading-[1.05]">
              {t.homeHeadline}
            </h1>
            <p className="mt-4 max-w-[520px] text-sm md:text-base text-white/72 leading-relaxed">
              {t.homeSubhead}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <button className="btn btn-primary" onClick={() => nav('/insights')}>
                {t.navInsights}
              </button>
              <button className="btn btn-ghost" onClick={() => nav('/startups')}>
                {t.navStartups}
              </button>
            </div>
          </div>

          {/* Right: globe */}
          <div className="col-span-12 lg:col-span-7">
            <div className="relative h-[52vh] md:h-[68vh] lg:h-[78vh] rounded-[34px] soft-ring overflow-hidden">
              <ThreeGlobe
                focus={selected ? { lat: selected.lat, lng: selected.lng } : null}
                hubs={hubs}
                selectedId={selectedId}
                onSelect={(id) => setSelectedId(id)}
                className="absolute inset-0"
              />

              {/* Contrast vignette */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/25" />

              {/* Hub brief */}
              {selected && (
                <div className="absolute left-4 right-4 md:left-6 md:right-6 bottom-4 md:bottom-6 flex justify-end">
                  <GlassCard className="w-full max-w-[380px] p-5 rounded-[26px]">
                    <div className="text-xs uppercase tracking-widest text-white/55">Tech hub brief</div>
                    <div className="mt-1 text-lg font-semibold">{selected.city}</div>
                    <div className="text-sm text-white/65">{selected.region}</div>

                    {!!selected.themes?.length && (
                      <>
                        <div className="mt-4 text-xs uppercase tracking-widest text-white/55">Focus themes</div>
                        <ul className="mt-2 space-y-2">
                          {selected.themes.slice(0, 4).map((x) => (
                            <li key={x} className="text-sm text-white/80 flex items-start gap-2">
                              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-white/60" />
                              <span>{x}</span>
                            </li>
                          ))}
                        </ul>
                      </>
                    )}

                    <div className="mt-4 text-xs text-white/55">Select a hub marker to switch views.</div>
                  </GlassCard>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
