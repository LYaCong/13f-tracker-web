import xml2js from 'xml2js';
const { parseStringPromise } = xml2js;
const stripPrefix = xml2js.processors.stripPrefix;

const USER_AGENT = "13FTrackerApp/1.0 (contact@example.com)";

async function main() {
  // Fetch Bridgewater's latest XML directly
  const cik = '0001350694';
  const acc = '0001350694-26-000001';
  const accNoDashes = acc.replace(/-/g, '');
  const xmlUrl = `https://www.sec.gov/Archives/edgar/data/${cik}/${accNoDashes}/infotable.xml`;
  
  console.log('Fetching:', xmlUrl);
  const res = await fetch(xmlUrl, { headers: { 'User-Agent': USER_AGENT } });
  const xmlText = await res.text();
  console.log('XML length:', xmlText.length);
  
  // Parse WITH stripPrefix
  const parsed = await parseStringPromise(xmlText, {
    explicitArray: false,
    ignoreAttrs: true,
    tagNameProcessors: [stripPrefix]
  });
  
  console.log('\n=== Top level keys:', Object.keys(parsed));
  const rootKey = Object.keys(parsed).find(k => k.toLowerCase().includes('informationtable'));
  console.log('Root key found:', rootKey);
  
  if (rootKey) {
    const root = parsed[rootKey];
    console.log('Root children keys:', Object.keys(root));
    
    let infoTable = root.infoTable;
    if (!infoTable) {
      console.log('infoTable NOT found directly. Trying other keys...');
      // Check all keys
      for (const key of Object.keys(root)) {
        console.log(`  Key: "${key}", type: ${typeof root[key]}, isArray: ${Array.isArray(root[key])}`);
      }
    } else {
      if (!Array.isArray(infoTable)) infoTable = [infoTable];
      console.log(`Found ${infoTable.length} holdings`);
      console.log('First holding:', JSON.stringify(infoTable[0], null, 2));
    }
  }
}

main();
