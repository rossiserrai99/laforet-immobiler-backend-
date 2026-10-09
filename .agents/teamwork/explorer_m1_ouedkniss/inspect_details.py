import json

with open('c:/Users/pc/Desktop/website REALESTATE la foret/.agents/teamwork/explorer_m1_ouedkniss/ouedkniss_detailed_all.json', 'r', encoding='utf-8') as f:
    records = json.load(f)

print(f"Total detailed records: {len(records)}")

photo_counts = []
spec_keys = set()
for r in records:
    medias = r.get('medias') or []
    photo_counts.append(len(medias))
    for s in r.get('specs') or []:
        spec_keys.add(s.get('specification', {}).get('codename'))

print(f"Max photos in a listing: {max(photo_counts)}, Min: {min(photo_counts)}, Total photos: {sum(photo_counts)}")
print("All specification codenames found across listings:")
print(sorted(spec_keys))

# Sample an eligible listing
eligible_samples = [r for r in records if 'cherche' not in (r.get('category') or {}).get('slug', '') and 'demande' not in (r.get('category') or {}).get('slug', '')]
print(f"\nTotal eligible listings in detailed data: {len(eligible_samples)}")

if eligible_samples:
    s = eligible_samples[0]
    print(f"\nSample Eligible Listing: ID={s['id']}, Title={s['title']}")
    print("Category:", s.get('category'))
    print("Cities:", s.get('cities'))
    print("Price:", s.get('price'), s.get('priceUnit'), s.get('pricePreview'))
    print("Specs:", json.dumps(s.get('specs'), indent=2, ensure_ascii=False))
    print(f"Medias ({len(s.get('medias') or [])}):")
    for m in (s.get('medias') or [])[:3]:
        print(" ", m.get('mediaUrl'))
