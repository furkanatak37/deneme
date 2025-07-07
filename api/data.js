import path from 'path';
import { promises as fs } from 'fs';

export default async function handler(req, res) {
  const GOLD_API_KEY = process.env.GOLD_API_KEY;
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
      throw new Error(`Altın fiyatı API hatası: ${goldRes.statusText}`);
    }

    const goldData = await goldRes.json();
    
    // DEBUG: Gelen verinin tamamını Vercel log'larında görmek için
    console.log('Gelen Altın Verisi:', goldData);

    // DÜZELTME: API'den gelen gram fiyatını doğrudan kullan
    // Ons fiyatı yerine 'price_gram_24k' alanını kullanıyoruz.
    goldPricePerGram = goldData.price_gram_24k;

    // Gram fiyatı gelmediyse veya 0 ise hata fırlat
    if (!goldPricePerGram || goldPricePerGram === 0) {
      console.error('API yanıtında geçerli gram fiyatı bulunamadı.', goldData);
      throw new Error('API yanıtında geçerli gram fiyatı bulunamadı.');
    }

    // DEBUG: Hesaplanan gram fiyatını log'larda gör
    console.log('Kullanılan Gram Fiyatı:', goldPricePerGram);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: `Altın fiyatı alınamadı: ${error.message}` });
  }

  // 2. Lokal JSON Dosyasını Oku
  try {
    const jsonDirectory = path.join(process.cwd(), 'public');
    const fileContents = await fs.readFile(path.join(jsonDirectory, 'products.json'), 'utf8');
    const products = JSON.parse(fileContents);

    // 3. Ürün Fiyatlarını Hesapla ve Veriyi Birleştir
    const productsWithLivePrices = products.map(product => {
      const calculatedPrice = product.weightInGrams * goldPricePerGram;
      return {
        ...product,
        price: calculatedPrice,
      };
    });

    // 4. Son Veriyi Frontend'e Gönder
    res.status(200).json(productsWithLivePrices);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Ürün verileri okunamadı.' });
  }
}
