import React, { useMemo } from 'react'

export default function SimpleBarChart({ data, height = 240 }) {
  const width = 560
  const padding = 22

  const { maxV, bars } = useMemo(() => {
    const maxV = Math.max(...data.map((d) => d.value), 1)
    const slot = (width - padding * 2) / data.length
    const bars = data.map((d, i) => {
      const x = padding + i * slot + slot * 0.12
      const w = slot * 0.76
      const h = ((height - padding * 2) * d.value) / maxV
      const y = height - padding - h
      return { ...d, x, y, w, h }
    })
    return { maxV, bars }
  }, [data, height])

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
      <defs>
        <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(160, 220, 255, 0.95)" />
          <stop offset="100%" stopColor="rgba(160, 80, 255, 0.65)" />
        </linearGradient>
      </defs>

      <g opacity="0.35">
        {[0, 1, 2, 3].map((i) => {
          const y = padding + (i * (height - padding * 2)) / 3
          return <line key={i} x1={padding} x2={width - padding} y1={y} y2={y} stroke="rgba(255,255,255,0.22)" />
        })}
      </g>

      {bars.map((b) => (
        <g key={b.label}>
          <rect x={b.x} y={b.y} width={b.w} height={b.h} rx="10" fill="url(#barGrad)" />
          <text x={b.x + b.w / 2} y={height - 6} textAnchor="middle" fontSize="11" fill="rgba(255,255,255,0.70)">
            {b.label}
          </text>
          <text x={b.x + b.w / 2} y={b.y - 8} textAnchor="middle" fontSize="11" fill="rgba(255,255,255,0.72)">
            {b.value.toFixed(1)}
          </text>
        </g>
      ))}

      <text x={padding} y={14} fontSize="11" fill="rgba(255,255,255,0.75)">
        {maxV.toFixed(0)}
      </text>
    </svg>
  )
}
