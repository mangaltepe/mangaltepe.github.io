# ◈ ModelScope

PyTorch modellerinin katmanlarını, ağırlıklarını ve mevcut işlem bağlantılarını
incelemek için Türkçe, tarayıcıda çalışan bir araç. GitHub Pages ile yayınlanır.
Model dosyaları sunucuya yüklenmez. Backend, API anahtarı veya hesap gerekmez.

## Özellikler

- `.pt`, `.pth` ve `.onnx` dosyası seçme ve sürükleyip bırakma
- Netron tabanlı etkileşimli düğüm ve bağlantı grafiği
- Katman girişleri, çıkışları, tensör şekilleri ve ağırlık ayrıntıları
- Grafikte arama, yakınlaştırma, yön değiştirme, SVG/PNG dışa aktarma
- Tam ekran, mobil uyumlu arayüz ve Türkçe kullanım rehberi
- Gerçek ONNX grafiği ve PyTorch state_dict örnek dosyaları
- Yerel olarak paketlenmiş okuyucu: çalışma sırasında CDN bağımlılığı yok

## Hemen çalıştır

Python 3.10+ yeterli:

```bash
python -m http.server 8000
```

Tarayıcıda `http://localhost:8000` aç. `index.html` dosyasını çift tıklama;
ES modülleri ve model dosyaları için bir HTTP sunucusu gerekir.
Önce **Örnek modeli keşfet** düğmesiyle dene, sonra kendi dosyanı seç.

## GitHub Pages ile yayınla

1. GitHub'da bir depo oluştur (örneğin `modelscope`).
2. Bu klasörün **içeriğini**, `.github/workflows/pages.yml` dahil, deponun köküne koy.
3. Varsayılan dalın `main` olsun.
4. **Settings → Pages → Build and deployment → Source → GitHub Actions** seç.
5. `main` dalına push yap veya **Actions → Deploy ModelScope to GitHub Pages → Run workflow** çalıştır.
6. Akış tamamlandığında siten `https://KULLANICI_ADIN.github.io/modelscope/` adresinde açılır.
   Depo adın `KULLANICI_ADIN.github.io` ise adres doğrudan kök alan adın olur.

Örnek Git komutları (adını ve depo adresini değiştir):

```bash
git init
git add .
git commit -m "Add ModelScope model explorer"
git branch -M main
git remote add origin https://github.com/KULLANICI_ADIN/modelscope.git
git push -u origin main
```

Tüm yollar görecelidir; proje deposunun alt yolunda da çalışır.
GitHub Actions bağımlılık indirmeden testleri çalıştırır, `dist/` klasörünü
hazırlar ve Pages'e yayınlar. Model okuyucusu projeye dahildir.

## `.pt` hakkında önemli ayrım

| Dosya içeriği | Görülebilen bilgi |
| --- | --- |
| `torch.save(model.state_dict(), ...)` | Parametreler, tensör şekilleri ve katman grupları. Gerçek forward bağlantıları dosyada yoktur. |
| TorchScript | Desteklenen modellerde işlemler, bağlantılar ve parametreler. |
| ONNX | Dışa aktarılmış işlem grafiği, giriş/çıkışlar ve ağırlıklar. |
| Özel Python sınıfları içeren checkpoint | Ayrıştırıcı desteğine bağlıdır; her dosya açılamaz. |

`.pt` uzantısı tek başına mimarinin saklandığı anlamına gelmez. Uygulama eksik
bağlantıları uydurmaz. Gerçek işlem grafiği gerekiyorsa kendi Python ortamında,
kendi model kodun ve uygun örnek girdinle TorchScript/ONNX dışa aktar:

```python
import torch

model.eval()
example = torch.randn(1, 3, 224, 224)  # Kendi modelinin beklediği şekille değiştir.
with torch.no_grad():
    traced = torch.jit.trace(model, example)
traced.save("model-traced.pt")
```

Trace yalnızca örnek girdinin izlediği yürütme yolunu kaydeder; veriyle değişen
kontrol akışına sahip modeller için uygun bir dışa aktarma yöntemi seç.
Bilinmeyen kaynaklı checkpoint dosyalarını yerel Python'da `torch.load` ile açma.
ModelScope dosyaları JavaScript ile ayrıştırır; yerel Python çalıştırmaz.
Bu araç çıkarım veya eğitim yapmaz. Çok büyük modeller tarayıcı belleğini aşabilir.
Netron'un PyTorch desteği deneysel olduğundan tüm PyTorch sürümleri ve özel
operatörler için uyumluluk garanti edilmez.

## Geliştirme ve doğrulama

Node.js 22+ ve Python 3.10+ ile:

```bash
npm test
npm run build
```

Üç test, gerçek okuyucuyla ONNX bağlantılarını ve tensör şekillerini, PT ağırlık
şekillerini ve bozuk modelin reddedilmesini kontrol eder. Örnekleri yeniden üret:

```bash
python scripts/make_examples.py
```

Bu sürümde okuyucu testleri ve statik derleme doğrulandı. Teslim ortamı
Chromium başlatmayı engellediği için görsel tarayıcı testi tamamlanamadı.
Yayınladıktan sonra örnek modeli açma, düğüme tıklama, kendi `.pt` dosyanı açma
ve mobil görünümü tarayıcında kontrol et.

## Dosyalar

- `index.html`, `style.css`, `app.js`: Türkçe uygulama
- `vendor/netron/`: Netron 8.9.9 okuyucuları ve görüntüleyici
- `vendor/netron/modelscope.js`: Yerel dosya ve mesajlaşma adaptörü
- `examples/`: Beş işlemlik ONNX ve ağırlık içeren PT örnekleri
- `scripts/build.py`: Statik yayın çıktısı
- `.github/workflows/pages.yml`: GitHub Pages yayın akışı

Ana arayüz Türkçedir. Netron'un grafik menüleri ve katman ayrıntıları İngilizcedir.
Analitik başlangıcı devre dışıdır; görüntüleyicinin içerik güvenlik politikası
bağlantıları aynı origin ile sınırlar. Modeller depolanmaz veya geçmişe kaydedilmez.

## Lisans

ModelScope: MIT. Netron: Lutz Roeder, MIT.
Ayrıntılar: `THIRD_PARTY_NOTICES.md` ve `vendor/netron/LICENSE`.
