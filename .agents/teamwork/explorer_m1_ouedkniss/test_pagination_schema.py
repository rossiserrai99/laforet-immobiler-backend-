import urllib.request
import json

url = 'https://api.ouedkniss.com/graphql'
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    'Content-Type': 'application/json',
    'Origin': 'https://www.ouedkniss.com',
    'Referer': 'https://www.ouedkniss.com/store/5451/agence-laforet/accueil'
}

# Let's inspect AnnouncementPagination fields by triggering validation error
test_fields = """
query TestPagination {
  store: storeGet(id: "5451") {
    announcements(page: 1, count: 20) {
      nonExistentField
    }
  }
}
"""

req = urllib.request.Request(url, data=json.dumps({"query": test_fields}).encode('utf-8'), headers=headers, method='POST')
try:
    with urllib.request.urlopen(req, timeout=10) as resp:
        print(resp.read().decode('utf-8'))
except urllib.error.HTTPError as e:
    print(e.read().decode('utf-8'))
