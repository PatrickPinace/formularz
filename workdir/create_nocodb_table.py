#!/usr/bin/env python3
"""
Tworzy tabelę form_submissions w NocoDB wraz ze wszystkimi wymaganymi kolumnami
"""

import requests
import json
import time

# Konfiguracja
BASE_URL = "https://crm.mediprima.pl"
BASE_ID = "p55wy1hdjth4c65"  # Medi3 Stary
TOKEN = "cuaddLZClFnX-vCXagjMaR8VvrMvMWmWTbcxFO4J"

headers = {
    "xc-token": TOKEN,
    "Content-Type": "application/json"
}

# Definicja kolumn zgodnie z NOCODB_SETUP.md
table_payload = {
    "table_name": "form_submissions",
    "title": "form_submissions",
    "columns": [
        {
            "column_name": "Id",
            "title": "Id",
            "uidt": "ID",  # AutoNumber primary key
            "pk": True
        },
        {
            "column_name": "submission_uuid",
            "title": "submission_uuid",
            "uidt": "SingleLineText",
            "unique": True  # MUST be unique
        },
        {
            "column_name": "status",
            "title": "status",
            "uidt": "SingleSelect",
            "dtxp": json.dumps(["draft", "submitted", "reviewed", "archived"])
        },
        {
            "column_name": "flow_type",
            "title": "flow_type",
            "uidt": "SingleSelect",
            "dtxp": json.dumps(["pregnancy_midwife", "general_services"])
        },
        {
            "column_name": "gender",
            "title": "gender",
            "uidt": "SingleLineText"
        },
        {
            "column_name": "pregnancy_path",
            "title": "pregnancy_path",
            "uidt": "SingleLineText"
        },
        {
            "column_name": "ikp_status",
            "title": "ikp_status",
            "uidt": "SingleLineText"
        },
        {
            "column_name": "full_name",
            "title": "full_name",
            "uidt": "SingleLineText"
        },
        {
            "column_name": "email",
            "title": "email",
            "uidt": "Email"
        },
        {
            "column_name": "phone",
            "title": "phone",
            "uidt": "PhoneNumber"
        },
        {
            "column_name": "pesel_or_birthdate",
            "title": "pesel_or_birthdate",
            "uidt": "SingleLineText"
        },
        {
            "column_name": "address_main",
            "title": "address_main",
            "uidt": "LongText"
        },
        {
            "column_name": "raw_answers_json",
            "title": "raw_answers_json",
            "uidt": "LongText"
        },
        {
            "column_name": "current_step",
            "title": "current_step",
            "uidt": "SingleLineText"
        },
        {
            "column_name": "created_at_client",
            "title": "created_at_client",
            "uidt": "DateTime"
        },
        {
            "column_name": "submitted_at_client",
            "title": "submitted_at_client",
            "uidt": "DateTime"
        },
        {
            "column_name": "CreatedAt",
            "title": "CreatedAt",
            "uidt": "DateTime",
            "system": True
        },
        {
            "column_name": "UpdatedAt",
            "title": "UpdatedAt",
            "uidt": "DateTime",
            "system": True
        }
    ]
}

print("=" * 80)
print(f"Tworzenie tabeli form_submissions w bazie {BASE_ID}")
print("=" * 80)

url = f"{BASE_URL}/api/v2/meta/bases/{BASE_ID}/tables"

try:
    response = requests.post(url, headers=headers, json=table_payload)

    if response.status_code == 200:
        data = response.json()
        table_id = data.get('id')
        print(f"\n✅ Sukces! Tabela utworzona.")
        print(f"\nTABLE_ID: {table_id}")
        print(f"\n📋 Skopiuj ten ID do pliku .env:")
        print(f"NOCODB_FORM_SUBMISSIONS_TABLE_ID={table_id}")

        # Zapisz ID do pliku tymczasowego
        with open('/home/amfa/projekty/formularz/workdir/table_id.txt', 'w') as f:
            f.write(table_id)

        print(f"\n✅ TABLE_ID zapisane do: workdir/table_id.txt")

    else:
        print(f"\n❌ Błąd: {response.status_code}")
        print(response.text)

except Exception as e:
    print(f"\n❌ Wyjątek: {e}")

print("\n" + "=" * 80)
