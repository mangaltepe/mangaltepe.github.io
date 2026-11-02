---
layout: ../../layouts/Article.astro
title: "Bir Transformer daha az hesaplama yaparak aynı performansı koruyabilir mi?"
description: "SmolLM2-135M üzerinde Attend–Compute–Stop yönlendirmesi: erken deney sonuçları, işlem bütçesi ve metodolojik sınırlar."
category: "Yapay Zekâ"
date: "2026-11-02"
---

# ACS yönlendirme mekanizması üzerine deneysel notlar

Transformer mimarileri üzerine çalışırken ilgimi çeken sorulardan biri şu oldu: **Bir modelin her girdi için aynı miktarda hesaplama yapması gerçekten gerekli mi?**

Standart Transformer'larda bir ileri geçişin ana hesaplama yapısı büyük ölçüde sabit. Farklı girdiler ise farklı seviyelerde işlem gerektirebilir. Bu düşünceden hareketle, üzerinde çalıştığım **Attend–Compute–Stop (ACS)** yönlendirme yaklaşımını deneysel olarak değerlendiriyorum.

## ACS nedir?

ACS, hesaplama akışında üç farklı kararın öğrenilmesini hedefliyor:

- **Attend:** Dikkat mekanizmasıyla bilgi toplamak.
- **Compute:** Mevcut temsili ek hesaplamayla işlemek.
- **Stop:** Ek hesaplama döngüsünü sonlandırmak.

Amaç, her örneğe aynı sayıda ek işlem uygulamak yerine, hesaplama miktarını girdiye göre ayarlayabilmek.

## SmolLM2-135M üzerinde ilk karşılaştırma

Bu çalışmada kaydedilmiş bir SmolLM2-135M ACS kontrol noktasında sabit işlem modu (**Fixed**) ile yönlendirilmiş mod (**ACS/Hard**) karşılaştırıldı. Kayıt, **125 optimizasyon adımı** sonrasındaki erken aşama bir deneye dayanıyor.

| Metrik | Fixed | ACS/Hard |
| --- | ---: | ---: |
| ID exact-match | %10,83 | %10,42 |
| OOD exact-match | %2,50 | %2,92 |
| ID ek işlem / token | 4,00 | 3,59 |

ID değerlendirmesinde yönlendirilmiş modda yaklaşık **%10,24 daha az kayıtlı ek işlem/token** görüldü. ID exact-match ise biraz geriledi. OOD exact-match sonucunda küçük bir artış var, ancak örneklem çok sınırlı.

**Bu değerlerin neyi göstermediği de önemli:**

- Ölçüm **teacher-forced** değerlendirmeye dayanıyor; bağımsız, uçtan uca greedy üretim başarısı değil.
- Fixed ve ACS/Hard sonuçları **ayrı eğitilmiş iki modelden değil, aynı kontrol noktasının iki çalışma modundan** geliyor.
- Exact-match farkları ID kümesinde **26/240 ve 25/240**, OOD kümesinde **6/240 ve 7/240** doğru örnek düzeyinde. Bu küçük farklardan genel üstünlük sonucu çıkarılamaz.
- Kayıtlı ek işlem sayısındaki azalma, doğrudan **FLOP, gecikme, enerji ya da çalışma süresi tasarrufu** olarak yorumlanamaz. Gerçek yürütme maliyeti ayrıca ölçülmeli.
- Yönlendirme davranışını inceleyen küçük analizde Attend seçimi görülmedi; modelin üç aksiyonu da etkili biçimde kullandığı henüz söylenemez.

Bu nedenle deneyin sonucu, “ACS daha hızlı ve daha iyi” değil; **farklı hesaplama kararlarını ölçebileceğim bir araştırma düzeneği oluşturmaya başladım** şeklinde okunmalı.

## Buradan sonra neyi test etmeliyim?

Benim için sonraki önemli sorular şunlar:

1. ACS'nin Attend, Compute ve Stop kararları girdinin uzunluğu ve yapısal zorluğuyla ilişkili mi?
2. Aynı eğitim ve hesaplama bütçeleriyle **bağımsız kontrol modelleri** kullanıldığında sonuçlar korunuyor mu?
3. Yanıtın girdiye eklenmediği, **bağımsız üretim** değerlendirmesinde model nasıl davranıyor?
4. Gerçekten atlanan hesaplama adımları **çalışma süresi, FLOP ve bellek** ölçümlerinde avantaj oluşturuyor mu?

## Sonuç

Bu kısa deney, adaptif hesaplamanın faydalı olduğuna dair kesin bir kanıt değil. Hatta bu aşamada her iki modun exact-match başarısı da düşük. Ancak **başarım ile işlem bütçesi arasındaki ilişkiyi daha disiplinli biçimde ölçmek** için hangi kontrollerin eksik olduğunu gösterdi.

Bitirme çalışmam kapsamında hedefim, yalnızca daha fazla hesaplama yapan modeller geliştirmek değil; **ne zaman, nerede ve ne kadar hesaplama yapılması gerektiğini öğrenebilen mimarileri** araştırmak.

Önceki Universal Transformer ve ACS deneylerimin genel özeti için [Transformer deneylerim](/blog/transformer-deneyleri/) yazıma bakabilirsiniz.
