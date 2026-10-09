import urllib.request
import re

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

for fname in ['index~2.e7fa2fd1d1c83171.3.8.14.m.js', 'Show.8c9d19645b021821.3.8.14.m.js']:
    url = f'https://cdn.ouedkniss.com/app/static/js/{fname}'
    content = urllib.request.urlopen(urllib.request.Request(url, headers=headers)).read().decode('utf-8', errors='ignore')
    print(f"=== {fname} ===")
    
    # search for queries containing AnnouncementGet or SearchAnnouncements
    for target in ['SearchAnnouncementsQuery', 'AnnouncementGet', 'SearchStoreQuery']:
        idx = content.find(target)
        if idx != -1:
            # find surrounding query
            q_start = content.rfind('query ', 0, idx + 50)
            if q_start != -1:
                # find end of query string
                print(f"\n--- {target} ---")
                print(content[q_start:q_start+2000])
