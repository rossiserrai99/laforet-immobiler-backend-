import csv

with open('.antigravity/laforet-reconciliation/RECONCILIATION.csv', mode='r', encoding='utf-8') as f:
    reconciliation = list(csv.DictReader(f))

with open('.antigravity/laforet-reconciliation/OUEDKNISS_PHOTO_MANIFEST.csv', mode='r', encoding='utf-8') as f:
    photo_manifest = list(csv.DictReader(f))

recon_sources = {r['source_id']: r for r in reconciliation if r['source_id'] and r['source_id'] != 'NONE'}
manifest_sources = set(p['source_id'] for p in photo_manifest)

print(f"Total eligible sources in RECONCILIATION: {len(recon_sources)}")
print(f"Sources present in photo manifest: {len(manifest_sources)}")

# Sources in manifest but not in recon
orphan_in_manifest = manifest_sources - set(recon_sources.keys())
print(f"Sources in manifest but not in recon: {orphan_in_manifest}")

# Photos per decision
photos_per_decision = {}
for p in photo_manifest:
    sid = p['source_id']
    dec = recon_sources.get(sid, {}).get('decision', 'UNKNOWN')
    photos_per_decision[dec] = photos_per_decision.get(dec, 0) + 1

print("\nPhotos per reconciliation decision:")
for dec, count in photos_per_decision.items():
    print(f"  {dec}: {count}")

# Check total photos needed for remaining mutations:
remaining_mutations = [r for r in reconciliation if r['completion_status'] == 'PLANNED' and r['decision'] in ['UPDATE_FIELDS_AND_PHOTOS', 'CREATE_NEW', 'UPDATE_FIELDS']]
photos_needed_by_source = {}
for r in remaining_mutations:
    sid = r['source_id']
    p_list = [p for p in photo_manifest if p['source_id'] == sid]
    photos_needed_by_source[sid] = len(p_list)

print(f"\nRemaining mutations needing processing: {len(remaining_mutations)}")
print(f"Total photos for remaining mutations: {sum(photos_needed_by_source.values())}")
for r in remaining_mutations:
    sid = r['source_id']
    print(f"  Source: {sid} | Decision: {r['decision']:<25} | Photos: {photos_needed_by_source[sid]}")
