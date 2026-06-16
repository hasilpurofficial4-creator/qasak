import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../store/CartContext';
import { useSettings } from '../store/SettingsContext';
import { ShoppingCart, User, Menu, X, Trash } from './Icons';
import './Header.css';

export default function Header() {
  const { totalItems, items, removeFromCart } = useCart();
  const { settings } = useSettings();
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const brandName = settings.headerText || settings.siteName || 'QASAK';

  return (
    <>
      <header className="header">
        <div className="header-inner">
          <Link to="/" className="logo">
            <span className="logo-text">{brandName.split(' ')[0] || 'QASAK'}</span>
            <span className="logo-sub">{brandName.split(' ').slice(1).join(' ') || 'BY MAIRA'}</span>
          </Link>

          <nav className={`nav ${menuOpen ? 'nav-open' : ''}`}>
            <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
            <Link to="/#categories" onClick={() => setMenuOpen(false)}>Categories</Link>
            <Link to="/#items" onClick={() => setMenuOpen(false)}>Shop</Link>
            <Link to="/about" onClick={() => setMenuOpen(false)}>About</Link>
            <Link to="/contact" onClick={() => setMenuOpen(false)}>Contact</Link>
          </nav>

          <div className="header-actions">
            <button className="cart-btn" onClick={() => setCartOpen(true)} aria-label="Cart">
              <ShoppingCart size={22} />
              {totalItems > 0 && <span className="badge">{totalItems}</span>}
            </button>
            <Link to="/admin" className="admin-btn" aria-label="Admin">
              <User size={20} />
            </Link>
            <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {/* Cart Drawer */}
      <div className={`cart-overlay ${cartOpen ? 'active' : ''}`} onClick={() => setCartOpen(false)} />
      <div className={`cart-drawer ${cartOpen ? 'open' : ''}`}>
        <div className="cart-drawer-header">
          <h3>Shopping Cart</h3>
          <button onClick={() => setCartOpen(false)} className="close-btn" aria-label="Close">
            <X size={20} />
          </button>
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
                <button className="trash-btn" onClick={() => removeFromCart(item.id)} aria-label="Remove">
                  <Trash size={18} color="#ff4444" />
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
