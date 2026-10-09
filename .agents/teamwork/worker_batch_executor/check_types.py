import csv

with open('.antigravity/laforet-reconciliation/RECONCILIATION.csv', mode='r', encoding='utf-8') as f:
    recon = list(csv.DictReader(f))

with open('.antigravity/laforet-reconciliation/OUEDKNISS_INVENTORY.csv', mode='r', encoding='utf-8') as f:
    inv = {r['source_id']: r for r in csv.DictReader(f)}

eligible = [r for r in recon if r['decision'] != 'DELETE_CONFIRMED_MOCKUP']

types = {}
for r in eligible:
    sid = r['source_id']
    t = inv[sid]['transaction_type']
    types[t] = types.get(t, 0) + 1

print(f"Total eligible: {len(eligible)}")
print("Transaction types count:")
for t, c in types.items():
    print(f"  {t}: {c}")
