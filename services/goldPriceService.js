const fetch = require('node-fetch');

// Lütfen API anahtarınızı doğrudan koda gömmek yerine ortam değişkenleri kullanın!
// Vercel'de bunu ayarlamak için: vercel env add METALS_API_KEY
const METALS_API_KEY = process.env.METALS_API_KEY || 'J98YDRPNUXIH8CTJYWR6331TJYWR6'; // Default olarak sizin anahtarınız

class GoldPriceService {
  constructor() {
    this.apiUrl = `https://metals.dev/api/latest?api_key=${METALS_API_KEY}&base=USD`;
    // User-Agent başlığı tarayıcılarda otomatik eklenir, Node.js'te nadiren gereklidir
    // ancak sunucudan 403 hatası alırsanız ekleyebilirsiniz.
    // this.headers = {
    //   'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    // };
  }

  async getGoldPriceAsync() {
    try {
      const response = await fetch(this.apiUrl);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Metals.dev API hatası: ${response.status} - ${errorText}`);
        throw new Error(`Altın fiyatı alınamadı: ${response.statusText}`);
      }

      const apiData = await response.json();

      if (!apiData || apiData.status !== "success") {
        throw new Error("API isteği başarısız oldu veya yanıt 'success' durumunda değil.");
      }

      if (!apiData.metals || typeof apiData.metals.gold === 'undefined') {
        throw new Error("API yanıtı 'metals' veya 'gold' verisini içermiyor.");
      }

      // Metals.dev API'si ons başına fiyatı veriyor (1 troy ons = 31.1035 gram).
      // Bu değeri gram başına fiyata çevirmemiz gerekiyor.
      const pricePerOunce = apiData.metals.gold;
      const pricePerGram = pricePerOunce / 31.1035; // Ons fiyatını grama çevir

      console.log(`Güncel altın fiyatı (gram başına - metals.dev): ${pricePerGram.toFixed(2)} USD`);

      return parseFloat(pricePerGram.toFixed(2)); // İki ondalık basamak ve sayıya dönüştür
    } catch (ex) {
      console.error(`Altın fiyatı çekilirken hata oluştu: ${ex.message}`);
      // API'den hata alınırsa varsayılan bir fiyat dönüyoruz
      return 60.00; // Varsayılan fiyatı kendi projenize göre ayarlayın
    }
  }
}

module.exports = new GoldPriceService(); // Singleton olarak dışa aktar