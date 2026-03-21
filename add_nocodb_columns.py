#!/usr/bin/env python3
"""
Skrypt dodający wszystkie brakujące kolumny do tabeli form_submissions w NocoDB
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

# Definicje nowych kolumn do dodania
new_columns = [
    # Pregnancy details
    {
        "column_name": "midwife_choice",
        "title": "midwife_choice",
        "uidt": "SingleSelect",
        "dtxp": "'polozna_a','polozna_b','polozna_c','nie_wiem'"
    },
    {
        "column_name": "due_date",
        "title": "due_date",
        "uidt": "Date"
    },
    {
        "column_name": "pregnancy_care",
        "title": "pregnancy_care",
        "uidt": "SingleSelect",
        "dtxp": "'nfz','prywatnie','mieszane'"
    },
    {
        "column_name": "hospitalization",
        "title": "hospitalization",
        "uidt": "SingleSelect",
        "dtxp": "'tak','nie'"
    },
    {
        "column_name": "multiple_pregnancy",
        "title": "multiple_pregnancy",
        "uidt": "SingleSelect",
        "dtxp": "'tak','nie'"
    },
    {
        "column_name": "postpartum_same_address",
        "title": "postpartum_same_address",
        "uidt": "SingleSelect",
        "dtxp": "'tak','nie'"
    },
    {
        "column_name": "postpartum_address",
        "title": "postpartum_address",
        "uidt": "LongText"
    },
    {
        "column_name": "authorized_person",
        "title": "authorized_person",
        "uidt": "SingleLineText"
    },
    {
        "column_name": "birth_school",
        "title": "birth_school",
        "uidt": "SingleSelect",
        "dtxp": "'tak','nie','nie_wiem'"
    },

    # Services male (używamy LongText dla checkboxów - zapisywane jako JSON)
    {
        "column_name": "services_male_free",
        "title": "services_male_free",
        "uidt": "LongText"
    },
    {
        "column_name": "services_male_free_other",
        "title": "services_male_free_other",
        "uidt": "LongText"
    },
    {
        "column_name": "services_male_paid",
        "title": "services_male_paid",
        "uidt": "LongText"
    },
    {
        "column_name": "services_male_paid_other",
        "title": "services_male_paid_other",
        "uidt": "LongText"
    },

    # Services female
    {
        "column_name": "services_female_free",
        "title": "services_female_free",
        "uidt": "LongText"
    },
    {
        "column_name": "services_female_free_other",
        "title": "services_female_free_other",
        "uidt": "LongText"
    },
    {
        "column_name": "services_female_paid",
        "title": "services_female_paid",
        "uidt": "LongText"
    },
    {
        "column_name": "services_female_paid_other",
        "title": "services_female_paid_other",
        "uidt": "LongText"
    },

    # Contact preferences
    {
        "column_name": "participation_preference",
        "title": "participation_preference",
        "uidt": "SingleSelect",
        "dtxp": "'stacjonarne','online','hybrydowo'"
    },
    {
        "column_name": "messengers",
        "title": "messengers",
        "uidt": "LongText"
    },
    {
        "column_name": "how_found",
        "title": "how_found",
        "uidt": "SingleSelect",
        "dtxp": "'internet','social_media','znajomi','lekarz','plakat','inne'"
    },
    {
        "column_name": "how_found_other",
        "title": "how_found_other",
        "uidt": "SingleLineText"
    },
    {
        "column_name": "additional_notes",
        "title": "additional_notes",
        "uidt": "LongText"
    },
]

print(f"Dodawanie {len(new_columns)} nowych kolumn do tabeli form_submissions...\n")

for i, col_data in enumerate(new_columns, 1):
    print(f"[{i}/{len(new_columns)}] Dodawanie kolumny: {col_data['column_name']} ({col_data['uidt']})")

    response = requests.post(
        f"{NOCODB_URL}/api/v2/meta/tables/{TABLE_ID}/columns",
        headers=headers,
        json=col_data
    )

    if response.status_code in [200, 201]:
        print(f"  ✅ Dodano pomyślnie")
    else:
        print(f"  ❌ Błąd: {response.status_code}")
        print(f"     {response.text}")

print(f"\n✅ Zakończono dodawanie kolumn!")
