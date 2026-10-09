import json
import re

with open('c:/Users/pc/Desktop/website REALESTATE la foret/.agents/teamwork/explorer_m1_ouedkniss/ouedkniss_detailed_all.json', 'r', encoding='utf-8') as f:
    records = json.load(f)

# ALGIERS_COMMUNES official list
ALGIERS_COMMUNES = [
  'Ain Benian', 'Ain Taya', 'Alger Centre', 'Bab El Oued', 'Bab Ezzouar', 'Bachdjerrah',
  'Baraki', 'Ben Aknoun', 'Belouizdad', 'Bir Mourad Raïs', 'Birkhadem', 'Bir Touta',
  'Bologhine', 'Bordj El Bahri', 'Bordj El Kiffan', 'Bouzaréah', 'Casbah', 'Chéraga',
  'Dar El Beïda', 'Dely Ibrahim', 'Djasr Kasentina', 'Douera', 'Draria', 'El Achour',
  'El Biar', 'El Harrach', 'El Magharia', 'El Madania', 'El Marsa', 'El Mouradia',
  'Hammamet', 'H\'raoua', 'Hussein Dey', 'Hydra', 'Khraicia', 'Kouba', 'Les Eucalyptus',
  'Mahelma', 'Mohammadia', 'Oued Koriche', 'Oued Smar', 'Ouled Chebel', 'Ouled Fayet',
  'Rahmania', 'Raïs Hamidou', 'Réghaïa', 'Rouiba', 'Saoula', 'Sidi Abdallah',
  'Sidi M\'Hamed', 'Sidi Moussa', 'Souidania', 'Staoueli', 'Tessala El Merdja', 'Zeralda'
]

def is_eligible(r):
    cat_slug = (r.get('category') or {}).get('slug', '')
    title = (r.get('title') or '').lower()
    if 'cherche' in cat_slug or 'demande' in cat_slug or 'echange' in cat_slug:
        return False
    if any(w in title for w in ['cherche', 'recherche', 'demande', 'échange', 'echange', 'offre de service']):
        return False
    return True

eligible_records = [r for r in records if is_eligible(r)]
print(f"Total eligible listings: {len(eligible_records)}")

for i, r in enumerate(eligible_records, 1):
    ann_id = r['id']
    title = r.get('title', '')
    cat = (r.get('category') or {}).get('name', '')
    cat_slug = (r.get('category') or {}).get('slug', '')
    price = r.get('price')
    unit = r.get('priceUnit')
    preview = r.get('pricePreview')
    page = r.get('source_page_number')
    photos = len(r.get('medias') or [])
    cities = r.get('cities') or []
    city_name = cities[0].get('name') if cities else ''
    
    # Extract surface from specs or description
    surface = ''
    rooms = ''
    for s in r.get('specs') or []:
        code = s.get('specification', {}).get('codename')
        if code in ['superficie', 'superficie_terrain', 'superficie_batie']:
            surface = s.get('value', [''])[0]
        if code in ['pieces', 'pieces_appartement']:
            rooms = s.get('value', [''])[0]
            
    print(f"{i:2d}. [P{page}] ID: {ann_id} | {cat:<12} | Price: {preview} ({unit}) | Surf: {surface}m² | R: {rooms} | Photos: {photos} | City: {city_name} | {title[:40]}")
