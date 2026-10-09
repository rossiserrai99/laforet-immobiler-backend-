import urllib.request
import json

url = 'https://api.ouedkniss.com/graphql'
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    'Content-Type': 'application/json',
    'Origin': 'https://www.ouedkniss.com',
    'Referer': 'https://www.ouedkniss.com/store/5451/agence-laforet/accueil'
}

query = """
query StoreGet($id: ID!) {
  store: storeGet(id: $id) {
    id
    name
    slug
    announcementsCount
    announcements(page: 1, count: 50) {
      data {
        id
        title
        slug
      }
    }
  }
}
"""

payload = {
    "query": query,
    "variables": {"id": "5451"}
}

req = urllib.request.Request(url, data=json.dumps(payload).encode('utf-8'), headers=headers, method='POST')
try:
    with urllib.request.urlopen(req, timeout=10) as resp:
        print("Status:", resp.status)
        res_data = resp.read().decode('utf-8')
        print("Response:", res_data[:1000])
except Exception as e:
    print("Error:", e)
    if hasattr(e, 'read'):
        print("Body:", e.read().decode('utf-8'))
