# 🗄️ Konfiguracja NocoDB - Instrukcja krok po kroku

## 1. Przygotowanie instancji NocoDB

### Opcja A: NocoDB Cloud (najłatwiej)
1. Zarejestruj się na https://nocodb.com
2. Utwórz nowy workspace
3. Przejdź dalej do kroku 2

### Opcja B: Self-hosted (Docker)
```bash
docker run -d \
  --name nocodb \
  -p 8080:8080 \
  -v "$(pwd)/nc_data:/usr/app/data" \
  nocodb/nocodb:latest
```
Otwórz http://localhost:8080 i dokończ setup

## 2. Utworzenie projektu i tabel

### 2.1. Stwórz nowy projekt
- W NocoDB kliknij **"Create New Project"**
- Nazwa: `Medi3 Forms`
- Wybierz bazę danych (SQLite wystarczy do testów, PostgreSQL do produkcji)

### 2.2. Utwórz tabelę `form_submissions`

W projekcie kliknij **"Add new table"** → Nazwa: `form_submissions`

Dodaj następujące kolumny:

| Nazwa kolumny | Typ | Ustawienia |
|---------------|-----|------------|
| `Id` | **AutoNumber** | Primary Key (auto) |
| `submission_uuid` | **SingleLineText** | **Unique** ✓ |
| `status` | **SingleSelect** | Opcje: `draft`, `submitted`, `reviewed`, `archived` |
| `flow_type` | **SingleSelect** | Opcje: `pregnancy_midwife`, `general_services` |
| `gender` | **SingleLineText** | - |
| `pregnancy_path` | **SingleLineText** | - |
| `ikp_status` | **SingleLineText** | - |
| `full_name` | **SingleLineText** | - |
| `email` | **Email** | - |
| `phone` | **PhoneNumber** | - |
| `pesel_or_birthdate` | **SingleLineText** | - |
| `address_main` | **LongText** | - |
| `raw_answers_json` | **LongText** | - |
| `current_step` | **SingleLineText** | - |
| `created_at_client` | **DateTime** | - |
| `submitted_at_client` | **DateTime** | - |
| `CreatedAt` | **DateTime** | System field (auto) |
| `UpdatedAt` | **DateTime** | System field (auto) |

**Ważne:**
- Pole `submission_uuid` musi być **unique** (zaznacz checkbox "Unique" przy tworzeniu)
- Typ `raw_answers_json` to **LongText** - tutaj zapisujemy pełny JSON z odpowiedziami

### 2.3. (Opcjonalnie) Utwórz tabelę `form_content`

Jeśli chcesz edytować treści formularza przez NocoDB:

| Nazwa kolumny | Typ | Ustawienia |
|---------------|-----|------------|
| `Id` | **AutoNumber** | Primary Key |
| `key` | **SingleLineText** | Unique |
| `locale` | **SingleSelect** | Opcje: `pl`, `en` |
| `type` | **SingleSelect** | Opcje: `text`, `options` |
| `label` | **SingleLineText** | - |
| `value_text` | **LongText** | - |
| `value_json` | **LongText** | - |
| `sort_order` | **Number** | - |
| `is_active` | **Checkbox** | Default: true |
| `version` | **SingleLineText** | - |

## 3. Pobieranie danych autoryzacyjnych

### 3.1. Wygeneruj API Token
1. Kliknij w swój **avatar** (prawy górny róg)
2. **Account Settings** → **Tokens** → **Copy Token**
3. Zapisz token w bezpiecznym miejscu (wyświetla się tylko raz!)

### 3.2. Pobierz ID tabeli
1. Otwórz tabelę `form_submissions`
2. W pasku adresu URL znajdziesz ID:
   ```
   https://app.nocodb.com/#/nc/your-project-id/table-TABLE_ID
                                                          ^^^^^^^^^
   ```
   Skopiuj wartość po `/table-`

3. Powtórz dla tabeli `form_content` (jeśli utworzyłeś)

## 4. Konfiguracja aplikacji

### 4.1. Utwórz plik `.env`
```bash
cp .env.example .env
```

### 4.2. Uzupełnij dane w `.env`
```env
# NocoDB Configuration
NOCODB_URL=https://app.nocodb.com
# lub dla self-hosted: http://localhost:8080

NOCODB_TOKEN=twoj-wygenerowany-token-tutaj

NOCODB_FORM_SUBMISSIONS_TABLE_ID=table-id-z-kroku-3.2

# Opcjonalnie (jeśli utworzyłeś form_content):
NOCODB_FORM_CONTENT_TABLE_ID=table-id-dla-form-content
```

**⚠️ WAŻNE:**
- Nie commituj pliku `.env` do gita!
- `.env` jest już w `.gitignore`

## 5. Testowanie integracji

### 5.1. Restart serwera dev
```bash
# Ctrl+C aby zatrzymać serwer
npm run dev
```

### 5.2. Sprawdź logi
Po restarcie **nie** powinno być błędów:
```
❌ NocoDB configuration is incomplete  # ← Ten błąd powinien zniknąć!
```

### 5.3. Wypełnij formularz
1. Otwórz http://localhost:4322/formularz
2. Wypełnij kilka kroków
3. Sprawdź tabelę `form_submissions` w NocoDB
4. Powinieneś zobaczyć rekord ze statusem `draft`

### 5.4. Wyślij formularz
1. Dokończ formularz i kliknij "Wyślij zgłoszenie"
2. Sprawdź tabelę - status powinien zmienić się na `submitted`
3. W kolumnie `raw_answers_json` znajdziesz pełny JSON z odpowiedziami

## 6. Weryfikacja działania

### ✅ Checklist
- [ ] Tabela `form_submissions` utworzona ze wszystkimi kolumnami
- [ ] `submission_uuid` jest unique
- [ ] Token API wygenerowany i skopiowany
- [ ] ID tabeli skopiowane poprawnie
- [ ] Plik `.env` utworzony i wypełniony
- [ ] Serwer dev zrestartowany
- [ ] Brak błędów NocoDB w logach
- [ ] Draft zapisuje się automatycznie (co 5 sekund)
- [ ] Submit tworzy rekord ze statusem `submitted`

## 7. Troubleshooting

### Błąd: "NocoDB is not configured"
- Sprawdź czy plik `.env` istnieje
- Sprawdź czy wszystkie zmienne są wypełnione (bez komentarzy)
- Restart serwera dev

### Błąd: "Failed to create submission" (401)
- Token jest nieprawidłowy
- Wygeneruj nowy token w NocoDB

### Błąd: "Failed to create submission" (404)
- ID tabeli jest nieprawidłowe
- Sprawdź URL tabeli i skopiuj poprawny ID

### Błąd: "unique constraint failed"
- Próbujesz zapisać duplikat `submission_uuid`
- Wyczyść localStorage przeglądarki lub użyj trybu incognito

### Draft nie zapisuje się
- Sprawdź kolumnę `current_step` - powinna się aktualizować
- Sprawdź logi przeglądarki (F12) - powinny być requesty POST do `/api/form-save`

## 8. Produkcja

### Deployment na serwerze
1. Ustaw zmienne środowiskowe na serwerze:
   ```bash
   export NOCODB_URL=https://app.nocodb.com
   export NOCODB_TOKEN=production-token
   export NOCODB_FORM_SUBMISSIONS_TABLE_ID=prod-table-id
   ```

2. Lub użyj pliku `.env.production`:
   ```bash
   node dist/server/entry.mjs --env-file .env.production
   ```

### Bezpieczeństwo
- **NIGDY** nie commituj tokenów do repozytorium
- Używaj różnych tokenów dla dev/staging/production
- Regularnie rotuj tokeny (co 90 dni)
- Ogranicz dostęp do tabeli tylko do potrzebnych operacji

## 9. Dodatkowe funkcje

### Viewy w NocoDB
Możesz utworzyć viewy do łatwiejszego przeglądania zgłoszeń:

1. **View: "Nowe zgłoszenia"**
   - Filter: `status = submitted`
   - Sort: `submitted_at_client DESC`

2. **View: "Drafty"**
   - Filter: `status = draft`
   - Sort: `UpdatedAt DESC`

3. **View: "Ciąża - położne"**
   - Filter: `flow_type = pregnancy_midwife`

### Webhooks (opcjonalnie)
Możesz ustawić webhook w NocoDB aby:
- Wysyłać email po nowym zgłoszeniu
- Notyfikować Slack/Discord
- Integrować z CRM

## 10. Backup

### Export danych
1. W NocoDB kliknij tabelę → **More** → **Download**
2. Wybierz format: CSV lub Excel
3. Zapisz backup regularnie (np. co tydzień)

### Automatyczny backup
Jeśli używasz PostgreSQL, ustaw automatyczny backup bazy:
```bash
pg_dump nocodb_db > backup_$(date +%Y%m%d).sql
```

---

## 📞 Potrzebujesz pomocy?

Jeśli coś nie działa:
1. Sprawdź logi serwera Node.js
2. Sprawdź Network tab w DevTools (F12)
3. Sprawdź dokumentację NocoDB API: https://docs.nocodb.com
