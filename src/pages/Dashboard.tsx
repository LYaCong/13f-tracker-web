import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import PopularTreemap from '@/components/PopularTreemap'
import { translateStyleName } from '@/lib/displayNames'
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
        .filter((node) => node.ticker.toLowerCase().includes(searchQuery))
        .flatMap((node) => node.holdingInstitutions),
    )

    return institutions.filter((inst) => {
      const directMatch = [
        inst.name,
        inst.manager,
        inst.style,
        translateStyleName(inst.style, language),
        inst.quarter,
        inst.id,
      ].some((value) => value.toLowerCase().includes(searchQuery))

      return directMatch || tickerMatchedInstitutionIds.has(inst.id)
    })
  }, [institutions, language, searchQuery, treemapNodes])

  const quarterSummary = useMemo(() => {
    const counts = institutions.reduce<Record<string, number>>((acc, inst) => {
      acc[inst.quarter] = (acc[inst.quarter] ?? 0) + 1
      return acc
    }, {})

    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([quarter, count]) => `${quarter} (${count})`)
      .join(' / ')
  }, [institutions])

  if (isLoading || isLoadingQuarters) {
    return (
      <div className="glass-card p-8 text-center text-text-secondary font-semibold animate-in fade-in">
        {lang.loadingHistoricalFilings}
      </div>
    )
  }

  if (error) {
    return (
      <div className="glass-card p-8 text-center animate-in fade-in">
        <p className="font-bold text-text-primary">{lang.dataLoadFailed}</p>
        <p className="text-sm text-text-secondary mt-2">{error}</p>
        <button
          type="button"
          onClick={() => void loadDashboardData()}
          className="mt-4 px-4 py-2 rounded-md bg-accent-blue text-white text-sm font-bold hover:bg-blue-700 transition-colors"
        >
          {lang.retry}
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-5 animate-in fade-in duration-500">
      <div className="flex flex-col gap-3 px-2 mb-2">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-text-primary to-text-secondary">
            {lang.trackedInstitutions}{' '}
            <span className="text-sm font-medium text-text-secondary ml-2 border border-border px-2 py-0.5 rounded-full">
              {filteredInstitutions.length}/{institutions.length} {lang.fundsMapped}
            </span>
          </h2>
          {quarterSummary && (
            <span className="text-xs font-semibold text-text-secondary border border-border rounded-full px-3 py-1 bg-white">
              {quarterSummary}
            </span>
          )}
        </div>

        <div className="glass-card border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <span className="font-bold">{selectedQuarter?.label ?? lang.snapshotLabel}:</span>{' '}
          {selectedQuarter?.summary ?? lang.mixedSnapshotNotice}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 transition-all duration-500">
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
                      {inst.name}
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

      <PopularTreemap dataPath={dataPath} onNodeFocus={setFocusedInstitutions} />
    </div>
  )
}
