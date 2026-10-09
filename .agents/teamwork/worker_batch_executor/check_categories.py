import csv

with open('.antigravity/laforet-reconciliation/RECONCILIATION.csv', mode='r', encoding='utf-8') as f:
    recon = list(csv.DictReader(f))

with open('.antigravity/laforet-reconciliation/OUEDKNISS_INVENTORY.csv', mode='r', encoding='utf-8') as f:
    inv = {r['source_id']: r for r in csv.DictReader(f)}

valid_categories = {'Villa', 'Appartement', 'Studio', 'Duplex', 'Triplex', 'Terrain', 'Local Commercial', 'Bureau', 'Immeuble'}

planned = [r for r in recon if r['completion_status'] == 'PLANNED' and r['decision'] != 'DELETE_CONFIRMED_MOCKUP']

cats = set()
invalid = []
for r in planned:
    sid = r['source_id']
    cat = inv[sid].get('property_category', '').strip()
    cats.add(cat)
    if cat not in valid_categories:
        invalid.append((sid, cat, r['decision']))

print(f"Categories found: {cats}")
print(f"Invalid categories count: {len(invalid)}")
for item in invalid:
    print(f"  SID {item[0]}: category '{item[1]}' in decision {item[2]}")
