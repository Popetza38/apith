require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { HttpsProxyAgent } = require('https-proxy-agent');

// ── PROXY SETUP ──────────────────────────────────────────────────────
// DramaBox nge-block IP datacenter (VPS/cloud biasa dapet 403 pas token gen).
// Solusinya: pake residential/mobile proxy. Set PROXY_URL di .env, contoh:
//   PROXY_URL=http://username:password@proxy-host:port
// Karena @zhadev/dramabox manggil axios.default.get/post/request langsung
// (bukan instance axios sendiri), setting axios.defaults di sini otomatis
// kepakai juga sama request-request di dalam library itu.
if (process.env.PROXY_URL) {
  const agent = new HttpsProxyAgent(process.env.PROXY_URL);
  axios.defaults.httpAgent = agent;
  axios.defaults.httpsAgent = agent;
  axios.defaults.proxy = false; // matiin proxy handling bawaan axios, pake agent manual
  console.log('[proxy] aktif, semua request lewat:', process.env.PROXY_URL.replace(/\/\/.*@/, '//<hidden>@'));
} else {
  console.log('[proxy] PROXY_URL ga di-set, request langsung tanpa proxy (rawan 403 kalau host di cloud/VPS)');
}

// Set environment variables for proxy (some libraries use these)
if (process.env.PROXY_URL) {
  process.env.HTTP_PROXY = process.env.PROXY_URL;
  process.env.HTTPS_PROXY = process.env.PROXY_URL;
}

// Monkey-patch axios to ensure proxy is used for all requests
const originalAxios = axios.default;
const proxyAgent = process.env.PROXY_URL ? new HttpsProxyAgent(process.env.PROXY_URL) : null;

// Override axios methods to always use proxy agent
if (proxyAgent) {
  ['get', 'post', 'put', 'delete', 'patch', 'request'].forEach(method => {
    const originalMethod = originalAxios[method];
    originalAxios[method] = function(...args) {
      const config = args[args.length - 1];
      if (typeof config === 'object') {
        config.httpAgent = proxyAgent;
        config.httpsAgent = proxyAgent;
        config.proxy = false;
      } else {
        args.push({
          httpAgent: proxyAgent,
          httpsAgent: proxyAgent,
          proxy: false
        });
      }
      return originalMethod.apply(this, args);
    };
  });
}

// Import DramaboxScraper AFTER proxy setup
const DramaboxScraper = require('@zhadev/dramabox').default;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname)); // biar docs.html (dan static file lain) ke-serve otomatis

const PORT = process.env.PORT || 3000;

// Satu instance scraper dipakai bareng (biar cache & token kepakai ulang)
const scraper = new DramaboxScraper({
  language: 'th',
  cacheTTL: 300,      // cache 5 menit biar ga spam ke server dramabox
  requestDelay: 500,  // jeda dikit antar request internal
  maxRetries: 3,
});

// Helper: bungkus semua route biar error konsisten
const handle = (fn) => async (req, res) => {
  try {
    const result = await fn(req);
    res.json(result);
  } catch (err) {
    res.status(500).json({
      success: false,
      creator: 'aji-dramabox-api',
      message: err.message || 'Internal error',
    });
  }
};

// Root - docs.html jadi halaman utama
app.get(['/', '/docs', '/docs/'], (req, res) => {
  res.sendFile(path.join(__dirname, 'docs.html'));
});

// Info API dipindah ke /api biar tetep bisa diakses
app.get('/api', (req, res) => {
  res.json({
    success: true,
    name: 'DramaBox Unofficial API',
    creator: 'aji',
    endpoints: [
      'GET /latest?page=1',
      'GET /trending',
      'GET /vip',
      'GET /homepage',
      'GET /categories?page=1&pageSize=20',
      'GET /category/:typeTwoId?page=1&pageSize=20',
      'GET /recommended',
      'GET /search?q=keyword&page=1&pageSize=20',
      'GET /search/suggest?q=keyword',
      'GET /detail/:bookId',
      'GET /detail-v2/:bookId',
      'GET /chapters/:bookId',
      'GET /episode/:bookId/:episodeIndex',
      'GET /stream/:bookId/:episode',
      'GET /batch/:bookId',
      'GET /related/:bookId',
      'GET /health',
    ],
  });
});

app.get('/health', handle(async () => {
  try {
    const pingRes = await scraper.ping();
    if (pingRes && pingRes.success) {
      return pingRes;
    }
  } catch (e) {
    // Fallback if Akamai WAF blocks token ping
  }

  const catRes = await scraper.getCategories(1, 1);
  return {
    success: true,
    creator: 'aji-dramabox-api',
    status: 'online',
    message: 'DramaBox API Service is online and operational',
    categoriesAvailable: catRes && catRes.success,
    timestamp: new Date().toISOString()
  };
}));

app.get('/proxy-status', (req, res) => {
  const proxyUrl = process.env.PROXY_URL;
  let cleanHost = null;
  if (proxyUrl) {
    try {
      const parsed = new URL(proxyUrl);
      cleanHost = parsed.host;
    } catch {
      cleanHost = proxyUrl.replace(/.*@/, '').replace(/\/$/, '');
    }
  }
  res.json({
    success: true,
    proxyActive: !!proxyUrl,
    proxyHost: cleanHost,
    note: proxyUrl
      ? 'Request diarahkan lewat proxy.'
      : 'Ga pake proxy — kalau host di VPS/cloud, request ke DramaBox bisa kena 403.',
  });
});

// Helper fallback using Webfic API when sapi.dramaboxdb.com returns 403 or token error
async function getWebficBrowse(params = {}) {
  try {
    const lang = params.lang || 'th';
    const res = await axios.post('https://www.webfic.com/webfic/home/browse', {
      typeTwoId: params.typeTwoId || 0,
      pageNo: params.pageNo || 1,
      pageSize: params.pageSize || 20,
      searchWord: params.searchWord || ''
    }, {
      headers: {
        'Content-Type': 'application/json',
        'pline': 'DRAMABOX',
        'language': lang,
        'accept-language': 'th-TH,th;q=0.9'
      }
    });
    if (res.data && res.data.data && Array.isArray(res.data.data.bookList)) {
      return res.data.data.bookList.map(b => ({
        bookId: b.bookId,
        bookName: b.bookName || b.replacedBookName,
        cover: b.cover,
        introduction: b.introduction,
        chapterCount: b.chapterCount,
        playCount: b.viewCountDisplay || '10K+',
        tags: b.tags || b.typeTwoNames || [],
        language: b.language || 'THAI',
        simpleLanguage: b.simpleLanguage || 'th'
      }));
    }
  } catch (err) {}
  return [];
}

async function getWebficDetail(bookId) {
  try {
    const res = await axios.post('https://www.webfic.com/webfic/book/detail', {
      bookId: bookId
    }, {
      headers: {
        'Content-Type': 'application/json',
        'pline': 'DRAMABOX',
        'language': 'th',
        'accept-language': 'th-TH,th;q=0.9'
      }
    });
    if (res.data && res.data.data && res.data.data.book) {
      const b = res.data.data.book;
      return {
        success: true,
        creator: 'aji-dramabox-api',
        data: {
          bookId: b.bookId,
          bookName: b.bookName || b.replacedBookName,
          cover: b.cover,
          introduction: b.introduction,
          chapterCount: b.chapterCount,
          ratings: b.ratings,
          followCount: b.followCount,
          tags: b.typeTwoNames || b.tags || [],
          language: b.language || 'THAI',
          simpleLanguage: b.simpleLanguage || 'th'
        }
      };
    }
  } catch (err) {}
  return null;
}

app.get('/latest', handle(async (req) => {
  const page = parseInt(req.query.page) || 1;
  try {
    const res = await scraper.getLatest(page);
    if (res && res.success && res.data) return res;
  } catch (e) {}
  const webficData = await getWebficBrowse({ pageNo: page });
  return {
    success: true,
    creator: 'aji-dramabox-api',
    data: { page, total: webficData.length, results: webficData }
  };
}));

app.get('/trending', handle(async () => {
  try {
    const res = await scraper.getTrending();
    if (res && res.success && res.data) return res;
  } catch (e) {}
  const webficData = await getWebficBrowse({ pageNo: 1 });
  return {
    success: true,
    creator: 'aji-dramabox-api',
    data: { total: webficData.length, results: webficData }
  };
}));

app.get('/vip', handle(async () => {
  try {
    const res = await scraper.getVip();
    if (res && res.success && res.data) return res;
  } catch (e) {}
  const webficData = await getWebficBrowse({ pageNo: 1 });
  return {
    success: true,
    creator: 'aji-dramabox-api',
    data: { total: webficData.length, results: webficData }
  };
}));

app.get('/homepage', handle(async () => {
  try {
    const res = await scraper.getHomepage();
    if (res && res.success && res.data) return res;
  } catch (e) {}
  const webficData = await getWebficBrowse({ pageNo: 1 });
  return {
    success: true,
    creator: 'aji-dramabox-api',
    data: {
      latest: webficData.slice(0, 5),
      trending: webficData.slice(5, 10),
      recommended: webficData.slice(10, 20),
      timestamp: Date.now()
    }
  };
}));

app.get('/recommended', handle(async () => {
  try {
    const res = await scraper.getRecommendedBooks();
    if (res && res.success && res.data) return res;
  } catch (e) {}
  const webficData = await getWebficBrowse({ pageNo: 1 });
  return {
    success: true,
    creator: 'aji-dramabox-api',
    data: webficData
  };
}));

app.get('/categories', handle(async (req) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 20;
  return await scraper.getCategories(page, pageSize);
}));

app.get('/category/:typeTwoId', handle(async (req) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 20;
  try {
    const res = await scraper.getBooksByCategory(req.params.typeTwoId, page, pageSize);
    if (res && res.success && res.data) return res;
  } catch (e) {}
  const webficData = await getWebficBrowse({ typeTwoId: req.params.typeTwoId, pageNo: page, pageSize });
  return {
    success: true,
    creator: 'aji-dramabox-api',
    data: { isMore: webficData.length >= pageSize, book: webficData }
  };
}));

app.get('/search', handle(async (req) => {
  const q = req.query.q || '';
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 20;
  if (!q) throw new Error('Query param "q" Wajib diisi');
  try {
    const res = await scraper.searchDrama(q, page, pageSize);
    if (res && res.success && res.data) return res;
  } catch (e) {}
  const webficData = await getWebficBrowse({ searchWord: q, pageNo: page, pageSize });
  return {
    success: true,
    creator: 'aji-dramabox-api',
    data: { isMore: webficData.length >= pageSize, book: webficData }
  };
}));

app.get('/search/suggest', handle(async (req) => {
  const q = req.query.q || '';
  if (!q) throw new Error('Query param "q" Wajib diisi');
  try {
    const res = await scraper.suggestSearch(q);
    if (res && res.success && res.data) return res;
  } catch (e) {}
  const webficData = await getWebficBrowse({ searchWord: q, pageNo: 1, pageSize: 5 });
  return {
    success: true,
    creator: 'aji-dramabox-api',
    data: webficData
  };
}));

app.get('/detail/:bookId', handle(async (req) => {
  try {
    const res = await scraper.getDramaDetail(req.params.bookId);
    if (res && res.success && res.data) return res;
  } catch (e) {}
  const fallback = await getWebficDetail(req.params.bookId);
  if (fallback) return fallback;
  throw new Error('ไม่พบข้อมูลซีรีส์หรือเกิดข้อผิดพลาดในการดึงข้อมูล');
}));

app.get('/detail-v2/:bookId', handle(async (req) => {
  try {
    const res = await scraper.getDramaDetailV2(req.params.bookId);
    if (res && res.success && res.data) return res;
  } catch (e) {}
  const fallback = await getWebficDetail(req.params.bookId);
  if (fallback) return fallback;
  throw new Error('ไม่พบข้อมูลซีรีส์หรือเกิดข้อผิดพลาดในการดึงข้อมูล');
}));

app.get('/chapters/:bookId', handle(async (req) => await scraper.getChapters(req.params.bookId)));

app.get('/episode/:bookId/:episodeIndex', handle(async (req) => {
  return await scraper.getEpisodeDetails(req.params.bookId, parseInt(req.params.episodeIndex));
}));

app.get('/stream/:bookId/:episode', handle(async (req) => {
  const bookId = req.params.bookId;
  const epNum = parseInt(req.params.episode);
  try {
    const streamRes = await scraper.getStreamUrl(bookId, epNum);
    if (streamRes && streamRes.success && streamRes.data) {
      return streamRes;
    }
  } catch (e) {
    // Fallback to native DramaBox chapters API if third-party stream service is down
  }

  // Fallback: Fetch video URL directly from DramaBox native API
  const chaptersRes = await scraper.getChapters(bookId);
  if (chaptersRes && chaptersRes.success && chaptersRes.data && Array.isArray(chaptersRes.data.chapters)) {
    const epIndex = epNum > 0 ? epNum - 1 : 0;
    const chapter = chaptersRes.data.chapters.find(c => c.chapterIndex === epIndex) || chaptersRes.data.chapters[epIndex] || chaptersRes.data.chapters[0];
    if (chapter) {
      return {
        success: true,
        creator: 'aji-dramabox-api',
        data: {
          bookId,
          episode: epNum,
          chapterName: chapter.chapterName,
          cover: chapter.cover,
          videoUrl: chapter.videoPath,
          cdnList: chapter.cdnList
        }
      };
    }
  }
  
  throw new Error(`Gagalดึง Stream URL สำหรับ episode ${epNum}`);
}));

app.get('/batch/:bookId', handle(async (req) => await scraper.batchDownload(req.params.bookId)));

app.get('/related/:bookId', handle(async (req) => await scraper.getRelatedDramas(req.params.bookId)));

// Vercel serverless: jangan listen kalau di-import sebagai module (VERCEL env ada)
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`DramaBox API jalan di port ${PORT}`);
  });
}

module.exports = app;

    
