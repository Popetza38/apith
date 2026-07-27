const axios = require('axios');
const { HttpsProxyAgent } = require('https-proxy-agent');

async function getFreeProxies() {
  const proxies = new Set();

  try {
    const res1 = await axios.get('https://api.proxyscrape.com/v2/?request=getproxies&protocol=http&timeout=3000&country=all&ssl=all&anonymity=all', { timeout: 4000 });
    res1.data.split(/\r?\n/).forEach(p => p.trim() && proxies.add(p.trim()));
  } catch (e) {}

  try {
    const res2 = await axios.get('https://proxylist.geonode.com/api/proxy-list?limit=100&page=1&sort_by=lastChecked&sort_type=desc', { timeout: 4000 });
    if (res2.data && res2.data.data) {
      res2.data.data.forEach(item => {
        const proto = item.protocols.includes('https') ? 'https' : (item.protocols.includes('http') ? 'http' : item.protocols[0]);
        proxies.add(`${proto}://${item.ip}:${item.port}`);
      });
    }
  } catch (e) {}

  try {
    const res3 = await axios.get('https://raw.githubusercontent.com/monosans/proxy-list/main/proxies/http.txt', { timeout: 4000 });
    res3.data.split(/\r?\n/).forEach(p => p.trim() && proxies.add(p.trim()));
  } catch (e) {}

  try {
    const res4 = await axios.get('https://raw.githubusercontent.com/TheSpeedX/SOCKS-List/master/http.txt', { timeout: 4000 });
    res4.data.split(/\r?\n/).forEach(p => p.trim() && proxies.add(p.trim()));
  } catch (e) {}

  return Array.from(proxies);
}

async function testProxy(proxyStr) {
  const proxyUrl = proxyStr.includes('://') ? proxyStr : `http://${proxyStr}`;
  let agent;
  try {
    agent = new HttpsProxyAgent(proxyUrl);
  } catch (e) {
    return null;
  }

  try {
    const res = await axios.post('https://www.webfic.com/webfic/home/browse', {
      typeTwoId: 0,
      pageNo: 1,
      pageSize: 5
    }, {
      headers: {
        'Content-Type': 'application/json',
        'pline': 'DRAMABOX',
        'language': 'th',
        'User-Agent': 'okhttp/4.10.0'
      },
      httpAgent: agent,
      httpsAgent: agent,
      proxy: false,
      timeout: 3000
    });
    if (res.status === 200 && res.data && res.data.success) {
      console.log('[FOUND WORKING PROXY]:', proxyUrl);
      return proxyUrl;
    }
  } catch (err) {}
  return null;
}

async function main() {
  console.log('Fetching proxy candidates...');
  const rawList = await getFreeProxies();
  console.log(`Testing ${rawList.length} candidates with streaming output...`);

  const working = [];
  const targetCount = 10;
  const batchSize = 15;

  for (let i = 0; i < rawList.length; i += batchSize) {
    const batch = rawList.slice(i, i + batchSize);
    const results = await Promise.all(batch.map(p => testProxy(p)));
    results.filter(Boolean).forEach(p => {
      if (!working.includes(p)) working.push(p);
    });

    if (working.length >= targetCount) break;
  }

  console.log('\n--- FINAL WORKING PROXIES LIST ---');
  console.log(JSON.stringify(working, null, 2));
}

main();
