import urllib.request
import json

url = 'https://api.ouedkniss.com/graphql'
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    'Content-Type': 'application/json',
    'Origin': 'https://www.ouedkniss.com',
    'Referer': 'https://www.ouedkniss.com/store/5451/agence-laforet/accueil'
}

all_announcements = []

for page in range(1, 15):
    query = f"""
    query StoreAnnouncements {{
      store: storeGet(id: "5451") {{
        announcements(page: {page}, count: 20) {{
          data {{
            id
            title
            slug
            createdAt
            status
            price
            priceUnit
            pricePreview
            category {{
              id
              name
              slug
              parentTree {{
                id
                name
                slug
              }}
            }}
            cities {{
              id
              name
              region {{
                id
                name
              }}
            }}
            defaultMedia {{
              mediaUrl
            }}
          }}
        }}
      }}
    }}
    """
    req = urllib.request.Request(url, data=json.dumps({"query": query}).encode('utf-8'), headers=headers, method='POST')
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            items = data['data']['store']['announcements']['data']
            print(f"Page {page}: {len(items)} items")
            if not items:
                break
            for it in items:
                it['source_page'] = page
                all_announcements.append(it)
            if len(items) < 20:
                break
    except Exception as e:
        print(f"Error on page {page}: {e}")
        break

print(f"\nTotal announcements retrieved across pages: {len(all_announcements)}")

# Save raw dump to analyze
with open('c:/Users/pc/Desktop/website REALESTATE la foret/.agents/teamwork/explorer_m1_ouedkniss/store_announcements_raw.json', 'w', encoding='utf-8') as f:
    json.dump(all_announcements, f, ensure_ascii=False, indent=2)

print("Saved to store_announcements_raw.json")
