import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Award, Flame, TrendingDown, TrendingUp, Users } from 'lucide-react'
import { useLanguage } from '@/context/useLanguage'
import { translateSectorName, translateSecurityName } from '@/lib/displayNames'
import type { ConsensusData } from '@/lib/secData'

interface ConsensusBoardsProps {
  dataPath: string
}

type TabType = 'buys' | 'trims' | 'holdings' | 'conviction'

export default function ConsensusBoards({ dataPath }: ConsensusBoardsProps) {
  const { lang, language } = useLanguage()
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
    return null
  }

  return (
    <div className="glass-card p-6 overflow-hidden animate-in fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b border-border pb-4">
        <div>
          <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
            <Flame className="w-5 h-5 text-accent-orange" />
            {lang.consensusTitle}
            <span className="text-xs font-semibold text-text-secondary border border-border px-2 py-0.5 rounded-full bg-white ml-2">
              {data.quarter}
            </span>
          </h2>
          <p className="text-xs text-text-secondary mt-1">{lang.consensusSub}</p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1 bg-background/80 p-1 border border-border rounded-xl">
          <button
            type="button"
            onClick={() => setActiveTab('buys')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'buys'
                ? 'bg-white text-accent-green shadow-xs'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            {lang.topConsensusBuys}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('trims')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'trims'
                ? 'bg-white text-accent-red shadow-xs'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <TrendingDown className="w-3.5 h-3.5" />
            {lang.topConsensusTrims}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('holdings')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'holdings'
                ? 'bg-white text-accent-blue shadow-xs'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            {lang.topConsensusHoldings}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('conviction')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'conviction'
                ? 'bg-white text-accent-purple shadow-xs'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            {lang.highestConvictionBets}
          </button>
        </div>
      </div>

      {/* Tab 1: Top Consensus Buys */}
      {activeTab === 'buys' && (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-text-secondary text-xs border-b border-border bg-background/50">
              <tr>
                <th className="px-4 py-3 font-semibold">#</th>
                <th className="px-4 py-3 font-semibold">{lang.security}</th>
                <th className="px-4 py-3 font-semibold">{lang.segment}</th>
                <th className="px-4 py-3 font-semibold text-center">{lang.buyerCount}</th>
                <th className="px-4 py-3 font-semibold text-right">{lang.totalBought}</th>
                <th className="px-4 py-3 font-semibold text-right">{lang.quarterEndNetAssets}</th>
                <th className="px-4 py-3 font-semibold">{lang.buyersList}</th>
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
                      <span>{item.ticker}</span>
                      <span className="text-xs font-normal text-text-secondary truncate max-w-[140px]">
                        {translateSecurityName(item.name, language, [item.ticker, item.name])}
                      </span>
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-xs text-text-secondary">
                    <span className="px-2 py-0.5 rounded-full bg-gray-100 border border-gray-200">
                      {translateSectorName(item.sector, language)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-black bg-accent-green/10 text-accent-green">
                      {item.buyerCount}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-black text-accent-green">
                    +{item.totalBoughtFormatted}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-text-primary">
                    {item.totalValueFormatted}
                  </td>
                  <td className="px-4 py-3 text-xs text-text-secondary">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {Array.from(new Set(item.buyers)).map((buyer, bIdx) => (
                        <span
                          key={bIdx}
                          className="px-1.5 py-0.5 rounded bg-background border border-border/80 text-[10px]"
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
                <th className="px-4 py-3 font-semibold">#</th>
                <th className="px-4 py-3 font-semibold">{lang.security}</th>
                <th className="px-4 py-3 font-semibold">{lang.segment}</th>
                <th className="px-4 py-3 font-semibold text-center">{lang.sellerCount}</th>
                <th className="px-4 py-3 font-semibold text-right">{lang.totalSold}</th>
                <th className="px-4 py-3 font-semibold text-right">{lang.quarterEndNetAssets}</th>
                <th className="px-4 py-3 font-semibold">{lang.sellersList}</th>
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
                      <span>{item.ticker}</span>
                      <span className="text-xs font-normal text-text-secondary truncate max-w-[140px]">
                        {translateSecurityName(item.name, language, [item.ticker, item.name])}
                      </span>
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-xs text-text-secondary">
                    <span className="px-2 py-0.5 rounded-full bg-gray-100 border border-gray-200">
                      {translateSectorName(item.sector, language)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-black bg-accent-red/10 text-accent-red">
                      {item.sellerCount}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-black text-accent-red">
                    -{item.totalSoldFormatted}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-text-primary">
                    {item.totalValueFormatted}
                  </td>
                  <td className="px-4 py-3 text-xs text-text-secondary">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {Array.from(new Set(item.sellers)).map((seller, sIdx) => (
                        <span
                          key={sIdx}
                          className="px-1.5 py-0.5 rounded bg-background border border-border/80 text-[10px]"
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
                <th className="px-4 py-3 font-semibold">#</th>
                <th className="px-4 py-3 font-semibold">{lang.security}</th>
                <th className="px-4 py-3 font-semibold">{lang.segment}</th>
                <th className="px-4 py-3 font-semibold text-center">{lang.holderCount}</th>
                <th className="px-4 py-3 font-semibold text-right">{lang.quarterEndNetAssets}</th>
                <th className="px-4 py-3 font-semibold text-right">{lang.avg} {lang.weight}</th>
                <th className="px-4 py-3 font-semibold">{lang.topHolders}</th>
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
                      <span>{item.ticker}</span>
                      <span className="text-xs font-normal text-text-secondary truncate max-w-[140px]">
                        {translateSecurityName(item.name, language, [item.ticker, item.name])}
                      </span>
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-xs text-text-secondary">
                    <span className="px-2 py-0.5 rounded-full bg-gray-100 border border-gray-200">
                      {translateSectorName(item.sector, language)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-black bg-accent-blue/10 text-accent-blue">
                      {item.holdingCount}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-black text-text-primary">
                    {item.totalValueFormatted}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-text-secondary">
                    {item.avgWeight}
                  </td>
                  <td className="px-4 py-3 text-xs text-text-secondary">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {Array.from(new Set(item.holders)).map((holder, hIdx) => (
                        <span
                          key={hIdx}
                          className="px-1.5 py-0.5 rounded bg-background border border-border/80 text-[10px]"
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
                <th className="px-4 py-3 font-semibold">#</th>
                <th className="px-4 py-3 font-semibold">{lang.security}</th>
                <th className="px-4 py-3 font-semibold">{lang.trackedInstitutions}</th>
                <th className="px-4 py-3 font-semibold">{lang.segment}</th>
                <th className="px-4 py-3 font-semibold text-right">{lang.weight}</th>
                <th className="px-4 py-3 font-semibold text-right">{lang.mktValueB}</th>
                <th className="px-4 py-3 font-semibold text-center">{lang.action}</th>
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
                      <span>{item.ticker}</span>
                      <span className="text-xs font-normal text-text-secondary truncate max-w-[140px]">
                        {translateSecurityName(item.name, language, [item.ticker, item.name])}
                      </span>
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-bold text-text-primary text-xs">{item.institution}</div>
                    <div className="text-[11px] text-text-secondary">{item.manager}</div>
                  </td>
                  <td className="px-4 py-3 text-xs text-text-secondary">
                    <span className="px-2 py-0.5 rounded-full bg-gray-100 border border-gray-200">
                      {translateSectorName(item.sector, language)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-black text-accent-purple text-base">
                    {item.weight}
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-text-primary">
                    {item.mktValue}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
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
  )
}
