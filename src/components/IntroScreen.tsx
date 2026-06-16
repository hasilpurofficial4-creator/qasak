import React, { useEffect, useState } from 'react';
import './IntroScreen.css';

export default function IntroScreen({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 200);
    const t2 = setTimeout(() => setPhase(2), 1200);
    const t3 = setTimeout(() => setPhase(3), 2200);
    const t4 = setTimeout(() => onComplete(), 3000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, [onComplete]);

  return (
    <div className={`intro-screen ${phase >= 3 ? 'fade-out' : ''}`}>
      <div className="intro-bg">
        <div className="particle p1"></div>
        <div className="particle p2"></div>
        <div className="particle p3"></div>
        <div className="particle p4"></div>
        <div className="particle p5"></div>
      </div>

      <div className="intro-content">
        <div className={`intro-logo ${phase >= 1 ? 'visible' : ''}`}>
          <div className="logo-glow"></div>
          <h1 className="intro-title">QASAK</h1>
          <div className={`intro-line ${phase >= 2 ? 'visible' : ''}`}></div>
          <p className={`intro-subtitle ${phase >= 2 ? 'visible' : ''}`}>BY MAIRA</p>
        </div>

        <div className={`intro-loader ${phase >= 2 ? 'visible' : ''}`}>
          <div className="loader-bar">
            <div className="loader-fill"></div>
          </div>
          <p className="loader-text">Loading Experience</p>
        </div>
      </div>
    </div>
  );
}
