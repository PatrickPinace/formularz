#!/usr/bin/env python3
"""
Skrypt usuwający kolumny związane z draftami z NocoDB
Usuwa: status, current_step (nie potrzebne po przejściu na localStorage)
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

# Kolumny do usunięcia
columns_to_delete = ["status", "current_step"]

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

# Znajdź kolumny do usunięcia
columns_found = {}
for col in columns:
    if col["column_name"] in columns_to_delete:
        columns_found[col["column_name"]] = {
            "id": col["id"],
            "title": col["title"],
            "uidt": col["uidt"]
        }

print(f"Kolumny do usunięcia ({len(columns_found)}):")
for name, info in columns_found.items():
    print(f"  - {name} (ID: {info['id']}, Type: {info['uidt']})")
print()

if not columns_found:
    print("⚠️  Nie znaleziono kolumn do usunięcia")
    exit(0)

# Usuń każdą kolumnę
deleted = 0
errors = 0

for col_name in columns_to_delete:
    if col_name not in columns_found:
        print(f"⚠️  Kolumna {col_name} nie znaleziona w tabeli")
        continue

    col_info = columns_found[col_name]
    col_id = col_info["id"]

    print(f"Usuwanie: {col_name} ({col_info['uidt']})")

    response = requests.delete(
        f"{NOCODB_URL}/api/v2/meta/columns/{col_id}",
        headers=headers
    )

    if response.status_code in [200, 204]:
        print(f"  ✅ Usunięto pomyślnie")
        deleted += 1
    else:
        print(f"  ❌ Błąd: {response.status_code}")
        print(f"     {response.text}")
        errors += 1
    print()

print(f"\n{'='*60}")
print(f"Podsumowanie:")
print(f"  ✅ Usunięto: {deleted}")
print(f"  ❌ Błędy: {errors}")
print(f"{'='*60}\n")

if errors == 0:
    print("✅ Wszystkie kolumny zostały pomyślnie usunięte!")
else:
    print(f"⚠️  Usuwanie zakończone z {errors} błędami")
