import React from 'react';
import { useSettings } from '../store/SettingsContext';
import { Sparkles, Palette, Diamond, Globe, Phone, Mail, MapPin } from '../components/Icons';
import './About.css';

export default function About() {
  const { settings } = useSettings();

  return (
    <div className="about-page">
      <div className="about-inner">
        <div className="about-hero">
          <h1 className="section-title">About {settings.siteName || 'QASAK'}</h1>
          <p className="about-tagline">BY MAIRA — Where Fashion Meets Art</p>
        </div>

        <div className="about-content">
          <div className="about-card glass-card">
            <div className="about-icon"><Sparkles size={32} color="var(--neon-purple)" /></div>
            <h3>Our Story</h3>
            <p>
              QASAK BY MAIRA was born from a passion for blending traditional craftsmanship with
              contemporary design. Founded with the vision of making premium fashion accessible,
              we curate collections that celebrate individuality and self-expression.
            </p>
          </div>

          <div className="about-card glass-card">
            <div className="about-icon"><Palette size={32} color="var(--neon-blue)" /></div>
            <h3>Our Vision</h3>
            <p>
              We believe fashion is more than clothing — it's a language. Every piece in our
              collection is carefully selected to empower you to tell your unique story. From
              casual everyday wear to statement pieces for special occasions, QASAK brings you
              styles that transcend trends.
            </p>
          </div>

          <div className="about-card glass-card">
            <div className="about-icon"><Diamond size={32} color="var(--neon-pink)" /></div>
            <h3>Quality Promise</h3>
            <p>
              Every garment that carries the QASAK label undergoes rigorous quality checks. We
              source the finest fabrics and work with skilled artisans to ensure that each piece
              meets our exacting standards. Premium quality isn't a luxury — it's our promise.
            </p>
          </div>

          <div className="about-card glass-card">
            <div className="about-icon"><Globe size={32} color="var(--neon-gold)" /></div>
            <h3>Sustainability</h3>
            <p>
              We are committed to sustainable fashion practices. From eco-friendly packaging to
              partnering with ethical manufacturers, QASAK BY MAIRA is dedicated to reducing
              our environmental footprint while delivering exceptional style.
            </p>
          </div>
        </div>

        <div className="about-stats glass-card">
          <div className="stat">
            <span className="stat-number">500+</span>
            <span className="stat-label">Products</span>
          </div>
          <div className="stat">
            <span className="stat-number">10K+</span>
            <span className="stat-label">Happy Customers</span>
          </div>
          <div className="stat">
            <span className="stat-number">50+</span>
            <span className="stat-label">Collections</span>
          </div>
          <div className="stat">
            <span className="stat-number">4.9</span>
            <span className="stat-label">Rating</span>
          </div>
        </div>

        <div className="about-contact glass-card">
          <h3>Get In Touch</h3>
          <div className="about-contact-grid">
            <div className="about-contact-item">
              <Phone size={18} color="var(--neon-blue)" />
              <div>
                <p className="about-contact-label">Mobile</p>
                <p>{settings.mobile || '+92 300 0000000'}</p>
              </div>
            </div>
            <div className="about-contact-item">
              <Mail size={18} color="var(--neon-blue)" />
              <div>
                <p className="about-contact-label">Email</p>
                <p>{settings.email || 'info@qasakbymaira.com'}</p>
              </div>
            </div>
            <div className="about-contact-item">
              <MapPin size={18} color="var(--neon-blue)" />
              <div>
                <p className="about-contact-label">Location</p>
                <p>{settings.address || 'Fashion District, Pakistan'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
