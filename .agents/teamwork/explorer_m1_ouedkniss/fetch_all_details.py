import urllib.request
import json
import time

url = 'https://api.ouedkniss.com/graphql'
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Content-Type': 'application/json',
    'Origin': 'https://www.ouedkniss.com',
    'Referer': 'https://www.ouedkniss.com/store/5451/agence-laforet/accueil'
}

with open('c:/Users/pc/Desktop/website REALESTATE la foret/.agents/teamwork/explorer_m1_ouedkniss/store_announcements_raw.json', 'r', encoding='utf-8') as f:
    items = json.load(f)

print(f"Loaded {len(items)} items to fetch full details.")

query = """
query AnnouncementGet($id: ID!) {
  announcement: announcementDetails(id: $id) {
    id
    reference
    title
    slug
    description
    createdAt
    price
    pricePreview
    priceType
    priceUnit
    status
    category {
      id
      slug
      name
      parentTree {
        id
        name
        slug
      }
    }
    defaultMedia(size: LARGE) {
      mediaUrl
      mimeType
      thumbnail
    }
    medias(size: LARGE) {
      mediaUrl
      mimeType
      thumbnail
    }
    specs {
      specification {
        label
        codename
        type
      }
      value
      valueText
    }
    cities {
      id
      name
      region {
        id
        name
        slug
      }
    }
  }
}
"""

detailed_records = []
errors = []

for idx, it in enumerate(items, 1):
    ann_id = str(it['id'])
    page_num = it['source_page']
    
    payload = {
        "operationName": "AnnouncementGet",
        "query": query,
        "variables": {"id": ann_id}
    }
    
    req = urllib.request.Request(url, data=json.dumps(payload).encode('utf-8'), headers=headers, method='POST')
    success = False
    for attempt in range(3):
        try:
            with urllib.request.urlopen(req, timeout=12) as resp:
                res = json.loads(resp.read().decode('utf-8'))
                detail = res.get('data', {}).get('announcement')
                if detail:
                    detail['source_page_number'] = page_num
                    detail['raw_card_data'] = it
                    detailed_records.append(detail)
                    success = True
                    break
                else:
                    errors.append((ann_id, "No announcement in data", res))
                    break
        except Exception as e:
            if attempt == 2:
                errors.append((ann_id, str(e)))
            time.sleep(0.5)
            
    if idx % 10 == 0 or idx == len(items):
        print(f"Progress: {idx}/{len(items)} fetched (Detailed records: {len(detailed_records)}, Errors: {len(errors)})")

with open('c:/Users/pc/Desktop/website REALESTATE la foret/.agents/teamwork/explorer_m1_ouedkniss/ouedkniss_detailed_all.json', 'w', encoding='utf-8') as f:
    json.dump(detailed_records, f, ensure_ascii=False, indent=2)

print(f"\nFinished fetching details. Saved {len(detailed_records)} items to ouedkniss_detailed_all.json")
if errors:
    print(f"Total errors: {len(errors)}: {errors}")
