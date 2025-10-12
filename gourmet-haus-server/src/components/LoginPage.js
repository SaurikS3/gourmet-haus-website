import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithGoogle } from '../services/authService';

function LoginPage() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError(null);
      await signInWithGoogle();
      navigate('/profile');
    } catch (err) {
      setError(err.message);
      console.error('Sign in error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="login-page-wrapper">
        {/* Back to Home Button */}
        <button 
          onClick={() => navigate('/')} 
          className="back-home-btn"
        >
          ← Back to Home
        </button>

        <div className="login-grid">
          {/* Left Side - Logo Display */}
          <div className="logo-section">
            <div className="logo-background">
              <div className="orb orb-1"></div>
              <div className="orb orb-2"></div>
            </div>
            
            <div className="logo-content">
              <img 
                src="/Icon Logo transparent gourmet-haus-logo.svg" 
                alt="Gourmet Haus" 
                className="logo-image"
              />
              <h1 className="logo-title">GOURMET HAUS</h1>
              <p className="logo-subtitle">CULINARY EXCELLENCE</p>
            </div>
          </div>

          {/* Right Side - Sign In Form */}
          <div className="form-section">
            <div className="form-container">
              <div className="form-header">
                <h2>Sign in</h2>
                <p>to continue to Gourmet Haus</p>
              </div>

              <button 
                className="google-signin-btn"
                onClick={handleGoogleSignIn}
                disabled={loading}
              >
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span>{loading ? 'Signing in...' : 'Sign in with Google'}</span>
              </button>

              {error && (
                <div className="error-message">
                  <span className="error-icon">⚠</span>
                  <span>{error}</span>
                </div>
              )}

              <div className="divider">
                <span className="divider-line"></span>
                <span className="divider-text">Benefits</span>
                <span className="divider-line"></span>
              </div>

              <div className="benefits-list">
                <div className="benefit-item">
                  <div className="benefit-icon">✓</div>
                  <span>Track your orders in real-time</span>
                </div>
                <div className="benefit-item">
                  <div className="benefit-icon">✓</div>
                  <span>Save your favorite items</span>
                </div>
                <div className="benefit-item">
                  <div className="benefit-icon">✓</div>
                  <span>Exclusive member offers</span>
                </div>
              </div>

              <p className="terms-text">
                By signing in, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        .login-page-wrapper {
          width: 100%;
          min-height: 100vh;
          overflow: hidden;
          position: relative;
        }

        .back-home-btn {
          position: fixed;
          top: 20px;
          right: 20px;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #fff;
          padding: 10px 20px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 0.9rem;
          font-weight: 500;
          transition: all 0.3s ease;
          z-index: 1000;
        }

        .back-home-btn:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-2px);
        }

        .login-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          min-height: 100vh;
          width: 100%;
        }

        /* Logo Section */
        .logo-section {
          background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
          display: flex;
          align-items: center;
          justif-content: center;
          position: relative;
          overflow: hidden;
          padding: 40px;
        }

        .logo-background {
          position: absolute;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }

        .orb {
          position: absolute;
          border-radius: 50%;
        }

        .orb-1 {
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(212, 175, 55, 0.15) 0%, transparent 70%);
          top: -250px;
          left: -250px;
          animation: float 20s ease-in-out infinite;
        }

        .orb-2 {
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(244, 228, 179, 0.1) 0%, transparent 70%);
          bottom: -200px;
          right: -200px;
          animation: float 25s ease-in-out infinite reverse;
        }

        .logo-content {
          position: relative;
          z-index: 1;
          text-align: center;
          width: 100%;
          max-width: 500px;
          margin: 0 auto;
        }

        .logo-image {
          width: 100%;
          max-width: 450px;
          height: auto;
          filter: drop-shadow(0 10px 40px rgba(212, 175, 55, 0.3));
          animation: fadeIn 1s ease-out;
        }

        .logo-title {
          margin-top: 40px;
          font-size: clamp(2rem, 5vw, 3rem);
          font-weight: 700;
          background: linear-gradient(135deg, #D4AF37 0%, #F4E4B3 50%, #D4AF37 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          letter-spacing: 3px;
          animation: fadeIn 1.2s ease-out;
        }

        .logo-subtitle {
          margin-top: 20px;
          font-size: clamp(0.9rem, 2vw, 1.1rem);
          color: rgba(255, 255, 255, 0.7);
          letter-spacing: 2px;
          animation: fadeIn 1.4s ease-out;
        }

        /* Form Section */
        .form-section {
          background: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px;
        }

        .form-container {
          width: 100%;
          max-width: 450px;
          animation: slideInRight 0.8s ease-out;
        }

        .form-header {
          margin-bottom: 50px;
        }

        .form-header h2 {
          font-size: clamp(2rem, 4vw, 2.5rem);
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 10px;
        }

        .form-header p {
          font-size: 1rem;
          color: #666;
          line-height: 1.6;
        }

        .google-signin-btn {
          width: 100%;
          padding: 16px 24px;
          background: #ffffff;
          border: 2px solid #dadce0;
          border-radius: 8px;
          color: #3c4043;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          transition: all 0.3s ease;
          margin-bottom: 30px;
        }

        .google-signin-btn:hover:not(:disabled) {
          background: #f8f9fa;
          border-color: #D4AF37;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .google-signin-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .error-message {
          padding: 14px 16px;
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 8px;
          color: #dc2626;
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 30px;
          font-size: 0.95rem;
        }

        .error-icon {
          font-size: 1.2rem;
        }

        .divider {
          display: flex;
          align-items: center;
          margin: 40px 0;
          color: #999;
        }

        .divider-line {
          flex: 1;
          height: 1px;
          background: #e0e0e0;
        }

        .divider-text {
          padding: 0 20px;
          font-size: 0.9rem;
        }

        .benefits-list {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .benefit-item {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .benefit-icon {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: linear-gradient(135deg, #D4AF37 0%, #F4E4B3 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-size: 1.1rem;
          font-weight: bold;
          flex-shrink: 0;
        }

        .benefit-item span {
          color: #3c4043;
          font-size: 1rem;
        }

        .terms-text {
          margin-top: 50px;
          font-size: 0.85rem;
          color: #999;
          text-align: center;
          line-height: 1.6;
        }

        /* Animations */
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes float {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(30px, -30px); }
        }

        /* Responsive Breakpoints */
        
        /* Large Desktop (1920px+) */
        @media (min-width: 1920px) {
          .form-container {
            max-width: 550px;
          }
          .logo-image {
            max-width: 550px;
          }
        }

        /* Desktop (1200px - 1919px) */
        @media (min-width: 1200px) and (max-width: 1919px) {
          .form-container {
            max-width: 500px;
          }
        }

        /* Laptop (992px - 1199px) */
        @media (min-width: 992px) and (max-width: 1199px) {
          .logo-image {
            max-width: 400px;
          }
          .form-container {
            max-width: 420px;
          }
        }

        /* Tablet Landscape (769px - 991px) */
        @media (min-width: 769px) and (max-width: 991px) {
          .logo-image {
            max-width: 350px;
          }
          .logo-title {
            font-size: 2.5rem;
          }
          .form-container {
            max-width: 380px;
          }
        }

        /* Tablet Portrait & Mobile (≤768px) */
        @media (max-width: 768px) {
          .login-grid {
            grid-template-columns: 1fr;
            grid-template-rows: auto 1fr;
          }

          .logo-section {
            min-height: 250px;
            padding: 40px 20px;
          }

          .logo-image {
            max-width: 200px;
          }

          .logo-title {
            margin-top: 20px;
            font-size: 2rem;
          }

          .logo-subtitle {
            font-size: 0.9rem;
            margin-top: 10px;
          }

          .form-section {
            padding: 30px 20px;
          }

          .form-container {
            max-width: 100%;
          }

          .form-header h2 {
            font-size: 2rem;
          }

          .back-home-btn {
            top: 10px;
            right: 10px;
            padding: 8px 16px;
            font-size: 0.85rem;
          }
        }

        /* Small Mobile (≤480px) */
        @media (max-width: 480px) {
          .logo-section {
            min-height: 200px;
            padding: 30px 15px;
          }

          .logo-image {
            max-width: 150px;
          }

          .logo-title {
            font-size: 1.5rem;
            margin-top: 15px;
            letter-spacing: 2px;
          }

          .logo-subtitle {
            font-size: 0.8rem;
            letter-spacing: 1.5px;
          }

          .form-section {
            padding: 20px 15px;
          }

          .form-header {
            margin-bottom: 40px;
          }

          .form-header h2 {
            font-size: 1.75rem;
            margin-bottom: 8px;
          }

          .form-header p {
            font-size: 0.9rem;
          }

          .google-signin-btn {
            padding: 14px 20px;
            font-size: 0.95rem;
          }

          .back-home-btn {
            top: 8px;
            right: 8px;
            padding: 6px 12px;
            font-size: 0.8rem;
          }
        }

        /* Very Small Screens (≤360px) */
        @media (max-width: 360px) {
          .logo-section {
            min-height: 180px;
          }

          .logo-image {
            max-width: 120px;
          }

          .logo-title {
            font-size: 1.25rem;
          }

          .form-header h2 {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </>
  );
}

export default LoginPage;
