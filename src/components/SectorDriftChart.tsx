import { useMemo } from 'react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Layers } from 'lucide-react'
import { useLanguage } from '@/context/useLanguage'
import { translateSectorName } from '@/lib/displayNames'

const SECTOR_COLORS: Record<string, string> = {
  'Information Technology': '#3b82f6',
  'Financials': '#10b981',
  'Health Care': '#ec4899',
  'Consumer Discretionary': '#f59e0b',
  'Communication Services': '#8b5cf6',
  'Industrials': '#64748b',
  'Consumer Staples': '#06b6d4',
  'Energy': '#ef4444',
  'Utilities': '#84cc16',
  'Real Estate': '#14b8a6',
  'Materials': '#d97706',
  'Unclassified': '#94a3b8',
}

interface SectorDriftChartProps {
  history?: Array<Record<string, string | number>>
}

export default function SectorDriftChart({ history }: SectorDriftChartProps) {
  const { lang, language } = useLanguage()

  const activeSectors = useMemo(() => {
    if (!history || history.length === 0) return []
    const sectorsWithWeight = new Set<string>()
    history.forEach((row) => {
      Object.entries(row).forEach(([key, val]) => {
        if (key !== 'quarter' && Number(val) > 0.5) {
          sectorsWithWeight.add(key)
        }
      })
    })
    return Array.from(sectorsWithWeight)
  }, [history])

  if (!history || history.length === 0 || activeSectors.length === 0) {
    return null
  }

  return (
    <div className="glass-card p-6 overflow-hidden animate-in fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b border-border pb-4">
        <div>
          <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
            <Layers className="w-4 h-4 text-accent-purple" />
            {lang.sectorDriftTitle}
          </h3>
          <p className="text-xs text-text-secondary mt-1">{lang.sectorDriftSub}</p>
        </div>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={history} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
            <XAxis
              dataKey="quarter"
              stroke="#6B7280"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#6B7280"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              domain={[0, 100]}
              tickFormatter={(v: number) => `${v}%`}
            />
            <RechartsTooltip
              content={({ active, payload, label }) => {
                if (!active || !payload || payload.length === 0) return null
                return (
                  <div className="rounded-lg border border-border bg-white/95 backdrop-blur-md p-3 shadow-lg text-xs">
                    <div className="font-bold text-text-primary mb-1.5 pb-1 border-b border-border">
                      {label}
                    </div>
                    <div className="space-y-1">
                      {payload
                        .filter((item) => Number(item.value) > 0)
                        .sort((a, b) => Number(b.value) - Number(a.value))
                        .map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between gap-4">
                            <span className="flex items-center gap-1.5 font-medium text-text-secondary">
                              <span
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: item.color }}
                              />
                              {translateSectorName(item.name as string, language)}
                            </span>
                            <span className="font-bold text-text-primary">{item.value}%</span>
                          </div>
                        ))}
                    </div>
                  </div>
                )
              }}
            />
            <Legend
              formatter={(value: string) => (
                <span className="text-xs font-medium text-text-secondary">
                  {translateSectorName(value, language)}
                </span>
              )}
            />
            {activeSectors.map((sector) => (
              <Area
                key={sector}
                type="monotone"
                dataKey={sector}
                stackId="1"
                stroke={SECTOR_COLORS[sector] || '#94a3b8'}
                fill={SECTOR_COLORS[sector] || '#94a3b8'}
                fillOpacity={0.75}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
