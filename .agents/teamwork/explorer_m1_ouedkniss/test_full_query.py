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

payload = {
    "operationName": "AnnouncementGet",
    "query": query,
    "variables": {"id": "58058031"}
}

req = urllib.request.Request(url, data=json.dumps(payload).encode('utf-8'), headers=headers, method='POST')
try:
    with urllib.request.urlopen(req, timeout=10) as resp:
        print("Status:", resp.status)
        data = json.loads(resp.read().decode('utf-8'))
        print(json.dumps(data, indent=2, ensure_ascii=False))
except urllib.error.HTTPError as e:
    print("HTTP Error:", e.code)
    print(e.read().decode('utf-8'))
except Exception as e:
    print("Error:", e)
