import React from 'react';
import { Link } from 'react-router-dom';
import { useSettings } from '../store/SettingsContext';
import { Phone, Mail, MapPin, MessageCircle, Facebook, Instagram, Twitter, WhatsApp } from './Icons';
import './Footer.css';

export default function Footer() {
  const { settings } = useSettings();

  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <h2 className="footer-logo">{settings.siteName || 'QASAK'}</h2>
          <p className="footer-tagline">BY MAIRA</p>
          <p className="footer-desc">Premium fashion collection for the modern individual. Where luxury meets style.</p>
        </div>

        <div className="footer-links">
          <h4>Quick Links</h4>
          <Link to="/">Home</Link>
          <Link to="/#categories">Categories</Link>
          <Link to="/#items">Shop</Link>
          <Link to="/about">About Us</Link>
          <Link to="/contact">Contact</Link>
        </div>

        <div className="footer-contact">
          <h4>Contact</h4>
          <div className="footer-contact-row">
            <Phone size={16} color="var(--neon-blue)" />
            <p>{settings.mobile || '+92 300 0000000'}</p>
          </div>
          <div className="footer-contact-row">
            <Mail size={16} color="var(--neon-blue)" />
            <p>{settings.email || 'info@qasakbymaira.com'}</p>
          </div>
          <div className="footer-contact-row">
            <MapPin size={16} color="var(--neon-blue)" />
            <p>{settings.address || 'Fashion District, Pakistan'}</p>
          </div>
        </div>

        <div className="footer-social">
          <h4>Follow Us</h4>
          <div className="social-links">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <Facebook size={18} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <Instagram size={18} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <Twitter size={18} />
            </a>
            <a href={`https://wa.me/${(settings.mobile || '').replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
              <WhatsApp size={18} />
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>{settings.footerText || '\u00A9 2026 QASAK BY MAIRA. All Rights Reserved.'}</p>
        <p className="footer-demo">Designed with passion for fashion</p>
      </div>
    </footer>
  );
}
