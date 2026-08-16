import { useMemo } from 'react'
import { DollarSign, TrendingDown, TrendingUp } from 'lucide-react'
import { useLanguage } from '@/context/useLanguage'
import { translateSecurityName } from '@/lib/displayNames'
import type { CapitalFlowData } from '@/lib/secData'

interface CapitalFlowSankeyProps {
  data?: CapitalFlowData
}

export default function CapitalFlowSankey({ data }: CapitalFlowSankeyProps) {
  const { lang, language } = useLanguage()

  const flows = useMemo(() => {
    if (!data?.sankey) return { left: [], right: [] }

    const left = data.sankey.nodes
      .slice(0, data.sankey.nodes.findIndex((n) => n.name === 'Capital Liquidity Pool'))
      .map((node, idx) => {
        const link = data.sankey.links.find((l) => l.source === idx)
        const isExit = node.name.includes('Exit')
        const ticker = node.name.split(' ')[0]
        return {
          ticker,
          name: node.name,
          value: link ? link.value : 0,
          isExit,
        }
      })

    const centerIdx = data.sankey.nodes.findIndex((n) => n.name === 'Capital Liquidity Pool')
    const right = data.sankey.nodes.slice(centerIdx + 1).map((node, idx) => {
      const link = data.sankey.links.find((l) => l.target === centerIdx + 1 + idx)
      const isNew = node.name.includes('New')
      const ticker = node.name.split(' ')[0]
      return {
        ticker,
        name: node.name,
        value: link ? link.value : 0,
        isNew,
      }
    })

    return { left, right }
  }, [data])

  if (!data || (!flows.left.length && !flows.right.length)) {
    return null
  }

  return (
    <div className="glass-card p-6 overflow-hidden animate-in fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b border-border pb-4">
        <div>
          <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-accent-blue" />
            {lang.capitalFlowTitle}
          </h3>
          <p className="text-xs text-text-secondary mt-1">{lang.capitalFlowSub}</p>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1.5 font-bold text-accent-green bg-accent-green/10 px-2.5 py-1 rounded-full border border-accent-green/20">
            <TrendingUp className="w-3.5 h-3.5" />
            {lang.totalBought}: {data.totalBought}
          </span>
          <span className="flex items-center gap-1.5 font-bold text-accent-red bg-accent-red/10 px-2.5 py-1 rounded-full border border-accent-red/20">
            <TrendingDown className="w-3.5 h-3.5" />
            {lang.totalSold}: {data.totalSold}
          </span>
        </div>
      </div>

      {/* Sankey Flow Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-11 gap-4 items-center">
        {/* Left Column: Outflows (Trims & Exits) */}
        <div className="lg:col-span-4 space-y-2.5">
          <div className="text-xs font-bold text-accent-red uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>{lang.sellersList}</span>
            <span className="text-[10px] font-normal text-text-secondary">Delta ($)</span>
          </div>
          {flows.left.map((item, idx) => (
            <div
              key={`left-${idx}`}
              className="group flex items-center justify-between p-2.5 rounded-lg border border-border/80 bg-gradient-to-r from-red-50/50 to-white hover:border-accent-red/40 transition-all shadow-2xs"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-xs font-bold text-text-primary">{item.ticker}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                    item.isExit ? 'bg-gray-100 text-gray-700' : 'bg-red-100 text-accent-red'
                  }`}
                >
                  {item.isExit ? lang.exit : lang.trim}
                </span>
                <span className="text-[11px] text-text-secondary truncate hidden sm:inline">
                  {translateSecurityName(item.ticker, language, [item.ticker])}
                </span>
              </div>
              <span className="text-xs font-bold text-accent-red ml-2 whitespace-nowrap">
                -${item.value.toFixed(2)}B
              </span>
            </div>
          ))}
          {flows.left.length === 0 && (
            <div className="text-xs text-text-secondary py-4 text-center">No major trims</div>
          )}
        </div>

        {/* Middle Column: Central Reallocation Hub */}
        <div className="lg:col-span-3 flex flex-col items-center justify-center p-4 rounded-xl bg-gradient-to-b from-blue-50/60 to-purple-50/60 border border-blue-200/60 shadow-inner my-2 lg:my-0">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-accent-blue to-accent-purple text-white flex items-center justify-center font-black shadow-md mb-2">
            ⇄
          </div>
          <span className="text-xs font-bold text-text-primary text-center">
            {language === 'zh' ? '资金流动性调配池' : 'Capital Liquidity Pool'}
          </span>
          <div className="mt-2 text-center">
            <span className="text-[11px] font-medium text-text-secondary">{lang.netCapitalFlow}</span>
            <div
              className={`text-sm font-black ${
                data.netCapitalFlow.startsWith('+') ? 'text-accent-green' : 'text-accent-red'
              }`}
            >
              {data.netCapitalFlow}
            </div>
          </div>
          <div className="mt-2 text-[10px] font-semibold text-text-secondary border border-border px-2 py-0.5 rounded-full bg-white/80">
            {lang.turnoverRate}: {data.turnoverRate}
          </div>
        </div>

        {/* Right Column: Inflows (Adds & New) */}
        <div className="lg:col-span-4 space-y-2.5">
          <div className="text-xs font-bold text-accent-green uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>{lang.buyersList}</span>
            <span className="text-[10px] font-normal text-text-secondary">Delta ($)</span>
          </div>
          {flows.right.map((item, idx) => (
            <div
              key={`right-${idx}`}
              className="group flex items-center justify-between p-2.5 rounded-lg border border-border/80 bg-gradient-to-r from-white to-emerald-50/50 hover:border-accent-green/40 transition-all shadow-2xs"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-xs font-bold text-text-primary">{item.ticker}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                    item.isNew ? 'bg-blue-100 text-accent-blue' : 'bg-emerald-100 text-accent-green'
                  }`}
                >
                  {item.isNew ? lang.new : lang.add}
                </span>
                <span className="text-[11px] text-text-secondary truncate hidden sm:inline">
                  {translateSecurityName(item.ticker, language, [item.ticker])}
                </span>
              </div>
              <span className="text-xs font-bold text-accent-green ml-2 whitespace-nowrap">
                +${item.value.toFixed(2)}B
              </span>
            </div>
          ))}
          {flows.right.length === 0 && (
            <div className="text-xs text-text-secondary py-4 text-center">No major adds</div>
          )}
        </div>
      </div>
    </div>
  )
}
