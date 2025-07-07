import path from 'path';
import { promises as fs } from 'fs';

export default async function handler(req, res) {
  // 1. Altın Fiyatını Çek (Sunucu Tarafında)
  const GOLD_API_KEY = process.env.GOLD_API_KEY; // API anahtarını Vercel environment variables'dan al
  const GOLD_API_URL = `https://www.goldapi.io/api/XAU/USD`;

  let goldPricePerGram;

  try {
    const goldRes = await fetch(GOLD_API_URL, {
      headers: {
        'x-access-token': GOLD_API_KEY,
        'Content-Type': 'application/json',
      },
    });

    if (!goldRes.ok) {
      throw new Error('Altın fiyatı API hatası');
    }

    const goldData = await goldRes.json();
    // API'nin ons (ounce) fiyatı verdiğini varsayalım, grama çevirelim. 1 Troy Ounce = 31.1035 gram
    const pricePerOunce = goldData.price;
    goldPricePerGram = pricePerOunce / 31.1035;

  } catch (error) {
    console.error(error);
    // Hata durumunda isteği 500 koduyla ve mesajla sonlandır
    return res.status(500).json({ message: 'Altın fiyatı alınamadı.' });
  }


  // 2. Lokal JSON Dosyasını Oku (Sunucu Tarafında)
  try {
    // Proje ana dizinini bul ve public/products.json yolunu oluştur
    const jsonDirectory = path.join(process.cwd(), 'public');
    const fileContents = await fs.readFile(path.join(jsonDirectory, 'products.json'), 'utf8');
    const products = JSON.parse(fileContents);

    // 3. Ürün Fiyatlarını Hesapla ve Veriyi Birleştir
    const productsWithLivePrices = products.map(product => {
      // Her ürünün fiyatını (ağırlık * anlık gram fiyatı) olarak hesapla
      const calculatedPrice = product.weightInGrams * goldPricePerGram;
      return {
        ...product,
        price: calculatedPrice, // 'price' alanını ekle
      };
    });

    // 4. Son Veriyi Frontend'e Gönder
    res.status(200).json(productsWithLivePrices);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Ürün verileri okunamadı.' });
  }
}