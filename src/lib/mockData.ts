// Common Types
export type Institution = {
  id: string;
  name: string;
  manager: string;
  imageUrl?: string;
  aum: string;
  quarter: string;
  holdingsCount: number;
  style: string;
};

export type TreemapNode = {
  ticker: string;
  heat: number;
  avgWeight: string;
  value: string;
  instCount: number;
  bgColor: string;
};

// 12 Institutions Mock Data
export const mockInstitutions: Institution[] = [
  { id: 'berkshire', name: 'Berkshire Hathaway', manager: 'Warren Buffett', imageUrl: 'https://images.unsplash.com/photo-1549496464-325ff326ba9b?q=80&w=200&h=200&fit=crop', aum: '274.2B', quarter: '2025 Q4', holdingsCount: 42, style: 'Value' },
  { id: 'tci', name: 'TCI Fund Management Ltd', manager: 'Chris Hohn', imageUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=200&h=200&fit=crop', aum: '53.65B', quarter: '2025 Q4', holdingsCount: 9, style: 'Focused' },
  { id: 'gates', name: 'Gates Foundation Trust', manager: 'Bill Gates', imageUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=200&h=200&fit=crop', aum: '35.36B', quarter: '2025 Q4', holdingsCount: 23, style: 'Quality' },
  { id: 'tiger', name: 'Tiger Global Management LLC', manager: 'Chase Coleman', imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&h=200&fit=crop', aum: '29.71B', quarter: '2025 Q4', holdingsCount: 54, style: 'Growth' },
  { id: 'bridgewater', name: 'Bridgewater Associates, LP', manager: 'Ray Dalio', imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&h=200&fit=crop', aum: '27.42B', quarter: '2025 Q4', holdingsCount: 1040, style: 'Systematic' },
  { id: 'elliott', name: 'Elliott Investment Management, L.P.', manager: 'Paul Singer', imageUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=200&h=200&fit=crop', aum: '22.59B', quarter: '2025 Q4', holdingsCount: 32, style: 'Event-Driven' },
  { id: 'hh', name: 'H&H International Investment, LLC', manager: 'Duan Yongping', imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&h=200&fit=crop', aum: '17.49B', quarter: '2025 Q4', holdingsCount: 14, style: 'Focused' },
  { id: 'pershing', name: 'Pershing Square Capital Management, L.P.', manager: 'Bill Ackman', imageUrl: 'https://images.unsplash.com/photo-1566492031523-87d28ebd9cb0?q=80&w=200&h=200&fit=crop', aum: '15.53B', quarter: '2025 Q4', holdingsCount: 11, style: 'Activist' },
  { id: 'softbank', name: 'SoftBank Group Corp', manager: 'Masayoshi Son', imageUrl: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?q=80&w=200&h=200&fit=crop', aum: '15.47B', quarter: '2025 Q4', holdingsCount: 32, style: 'Aggressive' },
  { id: 'ark', name: 'ARK Investment Management LLC', manager: 'Cathie Wood', imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&h=200&fit=crop', aum: '15.07B', quarter: '2025 Q4', holdingsCount: 196, style: 'Disruptive' },
  { id: 'soros', name: 'Soros Fund Management', manager: 'George Soros', imageUrl: 'https://images.unsplash.com/photo-1558222218-b7b54eede3f3?q=80&w=200&h=200&fit=crop', aum: '8.631B', quarter: '2025 Q4', holdingsCount: 237, style: 'Macro' },
  { id: 'himalaya', name: 'Himalaya Capital Management LLC', manager: 'Li Lu', imageUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=200&h=200&fit=crop', aum: '3.569B', quarter: '2025 Q4', holdingsCount: 9, style: 'Concentrated' }
];

// Popular Holdings Treemap
export const mockTreemapNodes: TreemapNode[] = [
  { ticker: 'AAPL', heat: 100, avgWeight: '6.28%', value: '70.98B', instCount: 5, bgColor: 'bg-indigo-600' },
  { ticker: 'GOOGL', heat: 28.8, avgWeight: '3.42%', value: '10.62B', instCount: 6, bgColor: 'bg-blue-600' },
  { ticker: 'GOOG', heat: 23.1, avgWeight: '3.58%', value: '5.841B', instCount: 5, bgColor: 'bg-emerald-600' },
  { ticker: 'BRK-B', heat: 26, avgWeight: '5.07%', value: '13.81B', instCount: 3, bgColor: 'bg-rose-600' },
  { ticker: 'NVDA', heat: 19.3, avgWeight: '1.89%', value: '5.042B', instCount: 6, bgColor: 'bg-cyan-500' },
  { ticker: 'UBER', heat: 12.4, avgWeight: '1.39%', value: '2.618B', instCount: 5, bgColor: 'bg-purple-600' },
  { ticker: 'BAC', heat: 11.4, avgWeight: '2.07%', value: '1.98B', instCount: 4, bgColor: 'bg-pink-600' },
  { ticker: 'AXP', heat: 9.8, avgWeight: '1.20%', value: '1.51B', instCount: 3, bgColor: 'bg-teal-600' },
  { ticker: 'SPY', heat: 8.5, avgWeight: '0.90%', value: '1.21B', instCount: 8, bgColor: 'bg-violet-600' },
  { ticker: 'META', heat: 8.0, avgWeight: '1.05%', value: '1.15B', instCount: 4, bgColor: 'bg-green-500' },
];

export const mockHoldings = [
  { security: 'Apple (AAPL)', weight: 22.6, mktValue: '61.9G', qOqDelta: '+1.31B', color: '#3b82f6' },
  { security: 'American Express (AXP)', weight: 20.5, mktValue: '56.0G', qOqDelta: '+5.73B', color: '#1d4ed8' },
  { security: 'Bank America (BAC)', weight: 10.4, mktValue: '28.4G', qOqDelta: '-0.86B', color: '#2dd4bf' },
  { security: 'Coca Cola (KO)', weight: 10.2, mktValue: '27.9G', qOqDelta: '+1.44B', color: '#a855f7' },
  { security: 'Chevron (CVX)', weight: 7.2, mktValue: '19.8G', qOqDelta: '+0.88B', color: '#22c55e' },
  { security: 'Moodys (MCO)', weight: 4.6, mktValue: '12.6G', qOqDelta: '+0.85B', color: '#ec4899' },
  { security: 'Occidental Pete (OXY)', weight: 4.0, mktValue: '10.8G', qOqDelta: '-1.62B', color: '#10b981' },
  { security: 'Chubb Limited (CB)', weight: 3.9, mktValue: '10.6G', qOqDelta: '+1.85B', color: '#f97316' },
  { security: 'Kraft Heinz (KHC)', weight: 2.9, mktValue: '7.9G', qOqDelta: '-0.58B', color: '#1e3a8a' },
  { security: 'Alphabet (GOOGL) - A', weight: 2.0, mktValue: '5.5G', qOqDelta: '+1.25B', color: '#312e81' },
];

export const mockTopAdds = [
  { ticker: 'AXP', security: 'American Express', deltaValue: '+5.73B', shareChange: '+0.8%', newWeight: '20.5%', type: 'Add' },
  { ticker: 'CB', security: 'Chubb Limited', deltaValue: '+1.85B', shareChange: '+12.5%', newWeight: '3.9%', type: 'Add' },
  { ticker: 'KO', security: 'Coca Cola', deltaValue: '+1.44B', shareChange: '+0.0%', newWeight: '10.2%', type: 'Add' },
  { ticker: 'AAPL', security: 'Apple', deltaValue: '+1.31B', shareChange: '-1.5%', newWeight: '22.6%', type: 'Add' },
  { ticker: 'GOOGL', security: 'Alphabet A', deltaValue: '+1.25B', shareChange: '+0.0%', newWeight: '2.0%', type: 'Add' }
];

export const mockTopTrims = [
  { ticker: 'OXY', security: 'Occidental Pete', deltaValue: '-1.62B', shareChange: '-8.5%', newWeight: '4.0%', type: 'Trim' },
  { ticker: 'KHC', security: 'Kraft Heinz', deltaValue: '-0.58B', shareChange: '-7.2%', newWeight: '2.9%', type: 'Trim' },
  { ticker: 'BAC', security: 'Bank America', deltaValue: '-0.86B', shareChange: '-2.1%', newWeight: '10.4%', type: 'Trim' },
  { ticker: 'DVA', security: 'Davita', deltaValue: '-0.67B', shareChange: '-11.0%', newWeight: '1.3%', type: 'Trim' },
  { ticker: 'SIRI', security: 'Sirius Xm', deltaValue: '-0.41B', shareChange: '-33.1%', newWeight: '0.9%', type: 'Trim' }
];

export const mockRadarData = [
  { subject: 'Financials', A: 42.8, B: 14.0, fullMark: 100 },
  { subject: 'Technology', A: 25.4, B: 31.0, fullMark: 100 },
  { subject: 'Consumer', A: 16.6, B: 16.0, fullMark: 100 },
  { subject: 'Energy & Utilities', A: 11.2, B: 7.0, fullMark: 100 },
  { subject: 'Healthcare', A: 1.9, B: 11.0, fullMark: 100 },
  { subject: 'Other', A: 1.4, B: 12.0, fullMark: 100 },
  { subject: 'Industrials', A: 0.7, B: 9.0, fullMark: 100 },
];

export const mockAssetTrend = Array.from({ length: 25 }, (_, i) => ({
  year: (2000 + i).toString(),
  value: Math.max(10, Math.floor(Math.pow(1.15, i) * 10) + (Math.random() * 20 - 10))
}));
