import type { Language } from '@/context/language-context'

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
