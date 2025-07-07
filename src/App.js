import { useEffect, useState } from "react";
import 'rc-slider/assets/index.css';

import "./App.css";
import ProductCard from "./components/ProductCard";
import FilterPanel from './components/FilterPanel'

function App() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [tempPriceRange, setTempPriceRange] = useState([0, 1000]);
  const [selectedRating, setSelectedRating] = useState(0);

  useEffect(() => {
    // Tek ve temiz bir API çağrısı
    fetch("/api/data") // localhost yerine direkt Vercel fonksiyonumuza istek atıyoruz
      .then(res => {
        if (!res.ok) {
          // Sunucudan gelen hata mesajını yakala
          return res.json().then(err => { throw new Error(err.message || "Veri alınamadı.") });
        }
        return res.json();
      })
      .then(data => {
        const maxPriceFromServer = data.length > 0 ? Math.ceil(Math.max(...data.map(p => p.price)) / 100) * 100 : 1000;
        setProducts(data);
        setFilteredProducts(data);
        setPriceRange([0, maxPriceFromServer]);
        setTempPriceRange([0, maxPriceFromServer]);
        setError(null);
      })
      .catch(err => {
        console.error("Fetch hatası:", err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, []); // Bağımlılık dizisi boş kalacak, sadece ilk render'da çalışacak

  if (loading) return <div className="status-message"><h1>Ürünler yükleniyor...</h1></div>;
  if (error) return <div className="status-message error"><h1>Hata: {error}</h1></div>;

  return (
    <div className="App">
      <div className="product-list-header">
        <h1>Product List</h1>
      </div>

      <FilterPanel
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        tempPriceRange={tempPriceRange}
        setTempPriceRange={setTempPriceRange}
        products={products}
        setFilteredProducts={setFilteredProducts}
        selectedRating={selectedRating}
        setSelectedRating={setSelectedRating}
      />

      <div className="products-container">
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <ProductCard key={product.id || product.name} product={product} />
          ))
        ) : (
          <p style={{ margin: "20px" }}>Seçilen filtrelere uygun ürün bulunamadı.</p>
        )}
      </div>
    </div>
  );
}

export default App;