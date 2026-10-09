import urllib.request
import re
import json

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

html = urllib.request.urlopen(urllib.request.Request('https://www.ouedkniss.com/store/5451/agence-laforet/accueil', headers=headers)).read().decode('utf-8', errors='ignore')

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
        print("Error:", e)

for url in js_urls:
    if 'Show.' in url or '3083.' in url:
        print("Fetching:", url)
        try:
            content = urllib.request.urlopen(urllib.request.Request(url, headers=headers), timeout=10).read().decode('utf-8', errors='ignore')
            for target in ['AnnouncementGet', 'AnnouncementDetails', 'AnnounFetch']:
                idx = content.find(target)
                if idx != -1:
                    print(f"Found {target} in {url}")
                    start = max(0, idx - 50)
                    print(content[start:start+1000])
        except Exception as e:
            print("Error fetching", url, e)
