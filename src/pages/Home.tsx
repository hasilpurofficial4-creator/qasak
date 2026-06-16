import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getItems, getCategories } from '../api/service';
import type { Product, Category } from '../types';
import './Home.css';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('');
  const [sortBy, setSortBy] = useState('');

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
      if (sortBy === 'price-desc') return Number(b.discount || b.price) - Number(a.discount || a.price);
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });

  const handleCategoryClick = (catName: string) => {
    setFilterCat(catName);
    document.getElementById('items')?.scrollIntoView({ behavior: 'smooth' });
  };

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
                src="https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&h=800&fit=crop"
                alt="QASAK Fashion"
                loading="eager"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="section" id="categories">
        <h2 className="section-title">Collections</h2>
        <p className="section-subtitle">Explore our curated fashion categories</p>
        <div className="categories-grid">
          {categories.map((cat, idx) => (
            <div
              key={cat.id}
              className="category-card glass-card animate-fadeInUp"
              style={{ animationDelay: `${idx * 0.1}s` }}
              onClick={() => handleCategoryClick(cat.name)}
            >
              <div className="category-img">
                <img src={cat.image} alt={cat.name} loading="lazy"
                  onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=300&h=200&fit=crop'; }}
                />
              </div>
              <h3 className="category-name">{cat.name}</h3>
              <div className="category-preview">
                <p>View Collection</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Items Section */}
      <section className="section" id="items">
        <h2 className="section-title">Our Collection</h2>
        <p className="section-subtitle">Premium fashion pieces handpicked for you</p>

        <div className="shop-controls">
          <input
            type="text"
            placeholder="Search products..."
            className="input-field search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select className="input-field filter-select" value={filterCat} onChange={(e) => setFilterCat(e.target.value)}>
            <option value="">All Categories</option>
            {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
          </select>
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
