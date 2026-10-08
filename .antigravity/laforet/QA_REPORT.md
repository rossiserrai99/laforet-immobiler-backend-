# EMPIRICAL QA & ADVERSARIAL STRESS AUDIT REPORT (MILESTONE 5)

> **Project:** Agence Immobilière La Forêt — Web Platform  
> **Milestone:** Milestone 5 (Independent QA & Final Audit)  
> **Auditor:** QA Challenger (Empirical Adversarial Reviewer)  
> **Date:** October 8, 2026  
> **Execution Status:** 62 PASSED, 1 DEFECT IDENTIFIED  
> **Test Harness:** `.antigravity/laforet/scratch/qa_empirical_test.js`  
> **Target Deliverable:** `.antigravity/laforet/QA_REPORT.md`  

---

## 1. Executive Summary & Verification Verdict

An empirical, adversarial stress test of the complete La Forêt web platform was conducted across functional, content, media, performance, and security dimensions. Testing was executed directly against the live backend API (`http://localhost:5000`), the Next.js frontend application (`http://localhost:3000`), MongoDB Atlas, and the ImageKit CDN endpoint (`https://ik.imagekit.io/8jggj5dcd7`).

### High-Level Audit Scorecard

| Dimension | Tests Executed | Passed | Failed | Status |
|---|---|---|---|---|
| **1. Functional QA** | 29 | 28 | 1 | ⚠️ 1 Backend Defect Detected |
| **2. Content & Inventory QA** | 20 | 20 | 0 | ✅ 100% Verified Clean |
| **3. Media & CDN QA** | 8 | 8 | 0 | ✅ 100% Verified Live (0 Broken) |
| **4. Performance & Payload QA** | 2 | 2 | 0 | ✅ Highly Compact & Stable |
| **5. Security & Secret Hygiene** | 4 | 4 | 0 | ✅ Zero Secret Leaks Certified |
| **Total Test Assertions** | **63** | **62** | **1** | **98.4% Pass Rate** |

---

## 2. Comprehensive Empirical Test Results

### 2.1 Functional QA (Catalog Filters, Search, Pagination & Auth)

| # | Test Case Description | Test Method / Oracle | Empirical Result | Status |
|---|---|---|---|---|
| F1 | Public Catalog Filter: `type=Vente` | `GET /api/properties?type=Vente&limit=100` | Returned 22 properties; 100% have `type === 'Vente'` | **PASS** |
| F2 | Public Catalog Filter: `type=Location` | `GET /api/properties?type=Location&limit=100` | Returned 5 properties; 100% have `type === 'Location'` | **PASS** |
| F3 | Category: `Villa` | `GET /api/properties?category=Villa` | Returned 6 properties; 100% have `category === 'Villa'` | **PASS** |
| F4 | Category: `Appartement` | `GET /api/properties?category=Appartement` | Returned 18 properties; 100% have `category === 'Appartement'` | **PASS** |
| F5 | Category: `Duplex` | `GET /api/properties?category=Duplex` | Returned 1 property (`LF-OK-56621098`); matches category | **PASS** |
| F6 | Category: `Terrain` | `GET /api/properties?category=Terrain` | Returned 1 property (`LF-OK-57654190`); matches category | **PASS** |
| F7 | Category: `Local Commercial` | `GET /api/properties?category=Local Commercial` | Returned 1 property (`LF-OK-56954318`); matches category | **PASS** |
| F8 | Commune: `Hydra` (with alias resolution) | `GET /api/properties?commune=Hydra` | Returned 4 properties (including Sidi Yahya alias) | **PASS** |
| F9 | Commune: `Alger Centre` | `GET /api/properties?commune=Alger Centre` | Returned 4 properties; 100% in Alger Centre | **PASS** |
| F10 | Commune: `El Biar` | `GET /api/properties?commune=El Biar` | Returned 3 properties; 100% in El Biar | **PASS** |
| F11 | Commune: `Birkhadem` | `GET /api/properties?commune=Birkhadem` | Returned 2 properties; 100% in Birkhadem | **PASS** |
| F12 | Commune: `Bologhine` | `GET /api/properties?commune=Bologhine` | Returned 1 property (`LF-OK-58058031`); matches | **PASS** |
| F13 | Commune: `Mohammadia` | `GET /api/properties?commune=Mohammadia` | Returned 1 property (`LF-OK-32402120`); matches | **PASS** |
| F14 | Commune: `El Mouradia` | `GET /api/properties?commune=El Mouradia` | Returned 1 property (`LF-OK-57541208`); matches | **PASS** |
| F15 | Commune: `Bab El Oued` | `GET /api/properties?commune=Bab El Oued` | Returned 2 properties; matches | **PASS** |
| F16 | Commune: `Hussein Dey` | `GET /api/properties?commune=Hussein Dey` | Returned 1 property (`LF-OK-57065912`); matches | **PASS** |
| F17 | Commune: `El Achour` | `GET /api/properties?commune=El Achour` | Returned 1 property (`LF-OK-56954318`); matches | **PASS** |
| F18 | Commune: `El Madania` | `GET /api/properties?commune=El Madania` | Returned 1 property (`LF-OK-57291045`); matches | **PASS** |
| F19 | Price Bounds Filtering (`price[gte]`, `price[lte]`) | `GET /api/properties?price[gte]=100000&price[lte]=500000&type=Location` | Returned 0 items (Expected: 4 rental properties) | ❌ **FAIL** (Defect DEF-01) |
| F20 | Pagination: Disjoint Pages | Compare `page=1&limit=5` with `page=2&limit=5` | Exactly 5 distinct IDs per page, 0 ID collisions | **PASS** |
| F21 | Edge Pagination: Out-of-bounds Page | `GET /api/properties?limit=10&page=999` | HTTP 200; `total: 27, results: 0, properties: []` | **PASS** |
| F22 | Sorting: Price Ascending | `GET /api/properties?sort=price&limit=5` | Monotonically ascending prices | **PASS** |
| F23 | Sorting: Price Descending | `GET /api/properties?sort=-price&limit=5` | Monotonically descending prices | **PASS** |
| F24 | Auth: Invalid Credentials Rejection | `POST /api/auth/login` with bad password | HTTP 401 Unauthorized (`Email ou mot de passe incorrect`) | **PASS** |
| F25 | Auth: Incomplete Payload Rejection | `POST /api/auth/login` without password | HTTP 422 Unprocessable Entity (Joi schema validation) | **PASS** |
| F26 | Auth: Protected Route Enforcement | `POST /api/properties` without bearer token | HTTP 401 Unauthorized (`Vous n'êtes pas connecté`) | **PASS** |
| F27 | Frontend: Homepage Route | `GET http://localhost:3000/` | HTTP 200 OK | **PASS** |
| F28 | Frontend: Properties Catalog Route | `GET http://localhost:3000/properties` | HTTP 200 OK | **PASS** |
| F29 | Frontend: Legacy Route Redirect | `GET http://localhost:3000/proprietes` | HTTP 307 Redirect to `/properties` | **PASS** |

---

### 2.2 Critical Defect Report: DEF-01 (Price Range Filtering)

#### Observation
When invoking `GET /api/properties?price[gte]=100000&price[lte]=500000&type=Location`, the backend responds:
```json
{
  "status": "success",
  "message": "Success",
  "data": {
    "total": 0,
    "results": 0,
    "properties": []
  }
}
```
Even though there are 4 active rental properties with prices 150 000, 180 000, 280 000, and 350 000 DZD inside MongoDB.

#### Logic Chain & Root Cause
1. In `backend/package.json`, Express is upgraded to version `^5.2.1`.
2. In Express 5, the default query parser setting is `'simple'` (backed by Node's core `querystring` module), whereas Express 4 defaulted to `'extended'` (backed by `qs`).
3. Core `querystring` does not parse bracketed parameters into nested objects:
   ```javascript
   querystring.parse('price[gte]=100000&price[lte]=500000')
   // Yields flat keys: { 'price[gte]': '100000', 'price[lte]': '500000' }
   ```
4. In `backend/src/utils/apiFeatures.js`:
   ```javascript
   let queryStr = JSON.stringify(queryObj);
   queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
   this.query = this.query.find(JSON.parse(queryStr));
   ```
   Because `queryObj` contains a flat key `'price[gte]'`, regex replacement produces:
   `{ "price[$gte]": "100000" }` rather than `{ price: { "$gte": 100000 } }`.
5. Mongoose executes `Property.find({ "price[$gte]": "100000" })`. MongoDB searches for a literal field named `price[$gte]`. Because this field does not exist on any document, zero documents are returned.

#### Blast Radius
Any user using the minimum or maximum price inputs on `http://localhost:3000/properties` receives an empty catalog (0 properties).

#### Recommended Mitigation
In `backend/app.js`, configure Express 5 to use the extended query parser:
```javascript
app.set('query parser', 'extended');
```
*(Verified empirically: the `qs` package is already installed in `backend/node_modules`, and with extended query parsing, Mongoose retrieves all 4 properties as expected).*

---

### 2.3 Content & Inventory QA (15 Imported Listings Fidelity)

All 15 imported properties were audited against source data in `.antigravity/laforet/OUEDKNISS_INVENTORY.csv` and MongoDB Atlas:

| Ouedkniss ID | Reference | Type | Category | Commune | Price (DZD) | Surface | Img Count | Fidelity Verdict |
|---|---|---|---|---|---|---|---|---|
| `58058031` | `LF-OK-58058031` | Vente | Villa | Bologhine | 210 000 000 | 1400 m² | 3 | **100% MATCH** |
| `57948210` | `LF-OK-57948210` | Vente | Appartement | Alger Centre | 165 000 000 | 275 m² | 3 | **100% MATCH** |
| `57812904` | `LF-OK-57812904` | Vente | Villa | El Biar | 650 000 000 | 872 m² | 3 | **100% MATCH** |
| `32402120` | `LF-OK-32402120` | Vente | Appartement | Mohammadia | 26 000 000 | 95 m² | 3 | **100% MATCH** |
| `57654190` | `LF-OK-57654190` | Vente | Terrain | Birkhadem | 250 000 000 | 638 m² | 2 | **100% MATCH** |
| `57541208` | `LF-OK-57541208` | Vente | Villa | El Mouradia | 380 000 000 | 450 m² | 3 | **100% MATCH** |
| `57498112` | `LF-OK-57498112` | Location | Appartement | Hydra | 350 000 | 160 m² | 3 | **100% MATCH** |
| `57389104` | `LF-OK-57389104` | Location | Appartement | Alger Centre | 180 000 | 130 m² | 3 | **100% MATCH** |
| `57291045` | `LF-OK-57291045` | Vente | Appartement | El Madania | 22 500 000 | 85 m² | 3 | **100% MATCH** |
| `57180234` | `LF-OK-57180234` | Vente | Appartement | Bab El Oued | 17 000 000 | 78 m² | 3 | **100% MATCH** |
| `57065912` | `LF-OK-57065912` | Vente | Appartement | Hussein Dey | 24 000 000 | 110 m² | 3 | **100% MATCH** |
| `56954318` | `LF-OK-56954318` | Vente | Local Commercial | El Achour | 48 000 000 | 120 m² | 3 | **100% MATCH** |
| `56843210` | `LF-OK-56843210` | Location | Villa | Hydra | 750 000 | 600 m² | 3 | **100% MATCH** |
| `56732109` | `LF-OK-56732109` | Location | Appartement | Alger Centre | 150 000 | 95 m² | 3 | **100% MATCH** |
| `56621098` | `LF-OK-56621098` | Location | Duplex | El Biar | 280 000 | 220 m² | 3 | **100% MATCH** |

#### Content Safeguards Audit
1. **0 Demands/Requests Imported:** Every listing is an authentic property offering for Vente or Location. Titles and descriptions were checked for keywords *"Cherche"*, *"Recherche"*, *"Demande"*, *"Échange"*, and *"Offre de service"*; 0 instances detected. The 8 search requests identified in Milestone 3 were completely excluded.
2. **Commune Normalization:** 100% of imported property communes strictly match the official 57 Algiers communes (Wilaya 16).
3. **Database Integrity & Deduplication:** 0 duplicate references, 0 duplicate slugs, and 0 duplicate Ouedkniss IDs exist in MongoDB Atlas.

---

### 2.4 Media & CDN QA (Live ImageKit Verification)

#### Property Media Probe
- **Total Imported Property Photos:** 44 images across 15 listings.
- **Probe Protocol:** Live HTTP HEAD/GET probes against `https://ik.imagekit.io/8jggj5dcd7/laforet_properties/*`.
- **Live Resolution Rate:** **44 / 44 images returned HTTP 200 OK** (100.0% resolution, 0 broken images).

#### Media Transformation & Payload Capping
Thumbnail transformation efficiency was empirically measured on live assets:

| Variant | Transformation String | Delivered Format | Delivered Size | Size Reduction vs Original |
|---|---|---|---|---|
| **Raw Stored Asset** | *(None)* | WebP | **134.6 KB** | Base (100%) |
| **Card Thumbnail** | `tr:w-600,h-400,c-maintain_ratio,f-auto,q-80` | WebP | **52.8 KB** | **-60.8%** |
| **Detail Thumbnail** | `tr:w-150,h-150,c-fill,f-auto,q-80` | WebP | **7.9 KB** | **-94.1%** |

#### Site Video & Banner Probe

| Asset Name | Source URL | HTTP Status | Content-Type | Size / Protocol Notes |
|---|---|---|---|---|
| **Hero Desktop Video** | `https://ik.imagekit.io/8jggj5dcd7/laforet_assets/hero_video.mp4` | **200 OK** | `video/mp4` | 37.5 MB, `Accept-Ranges: bytes`, `preload="metadata"` |
| **Hero Video Poster** | `https://ik.imagekit.io/8jggj5dcd7/laforet_assets/hero_video_poster.png` | **200 OK** | `image/jpeg` | Instant paint fallback; 0 layout shift |
| **Action Card 1** | `/luxury_house_buy.png` | **200 OK** | `image/png` | Next.js local optimized asset |
| **Action Card 2** | `https://images.unsplash.com/photo-1560185127-6ed189bf02f4...` | **200 OK** | `image/jpeg` | Responsive Next.js `<Image>` remote pattern |
| **Action Card 3** | `https://ik.imagekit.io/8jggj5dcd7/laforet_assets/advisor_vendre.webp` | **200 OK** | `image/webp` | 16.6 KB lightweight CDN asset |
| **Action Card 4** | `https://ik.imagekit.io/8jggj5dcd7/laforet_assets/agency_fallback.webp` | **200 OK** | `image/webp` | 60.0 KB high-res fallback |
| **Parallax Background** | `https://ik.imagekit.io/8jggj5dcd7/laforet_assets/parallax_expertise_bg.jpg` | **200 OK** | `image/jpeg` | Fixed parallax background with dark gradient |

---

### 2.5 Detail Page Slug Audit

All 15 imported property slugs were verified live via HTTP GET on both the backend API endpoint (`/api/properties/slug/:slug`) and the Next.js frontend route (`/properties/:slug`):

1. `vente-villa-de-maitre-872-m-avec-piscine-quartier-poirson-el-biar`: Backend 200 OK, Frontend 200 OK
2. `location-appartement-haut-standing-f4-meuble-hydra`: Backend 200 OK, Frontend 200 OK
3. `location-duplex-de-standing-f5-saint-raphael-el-biar`: Backend 200 OK, Frontend 200 OK
4. `vente-residence-de-maitre-1400-m-vue-mer-miramar`: Backend 200 OK, Frontend 200 OK
5. `vente-appartement-de-maitre-275-m-boulevard-zirout-youcef`: Backend 200 OK, Frontend 200 OK
6. `vente-grand-appartement-f3-residence-khalifati-la-vigerie`: Backend 200 OK, Frontend 200 OK
7. `vente-terrain-commercial-638-m-birkhadem-centre`: Backend 200 OK, Frontend 200 OK
8. `vente-villa-r2-quartier-residentiel-el-mouradia`: Backend 200 OK, Frontend 200 OK
9. `location-appartement-f4-renove-rue-didouche-mourad`: Backend 200 OK, Frontend 200 OK
10. `vente-appartement-f3-renove-vue-panoramique-el-madania`: Backend 200 OK, Frontend 200 OK
11. `vente-appartement-f3-front-de-mer-bab-el-oued`: Backend 200 OK, Frontend 200 OK
12. `vente-appartement-f4-spacieux-proche-metro-hussein-dey`: Backend 200 OK, Frontend 200 OK
13. `vente-local-commercial-120-m-axe-principal-el-achour`: Backend 200 OK, Frontend 200 OK
14. `location-villa-diplomatique-avec-piscine-val-dhydra`: Backend 200 OK, Frontend 200 OK
15. `location-appartement-f3-meuble-vue-mer-telemly-alger-centre`: Backend 200 OK, Frontend 200 OK

---

### 2.6 Security & Secret Leak Audit

An automated recursive scan across the repository was conducted to detect credential leaks:

| Potential Secret | Scope Scanned | Findings | Compliance Status |
|---|---|---|---|
| `IMAGEKIT_PRIVATE_KEY` | `frontend/`, `frontend/public/`, build output | **0 occurrences found** | **COMPLIANT (Clean)** |
| `ADMIN_PASSWORD` | Client bundles, documentation, commits | **0 occurrences found** | **COMPLIANT (Clean)** |
| `JWT_SECRET` | Client code, public API payloads | **0 occurrences found** | **COMPLIANT (Clean)** |
| Git History Commits | All branches, diffs, log history | Only `.env.example` placeholder strings committed | **COMPLIANT (Clean)** |
| Password Hashes in API | `GET /api/properties`, `/api/health` | `password` field strictly excluded (`select: false`) | **COMPLIANT (Clean)** |

---

### 2.7 Performance & Build Verification

- **Production Build:** Next.js `npm run build` completed cleanly with exit code 0 (`Compiled successfully in 6.9s`, 19/19 routes generated).
- **API Response Payload:** `GET /api/properties?limit=20` delivers a compact 32.1 KB JSON payload, with zero inline binary bloat or unconstrained arrays.
- **Stress Limit Query:** `GET /api/properties?limit=500` executes smoothly within 45ms, returning all 27 database documents (45.3 KB) without heap overflow or event-loop degradation.

---

## 3. QA Recommendations for Final Deployment

1. **Fix DEF-01 (Price Range Filtering):**
   Add `app.set('query parser', 'extended');` in `backend/app.js` to ensure Express 5 correctly parses nested bracket parameters into objects for `APIFeatures`.
2. **Production Deployment Check:**
   Ensure environment variables on Render and Vercel mirror the verified local configuration:
   - `IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/8jggj5dcd7`
   - `IMAGEKIT_PUBLIC_KEY` & `IMAGEKIT_PRIVATE_KEY` (server only)
   - `ADMIN_USERNAME` & `ADMIN_PASSWORD`

---

*Report certified by QA Challenger (Milestone 5).*
