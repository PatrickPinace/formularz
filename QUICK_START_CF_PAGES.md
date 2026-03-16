# ⚡ Cloudflare Pages - Quick Start

## 🚀 W 5 krokach do LIVE!

### 1️⃣ Push do GitHub
```bash
cd /home/amfa/projekty/formularz
git push origin master
```

### 2️⃣ Cloudflare Pages Setup
1. https://dash.cloudflare.com/sign-up (lub login)
2. **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
3. Wybierz repo: **PatrickPinace/formularz**

### 3️⃣ Build Settings
```
Framework: Astro
Build command: npm run build
Build output: dist
```

### 4️⃣ Environment Variables
Dodaj te 3 zmienne (skopiuj z .env):
```
NOCODB_URL=https://crm.mediprima.pl
NOCODB_TOKEN=cuaddLZClFnX-vCXagjMaR8VvrMvMWmWTbcxFO4J
NOCODB_FORM_SUBMISSIONS_TABLE_ID=mvb4ui8qnn2btxm
```

### 5️⃣ Deploy!
Kliknij **Save and Deploy** → Poczekaj 2-3 min → GOTOWE! 🎉

---

## 🌐 Custom Domain (opcjonalnie)

### DNS (w Cloudflare):
```
Type: CNAME
Name: formularz
Target: mediprima-formularz.pages.dev
Proxy: ✅ Proxied
```

**URL:** https://formularz.mediprima.pl

---

## 🔄 Auto-deployment

Od teraz każdy push = auto deploy:
```bash
git add .
git commit -m "Update"
git push
```

Cloudflare zrobi resztę! 🚀

---

**Pełna instrukcja:** [CLOUDFLARE_PAGES_DEPLOYMENT.md](./CLOUDFLARE_PAGES_DEPLOYMENT.md)
