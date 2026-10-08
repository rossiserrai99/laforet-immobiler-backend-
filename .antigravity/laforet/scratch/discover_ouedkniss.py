import urllib.request
import re

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

html = urllib.request.urlopen(urllib.request.Request('https://www.ouedkniss.com/store/5451/agence-laforet/accueil', headers=headers)).read().decode('utf-8', errors='ignore')
srcs = re.findall(r'src=["\'](https://cdn\.ouedkniss\.com/app/static/js/[^"\']+)["\']', html)

print(f"Checking {len(srcs)} JS files...")
for url in srcs:
    try:
        content = urllib.request.urlopen(urllib.request.Request(url, headers=headers)).read().decode('utf-8', errors='ignore')
        # Look for graphql operations or store endpoints
        queries = re.findall(r'(query\s+[A-Za-z0-9_]+\s*\(.*?\)\s*\{.*?\})', content)
        if queries:
            print(f"File {url.split('/')[-1]} has {len(queries)} explicit queries")
            for q in queries[:3]:
                print("  Query:", q[:120])
        # Look for operation names
        op_names = re.findall(r'operationName["\']?\s*:\s*["\']([A-Za-z0-9_]+)["\']', content)
        if op_names:
            print(f"File {url.split('/')[-1]} has operationNames:", set(op_names))
        # Look for references to "store" or "5451"
        if 'storeGet' in content or 'storeSearch' in content or 'storeBySlug' in content or 'Store(' in content:
            print(f"File {url.split('/')[-1]} mentions store query keywords!")
            matches = re.findall(r'([A-Za-z0-9_]*[sS]tore[A-Za-z0-9_]*)', content)
            print("  Keywords:", set([m for m in matches if len(m) < 30])[:10])
    except Exception as e:
        print(f"Err {url}: {e}")
