# tr.dincer Blog

Modern, tipografi odaklı kişisel blog. WordPress'ten Next.js + Supabase + Vercel stack'ine taşınmıştır.

## 🚀 Özellikler

- ⚡ **Next.js 14** (App Router)
- 🎨 **Harika Tipografi** - Crimson Pro + Inter
- 📊 **Supabase** - PostgreSQL database
- 🔍 **Arama** ve **Kategori Filtreleme**
- 📱 **Responsive Tasarım**
- ⚡ **SEO Optimize** - Sitemap, RSS, Meta tags
- 🌐 **Türkçe** full-text search desteği

## 📋 Kurulum

### 1. Supabase Projesi Oluşturun

1. [Supabase](https://supabase.com) hesabı oluşturun
2. Yeni proje oluşturun
3. SQL Editor'de `supabase-schema.sql` dosyasını çalıştırın

### 2. Environment Variables

`.env.example` dosyasını `.env.local` olarak kopyalayın ve değerleri doldurun:

```bash
cp .env.example .env.local
```

### 3. Bağımlılıkları Yükleyin

```bash
npm install
```

### 4. Migration (WordPress'ten veri aktarımı)

WordPress JSON dosyalarını proje kök dizinine kopyalayın:
- `wordpress_posts.json`
- `wordpress_pages.json`
- `wordpress_categories.json`

Ardından migration scriptini çalıştırın:

```bash
npx ts-node scripts/migrate.ts
```

### 5. Development Server

```bash
npm run dev
```

Tarayıcıda [http://localhost:3000](http://localhost:3000) açın.

## 🌐 Deployment (Vercel)

### 1. GitHub'a Push

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin your-repo-url
git push -u origin main
```

### 2. Vercel'e Deploy

1. [Vercel](https://vercel.com) hesabınıza giriş yapın
2. "Import Project" → GitHub repo'nuzu seçin
3. Environment Variables ekleyin:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy!

### 3. Domain Ayarları

Vercel'de:
1. Settings → Domains
2. `tr.dincer.co` domain'ini ekleyin
3. GoDaddy'de DNS ayarlarını güncelleyin:
   - A record: Vercel IP
   - CNAME: `cname.vercel-dns.com`

## 📝 SEO Checklist

- ✅ Sitemap.xml (`/sitemap.xml`)
- ✅ Robots.txt (`/robots.txt`)
- ✅ RSS Feed (`/rss.xml`)
- ✅ Meta tags (her sayfada)
- ✅ Open Graph tags
- ✅ URL yapısı korunmuş (SEO için kritik)

## 🔧 Yapılacaklar

- [ ] 301 redirects (eski WordPress URL'lerinden)
- [ ] Image optimization
- [ ] Analytics (Google Analytics / Plausible)
- [ ] Newsletter integration
- [ ] Dark mode toggle

## 📦 Proje Yapısı

```
tr-dincer-blog/
├── app/
│   ├── [slug]/          # Dinamik yazı sayfaları
│   ├── kategori/[slug]/ # Kategori sayfaları
│   ├── arama/           # Arama sayfası
│   ├── ben/             # Hakkımda
│   ├── layout.tsx       # Ana layout
│   ├── page.tsx         # Ana sayfa
│   ├── sitemap.ts       # Sitemap generator
│   └── robots.ts        # Robots.txt
├── components/          # React bileşenleri
├── lib/                 # Utility fonksiyonlar
├── scripts/             # Migration scriptleri
└── public/              # Statik dosyalar
```

## 🎨 Tasarım Felsefesi

- **Tipografi öncelikli**: Okuma deneyimi merkeze alınmış
- **Minimal**: Gereksiz öğeler yok
- **Temiz**: Beyaz alan kullanımı
- **Modern**: Güncel web standartları

## 📚 Teknoloji Stack

- **Framework**: Next.js 14
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS + Typography plugin
- **Fonts**: Google Fonts (Crimson Pro, Inter)
- **Deployment**: Vercel
- **Version Control**: Git + GitHub

## 📄 Lisans

Kişisel proje.

---

**tr.dincer** - Ağacı sev, yeşili koru, ayıyı öp.
