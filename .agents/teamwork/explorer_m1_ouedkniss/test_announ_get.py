import urllib.request
import json

url = 'https://api.ouedkniss.com/graphql'
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Content-Type': 'application/json',
    'Origin': 'https://www.ouedkniss.com',
    'Referer': 'https://www.ouedkniss.com/store/5451/agence-laforet/accueil'
}

query = """
query AnnouncementGet($id: ID!) {
  announcement: announcementDetails(id: $id) {
    id
    title
    slug
    description
    price
  }
}
"""

payload = {
    "operationName": "AnnouncementGet",
    "query": query,
    "variables": {"id": "58058031"}
}

req = urllib.request.Request(url, data=json.dumps(payload).encode('utf-8'), headers=headers, method='POST')
try:
    with urllib.request.urlopen(req, timeout=10) as resp:
        print("Status:", resp.status)
        res_data = resp.read().decode('utf-8')
        print("Response:", res_data[:500])
except Exception as e:
    print("Error:", e)
    if hasattr(e, 'read'):
        print("Error body:", e.read().decode('utf-8'))
