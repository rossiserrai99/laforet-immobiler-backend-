import urllib.request
import re
import json

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

html = urllib.request.urlopen(urllib.request.Request('https://www.ouedkniss.com/store/5451/agence-laforet/accueil', headers=headers)).read().decode('utf-8', errors='ignore')

# find all chunk URLs in html
chunks = re.findall(r'https://cdn\.ouedkniss\.com/app/static/js/[^"\']+', html)

# Let's inspect the JS chunks that contain "5451" or "store" or "announcements"
# Let's search for "Store" queries
test_queries = [
    # Test 1: store query
    """
    query StoreGet($id: ID, $slug: String) {
      store: storeGet(id: $id, slug: $slug) {
        id
        name
        slug
        announcementsCount
        announcements(page: 1, count: 20) {
          total
          data {
            id
            title
            slug
          }
        }
      }
    }
    """,
    # Test 2: search query filtered by store
    """
    query SearchStoreAnnouncements($filter: SearchFilterInput) {
      search(filter: $filter) {
        announcements {
          total
          data {
            id
            title
            slug
            price
          }
        }
      }
    }
    """,
    # Test 3: storeSearch
    """
    query StoreSearch($q: String, $filter: StoreSearchFilterInput) {
      searchStore: storeSearch(q: $q, filter: $filter) {
        data {
          id
          name
        }
      }
    }
    """
]

api_url = 'https://api.ouedkniss.com/graphql'
api_headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    'Content-Type': 'application/json',
    'Origin': 'https://www.ouedkniss.com',
    'Referer': 'https://www.ouedkniss.com/store/5451/agence-laforet/accueil'
}

for i, q in enumerate(test_queries):
    print(f"\n--- Testing Query {i+1} ---")
    # For query 1
    vars = {}
    if i == 0:
        vars = {"id": "5451"}
    elif i == 1:
        vars = {"filter": {"storeId": "5451", "page": 1}}
    payload = {"query": q, "variables": vars}
    req = urllib.request.Request(api_url, data=json.dumps(payload).encode('utf-8'), headers=api_headers, method='POST')
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            print("Status:", resp.status)
            print("Response:", resp.read().decode('utf-8')[:500])
    except Exception as e:
        print("Error:", e)
        if hasattr(e, 'read'):
            print("Body:", e.read().decode('utf-8')[:500])
