---
layout: ../../layouts/Project.astro
title: "Adaptive Transformer Research"
description: "Universal Transformer, ACT ve Attend–Compute–Stop ile uyarlamalı hesaplamayı araştırdığım bitirme çalışması."
category: "Yapay zekâ araştırması"
status: "Deneysel araştırma"
technologies: "PyTorch · Transformers · Routing"
order: 2
featured: false
visual: research
---

## Araştırmanın amacı

Her girdiye aynı hesaplama adımlarını uygulamak yerine Transformer modelinin hesaplama miktarını örneğin karmaşıklığına göre uyarlayıp uyarlayamayacağını inceliyorum.

## Deneyler

Aritmetik ifadeler üzerinde 50.000 eğitim ve 5.000 doğrulama örneği kullandım. Uzunluk ve derinlik açısından OOD test kümeleri hazırladım.

- Standard Transformer, 100 epoch: **%41,84** validation exact-match.
- Fixed-step Universal Transformer, 500 epoch deneyinde en iyi sonuç: **%61,60** (317. epoch).
- ACT, 100 epoch: **%38,40**.
- ACS matched control: **%38,32**.

Bu değerler farklı deney bütçeleriyle elde edilen **validation** sonuçlarıdır; doğrudan eşit koşullu kıyaslama veya OOD başarı iddiası değildir.

## Açık sorular

Hesaplama maliyeti, doğruluk ve genelleme arasındaki dengeyi daha iyi anlamak. Çalışma tamamlanmış bilimsel yayın değildir.

[Deney günlüğü](/blog/transformer-deneyleri/).
