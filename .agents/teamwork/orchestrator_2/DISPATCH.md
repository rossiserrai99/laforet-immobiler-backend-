# DISPATCH LOG

## 2026-10-09T13:00:36Z
You are the Project Orchestrator for the La Foret Real Estate website reconciliation project.
Your assigned working directory is `c:\Users\pc\Desktop\website REALESTATE la foret\.agents\teamwork\orchestrator_2\`.
All coordination files for this reconciliation project must be maintained in `c:\Users\pc\Desktop\website REALESTATE la foret\.antigravity\laforet-reconciliation\`.

Authoritative Request:
See `c:\Users\pc\Desktop\website REALESTATE la foret\.agents\teamwork\ORIGINAL_REQUEST.md` (specifically under the latest header `## 2026-10-09T12:58:41Z`).
Reference Document: `file:///c:/Users/pc/Downloads/ANTIGRAVITY_LAFORET_PROPERTY_RECONCILIATION_MASTER.md`.

Goal:
Comprehensive audit, photo replacement, 5-page Ouedkniss reconciliation, and verified mockup removal for La Foret real estate website.
Reconcile all public and admin property records of the La Foret real estate website against all five listing pages of the client's Ouedkniss store (`https://www.ouedkniss.com/store/5451/agence-laforet/accueil`). Correct existing records, replace mockup photos with authentic authorized images, import missing eligible Vente/Location offers, and remove confirmed mockups through the admin dashboard after independent 2-pass verification.

Requirements:
- R1. Baseline Safety Snapshot & Read-Only Audit (Milestone 0): Inspect repository health, backend API, frontend Next.js app, admin login, baseline property counts, and ImageKit uploader operational integrity. Document in `.antigravity/laforet-reconciliation/PROJECT_STATE.md`.
- R2. Exhaustive 5-Page Ouedkniss Store Research (Milestone 1): Crawl all 5 pages of `https://www.ouedkniss.com/store/5451/agence-laforet/accueil`, record every card, classify active Vente/Location, disqualify demands/searches, collect complete specs and authorized photos preserving watermarks. Produce `SOURCE_PAGE_COVERAGE.csv`, `OUEDKNISS_INVENTORY.csv`, `OUEDKNISS_PHOTO_MANIFEST.csv`.
- R3. Existing Website Property Enumeration (Milestone 2): Enumerate all existing website property records (admin dashboard + public catalog). Produce `EXISTING_WEBSITE_INVENTORY.csv`.
- R4. Reconciliation & Two-Pass Decision Matrix (Milestone 3): Multi-attribute matching, decision classification (KEEP_AS_IS, UPDATE_FIELDS, REPLACE_PHOTOS, UPDATE_FIELDS_AND_PHOTOS, CREATE_NEW, DELETE_CONFIRMED_MOCKUP, REVIEW_REQUIRED). Require independent 2-agent review in `RECONCILIATION.csv` and `DELETE_EVIDENCE.md`.
- R5. Controlled Photo Preparation & Pilot Execution (Milestones 4 & 5): Verify photos, deduplicate, execute mandatory 3-property pilot (1 photo replacement, 1 new sale, 1 new rental) via admin dashboard, verify on public frontend.
- R6. Serialized Batch Updates & Mockup Removal (Milestones 6 & 7): Single live writer, batches <= 5, log mutations in `CHANGE_LOG.csv`. Delete confirmed mockups via admin dashboard only after imports and verification succeed.
- R7. Independent Accounting & Final Acceptance Audit (Milestone 8): Forensic reconciliation balancing, zero secret leaks, zero broken assets, produce `QA_REPORT.md` and `FINAL_REPORT.md`.

Operational & Security Constraints:
- Single Live Writer: Exactly one agent may write to the admin dashboard at any time. All other agents remain read-only.
- Admin Workflow Integrity: All creations, edits, photo uploads, and deletions must pass through the real admin dashboard UI forms. Direct database mutations are strictly prohibited.
- Watermark & Attribution Safety: Do NOT remove, blur, or crop Ouedkniss watermarks or agency attribution marks.
- Secret Protection: Never echo, hardcode, log, or commit admin passwords or ImageKit private keys.
- Coordination Files: Store all manifests, coverage logs, change logs, and reports under `.antigravity/laforet-reconciliation/`.
