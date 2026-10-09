import urllib.request
import re

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

for fname in ['3083.75f21e1782a860c4.3.8.14.m.js', 'index~2.e7fa2fd1d1c83171.3.8.14.m.js']:
    url = f'https://cdn.ouedkniss.com/app/static/js/{fname}'
    content = urllib.request.urlopen(urllib.request.Request(url, headers=headers)).read().decode('utf-8', errors='ignore')
    print(f"=== QUERIES IN {fname} ===")
    matches = re.finditer(r'(query\s+[A-Za-z0-9_]+\s*(?:\([^)]*\))?\s*\{)', content)
    for m in matches:
        start = m.start()
        depth = 0
        end = start
        for i in range(start, min(start + 8000, len(content))):
            if content[i] == '{':
                depth += 1
            elif content[i] == '}':
                depth -= 1
                if depth == 0:
                    end = i + 1
                    break
        query_text = content[start:end]
        op_match = re.match(r'query\s+([A-Za-z0-9_]+)', query_text)
        if op_match:
            op_name = op_match.group(1)
            print(f"\n--- Operation: {op_name} ---")
            print(query_text[:1000])
