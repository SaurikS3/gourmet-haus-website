# Testing Guide for Logged-In Users

This guide explains how to test your application's UI responsiveness and functionality when you're logged in with Google Sign-In.

## Overview

We've created special tests that work with your existing browser session where you're already logged in. This allows testing the authenticated user experience without needing to automate the Google Sign-In process.

## Prerequisites

1. **Development server must be running**
   ```bash
   cd ~/Desktop/gourmet-haus-server
   npm start
   ```
   The app should be running at `http://localhost:3000`

2. **You must be logged in**
   - Open Safari (or your preferred browser)
   - Navigate to `http://localhost:3000`
   - Click "LOGIN" and sign in with your Google account
   - **Keep this browser window open** - don't close it or log out

## Available Test Suites

### 1. Responsive Design Tests (Authenticated)
**File:** `cypress/e2e/responsive-authenticated.cy.js`

Tests UI responsiveness across 6 different screen sizes while logged in:
- iPhone SE (375x667)
- iPhone 12 Pro (390x844)
- iPad Mini (768x1024)
- iPad Air (820x1180)
- Desktop (1280x720)
- Large Desktop (1920x1080)

**What it tests:**
- ✓ Confirms you're logged in (checks for ACCOUNT button)
- ✓ No horizontal scrolling on any viewport
- ✓ Navigation displays correctly (mobile hamburger vs desktop menu)
- ✓ Text is readable (minimum 12px font size)
- ✓ Interactive elements are properly sized (buttons, links)
- ✓ Menu categories display correctly
- ✓ Profile/Account page responsiveness
- ✓ Menu Manager interface responsiveness
- ✓ Contact form when logged in
- ✓ Navigation between pages
- ✓ Image loading across devices
- ✓ Text overflow handling

### 2. Authenticated User Features
**File:** `cypress/e2e/authenticated-user.cy.js`

Tests all logged-in user functionality:
- ✓ ACCOUNT button visibility and navigation
- ✓ Profile page access and content
- ✓ Menu Manager admin features
- ✓ Category management
- ✓ Menu item operations
- ✓ Contact page accessibility
- ✓ Logout functionality

## How to Run the Tests

### Method 1: Run Responsive Tests (Recommended)

```bash
cd ~/Desktop/gourmet-haus-server
npm run test:responsive:auth
```

This will:
1. Open the Cypress Test Runner UI
2. Show you the `responsive-authenticated.cy.js` test file
3. Click on the test file to run it
4. Watch the tests execute in real-time

### Method 2: Run Authenticated User Tests

```bash
cd ~/Desktop/gourmet-haus-server
npm run test:authenticated
```

This will:
1. Open the Cypress Test Runner UI
2. Show you the `authenticated-user.cy.js` test file
3. Click on the test file to run it

### Method 3: Run All Tests via Cypress UI

```bash
cd ~/Desktop/gourmet-haus-server
npm run cypress
```

Then select either:
- `responsive-authenticated.cy.js`
- `authenticated-user.cy.js`

## Important Notes

### ⚠️ Browser Session Requirements

- **DO NOT** close your logged-in browser window
- **DO NOT** log out while tests are running
- **DO NOT** use incognito/private mode
- The tests use your existing browser session to access authenticated pages

### 🎯 Safari-Specific Testing

Since you mentioned using Safari:
1. Cypress will open in its own browser (Electron/Chrome)
2. BUT it will use the same `localhost:3000` session
3. If you're logged in on Safari at `localhost:3000`, Cypress should recognize the session

### 🔄 If Tests Fail Due to Login

If tests report "User is NOT logged in":

1. **Stop the tests**
2. **Open Safari** and go to `http://localhost:3000`
3. **Log in** with Google Sign-In
4. **Keep Safari open**
5. **Re-run the tests**

Alternatively:
1. When Cypress opens, manually navigate to `/login` in the Cypress browser
2. Complete the Google Sign-In process there
3. Then run the tests

## Test Results

### Understanding the Output

Each test will show:
- ✅ **Green checkmark** = Test passed
- ❌ **Red X** = Test failed (with detailed error message)
- ⚠️ **Warning** = User not logged in (action required)

### Expected Results

**Responsive Tests:**
- 6 viewport sizes × multiple tests per viewport
- Total: ~60-80 individual test cases
- Should see device screenshots for each viewport

**Authenticated User Tests:**
- ~19 individual test cases
- Tests navigation, profile, menu manager, and logout

## Troubleshooting

### Problem: "User is NOT logged in" warning

**Solution:**
1. Ensure you're logged in at `http://localhost:3000` in Safari
2. Try logging in directly in the Cypress browser before running tests

### Problem: Tests timeout or hang

**Solution:**
1. Check that `npm start` is running
2. Verify `http://localhost:3000` loads in your browser
3. Try closing and reopening Cypress

### Problem: Images not loading

**Solution:**
1. Check that all image files exist in the project
2. Verify image paths in your components
3. Check browser console for 404 errors

### Problem: Menu Manager not accessible

**Solution:**
1. Verify you're logged in with an admin account
2. Check Firebase authentication configuration
3. Ensure user has proper permissions in Firestore

## Tips for Best Results

1. **Run tests one at a time** when starting out
2. **Watch the Cypress UI** to see exactly what's happening
3. **Check the screenshots** that Cypress captures for each viewport
4. **Review the console** in Cypress for detailed logs
5. **Use the time-travel feature** in Cypress to debug failed tests

## Next Steps

After running these tests:
1. Review any failures and fix issues
2. Test on actual devices (iPhone, iPad) for real-world validation
3. Consider adding more test cases for specific features
4. Run tests regularly as you make changes to the UI

## Questions?

If you encounter issues:
1. Check that all prerequisites are met
2. Review the test file logs in Cypress
3. Verify your authentication is working in the browser first
4. Try running simpler tests first (navigation.cy.js) to ensure setup is correct
