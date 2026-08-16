import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Award, Layers, Sparkles, TrendingUp } from 'lucide-react'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts'
import { useLanguage } from '@/context/useLanguage'
import { translateSectorName, translateSecurityName } from '@/lib/displayNames'
import type { AllStarIndexData } from '@/lib/secData'
import { useQuarterArchive } from '@/lib/useQuarterArchive'

const SECTOR_COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#64748b', '#f59e0b', '#ec4899', '#06b6d4', '#ef4444', '#94a3b8']

export default function AllStarIndex() {
  const { lang, language } = useLanguage()
  const { dataPath, selectedQuarter } = useQuarterArchive()
  const [indexData, setIndexData] = useState<AllStarIndexData | null>(null)
  const [weightMode, setWeightMode] = useState<'conviction' | 'equal'>('conviction')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    async function loadIndex() {
      setIsLoading(true)
      try {
        const res = await fetch(`${dataPath}/all_star_index.json`)
        if (res.ok) {
          const json = (await res.json()) as AllStarIndexData
          if (isMounted) setIndexData(json)
        }
      } catch {
        // Fallback
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }
    void loadIndex()
    return () => {
      isMounted = false
    }
  }, [dataPath])

  if (isLoading || !indexData) {
    return (
      <div className="glass-card p-12 text-center text-text-secondary font-semibold animate-in fade-in">
        {lang.loadingHistoricalFilings}
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Navigation & Header */}
      <div className="flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-secondary hover:text-accent-blue transition-colors px-3 py-1.5 rounded-full border border-border bg-white shadow-2xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          {lang.backToDashboard}
        </Link>

        {selectedQuarter && (
          <span className="text-xs font-semibold text-text-secondary border border-border rounded-full px-3 py-1 bg-white">
            {selectedQuarter.label}
          </span>
        )}
      </div>

      {/* Hero Banner */}
      <div className="glass-card p-6 border-b-2 border-accent-purple/30 bg-gradient-to-br from-white via-purple-50/20 to-blue-50/30">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1.5 rounded-lg bg-gradient-to-tr from-accent-purple to-accent-blue text-white">
                <Sparkles className="w-4 h-4" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-accent-purple">
                Smart Money Clone ETF
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-text-primary tracking-tight">
              {language === 'zh' ? indexData.chineseName : indexData.name}
            </h1>
            <p className="text-xs sm:text-sm text-text-secondary mt-1 max-w-2xl">
              {lang.allStarSub}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="p-3 rounded-xl bg-white border border-border shadow-2xs min-w-[130px]">
              <div className="text-[11px] font-medium text-text-secondary flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-accent-purple" />
                {lang.constituents}
              </div>
              <div className="text-xl font-black text-text-primary mt-0.5">
                {indexData.constituentsCount} <span className="text-xs font-normal text-text-secondary">stocks</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white border border-border shadow-2xs min-w-[130px]">
              <div className="text-[11px] font-medium text-text-secondary flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-accent-green" />
                {lang.trackCapital}
              </div>
              <div className="text-xl font-black text-text-primary mt-0.5">
                {indexData.totalTrackedCapital}
              </div>
            </div>

            {/* Weight Switch Toggle */}
            <div className="flex flex-col gap-1 p-1 bg-background/80 border border-border rounded-xl">
              <span className="text-[10px] font-bold text-text-secondary px-2 pt-0.5">Weighting Mode</span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setWeightMode('conviction')}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    weightMode === 'conviction'
                      ? 'bg-accent-purple text-white shadow-xs'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  {lang.convictionWeighted}
                </button>
                <button
                  type="button"
                  onClick={() => setWeightMode('equal')}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    weightMode === 'equal'
                      ? 'bg-accent-blue text-white shadow-xs'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  {lang.equalWeighted}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sector Allocation & Summary Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sector Pie Chart */}
        <div className="glass-card p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-text-primary flex items-center gap-2 mb-1">
              <Layers className="w-4 h-4 text-accent-blue" />
              {lang.sectorBreakdown}
            </h2>
            <p className="text-xs text-text-secondary">GICS Sector Allocation Breakdown</p>
          </div>

          <div className="h-52 w-full my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={indexData.sectorBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="weight"
                >
                  {indexData.sectorBreakdown.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={SECTOR_COLORS[index % SECTOR_COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip
                  content={({ active, payload }) => {
                    if (!active || !payload || payload.length === 0) return null
                    const item = payload[0]
                    return (
                      <div className="rounded-lg border border-border bg-white p-2 text-xs shadow-md">
                        <span className="font-bold">{translateSectorName(String(item.name || ''), language)}: </span>
                        <span className="font-semibold text-accent-blue">{Number(item.value || 0).toFixed(2)}%</span>
                      </div>
                    )
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-border">
            {indexData.sectorBreakdown.slice(0, 6).map((s, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1 text-text-secondary truncate max-w-[100px]">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: SECTOR_COLORS[idx % SECTOR_COLORS.length] }} />
                  {translateSectorName(s.sector, language)}
                </span>
                <span className="font-bold text-text-primary">{s.weight}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Constituents Table */}
        <div className="lg:col-span-2 glass-card overflow-hidden">
          <div className="p-4 bg-background/50 border-b border-border flex items-center justify-between">
            <h2 className="text-sm font-bold text-text-primary flex items-center gap-2">
              <Award className="w-4 h-4 text-accent-purple" />
              {lang.constituents} ({indexData.constituents.length})
            </h2>
            <span className="text-xs text-text-secondary">
              {lang.clickAnyBlock}
            </span>
          </div>

          <div className="overflow-x-auto max-h-[460px] overflow-y-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-text-secondary text-xs border-b border-border bg-background sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-3 font-semibold whitespace-nowrap">#</th>
                  <th className="px-4 py-3 font-semibold whitespace-nowrap">{lang.security}</th>
                  <th className="px-4 py-3 font-semibold whitespace-nowrap min-w-[100px]">{lang.segment}</th>
                  <th className="px-4 py-3 font-semibold text-right whitespace-nowrap">
                    {weightMode === 'conviction' ? lang.convictionWeight : lang.equalWeight}
                  </th>
                  <th className="px-4 py-3 font-semibold text-center whitespace-nowrap">{lang.mainAction}</th>
                  <th className="px-4 py-3 font-semibold text-center whitespace-nowrap">{lang.holderCount}</th>
                  <th className="px-4 py-3 font-semibold whitespace-nowrap">{lang.topHolders}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {indexData.constituents.map((item, idx) => (
                  <tr key={idx} className="hover:bg-background/50 transition-colors group">
                    <td className="px-4 py-3 text-xs font-bold text-text-secondary">{idx + 1}</td>
                    <td className="px-4 py-3">
                      <Link
                        to={`/ticker/${item.ticker}`}
                        className="font-bold text-text-primary group-hover:text-accent-blue transition-colors flex items-center gap-1.5"
                      >
                        <span className="shrink-0">{item.ticker}</span>
                        <span className="text-xs font-normal text-text-secondary truncate max-w-[130px]">
                          {translateSecurityName(item.name, language, [item.ticker, item.name])}
                        </span>
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-xs text-text-secondary whitespace-nowrap">
                      <span className="px-2.5 py-1 rounded-full bg-gray-100 border border-gray-200 whitespace-nowrap inline-flex items-center">
                        {translateSectorName(item.sector, language)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-black text-accent-purple whitespace-nowrap">
                      {weightMode === 'conviction' ? item.convictionWeight : item.equalWeight}
                    </td>
                    <td className="px-4 py-3 text-center whitespace-nowrap">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-bold whitespace-nowrap inline-flex items-center justify-center ${
                          item.mainAction === 'Net Buy'
                            ? 'bg-accent-green/10 text-accent-green'
                            : item.mainAction === 'Net Sell'
                              ? 'bg-accent-red/10 text-accent-red'
                              : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {item.mainAction === 'Net Buy' ? lang.add : item.mainAction === 'Net Sell' ? lang.trim : lang.hold}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center font-bold text-accent-blue text-xs whitespace-nowrap">
                      {item.holderCount}
                    </td>
                    <td className="px-4 py-3 text-xs text-text-secondary">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {Array.from(new Set(item.backingFunds)).map((fund, fIdx) => (
                          <span
                            key={fIdx}
                            className="px-1.5 py-0.5 rounded bg-background border border-border/80 text-[10px] whitespace-nowrap"
                          >
                            {fund.split(' ')[0]}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
