---
layout: ../../layouts/Article.astro
title: "Universal Transformer ve dinamik hesaplama deneylerim"
category: "Yapay Zekâ"
description: "Universal Transformer ve dinamik hesaplama deneylerim"
date: "29 EKİM 2026"
---

Bu araştırmada temel sorum şu: **Bir Transformer, her örneğe aynı miktarda hesaplama ayırmak zorunda mı?** Bir aritmetik ifade için gereken işlem sayısı ile o ifadenin zorluğu her zaman aynı değil. Bu nedenle sabit katmanlı Transformer, Universal Transformer (UT), ACT ve kendi Attend–Compute–Stop (ACS) yaklaşımımı deneysel olarak karşılaştırdım.

## Deney ortamı

Aritmetik ifadelerde toplama, çıkarma ve çarpma işlemlerini, parantezleri ve iç içe işlem yapılarını kullandım. Eğitim kümesi 50.000, doğrulama kümesi 5.000 örnekten oluşuyor. Ayrıca uzunluk ve derinlik bakımından dağılım dışı (OOD) değerlendirme kümeleri oluşturdum.

Model tarafında PyTorch, `d_model=256`, 8 attention head, 1024 boyutlu feed-forward katmanı, AdamW ve T4 GPU kullandım.

## İlk sonuçlar

| Düzenek | Deney | Validation exact match |
| --- | --- | ---: |
| Standard Transformer | 100 epoch | %41,84 |
| Fixed-step UT | 100 epoch | %41,94 |
| Fixed-step UT | 500 epoch, en iyi epoch 317 | **%61,60** |
| UT + ACT | 100 epoch | %38,40 |
| ACS, complexity-aware V2 | 10 epoch fine-tune, en iyi | %35,24 |
| ACS, matched control | Ayrı kontrol düzeneği | %38,32 |

Bunlar **doğrulama kümesi** sonuçlarıdır; OOD genelleme başarısı veya üretim ortamında performans iddiası değildir. Farklı eğitim bütçeleri ve düzenekler nedeniyle doğrudan tek bir liderlik sıralaması olarak yorumlanmamalıdır.

## Attend–Compute–Stop fikri

ACS yönlendiricisi modelin bir sonraki aşamada **Attend**, **Compute** veya **Stop** kararını vermesini hedefliyor. İlk deneylerde modelin işlem bütçesini kullanma biçimi ile başarı arasında gerilim gördüm. Daha sonra hesaplama tabanı, dengeleme ve karmaşıklık duyarlı kayıp terimleri üzerinde çalıştım.

Bir sonraki önemli soru yalnızca doğruluğu artırmak değil: **Girdi karmaşıklığıyla harcanan hesaplama arasında tutarlı ve genellenebilir bir ilişki kurulabiliyor mu?**

Bu yazı, 2026 boyunca yürüttüğüm deneylerin o tarihteki kaydını özetliyor. Tamamlanmış bir bilimsel yayın veya doğrulanmış genel başarı iddiası değil.
