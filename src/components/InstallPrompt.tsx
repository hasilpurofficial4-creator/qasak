import React, { useEffect, useState, useRef } from 'react';
import { Download, X } from './Icons';
import './InstallPrompt.css';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallPrompt() {
  const deferredPromptRef = useRef<BeforeInstallPromptEvent | null>(null);
  const [show, setShow] = useState(false);
  const [canInstall, setCanInstall] = useState(false);

  useEffect(() => {
    // Track visits
    const visitCount = Number(localStorage.getItem('qasak_visit_count') || '0') + 1;
    localStorage.setItem('qasak_visit_count', String(visitCount));

    // Only show on first 3 visits
    const alreadyInstalled = localStorage.getItem('qasak_app_installed') === 'true';
    const dismissed = localStorage.getItem('qasak_install_dismissed') === 'true';

    if (alreadyInstalled || dismissed || visitCount > 3) return;

    const handler = (e: Event) => {
      e.preventDefault();
      deferredPromptRef.current = e as BeforeInstallPromptEvent;
      setCanInstall(true);
      setTimeout(() => setShow(true), 2000);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Listen for app installed
    const installedHandler = () => {
      localStorage.setItem('qasak_app_installed', 'true');
      setShow(false);
    };
    window.addEventListener('appinstalled', installedHandler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      window.removeEventListener('appinstalled', installedHandler);
    };
  }, []);

  const handleInstall = async () => {
    const prompt = deferredPromptRef.current;
    if (prompt) {
      prompt.prompt();
      const { outcome } = await prompt.userChoice;
      if (outcome === 'accepted') {
        localStorage.setItem('qasak_app_installed', 'true');
      }
      deferredPromptRef.current = null;
      setShow(false);
    } else {
      // No native prompt available — show manual instructions
      const ua = navigator.userAgent.toLowerCase();
      if (ua.includes('safari') && !ua.includes('chrome')) {
        alert('To install: tap the Share button and then "Add to Home Screen"');
      } else {
        alert('To install: open this page in Chrome/Edge and tap the install icon in the address bar or menu');
      }
    }
  };

  const handleDismiss = () => {
    setShow(false);
    localStorage.setItem('qasak_install_dismissed', 'true');
  };

  if (!show) return null;

  return (
    <div className="install-prompt">
      <button className="install-close" onClick={handleDismiss} aria-label="Dismiss">
        <X size={18} />
      </button>
      <div className="install-content">
        <div className="install-icon">
          <Download size={28} color="#b829e3" />
        </div>
        <div className="install-text">
          <h4>Install QASAK App</h4>
          <p>Add to your home screen for quick access</p>
        </div>
        <button className="install-btn" onClick={handleInstall}>
          Install
        </button>
      </div>
    </div>
  );
}
