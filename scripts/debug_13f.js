// Diagnostic script for debugging 0.00B institutions
const USER_AGENT = "13FTrackerApp/1.0 (contact@example.com)";

const FAILING = [
  { id: 'bridgewater', name: 'Bridgewater Associates, LP', cik: '0001350694' },
  { id: 'hh', name: 'H&H International Investment, LLC', cik: '0001759760' },
  { id: 'himalaya', name: 'Himalaya Capital Management LLC', cik: '0001709323' },
];

async function fetchJSON(url) {
  const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
  return res.json();
}
async function fetchText(url) {
  const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
  return res.text();
}

async function diagnose(inst) {
  console.log(`\n========== ${inst.name} ==========`);
  
  const data = await fetchJSON(`https://data.sec.gov/submissions/CIK${inst.cik}.json`);
  const forms = data.filings.recent.form;
  const indices13F = forms.map((f, i) => f === '13F-HR' ? i : -1).filter(i => i !== -1).slice(0, 2);
  
  if (indices13F.length === 0) {
    console.log('  NO 13F-HR filings found!');
    const formTypes = [...new Set(forms)];
    console.log('  Available form types:', formTypes.slice(0, 15).join(', '));
    return;
  }
  
  for (const idx of indices13F.slice(0, 1)) {
    const acc = data.filings.recent.accessionNumber[idx];
    const reportDate = data.filings.recent.reportDate[idx];
    console.log(`  Filing: ${acc} (Report: ${reportDate})`);
    
    const accNoDashes = acc.replace(/-/g, '');
    const indexUrl = `https://www.sec.gov/Archives/edgar/data/${inst.cik}/${accNoDashes}/index.json`;
    
    try {
      const indexData = await fetchJSON(indexUrl);
      const files = indexData.directory.item;
      console.log(`  Files in filing dir (${files.length}):`);
      files.forEach(f => console.log(`    - ${f.name} (${f.size})`));
      
      const xmlFile = files.find(f => 
        f.name.endsWith('.xml') && 
        (f.name.toLowerCase().includes('table') || f.name.toLowerCase().includes('info'))
      ) || files.find(f => f.name.endsWith('.xml') && f.name !== 'primary_doc.xml');
      
      if (!xmlFile) {
        console.log('  !! No XML file found matching our pattern');
        continue;
      }
      
      console.log(`  Selected XML: ${xmlFile.name}`);
      
      const xmlUrl = `https://www.sec.gov/Archives/edgar/data/${inst.cik}/${accNoDashes}/${xmlFile.name}`;
      const xmlText = await fetchText(xmlUrl);
      console.log(`  XML length: ${xmlText.length}`);
      console.log(`  XML first 2000 chars:\n${xmlText.substring(0, 2000)}`);
    } catch (e) {
      console.log(`  Error: ${e.message}`);
    }
    
    await new Promise(r => setTimeout(r, 300));
  }
}

async function main() {
  for (const inst of FAILING) {
    await diagnose(inst);
    await new Promise(r => setTimeout(r, 500));
  }
}

main();
