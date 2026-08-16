import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Building2, DollarSign, PieChart, Users } from 'lucide-react'
import { useLanguage } from '@/context/useLanguage'
import {
  translateInstitutionName,
  translateSectorName,
  translateSecurityName,
  translateStyleName,
} from '@/lib/displayNames'
import type { TickerDetailData } from '@/lib/secData'
import { useQuarterArchive } from '@/lib/useQuarterArchive'

export default function TickerDetail() {
  const { symbol } = useParams()
  const { lang, language } = useLanguage()
  const { dataPath, selectedQuarter } = useQuarterArchive()
  const [tickerData, setTickerData] = useState<TickerDetailData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true
    async function loadTicker() {
      if (!symbol) return
      setIsLoading(true)
      setError(null)
      try {
        const res = await fetch(`${dataPath}/all_tickers.json`)
        if (!res.ok) throw new Error('Unable to load tickers database')
        const allTickers = (await res.json()) as Record<string, TickerDetailData>
        const matched = allTickers[symbol.toUpperCase()]
        if (!matched) {
          throw new Error(`Ticker ${symbol} not found in current snapshot`)
        }
        if (isMounted) setTickerData(matched)
      } catch (err) {
        if (isMounted) setError(err instanceof Error ? err.message : lang.dataLoadFailed)
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }
    void loadTicker()
    return () => {
      isMounted = false
    }
  }, [dataPath, symbol, lang.dataLoadFailed])

  if (isLoading) {
    return (
      <div className="glass-card p-12 text-center text-text-secondary font-semibold animate-in fade-in">
        {lang.loadingHistoricalFilings}
      </div>
    )
  }

  if (error || !tickerData) {
    return (
      <div className="glass-card p-12 text-center animate-in fade-in space-y-4">
        <p className="text-base font-bold text-text-primary">{error || lang.dataLoadFailed}</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-blue text-white text-xs font-bold hover:bg-blue-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {lang.backToDashboard}
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Navigation Header */}
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

      {/* Hero Header Card */}
      <div className="glass-card p-6 border-b-2 border-accent-blue/30 bg-gradient-to-br from-white via-white to-blue-50/30">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-2xl sm:text-3xl font-black text-text-primary tracking-tight">
                {tickerData.ticker}
              </span>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-accent-blue/10 text-accent-blue border border-accent-blue/20">
                {translateSectorName(tickerData.sector, language)}
              </span>
              <span className="text-xs text-text-secondary font-mono">
                CUSIP: {tickerData.cusip}
              </span>
            </div>
            <h1 className="text-lg font-bold text-text-secondary mt-1">
              {translateSecurityName(tickerData.name, language, [tickerData.ticker, tickerData.name])}
            </h1>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full md:w-auto">
            <div className="p-3 rounded-xl bg-white border border-border shadow-2xs">
              <div className="text-[11px] font-medium text-text-secondary flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-accent-blue" />
                {lang.holdingInstitutions}
              </div>
              <div className="text-lg font-black text-text-primary mt-1">
                {tickerData.holdingCount} <span className="text-xs font-normal text-text-secondary">/ 12</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white border border-border shadow-2xs">
              <div className="text-[11px] font-medium text-text-secondary flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-accent-green" />
                {lang.quarterEndNetAssets}
              </div>
              <div className="text-lg font-black text-text-primary mt-1">
                {tickerData.mktValue}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white border border-border shadow-2xs">
              <div className="text-[11px] font-medium text-text-secondary flex items-center gap-1">
                <PieChart className="w-3.5 h-3.5 text-accent-purple" />
                {lang.avg} {lang.weight}
              </div>
              <div className="text-lg font-black text-text-primary mt-1">
                {tickerData.avgWeight}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white border border-border shadow-2xs">
              <div className="text-[11px] font-medium text-text-secondary flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-text-secondary" />
                {lang.shares}
              </div>
              <div className="text-lg font-black text-text-primary mt-1">
                {tickerData.sharesFormatted}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Holding Institutions Table */}
      <div className="glass-card overflow-hidden">
        <div className="p-4 bg-background/50 border-b border-border flex items-center justify-between">
          <h2 className="text-base font-bold text-text-primary flex items-center gap-2">
            <Building2 className="w-4 h-4 text-accent-blue" />
            {lang.topHolders} ({tickerData.holders.length})
          </h2>
          <span className="text-xs text-text-secondary">
            {lang.clickAnyBlock}
          </span>
        </div>

        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
            <thead className="text-text-secondary text-xs border-b border-border bg-background">
              <tr>
                <th className="px-4 py-3 font-semibold whitespace-nowrap">{lang.trackedInstitutions}</th>
                <th className="px-4 py-3 font-semibold whitespace-nowrap min-w-[90px]">{lang.dominantStyle}</th>
                <th className="px-4 py-3 font-semibold text-center whitespace-nowrap">{lang.action}</th>
                <th className="px-4 py-3 font-semibold text-right whitespace-nowrap">{lang.shares}</th>
                <th className="px-4 py-3 font-semibold text-right whitespace-nowrap">{lang.shareChange}</th>
                <th className="px-4 py-3 font-semibold text-right whitespace-nowrap">{lang.mktValueB}</th>
                <th className="px-4 py-3 font-semibold text-right whitespace-nowrap">{lang.weight}</th>
                <th className="px-4 py-3 font-semibold text-right whitespace-nowrap">{lang.weightQoQ}</th>
                <th className="px-4 py-3 font-semibold text-right whitespace-nowrap">{lang.qoqDelta}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {tickerData.holders.map((holder, idx) => (
                <tr key={idx} className="hover:bg-background/50 transition-colors group">
                  <td className="px-4 py-3.5">
                    <Link
                      to={`/institution/${holder.instId}`}
                      className="font-bold text-text-primary group-hover:text-accent-blue transition-colors block whitespace-nowrap"
                    >
                      {translateInstitutionName({ name: holder.instName, id: holder.instId }, language)}
                    </Link>
                    <div className="text-xs text-text-secondary whitespace-nowrap">{holder.manager}</div>
                  </td>
                  <td className="px-4 py-3.5 text-xs whitespace-nowrap">
                    <span className="px-2.5 py-1 rounded-full bg-gray-100 border border-gray-200 font-medium whitespace-nowrap inline-flex items-center">
                      {translateStyleName(holder.style, language)}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-center whitespace-nowrap">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase whitespace-nowrap inline-flex items-center justify-center ${
                        holder.action === 'Add'
                          ? 'bg-accent-green/10 text-accent-green'
                          : holder.action === 'Trim'
                            ? 'bg-accent-red/10 text-accent-red'
                            : holder.action === 'New'
                              ? 'bg-accent-blue/10 text-accent-blue'
                              : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {holder.action === 'Add'
                        ? lang.add
                        : holder.action === 'Trim'
                          ? lang.trim
                          : holder.action === 'New'
                            ? lang.new
                            : lang.hold}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right font-mono text-xs font-semibold text-text-primary whitespace-nowrap">
                    {holder.sharesFormatted}
                  </td>
                  <td className="px-4 py-3.5 text-right text-xs font-bold whitespace-nowrap">
                    <span
                      className={
                        holder.shareChangeText?.startsWith('+')
                          ? 'text-accent-green'
                          : holder.shareChangeText?.startsWith('-')
                            ? 'text-accent-red'
                            : 'text-text-secondary'
                      }
                    >
                      {holder.shareChangeText || '0.0%'}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right font-black text-text-primary whitespace-nowrap">
                    {holder.mktValue}
                  </td>
                  <td className="px-4 py-3.5 text-right font-bold text-accent-blue whitespace-nowrap">
                    {holder.weight.toFixed(2)}%
                  </td>
                  <td className="px-4 py-3.5 text-right text-xs font-semibold whitespace-nowrap">
                    <span
                      className={
                        holder.weightChangeText?.startsWith('+')
                          ? 'text-accent-green'
                          : holder.weightChangeText?.startsWith('-')
                            ? 'text-accent-red'
                            : 'text-text-secondary'
                      }
                    >
                      {holder.weightChangeText || '0.00%'}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right font-mono text-xs font-bold whitespace-nowrap">
                    <span
                      className={
                        holder.qOqDelta?.startsWith('+')
                          ? 'text-accent-green'
                          : holder.qOqDelta?.startsWith('-')
                            ? 'text-accent-red'
                            : 'text-text-secondary'
                      }
                    >
                      {holder.qOqDelta || '--'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
