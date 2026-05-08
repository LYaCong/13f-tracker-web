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
  const url = 'https://www.sec.gov/Archives/edgar/data/1067983/000119312525282901/primary_doc.xml'; // Berkshire prev Q
  try {
    const data = await fetchWithRetry(url);
    const match = data.match(/<(?:ns1:)?reportValuesTotal>(.*?)<\/(?:ns1:)?reportValuesTotal>/i) || data.match(/<ReportValuesTotal>(.*?)<\/ReportValuesTotal>/i);
    const periodMatch = data.match(/<reportCalendarOrQuarter>(.*?)<\/reportCalendarOrQuarter>/i);
    console.log("Total Value:", match ? match[1] : 'Not Found');
    console.log("Period:", periodMatch ? periodMatch[1] : 'Not Found');
  } catch (e) {
    console.error(e.message);
  }
}

run();
