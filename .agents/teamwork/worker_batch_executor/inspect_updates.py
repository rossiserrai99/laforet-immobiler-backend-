import csv
import json

with open('.antigravity/laforet-reconciliation/RECONCILIATION.csv', mode='r', encoding='utf-8') as f:
    recon = list(csv.DictReader(f))

with open('.antigravity/laforet-reconciliation/OUEDKNISS_INVENTORY.csv', mode='r', encoding='utf-8') as f:
    inv = {r['source_id']: r for r in csv.DictReader(f)}

updates = [r for r in recon if r['decision'] in ['UPDATE_FIELDS_AND_PHOTOS', 'UPDATE_FIELDS']]

print(f"Total update records: {len(updates)}")
for u in updates:
    sid = u['source_id']
    aid = u['admin_record_id']
    item = inv.get(sid, {})
    print(f"\n--- SID: {sid} | AdminID: {aid} | Decision: {u['decision']} | Status: {u['completion_status']} ---")
    print(f"Field updates needed: {u['field_updates_needed']}")
    print(f"Photo updates needed: {u['photo_updates_needed']}")
    print(f"Source Title: {item.get('source_title')}")
    print(f"Source Price: {item.get('price')} {item.get('price_unit')}")
    print(f"Source Area: {item.get('surface')}")
