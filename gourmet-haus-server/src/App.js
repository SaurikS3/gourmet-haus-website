import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import ProfilePage from './components/ProfilePage';
import ContactPage from './components/ContactPage';
import AdminSetup from './components/AdminSetup';
import { onAuthStateChange } from './services/authService';
import { getAuth } from 'firebase/auth';
import { checkForUpdates, updateStoredVersion, forceReload, forceVersionCheck } from './utils/versionCheck';
import './styles/index.css';

function App() {
  const auth = getAuth();
  // Check if user is ALREADY logged in SYNCHRONOUSLY
  const initialUser = auth.currentUser;
  const [user, setUser] = useState(initialUser);
  const [loading, setLoading] = useState(!initialUser); // Skip loading if already logged in

  useEffect(() => {
    const startTime = Date.now();
    const minimumLoadTime = 3000; // 3 seconds minimum display time

    // Listen for auth state changes
    const unsubscribe = onAuthStateChange((currentUser) => {
      setUser(currentUser);
      
      // If user is logged in, skip loading screen immediately
      if (currentUser) {
        setLoading(false);
        return;
      }
      
      // For non-logged-in users (first visit), show loading screen
      // Calculate remaining time to meet minimum load time
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, minimumLoadTime - elapsedTime);
      
      // Wait for remaining time before hiding loading screen
      setTimeout(() => {
        setLoading(false);
      }, remainingTime);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // AGGRESSIVE: Check version on EVERY page load and auto-reload if outdated
  useEffect(() => {
    const aggressiveVersionCheck = async () => {
      const needsReload = await forceVersionCheck();
      if (needsReload) {
        console.log('🔄 New version detected - auto-reloading...');
        // Silent reload without prompt for better UX
        setTimeout(() => {
          forceReload();
        }, 500);
      }
    };

    // Run immediately on mount (every page load/refresh)
    aggressiveVersionCheck();
  }, []);

  // PERIODIC: Check for version updates every 5 minutes while user is active
  useEffect(() => {
    const checkVersion = async () => {
      const update = await checkForUpdates();
      if (update) {
        console.log('New version detected:', update);
        // Show user-friendly notification
        const shouldUpdate = window.confirm(
          `A new version of Gourmet Haus is available!\n\n` +
          `Current: ${update.currentVersion}\n` +
          `New: ${update.newVersion}\n\n` +
          `Would you like to refresh to get the latest features?`
        );
        
        if (shouldUpdate) {
          updateStoredVersion(update.newVersion, update.timestamp);
          forceReload();
        }
      }
    };

    // Check every 5 minutes
    const interval = setInterval(checkVersion, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-content">
          {/* Logo with Shine Animation */}
          <div className="logo-glow">
            <div className="logo-shine-wrapper">
              <img 
                src="/Icon Logo transparent gourmet-haus-logo.svg" 
                alt="Gourmet Haus Logo" 
                className="brand-logo"
              />
              <div className="logo-shine"></div>
            </div>
          </div>
          
          {/* Text */}
          <p className="loading-text">
            {['P','R','E','P','A','R','I','N','G',' ','Y','O','U','R',' ','E','X','P','E','R','I','E','N','C','E'].map((char, index) => (
              char === ' ' ? 
                <span key={index} className="loading-space"></span> : 
                <span key={index} className="loading-letter" style={{animationDelay: `${0.5 + (index * 0.05)}s`}}>{char}</span>
            ))}
          </p>
          
          {/* Loading Progress Bar */}
          <div className="loading-progress">
            <div className="progress-bar"></div>
          </div>
        </div>
        <style>{`
          .loading-screen {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100vh;
            background: radial-gradient(ellipse at center, #2a2520 0%, #1a1a1a 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            overflow: hidden;
          }

          .loading-content {
            text-align: center;
            padding: 2rem;
            max-width: 600px;
            position: relative;
          }

          /* Logo */
          .logo-glow {
            margin: 3rem 0;
            animation: logoAppear 1.2s ease-out both;
          }

          .logo-shine-wrapper {
            position: relative;
            display: inline-block;
            overflow: hidden;
          }

          .brand-logo {
            width: 100%;
            max-width: 450px;
            height: auto;
            filter: drop-shadow(0 0 35px rgba(212, 175, 55, 0.6));
            animation: logoBreathing 3s ease-in-out infinite;
            position: relative;
            z-index: 1;
          }
          
          .logo-shine {
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(
              90deg,
              transparent 0%,
              transparent 35%,
              rgba(255, 255, 255, 0.9) 50%,
              transparent 65%,
              transparent 100%
            );
            transform: skewX(-20deg);
            animation: logoShineTravel 8s ease-in-out infinite;
            z-index: 2;
            pointer-events: none;
            filter: blur(1px);
          }
          
          /* Moving stars along fork, knife, and plate borders */
          .logo-shine-wrapper::before,
          .logo-shine-wrapper::after {
            content: '✦';
            position: absolute;
            font-size: 0.6rem;
            color: rgba(255, 255, 255, 0.95);
            text-shadow: 
              0 0 8px rgba(255, 255, 255, 0.9),
              0 0 15px rgba(212, 175, 55, 0.7);
            pointer-events: none;
            z-index: 3;
          }
          
          /* Moving star along fork border (left side) - appears once */
          .logo-shine-wrapper::before {
            animation: forkBorderTravel 2s ease-in-out forwards;
          }
          
          /* Moving star along knife border (right side) - appears once with delay */
          .logo-shine-wrapper::after {
            animation: knifeBorderTravel 2s ease-in-out 0.2s forwards;
          }
          
          /* Fork sparkle animation - positioned between fork tines */
          @keyframes forkBorderTravel {
            0% {
              top: 25%;
              left: 35%;
              opacity: 0;
              transform: scale(0.8);
            }
            20% {
              opacity: 1;
              transform: scale(1);
            }
            80% {
              opacity: 1;
              transform: scale(1);
            }
            100% {
              top: 25%;
              left: 35%;
              opacity: 0;
              transform: scale(1.4);
            }
          }
          
          /* Knife sparkle animation - slow fade in and out */
          @keyframes knifeBorderTravel {
            0% {
              top: 30%;
              right: 38%;
              opacity: 0;
              transform: scale(0.8);
            }
            20% {
              opacity: 1;
              transform: scale(1);
            }
            80% {
              opacity: 1;
              transform: scale(1);
            }
            100% {
              top: 30%;
              right: 38%;
              opacity: 0;
              transform: scale(1.4);
            }
          }

          @keyframes logoAppear {
            0% {
              opacity: 0;
              transform: scale(0.85) translateY(-20px);
            }
            60% {
              opacity: 1;
              transform: scale(1.03) translateY(0);
            }
            100% {
              opacity: 1;
              transform: scale(1) translateY(0);
            }
          }

          @keyframes logoBreathing {
            0%, 100% {
              filter: drop-shadow(0 0 35px rgba(212, 175, 55, 0.6));
            }
            50% {
              filter: drop-shadow(0 0 50px rgba(212, 175, 55, 0.85));
            }
          }

          @keyframes logoShineTravel {
            0%, 85%, 100% {
              left: -100%;
              opacity: 0;
            }
            5% {
              opacity: 1;
            }
            30% {
              opacity: 1;
            }
            35% {
              left: 100%;
              opacity: 0;
            }
          }

          .logo-container {
            margin-bottom: 3rem;
            animation: logoReveal 2s ease-out;
          }

          @keyframes logoReveal {
            0% {
              opacity: 0;
              transform: scale(0.8) translateY(-30px);
            }
            60% {
              opacity: 1;
              transform: scale(1.05) translateY(0);
            }
            100% {
              opacity: 1;
              transform: scale(1) translateY(0);
            }
          }

          .logo-wrapper {
            position: relative;
            display: inline-block;
            padding: 3rem;
          }

          .loading-logo {
            width: 100%;
            max-width: 400px;
            height: auto;
            filter: drop-shadow(0 0 40px rgba(212, 175, 55, 0.4));
            animation: logoGlow 3s ease-in-out infinite, logoFloat 4s ease-in-out infinite;
            position: relative;
            z-index: 1;
          }

          @keyframes logoFloat {
            0%, 100% {
              transform: translateY(0px) rotate(0deg);
            }
            25% {
              transform: translateY(-10px) rotate(2deg);
            }
            50% {
              transform: translateY(0px) rotate(0deg);
            }
            75% {
              transform: translateY(-10px) rotate(-2deg);
            }
          }

          .shine-beam {
            position: absolute;
            top: 50%;
            left: 50%;
            width: 120%;
            height: 2px;
            background: linear-gradient(
              90deg,
              transparent 0%,
              transparent 45%,
              rgba(255, 255, 255, 0.8) 50%,
              transparent 55%,
              transparent 100%
            );
            transform-origin: center;
            z-index: 2;
            pointer-events: none;
            opacity: 0;
          }

          .shine-beam-1 {
            animation: shineRotate1 3s ease-in-out infinite;
          }

          .shine-beam-2 {
            animation: shineRotate2 3s ease-in-out infinite 1s;
          }

          .shine-beam-3 {
            animation: shineRotate3 3s ease-in-out infinite 2s;
          }

          @keyframes shineRotate1 {
            0%, 100% {
              transform: translate(-50%, -50%) rotate(0deg);
              opacity: 0;
            }
            10%, 40% {
              opacity: 1;
            }
            50% {
              transform: translate(-50%, -50%) rotate(180deg);
              opacity: 0;
            }
          }

          @keyframes shineRotate2 {
            0%, 100% {
              transform: translate(-50%, -50%) rotate(60deg);
              opacity: 0;
            }
            10%, 40% {
              opacity: 1;
            }
            50% {
              transform: translate(-50%, -50%) rotate(240deg);
              opacity: 0;
            }
          }

          @keyframes shineRotate3 {
            0%, 100% {
              transform: translate(-50%, -50%) rotate(120deg);
              opacity: 0;
            }
            10%, 40% {
              opacity: 1;
            }
            50% {
              transform: translate(-50%, -50%) rotate(300deg);
              opacity: 0;
            }
          }

          @keyframes logoGlow {
            0%, 100% {
              filter: drop-shadow(0 0 40px rgba(212, 175, 55, 0.4));
            }
            50% {
              filter: drop-shadow(0 0 60px rgba(212, 175, 55, 0.7));
            }
          }

          .loading-ornament {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 1rem;
            margin: 2rem 0;
            opacity: 0;
            animation: ornamentFadeIn 1s ease-out 0.5s forwards;
          }

          @keyframes ornamentFadeIn {
            to {
              opacity: 1;
            }
          }

          .ornament-dot {
            width: 4px;
            height: 4px;
            background: #d4af37;
            border-radius: 50%;
            box-shadow: 0 0 10px #d4af37;
            animation: dotPulse 2s ease-in-out infinite;
          }

          @keyframes dotPulse {
            0%, 100% {
              opacity: 0.5;
              transform: scale(1);
            }
            50% {
              opacity: 1;
              transform: scale(1.3);
            }
          }

          .ornament-line {
            width: 80px;
            height: 1px;
            background: linear-gradient(90deg, transparent, #d4af37, transparent);
          }

          .ornament-diamond {
            font-size: 1.5rem;
            color: #d4af37;
            text-shadow: 0 0 20px #d4af37;
            animation: diamondSpin 4s linear infinite;
          }

          @keyframes diamondSpin {
            0%, 100% {
              transform: rotate(0deg) scale(1);
            }
            50% {
              transform: rotate(180deg) scale(1.2);
            }
          }

          .loading-text {
            font-family: 'Playfair Display', Georgia, serif;
            font-size: clamp(0.75rem, 1.8vw, 1.1rem);
            font-weight: 600;
            letter-spacing: 0.3em;
            color: #e8e8e8;
            margin: 2rem 0;
            display: flex;
            justify-content: center;
            flex-wrap: nowrap;
            gap: 0.3rem;
            white-space: nowrap;
          }

          .loading-letter {
            display: inline-block;
            opacity: 0;
            animation: letterReveal 0.5s ease-out forwards;
          }


          @keyframes letterReveal {
            0% {
              opacity: 0;
              transform: translateY(10px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .loading-space {
            display: inline-block;
            opacity: 1;
          }

          .loading-space {
            width: 0.5rem;
          }

          .loading-progress {
            width: 100%;
            max-width: 300px;
            height: 2px;
            background: rgba(212, 175, 55, 0.2);
            border-radius: 2px;
            margin: 3rem auto 0;
            overflow: hidden;
            opacity: 0;
            animation: progressFadeIn 0.5s ease-out 1s forwards;
          }

          @keyframes progressFadeIn {
            to {
              opacity: 1;
            }
          }

          .progress-bar {
            height: 100%;
            background: linear-gradient(90deg, #d4af37, #f4e4c1, #d4af37);
            width: 0%;
            animation: progressFill 3s ease-out forwards;
          }

          @keyframes progressFill {
            0% {
              width: 0%;
            }
            100% {
              width: 100%;
            }
          }

          @media (max-width: 768px) {
            .brand-logo {
              max-width: 380px;
            }
            .loading-text {
              font-size: 0.65rem;
              gap: 0.2rem;
            }
            .ornament-line {
              width: 50px;
            }
          }
        `}</style>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage user={user} />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/profile" element={<ProfilePage user={user} />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/admin-setup" element={<AdminSetup />} />
      </Routes>
    </Router>
  );
}

export default App;
