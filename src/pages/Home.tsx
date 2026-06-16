import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getItems, getCategories } from '../api/service';
import { useCart } from '../store/CartContext';
import type { Product, Category } from '../types';
import { Truck, Shield, Headphones, RefreshCw, Zap, ArrowRight, Eye, ShoppingCart } from '../components/Icons';
import './Home.css';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('');
  const [sortBy, setSortBy] = useState('');
  const { addToCart } = useCart();

  useEffect(() => {
    Promise.all([getItems(), getCategories()])
      .then(([items, cats]) => {
        setProducts(items);
        setCategories(cats);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = products
    .filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()))
    .filter(p => !filterCat || p.category === filterCat)
    .sort((a, b) => {
      if (sortBy === 'price-asc') return Number(a.discount || a.price) - Number(b.discount || b.price);
      if (sortBy === 'price-desc') return Number(b.discount || b.price) - Number(a.discount || b.price);
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });

  const handleCategoryClick = (catName: string) => {
    setFilterCat(catName);
    document.getElementById('items')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: product.id,
      name: product.name,
      price: product.discount || product.price,
      image: product.mainImage,
      quantity: '1',
      size: ''
    });
  };

  const trending = products.filter(p => p.discount && Number(p.discount) < Number(p.price)).slice(0, 6);

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-gradient"></div>
          <div className="hero-particles">
            {[...Array(6)].map((_, i) => <div key={i} className={`hero-particle hp${i+1}`}></div>)}
          </div>
        </div>
        <div className="hero-content">
          <div className="hero-text">
            <p className="hero-badge animate-fadeInUp">New Collection 2026</p>
            <h1 className="hero-title animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
              <span className="title-line">Redefine</span>
              <span className="title-line gradient-text">Your Style</span>
            </h1>
            <p className="hero-desc animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
              Discover premium fashion that speaks to your soul. Curated collections by MAIRA for the bold and beautiful.
            </p>
            <div className="hero-btns animate-fadeInUp" style={{ animationDelay: '0.6s' }}>
              <a href="#items" className="btn-neon">Shop Now</a>
              <a href="#categories" className="btn-outline">Explore Categories</a>
            </div>
          </div>
          <div className="hero-image animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
            <div className="hero-img-wrapper">
              <div className="hero-img-glow"></div>
              <img
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=800&fit=crop"
                alt="QASAK Fashion"
                loading="eager"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="trust-strip animate-fadeInUp" style={{ animationDelay: '0.8s' }}>
        <div className="trust-badge"><Truck size={24} color="#b829e3" /><span>Free Shipping</span></div>
        <div className="trust-badge"><Shield size={24} color="#00d4ff" /><span>Secure Payment</span></div>
        <div className="trust-badge"><Headphones size={24} color="#ff2d95" /><span>24/7 Support</span></div>
        <div className="trust-badge"><RefreshCw size={24} color="#ffd700" /><span>Easy Returns</span></div>
      </section>

      {/* Categories Section */}
      <section className="section" id="categories">
        <h2 className="section-title">Collections</h2>
        <p className="section-subtitle">Explore our curated fashion categories</p>
        <div className="categories-grid">
          {categories.map((cat, idx) => (
            <div
              key={cat.id}
              className="category-card animate-fadeInUp"
              style={{ animationDelay: `${idx * 0.1}s` }}
              onClick={() => handleCategoryClick(cat.name)}
            >
              <img src={cat.image} alt={cat.name} loading="lazy"
                onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=300&h=200&fit=crop'; }}
              />
              <div className="category-overlay">
                <h3 className="category-name">{cat.name}</h3>
                <span className="category-cta">View Collection <ArrowRight size={16} /></span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trending Now */}
      {trending.length > 0 && (
        <section className="section trending-section">
          <div className="trending-header">
            <div>
              <h2 className="section-title"><Zap size={28} color="#ffd700" /> Trending Now</h2>
              <p className="section-subtitle">Hot deals you don't want to miss</p>
            </div>
            <a href="#items" className="trending-see-all">See All <ArrowRight size={16} /></a>
          </div>
          <div className="trending-scroll">
            {trending.map((product) => (
              <Link to={`/product/${product.id}`} key={product.id} className="trending-card">
                <div className="trending-img">
                  <img src={product.mainImage} alt={product.name} loading="lazy"
                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=400&fit=crop'; }}
                  />
                  <span className="discount-badge">
                    -{Math.round((1 - Number(product.discount) / Number(product.price)) * 100)}%
                  </span>
                </div>
                <div className="trending-info">
                  <p className="product-category">{product.category}</p>
                  <h3 className="product-name">{product.name}</h3>
                  <div className="product-price">
                    <span className="current-price">Rs. {Number(product.discount || product.price).toLocaleString()}</span>
                    <span className="original-price">Rs. {Number(product.price).toLocaleString()}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Items Section */}
      <section className="section" id="items">
        <h2 className="section-title">Our Collection</h2>
        <p className="section-subtitle">Premium fashion pieces handpicked for you</p>

        {/* Quick Category Selector Cards */}
        <div className="cat-selector-grid">
          <button className={`cat-selector-card ${!filterCat ? 'cat-selector-active' : ''}`} onClick={() => setFilterCat('')}>
            <span className="cat-selector-label">All</span>
          </button>
          {categories.map(c => (
            <button key={c.id} className={`cat-selector-card ${filterCat === c.name ? 'cat-selector-active' : ''}`} onClick={() => setFilterCat(c.name)}>
              <img src={c.image} alt={c.name} className="cat-selector-img" loading="lazy" />
              <span className="cat-selector-label">{c.name}</span>
            </button>
          ))}
        </div>

        <div className="shop-controls">
          <input
            type="text"
            placeholder="Search products..."
            className="input-field search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select className="input-field sort-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="">Sort By</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name">Name</option>
          </select>
        </div>

        {loading ? (
          <div className="loader-container"><div className="loader"></div></div>
        ) : filtered.length === 0 ? (
          <p className="no-results">No products found</p>
        ) : (
          <div className="products-grid">
            {filtered.map((product, idx) => (
              <Link
                to={`/product/${product.id}`}
                key={product.id}
                className="product-card glass-card animate-fadeInUp"
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                <div className="product-img">
                  <img src={product.mainImage} alt={product.name} loading="lazy"
                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=400&fit=crop'; }}
                  />
                  <div className="product-overlay">
                    <span className="product-overlay-btn"><Eye size={18} /> Quick View</span>
                  </div>
                  {product.discount && Number(product.discount) < Number(product.price) && (
                    <span className="discount-badge">
                      -{Math.round((1 - Number(product.discount) / Number(product.price)) * 100)}%
                    </span>
                  )}
                </div>
                <div className="product-info">
                  <p className="product-category">{product.category}</p>
                  <h3 className="product-name">{product.name}</h3>
                  <div className="product-price">
                    <span className="current-price">Rs. {Number(product.discount || product.price).toLocaleString()}</span>
                    {product.discount && Number(product.discount) < Number(product.price) && (
                      <span className="original-price">Rs. {Number(product.price).toLocaleString()}</span>
                    )}
                  </div>
                </div>
                <button className="product-cart-btn" onClick={(e) => handleAddToCart(e, product)} aria-label="Add to cart">
                  <ShoppingCart size={18} />
                </button>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* About Preview */}
      <section className="section about-preview">
        <div className="about-preview-content glass-card">
          <h2 className="section-title">About QASAK</h2>
          <p>QASAK BY MAIRA is more than a fashion brand — it's a statement. We believe in crafting pieces that empower, inspire, and transform. Every stitch tells a story of passion, precision, and purpose.</p>
          <Link to="/about" className="btn-outline" style={{ marginTop: '24px', display: 'inline-block' }}>Learn More</Link>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="section contact-cta">
        <div className="contact-cta-content">
          <h2 className="section-title">Get In Touch</h2>
          <p className="section-subtitle">Have questions? We'd love to hear from you.</p>
          <Link to="/contact" className="btn-neon">Contact Us</Link>
        </div>
      </section>
    </div>
  );
}
