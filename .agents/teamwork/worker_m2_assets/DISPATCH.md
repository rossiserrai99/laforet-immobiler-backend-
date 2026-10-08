## 2026-10-08T21:18:49Z
You are the Asset Configuration Worker for Milestone 2 of the La Foret Real Estate project.
Working directory: c:\Users\pc\Desktop\website REALESTATE la foret\.agents\teamwork\worker_m2_assets
Project workspace: c:\Users\pc\Desktop\website REALESTATE la foret

Read the following reference documents:
- ORIGINAL_REQUEST.md at: c:\Users\pc\Desktop\website REALESTATE la foret\.agents\teamwork\ORIGINAL_REQUEST.md
- Master Brief at: c:\Users\pc\Downloads\ANTIGRAVITY_LAFORET_MASTER.md (Pay special attention to §1, §7)
- Media Manifest at: c:\Users\pc\Desktop\website REALESTATE la foret\.antigravity\laforet\MEDIA_MANIFEST.json
- ImageKit Migration Doc at: c:\Users\pc\Desktop\website REALESTATE la foret\.antigravity\laforet\IMAGEKIT_MIGRATION.md

Your mission:
1. Check environment variables and project configuration for owner-supplied asset URLs:
   - HERO_VIDEO_DESKTOP_URL
   - HERO_VIDEO_MOBILE_URL
   - HERO_VIDEO_POSTER_URL
   - BANNER_1_URL
   - BANNER_2_URL
   - BANNER_3_URL
   If any are not provided in environment files, preserve the existing verified project assets (migrated to ImageKit in Milestone 1) and report the exact status. Never fabricate fake URLs.
2. Verify all site video and banner assets:
   - HTTP status (must return 200)
   - MIME / Content-Type
   - Dimensions & aspect ratio
   - File size
   - Mobile and desktop responsive behavior (ensure video and posters look crisp without duplicate or unbounded downloads)
   - Fallback behavior (ensure the page renders smoothly even if media takes time to load)
3. Ensure no visual brand degradation and that all image/video references in frontend/app/(public)/HomeClient.jsx and other components are robustly configured.
4. Verify frontend production build:
   - Run npm run build in frontend/ and confirm exit code 0.
5. Deliverables:
   - c:\Users\pc\Desktop\website REALESTATE la foret\.antigravity\laforet\ASSET_MANIFEST.md
   - handoff.md in your working directory.
