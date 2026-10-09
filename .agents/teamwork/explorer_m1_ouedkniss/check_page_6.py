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
query StoreAnnouncements {
  store: storeGet(id: "5451") {
    announcementsCount
    announcements(page: 6, count: 20) {
      data {
        id
        title
      }
    }
  }
}
"""

req = urllib.request.Request(url, data=json.dumps({"query": query}).encode('utf-8'), headers=headers, method='POST')
try:
    with urllib.request.urlopen(req, timeout=10) as resp:
        res = json.loads(resp.read().decode('utf-8'))
        print(json.dumps(res, indent=2))
except Exception as e:
    print("Error:", e)
    if hasattr(e, 'read'):
        print(e.read().decode('utf-8'))
