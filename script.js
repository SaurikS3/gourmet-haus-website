// ============================================
// GOURMET HAUS - ULTRA-LUXURY INTERACTIVE EXPERIENCE
// Revolutionary JavaScript Implementation
// ============================================

class GourmetHausExperience {
    constructor() {
        this.canvas = document.getElementById('particles-canvas');
        this.ctx = this.canvas?.getContext('2d');
        this.particles = [];
        this.mouse = { x: 0, y: 0 };
        this.scrollProgress = 0;
        
        this.init();
    }

    init() {
        // Disable particles on mobile for better performance
        const isMobile = window.innerWidth <= 1024;
        if (this.canvas && this.ctx && !isMobile) {
            this.setupCanvas();
            this.createParticles();
            this.animateParticles();
        } else if (this.canvas && isMobile) {
            // Hide canvas on mobile
            this.canvas.style.display = 'none';
        }
        
        this.setupScrollAnimations();
        this.setupNavigationEffects();
        this.setupMenuItemInteractions();
        this.setupParallaxEffects();
        this.setupSmoothScrolling();
        this.setupCursorEffects();
        this.setupReserveButton();
        this.observeMenuSections();
        this.setupContactForm();
    }

    // ============================================
    // PARTICLE SYSTEM
    // ============================================
    setupCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        window.addEventListener('resize', () => {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
            this.createParticles();
        });
    }

    createParticles() {
        this.particles = [];
        // Significantly reduced particle count on mobile for better performance
        const isMobile = window.innerWidth <= 1024;
        const baseCount = isMobile ? 50000 : 25000; // Less particles on mobile
        const particleCount = Math.floor((window.innerWidth * window.innerHeight) / baseCount);
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 2 + 0.5,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.5,
                opacity: Math.random() * 0.5 + 0.2,
                color: this.getParticleColor()
            });
        }
    }

    getParticleColor() {
        const colors = [
            'rgba(212, 175, 55, ',  // Champagne gold
            'rgba(183, 110, 121, ', // Rose gold
            'rgba(229, 228, 226, '  // Platinum
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    animateParticles() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(particle => {
            // Update position
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            // Wrap around screen
            if (particle.x < 0) particle.x = this.canvas.width;
            if (particle.x > this.canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = this.canvas.height;
            if (particle.y > this.canvas.height) particle.y = 0;
            
            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = particle.color + particle.opacity + ')';
            this.ctx.fill();
            
            // Optimized: Only draw connections to nearby particles, limit checks
            // Skip connection drawing for better performance
        });
        
        requestAnimationFrame(() => this.animateParticles());
    }

    // ============================================
    // SCROLL ANIMATIONS
    // ============================================
    setupScrollAnimations() {
        let ticking = false;
        let lastScrollTime = Date.now();
        
        window.addEventListener('scroll', () => {
            const now = Date.now();
            // Throttle scroll handler to max 60fps
            if (now - lastScrollTime < 16) return;
            lastScrollTime = now;
            
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    this.handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

    handleScroll() {
        const scrolled = window.pageYOffset;
        this.scrollProgress = scrolled / (document.documentElement.scrollHeight - window.innerHeight);
        
        // Navigation scroll effect
        const nav = document.querySelector('.luxury-nav');
        if (nav) {
            if (scrolled > 100) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
        }
        
        // Update active navigation link
        this.updateActiveNavLink();
        
        // Parallax hero section - disabled on mobile to prevent flickering
        const heroSection = document.querySelector('.hero-section');
        if (heroSection && scrolled < window.innerHeight && window.innerWidth > 1024) {
            heroSection.style.transform = `translate3d(0, ${scrolled * 0.5}px, 0)`;
        }
        
        // Show/hide scroll-to-top button
        this.updateScrollToTopButton(scrolled);
    }
    
    updateScrollToTopButton(scrolled) {
        const scrollToTopBtn = document.getElementById('scroll-to-top');
        if (scrollToTopBtn) {
            if (scrolled > 500) {
                scrollToTopBtn.classList.add('visible');
            } else {
                scrollToTopBtn.classList.remove('visible');
            }
        }
    }

    updateActiveNavLink() {
        const sections = document.querySelectorAll('.menu-section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    // ============================================
    // NAVIGATION EFFECTS
    // ============================================
    setupNavigationEffects() {
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.addEventListener('mouseenter', (e) => {
                this.createNavRipple(e);
            });
        });
    }

    createNavRipple(e) {
        const ripple = document.createElement('span');
        const rect = e.target.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: radial-gradient(circle, rgba(212, 175, 55, 0.3) 0%, transparent 70%);
            border-radius: 50%;
            left: ${x}px;
            top: ${y}px;
            pointer-events: none;
            animation: navRippleEffect 0.8s ease-out forwards;
        `;
        
        e.target.appendChild(ripple);
        setTimeout(() => ripple.remove(), 800);
    }

    // ============================================
    // MENU ITEM INTERACTIONS
    // ============================================
    setupMenuItemInteractions() {
        const menuItems = document.querySelectorAll('.menu-item');
        
        menuItems.forEach(item => {
            // Hover effect with 3D transform
            item.addEventListener('mouseenter', (e) => {
                this.createMenuItemGlow(e.currentTarget);
                this.tiltMenuItem(e);
            });
            
            item.addEventListener('mousemove', (e) => {
                this.tiltMenuItem(e);
            });
            
            item.addEventListener('mouseleave', (e) => {
                e.currentTarget.style.transform = '';
                this.removeMenuItemGlow(e.currentTarget);
            });
            
            // Click ripple effect
            item.addEventListener('click', (e) => {
                this.createClickRipple(e);
            });
        });
    }

    tiltMenuItem(e) {
        const item = e.currentTarget;
        const rect = item.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 30; // Reduced effect
        const rotateY = (centerX - x) / 30; // Reduced effect
        
        // Use translate3d for GPU acceleration
        item.style.transform = `
            perspective(1000px)
            rotateX(${rotateX}deg)
            rotateY(${rotateY}deg)
            translate3d(0, -8px, 0)
            scale(1.02)
        `;
    }

    createMenuItemGlow(item) {
        const glow = document.createElement('div');
        glow.className = 'menu-item-glow';
        glow.style.cssText = `
            position: absolute;
            top: -5px;
            left: -5px;
            right: -5px;
            bottom: -5px;
            background: radial-gradient(circle at center, rgba(212, 175, 55, 0.2), transparent 70%);
            border-radius: 25px;
            pointer-events: none;
            z-index: -1;
            opacity: 0;
            animation: glowPulse 2s ease-in-out infinite;
        `;
        item.appendChild(glow);
    }

    removeMenuItemGlow(item) {
        const glow = item.querySelector('.menu-item-glow');
        if (glow) {
            glow.remove();
        }
    }

    createClickRipple(e) {
        const ripple = document.createElement('div');
        const rect = e.currentTarget.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height) * 2;
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: radial-gradient(circle, rgba(212, 175, 55, 0.4) 0%, transparent 60%);
            border-radius: 50%;
            left: ${x}px;
            top: ${y}px;
            pointer-events: none;
            z-index: 100;
            animation: clickRippleEffect 1s ease-out forwards;
        `;
        
        e.currentTarget.appendChild(ripple);
        setTimeout(() => ripple.remove(), 1000);
    }

    // ============================================
    // PARALLAX EFFECTS
    // ============================================
    setupParallaxEffects() {
        // Disable parallax on mobile/touch devices for better performance
        if ('ontouchstart' in window || window.innerWidth <= 1024) {
            return;
        }
        
        let ticking = false;
        let lastMoveTime = Date.now();
        
        window.addEventListener('mousemove', (e) => {
            const now = Date.now();
            // Throttle to 30fps for parallax (smoother but less CPU)
            if (now - lastMoveTime < 33) return;
            lastMoveTime = now;
            
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    this.handleParallax(e);
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

    handleParallax(e) {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        // Parallax layers in hero - only if hero is visible
        const hero = document.querySelector('.hero-section');
        if (hero && window.pageYOffset < window.innerHeight) {
            const layers = document.querySelectorAll('.parallax-layer');
            layers.forEach((layer, index) => {
                const speed = (index + 1) * 10; // Reduced from 15
                const x = (mouseX - 0.5) * speed;
                const y = (mouseY - 0.5) * speed;
                layer.style.transform = `translate3d(${x}px, ${y}px, 0)`; // Use translate3d for GPU
            });
        }
        
        // Move gradient orbs - reduced effect
        const orbs = document.querySelectorAll('.orb');
        orbs.forEach((orb, index) => {
            const speed = (index + 1) * 5; // Reduced from 10
            const x = (mouseX - 0.5) * speed;
            const y = (mouseY - 0.5) * speed;
            orb.style.transform = `translate3d(${x}px, ${y}px, 0)`; // Use translate3d for GPU
        });
    }

    // ============================================
    // SMOOTH SCROLLING
    // ============================================
    setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    const offsetTop = target.offsetTop - 100;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Scroll indicator (EXPLORE button) functionality
        const scrollIndicator = document.querySelector('.scroll-indicator');
        if (scrollIndicator) {
            scrollIndicator.addEventListener('click', () => {
                const menuContent = document.querySelector('.menu-content');
                if (menuContent) {
                    const offsetTop = menuContent.offsetTop - 100;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        }
        
        // Scroll to top button functionality
        this.setupScrollToTop();
    }
    
    setupScrollToTop() {
        const scrollToTopBtn = document.getElementById('scroll-to-top');
        if (scrollToTopBtn) {
            scrollToTopBtn.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
    }

    // ============================================
    // CUSTOM CURSOR EFFECTS
    // ============================================
    setupCursorEffects() {
        // Skip custom cursor on mobile devices
        if ('ontouchstart' in window) return;
        
        const cursor = document.createElement('div');
        cursor.className = 'custom-cursor';
        cursor.style.cssText = `
            position: fixed;
            width: 20px;
            height: 20px;
            border: 2px solid rgba(212, 175, 55, 0.5);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            transition: transform 0.15s ease;
            display: none;
            will-change: transform;
        `;
        document.body.appendChild(cursor);
        
        let mouseX = 0, mouseY = 0;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursor.style.display = 'block';
            // Direct positioning, no animation loop
            cursor.style.transform = `translate3d(${mouseX - 10}px, ${mouseY - 10}px, 0)`;
        }, { passive: true });
        
        // Expand cursor on interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .menu-item');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.style.transform = `translate3d(${mouseX - 10}px, ${mouseY - 10}px, 0) scale(2)`;
                cursor.style.borderColor = 'rgba(212, 175, 55, 0.8)';
            });
            el.addEventListener('mouseleave', () => {
                cursor.style.transform = `translate3d(${mouseX - 10}px, ${mouseY - 10}px, 0) scale(1)`;
                cursor.style.borderColor = 'rgba(212, 175, 55, 0.5)';
            });
        });
    }

    // ============================================
    // RESERVE BUTTON INTERACTION
    // ============================================
    setupReserveButton() {
        // Mobile menu toggle functionality
        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        const navLinks = document.querySelector('.nav-links');
        
        if (mobileToggle && navLinks) {
            mobileToggle.addEventListener('click', () => {
                mobileToggle.classList.toggle('active');
                navLinks.classList.toggle('active');
            });
            
            // Close menu when clicking on a link
            document.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', () => {
                    mobileToggle.classList.remove('active');
                    navLinks.classList.remove('active');
                });
            });
            
            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!mobileToggle.contains(e.target) && !navLinks.contains(e.target)) {
                    mobileToggle.classList.remove('active');
                    navLinks.classList.remove('active');
                }
            });
        }
    }


    // ============================================
    // INTERSECTION OBSERVER FOR SECTIONS
    // ============================================
    observeMenuSections() {
        const options = {
            root: null,
            rootMargin: '-100px',
            threshold: 0.1
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, options);
        
        document.querySelectorAll('.menu-section').forEach(section => {
            observer.observe(section);
        });
    }

    // ============================================
    // CONTACT FORM HANDLER
    // ============================================
    setupContactForm() {
        const form = document.getElementById('contactForm');
        const formResponse = document.getElementById('formResponse');
        
        if (!form) return;
        
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = form.querySelector('.form-submit');
            const submitText = submitBtn.querySelector('.submit-text');
            const originalText = submitText.textContent;
            
            // Disable form and show loading state
            submitBtn.disabled = true;
            submitText.textContent = 'Sending...';
            submitBtn.style.opacity = '0.7';
            formResponse.textContent = '';
            formResponse.className = 'form-response';
            
            try {
                const formData = new FormData(form);
                
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    body: formData
                });
                
                const data = await response.json();
                
                if (data.success) {
                    // Success message
                    formResponse.textContent = '✓ Thank you! Your message has been sent successfully.';
                    formResponse.className = 'form-response success';
                    form.reset();
                    
                    // Reset button after delay
                    setTimeout(() => {
                        submitText.textContent = originalText;
                        submitBtn.disabled = false;
                        submitBtn.style.opacity = '1';
                        formResponse.textContent = '';
                    }, 5000);
                } else {
                    throw new Error(data.message || 'Form submission failed');
                }
            } catch (error) {
                // Error message
                formResponse.textContent = '✗ Sorry, there was an error sending your message. Please try again.';
                formResponse.className = 'form-response error';
                
                // Reset button
                submitText.textContent = originalText;
                submitBtn.disabled = false;
                submitBtn.style.opacity = '1';
                
                console.error('Form submission error:', error);
            }
        });
        
        // Add floating label effect
        const formInputs = form.querySelectorAll('.form-input');
        formInputs.forEach(input => {
            input.addEventListener('focus', () => {
                input.parentElement.classList.add('focused');
            });
            
            input.addEventListener('blur', () => {
                if (!input.value) {
                    input.parentElement.classList.remove('focused');
                }
            });
            
            // Check if input has value on load
            if (input.value) {
                input.parentElement.classList.add('focused');
            }
        });
    }
}

// ============================================
// ADDITIONAL ANIMATION STYLES
// ============================================
function addAnimationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes navRippleEffect {
            from {
                transform: scale(0);
                opacity: 1;
            }
            to {
                transform: scale(2);
                opacity: 0;
            }
        }
        
        @keyframes clickRippleEffect {
            from {
                transform: scale(0);
                opacity: 1;
            }
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        @keyframes glowPulse {
            0%, 100% {
                opacity: 0;
            }
            50% {
                opacity: 1;
            }
        }
        
        .nav-link.active {
            color: var(--champagne-gold);
        }
        
        .nav-link.active::after {
            width: 100%;
        }
    `;
    document.head.appendChild(style);
}

// ============================================
// LOADING SCREEN MANAGER
// ============================================
class LoadingScreenManager {
    constructor() {
        this.loadingScreen = document.getElementById('loading-screen');
        this.minimumLoadTime = 4500; // Minimum time to show loading screen (4.5 seconds)
        this.startTime = Date.now();
        this.init();
    }

    init() {
        // Wait for both minimum time and page load
        Promise.all([
            this.waitForMinimumTime(),
            this.waitForPageLoad()
        ]).then(() => {
            this.hideLoadingScreen();
        });
    }

    waitForMinimumTime() {
        return new Promise(resolve => {
            const elapsed = Date.now() - this.startTime;
            const remaining = Math.max(0, this.minimumLoadTime - elapsed);
            setTimeout(resolve, remaining);
        });
    }

    waitForPageLoad() {
        return new Promise(resolve => {
            if (document.readyState === 'complete') {
                resolve();
            } else {
                window.addEventListener('load', resolve);
            }
        });
    }

    hideLoadingScreen() {
        if (this.loadingScreen) {
            // Add hidden class to trigger fade out
            this.loadingScreen.classList.add('hidden');
            
            // Remove from DOM after animation completes
            setTimeout(() => {
                this.loadingScreen.style.display = 'none';
                document.body.classList.add('loaded');
                
                // Ensure hero section is visible and properly positioned after loading
                const heroSection = document.querySelector('.hero-section');
                if (heroSection) {
                    heroSection.style.opacity = '1';
                    heroSection.style.transform = 'translateZ(0)';
                }
            }, 1000);
        }
    }
}

// ============================================
// INITIALIZE ON DOM CONTENT LOADED
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize loading screen
    new LoadingScreenManager();
    
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (!prefersReducedMotion) {
        new GourmetHausExperience();
        addAnimationStyles();
    } else {
        // Simplified version for reduced motion
        document.querySelectorAll('.menu-section').forEach(section => {
            section.classList.add('visible');
        });
    }
});

// ============================================
// EXPORT FOR EXTERNAL USE
// ============================================
window.GourmetHausExperience = GourmetHausExperience;
