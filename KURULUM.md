# 🚀 Hızlı Kurulum Rehberi

## 1️⃣ Supabase Setup (5 dakika)

1. [supabase.com](https://supabase.com) → Yeni proje oluştur
2. SQL Editor'de `supabase-schema.sql` dosyasını çalıştır
3. Settings → API'den keys'leri kopyala

## 2️⃣ Environment Variables

`.env.local` oluştur:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_KEY=eyJhbGc...
```

## 3️⃣ Migration

```bash
npm install
npx ts-node scripts/migrate.ts
npm run dev
```

## 4️⃣ Vercel Deploy

```bash
git init
git add .
git commit -m "Initial commit"
git push
```

Vercel'de import et, environment variables ekle, deploy!

## 5️⃣ Domain

GoDaddy DNS:
- A record: `76.76.21.21`
- CNAME: `cname.vercel-dns.com`

✅ Bitti!

Detaylı rehber için: `DEPLOYMENT_GUIDE.md`
