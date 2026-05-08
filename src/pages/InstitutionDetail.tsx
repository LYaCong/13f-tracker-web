import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  ChevronDown,
  TrendingDown,
  TrendingUp,
} from 'lucide-react'
import {
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type {
  InstitutionDetailData,
  PositionChange,
  RadarDatum,
  HoldingEntry,
} from '@/lib/secData'
import { parseFilingPeriod } from '@/lib/secData'
import { useLanguage } from '../context/useLanguage'

const EMPTY_RADAR_DATA: RadarDatum[] = []
const EMPTY_HOLDINGS: HoldingEntry[] = []
const EMPTY_POSITION_CHANGES: PositionChange[] = []
type TooltipValue = string | number | ReadonlyArray<string | number> | undefined

function normalizeTooltipValue(value: TooltipValue) {
  if (Array.isArray(value)) {
    return Number(value[0] ?? 0)
  }

  return Number(value ?? 0)
}

export default function InstitutionDetail() {
  const { id } = useParams()
  const [detailData, setDetailData] = useState<InstitutionDetailData | null>(null)
  const { lang } = useLanguage()

  useEffect(() => {
    if (!id) {
      return
    }

    fetch(`/data/${id}_detail.json?t=${Date.now()}`)
      .then((res) => res.json() as Promise<InstitutionDetailData>)
      .then((data) => setDetailData(data))
      .catch(console.error)
  }, [id])

  const filingPeriod = useMemo(() => {
    if (!detailData) {
      return null
    }

    return parseFilingPeriod(detailData.institution.quarter)
  }, [detailData])

  if (!detailData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-text-secondary animate-pulse">
        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center text-white font-bold shadow-soft mb-4">
          13F
        </div>
        <p className="font-semibold text-lg">{lang.loadingHistoricalFilings}</p>
      </div>
    )
  }

  const { institution } = detailData
  const holdings = detailData.holdings ?? EMPTY_HOLDINGS
  const topAdds = detailData.topAdds ?? EMPTY_POSITION_CHANGES
  const topTrims = detailData.topTrims ?? EMPTY_POSITION_CHANGES
  const radarData = detailData.radarData ?? EMPTY_RADAR_DATA
  const assetTrend = detailData.assetTrend ?? []

  const sortedRadar = [...radarData].sort((a, b) => b.A - a.A)
  const dominantStyle = sortedRadar[0]
  const top2Concentration =
    sortedRadar.length >= 2 ? sortedRadar[0].A + sortedRadar[1].A : dominantStyle?.A ?? 0
  const styleBreadth = sortedRadar.filter((segment) => segment.A >= 10).length

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-8">
      <div className="flex justify-between items-start gap-4">
        <div>
          <Link to="/" className="inline-flex items-center text-xs font-medium text-text-secondary hover:text-accent-blue transition-colors mb-2">
            <ArrowLeft className="w-3.5 h-3.5 mr-1" /> {lang.backToDashboard}
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-text-primary tracking-tight">{institution.name}</h1>
            <span className="px-2.5 py-0.5 bg-accent-blue/10 text-accent-blue rounded-md text-xs font-bold border border-accent-blue/20">
              {institution.style}
            </span>
          </div>
          <p className="text-text-secondary text-sm mt-1.5 flex items-center gap-2">
            {institution.manager} | SEC CIK: {institution.cik}
          </p>
        </div>

        <div className="glass-card p-1.5 flex gap-2">
          <div className="relative">
            <select
              value={filingPeriod?.year ?? ''}
              disabled
              className="appearance-none pl-3 pr-8 py-1.5 text-sm bg-text-primary text-white rounded-md font-medium shadow-sm opacity-100 cursor-not-allowed outline-none"
            >
              <option value={filingPeriod?.year ?? ''}>{filingPeriod?.year ?? '----'}</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-white absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <div className="relative">
            <select
              value={filingPeriod?.quarter ?? ''}
              disabled
              className="appearance-none pl-3 pr-8 py-1.5 text-sm bg-text-primary text-white rounded-md font-medium shadow-sm opacity-100 cursor-not-allowed outline-none"
            >
              <option value={filingPeriod?.quarter ?? ''}>{filingPeriod?.quarter ?? '--'}</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-white absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="glass-card border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        {lang.snapshotOnly}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="glass-card p-4">
          <p className="text-xs font-semibold text-text-secondary">{lang.currentQuarter}</p>
          <p className="text-xl font-black mt-1 text-text-primary">{institution.quarter}</p>
        </div>
        <div className="glass-card p-4">
          <p className="text-xs font-semibold text-text-secondary">{lang.quarterEndNetAssets}</p>
          <p className="text-xl font-black mt-1 text-accent-blue">${institution.aum}</p>
        </div>
        <div className="glass-card p-4">
          <p className="text-xs font-semibold text-text-secondary">{lang.holdingsCount}</p>
          <p className="text-xl font-black mt-1 text-text-primary">{institution.holdingsCount}</p>
        </div>
        <div className="glass-card p-4">
          <p className="text-xs font-semibold text-text-secondary">{lang.latestFilingDate}</p>
          <p className="text-xl font-black mt-1 text-text-primary">
            {institution.latestFilingDate ?? lang.latestFilingUnavailable}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="glass-card p-5 flex flex-col">
          <h2 className="text-base font-bold text-text-primary mb-1">{lang.portfolioEvolution}</h2>
          <p className="text-xs text-text-secondary mb-4">{lang.portfolioEvolutionSub}</p>
          <div className="flex-1 w-full min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={assetTrend} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 11 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 11 }} tickFormatter={(value: string | number) => `$${value}B`} />
                <RechartsTooltip
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                  formatter={(value: TooltipValue) => [`$${normalizeTooltipValue(value).toFixed(1)}B`, lang.netAssets]}
                />
                <Line type="monotone" dataKey="value" stroke="#2563EB" strokeWidth={3} dot={false} activeDot={{ r: 6, fill: '#2563EB', stroke: '#fff', strokeWidth: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-4 gap-2 mt-4 pt-4 border-t border-border/50 text-center">
            <div><p className="text-xs text-text-secondary font-medium">{lang.oneYChange}</p><p className="text-sm font-bold text-accent-green">+12.4%</p></div>
            <div><p className="text-xs text-text-secondary font-medium">{lang.maxDrawdown}</p><p className="text-sm font-bold text-accent-red">-24.1%</p></div>
            <div><p className="text-xs text-text-secondary font-medium">{lang.volatility}</p><p className="text-sm font-bold text-text-primary">{lang.low}</p></div>
            <div><p className="text-xs text-text-secondary font-medium">{lang.sinceTrough}</p><p className="text-sm font-bold text-accent-green">+45.2%</p></div>
          </div>
        </div>

        <div className="glass-card p-5 flex flex-col">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h2 className="text-base font-bold text-text-primary mb-1">{lang.institutionStyleVsSp500}</h2>
              <p className="text-xs text-text-secondary">{lang.sectorAllocation}</p>
            </div>
            <div className="flex items-center gap-3 text-xs font-medium">
              <span className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-accent-blue"></div> {institution.name}</span>
              <span className="flex items-center gap-1.5"><div className="w-4 h-0 border-t-[3px] border-dashed border-teal-400"></div> S&amp;P 500</span>
            </div>
          </div>
          <div className="flex-1 w-full min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                <PolarGrid stroke="#E5E7EB" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#4B5563', fontSize: 11, fontWeight: 600 }} />
                <PolarRadiusAxis angle={30} domain={[0, 80]} tick={false} axisLine={false} />
                <Radar name="S&P 500" dataKey="B" stroke="#2dd4bf" strokeWidth={3} strokeDasharray="6 4" fill="none" />
                <Radar name={institution.name} dataKey="A" stroke="#2563EB" strokeWidth={2} fill="#3B82F6" fillOpacity={0.3} />
                <RechartsTooltip
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-4">
            <div className="p-3 border border-border rounded-xl bg-background/50 text-center flex flex-col justify-center">
              <p className="text-xs text-text-secondary font-medium mb-1">{lang.dominantStyle}</p>
              <p className="text-base font-bold text-text-primary leading-tight">{dominantStyle?.subject ?? 'N/A'}</p>
              <p className="text-xs text-text-secondary mt-0.5">{dominantStyle ? `${dominantStyle.A.toFixed(1)}%` : '--'}</p>
            </div>
            <div className="p-3 border border-border rounded-xl bg-background/50 text-center flex flex-col justify-center">
              <p className="text-xs text-text-secondary font-medium mb-1">{lang.top2Concentration}</p>
              <p className="text-base font-bold text-text-primary leading-tight">{top2Concentration.toFixed(1)}%</p>
              <p className="text-xs text-text-secondary mt-0.5">{lang.combinedStyleWeight}</p>
            </div>
            <div className="p-3 border border-border rounded-xl bg-background/50 text-center flex flex-col justify-center">
              <p className="text-xs text-text-secondary font-medium mb-1">{lang.styleBreadth}</p>
              <p className="text-base font-bold text-text-primary leading-tight">{styleBreadth}</p>
              <p className="text-xs text-text-secondary mt-0.5">{lang.segmentsAbove10}</p>
            </div>
          </div>

          <div className="mt-4 border border-border rounded-xl overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-background text-text-secondary text-[11px] uppercase tracking-wider font-semibold border-b border-border">
                <tr>
                  <th className="px-4 py-2.5">{lang.segment}</th>
                  <th className="px-4 py-2.5 text-right">{lang.weight}</th>
                  <th className="px-4 py-2.5 text-right">{lang.vsSp500}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-white text-sm">
                {radarData.map((item, index) => {
                  const diff = item.A - item.B
                  const diffText = diff > 0 ? `+${diff.toFixed(1)}%` : `${diff.toFixed(1)}%`
                  const diffColor = diff > 0 ? 'text-accent-green bg-accent-green/10' : 'text-accent-red bg-accent-red/10'

                  return (
                    <tr key={`${item.subject}-${index}`} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-2.5 font-bold text-text-primary">{item.subject}</td>
                      <td className="px-4 py-2.5 text-right font-semibold">{item.A.toFixed(1)}%</td>
                      <td className="px-4 py-2.5 text-right">
                        <span className={`inline-block px-2 py-0.5 rounded-md font-bold text-xs ${diffColor}`}>
                          {diffText}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="p-5 border-b border-border bg-gradient-to-r from-background to-white">
          <h2 className="text-lg font-bold text-text-primary mb-0.5">{lang.quarterlyHoldingsOverview}</h2>
          <p className="text-xs text-text-secondary">{institution.quarter} | {institution.holdingsCount} {lang.totalPositions}</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-5 divide-y lg:divide-y-0 lg:divide-x divide-border">
          <div className="lg:col-span-3 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-background text-text-secondary text-xs uppercase tracking-wider font-semibold border-b border-border">
                <tr>
                  <th className="px-6 py-4">{lang.security}</th>
                  <th className="px-6 py-4 text-right">{lang.weight}</th>
                  <th className="px-6 py-4 text-right">{lang.mktValueB}</th>
                  <th className="px-6 py-4 text-right">{lang.qoqDelta}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {holdings.map((holding) => (
                  <tr key={holding.cusip} className="hover:bg-background/50 transition-colors">
                    <td className="px-6 py-3.5 font-medium text-text-primary flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: holding.color }}></div>
                      <span className="truncate max-w-[200px]">{holding.security}</span>
                    </td>
                    <td className="px-6 py-3.5 text-right font-medium">{holding.weight.toFixed(2)}%</td>
                    <td className="px-6 py-3.5 text-right text-text-secondary">${holding.mktValue}</td>
                    <td className={`px-6 py-3.5 text-right font-bold ${holding.qOqDelta.startsWith('+') ? 'text-accent-green' : 'text-accent-red'}`}>
                      {holding.qOqDelta}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="p-4 border-t border-border text-center">
              <button className="text-sm font-semibold text-accent-blue hover:text-accent-purple transition-colors">
                {lang.expandAll} {institution.holdingsCount} {lang.holdings}
              </button>
            </div>
          </div>
          <div className="lg:col-span-2 p-5 flex flex-col items-center justify-center bg-background/30">
            <div className="w-full h-[300px] relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={holdings}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={120}
                    paddingAngle={1}
                    dataKey="weight"
                    stroke="none"
                  >
                    {holdings.map((entry) => (
                      <Cell key={entry.cusip} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip formatter={(value: TooltipValue) => `${normalizeTooltipValue(value).toFixed(2)}%`} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-black text-text-primary">{institution.holdingsCount}</span>
                <span className="text-xs font-bold text-text-secondary tracking-widest uppercase">{lang.holdings}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <h2 className="text-lg font-bold text-text-primary pt-2 px-2">{lang.qoqPositionChanges}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass-card overflow-hidden">
          <div className="p-4 bg-accent-green/5 border-b border-border flex items-center justify-between">
            <h3 className="font-bold text-text-primary flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-accent-green" /> {lang.topAdds}
              <span className="text-text-secondary text-sm font-normal ml-1">{lang.byBuyIntensity}</span>
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-text-secondary text-xs border-b border-border bg-background">
                <tr>
                  <th className="px-4 py-3 font-semibold">{lang.security}</th>
                  <th className="px-4 py-3 font-semibold text-right">{lang.delta}</th>
                  <th className="px-4 py-3 font-semibold text-right">{lang.shareChg}</th>
                  <th className="px-4 py-3 font-semibold text-right">{lang.postWgt}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {topAdds.map((add, index) => (
                  <tr key={`${add.ticker}-${index}`} className="hover:bg-background/50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-text-primary">{add.ticker}</span>
                        {add.type === 'New' && <span className="bg-accent-blue/10 text-accent-blue text-[10px] px-1.5 py-0.5 rounded uppercase font-bold tracking-wide">{lang.new}</span>}
                        {add.type === 'Add' && <span className="bg-accent-green/10 text-accent-green text-[10px] px-1.5 py-0.5 rounded uppercase font-bold tracking-wide">{lang.add}</span>}
                      </div>
                      <div className="text-xs text-text-secondary truncate max-w-[120px]">{add.security}</div>
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-accent-green">{add.deltaValue}</td>
                    <td className="px-4 py-3 text-right text-text-primary font-medium">{add.shareChange}</td>
                    <td className="px-4 py-3 text-right text-text-secondary">{add.newWeight}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="glass-card overflow-hidden">
          <div className="p-4 bg-accent-red/5 border-b border-border flex items-center justify-between">
            <h3 className="font-bold text-text-primary flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-accent-red" /> {lang.topTrims}
              <span className="text-text-secondary text-sm font-normal ml-1">{lang.bySellIntensity}</span>
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-text-secondary text-xs border-b border-border bg-background">
                <tr>
                  <th className="px-4 py-3 font-semibold">{lang.security}</th>
                  <th className="px-4 py-3 font-semibold text-right">{lang.delta}</th>
                  <th className="px-4 py-3 font-semibold text-right">{lang.shareChg}</th>
                  <th className="px-4 py-3 font-semibold text-right">{lang.postWgt}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {topTrims.map((trim, index) => (
                  <tr key={`${trim.ticker}-${index}`} className="hover:bg-background/50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-text-primary">{trim.ticker}</span>
                        {trim.type === 'Exit' && <span className="bg-text-secondary/10 text-text-secondary text-[10px] px-1.5 py-0.5 rounded uppercase font-bold tracking-wide">{lang.exit}</span>}
                        {trim.type === 'Trim' && <span className="bg-accent-red/10 text-accent-red text-[10px] px-1.5 py-0.5 rounded uppercase font-bold tracking-wide">{lang.trim}</span>}
                      </div>
                      <div className="text-xs text-text-secondary truncate max-w-[120px]">{trim.security}</div>
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-accent-red">{trim.deltaValue}</td>
                    <td className="px-4 py-3 text-right text-text-primary font-medium">{trim.shareChange}</td>
                    <td className="px-4 py-3 text-right text-text-secondary">{trim.newWeight}</td>
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
