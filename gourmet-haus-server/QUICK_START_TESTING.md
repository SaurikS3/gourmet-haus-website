# Quick Start Testing Guide

## 🚀 Start Testing Right Now (5 Minutes)

### Option 1: Chrome DevTools (Easiest - No Setup)

1. **Open your site** (if not already running):
   ```bash
   cd ~/Desktop/gourmet-haus-server
   npm start
   ```
   Visit: http://localhost:3000

2. **Open DevTools**: Press `Cmd+Option+I` (Mac) or `Ctrl+Shift+I` (Windows)

3. **Toggle Device Mode**: Press `Cmd+Shift+M` (Mac) or `Ctrl+Shift+M` (Windows)

4. **Test These Devices**:
   - iPhone 12 Pro (390px)
   - iPad Air (820px)
   - Desktop (1920px)

5. **What to Check**:
   - ✅ Loading screen displays properly (4 seconds)
   - ✅ Navigation menu works
   - ✅ All images load
   - ✅ Text is readable
   - ✅ Buttons are clickable

### Option 2: Lighthouse Audit (2 Minutes)

1. **With DevTools open**, go to "Lighthouse" tab
2. Select all categories: Performance, Accessibility, Best Practices, SEO
3. Choose "Mobile" 
4. Click "Analyze page load"
5. **Review scores** - aim for 90+ on all

### Option 3: Network Throttling Test

1. **DevTools** → **Network** tab
2. Change "No throttling" to **"Slow 3G"**
3. Reload page (`Cmd+R` or `Ctrl+R`)
4. Check if:
   - Loading screen works smoothly
   - Content loads progressively
   - No broken images

---

## 🧪 Run Cypress Tests (Automated)

Cypress is now installed! Let's run it:

```bash
cd ~/Desktop/gourmet-haus-server
npx cypress open
```

This will:
1. Open Cypress Test Runner
2. Show available tests
3. Let you run tests in a real browser

**Note**: We'll create test files in the next step.

---

## 📱 Test on Your Phone (Real Device)

1. **Find your local IP** (already shown when npm start runs):
   - Look for: `On Your Network: http://10.0.0.86:3000`

2. **On your phone's browser**, visit:
   ```
   http://10.0.0.86:3000
   ```

3. **Test these scenarios**:
   - Tap the hamburger menu (mobile only)
   - Try navigation between pages
   - Fill out the contact form
   - Check if everything is readable
   - Test portrait and landscape modes

---

## 🌐 Test Your Live Website

Your site is live at: **https://sauriks3.github.io/gourmet-haus-website/**

### Quick Online Tests:

1. **Google Mobile-Friendly Test**:
   - Visit: https://search.google.com/test/mobile-friendly
   - Enter: `https://sauriks3.github.io/gourmet-haus-website/`
   - Click "Test URL"

2. **Google PageSpeed Insights**:
   - Visit: https://pagespeed.web.dev/
   - Enter your URL
   - Get mobile and desktop scores

3. **GTmetrix** (Optional):
   - Visit: https://gtmetrix.com/
   - Test performance from different locations

---

## ✅ Quick Testing Checklist

Use this for rapid testing:

### Navigation (2 minutes)
- [ ] Home page loads
- [ ] Can navigate to all pages (Home, Contact, Login, Profile)
- [ ] Menu hamburger works on mobile
- [ ] All links work

### Responsiveness (3 minutes)
- [ ] Test on mobile viewport (375px)
- [ ] Test on tablet viewport (768px)
- [ ] Test on desktop viewport (1440px)
- [ ] No horizontal scrolling

### Forms (2 minutes)
- [ ] Contact form fields work
- [ ] Login form appears
- [ ] Validation messages show

### Loading & Performance (1 minute)
- [ ] Loading screen shows for 4 seconds
- [ ] No console errors (check DevTools Console)
- [ ] Images load properly

### Visual (2 minutes)
- [ ] Logo displays correctly
- [ ] Colors look right
- [ ] Text is readable
- [ ] Buttons have hover effects (desktop)

---

## 🎯 Top 5 Most Important Tests

1. **Mobile Menu Test**: Does the hamburger menu open and close?
2. **Loading Screen Test**: Does it show for 4 seconds?
3. **Navigation Test**: Can you get to all pages?
4. **Contact Form Test**: Does it accept input?
5. **Image Loading Test**: Do all images display?

---

## 🔧 If You Find Issues

1. **Document it**: Take a screenshot
2. **Note the details**:
   - What device/browser?
   - What screen size?
   - What were you doing?
3. **Try to reproduce**: Can you make it happen again?
4. **Priority**:
   - 🔴 Critical: Blocks main functionality
   - 🟡 Important: Affects user experience
   - 🟢 Nice-to-fix: Minor visual issue

---

## 📞 Need Help?

Check the full **TESTING_GUIDE.md** for:
- Detailed testing procedures
- More tools and platforms
- Troubleshooting tips
- Testing best practices

---

**Ready to test?** Start with Option 1 (Chrome DevTools) - it takes just 2 minutes!
