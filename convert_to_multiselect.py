#!/usr/bin/env python3
"""
Skrypt konwertujący kolumny LongText (z JSON arrays) na MultiSelect w NocoDB
Dodaje predefiniowane opcje zgodne z formularzem
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

# Kolory dla opcji MultiSelect (cykl kolorów NocoDB)
COLORS = [
    "#cfdffe",  # niebieski
    "#d0f1fd",  # jasnoniebieski
    "#c2f5e8",  # zielony
    "#ffdaf6",  # różowy
    "#ffe6aa",  # żółty
    "#ffdce5",  # jasnoróżowy
    "#fee2d5",  # pomarańczowy
    "#d5f4fb",  # turkusowy
]

# Definicje kolumn do konwersji z opcjami
columns_to_convert = {
    "services_male_free": [
        "porada_lekarza",
        "porada_poloznej",
        "porada_psychologa",
        "badania_lab",
        "inne"
    ],
    "services_male_paid": [
        "usg",
        "szczepienia",
        "masaz",
        "inne"
    ],
    "services_female_free": [
        "porada_lekarza",
        "porada_poloznej",
        "porada_psychologa",
        "badania_lab",
        "antykoncepcja",
        "cytologia",
        "inne"
    ],
    "services_female_paid": [
        "usg",
        "szczepienia",
        "masaz",
        "fizjoterapia",
        "inne"
    ],
    "messengers": [
        "whatsapp",
        "messenger",
        "telegram",
        "signal",
        "sms",
        "email"
    ]
}

print(f"Pobieranie metadanych tabeli {TABLE_ID}...\n")

# Pobierz metadane tabeli
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

for col_name, option_values in columns_to_convert.items():
    if col_name not in columns_found:
        print(f"⚠️  Kolumna {col_name} nie znaleziona w tabeli")
        continue

    col_info = columns_found[col_name]
    col_id = col_info["id"]
    current_type = col_info["uidt"]

    print(f"Konwersja: {col_name} ({current_type} → MultiSelect)")
    print(f"  Opcje: {', '.join(option_values)}")

    # Przygotuj opcje z kolorami
    options = []
    for i, value in enumerate(option_values):
        options.append({
            "title": value,
            "color": COLORS[i % len(COLORS)]
        })

    # PATCH kolumny - zmiana typu na MultiSelect z opcjami
    update_data = {
        "uidt": "MultiSelect",
        "column_name": col_name,
        "title": col_info["title"],
        "colOptions": {
            "options": options
        }
    }

    response = requests.patch(
        f"{NOCODB_URL}/api/v2/meta/columns/{col_id}",
        headers=headers,
        json=update_data
    )

    if response.status_code in [200, 201]:
        print(f"  ✅ Skonwertowano pomyślnie ({len(options)} opcji)")
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
    print("✅ Wszystkie kolumny zostały pomyślnie skonwertowane na MultiSelect!")
else:
    print(f"⚠️  Konwersja zakończona z {errors} błędami")
