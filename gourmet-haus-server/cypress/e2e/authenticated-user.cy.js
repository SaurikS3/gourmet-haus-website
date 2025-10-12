describe('Gourmet Haus - Authenticated User Tests', () => {
  // Helper function to wait for loading screen
  const waitForPageLoad = () => {
    cy.get('.loading-screen', { timeout: 1000 }).should('exist');
    cy.get('.loading-screen', { timeout: 6000 }).should('not.exist');
  };

  // Note: These tests assume you're already logged in via Google in your browser
  // Run with: npx cypress open (then select this test in the UI)
  
  beforeEach(() => {
    cy.visit('/');
    waitForPageLoad();
  });

  describe('Navigation - Logged In User', () => {
    it('should show ACCOUNT instead of LOGIN when logged in', () => {
      // Check if user is logged in by looking for ACCOUNT button
      cy.get('nav').within(() => {
        cy.contains('ACCOUNT').should('be.visible');
        cy.contains('LOGIN').should('not.exist');
      });
    });

    it('should navigate to Profile/Account page', () => {
      cy.contains('ACCOUNT').click();
      
      cy.url().should('include', '/profile');
      cy.get('body').should('be.visible');
    });

    it('should display user profile information', () => {
      cy.visit('/profile');
      waitForPageLoad();
      
      // Check for profile page elements
      cy.get('body').should('be.visible');
      // Profile page should have user-specific content
    });
  });

  describe('Menu Manager - Admin Features', () => {
    beforeEach(() => {
      cy.visit('/profile');
      waitForPageLoad();
    });

    it('should have access to Menu Manager if admin', () => {
      // Look for Menu Manager or admin features
      cy.get('body').should('be.visible');
      
      // Check for menu management UI elements
      cy.get('[class*="menu"], [class*="admin"], [class*="manage"]', { timeout: 10000 })
        .should('exist');
    });

    it('should be able to view menu categories', () => {
      // Menu manager should show categories
      cy.contains(/burger|wrap|rice|fries|sides|dessert/i, { timeout: 10000 })
        .should('be.visible');
    });

    it('should display menu items in manager', () => {
      // Check if menu items are listed
      cy.get('[class*="menu-item"], [class*="item-card"]', { timeout: 10000 })
        .should('have.length.greaterThan', 0);
    });
  });

  describe('Profile Page Features', () => {
    beforeEach(() => {
      cy.visit('/profile');
      waitForPageLoad();
    });

    it('should display profile page successfully', () => {
      cy.url().should('include', '/profile');
      cy.get('body').should('be.visible');
    });

    it('should have navigation back to home', () => {
      cy.get('nav').should('be.visible');
      cy.contains('CONTACT').should('be.visible');
    });

    it('should have user account information section', () => {
      // Profile should have some user info display
      cy.get('[class*="profile"], [class*="user"], [class*="account"]')
        .should('exist');
    });
  });

  describe('Admin Actions - Menu Management', () => {
    beforeEach(() => {
      cy.visit('/profile');
      waitForPageLoad();
    });

    it('should show menu management interface', () => {
      // Look for menu management controls
      cy.get('body').should('be.visible');
      
      // Should have some form of menu editing interface
      cy.get('[class*="menu"], [class*="item"]', { timeout: 10000 })
        .should('exist');
    });

    it('should be able to filter/view different categories', () => {
      // Check for category filters or navigation
      cy.contains(/All|Burgers|Wraps|Rice|Fries|Sides|Desserts/i, { timeout: 10000 })
        .should('be.visible');
    });

    it('should display menu item details', () => {
      // Menu items should show name, description, etc.
      cy.get('[class*="item-name"], [class*="item-description"]', { timeout: 10000 })
        .should('have.length.greaterThan', 0);
    });
  });

  describe('Contact Page - Logged In', () => {
    it('should be accessible when logged in', () => {
      cy.contains('CONTACT').click();
      
      cy.url().should('include', '/contact');
      cy.get('body').should('be.visible');
    });

    it('should display contact form', () => {
      cy.visit('/contact');
      waitForPageLoad();
      
      cy.get('form').should('be.visible');
      cy.get('input[type="text"], input[type="email"], textarea')
        .should('have.length.greaterThan', 0);
    });
  });

  describe('Logout Functionality', () => {
    it('should have a way to logout', () => {
      cy.visit('/profile');
      waitForPageLoad();
      
      // Look for logout button or option
      cy.contains(/logout|sign out/i, { timeout: 10000 }).should('exist');
    });
  });

  describe('Home Page - Logged In View', () => {
    it('should display home page with logged in state', () => {
      cy.visit('/');
      waitForPageLoad();
      
      // Navigation should show ACCOUNT instead of LOGIN
      cy.get('nav').within(() => {
        cy.contains('ACCOUNT').should('be.visible');
      });
    });

    it('should display menu correctly', () => {
      // Menu should be visible and functional
      cy.get('.brand-name').should('be.visible');
      cy.get('.menu-section', { timeout: 10000 }).should('exist');
    });
  });
});
