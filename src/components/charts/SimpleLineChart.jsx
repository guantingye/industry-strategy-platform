import React, { useMemo } from 'react'

export default function SimpleLineChart({ data, height = 220 }) {
  const padding = 22
  const width = 560

  const { pts, minY, maxY } = useMemo(() => {
    const ys = data.map((d) => d.value)
    const minY = Math.min(...ys)
    const maxY = Math.max(...ys)
    const span = Math.max(1, maxY - minY)
    const pts = data.map((d, i) => {
      const x = padding + (i * (width - padding * 2)) / Math.max(1, data.length - 1)
      const y = padding + ((maxY - d.value) * (height - padding * 2)) / span
      return { x, y, ...d }
    })
    return { pts, minY, maxY }
  }, [data, height])

  const path = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
      <defs>
        <linearGradient id="lineGlow" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(160, 80, 255, 0.9)" />
          <stop offset="100%" stopColor="rgba(0, 255, 200, 0.85)" />
        </linearGradient>
        <filter id="softGlow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g opacity="0.35">
        {[0, 1, 2, 3].map((i) => {
          const y = padding + (i * (height - padding * 2)) / 3
          return <line key={i} x1={padding} x2={width - padding} y1={y} y2={y} stroke="rgba(255,255,255,0.22)" />
        })}
      </g>

      <path d={path} fill="none" stroke="url(#lineGlow)" strokeWidth="3.2" filter="url(#softGlow)" />

      {pts.map((p) => (
        <g key={p.label}>
          <circle cx={p.x} cy={p.y} r="5" fill="rgba(235,250,255,0.92)" />
          <circle cx={p.x} cy={p.y} r="9" fill="rgba(160, 80, 255, 0.16)" />
          <text x={p.x} y={height - 6} textAnchor="middle" fontSize="11" fill="rgba(255,255,255,0.70)">
            {p.label}
          </text>
        </g>
      ))}

      <text x={padding} y={14} fontSize="11" fill="rgba(255,255,255,0.75)">
        {Math.round(maxY)}
      </text>
      <text x={padding} y={height - padding - 6} fontSize="11" fill="rgba(255,255,255,0.55)">
        {Math.round(minY)}
      </text>
    </svg>
  )
}
