import urllib.request
import json

url = 'https://api.ouedkniss.com/graphql'
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    'Content-Type': 'application/json',
    'Origin': 'https://www.ouedkniss.com',
    'Referer': 'https://www.ouedkniss.com/store/5451/agence-laforet/accueil'
}

# Let's test default count when count is omitted
q_default = """
query StoreGet($id: ID!) {
  store: storeGet(id: $id) {
    id
    name
    announcementsCount
    announcements(page: 1) {
      data {
        id
        title
      }
    }
  }
}
"""

req = urllib.request.Request(url, data=json.dumps({"query": q_default, "variables": {"id": "5451"}}).encode('utf-8'), headers=headers, method='POST')
try:
    with urllib.request.urlopen(req, timeout=10) as resp:
        res = json.loads(resp.read().decode('utf-8'))
        items = res['data']['store']['announcements']['data']
        print(f"When count is omitted: {len(items)} items returned on page 1")
except Exception as e:
    print("Error:", e)
    if hasattr(e, 'read'):
        print("Body:", e.read().decode('utf-8'))

# Let's check pages 1, 2, 3, 4, 5 with default count
for p in range(1, 7):
    q_page = f"""
    query StoreGet($id: ID!) {{
      store: storeGet(id: $id) {{
        announcements(page: {p}) {{
          data {{
            id
            title
            slug
          }}
        }}
      }}
    }}
    """
    req = urllib.request.Request(url, data=json.dumps({"query": q_page, "variables": {"id": "5451"}}).encode('utf-8'), headers=headers, method='POST')
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            res = json.loads(resp.read().decode('utf-8'))
            items = res['data']['store']['announcements']['data']
            print(f"Page {p} (default): {len(items)} items. First ID: {items[0]['id'] if items else 'None'}, Last ID: {items[-1]['id'] if items else 'None'}")
    except Exception as e:
        print(f"Page {p} error: {e}")
