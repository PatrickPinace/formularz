#!/usr/bin/env python3
"""
Skrypt konwertujący kolumny SingleSelect na SingleLineText w NocoDB
Rozwiązuje problem z pustymi opcjami w kolumnach SingleSelect
"""
import requests
import json

NOCODB_URL = "https://crm.mediprima.pl"
TOKEN = "cuaddLZClFnX-vCXagjMaR8VvrMvMWmWTbcxFO4J"
TABLE_ID = "mvb4ui8qnn2btxm"

headers = {
    "xc-token": TOKEN,
    "Content-Type": "application/json"
}

# Kolumny do konwersji z SingleSelect na SingleLineText
columns_to_convert = [
    "midwife_choice",
    "pregnancy_care",
    "hospitalization",
    "multiple_pregnancy",
    "postpartum_same_address",
    "birth_school",
    "participation_preference",
    "how_found",
]

print(f"Pobieranie metadanych tabeli {TABLE_ID}...\n")

# Pobierz metadane tabeli z wszystkimi kolumnami
response = requests.get(
    f"{NOCODB_URL}/api/v2/meta/tables/{TABLE_ID}",
    headers=headers
)

if response.status_code != 200:
    print(f"❌ Błąd pobierania metadanych: {response.status_code}")
    print(response.text)
    exit(1)

table_meta = response.json()
columns = table_meta.get("columns", [])

print(f"Znaleziono {len(columns)} kolumn w tabeli\n")

# Znajdź kolumny do konwersji
columns_found = {}
for col in columns:
    if col["column_name"] in columns_to_convert:
        columns_found[col["column_name"]] = {
            "id": col["id"],
            "title": col["title"],
            "uidt": col["uidt"]
        }

print(f"Kolumny do konwersji ({len(columns_found)}):")
for name, info in columns_found.items():
    print(f"  - {name} (ID: {info['id']}, Type: {info['uidt']})")
print()

# Konwertuj każdą kolumnę
converted = 0
errors = 0

for col_name in columns_to_convert:
    if col_name not in columns_found:
        print(f"⚠️  Kolumna {col_name} nie znaleziona w tabeli")
        continue

    col_info = columns_found[col_name]
    col_id = col_info["id"]
    current_type = col_info["uidt"]

    print(f"Konwersja: {col_name} ({current_type} → SingleLineText)")

    # PATCH kolumny - zmiana typu na SingleLineText
    update_data = {
        "uidt": "SingleLineText",
        "column_name": col_name,
        "title": col_info["title"]
    }

    response = requests.patch(
        f"{NOCODB_URL}/api/v2/meta/columns/{col_id}",
        headers=headers,
        json=update_data
    )

    if response.status_code in [200, 201]:
        print(f"  ✅ Skonwertowano pomyślnie")
        converted += 1
    else:
        print(f"  ❌ Błąd: {response.status_code}")
        print(f"     {response.text}")
        errors += 1
    print()

print(f"\n{'='*60}")
print(f"Podsumowanie:")
print(f"  ✅ Skonwertowano: {converted}")
print(f"  ❌ Błędy: {errors}")
print(f"{'='*60}\n")

if errors == 0:
    print("✅ Wszystkie kolumny zostały pomyślnie skonwertowane!")
else:
    print(f"⚠️  Konwersja zakończona z {errors} błędami")
