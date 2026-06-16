import React, { useState } from 'react';
import { createContact } from '../api/service';
import { useSettings } from '../store/SettingsContext';
import { Phone, Mail, MapPin, MessageCircle } from '../components/Icons';
import toast from 'react-hot-toast';
import './Contact.css';

export default function Contact() {
  const { settings } = useSettings();
  const [method, setMethod] = useState('email');
  const [form, setForm] = useState({ name: '', contact: '', subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.contact || !form.subject || !form.message) {
      toast.error('Please fill all fields');
      return;
    }
    setSubmitting(true);
    try {
      await createContact({ ...form, method });
      toast.success('Message sent successfully!');
      setForm({ name: '', contact: '', subject: '', message: '' });
    } catch {
      toast.error('Failed to send message. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="contact-page">
      <div className="contact-inner">
        <h1 className="section-title">Contact Us</h1>
        <p className="section-subtitle">We'd love to hear from you</p>

        <div className="contact-grid">
          <div className="contact-info glass-card">
            <h3>Get In Touch</h3>
            <div className="contact-info-item">
              <div className="contact-icon-wrap"><Phone size={20} color="var(--neon-blue)" /></div>
              <div>
                <p className="contact-label">Mobile</p>
                <p className="contact-value">{settings.mobile || '+92 300 0000000'}</p>
              </div>
            </div>
            <div className="contact-info-item">
              <div className="contact-icon-wrap"><Mail size={20} color="var(--neon-blue)" /></div>
              <div>
                <p className="contact-label">Email</p>
                <p className="contact-value">{settings.email || 'info@qasakbymaira.com'}</p>
              </div>
            </div>
            <div className="contact-info-item">
              <div className="contact-icon-wrap"><MapPin size={20} color="var(--neon-blue)" /></div>
              <div>
                <p className="contact-label">Address</p>
                <p className="contact-value">{settings.address || 'Fashion District, Pakistan'}</p>
              </div>
            </div>
            <div className="contact-info-item">
              <div className="contact-icon-wrap"><MessageCircle size={20} color="var(--neon-blue)" /></div>
              <div>
                <p className="contact-label">WhatsApp</p>
                <p className="contact-value">{settings.mobile || '+92 300 0000000'}</p>
              </div>
            </div>
          </div>

          <form className="contact-form glass-card" onSubmit={handleSubmit}>
            <h3>Send a Message</h3>
            <div className="form-group">
              <label>Name</label>
              <input type="text" name="name" className="input-field" value={form.name} onChange={handleChange} placeholder="Your name" required />
            </div>
            <div className="form-group">
              <label>Preferred Contact Method</label>
              <select name="method" className="input-field" value={method} onChange={(e) => setMethod(e.target.value)}>
                <option value="email">Email</option>
                <option value="mobile">Mobile</option>
                <option value="whatsapp">WhatsApp</option>
              </select>
            </div>
            <div className="form-group">
              <label>{method === 'email' ? 'Email' : method === 'mobile' ? 'Mobile Number' : 'WhatsApp Number'}</label>
              <input
                type={method === 'email' ? 'email' : 'tel'}
                name="contact"
                className="input-field"
                value={form.contact}
                onChange={handleChange}
                placeholder={method === 'email' ? 'your@email.com' : '+92 3XX XXXXXXX'}
                required
              />
            </div>
            <div className="form-group">
              <label>Subject</label>
              <input type="text" name="subject" className="input-field" value={form.subject} onChange={handleChange} placeholder="What's this about?" required />
            </div>
            <div className="form-group">
              <label>Message</label>
              <textarea name="message" className="input-field" rows={5} value={form.message} onChange={handleChange} placeholder="Your message..." required />
            </div>
            <button type="submit" className="btn-neon submit-btn" disabled={submitting}>
              {submitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
