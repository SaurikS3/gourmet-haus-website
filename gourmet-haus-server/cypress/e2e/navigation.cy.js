describe('Gourmet Haus - Navigation Tests', () => {
  // Helper function to wait for loading screen
  const waitForPageLoad = () => {
    // Wait for loading screen to appear and disappear
    cy.get('.loading-screen', { timeout: 1000 }).should('exist');
    cy.get('.loading-screen', { timeout: 6000 }).should('not.exist');
  };

  beforeEach(() => {
    // Visit the home page before each test
    cy.visit('/');
    waitForPageLoad();
  });

  it('should load the home page successfully', () => {
    cy.url().should('include', '/');
    cy.get('body').should('be.visible');
  });

  it('should display the loading screen for 4 seconds', () => {
    cy.visit('/');
    
    // Check loading screen is visible
    cy.get('.loading-screen', { timeout: 1000 }).should('be.visible');
    cy.get('.loading-text').should('be.visible');
    
    // Check progress bar exists
    cy.get('.progress-bar').should('exist');
    
    // Wait and verify loading screen disappears (4 seconds + buffer)
    cy.get('.loading-screen', { timeout: 6000 }).should('not.exist');
  });

  it('should navigate to Contact page', () => {
    cy.contains('CONTACT').click();
    
    // No loading screen on same-page navigation in React
    cy.url().should('include', '/contact');
    cy.get('body').should('be.visible');
  });

  it('should navigate to Login page', () => {
    cy.contains('LOGIN').click();
    
    // No loading screen on same-page navigation in React
    cy.url().should('include', '/login');
    cy.get('body').should('be.visible');
  });

  it('should have working logo to click back to home', () => {
    // Navigate to contact first
    cy.visit('/contact');
    waitForPageLoad();
    
    // Click the logo to go home (React Router navigation, no reload)
    cy.get('.nav-logo-svg').click();
    
    cy.url().should('eq', Cypress.config().baseUrl + '/');
    cy.get('.brand-name').should('be.visible');
  });

  it('should display navigation menu items', () => {
    cy.get('nav').should('be.visible');
    cy.contains('CONTACT').should('be.visible');
    cy.contains('LOGIN').should('be.visible');
  });

  it('should have no console errors on page load', () => {
    cy.visit('/', {
      onBeforeLoad(win) {
        cy.stub(win.console, 'error').as('consoleError');
      },
    });
    
    waitForPageLoad();
    
    cy.get('@consoleError').should('not.be.called');
  });
});
