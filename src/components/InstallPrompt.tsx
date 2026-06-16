import React, { useEffect, useState } from 'react';
import { Download, X } from './Icons';
import './InstallPrompt.css';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [show, setShow] = useState(false);

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
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Small delay so it doesn't appear instantly
      setTimeout(() => setShow(true), 2000);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Fallback: show a generic install banner even without PWA support
    const fallbackTimer = setTimeout(() => {
      if (!deferredPrompt && !alreadyInstalled && !dismissed && visitCount <= 3) {
        setShow(true);
      }
    }, 3000);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      clearTimeout(fallbackTimer);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        localStorage.setItem('qasak_app_installed', 'true');
      }
      setDeferredPrompt(null);
    }
    setShow(false);
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
