import csv

with open('.antigravity/laforet-reconciliation/RECONCILIATION.csv', mode='r', encoding='utf-8') as f:
    recon = list(csv.DictReader(f))

with open('.antigravity/laforet-reconciliation/OUEDKNISS_INVENTORY.csv', mode='r', encoding='utf-8') as f:
    inv = {r['source_id']: r for r in csv.DictReader(f)}

planned = [r for r in recon if r['completion_status'] == 'PLANNED' and r['decision'] != 'DELETE_CONFIRMED_MOCKUP']

empty_desc = []
for r in planned:
    sid = r['source_id']
    desc = inv[sid].get('description_clean', '').strip()
    if not desc:
        empty_desc.append(sid)

print(f"Items with empty description: {len(empty_desc)}")
if empty_desc:
    print(empty_desc)
