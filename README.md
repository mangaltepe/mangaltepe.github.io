# Faruk / Personal Studio

Astro ile oluşturulmuş kişisel portföy, proje ve teknik blog sitesi.

## İçerik yönetim paneli

**Panel:** https://mangaltepe.github.io/admin/

GitHub Pages üzerinde çalışan Sveltia CMS kullanılır. Özel bir veritabanı, CMS sunucusu veya API anahtarı dosyası gerekmez. İçerikler GitHub'a commit olarak kaydedilir.

### İlk giriş

1. GitHub'da **Settings → Developer settings → Personal access tokens → Fine-grained tokens** sayfasını aç.
2. Yalnızca `mangaltepe/mangaltepe.github.io` deposunu seç. **Contents: Read and write** izni ver. Gerekli asgari ek izinler için giriş ekranındaki yönergeleri izle.
3. Kısa süreli token oluştur. **Kimseye gönderme; depoya, site koduna veya sohbetlere yapıştırma.**
4. `/admin/` adresini aç, **Sign In with Token** seç ve token'ı yalnızca o giriş ekranına gir.
5. **Blog Yazıları**, **Projeler** veya **Site İçerikleri** kısmından metinleri/görselleri düzenle; kaydet/yayımla.
6. GitHub Actions başarılı olduğunda site yeniden oluşturulur. Token tarayıcıda saklanabileceğinden yalnız kendi güvenilir cihazında kullan, işin bitince çıkış yap ve gerek kalmadığında GitHub'dan token'ı iptal et.

**Güvenlik:** `/admin/` adresi herkese açık bir giriş sayfasıdır ama GitHub'da yazma yetkisi olmayan ziyaretçiler içerik yayımlayamaz. Token hiçbir zaman HTML, Astro, YAML veya GitHub deposuna eklenmemelidir.

### Düzenlenebilenler

- Blog: `src/pages/blog/*.md` (başlık, kategori, tarih, metin, kapak)
- Projeler: `src/pages/projeler/*.md` (başlık, durum, teknoloji, sıra, görsel ve detay)
- Ana sayfa + Hakkımda + GitHub linki: `src/data/site.json`
- Medya yüklemeleri: `public/images/`

Proje kartları `src/components/Projects.astro` içinden, blog listesi `src/components/Posts.astro` içinden Markdown başlıklarına göre otomatik üretilir. Yeni içerik eklemek için artık `src/data.ts` dosyasına kayıt girmek gerekmez.

## Yerel geliştirme

```bash
npm ci
npm run dev
npm run build
```

Ana tasarım: `src/styles/studio.css`. Ortak şablon: `src/layouts/Base.astro`.

## GitHub Pages

`.github/workflows/deploy.yml` ile `main` dalındaki güncellemeler yayımlanır. GitHub → **Settings → Pages → Source → GitHub Actions** seçeneğinin aktif olduğundan emin ol. Site: https://mangaltepe.github.io

**Not:** Portföyde araştırma sonuçları deneysel doğrulama sonuçları olarak sunulur. Özel depolardaki kodları veya kişisel anahtarları yayımlama.
