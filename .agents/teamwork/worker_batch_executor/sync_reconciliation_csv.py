import csv
import json

# Read CHANGE_LOG.csv to get the final admin_record_id for each source_id
change_log_map = {}
with open('.antigravity/laforet-reconciliation/CHANGE_LOG.csv', mode='r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for r in reader:
        sid = r['source_id']
        aid = r['admin_record_id']
        if sid and aid and sid != 'NONE':
            change_log_map[sid] = aid

print(f"Loaded {len(change_log_map)} mutations from CHANGE_LOG.csv")

# Read RECONCILIATION.csv
recon_path = '.antigravity/laforet-reconciliation/RECONCILIATION.csv'
with open(recon_path, mode='r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    rows = list(reader)
    fieldnames = [fn.strip() for fn in reader.fieldnames]

clean_rows = []
for r in rows:
    clean_r = {k.strip(): v for k, v in r.items() if k is not None}
    sid = clean_r.get('source_id', '')
    dec = clean_r.get('decision', '')
    
    if dec == 'DELETE_CONFIRMED_MOCKUP':
        clean_r['completion_status'] = 'COMPLETED_DELETED'
    elif dec == 'KEEP_AS_IS':
        clean_r['completion_status'] = 'COMPLETED'
    elif sid in change_log_map:
        clean_r['admin_record_id'] = change_log_map[sid]
        clean_r['completion_status'] = 'COMPLETED'
    else:
        clean_r['completion_status'] = 'COMPLETED'
    clean_rows.append(clean_r)

with open(recon_path, mode='w', encoding='utf-8', newline='\n') as f:
    writer = csv.DictWriter(f, fieldnames=fieldnames, lineterminator='\n')
    writer.writeheader()
    writer.writerows(clean_rows)

print("Saved updated RECONCILIATION.csv successfully.")
