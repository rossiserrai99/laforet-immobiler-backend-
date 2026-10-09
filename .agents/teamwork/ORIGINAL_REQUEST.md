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


## 2026-10-09T12:58:41Z

# Teamwork Project Prompt — Launched

> Status: Launched
> Goal: Comprehensive audit, photo replacement, 5-page Ouedkniss reconciliation, and verified mockup removal for La Foret real estate website
> Requested team: Full multi-agent team (coordinator, researchers, inventory auditors, reconciliation reviewer, single live writer, independent QA auditor)

Reconcile all public and admin property records of the La Foret real estate website against all five listing pages of the client's Ouedkniss store (`https://www.ouedkniss.com/store/5451/agence-laforet/accueil`). Correct existing records, replace mockup photos with authentic authorized images, import missing eligible Vente/Location offers, and remove confirmed mockups through the admin dashboard after independent 2-pass verification.

Working directory: `c:\Users\pc\Desktop\website REALESTATE la foret`
Integrity mode: `development`

Reference Document: `file:///c:/Users/pc/Downloads/ANTIGRAVITY_LAFORET_PROPERTY_RECONCILIATION_MASTER.md`
Coordination Directory: `.antigravity/laforet-reconciliation/`

## Requirements

### R1. Baseline Safety Snapshot & Read-Only Audit (Milestone 0)
Inspect current repository health, backend API, frontend Next.js app, and admin login accessibility. Establish baseline property counts and full field/photo snapshots in `.antigravity/laforet-reconciliation/PROJECT_STATE.md` before making any mutations. Verify ImageKit uploader operational integrity through the admin UI.

### R2. Exhaustive 5-Page Ouedkniss Store Research (Milestone 1)
Systematically crawl and inspect all 5 pages of the client's Ouedkniss store (`https://www.ouedkniss.com/store/5451/agence-laforet/accueil`). Enumerate every listing card, record canonical URLs, open candidate detail pages, and classify eligibility strictly for active **Vente** (Sale) or **Location** (Rent) offers. Disqualify all demand/search requests ("Cherche", "Recherche", "Demande", "Échange"). Collect complete property specifications and every available authorized property photo in source order. Record coverage in `SOURCE_PAGE_COVERAGE.csv`, inventory in `OUEDKNISS_INVENTORY.csv`, and photo details in `OUEDKNISS_PHOTO_MANIFEST.csv`. Preserve all original Ouedkniss watermarks without cropping or blurring.

### R3. Existing Website Property Enumeration (Milestone 2)
Enumerate every existing property record from the admin dashboard and public catalog (including drafts/unpublished records). Document record IDs, slugs, titles, transaction types, categories, prices, specs, and current photo references in `EXISTING_WEBSITE_INVENTORY.csv`. Ensure the count matches the dashboard total before proceeding.

### R4. Reconciliation & Two-Pass Decision Matrix (Milestone 3)
Compare every eligible Ouedkniss listing against the existing website inventory using multi-attribute matching (IDs, transaction types, categories, communes, surfaces, prices, photo analysis). Assign exact decisions: `KEEP_AS_IS`, `UPDATE_FIELDS`, `REPLACE_PHOTOS`, `UPDATE_FIELDS_AND_PHOTOS`, `CREATE_NEW`, `DELETE_CONFIRMED_MOCKUP`, or `REVIEW_REQUIRED`. Require independent 2-agent review for all proposed changes and deletions in `RECONCILIATION.csv` and `DELETE_EVIDENCE.md`.

### R5. Controlled Photo Preparation & Pilot Execution (Milestones 4 & 5)
Verify each photo belongs to its intended listing, deduplicate accidental copies, and prepare upload assets using the ImageKit pipeline. Execute a mandatory 3-property pilot through the admin dashboard (1 photo replacement, 1 new sale, 1 new rental). Verify public frontend cards, galleries, filters, and detail pages before approving bulk batches.

### R6. Serialized Batch Updates & Mockup Removal (Milestones 6 & 7)
Enforce the Single Live Writer constraint. Process approved updates and new listings through the admin dashboard in batches of ≤5 properties, logging each mutation with prior/new values in `CHANGE_LOG.csv`. Once all imports and updates are verified, execute deletion of confirmed mockups (records with proven 0 match across all 5 source pages and verified 2-pass review) via the admin dashboard.

### R7. Independent Accounting & Final Acceptance Audit (Milestone 8)
Conduct a full mathematical and forensic reconciliation across:
1. Source coverage & classification (pages 1–5).
2. Website records (kept, updated, photo-replaced, created, deleted, review-required).
3. Photo accounting (found, attached, skipped duplicates, watermark preserved).
Verify zero secrets or passwords in logs/code, zero broken assets, working search/filters, and compile complete findings in `QA_REPORT.md` and `FINAL_REPORT.md`.

## Operational & Security Constraints

- **Single Live Writer:** Exactly one agent may write to the admin dashboard at any time. All other agents remain read-only.
- **Admin Workflow Integrity:** All creations, edits, photo uploads, and deletions must pass through the real admin dashboard UI forms. Direct database mutations are strictly prohibited.
- **Watermark & Attribution Safety:** Do NOT remove, blur, or crop Ouedkniss watermarks or agency attribution marks.
- **Secret Protection:** Never echo, hardcode, log, or commit admin passwords or ImageKit private keys.
- **Coordination Files:** All manifests, coverage logs, change logs, and reports must be stored under `.antigravity/laforet-reconciliation/`.

## Acceptance Criteria

### Source Coverage & Inventory
- [ ] All 5 Ouedkniss listing pages are verified and logged in `SOURCE_PAGE_COVERAGE.csv`.
- [ ] Every listing card is accounted for (eligible Vente/Location cataloged, search/demands disqualified with explicit reasons).
- [ ] All available relevant property photos are cataloged in `OUEDKNISS_PHOTO_MANIFEST.csv` preserving source order and watermarks.
- [ ] Zero fabricated prices, surfaces, room counts, or addresses.

### Website Inventory & Reconciliation
- [ ] 100% of existing website records are inventoried in `EXISTING_WEBSITE_INVENTORY.csv`.
- [ ] Every record and source listing is assigned an approved status in `RECONCILIATION.csv`.
- [ ] Two-agent independent confirmation is documented for all proposed deletions in `DELETE_EVIDENCE.md`.
- [ ] Ambiguous or unverified records remain untouched as `REVIEW_REQUIRED`.

### Admin Ingestion & Photo Replacement
- [ ] 3-property pilot is approved by independent QA before bulk batches begin.
- [ ] Matching existing records have their mockup photos replaced with authentic source photos without duplicate record creation.
- [ ] Missing eligible listings are imported in serialized batches of ≤5 via the admin dashboard.
- [ ] Confirmed mockups are deleted through the admin dashboard only after all imports and public checks pass.
- [ ] Every mutation is logged with timestamps, record IDs, and diffs in `CHANGE_LOG.csv`.

### Final Audit & System Integrity
- [ ] Reconciliation arithmetic balances perfectly in `FINAL_REPORT.md` (Source total = Website total + Exclusions).
- [ ] Public site search, category filters, and detail page galleries render cleanly with zero broken images or console errors.
- [ ] Zero credentials or private keys are exposed anywhere in code, commits, or reports.
