export type FilingQuarter = 'Q1' | 'Q2' | 'Q3' | 'Q4'

export interface QuarterArchive {
  id: string
  label: string
  path: string
  isLatest?: boolean
  status: 'complete' | 'mixed'
  summary: string
  quarterCounts: Record<string, number>
  createdAt: string
}

export interface InstitutionMeta {
  id: string
  name: string
  cik: string
  manager: string
  style: string
  imageUrl?: string
  aum: string
  quarter: string
  holdingsCount: number
  displayedHoldingsCount?: number
  reportDate?: string
  latestFilingDate?: string
}

export interface RadarDatum {
  subject: string
  A: number
  B: number
  fullMark: number
}

export interface AssetTrendPoint {
  year: string
  value: string
}

export interface HoldingEntry {
  cusip: string
  security: string
  weight: number
  rawMktValue: number
  mktValue: string
  qOqDelta: string
  color: string
}

export type PositionChangeType = 'New' | 'Add' | 'Trim' | 'Exit'

export interface PositionChange {
  ticker: string
  security: string
  deltaValue: string
  rawDelta: number
  shareChange: string
  newWeight: string
  type: PositionChangeType
}

export interface InstitutionDetailData {
  institution: InstitutionMeta
  snapshotNote?: string
  radarData: RadarDatum[]
  assetTrend: AssetTrendPoint[]
  holdings: HoldingEntry[]
  topAdds: PositionChange[]
  topTrims: PositionChange[]
}

export interface TreemapDatum {
  [key: string]: string | number | string[]
  ticker: string
  heat: number
  avgWeight: string
  value: string
  instCount: number
  holdingInstitutions: string[]
}

export interface TreemapLeafDatum {
  [key: string]: string | number | string[]
  name: string
  size: number
  heat: number
  avgWeight: string
  value: string
  instCount: number
  holdingInstitutions: string[]
}

export interface FilingPeriod {
  year: number
  quarter: FilingQuarter
  label: string
}

const QUARTER_PATTERN = /^(?<year>\d{4})\s(?<quarter>Q[1-4])$/
export const DEFAULT_DATA_PATH = '/data'

export function parseFilingPeriod(label: string): FilingPeriod | null {
  const match = QUARTER_PATTERN.exec(label.trim())

  if (!match?.groups?.year || !match.groups.quarter) {
    return null
  }

  return {
    year: Number.parseInt(match.groups.year, 10),
    quarter: match.groups.quarter as FilingQuarter,
    label: `${match.groups.year} ${match.groups.quarter}`,
  }
}

export function getLatestQuarter(quarters: QuarterArchive[]) {
  return quarters.find((quarter) => quarter.isLatest) ?? quarters[0] ?? null
}

export function normalizeDataPath(path: string) {
  return path.replace(/\/$/, '')
}
