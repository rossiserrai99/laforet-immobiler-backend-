## 2026-10-08T21:33:01Z

You are the Data Entry Worker (Single Live Writer) for Milestone 4 of the La Foret Real Estate project.
Working directory: c:\Users\pc\Desktop\website REALESTATE la foret\.agents\teamwork\worker_m4_data_entry
Project workspace: c:\Users\pc\Desktop\website REALESTATE la foret

Read the following reference documents:
- ORIGINAL_REQUEST.md at: c:\Users\pc\Desktop\website REALESTATE la foret\.agents\teamwork\ORIGINAL_REQUEST.md
- Master Brief at: c:\Users\pc\Downloads\ANTIGRAVITY_LAFORET_MASTER.md (Pay special attention to §2, §9, §14)
- Property & Admin Report at: c:\Users\pc\Desktop\website REALESTATE la foret\.agents\teamwork\explorer_m0_properties\properties_admin_report.md
- Ouedkniss Inventory at: c:\Users\pc\Desktop\website REALESTATE la foret\.antigravity\laforet\OUEDKNISS_INVENTORY.csv
- Ouedkniss Review at: c:\Users\pc\Desktop\website REALESTATE la foret\.antigravity\laforet\OUEDKNISS_REVIEW.md

CRITICAL OPERATIONAL RULES:
1. SINGLE LIVE WRITER RULE: You are the sole active writer against the database and admin dashboard. No other agent will perform mutations.
2. ENFORCE EXISTING ADMIN DASHBOARD WORKFLOW: Populate properties exclusively using the application's actual admin workflow and form validation rules. Authenticate using credentials from backend/.env (ADMIN_USERNAME, ADMIN_PASSWORD; never print or commit credentials) to obtain the admin token, and submit multipart FormData to the property creation workflow (POST /api/properties) exactly as frontend/features/admin/PropertyForm.jsx does, so that photos are processed through the ImageKit upload pipeline (upload.middleware.js) and stored in MongoDB Atlas with complete validation.
3. MANDATORY 3-PROPERTY PILOT FIRST:
   - Enter exactly 3 representative pilot properties from OUEDKNISS_INVENTORY.csv:
     * Pilot 1 (Sale Villa): Poirson, El Biar (source_id: 57812904)
     * Pilot 2 (Rental Apartment): Hydra F4 (source_id: 57498112)
     * Pilot 3 (Complex / Duplex): Saint-Raphaël Duplex (source_id: 56621098)
   - Verify the pilot properties: fetch their public cards, verify detail pages, check image rendering from ImageKit, ensure price/type/commune match.
4. CONTROLLED BATCHED IMPORT:
   - After the 3-property pilot succeeds, import the remaining 12 properties from OUEDKNISS_INVENTORY.csv in small serialized batches (e.g. 6 properties per batch) with checkpoints.
5. TRACEABILITY & AUDITING:
   - Record every single mutation in c:\Users\pc\Desktop\website REALESTATE la foret\.antigravity\laforet\IMPORT_LOG.csv with the required columns:
     timestamp, source_id, source_url, transaction_type, admin_record_id, action, result, image_count, missing_fields, qa_status, notes
6. Deliverables:
   - c:\Users\pc\Desktop\website REALESTATE la foret\.antigravity\laforet\IMPORT_LOG.csv
   - handoff.md in your working directory summarizing total created, pilot results, batch results, and verification commands.

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Report back via send_message when complete.


## 2026-10-08T21:48:38Z

**Context**: Milestone 4 Controlled Admin Property Population
**Content**: The 3-property pilot has been reviewed and certified. All 3 properties (Sale Villa Poirson, Rental Flat Hydra, Complex Duplex Saint-Raphaël) and their ImageKit CDN photos have been verified live with zero errors. Traceability in IMPORT_LOG.csv is confirmed.
**Action**: You are authorized to proceed with the serialized import of the remaining 12 properties from OUEDKNISS_INVENTORY.csv. Execute Batch 1 (properties 4–9) and Batch 2 (properties 10–15), log every mutation in IMPORT_LOG.csv, and report back with your final handoff once all 15 properties are imported and verified.
