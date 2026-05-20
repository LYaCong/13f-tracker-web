import { useCallback, useEffect, useState } from 'react'
import { ResponsiveContainer, Treemap } from 'recharts'
import type { TreemapDatum, TreemapLeafDatum } from '@/lib/secData'
import { useLanguage } from '../context/useLanguage'

const colors = [
  '#60a5fa', '#34d399', '#f472b6', '#a78bfa', '#fbbf24',
  '#38bdf8', '#4ade80', '#fb923c', '#f87171', '#818cf8',
  '#2dd4bf', '#a3e635', '#fcd34d', '#c084fc', '#f43f5e',
  '#22d3ee', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444',
]

interface TreemapNodeProps {
  x: number
  y: number
  width: number
  height: number
  index: number
  depth: number
  name: string
  heat?: number
  avgWeight?: string
  value?: string
  instCount?: number
  holdingInstitutions?: string[]
  payload?: Partial<TreemapLeafDatum>
  root?: Partial<TreemapLeafDatum>
  onClickNode?: (node: TreemapLeafDatum) => void
  heatLabel?: string
  totalInstitutionsShort?: string
}

function CustomizedContent(props: TreemapNodeProps) {
  const { x, y, width, height, index, depth, name, onClickNode } = props

  if (!width || !height || width <= 0 || height <= 0 || depth !== 2) {
    return null
  }

  const bgColor = colors[(index ?? 0) % colors.length]
  const heat = props.heat ?? props.root?.heat ?? props.payload?.heat ?? 0
  const avgWeight = props.avgWeight ?? props.root?.avgWeight ?? props.payload?.avgWeight ?? '--'
  const value = props.value ?? props.root?.value ?? props.payload?.value ?? '--'
  const instCount = props.instCount ?? props.root?.instCount ?? props.payload?.instCount ?? 0
  const holdingInstitutions =
    props.holdingInstitutions ??
    props.root?.holdingInstitutions ??
    props.payload?.holdingInstitutions ??
    []

  const nodeData: TreemapLeafDatum = {
    name,
    size: props.payload?.size ?? 0,
    heat,
    avgWeight,
    value,
    instCount,
    holdingInstitutions,
  }

  return (
    <g
      onClick={() => onClickNode?.(nodeData)}
      className="cursor-pointer transition-all duration-300 hover:opacity-80 drop-shadow-sm"
    >
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        style={{
          fill: bgColor,
          stroke: '#ffffff',
          strokeWidth: 3,
          strokeOpacity: 0.8,
          rx: 6,
        }}
      />
      {width > 40 && height > 30 && (
        <foreignObject x={x + 2} y={y + 2} width={width - 4} height={height - 4}>
          <div
            className="w-full h-full flex flex-col items-center justify-center text-white text-center p-1 overflow-hidden"
            style={{ textShadow: '0px 1px 3px rgba(0,0,0,0.4)' }}
          >
            <div
              className="font-bold truncate w-full leading-tight drop-shadow-md"
              style={{ fontSize: Math.max(12, Math.min(22, Math.floor(width / 5))) }}
            >
              {name}
            </div>

            {height > 55 && width > 60 && (
              <div
                className="font-medium truncate w-full mt-1 opacity-90 leading-tight"
                style={{ fontSize: Math.max(9, Math.min(12, Math.floor(width / 10))) }}
              >
                {props.heatLabel ?? 'Heat'} {heat} | {avgWeight}
              </div>
            )}

            {height > 80 && width > 80 && (
              <div
                className="font-medium truncate w-full opacity-80 leading-tight mt-0.5"
                style={{ fontSize: Math.max(9, Math.min(11, Math.floor(width / 12))) }}
              >
                ${value} | {instCount}/{props.totalInstitutionsShort ?? '12 inst'}
              </div>
            )}
          </div>
        </foreignObject>
      )}
    </g>
  )
}

export default function PopularTreemap({ onNodeFocus }: { onNodeFocus?: (instIds: string[] | null) => void }) {
  const [data, setData] = useState<TreemapLeafDatum[]>([])
  const [focusedNode, setFocusedNode] = useState<TreemapLeafDatum | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { lang } = useLanguage()

  const handleFocus = (nodeData: TreemapLeafDatum | null) => {
    setFocusedNode(nodeData)
    onNodeFocus?.(nodeData?.holdingInstitutions ?? null)
  }

  const loadTreemapData = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch('/data/dashboard_treemap.json')
      if (!response.ok) {
        throw new Error('Unable to load bundled treemap data')
      }

      const nodes = await response.json() as TreemapDatum[]
      const children = nodes.map((node) => ({
        name: node.ticker,
        size: Number.parseFloat(node.value),
        heat: node.heat,
        avgWeight: node.avgWeight,
        value: node.value,
        instCount: node.instCount,
        holdingInstitutions: node.holdingInstitutions,
      }))
      setData(children)
    } catch (err) {
      setError(err instanceof Error ? err.message : lang.dataLoadFailed)
    } finally {
      setIsLoading(false)
    }
  }, [lang.dataLoadFailed])

  useEffect(() => {
    void loadTreemapData()
  }, [loadTreemapData])

  if (isLoading) {
    return (
      <div className="glass-card p-6 text-center text-text-secondary font-semibold">
        {lang.loadingHistoricalFilings}
      </div>
    )
  }

  if (error) {
    return (
      <div className="glass-card p-6 text-center">
        <p className="font-bold text-text-primary">{lang.dataLoadFailed}</p>
        <p className="text-sm text-text-secondary mt-2">{error}</p>
        <button
          type="button"
          onClick={() => void loadTreemapData()}
          className="mt-4 px-4 py-2 rounded-md bg-accent-blue text-white text-sm font-bold hover:bg-blue-700 transition-colors"
        >
          {lang.retry}
        </button>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="glass-card p-6 text-center text-text-secondary font-semibold">
        {lang.noResults}
      </div>
    )
  }

  const treemapData = [{ name: 'All Holdings', children: data }]

  return (
    <div className="glass-card p-6 flex flex-col pt-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-text-primary">{lang.popularTreemapTitle}</h2>
          <p className="text-xs text-text-secondary mt-1">{lang.popularTreemapSub}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4 text-xs min-h-[32px]">
        {focusedNode ? (
          <>
            <span className="font-semibold text-text-secondary uppercase tracking-wider mr-2 self-center">{lang.focused}</span>
            <button className="px-3 py-1 rounded-full bg-accent-blue text-white shadow-sm flex items-center gap-2 font-bold select-none cursor-default">
              <span>{focusedNode.name}</span>
            </button>
            <div className="px-3 py-1 rounded-full bg-white border border-border text-text-primary font-medium shadow-sm">
              {lang.heatLabel} {focusedNode.heat}%
            </div>
            <div className="px-3 py-1 rounded-full bg-white border border-border text-text-primary font-medium shadow-sm">
              {focusedNode.avgWeight} {lang.avg}
            </div>
            <div className="px-3 py-1 rounded-full bg-white border border-border text-text-primary font-medium shadow-sm">
              ${focusedNode.value}
            </div>
            <div className="px-3 py-1 rounded-full bg-white border border-border text-text-primary font-medium shadow-sm">
              {focusedNode.instCount} {lang.institutions}
            </div>
            <button
              onClick={() => handleFocus(null)}
              className="px-3 py-1 rounded-full bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 hover:text-red-700 transition-colors cursor-pointer shadow-sm ml-2"
            >
              {lang.clear}
            </button>
          </>
        ) : (
          <div className="flex items-center text-text-secondary h-8">
            <span className="italic">{lang.clickAnyBlock}</span>
          </div>
        )}
      </div>

      <div style={{ width: '100%', height: 380 }}>
        <ResponsiveContainer width="100%" height="100%">
          <Treemap
            data={treemapData}
            dataKey="size"
            stroke="#fff"
            isAnimationActive
            animationDuration={800}
            content={(props) => (
              <CustomizedContent
                {...(props as unknown as TreemapNodeProps)}
                onClickNode={handleFocus}
                heatLabel={lang.heatLabel}
                totalInstitutionsShort={lang.totalInstitutionsShort}
              />
            )}
          />
        </ResponsiveContainer>
      </div>
    </div>
  )
}
