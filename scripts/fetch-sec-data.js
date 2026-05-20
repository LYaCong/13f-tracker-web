import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import xml2js from 'xml2js';
const { parseStringPromise } = xml2js;
const stripPrefix = xml2js.processors.stripPrefix;

// Known CIKs from the requirement
const INSTITUTIONS = [
  { id: 'berkshire', name: 'Berkshire Hathaway', cik: '0001067983', manager: 'Warren Buffett', style: 'Value', imageUrl: 'https://images.unsplash.com/photo-1549496464-325ff326ba9b?q=80&w=200&h=200&fit=crop' },
  { id: 'tci', name: 'TCI Fund Management Ltd', cik: '0001649339', manager: 'Chris Hohn', style: 'Focused', imageUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=200&h=200&fit=crop' },
  { id: 'gates', name: 'Gates Foundation Trust', cik: '0001166559', manager: 'Bill Gates', style: 'Quality', imageUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=200&h=200&fit=crop' },
  { id: 'tiger', name: 'Tiger Global Management LLC', cik: '0001167483', manager: 'Chase Coleman', style: 'Growth', imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&h=200&fit=crop' },
  { id: 'bridgewater', name: 'Bridgewater Associates, LP', cik: '0001350694', manager: 'Ray Dalio', style: 'Systematic', imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&h=200&fit=crop' },
  { id: 'elliott', name: 'Elliott Investment Management, L.P.', cik: '0001791786', manager: 'Paul Singer', style: 'Event-Driven', imageUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=200&h=200&fit=crop' },
  { id: 'hh', name: 'H&H International Investment, LLC', cik: '0001759760', manager: 'Duan Yongping', style: 'Focused', imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&h=200&fit=crop' },
  { id: 'pershing', name: 'Pershing Square Capital Management, L.P.', cik: '0001336528', manager: 'Bill Ackman', style: 'Activist', imageUrl: 'https://images.unsplash.com/photo-1566492031523-87d28ebd9cb0?q=80&w=200&h=200&fit=crop' },
  { id: 'softbank', name: 'SoftBank Group Corp', cik: '0001065521', manager: 'Masayoshi Son', style: 'Aggressive', imageUrl: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?q=80&w=200&h=200&fit=crop' },
  { id: 'ark', name: 'ARK Investment Management LLC', cik: '0001697748', manager: 'Cathie Wood', style: 'Disruptive', imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&h=200&fit=crop' },
  { id: 'soros', name: 'Soros Fund Management', cik: '0001029160', manager: 'George Soros', style: 'Macro', imageUrl: 'https://images.unsplash.com/photo-1558222218-b7b54eede3f3?q=80&w=200&h=200&fit=crop' },
  { id: 'himalaya', name: 'Himalaya Capital Management LLC', cik: '0001709323', manager: 'Li Lu', style: 'Concentrated', imageUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=200&h=200&fit=crop' }
];

const USER_AGENT = "13FTrackerApp/1.0 (contact@example.com)";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const OUTPUT_DIR = path.resolve(__dirname, '../public/data');

const BIG_TECH_CUSIPS = {
  '037833100': 'AAPL', '594918104': 'MSFT', '67066G104': 'NVDA', 
  '02079K305': 'GOOGL', '02079K107': 'GOOG', '023135106': 'AMZN', 
  '30303M102': 'META', '88160R101': 'TSLA', '084670702': 'BRK-B',
  '025816109': 'AXP', '060505104': 'BAC', '191216100': 'KO',
  '166764100': 'CVX', '615369105': 'MCO', '674599105': 'OXY',
  '171232101': 'CB', '500754106': 'KHC', '94106L109': 'WM',
  '872590104': 'TMUS', '136375102': 'CNI'
};

const ISSUER_TICKER_OVERRIDES = new Map([
  ['AMERICAN EXPRESS CO', 'AXP'],
  ['APPLE INC', 'AAPL'],
  ['ALPHABET INC', 'GOOGL'],
  ['AMAZON COM INC', 'AMZN'],
  ['BANK AMERICA CORP', 'BAC'],
  ['BANK OF AMERICA CORP', 'BAC'],
  ['BERKSHIRE HATHAWAY INC DEL', 'BRK-B'],
  ['BRUKER CORP', 'BRKR'],
  ['CANADIAN NATL RY CO', 'CNI'],
  ['CHEVRON CORP NEW', 'CVX'],
  ['CHUBB LIMITED', 'CB'],
  ['COCA COLA CO', 'KO'],
  ['DAVITA INC', 'DVA'],
  ['HALLIBURTON CO', 'HAL'],
  ['KRAFT HEINZ CO', 'KHC'],
  ['LULULEMON ATHLETICA INC', 'LULU'],
  ['MASTERCARD INCORPORATED', 'MA'],
  ['META PLATFORMS INC', 'META'],
  ['MICROSOFT CORP', 'MSFT'],
  ['MOODYS CORP', 'MCO'],
  ['MOLINA HEALTHCARE INC', 'MOH'],
  ['NVIDIA CORPORATION', 'NVDA'],
  ['OCCIDENTAL PETE CORP', 'OXY'],
  ['PALANTIR TECHNOLOGIES INC', 'PLTR'],
  ['PFIZER INC', 'PFE'],
  ['REGENERON PHARMACEUTICALS', 'REGN'],
  ['SIRIUS XM HOLDINGS INC', 'SIRI'],
  ['T MOBILE US INC', 'TMUS'],
  ['UNITEDHEALTH GROUP INC', 'UNH'],
  ['VISA INC', 'V'],
  ['WASTE MGMT INC DEL', 'WM'],
])

const SECTOR_BY_TICKER = {
  AAPL: 'Technology', MSFT: 'Technology', NVDA: 'Technology', GOOGL: 'Technology',
  GOOG: 'Technology', AMZN: 'Technology', META: 'Technology', TSLA: 'Technology',
  PLTR: 'Technology', AVGO: 'Technology', CRM: 'Technology',
  AXP: 'Financials', BAC: 'Financials', BRK: 'Financials', 'BRK-B': 'Financials',
  CB: 'Financials', MCO: 'Financials', JPM: 'Financials', C: 'Financials',
  V: 'Financials', MA: 'Financials',
  CVX: 'Energy & Utilities', OXY: 'Energy & Utilities', XOM: 'Energy & Utilities',
  COP: 'Energy & Utilities', HAL: 'Energy & Utilities',
  KO: 'Consumer', KHC: 'Consumer', WMT: 'Consumer', COST: 'Consumer',
  MCD: 'Consumer', PEP: 'Consumer', LULU: 'Consumer',
  UNH: 'Healthcare', MOH: 'Healthcare', PFE: 'Healthcare', REGN: 'Healthcare',
  LLY: 'Healthcare', ABBV: 'Healthcare', MRK: 'Healthcare', TMO: 'Healthcare',
  CNI: 'Industrials', WM: 'Industrials', UNP: 'Industrials', CAT: 'Industrials',
  DE: 'Industrials', BA: 'Industrials', HON: 'Industrials'
}

async function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

async function fetchWithRetry(url, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT, 'Accept-Encoding': 'gzip, deflate' } });
      if (!res.ok) {
        if (res.status === 429) {
          console.log(`Rate limited on ${url}, waiting 2s...`);
          await sleep(2000); continue;
        }
        throw new Error(`HTTP ${res.status} on ${url}`);
      }
      return res;
    } catch (e) {
      if (i === retries - 1) throw e;
      await sleep(1000);
    }
  }
}

function normalizeIssuerName(name) {
  return name
    .toUpperCase()
    .replace(/[.,/&()-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function inferTicker(cusip, name) {
  if (BIG_TECH_CUSIPS[cusip]) {
    return BIG_TECH_CUSIPS[cusip];
  }

  const normalizedName = normalizeIssuerName(name);
  if (ISSUER_TICKER_OVERRIDES.has(normalizedName)) {
    return ISSUER_TICKER_OVERRIDES.get(normalizedName);
  }

  const words = normalizedName
    .split(' ')
    .filter(Boolean)
    .filter(word => !['INC', 'CORP', 'CO', 'LTD', 'PLC', 'HOLDINGS', 'GROUP', 'CLASS', 'DEL', 'NEW'].includes(word));

  const fallback = words[0] || normalizedName.slice(0, 5);
  return fallback.slice(0, 5);
}

function formatQuarter(dateString) {
  const date = new Date(dateString);
  return `${date.getFullYear()} Q${Math.ceil((date.getMonth() + 1) / 3)}`;
}

function inferSector(holding) {
  const ticker = holding.ticker?.toUpperCase();
  if (ticker && SECTOR_BY_TICKER[ticker]) {
    return SECTOR_BY_TICKER[ticker];
  }

  const name = (holding.name || holding.security || '').toUpperCase();
  if (name.includes('APPLE') || name.includes('MICROSOFT') || name.includes('ALPHABET') || name.includes('NVIDIA') || name.includes('META ') || name.includes('AMAZON') || name.includes('ADVANCED MICRO') || name.includes('BROADCOM') || name.includes('SALESFORCE')) return 'Technology';
  if (name.includes('BANK') || name.includes('FINANCIAL') || name.includes('EXPRESS') || name.includes('CHUBB') || name.includes('MOODY') || name.includes('BERKSHIRE') || name.includes('CITIGROUP') || name.includes('JPMORGAN') || name.includes('VISA') || name.includes('MASTERCARD')) return 'Financials';
  if (name.includes('CHEVRON') || name.includes('OCCIDENTAL') || name.includes('ENERGY') || name.includes('EXXON') || name.includes('CONOCO')) return 'Energy & Utilities';
  if (name.includes('COCA') || name.includes('KRAFT') || name.includes('JOHNSON') || name.includes('PROCTER') || name.includes('WALMART') || name.includes('PEPSI') || name.includes('COSTCO') || name.includes('MCDONALD')) return 'Consumer';
  if (name.includes('HEALTH') || name.includes('PHARMA') || name.includes('LILLY') || name.includes('UNITEDHEALTH') || name.includes('ABBVIE') || name.includes('MERCK') || name.includes('THERMO') || name.includes('PFIZER')) return 'Healthcare';
  if (name.includes('INDUSTRIAL') || name.includes('UNION PACIFIC') || name.includes('CATERPILLAR') || name.includes('DEERE') || name.includes('BOEING') || name.includes('HONEYWELL') || name.includes('WASTE MGMT')) return 'Industrials';
  return 'Other';
}

async function getInformationTableUrl(cik, accessionNumber) {
  const accNoDashes = accessionNumber.replace(/-/g, '');
  const indexUrl = `https://www.sec.gov/Archives/edgar/data/${cik}/${accNoDashes}/index.json`;
  const res = await fetchWithRetry(indexUrl);
  const data = await res.json();
  const files = data.directory.item;
  
  // Find the XML file that contains the actual holdings (Information Table)
  const infoTableFile = files.find(f => 
    f.name.endsWith('.xml') && 
    (f.name.toLowerCase().includes('table') || f.name.toLowerCase().includes('info'))
  ) || files.find(f => f.name.endsWith('.xml') && f.name !== 'primary_doc.xml');
  
  if (!infoTableFile) return null;
  return `https://www.sec.gov/Archives/edgar/data/${cik}/${accNoDashes}/${infoTableFile.name}`;
}

async function parseHoldingsXml(xmlString) {
  const parsed = await parseStringPromise(xmlString, { 
    explicitArray: false, 
    ignoreAttrs: true,
    tagNameProcessors: [stripPrefix]
  });
  // The root node can be 'informationTable' or 'n1:informationTable'
  const rootKey = Object.keys(parsed).find(k => k.toLowerCase().includes('informationtable'));
  if (!rootKey) return { holdings: [], totalValue: 0 };
  
  let infoTable = parsed[rootKey].infoTable;
  if (!infoTable) return { holdings: [], totalValue: 0 };
  if (!Array.isArray(infoTable)) infoTable = [infoTable]; // Handle single holding case
  
  const holdingsMap = new Map();
  let totalValue = 0;
  
  for (const item of infoTable) {
    const cusip = item.cusip;
    const name = item.nameOfIssuer;
    // Values in 13F are usually in thousands, sometimes exact depending on the year, 
    // but recent SEC rule made it exact. However, we'll store raw and normalize later.
    const value = parseFloat(item.value || 0); 
    let shares = 0;
    
    const shrsOrPrnAmt = item.shrsOrPrnAmt;
    if (shrsOrPrnAmt && shrsOrPrnAmt.sshPrnamt) {
      shares = parseFloat(shrsOrPrnAmt.sshPrnamt);
    }
    
    totalValue += value;
    
    if (holdingsMap.has(cusip)) {
      const existing = holdingsMap.get(cusip);
      existing.value += value;
      existing.shares += shares;
      if (existing.name.length < name.length) existing.name = name; // Prefer longer name
    } else {
      const ticker = inferTicker(cusip, name);
      holdingsMap.set(cusip, { cusip, name, ticker, value, shares });
    }
  }
  
  // Convert to array and calculate weights
  const holdings = Array.from(holdingsMap.values()).map(h => ({
    ...h,
    weight: totalValue > 0 ? (h.value / totalValue) * 100 : 0
  })).sort((a, b) => b.value - a.value);
  
  return { holdings, totalValue };
}

function normalizeBillion(value) {
  return (value / 1e9).toFixed(2) + 'B';
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n');
}

function quarterToId(quarter) {
  return quarter.replace(/\s+/g, '-');
}

function getQuarterCounts(metaResults) {
  return metaResults.reduce((counts, inst) => {
    counts[inst.quarter] = (counts[inst.quarter] || 0) + 1;
    return counts;
  }, {});
}

function getDominantQuarter(metaResults) {
  const quarterCounts = getQuarterCounts(metaResults);
  const [quarter] = Object.entries(quarterCounts).sort((a, b) => b[1] - a[1])[0] || [];
  return quarter || 'unknown';
}

function buildSnapshotSummary(quarter, quarterCounts) {
  const entries = Object.entries(quarterCounts).sort((a, b) => b[1] - a[1]);
  if (entries.length === 1) {
    return `Archived ${quarter} snapshot for all tracked institutions.`;
  }

  return `Archived ${quarter} snapshot with mixed filing coverage: ${entries.map(([label, count]) => `${count} institutions on ${label}`).join('; ')}.`;
}

function updateQuarterManifest({ quarter, quarterId, quarterCounts, summary }) {
  const manifestPath = path.join(OUTPUT_DIR, 'quarters.json');
  const existingManifest = fs.existsSync(manifestPath)
    ? JSON.parse(fs.readFileSync(manifestPath, 'utf8'))
    : [];
  const existingEntry = existingManifest.find((entry) => entry.id === quarterId);
  const nextEntry = {
    id: quarterId,
    label: quarter,
    path: `/data/quarters/${quarterId}`,
    isLatest: true,
    status: Object.keys(quarterCounts).length === 1 ? 'complete' : 'mixed',
    summary,
    quarterCounts,
    createdAt: existingEntry?.createdAt || new Date().toISOString().slice(0, 10),
  };

  const nextManifest = [
    nextEntry,
    ...existingManifest
      .filter((entry) => entry.id !== quarterId)
      .map((entry) => ({ ...entry, isLatest: false })),
  ].sort((a, b) => b.id.localeCompare(a.id));

  writeJson(manifestPath, nextManifest);
}

function archiveCurrentSnapshot(metaResults) {
  const quarter = getDominantQuarter(metaResults);
  const quarterId = quarterToId(quarter);
  const quarterCounts = getQuarterCounts(metaResults);
  const summary = buildSnapshotSummary(quarter, quarterCounts);
  const archiveDir = path.join(OUTPUT_DIR, 'quarters', quarterId);

  if (!fs.existsSync(archiveDir)) {
    fs.mkdirSync(archiveDir, { recursive: true });
  }

  const snapshotFiles = [
    'institutions_meta.json',
    'dashboard_treemap.json',
    ...metaResults.map((inst) => `${inst.id}_detail.json`),
  ];

  snapshotFiles.forEach((fileName) => {
    const sourcePath = path.join(OUTPUT_DIR, fileName);
    const targetPath = path.join(archiveDir, fileName);
    if (fs.existsSync(sourcePath)) {
      fs.copyFileSync(sourcePath, targetPath);
    }
  });

  updateQuarterManifest({ quarter, quarterId, quarterCounts, summary });
  console.log(`Archived snapshot to /public/data/quarters/${quarterId}`);
}

async function processInstitution(inst) {
  console.log(`\nProcessing ${inst.name}...`);
  const url = `https://data.sec.gov/submissions/CIK${inst.cik}.json`;
  const res = await fetchWithRetry(url);
  const data = await res.json();
  
  // Find top 2 13F-HR filings
  const formIndices = data.filings.recent.form
    .map((form, index) => form === '13F-HR' ? index : -1)
    .filter(index => index !== -1)
    .slice(0, 2);
    
  if (formIndices.length === 0) {
    console.log(`No 13F-HR found for ${inst.name}`);
    return null;
  }
  
  const latestIndex = formIndices[0];
  const latestAcc = data.filings.recent.accessionNumber[latestIndex];
  const reportDate = data.filings.recent.reportDate[latestIndex];
  const latestFilingDate = data.filings.recent.filingDate?.[latestIndex] || null;
  
  console.log(`Downloading Current Quarter XML (${latestAcc})...`);
  const currentXmlUrl = await getInformationTableUrl(inst.cik, latestAcc);
  const currentXmlRes = await fetchWithRetry(currentXmlUrl);
  const currentXmlText = await currentXmlRes.text();
  const currentData = await parseHoldingsXml(currentXmlText);
  console.log(`  -> Parsed current quarter: ${currentData.holdings.length} holdings, totalValue=${currentData.totalValue}`);
  
  let previousData = { holdings: [], totalValue: 0 };
  if (formIndices.length > 1) {
    const prevIndex = formIndices[1];
    const prevAcc = data.filings.recent.accessionNumber[prevIndex];
    console.log(`Downloading Previous Quarter XML (${prevAcc})...`);
    const prevXmlUrl = await getInformationTableUrl(inst.cik, prevAcc);
    if (prevXmlUrl) {
      const prevXmlRes = await fetchWithRetry(prevXmlUrl);
      const prevXmlText = await prevXmlRes.text();
      previousData = await parseHoldingsXml(prevXmlText);
    }
  }
  await sleep(500); // Rate limit

  // Calculate QoQ
  const prevMap = new Map(previousData.holdings.map(h => [h.cusip, h]));
  const formattedHoldings = [];
  const adds = [];
  const trims = [];
  
  // Colors for UI donut chart
  const colors = ['#3b82f6', '#1d4ed8', '#2dd4bf', '#a855f7', '#22c55e', '#ec4899', '#10b981', '#f97316', '#1e3a8a', '#312e81'];

  currentData.holdings.forEach((curr, i) => {
    const prev = prevMap.get(curr.cusip);
    let qOqDeltaVal = curr.value;
    let shareChangePct = 100;
    let type = 'New';
    
    if (prev) {
      qOqDeltaVal = curr.value - prev.value;
      shareChangePct = prev.shares > 0 ? ((curr.shares - prev.shares) / prev.shares) * 100 : 100;
      type = shareChangePct > 0 ? 'Add' : shareChangePct < 0 ? 'Trim' : 'Hold';
      prevMap.delete(curr.cusip);
    }
    
    // Format UI holding object
    const color = colors[i % colors.length];
    const mktValueNum = curr.value; // It's in exact $ if recent SEC rules applied, or thousands. We'll assume exact $.
    // Many recent XMLs report exact value. If value is unusually small, multiply by 1000? SEC rules changed in Jan 2023 to exact $.
    
    formattedHoldings.push({
      cusip: curr.cusip,
      security: `${curr.name} (${curr.ticker})`.substring(0, 30),
      weight: curr.weight,
      rawMktValue: curr.value,
      mktValue: normalizeBillion(curr.value),
      qOqDelta: (qOqDeltaVal >= 0 ? '+' : '') + normalizeBillion(qOqDeltaVal),
      color
    });
    
    if (type === 'Add' || type === 'New') {
      adds.push({
        ticker: curr.ticker,
        security: curr.name.substring(0, 20),
        deltaValue: '+' + normalizeBillion(Math.abs(qOqDeltaVal)),
        rawDelta: Math.abs(qOqDeltaVal),
        shareChange: (shareChangePct === Infinity || shareChangePct > 999) ? 'New' : '+' + shareChangePct.toFixed(1) + '%',
        newWeight: curr.weight.toFixed(2) + '%',
        type
      });
    } else if (type === 'Trim') {
      trims.push({
        ticker: curr.ticker,
        security: curr.name.substring(0, 20),
        deltaValue: '-' + normalizeBillion(Math.abs(qOqDeltaVal)),
        rawDelta: Math.abs(qOqDeltaVal),
        shareChange: shareChangePct.toFixed(1) + '%',
        newWeight: curr.weight.toFixed(2) + '%',
        type
      });
    }
  });
  
  // Handles Exits (in previous but not current)
  prevMap.forEach(prev => {
    trims.push({
      ticker: prev.ticker,
      security: prev.name.substring(0, 20),
      deltaValue: '-' + normalizeBillion(prev.value),
      rawDelta: prev.value,
      shareChange: '-100.0%',
      newWeight: '0.00%',
      type: 'Exit'
    });
  });
  
  // Top 5 adds and trims
  adds.sort((a, b) => b.rawDelta - a.rawDelta);
  trims.sort((a, b) => b.rawDelta - a.rawDelta);
  
  const quarter = formatQuarter(reportDate);

  // Fetch true historical AUM
  console.log(`Fetching historical AUM for ${inst.name}...`);
  const historicAums = [];
  const historicalIndices = data.filings.recent.form
    .map((form, index) => form === '13F-HR' ? index : -1)
    .filter(index => index !== -1)
    .slice(0, 15); // latest 15 actual quarters
    
  for (let idx of historicalIndices) {
    const acc = data.filings.recent.accessionNumber[idx];
    const rawReportDate = data.filings.recent.reportDate[idx];
    const qtrStr = formatQuarter(rawReportDate);
    const url = `https://www.sec.gov/Archives/edgar/data/${parseInt(inst.cik, 10)}/${acc.replace(/-/g, '')}/primary_doc.xml`;
    try {
      const res = await fetchWithRetry(url);
      if (!res.ok) {
         if (res.status === 403) {
             console.log(`  -> Rate limited by SEC on historical fetch, waiting 3 seconds...`);
             await sleep(3000);
         }
         throw new Error('SEC Error ' + res.status);
      }
      const xml = await res.text();
      const match = xml.match(/<(?:ns1:)?tableValueTotal>(.*?)<\/(?:ns1:)?tableValueTotal>/i);
      if (match) {
        let val = parseFloat(match[1]);
        if (val < 1000000000) val *= 1000; // Correct for pre-2023 thousands scale
        historicAums.push({
           year: qtrStr,
           value: (val / 1e9).toFixed(1)
        });
      }
    } catch(e) { }
    await sleep(400);
  }
  const assetTrend = historicAums.reverse(); // oldest to newest, keep quarterly 13F cadence

  // Generate Institutional Style Radar Data
  const generateRadarData = (holds) => {
    const sp500 = {
      'Financials': 14.0, 'Technology': 31.0, 'Consumer': 16.0,
      'Energy & Utilities': 7.0, 'Healthcare': 11.0, 'Other': 12.0, 'Industrials': 9.0
    };
    const sectors = {
      'Financials': 0, 'Technology': 0, 'Consumer': 0,
      'Energy & Utilities': 0, 'Healthcare': 0, 'Other': 0, 'Industrials': 0
    };
    
    // Naive keyword-based sector mapping
    holds.forEach(h => {
      const sector = inferSector(h);
      sectors[sector] += h.weight;
    });

    // Handle edge case where total weight is 0
    const totalWeight = Object.values(sectors).reduce((a, b) => a + b, 0);
    const radar = Object.keys(sectors).map(subject => ({
      subject,
      A: totalWeight > 0 ? Number(((sectors[subject] / totalWeight) * 100).toFixed(1)) : sp500[subject], // Fallback to S&P500 if empty
      B: sp500[subject],
      fullMark: 100
    }));

    return radar;
  };

  const radarData = generateRadarData(currentData.holdings);
  const displayedHoldingsCount = Math.min(formattedHoldings.length, 15);

  // Export Detail JSON
  const detailJson = {
    institution: {
      ...inst,
      aum: normalizeBillion(currentData.totalValue),
      quarter,
      holdingsCount: currentData.holdings.length,
      displayedHoldingsCount,
      reportDate,
      latestFilingDate
    },
    snapshotNote: `Bundled static snapshot for ${quarter}. Full position count is ${currentData.holdings.length}; holdings table stores the top ${displayedHoldingsCount}.`,
    radarData,
    assetTrend,
    holdings: formattedHoldings.slice(0, 15), // Top 15 for pie chart
    topAdds: adds.slice(0, 5),
    topTrims: trims.slice(0, 5)
  };
  
  writeJson(path.join(OUTPUT_DIR, `${inst.id}_detail.json`), detailJson);
  
  return {
    ...inst,
    aum: normalizeBillion(currentData.totalValue),
    quarter,
    holdingsCount: currentData.holdings.length,
    displayedHoldingsCount,
    reportDate,
    latestFilingDate,
    rawTotalValue: currentData.totalValue,
    allHoldings: currentData.holdings
  };
}

async function main() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  
  console.log("Starting full SEC 13F Data Extraction Pipeline...");
  const metaResults = [];
  const treemapAggregator = new Map();
  
  for (const inst of INSTITUTIONS) {
    try {
      const processed = await processInstitution(inst);
      if (processed) {
        // Prepare metadata for Dashboard
        const { allHoldings, rawTotalValue, ...meta } = processed;
        metaResults.push(meta);
        
        // Aggregate for Treemap
        allHoldings.forEach(h => {
          if (!treemapAggregator.has(h.ticker)) {
            treemapAggregator.set(h.ticker, { ticker: h.ticker, totalValue: 0, sumWeight: 0, holdingInstitutions: new Set() });
          }
          const agg = treemapAggregator.get(h.ticker);
          agg.totalValue += h.value;
          agg.sumWeight += h.weight;
          agg.holdingInstitutions.add(inst.id);
        });
      }
    } catch (e) {
      console.error(`Failed complete processing for ${inst.name}:`, e.message);
      console.error(e.stack);
    }
  }
  
  writeJson(path.join(OUTPUT_DIR, 'institutions_meta.json'), metaResults);
  
  // Finalize Treemap JSON
  const treemapNodes = Array.from(treemapAggregator.values())
    .sort((a, b) => b.totalValue - a.totalValue)
    .slice(0, 20) // Top 20 across all institutions
    .map(t => {
      const instCount = t.holdingInstitutions.size;
      const holdingInstitutionsArr = Array.from(t.holdingInstitutions);
      
      // Heat score based on inst coverage and value relative to top
      const avgWeight = (t.sumWeight / instCount).toFixed(2) + '%';
      const heat = Math.min(100, Math.floor((instCount / INSTITUTIONS.length) * 50 + (t.sumWeight / INSTITUTIONS.length) * 50));
      return {
        ticker: t.ticker,
        heat: Math.max(10, heat),
        avgWeight,
        value: normalizeBillion(t.totalValue),
        instCount,
        holdingInstitutions: holdingInstitutionsArr
      };
    });
    
  writeJson(path.join(OUTPUT_DIR, 'dashboard_treemap.json'), treemapNodes);
  archiveCurrentSnapshot(metaResults);
  
  console.log("Pipeline processing completed successfully. Data exported to /public/data");
}

main();
