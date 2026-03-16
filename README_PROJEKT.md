# Formularz Medi3 - Dokumentacja projektu

Wieloetapowy formularz rejestracyjny dla Poradni Medi3 zbudowany w Astro + React + NocoDB.

## 🚀 Szybki start

### 1. Instalacja zależności

```bash
npm install
```

### 2. Konfiguracja zmiennych środowiskowych

Skopiuj plik `.env.example` do `.env` i uzupełnij dane dostępowe do NocoDB:

```bash
cp .env.example .env
```

Edytuj plik `.env`:

```env
NOCODB_URL=https://your-nocodb-instance.com
NOCODB_TOKEN=your-token-here
NOCODB_FORM_SUBMISSIONS_TABLE_ID=your-table-id
NOCODB_FORM_CONTENT_TABLE_ID=your-content-table-id
```

### 3. Uruchomienie w trybie deweloperskim

```bash
npm run dev
```

Aplikacja będzie dostępna pod adresem `http://localhost:4321`

### 4. Build produkcyjny

```bash
npm run build
```

### 5. Podgląd buildu produkcyjnego

```bash
npm run preview
```

## 📁 Struktura projektu

```
/
├── src/
│   ├── pages/
│   │   ├── index.astro              # Strona główna
│   │   ├── formularz.astro          # Strona z formularzem
│   │   ├── dziekujemy.astro         # Strona podziękowania
│   │   └── api/                     # Endpointy API
│   │       ├── form-config.ts       # GET - pobiera treści formularza
│   │       ├── form-start.ts        # POST - inicjuje nowy formularz
│   │       ├── form-save.ts         # POST - zapisuje draft
│   │       ├── form-submit.ts       # POST - finalizuje formularz
│   │       └── form-draft/[uuid].ts # GET - pobiera draft po UUID
│   ├── components/
│   │   └── form/
│   │       ├── FormWizard.tsx       # Główny komponent wizarda
│   │       ├── StepRenderer.tsx     # Renderer kroków
│   │       ├── ProgressBar.tsx      # Pasek postępu
│   │       ├── Navigation.tsx       # Przyciski nawigacji
│   │       └── fields/              # Komponenty pól formularza
│   │           ├── RadioField.tsx
│   │           ├── CheckboxField.tsx
│   │           ├── TextField.tsx
│   │           ├── TextareaField.tsx
│   │           └── DateField.tsx
│   └── lib/
│       ├── types.ts                 # Typy TypeScript
│       ├── flow.ts                  # Definicja kroków formularza
│       ├── content.ts               # Pobieranie treści formularza
│       ├── validation.ts            # Walidacja formularza
│       ├── visibility.ts            # Logika widoczności pól
│       ├── mapping.ts               # Mapowanie do NocoDB
│       └── nocodb.ts                # Klient NocoDB API
├── public/                          # Pliki statyczne
├── astro.config.mjs                 # Konfiguracja Astro
├── tsconfig.json                    # Konfiguracja TypeScript
└── package.json                     # Zależności projektu
```

## 🎯 Funkcjonalności

### Zaimplementowane

- ✅ Wieloetapowy formularz (wizard)
- ✅ Dynamiczna nawigacja z regułami przejść
- ✅ Warunkowa widoczność pól
- ✅ Walidacja formularza (frontend + backend)
- ✅ Autosave (co 5 sekund)
- ✅ Wznowienie sesji po UUID
- ✅ Pasek postępu
- ✅ Integracja z NocoDB (opcjonalna)
- ✅ Responsywny design (mobile-first)
- ✅ Ścieżka dla kobiet w ciąży
- ✅ Ścieżka usług ogólnych
- ✅ Pola warunkowe (np. "inne" z opisem)

### Kroki formularza

1. **intro** - Informacje wstępne i RODO
2. **gender** - Wybór płci
3. **pregnancy_entry** - Pytanie o ciążę (tylko kobiety)
4. **identity_common** - Dane osobowe (IKP, imię, email, telefon, PESEL, adres)
5. **services_male** / **services_female** - Wybór usług
6. **pregnancy_details** - Szczegóły ciąży (tylko dla ścieżki ciążowej)
7. **contact_preferences** - Preferencje kontaktu
8. **summary** - Podsumowanie i wysłanie

## 🗄️ NocoDB - Struktura tabel

### Tabela: `form_submissions`

Przechowuje zgłoszenia użytkowników.

| Pole | Typ | Opis |
|------|-----|------|
| `Id` | Auto Number | ID rekordu |
| `submission_uuid` | SingleLineText | UUID sesji (unique) |
| `status` | SingleSelect | draft / submitted / reviewed / archived |
| `flow_type` | SingleSelect | pregnancy_midwife / general_services |
| `gender` | SingleLineText | Płeć |
| `pregnancy_path` | SingleLineText | Ścieżka dla kobiet |
| `ikp_status` | SingleLineText | Status IKP |
| `full_name` | SingleLineText | Imię i nazwisko |
| `email` | Email | Email |
| `phone` | PhoneNumber | Telefon |
| `pesel_or_birthdate` | SingleLineText | PESEL lub data urodzenia |
| `address_main` | LongText | Adres główny |
| `raw_answers_json` | LongText | Pełne odpowiedzi (JSON) |
| `current_step` | SingleLineText | Aktualny krok (draft) |
| `created_at_client` | DateTime | Data utworzenia |
| `submitted_at_client` | DateTime | Data wysłania |

### Tabela: `form_content` (opcjonalna)

Przechowuje edytowalne treści formularza.

| Pole | Typ | Opis |
|------|-----|------|
| `key` | SingleLineText | Klucz treści (np. field.gender.label) |
| `locale` | SingleSelect | Język (pl, en) |
| `type` | SingleSelect | text / options |
| `label` | SingleLineText | Etykieta wyświetlana |
| `value_text` | LongText | Wartość tekstowa |
| `value_json` | LongText | Wartość JSON (dla opcji) |
| `sort_order` | Number | Kolejność |
| `is_active` | Checkbox | Czy aktywne |
| `version` | SingleLineText | Wersja formularza |

### Tabela: `form_versions` (opcjonalna)

Przechowuje wersje publikacji formularza.

| Pole | Typ | Opis |
|------|-----|------|
| `version_code` | SingleLineText | Kod wersji (np. v1.0) |
| `is_active` | Checkbox | Czy aktywna |
| `published_at` | DateTime | Data publikacji |
| `notes` | LongText | Notatki wersji |

## 🔧 Konfiguracja

### Tryb bez NocoDB

Formularz działa również bez NocoDB - w takim przypadku:
- Treści są ładowane z pliku `content.ts` (mock data)
- Draft nie jest zapisywany
- Submit nie zapisuje danych (tylko konsola)

### Tryb z NocoDB

Aby włączyć pełną integrację:
1. Utwórz tabele w NocoDB zgodnie ze schematem powyżej
2. Wygeneruj token API w NocoDB
3. Uzupełnij zmienne środowiskowe w `.env`
4. Aplikacja automatycznie zapisze drafty i submity do NocoDB

## 📝 Jak dodać nowe pole?

### 1. Dodaj pole do flow.ts

```typescript
{
  id: 'new_field',
  type: 'text',
  labelKey: 'field.new_field.label',
  required: true,
}
```

### 2. Dodaj treść do content.ts

```typescript
'field.new_field.label': 'Nowe pole',
```

### 3. (Opcjonalnie) Dodaj kolumnę w NocoDB

Jeśli chcesz pole jako osobną kolumnę (a nie tylko w `raw_answers_json`), dodaj je do tabeli `form_submissions`.

### 4. (Opcjonalnie) Zaktualizuj mapping.ts

Jeśli dodałeś kolumnę w NocoDB, zaktualizuj funkcję `mapAnswersToNocoRecord`.

## 🎨 Stylowanie

Style są wbudowane w plik `formularz.astro`. Możesz:
- Zmienić kolory (zmienne CSS)
- Dodać własny framework CSS (Tailwind, Bootstrap)
- Wydzielić style do osobnego pliku

## 🚢 Deployment

### Astro z Node adapter

Aplikacja jest skonfigurowana z `@astrojs/node` w trybie `standalone`, co oznacza że:

```bash
npm run build
# Tworzy folder dist/ z serwerem Node.js

node dist/server/entry.mjs
# Uruchamia serwer produkcyjny
```

### Wdrożenie na serwerze

1. Zainstaluj zależności: `npm ci --production`
2. Zbuduj aplikację: `npm run build`
3. Ustaw zmienne środowiskowe (`.env` lub system)
4. Uruchom serwer: `node dist/server/entry.mjs`

### Inne platformy

Możesz zmienić adapter w `astro.config.mjs`:
- Vercel: `@astrojs/vercel`
- Netlify: `@astrojs/netlify`
- Cloudflare: `@astrojs/cloudflare`

## 📚 Dodatkowe zasoby

- [Dokumentacja Astro](https://astro.build)
- [Dokumentacja React](https://react.dev)
- [NocoDB API Docs](https://docs.nocodb.com)

## 🐛 Troubleshooting

### Formularz nie zapisuje danych

- Sprawdź zmienne środowiskowe w `.env`
- Sprawdź logi konsoli w przeglądarce
- Sprawdź logi serwera Node.js
- Zweryfikuj token NocoDB i ID tabeli

### Błędy TypeScript

- Uruchom `npm run check` aby sprawdzić błędy
- Upewnij się że wszystkie zależności są zainstalowane

### Błędy hydracji React

- Sprawdź czy komponent ma `client:load` w `.astro`
- Sprawdź czy props są serializowalne (nie zawierają funkcji)

## 📄 Licencja

Projekt wewnętrzny Medi3.
