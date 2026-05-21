import type { Language } from '@/context/language-context'

interface InstitutionDisplayInput {
  id?: string
  name: string
}

interface SecurityDisplayName {
  zh: string
  en: string
  ticker?: string
}

const STYLE_NAME_ZH: Record<string, string> = {
  Activist: '积极维权',
  activist: '积极维权',
  Aggressive: '进取型',
  aggressive: '进取型',
  Concentrated: '集中持仓',
  concentrated: '集中持仓',
  Disruptive: '颠覆创新',
  disruptive: '颠覆创新',
  'Event-Driven': '事件驱动',
  'event-driven': '事件驱动',
  Focused: '聚焦型',
  focused: '聚焦型',
  Growth: '成长型',
  growth: '成长型',
  Macro: '宏观型',
  macro: '宏观型',
  Quality: '质量型',
  quality: '质量型',
  Systematic: '系统化',
  systematic: '系统化',
  Value: '价值型',
  value: '价值型',
}

const SECTOR_NAME_ZH: Record<string, string> = {
  'Communication Services': '通信服务',
  'Consumer Discretionary': '可选消费',
  'Consumer Staples': '日常消费',
  Energy: '能源',
  Financials: '金融',
  'Health Care': '医疗保健',
  Industrials: '工业',
  'Information Technology': '信息技术',
  Materials: '材料',
  'Real Estate': '房地产',
  Unclassified: '未分类',
  Utilities: '公用事业',
}

const INSTITUTION_NAME_ZH: Record<string, string> = {
  ark: '方舟投资',
  berkshire: '伯克希尔·哈撒韦',
  bridgewater: '桥水基金',
  elliott: '埃利奥特管理',
  gates: '盖茨基金会信托',
  hh: 'H&H 国际投资',
  himalaya: '喜马拉雅资本',
  pershing: '潘兴广场资本',
  softbank: '软银集团',
  soros: '索罗斯基金管理',
  tci: 'TCI 基金管理',
  tiger: '老虎环球基金',
  'ARK Investment Management LLC': '方舟投资',
  'Berkshire Hathaway': '伯克希尔·哈撒韦',
  'Bridgewater Associates, LP': '桥水基金',
  'Elliott Investment Management, L.P.': '埃利奥特管理',
  'Gates Foundation Trust': '盖茨基金会信托',
  'H&H International Investment, LLC': 'H&H 国际投资',
  'Himalaya Capital Management LLC': '喜马拉雅资本',
  'Pershing Square Capital Management, L.P.': '潘兴广场资本',
  'SoftBank Group Corp': '软银集团',
  'Soros Fund Management': '索罗斯基金管理',
  'TCI Fund Management Ltd': 'TCI 基金管理',
  'Tiger Global Management LLC': '老虎环球基金',
}

const SECURITY_NAME_ZH: Record<string, SecurityDisplayName> = {
  AAPL: { zh: '苹果公司', en: 'Apple Inc', ticker: 'AAPL' },
  '037833100': { zh: '苹果公司', en: 'Apple Inc', ticker: 'AAPL' },
  ADBE: { zh: '奥多比', en: 'Adobe Inc', ticker: 'ADBE' },
  AMD: { zh: '超威半导体', en: 'Advanced Micro Devices', ticker: 'AMD' },
  AMZN: { zh: '亚马逊', en: 'Amazon.com Inc', ticker: 'AMZN' },
  '023135106': { zh: '亚马逊', en: 'Amazon.com Inc', ticker: 'AMZN' },
  AXP: { zh: '美国运通', en: 'American Express', ticker: 'AXP' },
  '025816109': { zh: '美国运通', en: 'American Express', ticker: 'AXP' },
  BAC: { zh: '美国银行', en: 'Bank of America', ticker: 'BAC' },
  '060505104': { zh: '美国银行', en: 'Bank of America', ticker: 'BAC' },
  BILL: { zh: 'BILL Holdings', en: 'BILL Holdings', ticker: 'BILL' },
  BKNG: { zh: 'Booking Holdings', en: 'Booking Holdings', ticker: 'BKNG' },
  BRK: { zh: '伯克希尔·哈撒韦', en: 'Berkshire Hathaway', ticker: 'BRK-B' },
  'BRK-B': { zh: '伯克希尔·哈撒韦', en: 'Berkshire Hathaway', ticker: 'BRK-B' },
  '084670702': { zh: '伯克希尔·哈撒韦', en: 'Berkshire Hathaway', ticker: 'BRK-B' },
  AVGO: { zh: '博通', en: 'Broadcom Inc', ticker: 'AVGO' },
  CHTR: { zh: 'Charter Communications', en: 'Charter Communications', ticker: 'CHTR' },
  CHWY: { zh: 'Chewy', en: 'Chewy', ticker: 'CHWY' },
  CNI: { zh: '加拿大国家铁路', en: 'Canadian National Railway', ticker: 'CNI' },
  COIN: { zh: 'Coinbase', en: 'Coinbase Global', ticker: 'COIN' },
  COST: { zh: '开市客', en: 'Costco Wholesale', ticker: 'COST' },
  CPNG: { zh: 'Coupang', en: 'Coupang', ticker: 'CPNG' },
  CRSP: { zh: 'CRISPR Therapeutics', en: 'CRISPR Therapeutics', ticker: 'CRSP' },
  CVX: { zh: '雪佛龙', en: 'Chevron', ticker: 'CVX' },
  '166764100': { zh: '雪佛龙', en: 'Chevron', ticker: 'CVX' },
  DAL: { zh: '达美航空', en: 'Delta Air Lines', ticker: 'DAL' },
  DIS: { zh: '迪士尼', en: 'Walt Disney', ticker: 'DIS' },
  DVA: { zh: '达维塔', en: 'DaVita', ticker: 'DVA' },
  EA: { zh: '艺电', en: 'Electronic Arts', ticker: 'EA' },
  ETSY: { zh: 'Etsy', en: 'Etsy', ticker: 'ETSY' },
  FERG: { zh: '弗格森', en: 'Ferguson', ticker: 'FERG' },
  GE: { zh: '通用电气航空', en: 'GE Aerospace', ticker: 'GE' },
  GEV: { zh: 'GE Vernova', en: 'GE Vernova', ticker: 'GEV' },
  GOOG: { zh: '谷歌', en: 'Alphabet', ticker: 'GOOG' },
  GOOGL: { zh: '谷歌', en: 'Alphabet', ticker: 'GOOGL' },
  '02079K107': { zh: '谷歌', en: 'Alphabet', ticker: 'GOOG' },
  '02079K305': { zh: '谷歌', en: 'Alphabet', ticker: 'GOOGL' },
  HLT: { zh: '希尔顿', en: 'Hilton Worldwide', ticker: 'HLT' },
  INTC: { zh: '英特尔', en: 'Intel', ticker: 'INTC' },
  JD: { zh: '京东', en: 'JD.com', ticker: 'JD' },
  KO: { zh: '可口可乐', en: 'Coca-Cola', ticker: 'KO' },
  '191216100': { zh: '可口可乐', en: 'Coca-Cola', ticker: 'KO' },
  LRCX: { zh: '泛林集团', en: 'Lam Research', ticker: 'LRCX' },
  MA: { zh: '万事达卡', en: 'Mastercard', ticker: 'MA' },
  MCD: { zh: '麦当劳', en: 'McDonald’s', ticker: 'MCD' },
  MCO: { zh: '穆迪', en: 'Moody’s', ticker: 'MCO' },
  META: { zh: 'Meta 平台', en: 'Meta Platforms', ticker: 'META' },
  '30303M102': { zh: 'Meta 平台', en: 'Meta Platforms', ticker: 'META' },
  MSFT: { zh: '微软', en: 'Microsoft', ticker: 'MSFT' },
  '594918104': { zh: '微软', en: 'Microsoft', ticker: 'MSFT' },
  MU: { zh: '美光科技', en: 'Micron Technology', ticker: 'MU' },
  NDAQ: { zh: '纳斯达克', en: 'Nasdaq', ticker: 'NDAQ' },
  NFLX: { zh: '奈飞', en: 'Netflix', ticker: 'NFLX' },
  NVDA: { zh: '英伟达', en: 'NVIDIA', ticker: 'NVDA' },
  '67066G104': { zh: '英伟达', en: 'NVIDIA', ticker: 'NVDA' },
  ORCL: { zh: '甲骨文', en: 'Oracle', ticker: 'ORCL' },
  OXY: { zh: '西方石油', en: 'Occidental Petroleum', ticker: 'OXY' },
  '674599105': { zh: '西方石油', en: 'Occidental Petroleum', ticker: 'OXY' },
  PANW: { zh: 'Palo Alto Networks', en: 'Palo Alto Networks', ticker: 'PANW' },
  PDD: { zh: '拼多多', en: 'PDD Holdings', ticker: 'PDD' },
  '722304102': { zh: '拼多多', en: 'PDD Holdings', ticker: 'PDD' },
  PLTR: { zh: 'Palantir', en: 'Palantir Technologies', ticker: 'PLTR' },
  QSR: { zh: '餐饮品牌国际', en: 'Restaurant Brands International', ticker: 'QSR' },
  RBLX: { zh: 'Roblox', en: 'Roblox', ticker: 'RBLX' },
  RDDT: { zh: 'Reddit', en: 'Reddit', ticker: 'RDDT' },
  ROKU: { zh: 'Roku', en: 'Roku', ticker: 'ROKU' },
  SE: { zh: 'Sea Limited', en: 'Sea Limited', ticker: 'SE' },
  SHOP: { zh: 'Shopify', en: 'Shopify', ticker: 'SHOP' },
  SPOT: { zh: 'Spotify', en: 'Spotify', ticker: 'SPOT' },
  SPY: { zh: 'SPDR 标普 500 ETF', en: 'SPDR S&P 500 ETF', ticker: 'SPY' },
  TCEHY: { zh: '腾讯音乐', en: 'Tencent Music Entertainment', ticker: 'TME' },
  TME: { zh: '腾讯音乐', en: 'Tencent Music Entertainment', ticker: 'TME' },
  TMUS: { zh: 'T-Mobile US', en: 'T-Mobile US', ticker: 'TMUS' },
  TSM: { zh: '台积电', en: 'Taiwan Semiconductor Manufacturing', ticker: 'TSM' },
  TSLA: { zh: '特斯拉', en: 'Tesla', ticker: 'TSLA' },
  '88160R101': { zh: '特斯拉', en: 'Tesla', ticker: 'TSLA' },
  UBER: { zh: '优步', en: 'Uber Technologies', ticker: 'UBER' },
  UNH: { zh: '联合健康', en: 'UnitedHealth Group', ticker: 'UNH' },
  '91324P102': { zh: '联合健康', en: 'UnitedHealth Group', ticker: 'UNH' },
  UNP: { zh: '联合太平洋', en: 'Union Pacific', ticker: 'UNP' },
  V: { zh: 'Visa', en: 'Visa', ticker: 'V' },
  VEEV: { zh: 'Veeva Systems', en: 'Veeva Systems', ticker: 'VEEV' },
  VRSN: { zh: '威瑞信', en: 'VeriSign', ticker: 'VRSN' },
}

const SECURITY_KEYWORD_ZH: Array<[string, SecurityDisplayName]> = [
  ['ADOBE', SECURITY_NAME_ZH.ADBE],
  ['ADVANCED MICRO DEVICES', SECURITY_NAME_ZH.AMD],
  ['ALIBABA', { zh: '阿里巴巴', en: 'Alibaba Group', ticker: 'BABA' }],
  ['ALPHABET', SECURITY_NAME_ZH.GOOGL],
  ['AMAZON', SECURITY_NAME_ZH.AMZN],
  ['AMERICAN EXPRESS', SECURITY_NAME_ZH.AXP],
  ['APPLE', SECURITY_NAME_ZH.AAPL],
  ['BANK AMERICA', SECURITY_NAME_ZH.BAC],
  ['BERKSHIRE HATHAWAY', SECURITY_NAME_ZH['BRK-B']],
  ['BROADCOM', SECURITY_NAME_ZH.AVGO],
  ['CANADIAN NATL RY', SECURITY_NAME_ZH.CNI],
  ['CHEVRON', SECURITY_NAME_ZH.CVX],
  ['COCA COLA', SECURITY_NAME_ZH.KO],
  ['COINBASE', SECURITY_NAME_ZH.COIN],
  ['COUPANG', SECURITY_NAME_ZH.CPNG],
  ['DELTA AIR LINES', SECURITY_NAME_ZH.DAL],
  ['DISNEY', SECURITY_NAME_ZH.DIS],
  ['ELECTRONIC ARTS', SECURITY_NAME_ZH.EA],
  ['GE AEROSPACE', SECURITY_NAME_ZH.GE],
  ['GE VERNOVA', SECURITY_NAME_ZH.GEV],
  ['HILTON WORLDWIDE', SECURITY_NAME_ZH.HLT],
  ['INTEL', SECURITY_NAME_ZH.INTC],
  ['JD.COM', SECURITY_NAME_ZH.JD],
  ['LAM RESEARCH', SECURITY_NAME_ZH.LRCX],
  ['MASTERCARD', SECURITY_NAME_ZH.MA],
  ['META PLATFORMS', SECURITY_NAME_ZH.META],
  ['MICRON TECHNOLOGY', SECURITY_NAME_ZH.MU],
  ['MICROSOFT', SECURITY_NAME_ZH.MSFT],
  ['MOODYS', SECURITY_NAME_ZH.MCO],
  ['NVIDIA', SECURITY_NAME_ZH.NVDA],
  ['OCCIDENTAL', SECURITY_NAME_ZH.OXY],
  ['ORACLE', SECURITY_NAME_ZH.ORCL],
  ['PALANTIR', SECURITY_NAME_ZH.PLTR],
  ['PDD HOLDINGS', SECURITY_NAME_ZH.PDD],
  ['REDDIT', SECURITY_NAME_ZH.RDDT],
  ['RESTAURANT BRANDS', SECURITY_NAME_ZH.QSR],
  ['ROBLOX', SECURITY_NAME_ZH.RBLX],
  ['ROKU', SECURITY_NAME_ZH.ROKU],
  ['SEA LTD', SECURITY_NAME_ZH.SE],
  ['SHOPIFY', SECURITY_NAME_ZH.SHOP],
  ['SPDR S&P 500', SECURITY_NAME_ZH.SPY],
  ['SPDR 500', SECURITY_NAME_ZH.SPY],
  ['SPOTIFY', SECURITY_NAME_ZH.SPOT],
  ['TAIWAN SEMICONDUCTOR', SECURITY_NAME_ZH.TSM],
  ['TENCENT MUSIC', SECURITY_NAME_ZH.TME],
  ['TESLA', SECURITY_NAME_ZH.TSLA],
  ['T-MOBILE', SECURITY_NAME_ZH.TMUS],
  ['UBER', SECURITY_NAME_ZH.UBER],
  ['UNITEDHEALTH', SECURITY_NAME_ZH.UNH],
  ['UNION PAC', SECURITY_NAME_ZH.UNP],
  ['VERISIGN', SECURITY_NAME_ZH.VRSN],
]

function normalizeLookupKey(value: string) {
  return value.trim().toUpperCase()
}

function normalizeSearchText(value: string) {
  return value.trim().toLowerCase()
}

function normalizeIdentifiers(identifier?: string | readonly string[]) {
  if (!identifier) {
    return []
  }

  return (Array.isArray(identifier) ? identifier : [identifier])
    .map((value) => value.trim())
    .filter(Boolean)
}

function extractTickerFromSecurity(security: string) {
  const match = /\(([A-Z0-9.-]{1,8})\)\s*$/.exec(security.trim())
  return match?.[1]
}

function findSecurityDisplayName(security: string, tickerOrCusip?: string | readonly string[]) {
  const candidates = [
    ...normalizeIdentifiers(tickerOrCusip),
    extractTickerFromSecurity(security) ?? '',
    security,
  ].filter(Boolean)

  for (const candidate of candidates) {
    const match = SECURITY_NAME_ZH[normalizeLookupKey(candidate)]
    if (match) {
      return match
    }
  }

  const normalizedSecurity = normalizeLookupKey(security)
  return SECURITY_KEYWORD_ZH.find(([keyword]) => normalizedSecurity.includes(keyword))?.[1]
}

export function translateStyleName(style: string, language: Language) {
  if (language !== 'zh') {
    return style
  }

  const normalizedStyle = style.trim()
  return STYLE_NAME_ZH[normalizedStyle] ?? STYLE_NAME_ZH[normalizedStyle.toLowerCase()] ?? style
}

export function translateSectorName(sector: string, language: Language) {
  return language === 'zh' ? SECTOR_NAME_ZH[sector] ?? sector : sector
}

export function translateInstitutionName(institution: InstitutionDisplayInput, language: Language) {
  if (language !== 'zh') {
    return institution.name
  }

  return (institution.id ? INSTITUTION_NAME_ZH[institution.id] : undefined)
    ?? INSTITUTION_NAME_ZH[institution.name]
    ?? institution.name
}

export function translateSecurityName(
  security: string,
  language: Language,
  tickerOrCusip?: string | readonly string[],
) {
  if (language !== 'zh') {
    return security
  }

  const match = findSecurityDisplayName(security, tickerOrCusip)
  if (!match) {
    return security
  }

  return match.ticker ? `${match.zh} (${match.ticker})` : match.zh
}

export function getSecuritySearchTerms(security: string, tickerOrCusip?: string | readonly string[]) {
  const match = findSecurityDisplayName(security, tickerOrCusip)
  const terms = [security, ...normalizeIdentifiers(tickerOrCusip)]

  if (match) {
    terms.push(match.zh, match.en)
    if (match.ticker) {
      terms.push(match.ticker)
    }
  }

  return terms.map(normalizeSearchText)
}
