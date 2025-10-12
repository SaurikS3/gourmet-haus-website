# Gourmet Haus - Comprehensive Testing Guide

This guide covers all the tools and methods to test your website's UI, responsiveness, navigation, and performance across all devices.

## 🎯 Quick Start Testing (No Installation Required)

### 1. Chrome DevTools Responsive Testing
**Best for: Immediate responsive testing**

1. Open your site in Chrome: `http://localhost:3000`
2. Press `F12` or `Cmd+Option+I` (Mac) / `Ctrl+Shift+I` (Windows)
3. Click the device toggle icon (or press `Cmd+Shift+M` / `Ctrl+Shift+M`)
4. Test these viewports:
   - **Mobile**: iPhone SE (375px), iPhone 12 Pro (390px), iPhone 14 Pro Max (430px)
   - **Tablet**: iPad Mini (768px), iPad Air (820px), iPad Pro (1024px)
   - **Desktop**: 1280px, 1440px, 1920px

**Key things to test:**
- Navigation menu collapses properly on mobile
- Loading screen displays correctly
- Menu items are readable and clickable
- Images load and scale properly
- Forms are usable on touch devices

### 2. Lighthouse Performance Audit
**Best for: Performance, accessibility, and best practices**

1. Open Chrome DevTools (`F12`)
2. Go to "Lighthouse" tab
3. Select:
   - ✅ Performance
   - ✅ Accessibility
   - ✅ Best Practices
   - ✅ SEO
4. Choose "Mobile" and "Desktop" separately
5. Click "Analyze page load"

**Target Scores:**
- Performance: 90+
- Accessibility: 90+
- Best Practices: 90+
- SEO: 90+

### 3. Real Device Testing (Manual)
**Best for: Actual user experience**

Test on your actual devices:
- Your iPhone/Android phone
- Your iPad/tablet
- Different browsers (Safari, Chrome, Firefox, Edge)

Access via: `http://10.0.0.86:3000` (your local network)

---

## 🔧 Installed Testing Tools

### Cypress - Automated UI & Navigation Testing
**Status: Installing...**

Once installed, you can:

#### Run Cypress Tests
```bash
cd ~/Desktop/gourmet-haus-server
npx cypress open
```

#### Example Test Scenarios (We'll create these):
- ✅ Home page loads correctly
- ✅ Navigation menu works on all pages
- ✅ Loading screen displays for 4 seconds
- ✅ Menu categories filter correctly
- ✅ Contact form validation works
- ✅ Mobile menu hamburger functions
- ✅ Authentication flow works
- ✅ Responsive layouts on different viewports

---

## 🌐 Online Testing Platforms

### BrowserStack (30-day free trial)
**Best for: Real device testing**

1. Sign up at: https://www.browserstack.com/users/sign_up
2. Choose "Live" testing
3. Test on real iOS and Android devices
4. Test on actual desktop browsers

**Recommended Devices to Test:**
- iPhone 13/14 (iOS Safari)
- Samsung Galaxy S21/S22 (Chrome Android)
- iPad Pro (iOS Safari)
- Windows 11 (Chrome, Edge, Firefox)
- macOS (Safari, Chrome)

### LambdaTest (Free tier available)
**Alternative to BrowserStack**

1. Sign up at: https://www.lambdatest.com/
2. Similar features to BrowserStack
3. Good for screenshot testing

### Responsively App (Free Desktop App)
**Best for: Multi-device preview**

1. Download from: https://responsively.app/
2. Enter your local URL: `http://localhost:3000`
3. View multiple devices simultaneously
4. Hot reload works across all views

---

## 📊 Performance Testing

### WebPageTest
**Best for: Detailed performance analysis**

1. Visit: https://www.webpagetest.org/
2. Enter your deployed URL (GitHub Pages link)
3. Choose test location and device
4. Get detailed waterfall charts and filmstrip view

### Network Throttling Test
Test on slow connections:

1. Chrome DevTools → Network tab
2. Change throttling to:
   - Slow 3G (400ms latency)
   - Fast 3G (40ms latency)
   - 4G (20ms latency)
3. Reload and test user experience

---

## ♿ Accessibility Testing

### axe DevTools (Free Chrome Extension)
**Best for: Accessibility compliance**

1. Install: https://chrome.google.com/webstore/detail/axe-devtools-web-accessib/lhdoppojpmngadmnindnejefpokejbdd
2. Open DevTools → axe DevTools tab
3. Click "Scan ALL of my page"
4. Fix any Critical and Serious issues

### Manual Keyboard Navigation Test
1. Use only `Tab`, `Shift+Tab`, `Enter`, `Space`, `Escape`
2. Verify all interactive elements are reachable
3. Check focus indicators are visible
4. Test form completion without mouse

### Screen Reader Test (macOS)
1. Enable VoiceOver: `Cmd+F5`
2. Navigate through your site
3. Ensure all content is readable
4. Check image alt texts are meaningful

---

## 📱 Mobile-Specific Testing Checklist

### Touch Interactions
- [ ] Buttons have adequate touch targets (min 44x44px)
- [ ] Gestures work (swipe, pinch-to-zoom if needed)
- [ ] No hover-dependent functionality
- [ ] Touch feedback is clear

### Mobile Performance
- [ ] Page loads in under 3 seconds
- [ ] No layout shift during loading
- [ ] Images are optimized for mobile
- [ ] Fonts are readable (min 16px body text)

### Mobile Navigation
- [ ] Hamburger menu opens/closes smoothly
- [ ] Menu items are tappable
- [ ] Back button works as expected
- [ ] No horizontal scrolling (unless intentional)

---

## 🖥️ Desktop Testing Checklist

### Layout & Responsiveness
- [ ] Content centers properly on large screens
- [ ] Max-width prevents excessive line lengths
- [ ] Navigation is accessible
- [ ] Hover states work correctly

### Browser Compatibility
Test on:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

---

## 🚀 Automated Testing Scripts

### Add to package.json
```json
{
  "scripts": {
    "test:cypress": "cypress open",
    "test:cypress:headless": "cypress run",
    "test:lighthouse": "lighthouse http://localhost:3000 --view",
    "test:all": "npm run test && npm run test:cypress:headless"
  }
}
```

---

## 📋 Pre-Launch Testing Checklist

Before deploying to production:

### Functionality
- [ ] All navigation links work
- [ ] Forms submit correctly
- [ ] Authentication works (login/logout)
- [ ] Menu management works (admin)
- [ ] Contact form sends emails
- [ ] Firebase connection is stable

### Performance
- [ ] Lighthouse score 90+ (mobile & desktop)
- [ ] Page load time under 3 seconds
- [ ] Images are optimized
- [ ] No console errors

### Responsiveness
- [ ] Tested on mobile (320px - 430px)
- [ ] Tested on tablet (768px - 1024px)
- [ ] Tested on desktop (1280px+)
- [ ] No horizontal scroll issues
- [ ] Text is readable on all sizes

### Cross-Browser
- [ ] Chrome ✓
- [ ] Safari ✓
- [ ] Firefox ✓
- [ ] Edge ✓

### Accessibility
- [ ] Keyboard navigation works
- [ ] Color contrast passes WCAG AA
- [ ] Alt texts for images
- [ ] Form labels are proper
- [ ] Screen reader friendly

### SEO
- [ ] Meta descriptions set
- [ ] Title tags descriptive
- [ ] Images have alt text
- [ ] Mobile-friendly test passes
- [ ] robots.txt configured

---

## 🔍 Testing Your Live Site

Your live site: https://sauriks3.github.io/gourmet-haus-website/

### Google Mobile-Friendly Test
https://search.google.com/test/mobile-friendly

### Google PageSpeed Insights
https://pagespeed.web.dev/

### GTmetrix
https://gtmetrix.com/

---

## 💡 Pro Tips

1. **Test Early and Often**: Don't wait until the end
2. **Real Devices > Emulators**: Always test on actual devices when possible
3. **Test in Incognito**: Avoid cached data affecting results
4. **Document Issues**: Keep track of bugs and fixes
5. **Get User Feedback**: Have others test your site
6. **Monitor After Launch**: Use analytics to find real-world issues

---

## 🆘 Common Issues & Fixes

### Issue: Layout breaks on certain screen sizes
**Fix**: Check media queries, test specific breakpoints

### Issue: Images don't load on mobile
**Fix**: Optimize image sizes, check network requests

### Issue: Navigation menu doesn't close on mobile
**Fix**: Check click handlers, test touch events

### Issue: Slow loading on mobile
**Fix**: Optimize bundle size, lazy load images, reduce animations

---

## 📚 Additional Resources

- React Testing Best Practices: https://kentcdodds.com/blog/common-mistakes-with-react-testing-library
- Web.dev Performance Guide: https://web.dev/performance/
- MDN Responsive Design: https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design
- WCAG Accessibility Guidelines: https://www.w3.org/WAI/WCAG21/quickref/

---

**Last Updated**: October 12, 2025
**Project**: Gourmet Haus Website
**Status**: Ready for comprehensive testing
