import csv
import json

with open('.antigravity/laforet-reconciliation/RECONCILIATION.csv', mode='r', encoding='utf-8') as f:
    recon = list(csv.DictReader(f))

with open('.antigravity/laforet-reconciliation/OUEDKNISS_INVENTORY.csv', mode='r', encoding='utf-8') as f:
    inv = {r['source_id']: r for r in csv.DictReader(f)}

with open('.antigravity/laforet-reconciliation/OUEDKNISS_PHOTO_MANIFEST.csv', mode='r', encoding='utf-8') as f:
    manifest = list(csv.DictReader(f))

photos_by_source = {}
for p in manifest:
    sid = p['source_id']
    if sid not in photos_by_source:
        photos_by_source[sid] = []
    photos_by_source[sid].append(p)

planned = [r for r in recon if r['completion_status'] == 'PLANNED' and r['decision'] != 'DELETE_CONFIRMED_MOCKUP']

print(f"Planned mutations count: {len(planned)}")
for i, r in enumerate(planned):
    sid = r['source_id']
    item = inv[sid]
    photos = photos_by_source.get(sid, [])
    print(f"[{i+1}] SID: {sid} | Decision: {r['decision']} | AdminID: {r['admin_record_id']}")
    print(f"    Title: {item['source_title']}")
    print(f"    Type: {item['transaction_type']} | Cat: {item['property_category']} | Price: {item['price']} {item['price_unit']} | Area: {item['surface']}")
    print(f"    Location: Wilaya={item['wilaya']}, Commune={item['commune']}, Address={item['address_if_listed']}")
    print(f"    Rooms: {item['rooms']}, Bed: {item['bedrooms']}, Bath: {item['bathrooms']}")
    print(f"    Photos in manifest: {len(photos)}")
