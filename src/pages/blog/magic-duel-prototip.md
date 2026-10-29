---
layout: ../../layouts/Article.astro
title: "Magic Duel: çizerek büyü yapılan bir oyun geliştirmek"
category: "Oyun"
description: "Magic Duel: çizerek büyü yapılan bir oyun geliştirmek"
date: "2026-10-29"
---

Magic Duel'de klasik bir büyü düğmesine basmak yerine oyuncunun ekrana bir sembol çizmesini istedim. Oyun fikrinin merkezinde **çizim tanıma ile hızlı taktik kararların birleşmesi** var.

## İlk çalışan prototip

Unity ve C# ile çizim yüzeyi, işaret tanıma ve büyü verisi sistemlerini kurdum. Çizgileri yeniden örnekleyerek şablonlarla karşılaştıran bir tanıma yaklaşımı denedim. Mana ve sağlık sistemleri de temel oynanış döngüsünün parçası oldu.

Bir arkadaşımla LAN üzerinden test ederken oyunculardan birinin yaptığı saldırının diğerine hasar verebildiği bir prototip elde ettim. Bu, tam anlamıyla bitmiş veya internette yayımlanmış çok oyunculu oyun demek değil.

## Oynanışın değişen yönleri

İlk kart tasarımında büyüyü seçip ortaya sürükleme fikri vardı. Daha sonra saldırıların doğrudan etki etmesi, savunma kartlarının ise süreli koruma sağlaması yönüne gittim. Ateş, su, toprak ve hava temalarının yanında can ve mana yenileme gibi yardımcı kart fikirleri de tasarladım.

## Henüz eksikler

Bitiş ekranı, yanlış tanınan çizimleri iptal etme, görsel efektler, hasar geri bildirimi ve genel oyun hissi tarafında yapılacak işler var. En büyük dersim, bir prototipte çekirdek mekanik çalışsa bile **geri bildirim ve oyun akışının** deneyimi büyük ölçüde değiştirdiği oldu.

Bu yazı bir geliştirme günlüğüdür; tamamlanmış oyun veya yayınlanmış ürün duyurusu değildir.
