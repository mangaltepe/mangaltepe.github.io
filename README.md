# Faruk — Blog ve proje sitesi

Astro ile oluşturulmuş taşınabilir kişisel site. Önizleme içerikleri örnektir.

## Yerel geliştirme

Node.js 22 veya uyumlu yeni bir sürüm kurun.

```sh
npm ci
npm run dev
```

`npm run build` çıktıyı `dist/` içine üretir. Bu klasör herhangi bir statik barındırma servisine taşınabilir.

## İçerik düzenleme

- Yazılar: `src/pages/blog/*.md`. Yeni dosyayı mevcut bir yazıdan kopyalayın, başlık ve metni değiştirin. Listede görünmesi için `src/data.ts` içine ekleyin.
- Projeler: `src/pages/projeler/*.md`; kartlar `src/components/Projects.astro` içinde.
- Hakkımda: `src/pages/hakkimda.astro`.
- Renkler ve görünüm: `src/styles/global.css`.
- Navigasyon ve alt bilgi: `src/layouts/Base.astro`.
- Örnek içerik etiketlerini gerçek içerikler eklendiğinde kaldırın.

## GitHub Pages yayını

Yayın iş akışı `.github/workflows/deploy.yml` içinde hazırdır.

1. **Settings → Pages → Build and deployment → Source → GitHub Actions** seçin.
2. **Actions → Siteyi yayımla → Run workflow → main → Run workflow** seçin.
3. İş akışı yeşil olduğunda https://mangaltepe.github.io adresini açın.

İlk çalışma Pages ayarı açılmadığı için hata verirse ayarı yaptıktan sonra yeniden çalıştırın. Sonraki main güncellemeleri otomatik yayımlanır.

## Bilgisayarına alma

```sh
git clone https://github.com/mangaltepe/mangaltepe.github.io.git
cd mangaltepe.github.io
npm ci
npm run dev
```

## Yeni yazı ekleme

1. `src/pages/blog/meraktan-uretime.md` dosyasını kopyalayıp yeni bir isim verin.
2. Üstteki başlık, kategori ve açıklamayı; alttaki metni değiştirin.
3. `src/data.ts` içine dosya adıyla eşleşen slug, başlık, açıklama, kategori ve tarih ekleyin.
4. Yeni kategori için `src/pages/blog/index.astro` filtre listesini güncelleyin.
5. Gerçek içerikler eklendiğinde `src/layouts/Article.astro` içindeki örnek etiketi, sabit tarih ve açıklamayı düzenleyin. Liste örnek etiketi `src/components/Posts.astro` içindedir.

Modern arayüz `src/styles/polish.css`, kaydırmaya bağlı 3B görsel `src/components/ScrollScene.astro` içindedir.

## Güncelleme yayımlama

```sh
git add .
git commit -m "İçerikleri güncelle"
git push
```

Küçük değişiklikleri GitHub dosya ekranındaki kalem simgesiyle de yapabilirsiniz. main dalına kaydetmek otomatik yayını tetikler. Actions bölümünden sonucu kontrol edin.

Site dosya tabanlıdır; yönetim paneli yoktur. Depo ve site herkese açıktır; gizli bilgileri kaynak koduna eklemeyin. Site başka bir barındırmaya taşınabilir. Alan adı değişirse astro.config.mjs içindeki site adresini güncelleyin.
