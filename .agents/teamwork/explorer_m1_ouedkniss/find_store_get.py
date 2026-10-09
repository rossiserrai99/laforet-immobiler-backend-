import urllib.request
import re
import json

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

html = urllib.request.urlopen(urllib.request.Request('https://www.ouedkniss.com/store/5451/agence-laforet/accueil', headers=headers)).read().decode('utf-8', errors='ignore')

# Extract preload mapping
preload_match = re.search(r'var pathToFilesToPreloadMapping\s*=\s*(\{.*?\});', html, re.DOTALL)
js_urls = set(re.findall(r'https://cdn\.ouedkniss\.com/app/static/js/[^"\']+', html))
if preload_match:
    try:
        mapping = json.loads(preload_match.group(1))
        for k, v in mapping.items():
            if isinstance(v, list):
                for item in v:
                    js_urls.add(item)
    except Exception as e:
        pass

for url in js_urls:
    try:
        content = urllib.request.urlopen(urllib.request.Request(url, headers=headers), timeout=10).read().decode('utf-8', errors='ignore')
        if 'storeGet' in content:
            print(f"File {url} contains storeGet!")
            matches = re.finditer(r'query\s+([A-Za-z0-9_]+)', content)
            for m in matches:
                print("  Query name:", m.group(1))
    except Exception as e:
        pass
