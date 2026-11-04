---
layout: ../../layouts/Article.astro
title: "Bir Drone'a Uçmayı Öğretmeye Çalıştım: 35 Deneme, 0 Başarı ve Değişen Araştırma Planım"
description: "PPO ile navigasyondan 6-DoF drone fiziğine geçiş, başarısız uçuş denemelerim ve araştırma planımı neden değiştirdiğim."
category: "Yapay Zekâ"
date: "2026-11-04"
---

*Reinforcement Learning ile otonom drone geliştirme sürecimden ilk deneyler ve araştırma notları.*

## Her şey basit bir soruyla başladı

Bir drone'a uçmayı, hedef bulmayı ve engellerden kaçınmayı kendi deneyimlerinden öğrenmeyi öğretebilir miyim?

Bu soruyla Reinforcement Learning (Pekiştirmeli Öğrenme) üzerine bir araştırma projesine başladım.

Amacım önceden tanımlanmış bütün uçuş hareketlerini takip eden bir sistem yerine, çevresinden aldığı gözlemlere göre karar verebilen ve zamanla davranışlarını geliştiren bir ajan oluşturmaktı.

Başlangıçta düşündüğüm görev nispeten açıktı: Drone bir başlangıç noktasından hareket edecek, hedefe ulaşmaya çalışacak ve bunu yaparken engellere çarpmayacaktı.

Ancak simülasyonları geliştirdikçe önemli bir şeyi fark ettim:

**Bir drone'un üç boyutlu bir ortamda yolunu bulmasıyla gerçekçi uçuş dinamikleri altında dengede kalması aynı problem değil.**

## İlk aşama: PPO ile navigasyon denemeleri

Araştırmaya Proximal Policy Optimization (PPO) algoritmasıyla başladım.

PPO, bir ajanın çevreyle etkileşime girerek aldığı ödüllere göre politikasını güncellemesini sağlayan bir pekiştirmeli öğrenme algoritması.

İlk deneylerde iki boyutlu, basitleştirilmiş bir navigasyon problemi üzerinde çalıştım. Ajanın temel amacı hedefe yaklaşmaktı. Bu aşamada uçuşun fiziksel gerçekçiliğinden ziyade, ajanın hedefe yönelik bir davranış öğrenip öğrenemediğiyle ilgilendim.

Kayıtlarımdaki bazı değerlendirme sonuçları şöyleydi:

| Eğitim adımı | Başarılı deneme |
| --- | ---: |
| 10.000 | 10/12 |
| 30.000 | 3/12 |
| 50.000 | 8/12 |

İlk dikkatimi çeken şey, daha fazla eğitim adımının her zaman daha yüksek başarı sağlamamasıydı. 10.000 adımda elde edilen başarı, 30.000 adımda ciddi biçimde düşmüş ve 50.000 adımda yeniden yükselmişti.

Bu durum, modelin performansını yalnızca eğitim süresine bakarak değerlendirmemem gerektiğini gösterdi. Ancak 12 değerlendirme uçuşu, güvenilir bir genelleme analizi için oldukça küçük bir örneklem. Bu dalgalanmanın nedenini anlamak için birden fazla eğitim seed'i ve daha kapsamlı testler gerekiyor.

## Üç boyutlu ortama geçiş

Sonraki aşamada navigasyon problemini üç boyutlu bir simülasyona taşıdım.

Burada PPO ajanının üç boyutlu uzayda hedefe doğru hareket etmesini ve farklı engel senaryolarıyla karşılaşmasını sağlayacak bir deney düzeneği hazırladım.

Eğitimi aşamalı olarak zorlaştıran bir *curriculum learning* yaklaşımı da tasarladım:

- **15.000 adım:** Engelsiz hedef navigasyonu
- **35.000 adım:** Tek engelli ortam
- **70.000 adım:** İki engelli ortam

Amaç, ajana bütün problemleri aynı anda öğretmeye çalışmak yerine daha basit görevlerden başlayıp zorluk seviyesini artırmaktı.

Ayrıca değerlendirmede başarı, çarpışma, alan dışına çıkma, süre aşımı ve toplam ödül gibi farklı metrikleri kaydetmek için bir altyapı oluşturdum.

Basitleştirilmiş üç boyutlu navigasyon denemelerimizden birinde 25/25 başarı sonucu bildirmiştik. Fakat bu, gerçek bir quadcopter uçuş kontrol probleminin çözüldüğü anlamına gelmiyordu.

O ortamda motor dinamikleri, gövde yönelimi ve uçuş kararlılığı gibi fiziksel unsurlar gerçekçi bir alt seviye kontrol problemi olarak ele alınmıyordu. Bu ayrım, araştırmamın sonraki aşamasında çok önemli hale geldi.

## Gerçekçi uçuş fiziği: 35 denemede 0 başarı

Daha gerçekçi bir simülasyona geçmek için altı serbestlik dereceli (6-DoF) drone fiziği üzerinde çalışmaya başladım.

6-DoF, drone'un üç doğrusal konum bileşeniyle birlikte üç dönme hareketinin de modellenmesi anlamına geliyor.

Basitleştirilmiş navigasyon probleminden farklı olarak burada drone'un yalnızca doğru yöne gitmesi yeterli değil. Aynı zamanda havada kalması, yönelimini kontrol etmesi ve kararlı hareket etmesi gerekiyor.

İlk 3.000 eğitim adımlık deneyden sonra yaptığımız 35 uçuşluk değerlendirme sonucunda kayıtlarıma şu tablo geçti:

| Sonuç | Uçuş sayısı |
| --- | ---: |
| Başarılı uçuş | 0 |
| Sınır dışına çıkma | 19 |
| Çarpışma | 11 |
| Süre aşımı | 5 |
| **Toplam** | **35** |

*Not: Bu değerler önceki deney konuşmalarımızdaki kayıtlarımdan derlenmiştir; ham değerlendirme dosyalarıyla bağımsız yeniden doğrulama yapılmadı.*

Bu sonuç hayal kırıklığı yarattı, ancak önemli bir ayrımı görmemi sağladı.

İlk simülasyonlarda ajan esas olarak navigasyon davranışını öğrenmeye çalışıyordu. 6-DoF ortamında ise uçuş kararlılığı da çözülmesi gereken ayrı bir problemdi.

Başarısızlığın kesin nedenini henüz izole etmiş değilim. Ödül fonksiyonu, aksiyon uzayı, kontrol frekansı ve eğitim bütçesi gibi birçok etken rol oynamış olabilir.

Dolayısıyla bu deney, PPO'nun drone kontrolünde başarısız olduğunu kanıtlamıyor. Yalnızca mevcut deney düzeneğimin ve kısa eğitim bütçemin başarılı uçuş elde etmek için yeterli olmadığını gösteriyor.

## Araştırma planını neden değiştirdim?

Bu noktada başlangıçtaki hedefimi yeniden değerlendirdim. Aynı anda hem drone'un dengede kalmasını hem hedef bulmasını hem de engellerden kaçınmasını öğrenmesini istemek, başlangıç aşaması için fazla karmaşık bir problem oluşturuyordu.

Bu nedenle araştırmamı üç aşamaya bölmeye karar verdim.

### Aşama 1 — Hover ve dış kuvvetlere dayanıklılık

İlk hedefim drone'un havada belirli bir konumda kararlı biçimde kalabilmesini sağlamak.

Bunun için PyBullet tabanlı 6-DoF bir ortamda çalışmayı planlıyorum.

Drone başlangıçta havada olacak. Simülasyon sırasında farklı yönlerden dış kuvvetler uygulanacak ve ajanın bu bozucu etkilere karşı konumunu ve yönelimini nasıl toparlayacağını inceleyeceğim.

Bu aşamada hedefe gitmek veya engelden kaçınmak yok. Öncelik yalnızca **kararlı uçuş ve bozucu etkilere karşı toparlanma davranışı**.

### Aşama 2 — Hedefe ulaşma ve hedefi algılama

Drone kararlı biçimde uçmayı öğrendikten sonra ikinci problem navigasyon olacak.

Öncelikle gözlem uzayında hedef konumu verildiğinde hedefe ulaşmasını değerlendirmeyi düşünüyorum. Ardından hedef bilgisinin doğrudan verilmediği, sensör veya kamera verilerinden çıkarılması gereken daha zor bir probleme geçmeyi hedefliyorum.

Burada kontrol ve algı bileşenlerinin ayrı ayrı test edilmesi önemli olacak.

### Aşama 3 — Engellerden kaçınma

Son aşamada drone'un çevresindeki engelleri algılayarak güvenli hareket etmesini istiyorum.

Bu aşama yalnızca bir noktadan diğerine gitmeyi değil, çevresel riskleri hesaba katarak hareket planlamayı da gerektirecek.

Üç aşamanın birbirinden ayrılması, başarısızlığın hangi alt problemden kaynaklandığını anlamamı kolaylaştıracak.

## Literatürden bir yön: Dream to Fly

Araştırma planımı geliştirirken incelediğim çalışmalardan biri *Dream to Fly: Model-Based Reinforcement Learning for Vision-Based Drone Flight* oldu.

Bu araştırmada DreamerV3 tabanlı model-based reinforcement learning yaklaşımı, görsel gözlemlerle drone uçuşu problemi üzerinde değerlendiriliyor.

Çalışmanın ilgimi çeken tarafı, yalnızca doğrudan gözlemden aksiyon öğrenmek yerine modelin çevre dinamiklerinden yararlanarak karar vermesi fikriydi.

Kendi projemde henüz bu mimariyi uygulamadım. Ancak ilerleyen aşamalarda PPO gibi model-free yaklaşımlarla model-based reinforcement learning yöntemlerini karşılaştırmak, araştırmam açısından değerli olabilir.

## Sonuç: Başarısız bir deney de araştırmanın parçası

Bu çalışmanın şu ana kadarki en önemli çıktısı başarılı bir otonom drone değil.

Daha önemlisi, başlangıçta tek bir problem gibi gördüğüm otonom uçuşun aslında birbirine bağlı fakat farklı zorlukları bulunan alt problemlerden oluştuğunu anlamam oldu.

Navigasyon, uçuş kararlılığı, çevreyi algılama ve engellerden kaçınma birbirleriyle ilişkili; fakat hepsinin aynı anda öğrenilmesi gerekmiyor.

Önümüzdeki deneylerde ilk hedefim oldukça basit:

**Drone havada durabilmeli ve dışarıdan gelen bozucu kuvvetlere rağmen yeniden dengelenebilmeli.**

Bunu güvenilir biçimde başarmadan sonraki aşamalara geçmek istemiyorum.

Araştırma boyunca yalnızca başarılı sonuçları değil, çalışmayan yaklaşımları ve bunların ardından aldığım kararları da belgelemeyi düşünüyorum.

Çünkü bazen bir deneyden öğrendiğim en önemli şey, problemin çözümü değil, **önce hangi problemi çözmem gerektiği** oluyor.

*Etiketler: Reinforcement Learning, PPO, Autonomous Drone, PyBullet, Robotics, 6-DoF, Research Notes*
