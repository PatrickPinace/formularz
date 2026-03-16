# 🚀 Cloudflare Pages Deployment - Instrukcja krok po kroku

## ✅ Co już zrobiliśmy

- ✅ Cloudflare adapter zainstalowany i skonfigurowany
- ✅ Build działa poprawnie (`npm run build`)
- ✅ NocoDB tabela `form_submissions` utworzona
- ✅ Plik `.env` z konfiguracją (NIE commitowany do Git)
- ✅ Zmiany commitnięte do Git

---

## 📋 Przygotowanie (jednorazowe)

### 1. Push do GitHub

```bash
cd /home/amfa/projekty/formularz
git push origin master
```

**⚠️ Uwaga:** Jeśli dostaniesz błąd z credentials, musisz:
- **Opcja A:** Skonfigurować SSH key w GitHub
- **Opcja B:** Użyć Personal Access Token jako hasło

**Quick fix (Personal Access Token):**
1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token (repo access)
3. Skopiuj token
4. Przy `git push` podaj username i **token jako hasło**

### 2. Załóż konto Cloudflare (jeśli nie masz)

1. Idź na https://dash.cloudflare.com/sign-up
2. Użyj email: **itprima@medi3.pl** (lub inny firmowy)
3. Potwierdź email

---

## 🎯 Deployment na Cloudflare Pages

### Krok 1: Podłącz GitHub do Cloudflare

1. Zaloguj się do Cloudflare Dashboard
2. W menu bocznym kliknij **Workers & Pages**
3. Kliknij **Create application**
4. Zakładka **Pages**
5. Kliknij **Connect to Git**
6. Wybierz **GitHub**
7. Autoryzuj Cloudflare do dostępu do GitHub
8. Wybierz **PatrickPinace/formularz** (lub All repositories)

### Krok 2: Konfiguracja Build Settings

**Project name:**
```
mediprima-formularz
```
(lub dowolna nazwa - to będzie część URL: `mediprima-formularz.pages.dev`)

**Production branch:**
```
master
```

**Framework preset:**
```
Astro
```

**Build command:**
```
npm run build
```

**Build output directory:**
```
dist
```

**Root directory:**
```
/
```
(puste - domyślnie root repo)

### Krok 3: Environment Variables (NAJWAŻNIEJSZE!)

Kliknij **Add environment variable** i dodaj:

| Variable name | Value |
|---|---|
| `NOCODB_URL` | `https://crm.mediprima.pl` |
| `NOCODB_TOKEN` | `cuaddLZClFnX-vCXagjMaR8VvrMvMWmWTbcxFO4J` |
| `NOCODB_FORM_SUBMISSIONS_TABLE_ID` | `mvb4ui8qnn2btxm` |

**⚠️ WAŻNE:**
- Ustaw dla **Production** (checkbox zaznaczony)
- **NIE** dodawaj cudzysłowów wokół wartości
- Skopiuj dokładnie wartości z pliku `.env`

### Krok 4: Deploy!

1. Kliknij **Save and Deploy**
2. Cloudflare:
   - Pobierze kod z GitHub
   - Zainstaluje zależności (`npm install`)
   - Zbuduje projekt (`npm run build`)
   - Wdroży na globalny CDN

**Czas deploymentu:** ~2-3 minuty

### Krok 5: Sprawdzenie

Po zakończeniu deployment zobaczysz:

✅ **Success!** Twoja aplikacja jest live!

**URL:** `https://mediprima-formularz.pages.dev/formularz`

Kliknij **Visit site** i sprawdź czy formularz działa.

---

## 🌐 Custom Domain: formularz.mediprima.pl

### Krok 1: Dodaj custom domain w Cloudflare Pages

1. W projekcie Cloudflare Pages → **Custom domains**
2. Kliknij **Set up a custom domain**
3. Wpisz: `formularz.mediprima.pl`
4. Kliknij **Continue**
5. Cloudflare pokaże jakie DNS rekordy dodać

### Krok 2: Konfiguracja DNS

**W Cloudflare DNS (dla domeny mediprima.pl):**

Dodaj rekord CNAME:

| Type | Name | Target | Proxy status |
|---|---|---|---|
| CNAME | `formularz` | `mediprima-formularz.pages.dev` | ✅ Proxied |

**⚠️ WAŻNE:** Ustaw "Proxy status" na **Proxied** (pomarańczowa chmurka)

### Krok 3: Aktywacja SSL

Cloudflare automatycznie:
- ✅ Wygeneruje certyfikat SSL (Let's Encrypt)
- ✅ Przekieruje HTTP → HTTPS
- ✅ Włączy HTTP/2 i HTTP/3

**Czas propagacji DNS:** 5-10 minut

### Krok 4: Weryfikacja

Po ~10 minutach:

```bash
curl -I https://formularz.mediprima.pl/formularz
```

Powinno zwrócić `200 OK` i działać przez HTTPS.

---

## 🔄 Auto-deployment

**Od teraz każdy `git push` automatycznie wdroży nową wersję!**

```bash
# Edytujesz kod lokalnie
nano src/pages/formularz.astro

# Commit
git add .
git commit -m "Update formularz"

# Push (automatyczny deployment!)
git push origin master
```

Cloudflare Pages:
1. Wykryje nowy commit
2. Zbuduje projekt
3. Wdroży nową wersję
4. Wyśle email z potwierdzeniem

**Preview deployments:**
- Każdy branch i PR dostaje osobny URL preview
- Możesz testować zmiany przed mergem do master

---

## 📊 Monitoring i Logi

### Dostęp do logów

1. Cloudflare Dashboard → **Workers & Pages**
2. Wybierz projekt **mediprima-formularz**
3. Zakładka **Deployments**
4. Kliknij w deployment → **View build log**

### Analytics

Zakładka **Analytics** pokazuje:
- Liczba requestów
- Przepustowość
- Kraje użytkowników
- Najpopularniejsze strony

### Real-time Logs (dla API routes)

```bash
# Zainstaluj Wrangler CLI (opcjonalnie)
npm install -g wrangler

# Tail logs
wrangler pages deployment tail
```

---

## 🛠️ Troubleshooting

### Problem: Build fails - "Module not found"

**Przyczyna:** Brakujące zależności w `package.json`

**Rozwiązanie:**
```bash
npm install
git add package-lock.json
git commit -m "Update dependencies"
git push
```

### Problem: 500 Internal Server Error na /api/*

**Przyczyna:** Brak zmiennych środowiskowych lub błąd w kodzie API

**Rozwiązanie:**
1. Sprawdź **Environment variables** w CF Pages
2. Sprawdź **Functions logs** w dashboard
3. Dodaj `console.log()` w API routes i redeploy

### Problem: NocoDB connection error

**Przyczyna:** Błędny token lub TABLE_ID

**Rozwiązanie:**
1. Sprawdź czy zmienne są **dokładnie** takie jak w `.env`
2. Test lokalnie: `npm run build && npm run preview`
3. Jeśli lokalnie działa, to problem w CF Pages env vars

### Problem: Custom domain nie działa

**Przyczyna:** DNS nie propagował się lub błędny rekord

**Rozwiązanie:**
1. Sprawdź DNS: `dig formularz.mediprima.pl`
2. Sprawdź czy CNAME wskazuje na `*.pages.dev`
3. Poczekaj 10-30 minut na propagację DNS
4. Wyczyść cache przeglądarki (Ctrl+Shift+R)

---

## 🎓 Best Practices

### 1. Secrets rotation

Co 90 dni:
1. Wygeneruj nowy `NOCODB_TOKEN` w NocoDB
2. Zaktualizuj w Cloudflare Pages → **Settings** → **Environment variables**
3. Kliknij **Redeploy** (bez nowego commita)

### 2. Branch strategy

```
master     → Produkcja (formularz.mediprima.pl)
develop    → Staging (develop.mediprima-formularz.pages.dev)
feature/*  → Preview URLs
```

### 3. Rollback

Jeśli deployment się zepsuł:
1. Cloudflare Pages → **Deployments**
2. Znajdź ostatni działający deployment
3. Kliknij **⋮** → **Rollback to this deployment**

Instant rollback!

---

## 📈 Limits (Free Plan)

Cloudflare Pages Free:
- ✅ **500 builds/miesiąc** (więcej niż potrzebujesz)
- ✅ **Unlimited requests** (bez limitów!)
- ✅ **Unlimited bandwidth**
- ✅ **1 concurrent build** (tylko 1 build na raz)
- ✅ **100 custom domains**

**Pro tip:** Jeśli chcesz więcej concurrent builds → upgrade do $20/miesiąc

---

## 🚨 Bezpieczeństwo

### ✅ Co jest OK

- ✅ Token NocoDB w environment variables (bezpieczny)
- ✅ `.env` w `.gitignore` (nie trafia do repo)
- ✅ HTTPS wymuszony automatycznie

### ❌ NIGDY nie commituj

- ❌ `.env` do Git
- ❌ Tokenów/haseł w kodzie
- ❌ Prywatnych kluczy SSH

### 🔒 Dodatkowe zabezpieczenia

**CORS** (jeśli potrzebujesz):
W `astro.config.mjs` dodaj:
```javascript
vite: {
  server: {
    cors: {
      origin: ['https://formularz.mediprima.pl']
    }
  }
}
```

**Rate limiting** (jeśli potrzebujesz):
Cloudflare automatycznie blokuje oczywiste ataki DDoS.

---

## 📞 Pomoc

### Cloudflare Docs
- **Pages:** https://developers.cloudflare.com/pages/
- **Astro on CF Pages:** https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/

### Cloudflare Community
- **Discord:** https://discord.cloudflare.com
- **Forum:** https://community.cloudflare.com

### Support
- **Email:** support@cloudflare.com
- **Chat:** W dashboard (prawy dolny róg)

---

## ✅ Checklist końcowy

Przed ogłoszeniem "LIVE":

- [ ] Formularz wyświetla się poprawnie
- [ ] Dane zapisują się do NocoDB (sprawdź tabelę)
- [ ] Drafty działają (auto-save co 5 sekund)
- [ ] Submit tworzy rekord ze statusem "submitted"
- [ ] Custom domain działa przez HTTPS
- [ ] Email notifications działają (jeśli skonfigurowałeś)
- [ ] Przetestowałeś na mobile (responsywność)
- [ ] Analytics w Cloudflare zbiera dane

---

## 🎉 Gotowe!

Twój formularz jest teraz:
- ✅ **Live** na `https://formularz.mediprima.pl`
- ✅ **Szybki** (globalny CDN w 200+ miastach)
- ✅ **Bezpieczny** (automatyczny HTTPS)
- ✅ **Darmowy** (Cloudflare Pages Free)
- ✅ **Auto-deploy** (każdy push → nowa wersja)

**Next steps:**
1. Skonfiguruj email notifications (opcjonalnie)
2. Dodaj Google Analytics (opcjonalnie)
3. Stwórz backup cron dla NocoDB
4. Podziel się linkiem z użytkownikami! 🚀

---

*Wygenerowano przez [Claude Code](https://claude.com/claude-code) - Twój AI pair programmer*
