---
layout: ../../layouts/Article.astro
title: "Transformer'ı anlamak yetmiyor: Bir LLM gerçekte nasıl çalıştırılıyor?"
description: "NVIDIA AI Engineer Bootcamp'in LLM Internals modülünden notlarım: prefill, decode, KV Cache, embedding ayrımları ve kendi Transformer araştırmama etkileri."
category: "Yapay Zekâ"
date: "2026-11-04"
---

Transformer mimarisini araştırırken genellikle modelin içindeki hesaplamalara odaklanıyorum. NVIDIA AI Engineer Bootcamp'in ilk modülü, bu hesaplamaların **gerçek bir inference sisteminde** nasıl çalıştırıldığını yeniden düşünmemi sağladı.

Bir süredir Universal Transformer ve kendi **Attend–Compute–Stop (ACS)** yönlendirme yaklaşımım üzerinde çalışıyorum. Temel araştırma sorum, bir modelin her girdi için aynı miktarda hesaplama yapmasının gerekli olup olmadığı.

Fakat burada ikinci bir mühendislik problemi var: **Matematiksel olarak daha az işlem yapmak, gerçek donanımda mutlaka daha hızlı sonuç üretmek anlamına gelmiyor.**

## Prefill, decode ve KV Cache

Bir otoregresif dil modeli yanıt üretirken genel olarak iki aşamadan geçiyor:

- **Prefill:** Girişte verilen token'lar işleniyor; sonraki üretim adımlarında kullanılacak ara temsiller hesaplanıyor.
- **Decode:** Model, üreteceği token'ları sırayla tahmin ediyor. Her yeni token, sonraki üretim adımının bağlamına ekleniyor.

Burada **KV Cache** önemli. Önceden işlenen token'ların attention katmanlarındaki key ve value temsilleri saklanıyor; böylece sonraki decode adımlarında bunların yeniden hesaplanması büyük ölçüde önlenebiliyor.

Bu optimizasyonun bir bedeli var: cache bellekte yer kaplıyor. Bağlam uzunluğu, eşzamanlı istek sayısı ve kullanılan attention mimarisi, bu bellek maliyetini etkileyebiliyor.

Yani inference performansı yalnızca teorik FLOP sayısından ibaret değil; bellek hareketi, donanım kullanım oranı ve batching gibi faktörler de önemli.

## Embedding kavramının farklı rolleri

Bu modülde yeniden düşündüğüm bir başka konu da **embedding** kavramının farklı bağlamlarda kullanılmasıydı.

**Token embedding**, ayrık token kimliklerini modelin işleyebileceği sürekli vektörlere dönüştürüyor. Transformer katmanlarından geçtikçe bu vektörler bağlama duyarlı temsillere dönüşüyor.

**Retrieval embedding** ise örneğin bir RAG sisteminde metin parçalarını vektör uzayında karşılaştırmak ve ilgili içerikleri bulmak için kullanılıyor. Retrieval amacıyla eğitilmiş bir embedding modeliyle, üretici dil modelinin girişte kullandığı token embedding tablosu aynı işi yapmıyor.

Bu ayrım, farklı LLM sağlayıcılarını ve yerel modelleri bir araya getirmeye çalıştığım **NODE** projesi açısından da önemli. Modelin iç temsilleri ile belge araması için kullanılan vektörleri birbirine karıştırmamak gerekiyor.

## ACS araştırmama etkileri

ACS deneylerimde hesaplama adımlarını azaltmak bir hedef. Ancak elde edilen işlem sayısını azaltmak, tek başına gerçek bir verimlilik kazanımı olduğunu göstermiyor.

Bundan sonraki karşılaştırmalarda özellikle şu ölçütlere bakmak istiyorum:

1. **Time to First Token (TTFT):** İlk token'ın üretilmesine kadar geçen süre.
2. **Token üretim hızı:** Decode sırasında saniye başına üretilen token sayısı.
3. **GPU bellek tüketimi:** Model ağırlıkları ve KV Cache gibi bileşenlerin bellek maliyeti.
4. **Gerçek gecikme ve hesaplama maliyeti:** Dinamik yönlendirme, uygulamada gerçekten bir avantaj sağlayabiliyor mu?

Ölçümlerin anlamlı olması için KV Cache kullanımı, batching, donanım, giriş/çıkış uzunlukları ve inference altyapısının olabildiğince kontrollü tutulması gerekiyor.

**Bunlar henüz tamamladığım yeni benchmark sonuçları değil.** İlk modülün ardından, sonraki deneylerimin değerlendirme yöntemini daha dikkatli tasarlamak için belirlediğim başlıklar.

## Sonuç

İlk modülden çıkardığım en önemli ders şu oldu: **İyi bir model mimarisi geliştirmek ile o mimariyi verimli çalışan bir sisteme dönüştürmek iki ayrı mühendislik problemi.**

Modelin teorik karmaşıklığını azaltmak değerli; fakat bunu gerçek bir inference avantajına dönüştürmek için sistem seviyesinde de ölçüm yapmak gerekiyor.

Bundan sonraki çalışmalarımda hem modelin *ne öğrendiğine* hem de öğrendiklerini *ne kadar verimli kullandığına* odaklanmak istiyorum.

Daha önceki deneysel sonuçlarım için [Universal Transformer ve dinamik hesaplama deneylerim](/blog/transformer-deneyleri/) yazısına göz atabilirsiniz.

*Etiketler: LLM, Transformer, Inference, KV Cache, AI Engineering, NVIDIA Bootcamp*
