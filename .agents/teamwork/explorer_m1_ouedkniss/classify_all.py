import json
from collections import Counter

with open('c:/Users/pc/Desktop/website REALESTATE la foret/.agents/teamwork/explorer_m1_ouedkniss/store_announcements_raw.json', 'r', encoding='utf-8') as f:
    items = json.load(f)

print(f"Total listings: {len(items)}")

cat_counts = Counter()
type_counts = Counter()
eligibility_counts = Counter()

excluded = []
eligible_sale = []
eligible_rent = []
review_req = []

for it in items:
    cat = it.get('category') or {}
    cat_slug = cat.get('slug', '')
    title = it.get('title', '')
    p = it['source_page']
    
    cat_counts[cat_slug] += 1
    
    # Check parentTree
    parents = [pt.get('slug') for pt in (cat.get('parentTree') or [])]
    
    # Classification logic per Section 3A:
    # Exclude: "Cherche", "Recherche", "Demande", "Échange", service announcements
    is_cherche = (
        'cherche' in cat_slug or 
        'demande' in cat_slug or 
        'echange' in cat_slug or
        any(w in title.lower() for w in ['cherche', 'recherche', 'demande', 'échange', 'echange', 'offre de service'])
    )
    
    if is_cherche:
        eligibility = 'EXCLUDED'
        reason = f"Demande/recherche de client ({cat_slug})"
        excluded.append((p, it['id'], title, cat_slug, reason))
        eligibility_counts['EXCLUDED'] += 1
    elif 'vente' in cat_slug or 'immobilier-vente' in parents:
        eligibility = 'ELIGIBLE'
        eligible_sale.append((p, it['id'], title, cat_slug))
        eligibility_counts['ELIGIBLE_SALE'] += 1
    elif 'location' in cat_slug or 'immobilier-location' in parents:
        eligibility = 'ELIGIBLE'
        eligible_rent.append((p, it['id'], title, cat_slug))
        eligibility_counts['ELIGIBLE_RENT'] += 1
    else:
        review_req.append((p, it['id'], title, cat_slug))
        eligibility_counts['REVIEW_REQUIRED'] += 1

print("\n--- Category Breakdown ---")
for cat, cnt in cat_counts.most_common():
    print(f"  {cat:<40}: {cnt}")

print("\n--- Eligibility Summary ---")
for k, v in eligibility_counts.items():
    print(f"  {k}: {v}")

print(f"\nTotal Eligible Sale: {len(eligible_sale)}")
print(f"Total Eligible Rent: {len(eligible_rent)}")
print(f"Total Excluded: {len(excluded)}")
print(f"Total Review Required: {len(review_req)}")

# Breakdown per page
for p in range(1, 6):
    p_items = [it for it in items if it['source_page'] == p]
    p_sale = [it for it in eligible_sale if it[0] == p]
    p_rent = [it for it in eligible_rent if it[0] == p]
    p_excl = [it for it in excluded if it[0] == p]
    p_rev = [it for it in review_req if it[0] == p]
    print(f"\nPage {p}: total={len(p_items)}, sale={len(p_sale)}, rent={len(p_rent)}, excluded={len(p_excl)}, review_required={len(p_rev)}")
