import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, onSnapshot, query, orderBy, doc } from 'firebase/firestore';
import { db } from '../firebase/config';

function HomePage({ user }) {
  const navigate = useNavigate();
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [contactSettings, setContactSettings] = useState({
    location: 'TBD',
    phone: '(703) 867-5112',
    hours: 'TBD'
  });

  // Real-time sync with Firestore for menu items - ONLY Firestore, no hardcoded fallback
  useEffect(() => {
    const menuQuery = query(
      collection(db, 'menuItems'),
      orderBy('displayOrder', 'asc')
    );

    const unsubscribe = onSnapshot(menuQuery, (snapshot) => {
      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // ONLY use Firestore data - filter for active items
      const activeItems = items.filter(item => item.isActive);
      
      setMenuItems(activeItems);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching menu items:', error);
      setMenuItems([]);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Real-time sync with Firestore for contact settings
  useEffect(() => {
    const contactDocRef = doc(db, 'siteSettings', 'contact');
    const unsubscribe = onSnapshot(contactDocRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        setContactSettings({
          location: data.location || 'TBD',
          phone: data.phone || '(703) 867-5112',
          hours: data.hours || 'TBD'
        });
      }
    }, (error) => {
      console.error('Error fetching contact settings:', error);
    });

    return () => unsubscribe();
  }, []);


  // Group items by category (normalize to lowercase for consistency)
  const groupedItems = menuItems.reduce((acc, item) => {
    // Normalize category to lowercase to prevent duplicates
    const category = item.category ? item.category.toLowerCase() : 'other';
    
    if (!acc[category]) {
      acc[category] = {
        items: [],
        categoryNumber: item.categoryNumber || 999
      };
    }
    acc[category].items.push(item);
    return acc;
  }, {});

  // Get unique categories for navigation (only show categories that have items)
  // Sort by categoryNumber to maintain order
  const navCategories = Object.keys(groupedItems)
    .filter(cat => groupedItems[cat].items.length > 0)
    .sort((a, b) => {
      const catNumA = groupedItems[a].categoryNumber;
      const catNumB = groupedItems[b].categoryNumber;
      return catNumA - catNumB;
    });

  // Create sequential numbering map for all items (same as MenuManager)
  const itemSequentialNumbers = {};
  let counter = 1;
  menuItems.forEach(item => {
    itemSequentialNumbers[item.id] = counter++;
  });

  useEffect(() => {
    // Lightweight scroll handler - NO parallax calculations
    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      const nav = document.querySelector('.luxury-nav');
      if (nav) {
        if (scrolled > 100) {
          nav.classList.add('scrolled');
        } else {
          nav.classList.remove('scrolled');
        }
      }

      const scrollToTopBtn = document.getElementById('scroll-to-top');
      if (scrollToTopBtn) {
        if (scrolled > 500) {
          scrollToTopBtn.classList.add('visible');
        } else {
          scrollToTopBtn.classList.remove('visible');
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Intersection observer for sections
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { rootMargin: '-100px', threshold: 0.1 }
    );

    document.querySelectorAll('.menu-section').forEach((section) => {
      observer.observe(section);
    });

    // Mobile menu toggle
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    const toggleMenu = () => {
      mobileToggle?.classList.toggle('active');
      navLinks?.classList.toggle('active');
    };

    const closeMenu = () => {
      mobileToggle?.classList.remove('active');
      navLinks?.classList.remove('active');
    };

    mobileToggle?.addEventListener('click', toggleMenu);

    // Close menu when any nav link is clicked (for mobile)
    document.querySelectorAll('.nav-link').forEach((link) => {
      link.addEventListener('click', closeMenu);
    });

    // Scroll to top
    const scrollToTopBtn = document.getElementById('scroll-to-top');
    const scrollToTop = () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    scrollToTopBtn?.addEventListener('click', scrollToTop);

    // Smooth scrolling for nav links
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        closeMenu(); // Close mobile menu on navigation
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
          const offsetTop = target.offsetTop - 100;
          window.scrollTo({ top: offsetTop, behavior: 'smooth' });
        }
      });
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      mobileToggle?.removeEventListener('click', toggleMenu);
      scrollToTopBtn?.removeEventListener('click', scrollToTop);
    };
  }, []);

  return (
    <>
      {/* Animated Background */}
      <div className="animated-background">
        <div className="gradient-orbs">
          <div className="orb orb-1"></div>
          <div className="orb orb-2"></div>
          <div className="orb orb-3"></div>
        </div>
        
        {/* Minimal Stars - Very lightweight */}
        <div className="stars-layer">
          {[...Array(window.innerWidth < 768 ? 20 : 40)].map((_, i) => (
            <div 
              key={i} 
              className="star-twinkle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Navigation */}
      <nav className="luxury-nav">
        <div className="nav-logo-container">
          <img src="/Icon Logo transparent gourmet-haus-logo.svg" alt="Gourmet Haus" className="nav-logo-svg" />
        </div>
        <button className="mobile-menu-toggle" aria-label="Menu">
          <span></span>
          <span></span>
          <span></span>
        </button>
        <div className="nav-links">
          {navCategories.map(category => {
            const categoryId = category.toLowerCase().replace(/\s+/g, '-');
            return (
              <a 
                key={category} 
                href={`#${categoryId}`} 
                className="nav-link"
                onClick={(e) => {
                  e.preventDefault();
                  const mobileToggle = document.querySelector('.mobile-menu-toggle');
                  const navLinks = document.querySelector('.nav-links');
                  mobileToggle?.classList.remove('active');
                  navLinks?.classList.remove('active');
                  const target = document.getElementById(categoryId);
                  if (target) {
                    const offsetTop = target.offsetTop - 100;
                    window.scrollTo({ top: offsetTop, behavior: 'smooth' });
                  }
                }}
              >
                {category.toUpperCase()}
              </a>
            );
          })}
          <button onClick={() => {
            const mobileToggle = document.querySelector('.mobile-menu-toggle');
            const navLinks = document.querySelector('.nav-links');
            mobileToggle?.classList.remove('active');
            navLinks?.classList.remove('active');
            navigate('/contact');
          }} className="nav-link" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            CONTACT
          </button>
          <button onClick={() => {
            const mobileToggle = document.querySelector('.mobile-menu-toggle');
            const navLinks = document.querySelector('.nav-links');
            mobileToggle?.classList.remove('active');
            navLinks?.classList.remove('active');
            navigate(user ? '/profile' : '/login');
          }} className="nav-link" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            {user ? 'ACCOUNT' : 'LOGIN'}
          </button>
        </div>
      </nav>

      <div className="menu-container">
        {/* Hero Section */}
        <header className="hero-section">
          <div className="hero-parallax-layers">
            <div className="parallax-layer layer-back"></div>
            <div className="parallax-layer layer-mid"></div>
            <div className="parallax-layer layer-front"></div>
          </div>
          
          <div className="brand-identity">
            <div className="brand-ornament top"></div>
            <h1 className="brand-name">
              <span className="brand-word">
                {['G', 'O', 'U', 'R', 'M', 'E', 'T'].map((letter, i) => (
                  <span key={i} className="letter" style={{'--i': i}} data-letter={letter}>{letter}</span>
                ))}
              </span>
              <span className="brand-word">
                {['H', 'A', 'U', 'S'].map((letter, i) => (
                  <span key={i} className="letter" style={{'--i': i + 7}} data-letter={letter}>{letter}</span>
                ))}
              </span>
            </h1>
            <div className="brand-divider">
              <span className="divider-ornament"></span>
              <span className="divider-diamond">◆</span>
              <span className="divider-ornament"></span>
            </div>
            <p className="brand-tagline">
              {['CASUAL', 'DINING', 'EXTRAORDINARY', 'TASTE'].map((word, i) => (
                <span key={i} className="tagline-word" style={{'--delay': i}}>
                  {word.split('').map((letter, j) => (
                    <span key={j} className="tagline-letter" style={{'--letter-delay': j}}>
                      {letter}
                    </span>
                  ))}
                </span>
              ))}
            </p>
            <div className="brand-ornament bottom"></div>
            <div className="scroll-indicator" onClick={() => {
              const firstSection = document.getElementById('burgers');
              if (firstSection) {
                const offsetTop = firstSection.offsetTop - 100;
                window.scrollTo({ top: offsetTop, behavior: 'smooth' });
              }
            }}>
              <span className="scroll-text">EXPLORE</span>
              <span className="scroll-arrow">↓</span>
            </div>
          </div>
        </header>

        <main className="menu-content">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '4rem 0' }}>
              <p>Loading menu...</p>
            </div>
          ) : Object.keys(groupedItems).length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 0' }}>
              <p>No menu items available.</p>
            </div>
          ) : (
            Object.entries(groupedItems)
              .filter(([, { items }]) => items.length > 0)
              .sort(([, a], [, b]) => a.categoryNumber - b.categoryNumber)
              .map(([category, { items, categoryNumber }]) => {
                // Map lowercase category IDs to display config
                const categoryConfigMap = {
                  'burgers': { id: 'burgers', displayName: 'BURGERS', subtitle: 'Handcrafted Perfection' },
                  'wraps': { id: 'wraps', displayName: 'WRAPS', subtitle: 'Artful Compositions' },
                  'rice': { id: 'rice', displayName: 'RICE DISHES', subtitle: 'Aromatic Treasures' },
                  'fries': { id: 'fries', displayName: 'LOADED FRIES', subtitle: 'Indulgent Creations' },
                  'sides': { id: 'sides', displayName: 'SIDES', subtitle: 'Perfect Pairings' },
                  'desserts': { id: 'desserts', displayName: 'DESSERTS', subtitle: 'Divine Finales' }
                };

                // Category is already lowercase from grouping
                const config = categoryConfigMap[category] || { 
                  id: category.replace(/\s+/g, '-'), 
                  displayName: category.toUpperCase(),
                  subtitle: 'Elegant Selection' 
                };

                return (
                  <section key={category} className="menu-section visible" id={config.id} data-section={config.id} style={{ opacity: 1, transform: 'translateY(0)' }}>
                    <div className="section-header">
                      <div className="section-ornamental-line"></div>
                      <h2 className="section-title">
                        <span className="title-main">{config.displayName}</span>
                        {config.subtitle && <span className="title-subtitle">{config.subtitle}</span>}
                      </h2>
                      <div className="section-ornamental-line"></div>
                    </div>
                    
                    <div className="menu-items">
                      {items.map((item, index) => (
                        <article key={item.id} className="menu-item" data-luxury={item.luxuryType || 'standard'}>
                          {item.badge && <div className="item-luxury-badge">{item.badge}</div>}
                          <div className="item-header">
                            <div className="item-number">{itemSequentialNumbers[item.id]}</div>
                            <h3 className="item-name">
                              <span className="name-main">
                                {item.name.split(' ').map((word, wordIndex) => (
                                  <span key={wordIndex} className="menu-item-word" style={{'--delay': wordIndex}}>
                                    {word.split('').map((letter, letterIndex) => (
                                      <span key={letterIndex} className="menu-item-letter" style={{'--letter-delay': letterIndex}}>
                                        {letter}
                                      </span>
                                    ))}
                                  </span>
                                ))}
                              </span>
                              {item.ornament && <span className="name-ornament">{item.ornament}</span>}
                            </h3>
                          </div>
                          <p className="item-description">{item.description}</p>
                        </article>
                      ))}
                    </div>
                  </section>
                );
              })
          )}
        </main>

        <footer className="menu-footer">
          <div className="footer-ornament-top"></div>
          <div className="brand-signature">
            <p className="signature-text">CRAFTED WITH PASSION</p>
            <p className="signature-location">EST. 2025 • GOURMET HAUS</p>
          </div>
          <div className="footer-info">
            <div className="footer-section">
              <h4>LOCATION</h4>
              <p>{contactSettings.location}</p>
            </div>
            <div className="footer-section">
              <h4>HOURS</h4>
              <p>{contactSettings.hours}</p>
            </div>
            <div className="footer-section">
              <h4>CONTACT</h4>
              <p>{contactSettings.phone}</p>
            </div>
          </div>
        </footer>
      </div>

      {/* Scroll to Top Button */}
      <button id="scroll-to-top" className="scroll-to-top" aria-label="Scroll to top">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 19V5M12 5L5 12M12 5L19 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </>
  );
}

export default HomePage;
