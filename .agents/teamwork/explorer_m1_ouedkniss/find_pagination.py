import urllib.request
import re
import json

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

# Search all JS files for 'storeGet' or 'announcements(' or store pagination
html = urllib.request.urlopen(urllib.request.Request('https://www.ouedkniss.com/store/5451/agence-laforet/accueil', headers=headers)).read().decode('utf-8', errors='ignore')
js_urls = re.findall(r'https://cdn\.ouedkniss\.com/app/static/js/[^"\']+', html)

preload_match = re.search(r'var pathToFilesToPreloadMapping\s*=\s*(\{.*?\});', html, re.DOTALL)
if preload_match:
    try:
        mapping = json.loads(preload_match.group(1))
        for k, v in mapping.items():
            if isinstance(v, list):
                js_urls.extend(v)
    except:
        pass

for url in set(js_urls):
    try:
        content = urllib.request.urlopen(urllib.request.Request(url, headers=headers), timeout=10).read().decode('utf-8', errors='ignore')
        if 'announcements(' in content and 'page:' in content:
            print("Found announcements(page:) in", url.split('/')[-1])
            matches = re.finditer(r'announcements\([^)]+\)', content)
            for m in matches:
                print(" ", m.group(0))
        if 'StoreGet' in content or 'storeGet' in content:
            # find where storeGet is called
            matches = re.finditer(r'storeGet\([^)]+\)', content)
            for m in matches:
                print(" ", url.split('/')[-1], m.group(0))
    except Exception as e:
        pass
