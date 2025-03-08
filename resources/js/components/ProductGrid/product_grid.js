import React from 'react';
import mouse1 from '../../../../resources/sass/img/ATKG2.svg';
import mouse2 from '../../../../resources/sass/img/ATKX5.svg';
import mouse3 from '../../../../resources/sass/img/ATKX5WHITE.svg';
import mouse4 from '../../../../resources/sass/img/ATKBLACK.svg';
import mouse5 from '../../../../resources/sass/img/redrazer.svg';
import mouse6 from '../../../../resources/sass/img/ht.svg';
import mouse7 from '../../../../resources/sass/img/logiM10.svg';
import mouse8 from '../../../../resources/sass/img/SILVERBLACK.svg';
import mouse9 from '../../../../resources/sass/img/ATKG2.svg'; // Placeholder for new product (replace with actual image)
import mouse10 from '../../../../resources/sass/img/ATKX5.svg'; // Placeholder for new product (replace with actual image)
import './../../../sass/components/product_grid.scss';

function ProductGrid() {
  // Placeholder function for future click functionality
  const handleImageClick = () => {
    // No functionality implemented yet
    console.log('Image clicked - functionality to be added');
  };

  return (
    <div className="product-grid">
      <h2>Top Rated Products</h2>
      <div className="products-container">
        <div className="product-card">
          <div className="product-image-container" onClick={handleImageClick}> {/* Make container clickable */}
            <img src={mouse1} alt="Attack Shark G2 Mouse" />
          </div>
          <div className="product-info">
            <div className="stars">★★★☆☆</div>
            <h3>Attack Shark G2</h3>
            <p>₱2,000</p>
            <button className="add-to-cart">Add to cart</button>
          </div>
        </div>

        <div className="product-card">
          <div className="product-image-container" onClick={handleImageClick}>
            <img src={mouse2} alt="Attack Shark X5 Mouse" />
          </div>
          <div className="product-info">
            <div className="stars">★★★☆☆</div>
            <h3>Attack Shark X5</h3>
            <p>₱2,000</p>
            <button className="add-to-cart">Add to cart</button>
          </div>
        </div>

        <div className="product-card">
          <div className="product-image-container" onClick={handleImageClick}>
            <img src={mouse3} alt="Attack Shark X5 White Mouse" />
          </div>
          <div className="product-info">
            <div className="stars">★★★☆☆</div>
            <h3>Attack Shark X5 White</h3>
            <p>₱2,000</p>
            <button className="add-to-cart">Add to cart</button>
          </div>
        </div>

        <div className="product-card">
          <div className="product-image-container" onClick={handleImageClick}>
            <img src={mouse4} alt="Attack Shark G3 Mouse" />
          </div>
          <div className="product-info">
            <div className="stars">★★★☆☆</div>
            <h3>Attack Shark G3</h3>
            <p>₱2,000</p>
            <button className="add-to-cart">Add to cart</button>
          </div>
        </div>

        <div className="product-card">
          <div className="product-image-container" onClick={handleImageClick}>
            <img src={mouse5} alt="Attack Shark G3 Pro Mouse" />
          </div>
          <div className="product-info">
            <div className="stars">★★★☆☆</div>
            <h3>Attack Shark G3 Pro</h3>
            <p>₱2,000</p>
            <button className="add-to-cart">Add to cart</button>
          </div>
        </div>

        <div className="product-card">
          <div className="product-image-container" onClick={handleImageClick}>
            <img src={mouse6} alt="Attack Shark X3 Mouse" />
          </div>
          <div className="product-info">
            <div className="stars">★★★☆☆</div>
            <h3>Attack Shark X3</h3>
            <p>₱2,000</p>
            <button className="add-to-cart">Add to cart</button>
          </div>
        </div>

        <div className="product-card">
          <div className="product-image-container" onClick={handleImageClick}>
            <img src={mouse7} alt="Attack Shark X3 Pro Mouse" />
          </div>
          <div className="product-info">
            <div className="stars">★★★☆☆</div>
            <h3>Attack Shark X3 Pro</h3>
            <p>₱2,000</p>
            <button className="add-to-cart">Add to cart</button>
          </div>
        </div>

        <div className="product-card">
          <div className="product-image-container" onClick={handleImageClick}>
            <img src={mouse8} alt="Attack Shark X5 Pro Mouse" />
          </div>
          <div className="product-info">
            <div className="stars">★★★☆☆</div>
            <h3>Attack Shark X5 Pro</h3>
            <p>₱2,000</p>
            <button className="add-to-cart">Add to cart</button>
          </div>
        </div>

        {/* New Product 1 */}
        <div className="product-card">
          <div className="product-image-container" onClick={handleImageClick}>
            <img src={mouse9} alt="Attack Shark X6 Mouse" />
          </div>
          <div className="product-info">
            <div className="stars">★★★☆☆</div>
            <h3>Attack Shark X6</h3>
            <p>₱2,200</p>
            <button className="add-to-cart">Add to cart</button>
          </div>
        </div>

        {/* New Product 2 */}
        <div className="product-card">
          <div className="product-image-container" onClick={handleImageClick}>
            <img src={mouse10} alt="Attack Shark X7 Mouse" />
          </div>
          <div className="product-info">
            <div className="stars">★★★☆☆</div>
            <h3>Attack Shark X7</h3>
            <p>₱2,300</p>
            <button className="add-to-cart">Add to cart</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductGrid;