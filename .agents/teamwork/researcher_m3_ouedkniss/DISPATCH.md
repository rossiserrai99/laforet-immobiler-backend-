## 2026-10-08T20:45:57Z
You are the Ouedkniss Store Researcher for Milestone 3 of the La Foret Real Estate project.
Working directory: c:\Users\pc\Desktop\website REALESTATE la foret\.agents\teamwork\researcher_m3_ouedkniss
Project workspace: c:\Users\pc\Desktop\website REALESTATE la foret

Read the following reference documents:
- ORIGINAL_REQUEST.md at: c:\Users\pc\Desktop\website REALESTATE la foret\.agents\teamwork\ORIGINAL_REQUEST.md
- Master Brief at: c:\Users\pc\Downloads\ANTIGRAVITY_LAFORET_MASTER.md (Pay special attention to §4, §8, §14)
- Property & Admin Report at: c:\Users\pc\Desktop\website REALESTATE la foret\.agents\teamwork\explorer_m0_properties\properties_admin_report.md

Target Store:
https://www.ouedkniss.com/store/5451/agence-laforet/accueil

Your mission:
1. Systematically crawl, fetch, and analyze the client's Ouedkniss agency store listings.
2. Filter strictly for active VENTE (Sale) and LOCATION (Rent) property listings:
   - ACCEPT: explicit sale or rental offers.
   - REJECT: all search/demand/request listings ("Cherche", "Recherche", "Demande", "Échange", service offers, agency announcements).
   - Preference order: explicit Ouedkniss transaction metadata > listing title semantics > description semantics.
3. Extract all required fields per Master Brief §4:
   source_id, source_url, source_date, transaction_type, property_type, title, price, currency_or_display_price, wilaya, city, commune, neighborhood, surface, rooms, bedrooms, bathrooms, floor, condition, features, description_clean, image_urls, eligibility_reason, duplicate_key, import_status, notes.
4. Normalize commune names to match the 57 Algiers communes (Wilaya 16) accepted by the admin form (from Explorer 3 report).
5. Deduplicate listings using Ouedkniss ID, canonical URL, and fingerprinting.
6. Deliverables:
   - c:\Users\pc\Desktop\website REALESTATE la foret\.antigravity\laforet\OUEDKNISS_INVENTORY.csv (complete CSV with all minimum fields)
   - c:\Users\pc\Desktop\website REALESTATE la foret\.antigravity\laforet\OUEDKNISS_REVIEW.md (audit of inventory: accepted count, rejected count with reasons, breakdown by type, duplicate analysis)
   - handoff.md in your working directory.

NOTE: You are strictly READ-ONLY with respect to the live website. DO NOT mutate the database or admin dashboard.

Report back via send_message when complete.
