import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../store/CartContext';
import { createOrder } from '../api/service';
import toast from 'react-hot-toast';
import './Checkout.css';

export default function Checkout() {
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', mobile: '', email: '', address: '', city: '', district: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) { toast.error('Cart is empty'); return; }
    if (!form.name || !form.mobile || !form.address || !form.city) {
      toast.error('Please fill all required fields'); return;
    }
    setSubmitting(true);
    try {
      await createOrder({
        customer: form,
        items,
        total: String(totalPrice)
      });
      clearCart();
      toast.success('Order placed successfully!');
      navigate('/');
    } catch {
      toast.error('Failed to place order. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="checkout-page">
        <div className="empty-checkout">
          <h2>Your cart is empty</h2>
          <button className="btn-neon" onClick={() => navigate('/')}>Continue Shopping</button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-inner">
        <h1 className="section-title">Checkout</h1>

        <div className="checkout-grid">
          {/* Order Summary */}
          <div className="order-summary glass-card">
            <h3>Order Summary</h3>
            <div className="summary-items">
              {items.map(item => (
                <div key={item.id + item.size} className="summary-item">
                  <img src={item.image} alt={item.name} loading="lazy" />
                  <div className="summary-info">
                    <p className="summary-name">{item.name}</p>
                    <p className="summary-qty">Qty: {item.quantity} {item.size && `| Size: ${item.size}`}</p>
                  </div>
                  <p className="summary-price">Rs. {(Number(item.price) * Number(item.quantity)).toLocaleString()}</p>
                </div>
              ))}
            </div>
            <div className="summary-total">
              <span>Total</span>
              <span>Rs. {totalPrice.toLocaleString()}</span>
            </div>
          </div>

          {/* Customer Form */}
          <form className="checkout-form glass-card" onSubmit={handleSubmit}>
            <h3>Delivery Information</h3>
            <div className="form-group">
              <label>Full Name *</label>
              <input type="text" name="name" className="input-field" value={form.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Mobile Number *</label>
              <input type="tel" name="mobile" className="input-field" value={form.mobile} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" name="email" className="input-field" value={form.email} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Address *</label>
              <textarea name="address" className="input-field" rows={3} value={form.address} onChange={handleChange} required />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>City *</label>
                <input type="text" name="city" className="input-field" value={form.city} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>District</label>
                <input type="text" name="district" className="input-field" value={form.district} onChange={handleChange} />
              </div>
            </div>
            <button type="submit" className="btn-neon submit-btn" disabled={submitting}>
              {submitting ? 'Placing Order...' : 'Place Order'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
