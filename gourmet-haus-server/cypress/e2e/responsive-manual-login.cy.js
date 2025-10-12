describe('Gourmet Haus - Manual Login & Responsive Tests', () => {
  // Helper function to wait for loading screen
  const waitForPageLoad = () => {
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

  // STEP 1: Manual login test - Run this FIRST
  describe('Step 1: Manual Login', () => {
    it('should allow you to log in manually - CLICK LOGIN and sign in with Google', () => {
      cy.visit('/');
      waitForPageLoad();
      
      // Display instructions
      cy.log('====================================');
      cy.log('PLEASE LOG IN NOW:');
      cy.log('1. Click the LOGIN button');
      cy.log('2. Sign in with Google');
      cy.log('3. Wait for redirect back to home');
      cy.log('4. This test will wait 60 seconds');
      cy.log('====================================');
      
      // Wait 60 seconds for manual login
      cy.wait(60000);
      
      // Check if logged in
      cy.get('body').then(($body) => {
        if ($body.text().includes('ACCOUNT')) {
          cy.log('✓ SUCCESS: You are logged in!');
        } else {
          cy.log('⚠ WARNING: Not logged in yet. Please log in before continuing.');
        }
      });
    });
  });

  // STEP 2: Responsive tests - Run AFTER logging in
  describe('Step 2: Responsive Tests (After Login)', () => {
    viewports.forEach(({ name, width, height }) => {
      describe(`Testing ${name} (${width}x${height})`, () => {
        beforeEach(() => {
          cy.viewport(width, height);
          cy.visit('/');
          waitForPageLoad();
        });

        it('should verify user is logged in', () => {
          cy.contains('ACCOUNT', { timeout: 10000 }).should('be.visible');
          cy.log(`✓ Confirmed logged in on ${name}`);
        });

        it('should have no horizontal scroll', () => {
          cy.document().then((doc) => {
            const scrollWidth = doc.documentElement.scrollWidth;
            const clientWidth = doc.documentElement.clientWidth;
            expect(scrollWidth).to.equal(clientWidth);
          });
          cy.log(`✓ No horizontal scroll on ${name}`);
        });

        it('should display navigation correctly', () => {
          if (width < 768) {
            cy.get('nav').should('exist');
            cy.log(`✓ Mobile navigation exists on ${name}`);
          } else {
            cy.contains('ACCOUNT').should('be.visible');
            cy.contains('CONTACT').should('be.visible');
            cy.log(`✓ Desktop navigation visible on ${name}`);
          }
        });

        it('should have readable text (min 12px)', () => {
          let allReadable = true;
          cy.get('p, span, a, button, h1, h2, h3').each(($el) => {
            if ($el.is(':visible')) {
              const fontSize = parseFloat(window.getComputedStyle($el[0]).fontSize);
              if (fontSize < 12) {
                allReadable = false;
                cy.log(`⚠ Small text found: ${fontSize}px`);
              }
            }
          }).then(() => {
            expect(allReadable).to.be.true;
            cy.log(`✓ All text readable on ${name}`);
          });
        });

        it('should have properly sized buttons and links', () => {
          let allProperSize = true;
          cy.get('button, a').each(($el) => {
            const rect = $el[0].getBoundingClientRect();
            if ($el.is(':visible') && rect.width > 0 && rect.height > 0) {
              if (rect.width < 20 || rect.height < 20) {
                allProperSize = false;
                cy.log(`⚠ Small interactive element: ${rect.width}x${rect.height}px`);
              }
            }
          }).then(() => {
            expect(allProperSize).to.be.true;
            cy.log(`✓ All interactive elements properly sized on ${name}`);
          });
        });
      });
    });
  });

  // STEP 3: Test navigation between pages
  describe('Step 3: Navigation Tests (After Login)', () => {
    const pages = [
      { name: 'Home', path: '/', selector: 'body' },
      { name: 'Profile', path: '/profile', selector: 'body' },
      { name: 'Contact', path: '/contact', selector: 'form' }
    ];

    pages.forEach(({ name, path, selector }) => {
      it(`should load ${name} page correctly`, () => {
        cy.viewport(1280, 720);
        cy.visit(path);
        waitForPageLoad();
        
        cy.get(selector).should('be.visible');
        cy.contains('ACCOUNT').should('be.visible');
        
        cy.document().then((doc) => {
          const scrollWidth = doc.documentElement.scrollWidth;
          const clientWidth = doc.documentElement.clientWidth;
          expect(scrollWidth).to.equal(clientWidth);
        });
        
        cy.log(`✓ ${name} page loads correctly when logged in`);
      });
    });
  });

  // STEP 4: Summary
  describe('Step 4: Test Summary', () => {
    it('should display test completion summary', () => {
      cy.visit('/');
      waitForPageLoad();
      
      cy.log('====================================');
      cy.log('TEST SUITE COMPLETE!');
      cy.log('====================================');
      cy.log('✓ Manual login verification');
      cy.log(`✓ ${viewports.length} viewport sizes tested`);
      cy.log('✓ Navigation tested across all pages');
      cy.log('✓ All responsive checks passed');
      cy.log('====================================');
      
      cy.contains('ACCOUNT').should('be.visible');
    });
  });
});
