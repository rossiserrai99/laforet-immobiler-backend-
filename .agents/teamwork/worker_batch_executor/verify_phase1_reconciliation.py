import csv

with open('.antigravity/laforet-reconciliation/RECONCILIATION.csv', mode='r', encoding='utf-8') as f:
    rows = list(csv.DictReader(f))

eligible = [r for r in rows if r['decision'] != 'DELETE_CONFIRMED_MOCKUP']
mockups = [r for r in rows if r['decision'] == 'DELETE_CONFIRMED_MOCKUP']

print(f"Total rows: {len(rows)}")
print(f"Eligible rows: {len(eligible)}")
print(f"Mockup rows: {len(mockups)}")

statuses = {}
for r in eligible:
    st = r['completion_status']
    statuses[st] = statuses.get(st, 0) + 1

print("\nEligible statuses breakdown:")
for st, cnt in statuses.items():
    print(f"  {st}: {cnt}")

planned_eligible = [r for r in eligible if r['completion_status'] == 'PLANNED']
print(f"\nEligible with PLANNED status ({len(planned_eligible)}):")
for r in planned_eligible:
    print(f"  SID: {r['source_id']}, Decision: {r['decision']}, Admin ID: {r['admin_record_id']}")
