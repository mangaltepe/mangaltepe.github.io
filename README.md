# Faruk / Personal Studio

Yıldız Teknik Üniversitesi Matematik Bölümü öğrencisi Ahmet Faruk Mangaltepe'nin kişisel portföyü, proje notları ve blogu. Astro 5 ile oluşturulmuş statik site.

## Gerçek proje sayfaları
- `src/pages/projeler/node.astro` — NODE, Ollama odaklı yerel AI çalışma alanı (geliştiriliyor)
- `src/pages/projeler/transformer-research.astro` — Universal Transformer, ACT ve ACS deneyleri
- `src/pages/projeler/magic-duel.astro` — Unity ile çizim tabanlı LAN oyun prototipi

Bu sayfalardaki proje durumları ve ölçüm sonuçları geliştirme notlarından aktarılmıştır; farklı deneylerin sonuçları doğrudan karşılaştırılmamalıdır. Özel depolar için kamuya açık kaynak kod bağlantısı eklenmemiştir.

## Düzenleme
- Ana sayfa: `src/pages/index.astro`
- Proje kartları: `src/components/Projects.astro`
- Proje detayları: `src/pages/projeler/*.astro`
- Blog yazıları: `src/pages/blog/*.md`
- Blog listesi / metadata: `src/data.ts`
- Hakkımda: `src/pages/hakkimda.astro`
- Tasarım: `src/styles/studio.css`
- Ortak layout: `src/layouts/Base.astro`

Yeni blog yazısı eklerken `src/pages/blog/` içine Markdown oluşturun ve `src/data.ts` listesine aynı slug ile kayıt ekleyin.

## Yerel çalıştırma

Node.js 22 veya uyumlu sürüm:

```bash
npm ci
npm run dev
npm run build
```

## GitHub Pages

`.github/workflows/deploy.yml` ile `main` dalına gelen değişiklikler dağıtılır. GitHub → Settings → Pages → Build and deployment → GitHub Actions seçin. Site: https://mangaltepe.github.io

## Notlar

Bu site tamamen statiktir, admin paneli yoktur. Gizli anahtarları, kişisel belgeleri veya özel repo dosyalarını eklemeyin. Sayfa görselleri stilize illüstrasyonlardır; gerçek uygulama ekran görüntüsü olarak sunulmaz.
