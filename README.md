<div align="center">

# 🎬 Dramabox API

### Modern REST API untuk mengakses konten Dramabox

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)
[![Version](https://img.shields.io/badge/Version-1.2.0-green?style=for-the-badge)]()

[🚀 Demo](https://dramabox-rest-api-node-rho.vercel.app/) • [📖 Dokumentasi](#-endpoints) • [🐛 Report Bug](https://github.com/hndko/dramabox-rest-api-node/issues)

</div>

---

## ✨ Features

| Fitur                  | Deskripsi                         |
| ---------------------- | --------------------------------- |
| 🔍 **Search**          | Cari drama berdasarkan keyword    |
| 📺 **Streaming**       | Dapatkan URL streaming (m3u8/mp4) |
| 📋 **Episode List**    | Daftar semua chapter/episode      |
| 🏷️ **Categories**      | Jelajahi berdasarkan kategori     |
| ⭐ **Recommendations** | Drama yang direkomendasikan       |
| 👑 **VIP Content**     | Akses konten VIP/Theater          |

## 🛡️ Production Ready

| Best Practice        | Status          |
| -------------------- | --------------- |
| ⚡ Rate Limiting     | ✅ 100 req/min  |
| 🗜️ Gzip Compression  | ✅ ~70% smaller |
| 🔒 Security Headers  | ✅ Helmet       |
| 🔄 Auto Retry        | ✅ 3x + backoff |
| 💾 Response Caching  | ✅ 5-60 min TTL |
| 📊 Health Check      | ✅ /health      |
| 🎯 Input Validation  | ✅ Sanitized    |
| 🚦 Graceful Shutdown | ✅ SIGTERM      |

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm atau yarn

### Installation

```bash
# Clone repository
git clone https://github.com/hndko/dramabox-rest-api-node.git
cd dramabox-rest-api-node

# Install dependencies
npm install

# Build CSS (optional)
npm run build:css

# Start development server
npm run dev
```

### Environment Variables (Optional)

```env
PORT=3000
NODE_ENV=development
DEFAULT_LANG=in
```

---

## 📖 Endpoints

### Base URL

```
Local: http://localhost:3000
Production: https://dramabox-rest-api-node-eta.vercel.app
```

### 🔍 Search Drama

```http
GET /api/search?keyword={keyword}&page={page}&size={size}&lang={lang}
```

| Parameter | Type   | Required | Default | Description          |
| --------- | ------ | -------- | ------- | -------------------- |
| keyword   | string | ✅       | -       | Kata kunci pencarian |
| page      | number | ❌       | 1       | Halaman              |
| size      | number | ❌       | 20      | Jumlah per halaman   |
| lang      | string | ❌       | in      | Bahasa (in/en/th)    |

### 🏠 Home / Drama List

```http
GET /api/home?page={page}&size={size}&lang={lang}
```

### 👑 VIP / Theater

```http
GET /api/vip?lang={lang}
```

### 📄 Drama Detail

```http
GET /api/detail/{bookId}/v2?lang={lang}
```

### 📋 Episode List

```http
GET /api/chapters/{bookId}?lang={lang}
```

### 📺 Stream URL

```http
GET /api/stream?bookId={bookId}&episode={episode}&lang={lang}
```

| Parameter | Type   | Required | Description   |
| --------- | ------ | -------- | ------------- |
| bookId    | number | ✅       | ID drama      |
| episode   | number | ✅       | Nomor episode |

### ⬇️ Batch Download

```http
GET /download/{bookId}?lang={lang}
```

> ⚠️ Rate limit: 5 request/menit

### 🏷️ Categories

```http
GET /api/categories?lang={lang}
GET /api/category/{id}?page={page}&size={size}&lang={lang}
```

### ⭐ Recommendations

```http
GET /api/recommend?lang={lang}
```

### 💚 Health Check

```http
GET /health
```

---

## 📦 Response Format

### ✅ Success Response

```json
{
  "success": true,
  "data": [...],
  "meta": {
    "timestamp": "2024-01-01T00:00:00.000Z",
    "pagination": {
      "page": 1,
      "size": 10,
      "hasMore": true
    }
  }
}
```

### ❌ Error Response

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Parameter wajib: keyword"
  },
  "meta": {
    "timestamp": "2024-01-01T00:00:00.000Z"
  }
}
```

### Error Codes

| Code                  | HTTP | Description            |
| --------------------- | ---- | ---------------------- |
| `VALIDATION_ERROR`    | 400  | Input tidak valid      |
| `NOT_FOUND`           | 404  | Data tidak ditemukan   |
| `RATE_LIMIT_EXCEEDED` | 429  | Terlalu banyak request |
| `REQUEST_TIMEOUT`     | 408  | Request timeout        |
| `INTERNAL_ERROR`      | 500  | Server error           |

---

## 🗂️ Project Structure

```
dramabox-rest-api-node/
├── 📁 docs/
│   ├── 📁 api/             # API Documentation & Postman
│   ├── 📁 deployment/      # Deployment Guides
│   └── 📁 general/         # General Info
├── 📁 src/
│   ├── 📁 config/          # App Configuration
│   ├── 📁 controllers/     # Business Logic
│   ├── 📁 middlewares/     # Express Middlewares
│   ├── 📁 routes/          # API Routes
│   ├── 📁 services/        # Third-party Services
│   ├── 📁 utils/           # Utility Functions
│   ├── 📁 styles/          # Tailwind Source
│   └── 📄 app.js           # App Assembly
├── 📁 public/
│   └── 📁 css/             # Compiled CSS
├── 📁 views/
│   └── 📄 docs.ejs         # Documentation Page
├── 📄 server.js            # Entry Point
├── 📄 tailwind.config.js
└── 📄 package.json
```

---

## 🛠️ Scripts

```bash
npm start        # Production server
npm run dev      # Development with hot reload
npm run build:css   # Build Tailwind CSS
npm run watch:css   # Watch Tailwind changes
```

---

## 🚀 Deployment

We have prepared detailed guides for various platforms:

- [**Vercel**](docs/deployment/VERCEL.md) (Recommended for Hobby)
- [**Shared Hosting (cPanel)**](docs/deployment/SHARED_HOSTING.md)
- [**VPS (Ubuntu/Debian)**](docs/deployment/VPS.md)
- [**aaPanel**](docs/deployment/AAPANEL.md)

### Helper

- [**Docker Guide**](docs/deployment/DOCKER.md) (Coming Soon)

---

## 📝 Changelog

### v1.3.0 (2024-01-12)

- ♻️ **Refactor**: Modular MVC Architecture
- 🌐 **Feat**: Full Multi-Language Support (`lang=in/en`)
- 🎨 **UI**: New polished language selector in docs
- 📚 **Docs**: Restructured documentation & added deployment guides

### v1.2.0 (2024-12-30)

- ✅ Rate limiting (100 req/min)
- ✅ Gzip compression
- ✅ Helmet security headers
- ✅ Standardized response format
- ✅ Global error handling
- ✅ Graceful shutdown
- ✅ Health check endpoint
- ✅ Instance pooling

### v1.1.0

- ✅ Retry logic with exponential backoff
- ✅ Response caching (node-cache)
- ✅ Better error messages
- ✅ Tailwind CSS (local build)
- ✅ Modern documentation UI

### v1.0.0

- 🎉 Initial release

---

## 👨‍💻 Developer

**Handoko x Mari Partner**

[![WhatsApp](https://img.shields.io/badge/WhatsApp-25D366?style=for-the-badge&logo=whatsapp&logoColor=white)](https://api.whatsapp.com/send/?phone=6287780081554)

---

## 📄 License

MIT License - feel free to use for personal or commercial projects.

---

<div align="center">

**⭐ Star this repo if you find it useful!**

Made with ❤️ in Indonesia 🇮🇩

</div>
