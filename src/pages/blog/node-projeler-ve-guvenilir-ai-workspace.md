---
layout: ../../layouts/Article.astro
title: "NODE'u Geliştirirken: Bir AI Sohbet Uygulamasından Çalışma Alanına"
description: "NODE'da mevcut yerel LLM sohbet deneyiminden kalıcı Projects, dosya bağlamı ve güvenilir streaming mimarisine uzanan geliştirme kararlarım."
category: "Yazılım"
date: "2026-11-06"
---

*Yerel LLM entegrasyonu, streaming, dosya yönetimi ve güvenilir AI sistemleri üzerine geliştirme notlarım.*

## NODE neden yalnızca bir sohbet uygulaması olmamalı?

NODE'u geliştirirken başlangıçtaki hedefim, kendi bilgisayarımda çalışan dil modelleriyle rahatça iletişim kurabileceğim bir masaüstü uygulaması oluşturmaktı.

Yerel Ollama modellerini seçme, sohbet geçmişini yönetme, yanıtları streaming olarak gösterme ve farklı AI sağlayıcılarıyla çalışma gibi özellikler üzerinde ilerledikçe yeni bir problem ortaya çıktı:

**Bir modelle sohbet edebilmek, o modeli gerçek bir çalışma sürecinin parçası haline getirmek için yeterli değil.**

Özellikle aynı proje üzerinde farklı günlerde çalışırken dosyaların, sohbetlerin ve bağlamın birbirinden kopmaması gerekiyor.

## Yerel öncelikli yapının üstüne ne eklemek istiyorum?

NODE'un temelinde yerel kullanım bulunuyor. Ollama üzerinden bilgisayarda kurulu modellerle sohbet etme, model seçimi ve üretim ayarları uygulamada geliştirdiğim başlıca alanlar arasında.

Bunun yanında OpenAI, Claude, Gemini ve Groq gibi uzak sağlayıcılarla çalışmaya yönelik bir entegrasyon yapısı üzerinde de çalışıyorum. Amacım bütün sağlayıcıların aynı davranışa sahip olduğunu varsaymak değil; aralarındaki API ve yetenek farklarını kullanıcı arayüzünde yönetilebilir kılmak.

Python ve FastAPI tabanlı backend yaklaşımı, model ve araç entegrasyonlarını arayüzden ayırmak için kullandığım mimari yönlerden biri.

Bu yazı, yerel kullanım kararımı anlattığım [önceki NODE notumun](/blog/node-local-ai/) devamı: bu kez odağım **birden fazla sohbetin ve dosyanın aynı çalışma içinde nasıl tutulacağı**.

## Streaming neden yalnızca metin göstermekten ibaret değil?

Model yanıtlarını parça parça göstermek ilk bakışta basit bir özellik gibi görünüyor. Ancak gerçek bir uygulamada boş yanıt parçaları, bağlantı kesintileri, kullanıcı tarafından iptal edilen istekler ve tamamlanmamış çıktılar gibi durumları da yönetmek gerekiyor.

Özellikle yapılandırılmış çıktı beklediğimde, modelin yanıt üretimini tamamlaması verinin uygulamanın beklediği şemaya uyduğu anlamına gelmiyor.

Bu nedenle sonraki geliştirmelerimde streaming durum yönetimini daha belirgin hale getirmek ve JSON Schema/Pydantic doğrulamasını sistematik biçimde ele almak istiyorum.

Modelin ürettiği içerikle uygulamanın güvenle kabul edebileceği veri arasına açık bir doğrulama katmanı koymak önemli. **Bu doğrulama hattının tüm hata senaryolarıyla tamamlandığını henüz iddia etmiyorum.**

## Projects: Sohbetlerden kalıcı çalışma alanlarına

NODE için üzerinde tasarım yaptığım yeni özelliklerden biri **Projects**.

Buradaki hedefim, kullanıcıların her yeni sohbette aynı belgeleri yeniden yüklemek ve önceki bağlamı baştan açıklamak zorunda kalmaması.

Tasarladığım yapıda bir proje kendi sohbetlerini, dosyalarını ve proje talimatlarını barındırabilecek. Kullanıcı daha sonra aynı projeye geri döndüğünde ilgili çalışma bağlamına yeniden erişebilecek.

Dosyadan metin alma tarafında TXT, Markdown, CSV, JSON ve PDF gibi türlerle çalışmayı ele alıyorum. Bu dosyaları *proje düzeyinde kalıcı olarak ilişkilendirmek*, mevcut dosya okuma işlevinden farklı bir geliştirme işi.

Daha büyük belge koleksiyonlarında retrieval tabanlı yaklaşımlar kullanmak da seçenekler arasında. Ancak her dosyayı otomatik olarak RAG sürecinden geçirmek zorunda değilim: kısa içerikler doğrudan bağlama alınabilirken büyük koleksiyonlarda ilgili parçaları aramak daha anlamlı olabilir.

**Projects için kalıcı dosya, sohbet ve talimat bağlamı henüz tamamlanmış bir özellik değil; planladığım mimari genişleme.**

## Arayüz de mimarinin bir parçası

NODE'un arayüzünü geliştirirken ChatGPT ve Claude gibi araçların kullanım kolaylığından yararlanıp kendine ait bir kimlik oluşturmasını istiyorum.

Bu nedenle koyu siyah ve bordo renklerden oluşan, masaüstü odaklı bir tasarım dili üzerinde çalışıyorum. Sol tarafta sohbet geçmişi, sabitlenmiş sohbetler ve Projects; diğer alanlarda ise model seçimi ve üretim ayarları için daha düzenli bir yerleşim düşünüyorum.

Buradaki ekran tasarımı kararlarıyla gerçekten tamamlanmış uygulama işlevlerini birbirinden ayrı değerlendiriyorum.

## Bundan sonraki hedefim

NODE'un gelişiminde üç konuya öncelik vermek istiyorum:

1. **Kalıcı proje bağlamı:** Sohbet, dosya ve proje talimatlarını tutarlı biçimde birlikte yönetmek.
2. **Güvenilir çıktı işleme:** Streaming, iptal, hata ve yapılandırılmış veri doğrulama senaryolarını açıkça test etmek.
3. **Tutarlı sağlayıcı deneyimi:** Yerel ve uzak modellerin farklı yeteneklerini kaybetmeden anlaşılır bir arayüz sunmak.

Başarıyı yalnızca yeni özellik sayısıyla değil; hata durumları, yanıt gecikmesi, token üretim hızı ve dosya erişiminin doğruluğu gibi ölçülerle değerlendirmek istiyorum. Bu başlıklar için henüz yeni bir karşılaştırmalı benchmark sonucu paylaşmıyorum.

Benim için NODE'un amacı yeni bir sohbet arayüzü yapmak değil; **farklı AI modellerini gerçek projelerde kullanmayı kolaylaştıran, kontrol edilebilir bir masaüstü çalışma alanı geliştirmek**.

*Etiketler: NODE, Ollama, FastAPI, LLM Engineering, Streaming, AI Workspace, Software Architecture*
