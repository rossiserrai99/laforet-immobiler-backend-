import urllib.request
import json

url = 'https://api.ouedkniss.com/graphql'
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    'Content-Type': 'application/json',
    'Origin': 'https://www.ouedkniss.com',
    'Referer': 'https://www.ouedkniss.com/store/5451/agence-laforet/accueil'
}

# Check fields on Announcement and AnnouncementDetails
test_announ = """
query AnnouncementGet($id: ID!) {
  announcement: announcementDetails(id: $id) {
    id
    title
    slug
    createdAt
    status
    likeCount
    price
    priceUnit
    priceType
    description
    phone
    hasPhone
    user {
      id
      username
    }
    store {
      id
      name
      slug
    }
    category {
      id
      name
      slug
    }
    cities {
      id
      name
      region {
        id
        name
      }
    }
    defaultMedia(size: LARGE) {
      mediaUrl
    }
    medias {
      mediaUrl
      mimeType
      thumbnail
    }
    specs {
      specification {
        id
        name
        code
        type
      }
      valueText
      value
    }
  }
}
"""

payload = {
    "operationName": "AnnouncementGet",
    "query": test_announ,
    "variables": {"id": "58058031"}
}

req = urllib.request.Request(url, data=json.dumps(payload).encode('utf-8'), headers=headers, method='POST')
try:
    with urllib.request.urlopen(req, timeout=10) as resp:
        print("Status:", resp.status)
        data = json.loads(resp.read().decode('utf-8'))
        print(json.dumps(data, indent=2, ensure_ascii=False)[:2000])
except Exception as e:
    print("Error:", e)
    if hasattr(e, 'read'):
        print("Body:", e.read().decode('utf-8'))
