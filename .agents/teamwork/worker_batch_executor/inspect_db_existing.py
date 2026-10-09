import urllib.request
import json

admin_ids = [
    '6ac80ff7c5b7e8884199e671',
    '6ac81016c5b7e8884199e694',
    '6ac80eacc5b7e8884199e5d6',
    '6ac80ea6c5b7e8884199e5c8',
    '6ac80ff0c5b7e8884199e65e',
    '6ac80ff2c5b7e8884199e665',
    '6ac80fedc5b7e8884199e657',
    '6ac80feac5b7e8884199e650'
]

# Fetch all properties from backend
req = urllib.request.urlopen('http://localhost:5000/api/properties?limit=200')
data = json.loads(req.read().decode('utf-8'))
all_props = {p['_id']: p for p in data['data']['properties']}

print(f"Total properties in API response: {len(all_props)}")
for aid in admin_ids:
    p = all_props.get(aid)
    if p:
        print(f"\nID: {aid}")
        print(f"  Title: {p.get('title')}")
        print(f"  Slug: {p.get('slug')}")
        print(f"  Ref: {p.get('reference')}")
        print(f"  Type: {p.get('type')}, Cat: {p.get('category')}")
        print(f"  Price: {p.get('price')}, PriceHidden: {p.get('priceHidden')}")
        print(f"  Area: {p.get('area')}")
        print(f"  Commune: {p.get('location', {}).get('commune')}")
        print(f"  Images: {len(p.get('media', {}).get('images', []))}")
    else:
        print(f"ID {aid} NOT FOUND!")
