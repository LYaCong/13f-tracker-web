const https = require('https');
async function fetchWithRetry(url, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await new Promise((resolve, reject) => {
        https.get(url, {
          headers: {
            'User-Agent': 'Tracker/1.0 (test@example.com)'
          }
        }, (res) => {
          if (res.statusCode === 301 || res.statusCode === 302) {
            fetchWithRetry(res.headers.location).then(resolve).catch(reject);
            return;
          }
          if (res.statusCode !== 200) {
            reject(new Error(`Status ${res.statusCode}`));
            return;
          }
          let data = '';
          res.on('data', chunk => data += chunk);
          res.on('end', () => resolve(data));
        }).on('error', reject);
      });
    } catch (e) {
      if (i === maxRetries - 1) throw e;
      await new Promise(r => setTimeout(r, 1000));
    }
  }
}

async function run() {
  const data = await (await fetch('https://data.sec.gov/submissions/CIK0001067983.json', { headers: { 'User-Agent': 'Tracker/1.0 (test@example.com)' }})).json();
  const acc = data.filings.recent.accessionNumber[data.filings.recent.form.indexOf('13F-HR')];
  const url = `https://www.sec.gov/Archives/edgar/data/1067983/${acc.replace(/-/g, '')}/primary_doc.xml`;
  console.log(url);
  const xml = await fetchWithRetry(url);
  console.log('Got XML, length', xml.length);
  const match = xml.match(/<(?:ns1:)?reportValuesTotal>(.*?)<\/(?:ns1:)?reportValuesTotal>/i);
  console.log('Match?', match ? match[1] : 'No');
}
run();
