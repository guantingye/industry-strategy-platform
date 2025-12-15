import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DockNav from '../components/DockNav'
import GlassCard from '../components/GlassCard'
import IconButton from '../components/IconButton'
import LanguageToggle from '../components/LanguageToggle'
import { ArrowLeftIcon } from '../components/Icons'
import { useApp } from '../state/appState'
import { STR } from '../i18n/strings'
import { loadSeedStartups } from '../data/startups'
import { fetchStartups } from '../services/repositories/startupsRepo'

function normalize(v) {
  return (v || '').toString().toLowerCase()
}

function FieldPill({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="text-xs uppercase tracking-widest text-white/55">{label}</div>
      <div className="mt-1 text-sm text-white/82 leading-relaxed whitespace-pre-wrap">{value || '—'}</div>
    </div>
  )
}

function RowDetails({ row }) {
  // requested: top 3 + bottom 2 (with Verdict full-width)
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      <FieldPill label="Founders background" value={row.Founders_Background} />
      <FieldPill label="The moat" value={row.The_Moat} />
      <FieldPill label="Business model" value={row.Business_Model} />
      <div className="md:col-span-2">
        <FieldPill label="Funding status" value={row.Funding_Status} />
      </div>
      <FieldPill label="Key risks" value={row.Key_Risks} />
      <div className="md:col-span-3">
        <FieldPill label="Verdict" value={row.Verdict} />
      </div>
    </div>
  )
}

export default function Startups() {
  const nav = useNavigate()
  const { lang } = useApp()
  const t = STR[lang]

  const [all, setAll] = useState(() => loadSeedStartups())
  const [q, setQ] = useState('')
  const [sector, setSector] = useState('all')
  const [openId, setOpenId] = useState(null)

  useEffect(() => {
    let cancelled = false

    fetchStartups()
      .then((remote) => {
        if (cancelled) return
        if (!remote?.length) return
        setAll(remote)
      })
      .catch(() => {
        // Silent fallback to local seed.
      })

    return () => {
      cancelled = true
    }
  }, [])

  const sectors = useMemo(() => {
    const s = Array.from(new Set(all.map((r) => r.Sector).filter(Boolean))).sort()
    return ['all', ...s]
  }, [all])

  const filtered = useMemo(() => {
    const qq = normalize(q)
    return all.filter((r) => {
      const matchText =
        normalize(r.Company).includes(qq) ||
        normalize(r.Sector).includes(qq) ||
        normalize(r.The_Moat).includes(qq) ||
        normalize(r.Business_Model).includes(qq)

      const matchSector = sector === 'all' ? true : r.Sector === sector
      return matchText && matchSector
    })
  }, [all, q, sector])

  return (
    <div className="relative min-h-full w-full overflow-hidden">
      <div className="fixed top-4 right-4 md:top-6 md:right-6 z-50 flex items-center gap-2">
        <IconButton onClick={() => nav('/')} title={t.backToHome}>
          <ArrowLeftIcon />
        </IconButton>
        <LanguageToggle />
      </div>

      <div className="mx-auto max-w-[1480px] px-4 md:px-6 py-8 md:py-10">
        <div className="flex items-end justify-between gap-6">
          <div>
            <div className="badge">
              <span className="h-2 w-2 rounded-full bg-emerald-300/80 shadow-[0_0_24px_rgba(110,231,183,0.55)]" />
              <span className="text-white/75">{t.navStartups}</span>
            </div>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight">Curated frontier-tech companies</h1>
            <p className="mt-2 text-sm text-white/70 max-w-[820px]">
              Fast scan → open a row for analyst notes: moat, model, risks, and verdict.
            </p>
          </div>
          <div className="text-xs text-white/55">
            {t.results}: {filtered.length}
          </div>
        </div>

        <GlassCard className="mt-6 p-5 rounded-[28px]">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            <div className="md:col-span-7">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={`${t.search}: company / sector / moat / model`}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/85 outline-none focus:border-white/20 focus:bg-white/7"
              />
            </div>
            <div className="md:col-span-5">
              <select
                value={sector}
                onChange={(e) => setSector(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/85 outline-none focus:border-white/20"
              >
                {sectors.map((s) => (
                  <option key={s} value={s}>
                    {s === 'all' ? `${t.filter}: all sectors` : s}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </GlassCard>

        <div className="mt-6 overflow-hidden rounded-[28px] soft-ring">
          <div className="overflow-x-auto">
            <table className="min-w-[1150px] w-full border-collapse">
              <thead className="bg-white/6">
                <tr className="text-left text-xs uppercase tracking-widest text-white/55">
                  <th className="py-4 px-4">Date</th>
                  <th className="py-4 px-4">Company</th>
                  <th className="py-4 px-4">Sector</th>
                  <th className="py-4 px-4">Snapshot</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r, i) => {
                  const id = `${r.Company}-${i}`
                  const open = openId === id
                  return (
                    <React.Fragment key={id}>
                      <tr
                        className={[
                          'border-t border-white/8 cursor-pointer hover:bg-white/5 transition',
                          open ? 'bg-white/6' : 'bg-transparent',
                        ].join(' ')}
                        onClick={() => setOpenId(open ? null : id)}
                      >
                        <td className="py-4 px-4 text-sm text-white/70 whitespace-nowrap">{r.Date || '—'}</td>
                        <td className="py-4 px-4 text-sm font-medium text-white/88">{r.Company}</td>
                        <td className="py-4 px-4 text-sm text-white/78">{r.Sector}</td>
                        <td className="py-4 px-4 text-sm text-white/72">
                          {(r.The_Moat || '').slice(0, 95)}
                          {(r.The_Moat || '').length > 95 ? '…' : ''}
                        </td>
                      </tr>

                      {open && (
                        <tr className="border-t border-white/8 bg-white/4">
                          <td colSpan={4} className="p-5">
                            <RowDetails row={r} />
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <DockNav />
    </div>
  )
}
