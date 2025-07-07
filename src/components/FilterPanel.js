import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import './FilterPanel.css'; // varsa CSS dosyan

function FilterPanel({
  priceRange,
  setPriceRange,
  tempPriceRange,
  setTempPriceRange,
  products,
  setFilteredProducts,
  selectedRating,
  setSelectedRating
}) {

  const maxPossiblePrice = products.length > 0 ? Math.max(...products.map(p => p.price)) : 1000;

  const applyFilters = () => {
    setPriceRange(tempPriceRange);

    const filtered = products.filter(product =>
      product.price >= tempPriceRange[0] &&
      product.price <= tempPriceRange[1] &&
      product.popularityScore >= selectedRating
    );
    setFilteredProducts(filtered);
  };

  return (
    <div className="filter-panel">
      <div className="price-filter-container">
        <label className="filter-label">Price</label>
        <div className="price-range-display">
          $ {new Intl.NumberFormat('tr-TR').format(tempPriceRange[0])} – $ {new Intl.NumberFormat('tr-TR').format(tempPriceRange[1])}
        </div>
        <Slider
          range
          min={0}
          max={maxPossiblePrice}
          value={tempPriceRange}
          onChange={value => setTempPriceRange(value)}
          allowCross={false}
        />
      </div>

      <div className="rating-filter">
        <label>Minimum Rating:</label>
        <div className="star-selector">
          {[1, 2, 3, 4, 5].map(i => (
            <span
              key={i}
              className={`star ${i <= selectedRating ? 'selected' : ''}`}
              onClick={() => setSelectedRating(i)}
            >
              ★
            </span>
          ))}
        </div>
      </div>

      <button className="apply-filter-button" onClick={applyFilters}>Filter</button>
    </div>
  );
}

export default FilterPanel;
