#!/usr/bin/env python3
"""
Czyści opcje MultiSelect w NocoDB - usuwa śmieci po starym JSON systemie
Zostawia tylko poprawne wartości bez nawiasów i cudzysłowów
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

# Prawidłowe opcje dla każdej kolumny (bez śmieci)
CORRECT_OPTIONS = {
    "services_male_free": ["porada_lekarza", "porada_poloznej", "porada_psychologa", "badania_lab", "inne"],
    "services_male_paid": ["usg", "szczepienia", "masaz", "inne"],
    "services_female_free": ["porada_lekarza", "porada_poloznej", "porada_psychologa", "badania_lab", "antykoncepcja", "cytologia", "inne"],
    "services_female_paid": ["usg", "szczepienia", "masaz", "fizjoterapia", "inne"],
    "messengers": ["whatsapp", "messenger", "telegram", "signal", "sms", "email"]
}

# Kolory dla opcji
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

print(f"Pobieranie metadanych tabeli {TABLE_ID}...\n")

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

print(f"Czyszczenie opcji MultiSelect...\n")

cleaned = 0
errors = 0

for col in columns:
    col_name = col["column_name"]

    if col_name not in CORRECT_OPTIONS:
        continue

    col_id = col["id"]
    current_options = col.get("colOptions", {}).get("options", [])

    # Pokaż obecne opcje
    print(f"{col_name}:")
    print(f"  Obecne opcje ({len(current_options)}):")
    for opt in current_options:
        title = opt.get("title", "")
        is_bad = "[" in title or "]" in title or '"' in title
        marker = "❌" if is_bad else "✅"
        print(f"    {marker} {title}")

    # Przygotuj poprawne opcje
    correct_values = CORRECT_OPTIONS[col_name]
    new_options = []
    for i, value in enumerate(correct_values):
        new_options.append({
            "title": value,
            "color": COLORS[i % len(COLORS)]
        })

    print(f"  Nowe opcje ({len(new_options)}):")
    for opt in new_options:
        print(f"    ✅ {opt['title']}")

    # Zaktualizuj kolumnę
    update_data = {
        "column_name": col_name,
        "title": col["title"],
        "uidt": "MultiSelect",
        "colOptions": {
            "options": new_options
        }
    }

    response = requests.patch(
        f"{NOCODB_URL}/api/v2/meta/columns/{col_id}",
        headers=headers,
        json=update_data
    )

    if response.status_code in [200, 201]:
        print(f"  ✅ Wyczyszczono\n")
        cleaned += 1
    else:
        print(f"  ❌ Błąd: {response.status_code}")
        print(f"     {response.text}\n")
        errors += 1

print(f"\n{'='*60}")
print(f"Podsumowanie:")
print(f"  ✅ Wyczyszczono: {cleaned}")
print(f"  ❌ Błędy: {errors}")
print(f"{'='*60}\n")

if errors == 0:
    print("✅ Wszystkie kolumny zostały wyczyszczone!")
else:
    print(f"⚠️  Czyszczenie zakończone z {errors} błędami")
