import csv

with open('.antigravity/laforet-reconciliation/RECONCILIATION.csv', mode='r', encoding='utf-8') as f:
    recon = list(csv.DictReader(f))

with open('.antigravity/laforet-reconciliation/OUEDKNISS_INVENTORY.csv', mode='r', encoding='utf-8') as f:
    inv = {r['source_id']: r for r in csv.DictReader(f)}

planned = [r for r in recon if r['completion_status'] == 'PLANNED' and r['decision'] != 'DELETE_CONFIRMED_MOCKUP' and r['decision'] != 'KEEP_AS_IS']

types = set(inv[r['source_id']]['transaction_type'] for r in planned)
print("Transaction types in planned mutations:", types)
