import json

with open('c:/Users/pc/Desktop/website REALESTATE la foret/.agents/teamwork/explorer_m1_ouedkniss/store_announcements_raw.json', 'r', encoding='utf-8') as f:
    items = json.load(f)

print(f"Total items loaded: {len(items)}")

pages = {}
for it in items:
    p = it['source_page']
    pages.setdefault(p, []).append(it)

for p in sorted(pages.keys()):
    print(f"\n--- Page {p} ({len(pages[p])} items) ---")
    for it in pages[p]:
        cat_slug = it.get('category', {}).get('slug') if it.get('category') else 'no-cat'
        title = it.get('title', '')
        status = it.get('status', '')
        print(f"  ID: {it['id']:<10} | Cat: {cat_slug:<25} | Title: {title[:50]} (Status: {status})")
