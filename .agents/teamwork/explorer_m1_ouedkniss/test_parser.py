import json
import re

with open('c:/Users/pc/Desktop/website REALESTATE la foret/.agents/teamwork/explorer_m1_ouedkniss/ouedkniss_detailed_all.json', 'r', encoding='utf-8') as f:
    records = json.load(f)

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

# Map aliases / sub-districts / unaccented names to official communes
COMMUNE_MAP = {
    'alger centre': 'Alger Centre',
    'telemly': 'Alger Centre',
    'didouche mourad': 'Alger Centre',
    'zirout youcef': 'Alger Centre',
    'sacre-coeur': 'Alger Centre',
    'sacré-coeur': 'Alger Centre',
    'miramar': 'Bologhine',
    'bologhine': 'Bologhine',
    'el biar': 'El Biar',
    'poirson': 'El Biar',
    'saint-raphael': 'El Biar',
    'saint-raphaël': 'El Biar',
    'hydra': 'Hydra',
    'val d\'hydra': 'Hydra',
    'sidi yahia': 'Hydra',
    'mohammadia': 'Mohammadia',
    'la vigerie': 'Mohammadia',
    'la vigérie': 'Mohammadia',
    'khalifati': 'Mohammadia',
    'birkhadem': 'Birkhadem',
    'el mouradia': 'El Mouradia',
    'el madania': 'El Madania',
    'bab el oued': 'Bab El Oued',
    'hussein dey': 'Hussein Dey',
    'el achour': 'El Achour',
    'bir mourad rais': 'Bir Mourad Raïs',
    'bir mourad raïs': 'Bir Mourad Raïs',
    'sidi mhamed': 'Sidi M\'Hamed',
    'sidi m\'hamed': 'Sidi M\'Hamed',
    'douera': 'Douera',
    'draria': 'Draria',
    'bab ezzouar': 'Bab Ezzouar',
    'gue de constantine': 'Djasr Kasentina',
    'djasr kasentina': 'Djasr Kasentina',
    'kouba': 'Kouba',
    'cheraga': 'Chéraga',
    'chéraga': 'Chéraga',
    'dely ibrahim': 'Dely Ibrahim',
    'ben aknoun': 'Ben Aknoun',
    'bouzareah': 'Bouzaréah',
    'bouzaréah': 'Bouzaréah',
}

def clean_text(text):
    if not text:
        return ''
    # Fix common encoding corruptions if any
    replacements = {
        '': 'e',
        'rsidence': 'résidence',
        'bti': 'bâti',
        'fort': 'forêt',
        'Quartier rsidentiel': 'Quartier résidentiel',
        'scuris': 'sécurisé',
        'ct': 'côté',
        'ngociable': 'négociable',
        'lgrement': 'légèrement',
        'intermdiaire': 'intermédiaire',
        'sabstenir': 's\'abstenir',
        'sil': 's\'il',
        'plat': 'plaît',
        'lagence': 'l\'agence',
        'immobilire': 'immobilière',
        'Lafort': 'Laforêt',
        'dune': 'd\'une',
        'm': 'm²',
    }
    for k, v in replacements.items():
        text = text.replace(k, v)
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def parse_listing(r):
    ann_id = str(r['id'])
    cat_slug = (r.get('category') or {}).get('slug', '')
    cat_name = (r.get('category') or {}).get('name', '')
    title = clean_text(r.get('title', ''))
    desc = clean_text(r.get('description', ''))
    page = r.get('source_page_number', 1)
    
    # Check eligibility
    is_cherche = (
        'cherche' in cat_slug or 
        'demande' in cat_slug or 
        'echange' in cat_slug or
        any(w in title.lower() for w in ['cherche', 'recherche', 'demande', 'échange', 'echange', 'offre de service'])
    )
    
    if is_cherche:
        eligibility = 'EXCLUDED'
        elig_evidence = f"Disqualifié per Master Brief §3A: Demande/Recherche de client ({cat_slug})"
        trans_type = 'Demande/Recherche'
    else:
        eligibility = 'ELIGIBLE'
        if 'vente' in cat_slug:
            trans_type = 'Vente'
            elig_evidence = "Offre explicite de vente immobilière"
        elif 'location' in cat_slug:
            trans_type = 'Location'
            elig_evidence = "Offre explicite de location immobilière"
        else:
            trans_type = 'Vente' if 'vente' in title.lower() else 'Location'
            elig_evidence = f"Offre explicite de {trans_type.lower()} immobilière"
            
    # Category normalization
    combined_text = (title + " " + desc + " " + cat_name).lower()
    if 'duplex' in combined_text:
        prop_cat = 'Duplex'
    elif 'triplex' in combined_text:
        prop_cat = 'Triplex'
    elif 'studio' in combined_text:
        prop_cat = 'Studio'
    elif 'villa' in combined_text or 'résidence' in combined_text:
        prop_cat = 'Villa'
    elif 'terrain' in combined_text:
        prop_cat = 'Terrain'
    elif 'local' in combined_text or 'commerce' in combined_text or 'magasin' in combined_text:
        prop_cat = 'Local Commercial'
    elif 'bureau' in combined_text:
        prop_cat = 'Bureau'
    elif 'immeuble' in combined_text:
        prop_cat = 'Immeuble'
    elif 'appartement' in combined_text or re.search(r'\bf[1-9]\b', combined_text):
        prop_cat = 'Appartement'
    else:
        prop_cat = 'Villa' if 'villa' in cat_slug else ('Appartement' if 'appartement' in cat_slug else 'Autre')
        
    # Location mapping
    cities = r.get('cities') or []
    city_raw = cities[0].get('name', '') if cities else ''
    
    # Commune matching
    commune_matched = 'Alger Centre' # fallback default
    for alias, comm in COMMUNE_MAP.items():
        if alias in combined_text or alias in city_raw.lower():
            commune_matched = comm
            break
            
    # Surface extraction
    surface = ''
    rooms = ''
    bedrooms = ''
    bathrooms = ''
    floor = ''
    
    for s in r.get('specs') or []:
        codename = s.get('specification', {}).get('codename', '')
        val = s.get('value', [''])[0] if s.get('value') else ''
        val_txt = s.get('valueText', [''])[0] if s.get('valueText') else ''
        
        if codename in ['superficie', 'superficie_terrain', 'superficie_batie']:
            if val and not surface:
                surface = str(val)
        if codename in ['pieces', 'pieces_appartement']:
            if val:
                rooms = str(val).replace('f', '').replace('F', '')
        if codename in ['etage_appartement', 'etages', 'etages_villa']:
            if val_txt:
                floor = val_txt
            elif val:
                floor = str(val)
                
    # Regex fallbacks if missing in specs
    if not surface:
        m_surf = re.search(r'(\d+)\s*(?:m²|m2|mètres carrés|metres carres)', combined_text)
        if m_surf:
            surface = m_surf.group(1)
            
    if not rooms:
        m_rooms = re.search(r'\b[fF](\d)\b', combined_text)
        if m_rooms:
            rooms = m_rooms.group(1)
        else:
            m_pc = re.search(r'(\d+)\s*(?:pièces|pieces|chambres)', combined_text)
            if m_pc:
                rooms = m_pc.group(1)
                
    # Floor fallback
    if not floor:
        m_fl = re.search(r'(\d+(?:er|ème|eme|e)?\s*étage|rez[- ]de[- ]chaussée|r\+[0-4]|sous[- ]sol)', combined_text)
        if m_fl:
            floor = m_fl.group(1)

    # Price handling
    raw_price = r.get('price')
    price_unit = r.get('priceUnit', '')
    price_preview = r.get('pricePreview')
    
    # Calculate price in base DZD
    price_dzd = ''
    unit_str = 'DZD' if trans_type == 'Vente' else 'DZD / mois'
    
    if raw_price is not None:
        try:
            rp = float(raw_price)
            if price_unit == 'MILLION':
                # On Ouedkniss, when priceUnit is MILLION and preview is e.g. 210,
                # 210 millions de centimes = 2 100 000 DA, OR 210 millions DA = 210 000 000 DA?
                # In Algerian real estate, large villa prices e.g. 210, 485, 650 are in millions de DA:
                # 210 millions DA = 210,000,000 DZD!
                # If preview is 210, price_dzd is preview * 1,000,000 = 210,000,000
                if price_preview is not None and float(price_preview) > 0:
                    price_dzd = str(int(float(price_preview) * 1000000))
                else:
                    price_dzd = str(int(rp * 100)) # centimes to DA
            elif price_unit == 'UNIT':
                price_dzd = str(int(rp))
            elif price_unit == 'UNIT_PER_SQUARE':
                # e.g. 175000 / m²
                unit_str = 'DZD / m²'
                price_dzd = str(int(rp))
            else:
                price_dzd = str(int(rp))
        except:
            price_dzd = str(raw_price)
            
    # Deduplicate key
    surf_key = surface if surface else 'ns'
    dup_key = f"LF-OK-{ann_id}-{commune_matched.replace(' ', '')}-{surf_key}"
    
    # Photos
    medias = r.get('medias') or []
    photo_count = len(medias)
    manifest_keys = ";".join([f"LF-OK-{ann_id}-{i+1:02d}" for i in range(photo_count)])
    
    slug = r.get('slug', f"annonce-{ann_id}")
    canonical_url = f"https://www.ouedkniss.com/{slug}-{ann_id}"
    
    return {
        'source_id': ann_id,
        'canonical_source_url': canonical_url,
        'source_page_number': page,
        'source_title': title,
        'transaction_type': trans_type,
        'property_category': prop_cat,
        'price': price_dzd,
        'price_unit': unit_str,
        'wilaya': 'Alger',
        'city': 'Alger',
        'commune': commune_matched,
        'surface': surface,
        'rooms': rooms,
        'floor': floor,
        'description_clean': desc,
        'photo_count': photo_count,
        'photo_manifest_keys': manifest_keys,
        'eligibility': eligibility,
        'eligibility_evidence': elig_evidence,
        'duplicate_key': dup_key,
        'medias': medias
    }

parsed_eligible = [parse_listing(r) for r in records if is_eligible(r)]
print(f"Parsed {len(parsed_eligible)} eligible listings successfully!")
for p in parsed_eligible[:5]:
    print(f"ID {p['source_id']} | {p['transaction_type']} | {p['property_category']} | {p['commune']} | Surf: {p['surface']}m² | Price: {p['price']} {p['price_unit']} | Photos: {p['photo_count']} | Key: {p['duplicate_key']}")
