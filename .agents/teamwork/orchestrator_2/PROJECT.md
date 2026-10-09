# Project: La Foret Property Reconciliation

## Architecture
- Client Ouedkniss store (5 pages): `https://www.ouedkniss.com/store/5451/agence-laforet/accueil`
- Website Public Catalog (Next.js frontend): `http://localhost:3000`
- Website Admin Dashboard (React/Next.js admin forms): `http://localhost:3000/admin` (backend `http://localhost:5000`)
- Media Service: ImageKit pipeline via admin gallery uploader
- Coordination directory: `c:\Users\pc\Desktop\website REALESTATE la foret\.antigravity\laforet-reconciliation\`

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | Baseline Safety Snapshot & Audit | Repo health, API & frontend status, admin login, baseline property counts, ImageKit uploader verification | M0 | ORIGINAL_REQUEST §R1 |
| 2 | 5-Page Ouedkniss Crawl & Inventory | Crawl all 5 pages, record every card, classify active Vente/Location, disqualify requests/demands | M1 | ORIGINAL_REQUEST §R2 |
| 3 | Ouedkniss Photo Manifest | Capture full photo sets preserving source order & watermarks | M1 | ORIGINAL_REQUEST §R2 |
| 4 | Existing Website Property Enumeration | Enumerate all existing website property records (admin + public catalog) | M2 | ORIGINAL_REQUEST §R3 |
| 5 | Two-Pass Reconciliation Matrix | Multi-attribute matching, decision classification, 2-agent review | M3 | ORIGINAL_REQUEST §R4 |
| 6 | Confirmed Mockup Deletion Evidence | Rigorous evidence compiling for confirmed mockup deletions | M3 | ORIGINAL_REQUEST §R4 |
| 7 | Photo Preparation & Deduplication | Verify photos per listing, deduplicate accidental copies | M4 | ORIGINAL_REQUEST §R5 |
| 8 | 3-Property Pilot Execution | Single live writer pilot (1 photo replace, 1 new sale, 1 new rental) via admin UI | M5 | ORIGINAL_REQUEST §R5 |
| 9 | Serialized Batch Updates & Ingestion | Single live writer, batches <= 5, mutate via admin forms, log to CHANGE_LOG.csv | M6 | ORIGINAL_REQUEST §R6 |
| 10 | Confirmed Mockup Removal | Delete verified mockups via admin dashboard only after imports and verification | M7 | ORIGINAL_REQUEST §R6 |
| 11 | Independent Accounting & Acceptance Audit | Forensic balancing (Source = Website + Excluded), QA verification, zero leaks | M8 | ORIGINAL_REQUEST §R7 |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M0 | Baseline Safety Snapshot & Read-Only Audit | Inspect repo health, API/frontend, admin login, baseline counts, ImageKit uploader. Produce PROJECT_STATE.md | none | DONE |
| M1 | Exhaustive 5-Page Ouedkniss Store Research | Crawl 5 pages, classify Vente/Location, extract specs and photos. Produce SOURCE_PAGE_COVERAGE.csv, OUEDKNISS_INVENTORY.csv, OUEDKNISS_PHOTO_MANIFEST.csv | none | DONE |
| M2 | Existing Website Property Enumeration | Enumerate all existing properties via admin & public site. Produce EXISTING_WEBSITE_INVENTORY.csv | M0 | DONE |
| M3 | Reconciliation & Two-Pass Decision Matrix | Multi-attribute match, assign decisions, 2-agent review. Produce RECONCILIATION.csv, DELETE_EVIDENCE.md | M1, M2 | DONE |
| M4 | Controlled Photo Preparation | Asset verification, manifest finalization, staging photos | M3 | DONE |
| M5 | 3-Property Pilot Execution | Single live writer executes pilot via admin UI; public verification | M4 | DONE |
| M6 | Serialized Batch Updates | Single live writer processes CREATE_NEW, UPDATE_FIELDS, REPLACE_PHOTOS in batches <= 5 | M5 | DONE |
| M7 | Mockup Removal | Single live writer deletes confirmed mockups via admin UI | M6 | DONE |
| M8 | Final Acceptance Audit & Balance Sheet | Forensic accounting, QA testing, produce QA_REPORT.md and FINAL_REPORT.md | M7 | IN_PROGRESS |

## Interface Contracts & Required File Formats
All coordination files live in `.antigravity/laforet-reconciliation/`:
- `PROJECT_STATE.md`: Baseline status, repo health, admin reachable, recovery checkpoint. (PRODUCED in M0)
- `EXISTING_WEBSITE_INVENTORY.csv`: Full 27-record snapshot (PRODUCED in M0/M2)
- `SOURCE_PAGE_COVERAGE.csv`: 5 pages covered, 100 listings seen (PRODUCED in M1)
- `OUEDKNISS_INVENTORY.csv`: 100 listings classified, 43 eligible offers, 57 excluded (PRODUCED in M1)
- `OUEDKNISS_PHOTO_MANIFEST.csv`: 150 high-res photos mapped with preserved watermarks (PRODUCED in M1)
- `RECONCILIATION.csv`: 55 rows, 100% completion marked (PRODUCED in M3, EXECUTED in M5-M7)
- `DELETE_EVIDENCE.md`: 12 dossiers, dual-signed, all mockups purged (PRODUCED in M3, EXECUTED in M7)
- `CHANGE_LOG.csv`: 50 continuous mutation audit entries with diffs and rollback notes (PRODUCED in M5-M7)
- `QA_REPORT.md`: Comprehensive QA verification findings across functional, media, and security dimensions (in-progress M8)
- `FINAL_REPORT.md`: Final forensic balance sheet, exceptions, recovery snapshots, and verification sign-off (in-progress M8)
