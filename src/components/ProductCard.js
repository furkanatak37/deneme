
import { useState } from "react";
import "./ProductCard.css"; 

const colorMap = {
  yellow: { className: 'color-yellow-gold' },
  rose: { className: 'color-rose-gold' },
  white: { className: 'color-white-gold' },
};


// Yıldızları render eden fonksiyon
function renderStars(score) {
  const stars = [];
  const fullStars = Math.round(score); 
  const maxStars = 5;

  for (let i = 1; i <= maxStars; i++) {
    stars.push(
      <span key={i} className={`star ${i <= fullStars ? 'full' : 'empty'}`}>
        ★
      </span>
    );
  }
  return <div className="stars-container">{stars}</div>;
}


function ProductCard({ product }) {
  const initialColor = Object.keys(product.images)[0] || 'yellow';
  const [selectedColor, setSelectedColor] = useState(initialColor);
  const [selectedImage, setSelectedImage] = useState(product.images[initialColor]);

  if (!product || !product.images || Object.keys(product.images).length === 0) {
    return <div className="product-card">Ürün bilgisi bulunamadı.</div>;
  }

  const handleColorClick = (color, imageUrl) => {
    setSelectedColor(color);
    setSelectedImage(imageUrl);
  };

  const colorOptions = Object.entries(product.images);

  return (
    <div className="product-card">
      <div className="product-image-container">
        <img src={selectedImage} alt={`${product.name} - ${selectedColor}`} className="product-image" />
      </div>

      <div className="product-info">
        <h3 className="product-title">{product.name || "Product Title"}</h3>
        <p className="product-price">${product.price?.toFixed(2) || "0.00"} USD</p>

        <div className="product-colors">
          {colorOptions.map(([color, imageUrl]) => {
            const colorClass = colorMap[color]?.className || '';
            return (
              <div
                key={color}
                className={`color-swatch ${colorClass} ${selectedColor === color ? 'selected' : ''}`}
                onClick={() => handleColorClick(color, imageUrl)}
                title={color.charAt(0).toUpperCase() + color.slice(1) + ' Gold'} // Örn: Yellow Gold
              />
            );
          })}
        </div>

        <div className="product-rating">
          {renderStars(product.popularityScore)}
          <span>{product.popularityScore?.toFixed(1)}/5</span>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;