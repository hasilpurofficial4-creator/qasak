import React from 'react';
import './About.css';

export default function About() {
  return (
    <div className="about-page">
      <div className="about-inner">
        <div className="about-hero">
          <h1 className="section-title">About QASAK</h1>
          <p className="about-tagline">BY MAIRA — Where Fashion Meets Art</p>
        </div>

        <div className="about-content">
          <div className="about-card glass-card">
            <div className="about-icon">✨</div>
            <h3>Our Story</h3>
            <p>
              QASAK BY MAIRA was born from a passion for blending traditional craftsmanship with
              contemporary design. Founded with the vision of making premium fashion accessible,
              we curate collections that celebrate individuality and self-expression.
            </p>
          </div>

          <div className="about-card glass-card">
            <div className="about-icon">🎨</div>
            <h3>Our Vision</h3>
            <p>
              We believe fashion is more than clothing — it's a language. Every piece in our
              collection is carefully selected to empower you to tell your unique story. From
              casual everyday wear to statement pieces for special occasions, QASAK brings you
              styles that transcend trends.
            </p>
          </div>

          <div className="about-card glass-card">
            <div className="about-icon">💎</div>
            <h3>Quality Promise</h3>
            <p>
              Every garment that carries the QASAK label undergoes rigorous quality checks. We
              source the finest fabrics and work with skilled artisans to ensure that each piece
              meets our exacting standards. Premium quality isn't a luxury — it's our promise.
            </p>
          </div>

          <div className="about-card glass-card">
            <div className="about-icon">🌍</div>
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
            <div>
              <p className="about-contact-label">Mobile</p>
              <p>+92 300 0000000</p>
            </div>
            <div>
              <p className="about-contact-label">Email</p>
              <p>info@qasakbymaira.com</p>
            </div>
            <div>
              <p className="about-contact-label">Location</p>
              <p>Fashion District, Pakistan</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
