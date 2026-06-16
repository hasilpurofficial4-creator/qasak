import React, { useState, useCallback, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { CartProvider } from './store/CartContext';
import { SettingsProvider } from './store/SettingsContext';
import Header from './components/Header';
import Footer from './components/Footer';
import IntroScreen from './components/IntroScreen';
import Home from './pages/Home';
import ProductPage from './pages/Product';
import Checkout from './pages/Checkout';
import Contact from './pages/Contact';
import About from './pages/About';
import Admin from './admin/Admin';
import InstallPrompt from './components/InstallPrompt';
import { RefreshCw } from './components/Icons';
import './styles/global.css';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function OrientationLock() {
  useEffect(() => {
    try {
      if (screen.orientation && (screen.orientation as any).lock) {
        (screen.orientation as any).lock('portrait').catch(() => {});
      }
    } catch {}
  }, []);
  return <div className="rotate-overlay"><div className="rotate-content"><RefreshCw size={48} color="#b829e3" /><p>Please rotate your device to portrait mode</p></div></div>;
}

function CustomerLayout() {
  return (
    <>
      <Header />
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>
      <Footer />
      <InstallPrompt />
    </>
  );
}

export default function App() {
  const [showIntro, setShowIntro] = useState(() => {
    return !sessionStorage.getItem('qasak_intro_seen');
  });

  const handleIntroComplete = useCallback(() => {
    sessionStorage.setItem('qasak_intro_seen', '1');
    setShowIntro(false);
  }, []);

  return (
    <BrowserRouter>
      <CartProvider>
        <SettingsProvider>
          <OrientationLock />
          <ScrollToTop />
          {showIntro && <IntroScreen onComplete={handleIntroComplete} />}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#1a1a2e',
                color: '#fff',
                border: '1px solid rgba(184, 41, 227, 0.3)',
                borderRadius: '12px'
              }
            }}
          />
          <Routes>
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/*" element={<Admin />} />
            <Route path="/*" element={<CustomerLayout />} />
          </Routes>
        </SettingsProvider>
      </CartProvider>
    </BrowserRouter>
  );
}
