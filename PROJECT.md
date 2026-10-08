# Project: La Foret Real Estate Website

## Architecture
- Frontend: Next.js 16.2.10, React 19.2.4 (located in `frontend/`)
- Backend: Express 5.2.1, Node.js (located in `backend/`)
- Database: MongoDB Atlas (27 total properties, 57 images, 1 admin, 8 leads)
- Media Architecture: Migrated to ImageKit (`ik.imagekit.io/8jggj5dcd7/`) with 100% asset coverage
- Data Source: Client's Ouedkniss store (`https://www.ouedkniss.com/store/5451/agence-laforet/accueil`)
- Administration: Existing Admin dashboard workflow (`/admin`)
- Coordination Layer: `.antigravity/laforet/`

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | Baseline Repo Health & Build Certification | Inspect codebase, run builds/lint/tests, trace Cloudinary & property models | M0 | R1, Master Brief §5 |
| 2 | Cloudinary Diagnosis | Investigate historical consumption root causes | M1 | R2, Master Brief §6.1 |
| 3 | ImageKit Media Migration | Replace Cloudinary with ImageKit, optimize sizes, responsive transforms | M1 | R2, Master Brief §6.2 |
| 4 | Hero Video & Banner Configuration | Configure desktop/mobile hero video, poster, promotional banners | M2 | R3, Master Brief §7 |
| 5 | Ouedkniss Store Scraping & Filtering | Extract active VENTE and LOCATION listings, reject demands/requests, deduplicate | M3 | R4, Master Brief §8 |
| 6 | 3-Property Pilot Population | Admin dashboard entry of 1 sale, 1 rent, 1 complex property, public validation | M4 | R5, Master Brief §9 |
| 7 | Batched Property Population | Serialized import (5-10 per batch) via admin dashboard, ImageKit photos, log mutations | M4 | R5, Master Brief §9 |
| 8 | Independent QA & Final Audit | End-to-end verification, media checks, security checks, final report | M5 | R6, Master Brief §10 |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 0 | Pre-flight Repository Health Check | Full audit of backend/frontend, builds, git status, media & admin mapping | none | DONE |
| 1 | Cloudinary Diagnosis & ImageKit Migration | Consumption diagnosis, ImageKit integration, media manifest | M0 | DONE |
| 2 | Hero Video & Banner Asset Configuration | Asset manifest, banner/hero video verification & config | M1 | DONE |
| 3 | Ouedkniss Research & Filtering | Store crawl, filtering out requests, deduplication, CSV inventory | M0 | DONE |
| 4 | Controlled Admin Property Population | Single live writer, 3-property pilot, batched entry via admin UI | M1, M2, M3 | DONE |
| 5 | Independent QA & Final Audit | Cross-functional QA, security checks, final verdict | M4 | DONE |

## Code Layout
- Frontend: `frontend/`
- Backend: `backend/`
- Coordination Layer: `.antigravity/laforet/`
- Agent Workspaces: `.agents/teamwork/`
