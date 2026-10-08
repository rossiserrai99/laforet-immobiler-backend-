## 2026-10-08T20:45:57Z
You are the Media Migration Worker for Milestone 1 of the La Foret Real Estate project.
Working directory: c:\Users\pc\Desktop\website REALESTATE la foret\.agents\teamwork\worker_m1_imagekit
Project workspace: c:\Users\pc\Desktop\website REALESTATE la foret

Read the following reference documents:
- ORIGINAL_REQUEST.md at: c:\Users\pc\Desktop\website REALESTATE la foret\.agents\teamwork\ORIGINAL_REQUEST.md
- Master Brief at: c:\Users\pc\Downloads\ANTIGRAVITY_LAFORET_MASTER.md
- Health Audit at: c:\Users\pc\Desktop\website REALESTATE la foret\.antigravity\laforet\HEALTH_AUDIT.md
- Media Report at: c:\Users\pc\Desktop\website REALESTATE la foret\.agents\teamwork\explorer_m0_media\media_report.md
- Cloudinary Diagnosis at: c:\Users\pc\Desktop\website REALESTATE la foret\.antigravity\laforet\CLOUDINARY_DIAGNOSIS.md

Your mission:
1. Migrate all 18 Cloudinary assets to ImageKit:
   - 13 property images in MongoDB Atlas across 12 properties (download from Cloudinary and upload to ImageKit).
   - 5 static/hardcoded assets in frontend (video poster, video MP4, advisor photo, agency photo/fallback, footer banner).
   - Update existing MongoDB Atlas property records with the new ImageKit URLs.
   - Record every asset in c:\Users\pc\Desktop\website REALESTATE la foret\.antigravity\laforet\MEDIA_MANIFEST.json.
2. Implement ImageKit in backend:
   - Read credentials from backend/.env (IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY, IMAGEKIT_URL_ENDPOINT).
   - Install/use ImageKit SDK (imagekit) or custom HTTP upload in backend.
   - Replace multer-storage-cloudinary in upload.middleware.js with ImageKit upload handler.
   - Update property.controller.js to handle ImageKit file uploads and file deletions via ImageKit API.
   - Update backend/app.js Helmet CSP: ensure imgSrc and mediaSrc allow https://ik.imagekit.io.
   - Keep IMAGEKIT_PRIVATE_KEY strictly server-side.
3. Implement ImageKit in frontend:
   - Add ik.imagekit.io to frontend/next.config.mjs images.remotePatterns.
   - Implement ImageKit URL transformation utility and responsive optimization (desktop max 2000px, mobile max 1000px, card thumbnails ~600px tr:w-600,h-400,c-maintain_ratio,f-auto,q-80, detail thumbnails ~150px tr:w-150,h-150,c-fill,f-auto,q-80).
   - Replace getHighResUrl in frontend/app/(public)/properties/[slug]/page.js with bounded ImageKit transformation helper.
   - Update PropertyCard.jsx, HomeClient.jsx, ImageUploader.jsx, AdminHeader.jsx, and any fallback image constants.
4. Verify execution:
   - Verify backend syntax (node --check across affected files).
   - Run frontend production build (npm run build) and ensure exit code 0.
   - Test that property pages, admin uploader, and media URLs resolve cleanly.
5. Deliverables:
   - c:\Users\pc\Desktop\website REALESTATE la foret\.antigravity\laforet\IMAGEKIT_MIGRATION.md
   - c:\Users\pc\Desktop\website REALESTATE la foret\.antigravity\laforet\MEDIA_MANIFEST.json
   - handoff.md in your working directory.
