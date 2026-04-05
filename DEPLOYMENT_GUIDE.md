# 🚀 Deployment Rehberi

Bu rehber, tr.dincer blog'u WordPress'ten Supabase + Vercel'e taşıma sürecini adım adım açıklar.

## Adım 1: Supabase Kurulumu

### 1.1 Supabase Projesi Oluşturun

1. [supabase.com](https://supabase.com) adresine gidin
2. "Start your project" tıklayın
3. Yeni organizasyon oluşturun (veya mevcut birini seçin)
4. "New Project" butonuna tıklayın
5. Proje bilgilerini doldurun:
   - **Name**: `tr-dincer-blog`
   - **Database Password**: Güçlü bir şifre oluşturun (kaydedin!)
   - **Region**: `Europe (Frankfurt)` veya size en yakın bölge
   - **Pricing Plan**: Free tier yeterli
6. "Create new project" tıklayın (1-2 dakika sürer)

### 1.2 Database Şemasını Oluşturun

1. Supabase dashboard'da **SQL Editor** sekmesine gidin
2. "New query" tıklayın
3. `supabase-schema.sql` dosyasının içeriğini kopyalayıp yapıştırın
4. "Run" butonuna tıklayın
5. Başarılı olduğunu doğrulayın (yeşil tick işareti)

### 1.3 API Keys'leri Alın

1. Supabase dashboard'da **Settings** → **API** sekmesine gidin
2. Şu bilgileri kopyalayın:
   - **Project URL** (örn: `https://xxxxx.supabase.co`)
   - **anon public** key
   - **service_role** key (gizli tutun!)

## Adım 2: Local Development

### 2.1 Projeyi Bilgisayarınıza İndirin

Tüm dosyaları bir klasöre kopyalayın ve terminal'de o klasöre gidin.

### 2.2 Environment Variables Ayarlayın

`.env.local` dosyası oluşturun:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
SUPABASE_SERVICE_KEY=your-service-role-key
```

### 2.3 Bağımlılıkları Yükleyin

```bash
npm install
```

### 2.4 Migration Çalıştırın

WordPress verilerinizi Supabase'e aktarın:

```bash
npx ts-node scripts/migrate.ts
```

Çıktıda şunları göreceksiniz:
```
✅ 9 kategori eklendi
✅ 114 yazı eklendi
✅ 9 sayfa eklendi
```

### 2.5 Test Edin

```bash
npm run dev
```

Tarayıcıda `http://localhost:3000` açın ve sitenizi görün!

## Adım 3: GitHub'a Yükleme

### 3.1 Git Repository Oluşturun

```bash
git init
git add .
git commit -m "Initial commit: WordPress'ten Next.js'e migration"
```

### 3.2 GitHub'da Repo Oluşturun

1. [github.com](https://github.com) adresine gidin
2. "New repository" tıklayın
3. Repository adı: `tr-dincer-blog`
4. Public veya Private seçin
5. "Create repository" tıklayın

### 3.3 Push Edin

```bash
git remote add origin https://github.com/your-username/tr-dincer-blog.git
git branch -M main
git push -u origin main
```

## Adım 4: Vercel Deployment

### 4.1 Vercel Hesabı Oluşturun

1. [vercel.com](https://vercel.com) adresine gidin
2. "Sign Up" → GitHub ile giriş yapın

### 4.2 Projeyi Import Edin

1. Vercel dashboard'da "Add New..." → "Project" tıklayın
2. GitHub'dan `tr-dincer-blog` repo'nuzu seçin
3. "Import" tıklayın

### 4.3 Environment Variables Ekleyin

1. "Environment Variables" bölümünde şunları ekleyin:
   - `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anon key

2. "Deploy" butonuna tıklayın

### 4.4 Deployment'ı Bekleyin

2-3 dakika içinde deployment tamamlanacak. Vercel size bir URL verecek:
- `https://tr-dincer-blog.vercel.app`

## Adım 5: Domain Bağlama (GoDaddy → Vercel)

### 5.1 Vercel'de Domain Ekleyin

1. Vercel project dashboard'da **Settings** → **Domains** gidin
2. `tr.dincer.co` yazın ve "Add" tıklayın
3. Vercel size DNS ayarlarını gösterecek

### 5.2 GoDaddy DNS Ayarları

1. [godaddy.com](https://godaddy.com) → Hesabım → Domainlerim
2. `tr.dincer.co` yanındaki **DNS** butonuna tıklayın
3. Mevcut A ve CNAME kayıtlarını silin
4. Yeni kayıtlar ekleyin:

**A Record:**
- Type: `A`
- Name: `@`
- Value: `76.76.21.21` (Vercel IP)
- TTL: `600`

**CNAME Record:**
- Type: `CNAME`
- Name: `www`
- Value: `cname.vercel-dns.com`
- TTL: `600`

5. "Save" tıklayın

### 5.3 SSL Bekleyin

DNS değişiklikleri 1-24 saat sürebilir. Vercel otomatik SSL sertifikası oluşturacak.

## Adım 6: SEO için 301 Redirects

WordPress'ten taşırken URL yapısı aynı kalıyor, ama yine de bir `vercel.json` oluşturun:

```json
{
  "redirects": [
    {
      "source": "/index.php/:path*",
      "destination": "/:path*",
      "permanent": true
    }
  ]
}
```

## Adım 7: Son Kontroller

### ✅ SEO Checklist

- [ ] `https://tr.dincer.co` açılıyor mu?
- [ ] `https://tr.dincer.co/sitemap.xml` çalışıyor mu?
- [ ] `https://tr.dincer.co/rss.xml` çalışıyor mu?
- [ ] Google Search Console'a sitemap gönderdim mi?
- [ ] Eski WordPress sitesi kapatıldı mı?

### ✅ Fonksiyonel Testler

- [ ] Ana sayfa açılıyor
- [ ] Yazı sayfaları açılıyor
- [ ] Kategori filtreleme çalışıyor
- [ ] Arama çalışıyor
- [ ] "Ben" sayfası açılıyor
- [ ] Mobile'da düzgün görünüyor

## Adım 8: WordPress Sitesini Kapatın

1. GoDaddy hosting'de WordPress dosyalarını yedekleyin
2. Database'i export edin (yedek için)
3. WordPress sitesini kapatın

**ÖNEMLİ**: Domain'i kapatmayın, sadece hosting içeriğini temizleyin. Domain Vercel'e yönleniyor olmalı.

## 🎉 Tebrikler!

Blogunuz artık modern stack'te yayında:
- ⚡ 10x daha hızlı
- 🎨 Muhteşem tipografi
- 📱 Responsive
- 🔍 SEO optimize
- 💰 Ücretsiz hosting (Vercel Free tier)

## 🆘 Sorun mu var?

### Vercel deployment hatası
- Environment variables doğru mu kontrol edin
- Build logs'lara bakın

### Domain bağlanmıyor
- DNS değişikliği 24 saat sürebilir
- GoDaddy DNS ayarlarını tekrar kontrol edin

### Supabase bağlantı hatası
- API keys doğru mu kontrol edin
- Database şeması çalıştırıldı mı?

### Migration hatası
- JSON dosyaları doğru klasörde mi?
- Service role key doğru mu?

---

**İletişim**: hello@dincer.co
