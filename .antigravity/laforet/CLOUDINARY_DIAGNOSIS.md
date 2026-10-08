# CLOUDINARY CONSUMPTION DIAGNOSIS & ROOT CAUSE ANALYSIS

> **Project**: La Forêt Real Estate  
> **Status**: DIAGNOSIS COMPLETED & VERIFIED  
> **Target Artifact**: `.antigravity/laforet/CLOUDINARY_DIAGNOSIS.md`  
> **Date**: 2026-10-08  

---

## 1. Executive Summary

An investigation was conducted into the historical Cloudinary resource consumption that led to rapid allowance exhaustion despite low public web traffic. 

The investigation revealed that consumption was **not driven by legitimate organic visitor volume**, but by an architectural combination of:
1. **Unconstrained Video Delivery with Auto-Preload**: The homepage hero video loaded a full multi-megabyte unconstrained MP4 master with `preload="auto"`, downloaded in its entirety on every test reload, preview, and crawler visit.
2. **Dynamic Transformation Multiplication via URL Rewriting (`getHighResUrl`)**: A frontend helper dynamically rewrote Cloudinary URLs to `/upload/q_auto:best/`, stripping bounding parameters and forcing Cloudinary to generate dynamic transformations on-the-fly at maximum bit depth.
3. **Thumbnail Multiplication on Property Detail Pages**: 64px and 72px thumbnail carousels invoked `getHighResUrl`, requesting full-resolution `q_auto:best` transformations for every gallery slide.
4. **Eager Upload Transformation Generation**: `multer-storage-cloudinary` generated an automatic eager transformation `[{ width: 1200, crop: 'limit' }]` on every upload.
5. **CSS Background Origin Bypasses**: Inline CSS background images bypassed Next.js optimization and CDN caching, fetching raw Cloudinary assets directly.

---

## 2. Detailed Root Cause Analysis with Concrete Evidence

### Root Cause 1: Hero Video Delivery & Preload Policy
- **Location**: `frontend/app/(public)/HomeClient.jsx:112-123`
- **Code**:
  ```jsx
  <video
    ref={videoRef}
    autoPlay
    loop
    muted
    playsInline
    preload="auto"
    poster="https://res.cloudinary.com/zt28qj9l/video/upload/v1784947742/Video_Project_5_nkmuyt.jpg"
    className="w-full h-full object-cover"
  >
    <source
      src="https://res.cloudinary.com/zt28qj9l/video/upload/v1784947742/Video_Project_5_nkmuyt.mp4"
      type="video/mp4"
    />
  </video>
  ```
- **Mechanism**:
  - The URL has **no transformation parameters** (no bitrate cap, no width bound, no codec optimization: e.g. `w_1280,vc_auto,br_1500k`).
  - `preload="auto"` instructs the browser to aggressively download the entire video resource immediately upon DOM parsing, even before user scrolling or interaction.
  - Video bandwidth on Cloudinary consumes credits rapidly (1 credit = 1 GB bandwidth or 1,000 transformations). Every developer reload, headless crawl, or dev server restart consumed several megabytes of bandwidth.

### Root Cause 2: Forced Dynamic Transformations & Byte Bloat (`getHighResUrl`)
- **Location**: `frontend/app/(public)/properties/[slug]/page.js:54-62`
- **Code**:
  ```javascript
  function getHighResUrl(url) {
    if (!url) return '';
    if (typeof url !== 'string') return '';
    if (url.includes('cloudinary.com') && url.includes('/upload/')) {
      return url.replace(
        /\/upload\/(?:w_\d+,?|h_\d+,?|c_[a-z]+,?|q_[a-z0-9]+,?)*\//i,
        '/upload/q_auto:best/'
      );
    }
    return url;
  }
  ```
- **Mechanism**:
  - Whenever an image URL contained bounding parameters (such as the 1200px upload limit), `getHighResUrl` stripped them and replaced the path with `/upload/q_auto:best/`.
  - Cloudinary charges 1 transformation credit every time a new transformation permutation is evaluated.
  - `q_auto:best` instructs Cloudinary to optimize for maximum visual fidelity with minimal compression, producing image payloads up to 3-5x larger in file size compared to `q_auto:good` or `q_auto:eco`.

### Root Cause 3: Thumbnail Gallery Transformation Proliferation
- **Location**: `frontend/app/(public)/properties/[slug]/page.js:434` and `line 302`
- **Evidence**:
  - The thumbnail strip button uses `<Image src={getHighResUrl(img.url)} fill sizes="72px" />`.
  - The lightbox strip uses `<Image src={getHighResUrl(img.url)} fill sizes="64px" />`.
  - Instead of requesting a dedicated micro-thumbnail (e.g. `w_150,h_150,c_fill`), each thumbnail element requested the full unconstrained `q_auto:best` asset, forcing dozens of simultaneous heavy image deliveries on a single property view.

### Root Cause 4: Eager Upload Transformation in Backend Middleware
- **Location**: `backend/src/middlewares/upload.middleware.js:5-12`
- **Code**:
  ```javascript
  const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'laforet_properties',
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
      transformation: [{ width: 1200, crop: 'limit' }],
    },
  });
  ```
- **Mechanism**:
  - For every image uploaded through the admin form, Cloudinary stored the original and eagerly computed an eager derivative (`w_1200,c_limit`), consuming transformation credits upon ingestion.
  - Coupled with `getHighResUrl` stripping `w_1200` on the frontend, each asset was transformed twice: once on upload, and once on first frontend request.

### Root Cause 5: Unoptimized CSS Background Images & Missing Image Sizes
- **Location**: `frontend/app/(public)/HomeClient.jsx:408`
- **Evidence**:
  - `style={{ backgroundImage: "url('https://res.cloudinary.com/zt28qj9l/image/upload/v1785037176/recreate_picture_high_quality_de__202607260438_tmgxak.jpg')" }}`
  - Completely bypasses Next.js image optimization, requesting the full uncompressed JPEG directly from Cloudinary on every visit.
  - In `HomeClient.jsx:226, 241`, `<Image fill>` tags lacked the `sizes` property, causing the browser to assume `100vw` layout width and request desktop-sized variants on mobile devices.

---

## 3. Inventory of Cloudinary Assets Subject to Migration

Exactly **18 Cloudinary assets** were identified across the project:
- **13 Database Property Images** (in MongoDB Atlas across 12 properties under folder `laforet_properties/`).
- **5 Frontend Static / Hardcoded Assets**:
  1. Hero Video Poster: `https://res.cloudinary.com/zt28qj9l/video/upload/v1784947742/Video_Project_5_nkmuyt.jpg`
  2. Hero Video MP4: `https://res.cloudinary.com/zt28qj9l/video/upload/v1784947742/Video_Project_5_nkmuyt.mp4`
  3. Real Estate Advisor Photo: `https://res.cloudinary.com/zt28qj9l/image/upload/v1784965315/stock-photo-real-estate-agent-in-an-empty-apartment-202603120613_qyjsni.webp`
  4. Agency Highlight / Default Fallback Photo: `https://res.cloudinary.com/zt28qj9l/image/upload/v1784965809/make_picture_high_definition_res__202607250849_msbqp4.jpg`
  5. Footer Banner Background: `https://res.cloudinary.com/zt28qj9l/image/upload/v1785037176/recreate_picture_high_quality_de__202607260438_tmgxak.jpg`

---

## 4. Prevention Strategy in ImageKit Migration (Milestone 1 & 2)

To guarantee that ImageKit usage remains minimal and predictable:
1. **Dimension Caps**: Enforce maximum delivered bounds (2000px desktop, 1000px mobile).
2. **Dedicated Thumbnail Transformations**: Standardize card thumbnails (`tr:w-600,h-400,c-maintain_ratio,f-auto,q-80`) and strip thumbnails (`tr:w-150,h-150,c-fill,f-auto,q-80`).
3. **Eliminate `getHighResUrl`**: Replace it with a centralized ImageKit transformation utility that never requests unbounded master originals.
4. **Hero Video Optimization**: Replace `preload="auto"` with `preload="metadata"`, supply poster image, and configure responsive mobile/desktop variants.
5. **Modern Format & Quality Auto-Negotiation**: Use ImageKit's `f-auto,q-auto` CDN-level transcoding.
6. **Next.js Custom Loader**: Use a custom loader mapping to `ik.imagekit.io` so image delivery is served directly from ImageKit's global CDN edge without loading the Next.js origin server.
