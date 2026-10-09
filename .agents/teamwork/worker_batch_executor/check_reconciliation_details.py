import csv
import json

with open('.antigravity/laforet-reconciliation/RECONCILIATION.csv', mode='r', encoding='utf-8') as f:
    reconciliation = list(csv.DictReader(f))

with open('.antigravity/laforet-reconciliation/OUEDKNISS_INVENTORY.csv', mode='r', encoding='utf-8') as f:
    inventory = {r['source_id']: r for r in csv.DictReader(f)}

with open('.antigravity/laforet-reconciliation/OUEDKNISS_PHOTO_MANIFEST.csv', mode='r', encoding='utf-8') as f:
    photo_manifest = list(csv.DictReader(f))

photos_by_source = {}
for p in photo_manifest:
    sid = p['source_id']
    if sid not in photos_by_source:
        photos_by_source[sid] = []
    photos_by_source[sid].append(p)

print(f"Total reconciliation rows: {len(reconciliation)}")
print(f"Total inventory items: {len(inventory)}")
print(f"Total photo manifest rows: {len(photo_manifest)}")

for dec in ['UPDATE_FIELDS_AND_PHOTOS', 'UPDATE_FIELDS', 'CREATE_NEW', 'KEEP_AS_IS', 'DELETE_CONFIRMED_MOCKUP']:
    subset = [r for r in reconciliation if r['decision'] == dec]
    print(f"\nDecision: {dec} (Count: {len(subset)})")
    for r in subset:
        sid = r['source_id']
        aid = r['admin_record_id']
        status = r['completion_status']
        inv = inventory.get(sid, {})
        photo_count = len(photos_by_source.get(sid, []))
        title = inv.get('title', 'N/A')
        print(f"  Source: {sid:<10} Admin: {aid:<25} Status: {status:<15} Photos: {photo_count:<3} Title: {title[:40]}")
