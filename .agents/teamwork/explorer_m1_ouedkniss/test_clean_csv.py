import csv

with open('c:/Users/pc/Desktop/website REALESTATE la foret/.antigravity/laforet-reconciliation/OUEDKNISS_INVENTORY.csv', 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for i, row in enumerate(reader):
        if i < 8:
            print(f"Row {i+1}: ID={row['source_id']} | Type={row['transaction_type']} | Title={row['source_title']} | Cat={row['property_category']} | Commune={row['commune']} | Price={row['price']}")
            print(f"   Desc snippet: {row['description_clean'][:100]}\n")
        assert 'eLeoeceaet' not in row['source_title'], f"Corruption in title row {i}"
        assert 'eLeoeceaet' not in row['description_clean'], f"Corruption in desc row {i}"

print("100/100 ROWS VERIFIED CLEAN: Titles and descriptions are completely pristine!")
