# Media Architecture Report — Milestone 0
**Project:** La Foret Real Estate Platform  
**Agent:** Explorer 2 (Media Architecture Explorer)  
**Date:** 2026-10-08  
**Scope:** Full-stack investigation of Cloudinary integrations, frontend image/video components, media consumption diagnosis, and ImageKit migration readiness.

---

## 1. Executive Summary

This investigation provides an exhaustive audit of the media infrastructure of the La Foret Real Estate application across `backend/` and `frontend/`. 

### Key Findings:
1. **Total Cloudinary Footprint:** Exactly **18 unique Cloudinary assets** exist across the project:
   - **13 assets** stored in MongoDB Atlas across 12 property listings (`laforet_properties/...`).
   - **5 hardcoded assets** in frontend source code (1 hero MP4 video, 1 video poster JPG, 2 promotional action cards, 1 parallax background JPG).
2. **Current Integration Points:**
   - **Backend:** `cloudinary@^2.10.0` and `multer-storage-cloudinary@^4.0.0` are integrated in `upload.middleware.js`, `cloudinary.js`, and `property.controller.js`. Helmet CSP in `app.js` permits `https://res.cloudinary.com`.
   - **Frontend:** Remote patterns in `next.config.mjs` whitelist `res.cloudinary.com`. No Cloudinary SDK is installed on the frontend.
3. **Historical Consumption Root Causes:**
   - **Unconstrained Video with `preload="auto"`:** The homepage hero MP4 video (`Video_Project_5_nkmuyt.mp4`) is served raw without bitrate capping or mobile streaming variants, and browser preload is forced on every visit.
   - **The `getHighResUrl` Transformation Hack:** In `properties/[slug]/page.js`, a regex function rewrites all Cloudinary URLs to `/upload/q_auto:best/`. In Cloudinary's metering, dynamically requesting new transformation variants consumes transformation credits, and `q_auto:best` maximizes file size.
   - **Thumbnails Requesting Full Originals:** Property detail 72px thumbnail strips and admin 40–56px search/table thumbnails request full-resolution images.
   - **CSS `backgroundImage` Bypassing Optimization:** The "Notre Expertise" section uses an unconstrained Cloudinary JPEG in an inline `style={{ backgroundImage }}`, completely bypassing Next.js optimization.
4. **ImageKit Readiness:**
   - Next.js version is **16.2.10** with React **19.2.4**.
   - Server-side credentials (`IMAGEKIT_PUBLIC_KEY`, `IMAGEKIT_PRIVATE_KEY`, `IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/8jggj5dcd7`) are already present in `backend/.env`.
   - Client endpoint credentials (`NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY`, `NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT`) are already present in `frontend/.env.local`.
   - No ImageKit packages are currently installed in `package.json` for either backend or frontend.

---

## 2. Comprehensive Inventory of Cloudinary Integration Points

### 2.1 Backend Integrations

| Component / File | Nature of Integration | Specific Behavior & References |
|---|---|---|
| `backend/package.json` | Dependencies | `"cloudinary": "^2.10.0"`, `"multer-storage-cloudinary": "^4.0.0"` |
| `backend/src/config/cloudinary.js` | SDK Initialization | Calls `cloudinary.v2.config()` using `process.env.CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`. |
| `backend/src/middlewares/upload.middleware.js` | Storage Engine | Configures `new CloudinaryStorage` for Multer with `folder: 'laforet_properties'`, `allowed_formats: ['jpg', 'jpeg', 'png', 'webp']`, and incoming transformation `[{ width: 1200, crop: 'limit' }]`. |
| `backend/src/routes/property.routes.js` | Route Attachment | Attaches `upload.array('images', 10)` to `POST /api/properties` and `PATCH /api/properties/:id`. |
| `backend/src/controllers/property.controller.js` | Upload & Deletion | • In `createProperty` (lines 81–95): maps `req.files` to `req.body.media = { images: [{ url: file.path, publicId: file.filename }], coverImage: { url, publicId } }`<br>• In `updateProperty` (lines 145–170): calls `cloudinary.uploader.destroy(publicId)` for each ID in `deletedImages`.<br>• In `deleteProperty` (lines 203–218): loops through `property.media.images` and calls `cloudinary.uploader.destroy(image.publicId)`. |
| `backend/app.js` | Security Header (CSP) | Line 26: Helmet CSP configures `imgSrc: ["'self'", 'data:', 'https://res.cloudinary.com']`. Note: `mediaSrc` is not explicitly declared for video. |
| `backend/.env` | Secret Storage | Contains `CLOUDINARY_CLOUD_NAME=zt28qj9l`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`. |
| `render.yaml` | Deployment Spec | Passes `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` to Render web service. |

### 2.2 Database Schema & Live Records

**Database Model:** `backend/src/models/property.model.js`  
**Media Sub-Schema:**
```javascript
media: {
  images: [{
    url: { type: String, required: true },
    publicId: { type: String, required: true }
  }],
  coverImage: {
    url: { type: String },
    publicId: { type: String }
  },
  virtualTourUrl: { type: String },
  videoUrl: { type: String }
}
```

**Live MongoDB Database Audit (Verified via Atlas connection):**
- Total Property Records: **12**
- Total Property Images: **13** (Property 1 has 2 photos; properties 2–12 have 1 photo each).
- All 13 images are stored in Cloudinary under the `laforet_properties/` folder in cloud `zt28qj9l`:

| # | Reference | Title | Cloudinary Public ID | Stored Cloudinary URL |
|---|---|---|---|---|
| 1 | `villa` | villa a alger | `laforet_properties/fjudyrta5bwvmvqtrauv` | `https://res.cloudinary.com/zt28qj9l/image/upload/v1784128157/laforet_properties/fjudyrta5bwvmvqtrauv.jpg` |
| 1b | `villa` | (2nd image) | `laforet_properties/wrgsxxke7iryvgqcfjh3` | `https://res.cloudinary.com/zt28qj9l/image/upload/v1784128156/laforet_properties/wrgsxxke7iryvgqcfjh3.jpg` |
| 2 | `maison de metre` | maison de metre a el biar | `laforet_properties/acwvxzw7u7qyuyatx38s` | `https://res.cloudinary.com/zt28qj9l/image/upload/v1784949574/laforet_properties/acwvxzw7u7qyuyatx38s.jpg` |
| 3 | `sdfkbjn` | appartement a delybrahim | `laforet_properties/hftb4l2hdkc1cnadek45` | `https://res.cloudinary.com/zt28qj9l/image/upload/v1784952346/laforet_properties/hftb4l2hdkc1cnadek45.jpg` |
| 4 | `villa sidi yahya` | villa a sidi yahya | `laforet_properties/izqpylvqlheip9cobwyz` | `https://res.cloudinary.com/zt28qj9l/image/upload/v1784953110/laforet_properties/izqpylvqlheip9cobwyz.jpg` |
| 5 | `villa-1` | villa a birkhadem | `laforet_properties/a5dyeugcf3gzhfpwjtqz` | `https://res.cloudinary.com/zt28qj9l/image/upload/v1784957373/laforet_properties/a5dyeugcf3gzhfpwjtqz.jpg` |
| 6 | `apprtmn 1` | appartement a draria | `laforet_properties/bpqsvustybf48paymojb` | `https://res.cloudinary.com/zt28qj9l/image/upload/v1784957444/laforet_properties/bpqsvustybf48paymojb.jpg` |
| 7 | `dely 2` | appartement a dely brahim | `laforet_properties/fxynqhobrao7sdatlowk` | `https://res.cloudinary.com/zt28qj9l/image/upload/v1784966806/laforet_properties/fxynqhobrao7sdatlowk.jpg` |
| 8 | `sou1` | appartement a souidania | `laforet_properties/ahj0fvcifg7kaqmbfksk` | `https://res.cloudinary.com/zt28qj9l/image/upload/v1784966887/laforet_properties/ahj0fvcifg7kaqmbfksk.jpg` |
| 9 | `hg5` | appartement de luxe | `laforet_properties/jbl2cv0q83i4sxkpn2up` | `https://res.cloudinary.com/zt28qj9l/image/upload/v1784966962/laforet_properties/jbl2cv0q83i4sxkpn2up.jpg` |
| 10 | `rgh6` | appartement a reghaia | `laforet_properties/gtqlr3bi1dhzwqbcihy7` | `https://res.cloudinary.com/zt28qj9l/image/upload/v1784969333/laforet_properties/gtqlr3bi1dhzwqbcihy7.jpg` |
| 11 | `aprtmd5` | appartement moderne | `laforet_properties/rqfdoly82fljjlb2wy3r` | `https://res.cloudinary.com/zt28qj9l/image/upload/v1784969409/laforet_properties/rqfdoly82fljjlb2wy3r.jpg` |
| 12 | `bn4` | appartement a benaknoun | `laforet_properties/hdyi1iiavab5hwztusfm` | `https://res.cloudinary.com/zt28qj9l/image/upload/v1784969473/laforet_properties/hdyi1iiavab5hwztusfm.jpg` |

*Note:* Checked other database collections (`Admin`, `Lead`, `Testimonial`). None of them contain image fields or Cloudinary references.

### 2.3 Hardcoded Cloudinary Assets in Frontend Source Code

| # | Usage Context | Public ID | Hardcoded URL | File & Line |
|---|---|---|---|---|
| 14 | Homepage Hero Video | `Video_Project_5_nkmuyt` | `https://res.cloudinary.com/zt28qj9l/video/upload/v1784947742/Video_Project_5_nkmuyt.mp4` | `frontend/app/(public)/HomeClient.jsx:122` |
| 15 | Homepage Hero Poster | `Video_Project_5_nkmuyt` | `https://res.cloudinary.com/zt28qj9l/video/upload/v1784947742/Video_Project_5_nkmuyt.jpg` | `frontend/app/(public)/HomeClient.jsx:118` |
| 16 | Action Card "Vendre" | `stock-photo-real-estate-agent..._qyjsni` | `https://res.cloudinary.com/zt28qj9l/image/upload/v1784965315/stock-photo-real-estate-agent-insurance-sales-representative-young-asian-businessman-handing_qyjsni.webp` | `frontend/app/(public)/HomeClient.jsx:226` |
| 17 | Action Card "Mettre en location" & Admin Fallback | `make_picture_high_definition_res..._msbqp4` | `https://res.cloudinary.com/zt28qj9l/image/upload/v1784965809/make_picture_high_definition_res__202607250849_msbqp4.jpg` | `frontend/app/(public)/HomeClient.jsx:241`<br>`dashboard/page.js:12`<br>`properties/page.js:9`<br>`leads/page.js:10`<br>`AdminHeader.jsx:12` |
| 18 | Section "Notre Expertise" Parallax Background | `recreate_picture_high_quality_de..._tmgxak` | `https://res.cloudinary.com/zt28qj9l/image/upload/v1785037176/recreate_picture_high_quality_de__202607260438_tmgxak.jpg` | `frontend/app/(public)/HomeClient.jsx:408` |

---

## 3. Frontend Image & Video Component Architecture

### 3.1 Detailed Component Specifications Matrix

| Component | File & Lines | Render Element | Dimensions / Container | Aspect Ratio | `sizes` Attribute | Loading Mode (`priority` / lazy) | Transformation / Processing |
|---|---|---|---|---|---|---|---|
| **Hero Video** | `HomeClient.jsx:112-123` | `<video>` | `h-[65vh] sm:h-[75vh] md:h-[85vh]` min `420px-600px` | Full container cover | N/A | `preload="auto"`, `autoPlay` | None. Raw MP4 streaming directly from Cloudinary. |
| **Hero Video Poster** | `HomeClient.jsx:118` | `poster` attr | Matches video container | Video aspect | N/A | Preloaded with video | Auto-extracted video frame without dimension/quality bounds. |
| **Quick Action 1 (Acheter)** | `HomeClient.jsx:195-200` | `<Image>` | 50vw mobile, flex desktop (`h-auto md:h-[500px] lg:h-[600px]`) | `aspect-square md:aspect-auto` | **MISSING** (defaults to 100vw) | Lazy (default) | Local file `/luxury_house_buy.png` (967 KB). |
| **Quick Action 2 (Louer)** | `HomeClient.jsx:210-215` | `<Image>` | 50vw mobile, flex desktop | `aspect-square md:aspect-auto` | **MISSING** (defaults to 100vw) | Lazy (default) | Unsplash image URL with query params `q=80&w=1170`. |
| **Quick Action 3 (Vendre)** | `HomeClient.jsx:225-230` | `<Image>` | 50vw mobile, flex desktop | `aspect-square md:aspect-auto` | **MISSING** (defaults to 100vw) | Lazy (default) | Cloudinary WebP (`..._qyjsni.webp`). |
| **Quick Action 4 (Location)** | `HomeClient.jsx:240-245` | `<Image>` | 50vw mobile, flex desktop | `aspect-square md:aspect-auto` | **MISSING** (defaults to 100vw) | Lazy (default) | Cloudinary JPEG (`..._msbqp4.jpg`). |
| **Parallax Background** | `HomeClient.jsx:406-413` | `<div>` inline style | Full section width & height (`py-16 md:py-28`) | Fixed cover | N/A (CSS background) | Eager (browser CSS fetch) | Cloudinary raw JPEG via `backgroundImage`. Next.js optimization bypassed. |
| **Property Card** | `PropertyCard.jsx:19-25` | `<Image>` | `h-[280px] sm:h-[420px]`, width 50vw (mobile 2-col) or 33vw (desktop 3-col) | Approx 3:4 portrait | `(max-width: 640px) 50vw, (max-width: 1200px) 50vw, 33vw` | Lazy (default) | Next.js server optimization pulling full original from Cloudinary. |
| **Detail Main Hero** | `properties/[slug]/page.js:365` | `<Image>` | `h-[45vh] min-[380px] lg:h-[500px]` | Approx 16:9 / 4:3 | `100vw` | Lazy (`quality={95}`) | Wrapped in `getHighResUrl()` forcing `/upload/q_auto:best/`. |
| **Detail Thumbnail Strip** | `properties/[slug]/page.js:433` | `<Image>` | `w-[72px] h-[48px]` | 3:2 | `72px` | Lazy | Wrapped in `getHighResUrl()` forcing `/upload/q_auto:best/` on tiny 72px buttons! |
| **Detail Photo Grid** | `properties/[slug]/page.js:690` | `<Image>` | `h-64` (3-col desktop, 2-col sm, 1-col mobile) | Approx 4:3 | `(max-width: 768px) 100vw, 33vw` | Lazy | Wrapped in `getHighResUrl()` forcing `/upload/q_auto:best/` for every photo. |
| **Detail Fullscreen Lightbox** | `properties/[slug]/page.js:258` | `<Image>` | `max-h-[75vh] w-full` | Unconstrained contain | `100vw` | `priority` (`quality={100}`) | Wrapped in `getHighResUrl()` forcing `/upload/q_auto:best/`. |
| **Detail Lightbox Strip** | `properties/[slug]/page.js:301` | `<Image>` | `w-16 h-12` (64x48px) | 4:3 | `64px` | Lazy | Wrapped in `getHighResUrl()` forcing `/upload/q_auto:best/` on 64px thumbnails! |
| **Admin ImageUploader Previews** | `ImageUploader.jsx:116` | `<Image>` | `aspect-square` grid | 1:1 square | `(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw` | Lazy | Cloudinary stored original URL rendered directly. |
| **Admin Dashboard Recents** | `dashboard/page.js:253` | `<Image>` | `w-12 h-12` (48x48px) | 1:1 square | `48px` | Lazy | Full cover image URL rendered into 48px box. |
| **Admin Properties Table** | `properties/page.js:157` | `<Image>` | `w-14 h-14` (56x56px) | 1:1 square | `56px` | Lazy | Full cover image URL rendered into 56px box. |
| **Admin Leads Attachment** | `leads/page.js:294` | `<Image>` | `w-28 h-28 sm:w-32 sm:h-28` | Approx 1:1 / 4:3 | `128px` | Lazy | Full cover image URL rendered into 128px card. |
| **Admin Header Search Result** | `AdminHeader.jsx:242` | `<Image>` | `w-10 h-10` (40x40px) | 1:1 square | `40px` | Lazy | Full cover image URL rendered into 40px icon. |

---

## 4. Forensic Diagnosis of Historical Cloudinary Consumption

The client reported that their Cloudinary plan allowance was exhausted rapidly despite minimal public site visitors. Our forensic inspection reveals that **multiple compounding architectural flaws** caused this rapid burn:

### 1. Hero Video Bandwidth Leakage with `preload="auto"`
- **The Culprit:** `frontend/app/(public)/HomeClient.jsx:117`
- **Code:** `<video autoPlay loop muted playsInline preload="auto" poster="...">`
- **Mechanism:**
  - `preload="auto"` forces browsers, dev preview tabs, and automated crawlers to immediately buffer and download the full video file.
  - The video URL (`Video_Project_5_nkmuyt.mp4`) has **no transformation parameters** (no bitrate constraints `br_1500k`, no resolution cap `w_1280`, no modern codec negotiation `vc_auto`).
  - High-definition video files can easily weigh 15–50 MB. Just 20–50 visits or preview reloads can consume 1–2 GB of bandwidth.
  - Mobile devices also load this identical heavy desktop MP4 because there is no mobile-specific video source or `media` query.

### 2. The `getHighResUrl()` Cloudinary Transformation Multiplier
- **The Culprit:** `frontend/app/(public)/properties/[slug]/page.js:54-62`
- **Code:**
  ```javascript
  function getHighResUrl(url) {
    if (!url) return '';
    if (typeof url !== 'string') return '';
    if (url.includes('cloudinary.com') && url.includes('/upload/')) {
      return url.replace(/\/upload\/(?:w_\d+,?|h_\d+,?|c_[a-z]+,?|q_[a-z0-9]+,?)*\//i, '/upload/q_auto:best/');
    }
    return url;
  }
  ```
- **Mechanism:**
  - Cloudinary meters accounts based on three primary resources: **Transformations**, **Bandwidth**, and **Storage**.
  - Whenever a new URL transformation pattern is created, Cloudinary charges a **transformation credit** to compute and cache that derivative.
  - This function strips any width/height upload limits (like the `w_1200` set by `multer-storage-cloudinary`) and replaces them with `/upload/q_auto:best/`.
  - Every time an asset is requested with `q_auto:best`, Cloudinary delivers the image at the highest possible quality setting (least compression, enormous byte size).

### 3. Thumbnail Strips Requesting Full-Resolution Originals
- **The Culprit:** Detail page carousel (`page.js:434`), Lightbox thumbnail strip (`page.js:302`), and Admin tables (`dashboard`, `properties`, `leads`, `AdminHeader`).
- **Mechanism:**
  - In `page.js:434`:
    `<Image src={getHighResUrl(img.url)} alt={'Vignette ' + (idx + 1)} fill sizes="72px" />`
  - For a property listing with 15 images, visiting that single property detail page generates:
    - 1 hero image request with `getHighResUrl`
    - 15 thumbnail requests with `getHighResUrl`
    - 15 gallery grid requests with `getHighResUrl`
    - 15 lightbox thumbnail requests with `getHighResUrl`
  - Instead of requesting a 72px thumbnail transformation (`w_72,h_48,c_thumb`), it requests the full `q_auto:best` original image for all 15 images 4 times over!

### 4. CSS `backgroundImage` Bypassing Next.js Image Optimization
- **The Culprit:** `HomeClient.jsx:408`
- **Code:**
  `style={{ backgroundImage: "url('https://res.cloudinary.com/zt28qj9l/image/upload/v1785037176/recreate_picture_high_quality_de__202607260438_tmgxak.jpg')" }}`
- **Mechanism:**
  - Next.js can only optimize images rendered through `<Image>`.
  - CSS background images bypass Next.js entirely; every browser visiting the homepage fetches the raw Cloudinary JPEG directly from Cloudinary's servers without compression or modern format (AVIF/WebP) conversion.

### 5. Next.js Origin Pulls During Local Development
- **Mechanism:**
  - In Next.js, remote images served through `/_next/image` are fetched from the remote source and cached on disk.
  - In development mode (`next dev`), image caches are frequently invalidated or stored ephemerally.
  - Every developer test run, page refresh, and fast-refresh recompilation causes the Next.js dev server to re-fetch original images directly from Cloudinary, consuming bandwidth and generating repeated origin pulls.

---

## 5. ImageKit Readiness & Architectural Strategy

### 5.1 Environment Configuration Audit
Both frontend and backend already have the necessary ImageKit environment variables defined:
- **Backend (`backend/.env`):**
  - `IMAGEKIT_PUBLIC_KEY=public_XQHI/7k2SGl6jkmLKglMuAmjtKA=`
  - `IMAGEKIT_PRIVATE_KEY=private_6QnK3ZLvVg1JHF1Y17+1eixlaSg=`
  - `IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/8jggj5dcd7`
- **Frontend (`frontend/.env.local`):**
  - `NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=public_XQHI/7k2SGl6jkmLKglMuAmjtKA=`
  - `NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/8jggj5dcd7`

### 5.2 Next.js Version & Package Compatibility
- **Installed Framework:** `Next.js 16.2.10`, `React 19.2.4`.
- **Package Status:**
  - Neither `@imagekit/next` nor `imagekit` is currently installed.
- **Evaluation of `@imagekit/next` vs Custom Next.js Image Loader:**
  - **Option A: `@imagekit/next`**
    - Pros: Official package; provides `<IKImage>` and provider wrapper.
    - Risk: Next.js 16 with React 19 is bleeding-edge. Third-party UI wrapper packages often encounter peer dependency warnings or React 19 server/client boundary conflicts.
  - **Option B: Dedicated ImageKit Next.js Custom Loader (`lib/imagekitLoader.js`)**
    - Pros: Uses standard Next.js `<Image loader={imagekitLoader}>` or global `loaderFile` in `next.config.mjs`.
    - Zero peer dependency issues with Next.js 16 or React 19.
    - Directly constructs ImageKit CDN transformation URLs (`https://ik.imagekit.io/8jggj5dcd7/tr:w-{width},q-{quality},f-auto/{path}`).
    - **Crucial Benefit:** By using a custom loader, Next.js server **does not act as an image proxy**. Images are delivered directly from ImageKit's global CDN to the user's browser, eliminating CPU load and double-bandwidth transfer on Vercel/Render!
  - **Recommendation:** Implement a central ImageKit URL utility & custom loader for Next.js `<Image>`, with `@imagekit/next` evaluated if strict component abstraction is desired.

### 5.3 Backend Upload Architecture Strategy
- **Current Flow:**
  `Admin UI -> FormData -> POST /api/properties (multer + multer-storage-cloudinary) -> Cloudinary`
- **Proposed ImageKit Backend Flow:**
  1. Install `imagekit` in `backend/package.json`.
  2. Implement `backend/src/config/imagekit.js` initializing ImageKit SDK with `IMAGEKIT_PUBLIC_KEY`, `IMAGEKIT_PRIVATE_KEY`, and `IMAGEKIT_URL_ENDPOINT`.
  3. Create an authentication signature endpoint: `GET /api/media/auth` returning `{ token, expire, signature }` for secure operations.
  4. Replace `multer-storage-cloudinary` with `multer.memoryStorage()`.
  5. In `upload.middleware.js` or `property.controller.js`, upload buffer streams directly to ImageKit via `imagekit.upload({ file: buffer, fileName, folder: '/laforet_properties' })`.
  6. Return `{ url: result.url, publicId: result.fileId }` matching the existing Mongoose schema structure.
  7. In `updateProperty` and `deleteProperty`, replace `cloudinary.uploader.destroy(publicId)` with `imagekit.deleteFile(fileId)`.
  8. Update `backend/app.js` Helmet CSP to allow `https://ik.imagekit.io` in `imgSrc` and `mediaSrc`.
  9. Update `frontend/next.config.mjs` to whitelist `hostname: 'ik.imagekit.io'`.

---

## 6. Target Media Optimization Policy (Roadmap for Milestone 1 & 2)

| Media Type | Target Delivered Resolution | Transformation Parameters | Loading Strategy |
|---|---|---|---|
| **Property Card Thumbnails** | Max 600px width | `tr:w-600,h-800,c-at_least,q-80,f-auto` | Lazy loading (below fold) |
| **Catalog Grid Images** | Max 600px width | `tr:w-600,h-800,c-at_least,q-80,f-auto` | Lazy loading (below fold) |
| **Property Detail Hero** | Max 1600px width (desktop), 800px (mobile) | `tr:w-1600,q-85,f-auto` | `priority={false}` (optimized WebP/AVIF) |
| **Gallery Thumbnail Strip** | Exactly 120px width | `tr:w-120,h-80,c-maintain_ratio,q-75,f-auto` | Lazy |
| **Fullscreen Lightbox** | Max 2000px width | `tr:w-2000,q-85,f-auto` | Loaded on demand when opened |
| **Admin Table/Search Thumbnails** | Exactly 80px width | `tr:w-80,h-80,c-at_least,q-75,f-auto` | Lazy |
| **Home Hero Video** | 1080p desktop, 720p mobile | Compressed MP4/WebM with bitrate target ~1.5 Mbps | `preload="metadata"` (replace `preload="auto"`), separate mobile source `<source media="(max-width: 640px)">` |
| **Home Hero Poster** | Max 1920px width | `tr:w-1920,q-80,f-auto` | Poster fallback |
| **Parallax Background** | Max 1920px width | `tr:w-1920,q-80,f-auto` (via `<Image>` with absolute fill rather than raw CSS `backgroundImage`) | Modern format, optimized delivery |

---

## 7. Media Manifest Seed (Current 18 Assets to Migrate)

```json
{
  "properties": [
    {
      "reference": "villa",
      "old_cloudinary_url": "https://res.cloudinary.com/zt28qj9l/image/upload/v1784128157/laforet_properties/fjudyrta5bwvmvqtrauv.jpg",
      "public_id": "laforet_properties/fjudyrta5bwvmvqtrauv",
      "type": "property_image"
    },
    {
      "reference": "villa",
      "old_cloudinary_url": "https://res.cloudinary.com/zt28qj9l/image/upload/v1784128156/laforet_properties/wrgsxxke7iryvgqcfjh3.jpg",
      "public_id": "laforet_properties/wrgsxxke7iryvgqcfjh3",
      "type": "property_image"
    },
    {
      "reference": "maison de metre",
      "old_cloudinary_url": "https://res.cloudinary.com/zt28qj9l/image/upload/v1784949574/laforet_properties/acwvxzw7u7qyuyatx38s.jpg",
      "public_id": "laforet_properties/acwvxzw7u7qyuyatx38s",
      "type": "property_image"
    },
    {
      "reference": "sdfkbjn",
      "old_cloudinary_url": "https://res.cloudinary.com/zt28qj9l/image/upload/v1784952346/laforet_properties/hftb4l2hdkc1cnadek45.jpg",
      "public_id": "laforet_properties/hftb4l2hdkc1cnadek45",
      "type": "property_image"
    },
    {
      "reference": "villa sidi yahya",
      "old_cloudinary_url": "https://res.cloudinary.com/zt28qj9l/image/upload/v1784953110/laforet_properties/izqpylvqlheip9cobwyz.jpg",
      "public_id": "laforet_properties/izqpylvqlheip9cobwyz",
      "type": "property_image"
    },
    {
      "reference": "villa-1",
      "old_cloudinary_url": "https://res.cloudinary.com/zt28qj9l/image/upload/v1784957373/laforet_properties/a5dyeugcf3gzhfpwjtqz.jpg",
      "public_id": "laforet_properties/a5dyeugcf3gzhfpwjtqz",
      "type": "property_image"
    },
    {
      "reference": "apprtmn 1",
      "old_cloudinary_url": "https://res.cloudinary.com/zt28qj9l/image/upload/v1784957444/laforet_properties/bpqsvustybf48paymojb.jpg",
      "public_id": "laforet_properties/bpqsvustybf48paymojb",
      "type": "property_image"
    },
    {
      "reference": "dely 2",
      "old_cloudinary_url": "https://res.cloudinary.com/zt28qj9l/image/upload/v1784966806/laforet_properties/fxynqhobrao7sdatlowk.jpg",
      "public_id": "laforet_properties/fxynqhobrao7sdatlowk",
      "type": "property_image"
    },
    {
      "reference": "sou1",
      "old_cloudinary_url": "https://res.cloudinary.com/zt28qj9l/image/upload/v1784966887/laforet_properties/ahj0fvcifg7kaqmbfksk.jpg",
      "public_id": "laforet_properties/ahj0fvcifg7kaqmbfksk",
      "type": "property_image"
    },
    {
      "reference": "hg5",
      "old_cloudinary_url": "https://res.cloudinary.com/zt28qj9l/image/upload/v1784966962/laforet_properties/jbl2cv0q83i4sxkpn2up.jpg",
      "public_id": "laforet_properties/jbl2cv0q83i4sxkpn2up",
      "type": "property_image"
    },
    {
      "reference": "rgh6",
      "old_cloudinary_url": "https://res.cloudinary.com/zt28qj9l/image/upload/v1784969333/laforet_properties/gtqlr3bi1dhzwqbcihy7.jpg",
      "public_id": "laforet_properties/gtqlr3bi1dhzwqbcihy7",
      "type": "property_image"
    },
    {
      "reference": "aprtmd5",
      "old_cloudinary_url": "https://res.cloudinary.com/zt28qj9l/image/upload/v1784969409/laforet_properties/rqfdoly82fljjlb2wy3r.jpg",
      "public_id": "laforet_properties/rqfdoly82fljjlb2wy3r",
      "type": "property_image"
    },
    {
      "reference": "bn4",
      "old_cloudinary_url": "https://res.cloudinary.com/zt28qj9l/image/upload/v1784969473/laforet_properties/hdyi1iiavab5hwztusfm.jpg",
      "public_id": "laforet_properties/hdyi1iiavab5hwztusfm",
      "type": "property_image"
    }
  ],
  "static_assets": [
    {
      "name": "hero_video",
      "old_cloudinary_url": "https://res.cloudinary.com/zt28qj9l/video/upload/v1784947742/Video_Project_5_nkmuyt.mp4",
      "public_id": "Video_Project_5_nkmuyt",
      "type": "video"
    },
    {
      "name": "hero_video_poster",
      "old_cloudinary_url": "https://res.cloudinary.com/zt28qj9l/video/upload/v1784947742/Video_Project_5_nkmuyt.jpg",
      "public_id": "Video_Project_5_nkmuyt",
      "type": "image"
    },
    {
      "name": "banner_vendre",
      "old_cloudinary_url": "https://res.cloudinary.com/zt28qj9l/image/upload/v1784965315/stock-photo-real-estate-agent-insurance-sales-representative-young-asian-businessman-handing_qyjsni.webp",
      "public_id": "stock-photo-real-estate-agent-insurance-sales-representative-young-asian-businessman-handing_qyjsni",
      "type": "image"
    },
    {
      "name": "banner_location_default_property",
      "old_cloudinary_url": "https://res.cloudinary.com/zt28qj9l/image/upload/v1784965809/make_picture_high_definition_res__202607250849_msbqp4.jpg",
      "public_id": "make_picture_high_definition_res__202607250849_msbqp4",
      "type": "image"
    },
    {
      "name": "parallax_expertise_bg",
      "old_cloudinary_url": "https://res.cloudinary.com/zt28qj9l/image/upload/v1785037176/recreate_picture_high_quality_de__202607260438_tmgxak.jpg",
      "public_id": "recreate_picture_high_quality_de__202607260438_tmgxak",
      "type": "image"
    }
  ]
}
```
