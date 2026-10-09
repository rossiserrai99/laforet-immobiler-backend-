import urllib.request
import re
import json

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

html = urllib.request.urlopen(urllib.request.Request('https://www.ouedkniss.com/store/5451/agence-laforet/accueil', headers=headers)).read().decode('utf-8', errors='ignore')

scripts = re.findall(r'src=["\'](https://cdn\.ouedkniss\.com/app/static/js/[^"\']+)["\']', html)
print(f"Total scripts found: {len(scripts)}")

for s in scripts:
    try:
        content = urllib.request.urlopen(urllib.request.Request(s, headers=headers)).read().decode('utf-8', errors='ignore')
        matches = re.findall(r'query\s+([A-Za-z0-9_]+)', content)
        store_matches = [m for m in matches if 'store' in m.lower() or 'announ' in m.lower()]
        if store_matches:
            print(f"{s.split('/')[-1]}: {store_matches}")
    except Exception as e:
        pass
