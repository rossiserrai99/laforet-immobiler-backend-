import json
import re

# Read ALGIERS_COMMUNES from PropertyForm.jsx
with open('c:/Users/pc/Desktop/website REALESTATE la foret/frontend/features/admin/PropertyForm.jsx', 'r', encoding='utf-8') as f:
    pf_content = f.read()

communes_block = re.search(r'const ALGIERS_COMMUNES = \[(.*?)\]\.filter', pf_content, re.DOTALL)
if communes_block:
    communes_raw = re.findall(r"'([^']+)'", communes_block.group(1))
    valid_communes = sorted(list(set(communes_raw)))
    print(f"Total valid communes in PropertyForm: {len(valid_communes)}")
    print(valid_communes)
else:
    print("Could not find ALGIERS_COMMUNES")
