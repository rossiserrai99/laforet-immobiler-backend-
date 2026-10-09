import urllib.request
import re
import json

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

# Search in the main app chunks for route definitions
url = 'https://cdn.ouedkniss.com/app/static/js/690.16a941afc35ec288.3.8.14.m.js'
content = urllib.request.urlopen(urllib.request.Request(url, headers=headers)).read().decode('utf-8', errors='ignore')

# Let's find chunk mapping or routes
matches = re.findall(r'["\'](/store/[^"\']+)["\']', content)
print("Store routes in 690:", matches[:10])

# Let's check other chunks mentioned in html
html = urllib.request.urlopen(urllib.request.Request('https://www.ouedkniss.com/store/5451/agence-laforet/accueil', headers=headers)).read().decode('utf-8', errors='ignore')
chunks = re.findall(r'https://cdn\.ouedkniss\.com/app/static/js/[^"\']+', html)
for c in chunks:
    try:
        t = urllib.request.urlopen(urllib.request.Request(c, headers=headers), timeout=5).read().decode('utf-8', errors='ignore')
        store_chunks = re.findall(r'["\']([^"\']*Store[^"\']*\.js)["\']', t)
        if store_chunks:
            print(f"In {c.split('/')[-1]} found store chunks: {store_chunks}")
    except:
        pass
