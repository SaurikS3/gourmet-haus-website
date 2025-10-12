describe('Gourmet Haus - Responsive Design Tests (Authenticated User)', () => {
  // Helper function to wait for loading screen
  const waitForPageLoad = () => {
    // Wait for loading screen to appear and disappear
    cy.get('.loading-screen', { timeout: 1000 }).should('exist');
    cy.get('.loading-screen', { timeout: 6000 }).should('not.exist');
  };

  // Helper to check if user is logged in
  const checkLoggedInState = () => {
    // Wait for page to load
    cy.wait(1000);
    
    // Check if ACCOUNT button exists (indicates logged in)
    cy.get('body').then(($body) => {
      if ($body.text().includes('ACCOUNT')) {
        cy.log('✓ User is logged in - ACCOUNT button found');
        return true;
      } else if ($body.text().includes('LOGIN')) {
        cy.log('⚠ User is NOT logged in - Please log in manually first');
        return false;
      }
    });
  };

  const viewports = [
    { name: 'iPhone SE', width: 375, height: 667 },
    { name: 'iPhone 12 Pro', width: 390, height: 844 },
    { name: 'iPad Mini', width: 768, height: 1024 },
    { name: 'iPad Air', width: 820, height: 1180 },
    { name: 'Desktop', width: 1280, height: 720 },
    { name: 'Large Desktop', width: 1920, height: 1080 },
  ];

  before(() => {
    cy.log('========================================');
    cy.log('IMPORTANT: Make sure you are logged in!');
    cy.log('1. Open http://localhost:3000 in Safari');
    cy.log('2. Log in with Google Sign-In');
    cy.log('3. Keep the browser window open');
    cy.log('4. Run these tests');
    cy.log('========================================');
  });

  describe('Logged-In Home Page Responsiveness', () => {
    viewports.forEach(({ name, width, height }) => {
      describe(`${name} (${width}x${height})`, () => {
        beforeEach(() => {
          cy.viewport(width, height);
          cy.visit('/');
          waitForPageLoad();
        });

        it('should confirm user is logged in', () => {
          checkLoggedInState();
          cy.contains('ACCOUNT').should('be.visible');
        });

        it('should load without horizontal scroll', () => {
          cy.document().then((doc) => {
            const scrollWidth = doc.documentElement.scrollWidth;
            const clientWidth = doc.documentElement.clientWidth;
            expect(scrollWidth).to.equal(clientWidth);
          });
        });

        it('should display navigation correctly for logged-in user', () => {
          cy.get('nav').should('exist');
          
          if (width < 768) {
            // Mobile: check for hamburger menu
            cy.get('[class*="hamburger"], [class*="menu-button"], [class*="mobile"]')
              .should('exist');
          } else {
            // Desktop: check for navigation links
            cy.contains('ACCOUNT').should('be.visible');
            cy.contains('CONTACT').should('be.visible');
          }
        });

        it('should have readable text on all elements', () => {
          cy.get('p, span, a, button, h1, h2, h3').each(($el) => {
            if ($el.is(':visible')) {
              const fontSize = parseFloat(window.getComputedStyle($el[0]).fontSize);
              expect(fontSize).to.be.at.least(12);
            }
          });
        });

        it('should have adequately sized interactive elements', () => {
          cy.get('button, a').each(($el) => {
            const rect = $el[0].getBoundingClientRect();
            if ($el.is(':visible') && rect.width > 0 && rect.height > 0) {
              // Touch targets should be reasonable size
              expect(rect.width).to.be.at.least(20);
              expect(rect.height).to.be.at.least(20);
            }
          });
        });

        it('should display menu categories correctly', () => {
          // Check if menu categories are visible and properly laid out
          cy.get('[class*="category"], [class*="menu"]').should('exist');
        });
      });
    });
  });

  describe('Profile/Account Page Responsiveness', () => {
    viewports.forEach(({ name, width, height }) => {
      it(`should display profile page properly on ${name}`, () => {
        cy.viewport(width, height);
        cy.visit('/profile');
        waitForPageLoad();

        // Check page loads without errors
        cy.get('body').should('be.visible');

        // Check for horizontal scroll
        cy.document().then((doc) => {
          const scrollWidth = doc.documentElement.scrollWidth;
          const clientWidth = doc.documentElement.clientWidth;
          expect(scrollWidth).to.equal(clientWidth);
        });

        // Check text readability
        cy.get('p, span, h1, h2, h3').each(($el) => {
          if ($el.is(':visible')) {
            const fontSize = parseFloat(window.getComputedStyle($el[0]).fontSize);
            expect(fontSize).to.be.at.least(12);
          }
        });
      });
    });
  });

  describe('Menu Manager Responsiveness', () => {
    viewports.forEach(({ name, width, height }) => {
      it(`should display menu manager properly on ${name}`, () => {
        cy.viewport(width, height);
        cy.visit('/');
        waitForPageLoad();

        // Try to access menu manager
        cy.contains('ACCOUNT').click();
        cy.wait(500);

        // Check if menu manager section exists
        cy.get('body').then(($body) => {
          if ($body.text().includes('Menu Manager') || 
              $body.text().includes('Category') || 
              $body.text().includes('Add Item')) {
            
            // Check for horizontal scroll
            cy.document().then((doc) => {
              const scrollWidth = doc.documentElement.scrollWidth;
              const clientWidth = doc.documentElement.clientWidth;
              expect(scrollWidth).to.equal(clientWidth);
            });

            // Check interactive elements
            cy.get('button, input, select, textarea').each(($el) => {
              if ($el.is(':visible')) {
                const rect = $el[0].getBoundingClientRect();
                if (rect.width > 0 && rect.height > 0) {
                  expect(rect.height).to.be.at.least(30);
                }
              }
            });
          }
        });
      });
    });
  });

  describe('Contact Page Responsiveness (Logged In)', () => {
    viewports.forEach(({ name, width, height }) => {
      it(`should display contact form properly on ${name}`, () => {
        cy.viewport(width, height);
        cy.visit('/contact');
        waitForPageLoad();

        // Check form exists
        cy.get('form').should('be.visible');

        // Check for horizontal scroll
        cy.document().then((doc) => {
          const scrollWidth = doc.documentElement.scrollWidth;
          const clientWidth = doc.documentElement.clientWidth;
          expect(scrollWidth).to.equal(clientWidth);
        });

        // Check form elements are properly sized
        cy.get('input, textarea, button').each(($el) => {
          if ($el.is(':visible')) {
            const rect = $el[0].getBoundingClientRect();
            if (rect.height > 0) {
              expect(rect.height).to.be.at.least(30);
            }
          }
        });
      });
    });
  });

  describe('Navigation Between Pages (Logged In)', () => {
    const pages = [
      { name: 'Home', path: '/' },
      { name: 'Contact', path: '/contact' },
      { name: 'Profile', path: '/profile' }
    ];

    viewports.forEach(({ name, width, height }) => {
      pages.forEach(({ name: pageName, path }) => {
        it(`should navigate to ${pageName} without layout issues on ${name}`, () => {
          cy.viewport(width, height);
          cy.visit(path);
          waitForPageLoad();

          // Check no horizontal scroll
          cy.document().then((doc) => {
            const scrollWidth = doc.documentElement.scrollWidth;
            const clientWidth = doc.documentElement.clientWidth;
            expect(scrollWidth).to.equal(clientWidth);
          });

          // Check page is visible
          cy.get('body').should('be.visible');
        });
      });
    });
  });

  describe('Image Loading and Responsiveness', () => {
    viewports.forEach(({ name, width, height }) => {
      it(`should load images properly on ${name}`, () => {
        cy.viewport(width, height);
        cy.visit('/');
        waitForPageLoad();

        // Check all images load successfully
        cy.get('img').each(($img) => {
          if ($img.is(':visible')) {
            cy.wrap($img).should('be.visible');
            cy.wrap($img).should(($el) => {
              expect($el[0].naturalWidth).to.be.greaterThan(0);
            });
          }
        });
      });
    });
  });

  describe('Text Overflow and Truncation', () => {
    viewports.forEach(({ name, width, height }) => {
      it(`should handle text overflow properly on ${name}`, () => {
        cy.viewport(width, height);
        cy.visit('/');
        waitForPageLoad();

        // Check that text doesn't overflow its containers
        cy.get('h1, h2, h3, p, span').each(($el) => {
          if ($el.is(':visible')) {
            const element = $el[0];
            const scrollWidth = element.scrollWidth;
            const clientWidth = element.clientWidth;
            
            // Allow some tolerance for rounding
            expect(scrollWidth - clientWidth).to.be.lessThan(5);
          }
        });
      });
    });
  });
});
