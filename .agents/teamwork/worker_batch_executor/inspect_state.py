import csv

with open('.antigravity/laforet-reconciliation/RECONCILIATION.csv', mode='r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for r in reader:
        if r.get('completion_status') == 'COMPLETED_PILOT':
            print(f"Source: {r.get('source_id')}, Admin ID: {r.get('admin_record_id')}, Decision: {r.get('decision')}, Status: {r.get('completion_status')}")
