---
layout: ../../layouts/Article.astro
title: "NODE: neden local-first bir AI arayüzü geliştiriyorum?"
category: "Yazılım"
description: "NODE: neden local-first bir AI arayüzü geliştiriyorum?"
date: "2026-10-29"
---

NODE'u geliştirirken ilk hedefim, farklı yapay zekâ sağlayıcıları arasında geçiş yapılabilen bir çalışma alanı oluşturmaktı. Proje ilerledikçe önceliğim daha netleşti: **insanların kendi bilgisayarlarında çalışan modelleri kullanmasını kolaylaştırmak.**

## NODE ne yapıyor?

Projenin üzerinde çalıştığım mimarisi Python ve FastAPI tabanlı. Ollama odaklı yerel model kullanımını merkezde tutarken, OpenAI, Claude, Gemini ve Groq gibi harici sağlayıcılar isteğe bağlı bir seçenek olarak kalabiliyor. Denediğim özellikler arasında streaming yanıtlar, konuşma geçmişiyle model değiştirme, API anahtarı yönetimi ve MCP sunucularıyla araç entegrasyonu bulunuyor.

Bu özelliklerin tümünü sorunsuz, herkese açık ve tek tıklamayla kurulabilen bitmiş bir ürün olarak sunmuş değilim. Mevcut hedefim **local-first deneyimi olgunlaştırmak**.

## Neden yalnızca web uygulaması değil?

Bulut üzerinde sürekli model çalıştırmak maliyet, kurulum ve veri akışı açısından yeni bağımlılıklar getiriyor. Yerel modeller kullanıcıya kendi donanımı üzerinde kontrol sağlıyor. Bunun karşılığında RAM, GPU kapasitesi, model boyutu ve ilk kurulum deneyimi gibi zor problemler ortaya çıkıyor.

NODE'un değerini yalnızca daha fazla model eklemekte değil; model indirme, başlatma, seçme, sohbet etme ve araç bağlama süreçlerini tek bir anlaşılır arayüzde toplamakta görüyorum.

## Bundan sonraki adımlar

Önceliklerim Ollama entegrasyonunu sadeleştirmek, kurulumu kolaylaştırmak, hata durumlarını anlaşılır kılmak ve MCP araç akışını güvenilir hale getirmek. Bu sayfada henüz yayımlamadığım bir indirme bağlantısı veya doğrulanmamış performans iddiası paylaşmıyorum.
