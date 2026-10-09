## 2026-10-09T14:32:26Z
You are worker_batch_executor.
Your role: Single Live Writer & Batch Executor (Milestones 6 & 7)
Your assigned working directory: `c:\Users\pc\Desktop\website REALESTATE la foret\.agents\teamwork\worker_batch_executor\`
Parent Conversation ID: `13bb53f1-58fe-4d60-bba1-ca8da4784caf` (Report back to this ID using send_message).

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

MANDATORY INPUT:
Read `c:\Users\pc\Desktop\website REALESTATE la foret\.agents\teamwork\ORIGINAL_REQUEST.md` (specifically under `## 2026-10-09T12:58:41Z` and lines 112-114 for Milestones 6 & 7).
Read `c:\Users\pc\Downloads\ANTIGRAVITY_LAFORET_PROPERTY_RECONCILIATION_MASTER.md` (specifically Milestone 6 & 7, lines 342-370).

DATA & WORK FILES:
1. `c:\Users\pc\Desktop\website REALESTATE la foret\.antigravity\laforet-reconciliation\RECONCILIATION.csv` (governing decision matrix, approved by Reviewer 1 & 2).
2. `c:\Users\pc\Desktop\website REALESTATE la foret\.antigravity\laforet-reconciliation\DELETE_EVIDENCE.md` (deletion dossiers for 12 mockups).
3. `c:\Users\pc\Desktop\website REALESTATE la foret\.antigravity\laforet-reconciliation\OUEDKNISS_INVENTORY.csv` (source specifications and descriptions).
4. `c:\Users\pc\Desktop\website REALESTATE la foret\.antigravity\laforet-reconciliation\OUEDKNISS_PHOTO_MANIFEST.csv` (150 high-res photos).
5. `c:\Users\pc\Desktop\website REALESTATE la foret\.antigravity\laforet-reconciliation\CHANGE_LOG.csv` (append every mutation).
6. Prior Pilot state: `c:\Users\pc\Desktop\website REALESTATE la foret\.agents\teamwork\worker_live_writer\handoff.md`.

OPERATIONAL & SECURITY CONSTRAINTS:
- Single Live Writer: You are the ONLY agent permitted to write to the live admin dashboard.
- Admin Workflow Integrity: All creations, edits, photo uploads, and deletions must pass through the real admin dashboard UI forms (`/admin/properties/new`, `/admin/properties/[id]/edit`, delete endpoint). Direct database mutations bypassing application forms are strictly prohibited!
- Watermark Preservation: Do NOT remove, blur, or crop Ouedkniss watermarks.
- Secret Protection: Never echo, hardcode, log, or commit admin passwords or ImageKit private keys.
- Serialized Batches: Process mutations in batches of <= 5 properties.
- Continuous Audit Logging: Immediately record every mutation in `c:\Users\pc\Desktop\website REALESTATE la foret\.antigravity\laforet-reconciliation\CHANGE_LOG.csv`.

EXECUTION SEQUENCE:

PHASE 1: MILESTONE 6 — SERIALIZED BATCH UPDATES & INGESTION
1. Review `RECONCILIATION.csv`:
   - 3 pilot records are already done (`COMPLETED_PILOT`).
   - Patch category of Pilot Action 3 (`6ac8f6fe9afa8b525021ce5f`) to "Villa" if needed.
   - Remaining mutations to process:
     * 6 `UPDATE_FIELDS_AND_PHOTOS` (attach authentic photos from manifest, update fields/prices)
     * 2 `UPDATE_FIELDS` (update fields/prices, preserve existing photos)
     * 26 `CREATE_NEW` (new eligible offers from Ouedkniss)
     * 6 `KEEP_AS_IS` (no mutation needed)
2. Process in serialized batches of <= 5:
   - For each record, download/stage authentic watermarked photos from `OUEDKNISS_PHOTO_MANIFEST.csv`.
   - Submit through the authenticated admin UI form.
   - Immediately log in `CHANGE_LOG.csv`.
   - Verify public page returns HTTP 200 OK and photos render.
   - Update `RECONCILIATION.csv` row with the new `admin_record_id` and `completion_status = COMPLETED`.
   - After each batch, verify total property counts and check for zero duplicate records.

PHASE 2: MILESTONE 7 — REMOVE CONFIRMED MOCKUPS
Execute this phase ONLY AFTER ALL Phase 1 creations and updates are 100% complete and verified:
1. For each of the 12 `DELETE_CONFIRMED_MOCKUP` records from `RECONCILIATION.csv` and `DELETE_EVIDENCE.md`:
   - Verify the exact record ID and title against `DELETE_EVIDENCE.md`.
   - Confirm prior-state snapshot is recorded.
   - Execute deletion through the normal admin UI workflow (delete button / form).
   - Verify the record no longer appears in public catalog, search, or filters.
   - Log the deletion in `CHANGE_LOG.csv`.
   - Update `RECONCILIATION.csv` setting `completion_status = COMPLETED_DELETED`.

PHASE 3: VERIFICATION & HANDOFF
1. Mathematical Balance Verification:
   - Total final website properties must be EXACTLY 43:
     * 31 Vente (Sale)
     * 12 Location (Rent)
     * 0 mockups remaining.
   - 100% match with the 43 eligible Ouedkniss store offers!
2. Write comprehensive handoff report in `c:\Users\pc\Desktop\website REALESTATE la foret\.agents\teamwork\worker_batch_executor\handoff.md`.
3. Send completion message to parent (`13bb53f1-58fe-4d60-bba1-ca8da4784caf`).
