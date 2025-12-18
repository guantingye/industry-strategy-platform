import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DockNav from '../components/DockNav'
import GlassCard from '../components/GlassCard'
import LanguageToggle from '../components/LanguageToggle'
import { INSIGHTS } from '../data/insights'
import { STR } from '../i18n/strings'
import { useApp } from '../state/appState'
import { fetchInsights } from '../services/repositories/insightsRepo'

// Simple mini chart (inline SVG) for section “capacity build-up” (demo only).
function MiniSpark({ values = [] }) {
  const max = Math.max(...values, 1)
  const pts = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * 100
      const y = 100 - (v / max) * 100
      return `${x},${y}`
    })
    .join(' ')
  return (
    <svg viewBox="0 0 100 100" className="h-24 w-full">
      <polyline fill="none" stroke="currentColor" strokeWidth="3" points={pts} className="text-white/70" />
      <polyline fill="none" stroke="currentColor" strokeWidth="1.5" points="0,100 100,100" className="text-white/15" />
    </svg>
  )
}

export default function Industry() {
  const nav = useNavigate()
  const { lang } = useApp()
  const t = STR[lang]

  const [items, setItems] = useState(() => INSIGHTS)
  const [activeId, setActiveId] = useState(() => INSIGHTS[0]?.id)

  useEffect(() => {
    let cancelled = false

    fetchInsights()
      .then((remote) => {
        if (cancelled) return
        if (!remote?.length) return

        setItems(remote)
        setActiveId((prev) => remote.find((x) => x.id === prev)?.id || remote[0]?.id)
      })
      .catch(() => {
        // Silent fallback to local seed.
      })

    return () => {
      cancelled = true
    }
  }, [])

  const active = useMemo(() => items.find((x) => x.id === activeId) || items[0], [items, activeId])

  return (
    <div className="relative min-h-full w-full overflow-hidden">
      <div className="pointer-events-none absolute inset-0 cosmic-dust opacity-[0.85]" />
      <div className="pointer-events-none absolute inset-0 cosmic-stars opacity-[0.35] mix-blend-screen" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/55 via-black/25 to-black/85" />

      <div className="fixed top-4 right-4 md:top-6 md:right-6 z-50 flex items-center gap-2">
        <LanguageToggle />
      </div>

      <div className="mx-auto max-w-[1160px] px-4 md:px-6 py-8 md:py-10">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs tracking-widest text-white/55">{t.insightsKicker}</div>
            <h1 className="mt-2 text-3xl md:text-4xl font-semibold">{t.insightsHeadline}</h1>
            <p className="mt-3 text-sm md:text-base text-white/70 max-w-[820px]">
              {t.insightsSubhead}
            </p>
          </div>

          <div className="hidden md:flex items-center gap-2">
            <button className="btn btn-ghost" onClick={() => nav('/')}>
              {t.backHome}
            </button>
          </div>
        </div>

        <div className="mt-7 grid grid-cols-12 gap-6">
          {/* Left rail */}
          <div className="col-span-12 lg:col-span-4">
            <GlassCard className="p-4 rounded-[26px]">
              <div className="text-xs uppercase tracking-widest text-white/55">Chapters</div>
              <div className="mt-3 space-y-2">
                {items.map((it) => (
                  <button
                    key={it.id}
                    onClick={() => setActiveId(it.id)}
                    className={[
                      'w-full text-left rounded-[18px] px-4 py-3 transition',
                      it.id === activeId ? 'bg-white/10 border border-white/15' : 'hover:bg-white/5 border border-transparent',
                    ].join(' ')}
                  >
                    <div className="text-xs text-white/55">{it.date}</div>
                    <div className="mt-1 font-semibold">{it.title}</div>
                    <div className="mt-1 text-sm text-white/65 line-clamp-2">{it.subtitle}</div>
                  </button>
                ))}
              </div>
            </GlassCard>
          </div>

          {/* Main */}
          <div className="col-span-12 lg:col-span-8">
            {active && (
              <GlassCard className="rounded-[28px] overflow-hidden">
                <div className="relative h-[220px] md:h-[320px]">
                  <img
                    src={active.heroImage}
                    alt={active.title}
                    className="absolute inset-0 h-full w-full object-cover opacity-[0.92]"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/25 to-black/85" />
                  <div className="relative p-6 md:p-8">
                    <div className="text-xs tracking-widest text-white/65">{active.kicker}</div>
                    <h2 className="mt-2 text-2xl md:text-3xl font-semibold">{active.title}</h2>
                    <p className="mt-2 text-sm md:text-base text-white/75 max-w-[760px]">{active.subtitle}</p>

                    {!!active.tags?.length && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {active.tags.map((x) => (
                          <span key={x} className="pill">
                            {x}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-6 md:p-8 space-y-8">
                  {/* Key takeaways */}
                  <div>
                    <div className="text-xs uppercase tracking-widest text-white/55">Key takeaways</div>
                    <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                      {active.takeaways.map((x) => (
                        <div key={x} className="rounded-[18px] border border-white/10 bg-white/5 p-4 text-sm text-white/80">
                          {x}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Sections */}
                  {active.sections?.map((sec) => (
                    <div key={sec.title}>
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="text-lg font-semibold">{sec.title}</h3>
                        {sec.miniChart?.length ? (
                          <div className="w-[220px] hidden md:block">
                            <MiniSpark values={sec.miniChart} />
                          </div>
                        ) : null}
                      </div>
                      <p className="mt-2 text-sm text-white/75 leading-relaxed">{sec.body}</p>

                      {!!sec.bullets?.length && (
                        <ul className="mt-4 space-y-2">
                          {sec.bullets.map((b) => (
                            <li key={b} className="text-sm text-white/80 flex items-start gap-2">
                              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-white/60" />
                              <span>{b}</span>
                            </li>
                          ))}
                        </ul>
                      )}

                      {sec.supportImage ? (
                        <div className="mt-5 rounded-[22px] overflow-hidden border border-white/10">
                          <img src={sec.supportImage} alt={sec.title} className="w-full h-[220px] md:h-[260px] object-cover" loading="lazy" />
                        </div>
                      ) : null}
                    </div>
                  ))}

                  {/* Signals */}
                  {/* Signals */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
                      <div className="text-xs uppercase tracking-widest text-white/55">Signals to watch</div>
                      <ul className="mt-3 space-y-3">
                        {(active?.signals || []).map((s, idx) => {
                          const isObj = s && typeof s === 'object'
                          const key = isObj ? `${s.k ?? 'signal'}-${idx}` : `${String(s)}-${idx}`

                          return (
                            <li key={key} className="text-sm text-white/80 flex items-start gap-2">
                              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-white/60" />
                              {isObj ? (
                                <span className="flex flex-col gap-1">
                                  <span className="text-white/85 font-medium">{s.k}</span>
                                  <span className="text-white/70 leading-relaxed">{s.v}</span>
                                </span>
                              ) : (
                                <span className="leading-relaxed">{String(s)}</span>
                              )}
                            </li>
                          )
                        })}
                      </ul>
                    </div>

                    <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
                      <div className="text-xs uppercase tracking-widest text-white/55">Sources (public)</div>
                      <ul className="mt-3 space-y-2">
                        {(active?.sources || []).map((s, idx) => {
                          const href = s?.href || s?.url // 同時支援 DB: url 與 UI: href
                          const label = s?.label || s?.title || `Source ${idx + 1}`
                          if (!href) return null

                          return (
                            <li key={`${label}-${idx}`} className="text-sm text-white/80">
                              <a
                                className="underline decoration-white/25 hover:decoration-white/60"
                                href={href}
                                target="_blank"
                                rel="noreferrer"
                              >
                                {label}
                              </a>
                            </li>
                          )
                        })}
                      </ul>
                    </div>
                  </div>
                </div>
              </GlassCard>
            )}

            <div className="mt-6 flex md:hidden">
              <button className="btn btn-ghost" onClick={() => nav('/')}>
                {t.backHome}
              </button>
            </div>
          </div>
        </div>
      </div>

      <DockNav />
    </div>
  )
}
