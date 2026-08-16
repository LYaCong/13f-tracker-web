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

export interface CashReserves {
  amount: string
  rawAmount?: number
  delta: string
  rawDelta?: number
  source?: string
}

export interface SankeyNode {
  name: string
}

export interface SankeyLink {
  source: number
  target: number
  value: number
}

export interface CapitalFlowData {
  totalBought: string
  rawTotalBought?: number
  totalSold: string
  rawTotalSold?: number
  netCapitalFlow: string
  rawNetCapitalFlow?: number
  turnoverRate: string
  sankey: {
    nodes: SankeyNode[]
    links: SankeyLink[]
  }
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
  totalBought?: string
  totalSold?: string
  netCapitalFlow?: string
  turnoverRate?: string
  cashReserves?: CashReserves
}

export interface RadarDatum {
  subject: string
  A: number
  B: number
  fullMark: number
}

export interface SectorWeightDatum {
  sector: string
  weight: number
  benchmarkWeight: number
}

export interface SectorClassificationSummary {
  schema: string
  asOf: string
  matchingPriority: string[]
  unmatchedSector: string
  holdingsClassifiedCount: number
  holdingsUnclassifiedCount: number
  classifiedWeight: number
  unclassifiedWeight: number
  sectorWeightTotal: number
  sources: Array<{
    name: string
    url: string
  }>
  benchmark: {
    name: string
    methodology: string
    asOf: string
    sourceName: string
    sourceUrl: string
  }
}

export interface AssetTrendPoint {
  year: string
  value: string
  rawValue?: number
}

export interface HoldingEntry {
  cusip: string
  ticker?: string
  name?: string
  security: string
  sector?: string
  weight: number
  prevWeight?: number
  weightChange?: number
  weightChangeText?: string
  shares?: number
  sharesFormatted?: string
  shareChangePct?: number
  shareChangeText?: string
  action?: 'Add' | 'Trim' | 'Hold' | 'New'
  rawMktValue: number
  mktValue: string
  rawDelta?: number
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
  classificationSummary?: SectorClassificationSummary
  sectorWeights?: SectorWeightDatum[]
  radarData: RadarDatum[]
  assetTrend: AssetTrendPoint[]
  capitalFlow?: CapitalFlowData
  cashReserves?: CashReserves
  sectorHistory?: Array<Record<string, string | number>>
  holdings: HoldingEntry[]
  allHoldings?: HoldingEntry[]
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

export interface TickerHolder {
  instId: string
  instName: string
  manager: string
  style: string
  shares: number
  sharesFormatted: string
  value: number
  mktValue: string
  weight: number
  weightChange?: number
  weightChangeText?: string
  action?: 'Add' | 'Trim' | 'Hold' | 'New'
  shareChangePct?: number
  shareChangeText?: string
  qOqDelta?: string
}

export interface TickerDetailData {
  ticker: string
  name: string
  cusip: string
  sector: string
  totalValue: number
  mktValue: string
  totalShares: number
  sharesFormatted: string
  holdingCount: number
  avgWeight: string
  buyers: Array<{ instId: string; instName: string; delta: number; action: string }>
  sellers: Array<{ instId: string; instName: string; delta: number; action: string }>
  holders: TickerHolder[]
}

export interface ConsensusBuyItem {
  ticker: string
  name: string
  sector: string
  buyerCount: number
  totalBoughtVal: number
  totalBoughtFormatted: string
  totalValueFormatted: string
  buyers: string[]
}

export interface ConsensusTrimItem {
  ticker: string
  name: string
  sector: string
  sellerCount: number
  totalSoldVal: number
  totalSoldFormatted: string
  totalValueFormatted: string
  sellers: string[]
}

export interface ConsensusHoldingItem {
  ticker: string
  name: string
  sector: string
  holdingCount: number
  totalValueFormatted: string
  totalValue: number
  avgWeight: string
  holders: string[]
}

export interface ConvictionBetItem {
  ticker: string
  name: string
  sector: string
  institution: string
  manager: string
  weight: string
  rawWeight: number
  mktValue: string
  action: string
}

export interface ConsensusData {
  quarter: string
  topConsensusBuys: ConsensusBuyItem[]
  topConsensusTrims: ConsensusTrimItem[]
  topConsensusHoldings: ConsensusHoldingItem[]
  highestConvictionBets: ConvictionBetItem[]
}

export interface AllStarConstituent {
  ticker: string
  name: string
  sector: string
  equalWeight: string
  convictionWeight: string
  rawConvictionWeight: number
  totalValue: string
  holderCount: number
  backingFunds: string[]
  mainAction: string
}

export interface AllStarIndexData {
  name: string
  chineseName: string
  description: string
  asOfQuarter: string
  constituentsCount: number
  totalTrackedCapital: string
  sectorBreakdown: Array<{ sector: string; weight: number }>
  constituents: AllStarConstituent[]
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
