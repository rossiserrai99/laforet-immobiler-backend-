import csv

with open('.antigravity/laforet-reconciliation/RECONCILIATION.csv', mode='r', encoding='utf-8') as f:
    recon = list(csv.DictReader(f))

with open('.antigravity/laforet-reconciliation/OUEDKNISS_INVENTORY.csv', mode='r', encoding='utf-8') as f:
    inv = {r['source_id']: r for r in csv.DictReader(f)}

for r in recon:
    sid = r['source_id']
    if sid in ['58058097', '57924648', '57296094', '57691038', '57690858', '57924513']:
        print(f"\nSID: {sid} | Decision: {r['decision']}")
        print(f"  Admin ID: {r['admin_record_id']}")
        print(f"  Match Evidence: {r['match_evidence']}")
        print(f"  Field Updates: {r['field_updates_needed']}")
