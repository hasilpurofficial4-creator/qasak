import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getItems } from '../api/service';
import { useCart } from '../store/CartContext';
import toast from 'react-hot-toast';
import type { Product } from '../types';
import './Product.css';

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    getItems()
      .then(items => {
        const found = items.find((p: Product) => p.id === id);
        if (found) {
          setProduct(found);
          if (found.size) setSelectedSize(found.size.split(',')[0]);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="loader-container" style={{ minHeight: '80vh' }}><div className="loader"></div></div>;
  if (!product) return <div className="product-not-found"><h2>Product not found</h2><button className="btn-neon" onClick={() => navigate('/')}>Go Home</button></div>;

  const allImages = [product.mainImage, ...(product.extraImages || [])];
  const sizes = product.size ? product.size.split(',').map(s => s.trim()) : [];
  const finalPrice = product.discount && Number(product.discount) < Number(product.price) ? product.discount : product.price;

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      image: product.mainImage,
      price: finalPrice,
      quantity: String(qty),
      size: selectedSize
    });
    toast.success('Added to cart!');
  };

  const handleBuyNow = () => {
    addToCart({
      id: product.id,
      name: product.name,
      image: product.mainImage,
      price: finalPrice,
      quantity: String(qty),
      size: selectedSize
    });
    navigate('/checkout');
  };

  return (
    <div className="product-page">
      <div className="product-page-inner">
        {/* Image Gallery */}
        <div className="product-gallery">
          <div className="main-image glass-card">
            <img src={allImages[activeImg]} alt={product.name}
              onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=800&fit=crop'; }}
            />
          </div>
          {allImages.length > 1 && (
            <div className="thumb-row">
              {allImages.map((img, idx) => (
                <button key={idx} className={`thumb ${activeImg === idx ? 'active' : ''}`} onClick={() => setActiveImg(idx)}>
                  <img src={img} alt={`View ${idx + 1}`} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="product-details">
          <p className="detail-category">{product.category}</p>
          <h1 className="detail-name">{product.name}</h1>
          <div className="detail-price">
            <span className="detail-current">Rs. {Number(finalPrice).toLocaleString()}</span>
            {product.discount && Number(product.discount) < Number(product.price) && (
              <span className="detail-original">Rs. {Number(product.price).toLocaleString()}</span>
            )}
          </div>
          <p className="detail-desc">{product.description}</p>

          {sizes.length > 0 && (
            <div className="detail-section">
              <label>Size</label>
              <div className="size-options">
                {sizes.map(s => (
                  <button key={s} className={`size-btn ${selectedSize === s ? 'active' : ''}`} onClick={() => setSelectedSize(s)}>{s}</button>
                ))}
              </div>
            </div>
          )}

          <div className="detail-section">
            <label>Quantity</label>
            <div className="qty-control">
              <button onClick={() => setQty(Math.max(1, qty - 1))}>-</button>
              <span>{qty}</span>
              <button onClick={() => setQty(qty + 1)}>+</button>
            </div>
          </div>

          {product.quantityType && (
            <p className="qty-type">Sold by: <strong>{product.quantityType}</strong></p>
          )}

          <div className="detail-actions">
            <button className="btn-neon" onClick={handleAddToCart}>Add to Cart</button>
            <button className="btn-outline" onClick={handleBuyNow}>Buy Now</button>
          </div>
        </div>
      </div>
    </div>
  );
}
