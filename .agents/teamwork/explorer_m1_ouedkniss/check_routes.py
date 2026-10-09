import urllib.request
import re
import json

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

html = urllib.request.urlopen(urllib.request.Request('https://www.ouedkniss.com/store/5451/agence-laforet/accueil', headers=headers)).read().decode('utf-8', errors='ignore')

# Print all script tags in html
scripts = re.findall(r'<script[^>]*src=["\']([^"\']+)["\']', html)
print("Scripts directly in HTML:")
for s in scripts:
    print(" ", s)

# Print preload mapping keys
preload_match = re.search(r'var pathToFilesToPreloadMapping\s*=\s*(\{.*?\});', html, re.DOTALL)
if preload_match:
    mapping = json.loads(preload_match.group(1))
    print("\nPreload mapping keys matching store:")
    for k in mapping.keys():
        if 'store' in k.lower():
            print(f"Key: {k} -> {mapping[k]}")
