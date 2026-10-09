import csv
import json
import urllib.request

# 1. Fetch DB properties
req = urllib.request.urlopen('http://localhost:5000/api/properties?limit=200')
db_data = json.loads(req.read().decode('utf-8'))
db_props = {p['_id']: p for p in db_data['data']['properties']}

# 2. Read RECONCILIATION.csv mockups
with open('.antigravity/laforet-reconciliation/RECONCILIATION.csv', mode='r', encoding='utf-8') as f:
    recon_mockups = [r for r in csv.DictReader(f) if r['decision'] == 'DELETE_CONFIRMED_MOCKUP']

print(f"Total mockups in RECONCILIATION.csv: {len(recon_mockups)}")
print(f"Total properties in DB: {len(db_props)}")

found_count = 0
for i, m in enumerate(recon_mockups):
    aid = m['admin_record_id']
    prop = db_props.get(aid)
    if prop:
        found_count += 1
        print(f"[{i+1}/12] FOUND in DB: ID={aid} | Ref={prop.get('reference')} | Title={prop.get('title')} | Type={prop.get('type')}")
    else:
        print(f"[{i+1}/12] NOT FOUND in DB: ID={aid}")

print(f"\nTotal mockups matched in DB: {found_count}/12")
