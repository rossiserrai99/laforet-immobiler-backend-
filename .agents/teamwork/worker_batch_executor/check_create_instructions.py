import csv

with open('.antigravity/laforet-reconciliation/RECONCILIATION.csv', mode='r', encoding='utf-8') as f:
    recon = list(csv.DictReader(f))

planned_create = [r for r in recon if r['decision'] == 'CREATE_NEW' and r['completion_status'] == 'PLANNED']

print(f"Total planned creates: {len(planned_create)}")
for r in planned_create:
    print(f"\nSID: {r['source_id']}")
    print(f"  Field updates: {r['field_updates_needed']}")
