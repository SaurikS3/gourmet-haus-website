describe('Gourmet Haus - Responsive Design Tests', () => {
  // Helper function to wait for loading screen
  const waitForPageLoad = () => {
    // Wait for loading screen to appear and disappear
    cy.get('.loading-screen', { timeout: 1000 }).should('exist');
    cy.get('.loading-screen', { timeout: 6000 }).should('not.exist');
  };

  const viewports = [
    { name: 'iPhone SE', width: 375, height: 667 },
    { name: 'iPhone 12 Pro', width: 390, height: 844 },
    { name: 'iPad Mini', width: 768, height: 1024 },
    { name: 'iPad Air', width: 820, height: 1180 },
    { name: 'Desktop', width: 1280, height: 720 },
    { name: 'Large Desktop', width: 1920, height: 1080 },
  ];

  viewports.forEach(({ name, width, height }) => {
    describe(`${name} (${width}x${height})`, () => {
      beforeEach(() => {
        cy.viewport(width, height);
        cy.visit('/');
        waitForPageLoad();
      });

      it('should load without horizontal scroll', () => {
        cy.document().then((doc) => {
          const scrollWidth = doc.documentElement.scrollWidth;
          const clientWidth = doc.documentElement.clientWidth;
          expect(scrollWidth).to.equal(clientWidth);
        });
      });

      it('should display logo correctly', () => {
        cy.get('img[alt*="Logo"]').should('be.visible');
        cy.get('img[alt*="Logo"]').should(($img) => {
          expect($img[0].naturalWidth).to.be.greaterThan(0);
        });
      });

      it('should have readable text', () => {
        cy.get('body').should('have.css', 'font-size');
        // Check that text is not too small (minimum 12px)
        cy.get('p, span, a, button').each(($el) => {
          const fontSize = parseFloat(window.getComputedStyle($el[0]).fontSize);
          expect(fontSize).to.be.at.least(12);
        });
      });

      if (width < 768) {
        it('should show mobile navigation menu (hamburger)', () => {
          // Check for mobile menu button/hamburger
          cy.get('nav').should('exist');
          // Mobile menu should be collapsible
          cy.get('[class*="hamburger"], [class*="menu-button"], [class*="mobile"]')
            .should('exist');
        });
      } else {
        it('should show desktop navigation menu', () => {
          cy.get('nav').should('be.visible');
          cy.contains('CONTACT').should('be.visible');
          cy.contains('LOGIN').should('be.visible');
        });
      }

      it('should have clickable buttons with adequate size', () => {
        cy.get('button, a').each(($el) => {
          const rect = $el[0].getBoundingClientRect();
          if ($el.is(':visible')) {
            // Touch targets should be at least 44x44px
            expect(rect.width).to.be.at.least(20);
            expect(rect.height).to.be.at.least(20);
          }
        });
      });
    });
  });

  describe('Loading Screen Responsive Test', () => {
    viewports.forEach(({ name, width, height }) => {
      it(`should display loading screen properly on ${name}`, () => {
        cy.viewport(width, height);
        cy.visit('/');
        
        // Check loading screen is visible
        cy.get('.loading-screen').should('be.visible');
        cy.get('.loading-text').should('be.visible');
        cy.get('.progress-bar').should('exist');
        
        // Check logo is visible during loading
        cy.get('.loading-screen img, .loading-screen svg').should('exist');
      });
    });
  });

  describe('Contact Form Responsive Test', () => {
    viewports.forEach(({ name, width, height }) => {
      it(`should display contact form properly on ${name}`, () => {
        cy.viewport(width, height);
        cy.visit('/contact');
        waitForPageLoad();
        
        // Check form exists and is usable
        cy.get('form').should('be.visible');
        cy.get('input[type="text"], input[type="email"], textarea')
          .should('have.length.greaterThan', 0);
        
        // Check form elements are properly sized for touch
        cy.get('input, textarea, button').each(($el) => {
          const rect = $el[0].getBoundingClientRect();
          if ($el.is(':visible')) {
            expect(rect.height).to.be.at.least(30);
          }
        });
      });
    });
  });
});
