import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ExternalLink } from 'lucide-react'
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
      className="cursor-pointer transition-all duration-300 hover:opacity-85 hover:brightness-105 select-none"
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
          strokeOpacity: 0.9,
          rx: 8,
          cursor: 'pointer',
        }}
      />
      {width > 40 && height > 30 && (
        <foreignObject
          x={x + 2}
          y={y + 2}
          width={width - 4}
          height={height - 4}
          style={{ pointerEvents: 'none' }}
        >
          <div
            className="w-full h-full flex flex-col items-center justify-center text-white text-center p-1 overflow-hidden pointer-events-none"
            style={{ textShadow: '0px 1px 4px rgba(0,0,0,0.5)' }}
          >
            <div
              className="font-black tracking-tight truncate w-full leading-tight drop-shadow-md"
              style={{ fontSize: Math.max(13, Math.min(24, Math.floor(width / 4.8))) }}
            >
              {name}
            </div>

            {height > 52 && width > 55 && (
              <div
                className="font-bold truncate w-full mt-0.5 opacity-95 leading-tight text-white/90"
                style={{ fontSize: Math.max(9, Math.min(12, Math.floor(width / 9.5))) }}
              >
                {props.heatLabel ?? 'Heat'} {heat} | {avgWeight}
              </div>
            )}

            {height > 80 && width > 80 && (
              <div
                className="font-semibold text-white/90 truncate w-full mt-0.5 leading-tight"
                style={{ fontSize: Math.max(8, Math.min(11, Math.floor(width / 11))) }}
              >
                ${value} | {instCount} {props.totalInstitutionsShort ?? 'inst'}
              </div>
            )}
          </div>
        </foreignObject>
      )}
    </g>
  )
}

interface PopularTreemapProps {
  onSelectTicker?: (ticker: string | null) => void
  dataPath: string
}

export default function PopularTreemap({ onSelectTicker, dataPath }: PopularTreemapProps) {
  const [data, setData] = useState<TreemapDatum[]>([])
  const [focusedNode, setFocusedNode] = useState<TreemapLeafDatum | null>(null)
  const { lang } = useLanguage()
  const navigate = useNavigate()

  useEffect(() => {
    let isMounted = true

    async function loadTreemap() {
      try {
        const response = await fetch(`${dataPath}/dashboard_treemap.json`)
        if (!response.ok) {
          throw new Error('Unable to load treemap dataset')
        }

        const jsonData = (await response.json()) as TreemapDatum[]
        if (isMounted) {
          setData(jsonData)
          setFocusedNode(null)
          onSelectTicker?.(null)
        }
      } catch {
        if (isMounted) {
          setData([])
          setFocusedNode(null)
          onSelectTicker?.(null)
        }
      }
    }

    void loadTreemap()

    return () => {
      isMounted = false
    }
  }, [dataPath, onSelectTicker])

  const handleClickNode = useCallback((node: TreemapLeafDatum | null) => {
    if (!node) {
      setFocusedNode(null)
      onSelectTicker?.(null)
      return
    }
    setFocusedNode(node)
    onSelectTicker?.(node.name)
    navigate(`/ticker/${node.name}`)
  }, [navigate, onSelectTicker])

  const treemapData = [
    {
      name: 'root',
      children: data.map((item) => ({
        name: item.ticker,
        size: item.heat,
        heat: item.heat,
        avgWeight: item.avgWeight,
        value: item.value,
        instCount: item.instCount,
        holdingInstitutions: item.holdingInstitutions,
      })),
    },
  ]

  return (
    <div className="glass-card p-6 flex flex-col pt-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-text-primary">{lang.popularTreemapTitle}</h2>
          <p className="text-xs text-text-secondary mt-1">{lang.popularTreemapSub}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4 text-xs min-h-[32px] items-center">
        {focusedNode ? (
          <>
            <span className="font-semibold text-text-secondary uppercase tracking-wider mr-2 self-center">{lang.focused}</span>
            <div className="px-3 py-1 rounded-full bg-accent-blue text-white shadow-sm flex items-center gap-2 font-bold select-none">
              <span>{focusedNode.name}</span>
            </div>
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
            <Link
              to={`/ticker/${focusedNode.name}`}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-50 text-accent-blue border border-blue-200 hover:bg-blue-100 transition-colors font-bold shadow-sm cursor-pointer ml-1"
            >
              <span>{lang.viewTickerDetail}</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
            <button
              onClick={() => handleClickNode(null)}
              className="px-3 py-1 rounded-full bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 hover:text-red-700 transition-colors cursor-pointer shadow-sm ml-1"
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
                onClickNode={handleClickNode}
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
