import { useCallback, useEffect, useMemo, useState } from 'react'
import { ArrowRight, Flame } from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'
import PopularTreemap from '@/components/PopularTreemap'
import { getSecuritySearchTerms, translateInstitutionName, translateStyleName } from '@/lib/displayNames'
import type { InstitutionMeta, TreemapDatum } from '@/lib/secData'
import { useQuarterArchive } from '@/lib/useQuarterArchive'
import { useLanguage } from '../context/useLanguage'

export default function Dashboard() {
  const [institutions, setInstitutions] = useState<InstitutionMeta[]>([])
  const [treemapNodes, setTreemapNodes] = useState<TreemapDatum[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [focusedInstitutions, setFocusedInstitutions] = useState<string[] | null>(null)
  const [searchParams] = useSearchParams()
  const {
    dataPath,
    isLoadingQuarters,
    selectedQuarter,
  } = useQuarterArchive()
  const { lang, language } = useLanguage()
  const searchQuery = (searchParams.get('q') ?? '').trim().toLowerCase()
  const detailSearch = searchParams.toString()

  const loadDashboardData = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const [institutionsResponse, treemapResponse] = await Promise.all([
        fetch(`${dataPath}/institutions_meta.json`),
        fetch(`${dataPath}/dashboard_treemap.json`),
      ])

      if (!institutionsResponse.ok || !treemapResponse.ok) {
        throw new Error('Unable to load bundled dashboard data')
      }

      const [institutionData, treemapData] = await Promise.all([
        institutionsResponse.json() as Promise<InstitutionMeta[]>,
        treemapResponse.json() as Promise<TreemapDatum[]>,
      ])

      setInstitutions(institutionData)
      setTreemapNodes(treemapData)
    } catch (err) {
      setError(err instanceof Error ? err.message : lang.dataLoadFailed)
    } finally {
      setIsLoading(false)
    }
  }, [dataPath, lang.dataLoadFailed])

  useEffect(() => {
    void loadDashboardData()
  }, [loadDashboardData])

  useEffect(() => {
    setFocusedInstitutions(null)
  }, [dataPath])

  const filteredInstitutions = useMemo(() => {
    if (!searchQuery) {
      return institutions
    }

    const tickerMatchedInstitutionIds = new Set(
      treemapNodes
        .filter((node) => getSecuritySearchTerms(node.ticker, node.ticker).some((term) => term.includes(searchQuery)))
        .flatMap((node) => node.holdingInstitutions),
    )

    return institutions.filter((inst) => {
      const directMatch = [
        inst.name,
        translateInstitutionName(inst, language),
        inst.manager,
        inst.style,
        translateStyleName(inst.style, language),
        inst.quarter,
        inst.id,
      ].some((val) => val?.toLowerCase().includes(searchQuery))

      return directMatch || tickerMatchedInstitutionIds.has(inst.id)
    })
  }, [institutions, language, searchQuery, treemapNodes])

  if (isLoading || isLoadingQuarters) {
    return (
      <div className="glass-card p-12 text-center text-text-secondary font-semibold animate-in fade-in">
        {lang.loadingHistoricalFilings}
      </div>
    )
  }

  if (error) {
    return (
      <div className="glass-card p-8 border-accent-red/20 bg-accent-red/5 text-center text-accent-red">
        {error}
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-text-primary tracking-tight">
            {lang.dashboardNav}
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            {language === 'zh'
              ? '追踪 12 家全球顶流对冲基金与超级投资家的当季 13F 持仓变动与资金流向'
              : 'Tracking quarterly 13F portfolio changes and capital flows across 12 elite global superinvestors'}
          </p>
        </div>

        {selectedQuarter && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-text-secondary border border-border rounded-full px-3 py-1 bg-white">
              {selectedQuarter.label}
            </span>
          </div>
        )}
      </div>

      {/* Quick Entry Banner for Smart Money Consensus */}
      <div className="glass-card p-5 bg-gradient-to-r from-orange-50/70 via-red-50/40 to-white border border-orange-200/70 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-tr from-accent-orange to-accent-red text-white shadow-xs shrink-0">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
              {lang.consensusTitle}
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent-orange/10 text-accent-orange font-bold uppercase">
                Consensus
              </span>
            </h3>
            <p className="text-xs text-text-secondary mt-0.5">
              {lang.consensusSub}
            </p>
          </div>
        </div>

        <Link
          to="/consensus"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-accent-orange to-accent-red text-white text-xs font-bold shadow-xs hover:opacity-95 transition-all shrink-0 cursor-pointer"
        >
          <span>{lang.consensusNav}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Institution Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredInstitutions.map((inst) => {
          const isDimmed = focusedInstitutions !== null && !focusedInstitutions.includes(inst.id)
          const isHighlighted = focusedInstitutions !== null && focusedInstitutions.includes(inst.id)

          return (
            <Link
              key={inst.id}
              to={{
                pathname: `/institution/${inst.id}`,
                search: detailSearch,
              }}
              className={`glass-card transition-all duration-500 transform group overflow-hidden ${
                isDimmed
                  ? 'opacity-40 scale-[0.98] grayscale contrast-75 hover:opacity-100 hover:grayscale-0'
                  : isHighlighted
                    ? 'ring-2 ring-accent-blue/60 shadow-xl scale-[1.02] z-10'
                    : 'hover:shadow-lg hover:-translate-y-1'
              }`}
            >
              <div className="p-4 border-b border-border/50 bg-gradient-to-br from-white to-background/50">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-text-primary text-base leading-tight group-hover:text-accent-blue transition-colors">
                      {translateInstitutionName(inst, language)}
                    </h3>
                    <p className="text-text-secondary text-xs font-medium mt-1">{inst.manager}</p>
                  </div>
                </div>
              </div>

              <div className="p-4 flex justify-between items-end bg-white">
                <div>
                  <div className="text-xl font-black text-text-primary tracking-tight">
                    {inst.aum} <span className="text-xs font-semibold text-text-secondary">AUM</span>
                  </div>
                  <div className="mt-2">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gray-100 text-gray-800 border border-gray-200">
                      {translateStyleName(inst.style, language)}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-semibold text-text-secondary mb-1">{inst.quarter}</div>
                  <div className="text-[11px] font-medium text-accent-blue bg-accent-blue/10 px-2 py-1 rounded-md inline-block">
                    {inst.holdingsCount} {lang.holdings}
                  </div>
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {filteredInstitutions.length === 0 && (
        <div className="glass-card p-8 text-center text-text-secondary font-semibold">
          {lang.noResults}
        </div>
      )}

      {/* Popular Holdings Treemap */}
      <PopularTreemap dataPath={dataPath} onSelectTicker={(ticker) => {
        if (!ticker) {
          setFocusedInstitutions(null)
        } else {
          const matched = treemapNodes.find((n) => n.ticker === ticker)
          setFocusedInstitutions(matched ? (matched.holdingInstitutions as string[]) : null)
        }
      }} />
    </div>
  )
}
