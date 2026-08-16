import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Award, Flame, TrendingDown, TrendingUp, Users } from 'lucide-react'
import { useLanguage } from '@/context/useLanguage'
import { translateSectorName, translateSecurityName } from '@/lib/displayNames'
import type { ConsensusData } from '@/lib/secData'
import { useQuarterArchive } from '@/lib/useQuarterArchive'

type TabType = 'buys' | 'trims' | 'holdings' | 'conviction'

export default function ConsensusPage() {
  const { lang, language } = useLanguage()
  const { dataPath, selectedQuarter } = useQuarterArchive()
  const [data, setData] = useState<ConsensusData | null>(null)
  const [activeTab, setActiveTab] = useState<TabType>('buys')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    async function loadConsensus() {
      setIsLoading(true)
      try {
        const res = await fetch(`${dataPath}/consensus_data.json`)
        if (res.ok) {
          const json = (await res.json()) as ConsensusData
          if (isMounted) setData(json)
        }
      } catch {
        // Fallback
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }
    void loadConsensus()
    return () => {
      isMounted = false
    }
  }, [dataPath])

  if (isLoading || !data) {
    return (
      <div className="glass-card p-12 text-center text-text-secondary font-semibold animate-in fade-in">
        {lang.loadingHistoricalFilings}
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Top Navigation & Quarter Tag */}
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
      <div className="glass-card p-6 border-b-2 border-accent-orange/30 bg-gradient-to-br from-white via-orange-50/20 to-red-50/30">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1.5 rounded-lg bg-gradient-to-tr from-accent-orange to-accent-red text-white">
                <Flame className="w-4 h-4" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-accent-orange">
                Smart Money Consensus Intelligence
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-text-primary tracking-tight">
              {lang.consensusTitle}
            </h1>
            <p className="text-xs sm:text-sm text-text-secondary mt-1 max-w-2xl">
              {lang.consensusSub}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="p-3 rounded-xl bg-white border border-border shadow-2xs min-w-[120px]">
              <div className="text-[11px] font-medium text-text-secondary flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-accent-green" />
                {lang.topConsensusBuys}
              </div>
              <div className="text-xl font-black text-text-primary mt-0.5">
                {data.topConsensusBuys.length} <span className="text-xs font-normal text-text-secondary">stocks</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white border border-border shadow-2xs min-w-[120px]">
              <div className="text-[11px] font-medium text-text-secondary flex items-center gap-1">
                <TrendingDown className="w-3.5 h-3.5 text-accent-red" />
                {lang.topConsensusTrims}
              </div>
              <div className="text-xl font-black text-text-primary mt-0.5">
                {data.topConsensusTrims.length} <span className="text-xs font-normal text-text-secondary">stocks</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white border border-border shadow-2xs min-w-[120px]">
              <div className="text-[11px] font-medium text-text-secondary flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-accent-purple" />
                {lang.highestConvictionBets}
              </div>
              <div className="text-xl font-black text-text-primary mt-0.5">
                {data.highestConvictionBets.length} <span className="text-xs font-normal text-text-secondary">bets</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Consensus Board Container */}
      <div className="glass-card p-6 overflow-hidden">
        {/* Tab Buttons */}
        <div className="flex flex-wrap items-center gap-2 mb-6 border-b border-border pb-4">
          <button
            type="button"
            onClick={() => setActiveTab('buys')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'buys'
                ? 'bg-accent-green text-white shadow-xs'
                : 'bg-background/80 text-text-secondary hover:text-text-primary border border-border'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            {lang.topConsensusBuys}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('trims')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'trims'
                ? 'bg-accent-red text-white shadow-xs'
                : 'bg-background/80 text-text-secondary hover:text-text-primary border border-border'
            }`}
          >
            <TrendingDown className="w-4 h-4" />
            {lang.topConsensusTrims}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('holdings')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'holdings'
                ? 'bg-accent-blue text-white shadow-xs'
                : 'bg-background/80 text-text-secondary hover:text-text-primary border border-border'
            }`}
          >
            <Award className="w-4 h-4" />
            {lang.topConsensusHoldings}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('conviction')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'conviction'
                ? 'bg-accent-purple text-white shadow-xs'
                : 'bg-background/80 text-text-secondary hover:text-text-primary border border-border'
            }`}
          >
            <Users className="w-4 h-4" />
            {lang.highestConvictionBets}
          </button>
        </div>

        {/* Tab 1: Top Consensus Buys */}
        {activeTab === 'buys' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-text-secondary text-xs border-b border-border bg-background/50">
                <tr>
                  <th className="px-4 py-3 font-semibold whitespace-nowrap">#</th>
                  <th className="px-4 py-3 font-semibold whitespace-nowrap">{lang.security}</th>
                  <th className="px-4 py-3 font-semibold whitespace-nowrap min-w-[100px]">{lang.segment}</th>
                  <th className="px-4 py-3 font-semibold text-center whitespace-nowrap">{lang.buyerCount}</th>
                  <th className="px-4 py-3 font-semibold text-right whitespace-nowrap">{lang.totalBought}</th>
                  <th className="px-4 py-3 font-semibold text-right whitespace-nowrap">{lang.quarterEndNetAssets}</th>
                  <th className="px-4 py-3 font-semibold whitespace-nowrap">{lang.buyersList}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {data.topConsensusBuys.map((item, idx) => (
                  <tr key={idx} className="hover:bg-background/50 transition-colors group">
                    <td className="px-4 py-3 text-xs font-bold text-text-secondary">{idx + 1}</td>
                    <td className="px-4 py-3">
                      <Link
                        to={`/ticker/${item.ticker}`}
                        className="font-bold text-text-primary group-hover:text-accent-blue transition-colors flex items-center gap-1.5"
                      >
                        <span className="shrink-0">{item.ticker}</span>
                        <span className="text-xs font-normal text-text-secondary truncate max-w-[160px]">
                          {translateSecurityName(item.name, language, [item.ticker, item.name])}
                        </span>
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-xs text-text-secondary whitespace-nowrap">
                      <span className="px-2.5 py-1 rounded-full bg-gray-100 border border-gray-200 whitespace-nowrap inline-flex items-center">
                        {translateSectorName(item.sector, language)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center whitespace-nowrap">
                      <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-black bg-accent-green/10 text-accent-green">
                        {item.buyerCount}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-black text-accent-green whitespace-nowrap">
                      +{item.totalBoughtFormatted}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-text-primary whitespace-nowrap">
                      {item.totalValueFormatted}
                    </td>
                    <td className="px-4 py-3 text-xs text-text-secondary">
                      <div className="flex flex-wrap gap-1 max-w-sm">
                        {Array.from(new Set(item.buyers)).map((buyer, bIdx) => (
                          <span
                            key={bIdx}
                            className="px-1.5 py-0.5 rounded bg-background border border-border/80 text-[10px] whitespace-nowrap"
                          >
                            {buyer.split(' ')[0]}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 2: Top Consensus Trims */}
        {activeTab === 'trims' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-text-secondary text-xs border-b border-border bg-background/50">
                <tr>
                  <th className="px-4 py-3 font-semibold whitespace-nowrap">#</th>
                  <th className="px-4 py-3 font-semibold whitespace-nowrap">{lang.security}</th>
                  <th className="px-4 py-3 font-semibold whitespace-nowrap min-w-[100px]">{lang.segment}</th>
                  <th className="px-4 py-3 font-semibold text-center whitespace-nowrap">{lang.sellerCount}</th>
                  <th className="px-4 py-3 font-semibold text-right whitespace-nowrap">{lang.totalSold}</th>
                  <th className="px-4 py-3 font-semibold text-right whitespace-nowrap">{lang.quarterEndNetAssets}</th>
                  <th className="px-4 py-3 font-semibold whitespace-nowrap">{lang.sellersList}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {data.topConsensusTrims.map((item, idx) => (
                  <tr key={idx} className="hover:bg-background/50 transition-colors group">
                    <td className="px-4 py-3 text-xs font-bold text-text-secondary">{idx + 1}</td>
                    <td className="px-4 py-3">
                      <Link
                        to={`/ticker/${item.ticker}`}
                        className="font-bold text-text-primary group-hover:text-accent-blue transition-colors flex items-center gap-1.5"
                      >
                        <span className="shrink-0">{item.ticker}</span>
                        <span className="text-xs font-normal text-text-secondary truncate max-w-[160px]">
                          {translateSecurityName(item.name, language, [item.ticker, item.name])}
                        </span>
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-xs text-text-secondary whitespace-nowrap">
                      <span className="px-2.5 py-1 rounded-full bg-gray-100 border border-gray-200 whitespace-nowrap inline-flex items-center">
                        {translateSectorName(item.sector, language)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center whitespace-nowrap">
                      <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-black bg-accent-red/10 text-accent-red">
                        {item.sellerCount}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-black text-accent-red whitespace-nowrap">
                      -{item.totalSoldFormatted}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-text-primary whitespace-nowrap">
                      {item.totalValueFormatted}
                    </td>
                    <td className="px-4 py-3 text-xs text-text-secondary">
                      <div className="flex flex-wrap gap-1 max-w-sm">
                        {Array.from(new Set(item.sellers)).map((seller, sIdx) => (
                          <span
                            key={sIdx}
                            className="px-1.5 py-0.5 rounded bg-background border border-border/80 text-[10px] whitespace-nowrap"
                          >
                            {seller.split(' ')[0]}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 3: Top Consensus Holdings */}
        {activeTab === 'holdings' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-text-secondary text-xs border-b border-border bg-background/50">
                <tr>
                  <th className="px-4 py-3 font-semibold whitespace-nowrap">#</th>
                  <th className="px-4 py-3 font-semibold whitespace-nowrap">{lang.security}</th>
                  <th className="px-4 py-3 font-semibold whitespace-nowrap min-w-[100px]">{lang.segment}</th>
                  <th className="px-4 py-3 font-semibold text-center whitespace-nowrap">{lang.holderCount}</th>
                  <th className="px-4 py-3 font-semibold text-right whitespace-nowrap">{lang.quarterEndNetAssets}</th>
                  <th className="px-4 py-3 font-semibold text-right whitespace-nowrap">{lang.avg} {lang.weight}</th>
                  <th className="px-4 py-3 font-semibold whitespace-nowrap">{lang.topHolders}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {data.topConsensusHoldings.map((item, idx) => (
                  <tr key={idx} className="hover:bg-background/50 transition-colors group">
                    <td className="px-4 py-3 text-xs font-bold text-text-secondary">{idx + 1}</td>
                    <td className="px-4 py-3">
                      <Link
                        to={`/ticker/${item.ticker}`}
                        className="font-bold text-text-primary group-hover:text-accent-blue transition-colors flex items-center gap-1.5"
                      >
                        <span className="shrink-0">{item.ticker}</span>
                        <span className="text-xs font-normal text-text-secondary truncate max-w-[160px]">
                          {translateSecurityName(item.name, language, [item.ticker, item.name])}
                        </span>
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-xs text-text-secondary whitespace-nowrap">
                      <span className="px-2.5 py-1 rounded-full bg-gray-100 border border-gray-200 whitespace-nowrap inline-flex items-center">
                        {translateSectorName(item.sector, language)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center whitespace-nowrap">
                      <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-black bg-accent-blue/10 text-accent-blue">
                        {item.holdingCount}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-black text-text-primary whitespace-nowrap">
                      {item.totalValueFormatted}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-text-secondary whitespace-nowrap">
                      {item.avgWeight}
                    </td>
                    <td className="px-4 py-3 text-xs text-text-secondary">
                      <div className="flex flex-wrap gap-1 max-w-sm">
                        {Array.from(new Set(item.holders)).map((holder, hIdx) => (
                          <span
                            key={hIdx}
                            className="px-1.5 py-0.5 rounded bg-background border border-border/80 text-[10px] whitespace-nowrap"
                          >
                            {holder.split(' ')[0]}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 4: Highest Conviction Bets */}
        {activeTab === 'conviction' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-text-secondary text-xs border-b border-border bg-background/50">
                <tr>
                  <th className="px-4 py-3 font-semibold whitespace-nowrap">#</th>
                  <th className="px-4 py-3 font-semibold whitespace-nowrap">{lang.security}</th>
                  <th className="px-4 py-3 font-semibold whitespace-nowrap">{lang.trackedInstitutions}</th>
                  <th className="px-4 py-3 font-semibold whitespace-nowrap min-w-[100px]">{lang.segment}</th>
                  <th className="px-4 py-3 font-semibold text-right whitespace-nowrap">{lang.weight}</th>
                  <th className="px-4 py-3 font-semibold text-right whitespace-nowrap">{lang.mktValueB}</th>
                  <th className="px-4 py-3 font-semibold text-center whitespace-nowrap">{lang.action}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {data.highestConvictionBets.map((item, idx) => (
                  <tr key={idx} className="hover:bg-background/50 transition-colors group">
                    <td className="px-4 py-3 text-xs font-bold text-text-secondary">{idx + 1}</td>
                    <td className="px-4 py-3">
                      <Link
                        to={`/ticker/${item.ticker}`}
                        className="font-bold text-text-primary group-hover:text-accent-blue transition-colors flex items-center gap-1.5"
                      >
                        <span className="shrink-0">{item.ticker}</span>
                        <span className="text-xs font-normal text-text-secondary truncate max-w-[160px]">
                          {translateSecurityName(item.name, language, [item.ticker, item.name])}
                        </span>
                      </Link>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="font-bold text-text-primary text-xs">{item.institution}</div>
                      <div className="text-[11px] text-text-secondary">{item.manager}</div>
                    </td>
                    <td className="px-4 py-3 text-xs text-text-secondary whitespace-nowrap">
                      <span className="px-2.5 py-1 rounded-full bg-gray-100 border border-gray-200 whitespace-nowrap inline-flex items-center">
                        {translateSectorName(item.sector, language)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-black text-accent-purple text-base whitespace-nowrap">
                      {item.weight}
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-text-primary whitespace-nowrap">
                      {item.mktValue}
                    </td>
                    <td className="px-4 py-3 text-center whitespace-nowrap">
                      <span
                        className={`text-[10px] px-2.5 py-1 rounded font-bold uppercase whitespace-nowrap inline-flex items-center justify-center ${
                          item.action === 'Add'
                            ? 'bg-accent-green/10 text-accent-green'
                            : item.action === 'Trim'
                              ? 'bg-accent-red/10 text-accent-red'
                              : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {item.action === 'Add' ? lang.add : item.action === 'Trim' ? lang.trim : lang.hold}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
