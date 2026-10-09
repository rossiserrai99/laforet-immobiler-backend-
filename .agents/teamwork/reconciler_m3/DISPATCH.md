## 2026-10-09T13:26:06Z
You are reconciler_m3.
Your role: Reconciliation Analyst (Milestone 3 - Pass 1)
Your assigned working directory: `c:\Users\pc\Desktop\website REALESTATE la foret\.agents\teamwork\reconciler_m3\`
Parent Conversation ID: `13bb53f1-58fe-4d60-bba1-ca8da4784caf` (Report back to this ID using send_message).

MANDATORY INPUT:
Read `c:\Users\pc\Desktop\website REALESTATE la foret\.agents\teamwork\ORIGINAL_REQUEST.md` (specifically under `## 2026-10-09T12:58:41Z` and lines 106-108 for Milestone 3).
Read `c:\Users\pc\Downloads\ANTIGRAVITY_LAFORET_PROPERTY_RECONCILIATION_MASTER.md` (specifically Milestone 3, lines 268-305, Section 3E, and Section 5 for RECONCILIATION.csv and DELETE_EVIDENCE.md specifications).

DATA SOURCES:
1. `c:\Users\pc\Desktop\website REALESTATE la foret\.antigravity\laforet-reconciliation\EXISTING_WEBSITE_INVENTORY.csv` (27 existing records).
2. `c:\Users\pc\Desktop\website REALESTATE la foret\.antigravity\laforet-reconciliation\OUEDKNISS_INVENTORY.csv` (100 total listings: 43 eligible offers [31 Vente, 12 Location], 57 excluded).
3. `c:\Users\pc\Desktop\website REALESTATE la foret\.antigravity\laforet-reconciliation\OUEDKNISS_PHOTO_MANIFEST.csv` (150 high-res photos).
4. `c:\Users\pc\Desktop\website REALESTATE la foret\.antigravity\laforet-reconciliation\PROJECT_STATE.md`.

CORE OBJECTIVES:
1. Multi-attribute reconciliation:
   Compare all 43 eligible Ouedkniss listings against the 27 existing website records:
   - Check Ouedkniss IDs (`LF-OK-*` in ref or match_source_id). Notice that the 15 pre-seeded properties have Ouedkniss IDs matching 15 of the 43 eligible listings!
   - For these 15 matching properties:
     * Check if their fields need updates (`UPDATE_FIELDS` or `UPDATE_FIELDS_AND_PHOTOS` or `KEEP_AS_IS`).
     * Check if photos need replacement (`REPLACE_PHOTOS` or `UPDATE_FIELDS_AND_PHOTOS`). Notice whether the current ImageKit photos match the source Ouedkniss photos or if additional authentic photos should be attached.
   - For the remaining 28 eligible Ouedkniss listings:
     * They do not exist on the website yet -> `CREATE_NEW`!
   - For the 12 legacy website mockup properties (`bn4`, `aprtmd5`, `rgh6`, `hg5`, `sou1`, `dely 2`, `apprtmn 1`, `villa-1`, `villa sidi yahya`, `sdfkbjn`, `maison de metre`, `villa`):
     * Cross-check each one against ALL 100 listings in the 5-page Ouedkniss inventory!
     * Verify whether any of them could match any Ouedkniss listing (by title, commune, price, surface, description).
     * If there is strictly 0 match and they have placeholder text (`^rkmolk`, `sdfpkopo`, etc.) -> Candidate for `DELETE_CONFIRMED_MOCKUP`.
     * If there is any ambiguity -> `REVIEW_REQUIRED`.

2. Produce `c:\Users\pc\Desktop\website REALESTATE la foret\.antigravity\laforet-reconciliation\RECONCILIATION.csv`:
   Required Columns:
   `source_id,admin_record_id,source_url,decision,match_evidence,field_updates_needed,photo_updates_needed,delete_or_keep_reason,reviewer_1,reviewer_2,approved_for_mutation,completion_status`
   Allowed decisions: `KEEP_AS_IS`, `UPDATE_FIELDS`, `REPLACE_PHOTOS`, `UPDATE_FIELDS_AND_PHOTOS`, `CREATE_NEW`, `DELETE_CONFIRMED_MOCKUP`, `REVIEW_REQUIRED`.
   Fill `reviewer_1` as `reconciler_m3`. Set `reviewer_2` as `PENDING_REVIEW` and `approved_for_mutation` as `PENDING`. Set `completion_status` as `PLANNED`.

3. Produce `c:\Users\pc\Desktop\website REALESTATE la foret\.antigravity\laforet-reconciliation\DELETE_EVIDENCE.md`:
   For EVERY property assigned `DELETE_CONFIRMED_MOCKUP`, document the mandatory 5-point proof:
   1) Admin record ID and prior-state snapshot (title, ref, price, commune, surface, description, photos).
   2) Current photo references and reasons they are mockups.
   3) Confirmation that the entire 5-page Ouedkniss inventory (all 100 listings) was checked.
   4) Detailed rationale why every plausible source match was rejected (comparing against any listings in the same commune, property type, or price range).
   5) Reviewer 1 recommendation (signed by `reconciler_m3`), with space for Reviewer 2 independent confirmation.

4. When complete:
   - Write your handoff report to `c:\Users\pc\Desktop\website REALESTATE la foret\.agents\teamwork\reconciler_m3\handoff.md`.
   - Send a message to parent (`13bb53f1-58fe-4d60-bba1-ca8da4784caf`) summarizing your findings: count of KEEP, UPDATE, REPLACE_PHOTOS, CREATE_NEW, DELETE_CONFIRMED_MOCKUP, REVIEW_REQUIRED.
