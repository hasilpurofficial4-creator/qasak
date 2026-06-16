import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../store/CartContext';
import './Header.css';

export default function Header() {
  const { totalItems, items, removeFromCart } = useCart();
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <header className="header">
        <div className="header-inner">
          <Link to="/" className="logo">
            <span className="logo-text">QASAK</span>
            <span className="logo-sub">BY MAIRA</span>
          </Link>

          <nav className={`nav ${menuOpen ? 'nav-open' : ''}`}>
            <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
            <Link to="/#categories" onClick={() => setMenuOpen(false)}>Categories</Link>
            <Link to="/#items" onClick={() => setMenuOpen(false)}>Shop</Link>
            <Link to="/about" onClick={() => setMenuOpen(false)}>About</Link>
            <Link to="/contact" onClick={() => setMenuOpen(false)}>Contact</Link>
          </nav>

          <div className="header-actions">
            <button className="cart-btn" onClick={() => setCartOpen(true)}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
              {totalItems > 0 && <span className="badge">{totalItems}</span>}
            </button>
            <Link to="/admin" className="admin-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </Link>
            <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
              <span></span><span></span><span></span>
            </button>
          </div>
        </div>
      </header>

      {/* Cart Drawer */}
      <div className={`cart-overlay ${cartOpen ? 'active' : ''}`} onClick={() => setCartOpen(false)} />
      <div className={`cart-drawer ${cartOpen ? 'open' : ''}`}>
        <div className="cart-drawer-header">
          <h3>Shopping Cart</h3>
          <button onClick={() => setCartOpen(false)} className="close-btn">✕</button>
        </div>
        <div className="cart-drawer-items">
          {items.length === 0 ? (
            <p className="empty-cart">Your cart is empty</p>
          ) : (
            items.map(item => (
              <div key={item.id + item.size} className="cart-item">
                <img src={item.image} alt={item.name} loading="lazy" />
                <div className="cart-item-info">
                  <p className="cart-item-name">{item.name}</p>
                  <p className="cart-item-price">Rs. {item.price} × {item.quantity}</p>
                  {item.size && <p className="cart-item-size">Size: {item.size}</p>}
                </div>
                <button className="trash-btn" onClick={() => removeFromCart(item.id)}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ff4444" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>
        {items.length > 0 && (
          <div className="cart-drawer-footer">
            <div className="cart-total">
              <span>Total:</span>
              <span>Rs. {items.reduce((s, i) => s + Number(i.price) * Number(i.quantity), 0).toLocaleString()}</span>
            </div>
            <button className="btn-neon" onClick={() => { setCartOpen(false); navigate('/checkout'); }}>
              Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
}
