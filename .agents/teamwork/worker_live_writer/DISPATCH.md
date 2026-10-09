## 2026-10-09T14:05:43Z
[Message] timestamp=2026-10-09T14:05:43Z sender=13bb53f1-58fe-4d60-bba1-ca8da4784caf priority=MESSAGE_PRIORITY_HIGH content=You are worker_live_writer.
Your role: Single Live Writer & Pilot Executor (Milestones 4 & 5)
Your assigned working directory: `c:\Users\pc\Desktop\website REALESTATE la foret\.agents\teamwork\worker_live_writer\`
Parent Conversation ID: `13bb53f1-58fe-4d60-bba1-ca8da4784caf` (Report back to this ID using send_message).

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

MANDATORY INPUT:
Read `c:\Users\pc\Desktop\website REALESTATE la foret\.agents\teamwork\ORIGINAL_REQUEST.md` (specifically under `## 2026-10-09T12:58:41Z` and lines 109-111 for Milestones 4 & 5).
Read `c:\Users\pc\Downloads\ANTIGRAVITY_LAFORET_PROPERTY_RECONCILIATION_MASTER.md` (specifically Milestone 4 & 5, lines 306-340, and Operational Constraints, lines 55-84).

DATA & SPECIFICATION SOURCES:
1. `c:\Users\pc\Desktop\website REALESTATE la foret\.antigravity\laforet-reconciliation\RECONCILIATION.csv` (approved decisions by reconciler_m3 and reviewer_m3).
2. `c:\Users\pc\Desktop\website REALESTATE la foret\.antigravity\laforet-reconciliation\OUEDKNISS_INVENTORY.csv` (complete specifications and clean French text).
3. `c:\Users\pc\Desktop\website REALESTATE la foret\.antigravity\laforet-reconciliation\OUEDKNISS_PHOTO_MANIFEST.csv` (150 high-res photos).
4. `c:\Users\pc\Desktop\website REALESTATE la foret\.antigravity\laforet-reconciliation\EXISTING_WEBSITE_INVENTORY.csv` (27 baseline records).

OPERATIONAL CONSTRAINTS:
- Single Live Writer: You are the ONLY agent permitted to write to the live admin dashboard.
- Admin Workflow Integrity: All creations, edits, photo uploads must go through the admin dashboard UI workflow (authenticated session with belaid@laforet.com, normal form validation and ImageKit pipeline). Direct database mutation bypassing the application is strictly forbidden!
- Watermark Preservation: Do NOT crop, blur, or alter Ouedkniss watermarks on photos.
- Secret Protection: Never echo, hardcode, log, or commit admin passwords or ImageKit private keys.
- Audit Trail: Every single mutation MUST be logged with timestamps, record IDs, and diffs in `c:\Users\pc\Desktop\website REALESTATE la foret\.antigravity\laforet-reconciliation\CHANGE_LOG.csv`.

TASKS:
Part 1: Milestone 4 (Controlled Photo Preparation):
- Verify photo assets for the pilot listings in `OUEDKNISS_PHOTO_MANIFEST.csv`.
- Stage/download the high-res images locally in your working directory or temporary staging directory.
- Verify each image belongs to the intended listing and check image dimensions / integrity.

Part 2: Milestone 5 (3-Property Pilot Execution):
Select and execute the 3 approved pilot actions from `RECONCILIATION.csv`:
1. PILOT ACTION 1 (Photo Replacement & Field Update):
   - Record: `source_id: 58058097` / `admin_record_id: 6ac81019c5b7e8884199e69b` (or `57924129` / `6ac80ea6c5b7e8884199e5c8`).
   - Snapshot old record state first.
   - Update fields (reference, rent/price, description, specifications) via the admin dashboard edit form.
   - Replace old cached photos with the authentic high-res photos from manifest via ImageKit upload.
   - Save and record result.
2. PILOT ACTION 2 (New Sale Property):
   - Record: `source_id: 57924648` (Vente Villa El Biar, 485,000,000 DZD, surface 1400m², 2 photos).
   - Create new record via the admin dashboard property form (`/admin/properties/new`).
   - Upload the 2 authentic high-res watermarked photos.
   - Save and record result.
3. PILOT ACTION 3 (New Rental Property):
   - Record: `source_id: 57296094` (Location Studio El Biar, 850,000 DZD/mois, 11 photos) OR `57584418` (Location Bureau Telemly, 85,000 DZD/mois, 5 photos).
   - Create new record via the admin dashboard property form (`/admin/properties/new`).
   - Upload the authentic high-res watermarked photos.
   - Save and record result.

Part 3: Verification & Logging:
- Log each pilot action in `c:\Users\pc\Desktop\website REALESTATE la foret\.antigravity\laforet-reconciliation\CHANGE_LOG.csv`:
  Columns: `timestamp,agent,admin_record_id,source_id,action,previous_values_snapshot,fields_changed,previous_photo_count,new_photo_count,photo_assets_attached,public_url_after_change,result,verification_evidence,rollback_notes`
- Open and inspect the public frontend routes (`http://localhost:3000/properties/<slug>` and catalog listings) for all 3 pilot properties:
  * Verify cards render with cover photo.
  * Verify detail pages display correct galleries, prices, surfaces, specs, and descriptions.
  * Verify transaction filters (Vente / Location) include them properly.
  * Verify zero console errors or broken images.
- Write your handoff report to `c:\Users\pc\Desktop\website REALESTATE la foret\.agents\teamwork\worker_live_writer\handoff.md`.
- Send message to parent (`13bb53f1-58fe-4d60-bba1-ca8da4784caf`) summarizing the pilot execution and public verification evidence.
- STOP after the pilot! Do NOT proceed to bulk batches until the pilot is reviewed and approved by the Orchestrator / QA.
