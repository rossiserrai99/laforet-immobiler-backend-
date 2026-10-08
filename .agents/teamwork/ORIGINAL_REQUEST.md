# Original User Request

## Initial Request — 2026-10-08T20:27:56Z

# Teamwork Project Prompt — Launched

> Status: Launched
> Goal: Multi-agent execution of La Foret real estate website project
> Requested team: Full multi-agent team (coordination, audit, migration, research, single live writer, adversarial QA)

Execute the end-to-end production maintenance, Cloudinary-to-ImageKit media migration, hero/banner asset configuration, and controlled Ouedkniss property population for the La Foret Real Estate website according to the master brief at `c:\Users\pc\Downloads\ANTIGRAVITY_LAFORET_MASTER.md`.

Working directory: `c:\Users\pc\Desktop\website REALESTATE la foret`
Integrity mode: `development`

Reference Document: `file:///c:/Users/pc/Downloads/ANTIGRAVITY_LAFORET_MASTER.md`

## Requirements

### R1. Pre-flight Repository Health Check & Baseline Audit (Milestone 0)
Inspect and verify the complete codebase (`backend/` and `frontend/`) before any application code or database records are modified. Run existing lint, typecheck, unit tests, and production build scripts. Trace all existing Cloudinary integration points, property models, admin routes, and image components. Document all findings, current build/git status, and pre-existing issues in `.antigravity/laforet/HEALTH_AUDIT.md`. Gate all downstream milestones until baseline health is certified.

### R2. Cloudinary Consumption Diagnosis & ImageKit Migration (Milestone 1)
Investigate historical Cloudinary resource consumption with concrete evidence (transforms, eager variants, large original deliveries, bot traffic, dev previews) and document the findings in `.antigravity/laforet/CLOUDINARY_DIAGNOSIS.md`. Replace Cloudinary with ImageKit using official `@imagekit/next` integration. Maintain `IMAGEKIT_PRIVATE_KEY` strictly server-side (endpoint for authentication signatures). Implement responsive image optimization, explicit aspect ratios, modern format delivery, lazy loading below the fold, standardized thumbnail transformations for cards, and dimension caps (max 2000px desktop, 1000px mobile). Map and migrate existing media references, logging all assets in `.antigravity/laforet/MEDIA_MANIFEST.json`.

### R3. Hero Video & Banner Asset Configuration (Milestone 2)
Integrate owner-supplied hero video(s), poster images, and promotional banners into the site. Validate each asset's HTTP status, MIME type, dimensions, file size, and mobile/desktop behavior without altering the visual brand identity. Record validation details in `.antigravity/laforet/ASSET_MANIFEST.md`.

### R4. Ouedkniss Store Research & Inventory Filtering (Milestone 3)
Scrape and analyze the client's Ouedkniss agency store (`https://www.ouedkniss.com/store/5451/agence-laforet/accueil`). Extract exclusively active property listings for **VENTE (Sale)** and **LOCATION (Rent)**. Strictly reject all search requests, demands, exchanges, and agency announcements ("Cherche", "Recherche", "Demande", "Échange"). Collect canonical source URLs, Ouedkniss IDs, titles, cleaned descriptions, prices, locations, structured specifications, and ordered photo URLs. Deduplicate listings and save the full inventory in `.antigravity/laforet/OUEDKNISS_INVENTORY.csv` and review in `.antigravity/laforet/OUEDKNISS_REVIEW.md`.

### R5. Controlled Admin Dashboard Property Population (Milestone 4)
Populate properties into the website exclusively via the existing admin dashboard UI workflow (no direct database bypassing). Enforce the single live writer rule:
1. Conduct a mandatory **3-property pilot** (1 sale, 1 rental, 1 complex).
2. Validate the pilot across public frontend cards, detail pages, filters, and media before proceeding.
3. Import remaining eligible listings in serialized batches of 5–10 properties with continuous checkpoint verification.
4. Upload all property photos through the ImageKit media pipeline, maintaining source order.
5. Record every action, admin record ID, missing fields, and QA status in `.antigravity/laforet/IMPORT_LOG.csv`.

### R6. Independent QA & Final Audit (Milestone 5)
Conduct adversarial review and QA across functional, content, media, performance, and security dimensions. Verify search, filtering, pagination, admin CRUD, responsive layouts, absence of broken images or console errors, and zero secret leaks. Produce the final verdict in `.antigravity/laforet/FINAL_REPORT.md` stating verified items, skipped items, and remaining risks.

## Infrastructure & Operational Constraints

- **Execution Environment:** Local execution on Windows powershell. Backend runs at `http://localhost:5000` and frontend runs at `http://localhost:3000`.
- **Secret Management:** Credentials (`IMAGEKIT_PUBLIC_KEY`, `IMAGEKIT_PRIVATE_KEY`, `IMAGEKIT_URL_ENDPOINT`, `ADMIN_USERNAME`, `ADMIN_PASSWORD`) are loaded strictly from `.env` / `.env.local` files. Never commit, log, or expose private keys in frontend bundles.
- **Coordination Layer:** All agent state, manifests, and logs must be persisted in `.antigravity/laforet/`.

## Acceptance Criteria

### Baseline Health & Security
- [ ] Pre-flight health check passes and is documented in `.antigravity/laforet/HEALTH_AUDIT.md`.
- [ ] No secrets or private keys are exposed in client-side bundles, git history, or logs.
- [ ] Existing build (`npm run build` for backend and frontend) completes without regressions.

### Media Optimization & Delivery
- [ ] Historical Cloudinary consumption root cause is identified with evidence in `.antigravity/laforet/CLOUDINARY_DIAGNOSIS.md`.
- [ ] ImageKit integration serves all project media with automatic optimization and CDN caching.
- [ ] Property card images load responsive thumbnail variants; full-resolution images are deferred to detail galleries.
- [ ] Hero video and banners render smoothly on desktop and mobile with valid poster fallbacks and no duplicate downloads.

### Content Fidelity & Ouedkniss Extraction
- [ ] 100% of imported listings are genuine Vente or Location offers (0 request/demand listings imported).
- [ ] Property data (price, wilaya, commune, surface, rooms, amenities) accurately maps from source without fabricated facts.
- [ ] All photos are preserved in original order and hosted via ImageKit.
- [ ] Duplicate Ouedkniss listings are detected and excluded.

### Admin Process & Traceability
- [ ] 3-property pilot is approved by QA before bulk entry begins.
- [ ] All property additions pass through the admin dashboard form validation.
- [ ] Every mutation is logged with timestamps and record IDs in `IMPORT_LOG.csv`.
- [ ] Live mutations are executed strictly by a single writer to prevent concurrency collisions.

### Final Verification
- [ ] Public site search, filtering by type/transaction, and property detail pages function without runtime or visual errors.
- [ ] `.antigravity/laforet/FINAL_REPORT.md` provides an independent sign-off detailing all verification checks.
