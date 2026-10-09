import os
import csv

BASE_DIR = r"c:\Users\pc\Desktop\website REALESTATE la foret\.antigravity\laforet-reconciliation"

# 1. Verify SOURCE_PAGE_COVERAGE.csv
cov_path = os.path.join(BASE_DIR, "SOURCE_PAGE_COVERAGE.csv")
assert os.path.exists(cov_path), "Missing SOURCE_PAGE_COVERAGE.csv"
with open(cov_path, 'r', encoding='utf-8') as f:
    reader = csv.reader(f)
    cov_header = next(reader)
    cov_rows = list(reader)

expected_cov_header = [
    'source_page_number', 'page_url', 'listing_count_seen',
    'eligible_sale_count', 'eligible_rent_count', 'excluded_count',
    'review_required_count', 'reviewer', 'status', 'notes'
]
assert cov_header == expected_cov_header, f"Header mismatch in SOURCE_PAGE_COVERAGE: {cov_header}"
assert len(cov_rows) == 5, f"Expected 5 rows, got {len(cov_rows)}"

total_seen = sum(int(r[2]) for r in cov_rows)
total_sale = sum(int(r[3]) for r in cov_rows)
total_rent = sum(int(r[4]) for r in cov_rows)
total_excl = sum(int(r[5]) for r in cov_rows)
total_rev = sum(int(r[6]) for r in cov_rows)

print(f"=== SOURCE_PAGE_COVERAGE.csv ===")
print(f"Pages: {len(cov_rows)}")
print(f"Total Seen: {total_seen}")
print(f"Total Sale: {total_sale}")
print(f"Total Rent: {total_rent}")
print(f"Total Excluded: {total_excl}")
print(f"Total Review Required: {total_rev}")
assert total_seen == 100
assert total_sale == 31
assert total_rent == 12
assert total_excl == 57
assert total_rev == 0
print("COVERAGE VERIFICATION: PASS")

# 2. Verify OUEDKNISS_INVENTORY.csv
inv_path = os.path.join(BASE_DIR, "OUEDKNISS_INVENTORY.csv")
assert os.path.exists(inv_path), "Missing OUEDKNISS_INVENTORY.csv"
with open(inv_path, 'r', encoding='utf-8') as f:
    reader = csv.reader(f)
    inv_header = next(reader)
    inv_rows = list(reader)

expected_inv_header = [
    'source_id', 'canonical_source_url', 'source_page_number', 'source_title',
    'transaction_type', 'property_category', 'price', 'price_unit', 'wilaya',
    'city', 'commune', 'neighborhood', 'address_if_listed', 'surface', 'rooms',
    'bedrooms', 'bathrooms', 'floor', 'condition', 'other_specs', 'features',
    'description_clean', 'photo_count', 'photo_manifest_keys', 'eligibility',
    'eligibility_evidence', 'duplicate_key', 'match_status', 'admin_record_id', 'notes'
]
assert inv_header == expected_inv_header, f"Header mismatch in OUEDKNISS_INVENTORY: {inv_header}"
assert len(inv_rows) == 100, f"Expected 100 rows, got {len(inv_rows)}"

eligible_inv = [r for r in inv_rows if r[24] == 'ELIGIBLE']
excluded_inv = [r for r in inv_rows if r[24] == 'EXCLUDED']
assert len(eligible_inv) == 43, f"Expected 43 eligible, got {len(eligible_inv)}"
assert len(excluded_inv) == 57, f"Expected 57 excluded, got {len(excluded_inv)}"

# Check duplicate keys uniqueness
dup_keys = [r[26] for r in inv_rows]
assert len(set(dup_keys)) == len(dup_keys), f"Duplicate keys detected: {len(dup_keys) - len(set(dup_keys))}"

print(f"\n=== OUEDKNISS_INVENTORY.csv ===")
print(f"Total Rows: {len(inv_rows)}")
print(f"Eligible: {len(eligible_inv)} (Sale: {sum(1 for r in eligible_inv if r[4] == 'Vente')}, Rent: {sum(1 for r in eligible_inv if r[4] == 'Location')})")
print(f"Excluded: {len(excluded_inv)}")
print(f"Unique duplicate keys: {len(set(dup_keys))}/100")
print("INVENTORY VERIFICATION: PASS")

# 3. Verify OUEDKNISS_PHOTO_MANIFEST.csv
photo_path = os.path.join(BASE_DIR, "OUEDKNISS_PHOTO_MANIFEST.csv")
assert os.path.exists(photo_path), "Missing OUEDKNISS_PHOTO_MANIFEST.csv"
with open(photo_path, 'r', encoding='utf-8') as f:
    reader = csv.reader(f)
    photo_header = next(reader)
    photo_rows = list(reader)

expected_photo_header = [
    'source_id', 'canonical_source_url', 'source_photo_order',
    'source_image_url_or_reference', 'local_asset_path_if_downloaded',
    'filename', 'image_subject_verified', 'watermark_present',
    'authorized_to_reuse', 'upload_status', 'imagekit_asset_or_url',
    'admin_gallery_position', 'qa_status', 'notes'
]
assert photo_header == expected_photo_header, f"Header mismatch in OUEDKNISS_PHOTO_MANIFEST: {photo_header}"
assert len(photo_rows) == 150, f"Expected 150 photos, got {len(photo_rows)}"

# Check photo URLs are all valid CDN URLs
for r in photo_rows:
    assert r[3].startswith('https://cdn'), f"Invalid photo URL: {r[3]}"
    assert r[7] == 'YES', f"Watermark flag must be YES"
    assert r[8] == 'YES', f"Authorized flag must be YES"

print(f"\n=== OUEDKNISS_PHOTO_MANIFEST.csv ===")
print(f"Total Photos: {len(photo_rows)}")
print(f"Unique source_ids represented: {len(set(r[0] for r in photo_rows))}")
print("PHOTO MANIFEST VERIFICATION: PASS")
print("\nALL VERIFICATIONS PASSED PERFECTLY!")
