# Gourmet Haus Server Migration Plan

## Current Site Analysis

### Repository Information
- **Current Repository**: `https://github.com/SaurikS3/gourmet-haus-website.git`
- **Domain**: `gourmetnhaus.com`
- **Hosting**: GitHub Pages (static site)
- **Latest Commit**: dc99c4c - "Simplify website: Remove backend dependencies and return to static contact form"

### Site Structure
- **Type**: Static website (HTML/CSS/JavaScript)
- **Main Files**:
  - `index.html` - Single-page luxury restaurant menu site
  - `styles.css` - Styling
  - `script.js` - Interactive features (loading screen, navigation, particles, scroll effects)
  - `CNAME` - Domain configuration for GitHub Pages
  
### Features
- Luxury loading screen with animations
- Particle system background
- Responsive navigation
- Smooth scroll sections (Burgers, Wraps, Rice, Fries, Desserts)
- Microsoft Clarity analytics integration
- Scroll-to-top functionality
- Mobile-optimized design

### Assets
- Multiple logo formats (SVG, PNG, JPG)
- Brand identity elements
- Custom fonts (Playfair Display, Cormorant Garamond, Cinzel)

---

## Migration Strategy

### Phase 1: New Repository Setup

#### Step 1: Create New Repository
```bash
# On GitHub, create new repository (e.g., gourmet-haus-production)
# Options:
# - Public or Private
# - Do NOT initialize with README/LICENSE/.gitignore
```

#### Step 2: Clone Current Repository (Backup)
```bash
# Create a local backup
cd ~/Desktop
git clone https://github.com/SaurikS3/gourmet-haus-website.git gourmet-haus-backup
```

#### Step 3: Prepare New Repository
```bash
# Create new local directory
mkdir gourmet-haus-production
cd gourmet-haus-production
git init
git branch -M main
```

#### Step 4: Copy Files to New Repository
```bash
# Copy all files from current site
cp ~/Desktop/Gourmet\ Haus/index.html .
cp ~/Desktop/Gourmet\ Haus/styles.css .
cp ~/Desktop/Gourmet\ Haus/script.js .
cp ~/Desktop/Gourmet\ Haus/.gitignore .
cp ~/Desktop/Gourmet\ Haus/CNAME .
cp ~/Desktop/Gourmet\ Haus/*.jpg .
cp ~/Desktop/Gourmet\ Haus/*.png .
cp ~/Desktop/Gourmet\ Haus/*.svg .
```

#### Step 5: Initial Commit to New Repository
```bash
git add .
git commit -m "Initial commit: Migrate Gourmet Haus site"
git remote add origin https://github.com/YOUR_USERNAME/gourmet-haus-production.git
git push -u origin main
```

---

### Phase 2: GitHub Pages Configuration

#### Step 1: Enable GitHub Pages on New Repository
1. Go to new repository on GitHub
2. Navigate to **Settings** → **Pages**
3. Under "Source", select branch: `main`
4. Select folder: `/ (root)`
5. Click **Save**

#### Step 2: Verify CNAME File
- Ensure `CNAME` file contains: `gourmetnhaus.com`
- This file should be committed to the repository

---

### Phase 3: Domain Migration

#### Step 1: Update DNS Records
**IMPORTANT**: Do this AFTER new site is deployed and verified

1. Access your domain registrar (where `gourmetnhaus.com` is registered)
2. Update DNS records to point to new GitHub Pages:
   - **A Records** (remove old, add new):
     ```
     185.199.108.153
     185.199.109.153
     185.199.110.153
     185.199.111.153
     ```
   - **CNAME Record** (if using www):
     ```
     www.gourmetnhaus.com → YOUR_USERNAME.github.io
     ```

#### Step 2: Verify DNS Propagation
```bash
# Check DNS records
dig gourmetnhaus.com
nslookup gourmetnhaus.com
```

DNS propagation can take 24-48 hours, but often completes within a few hours.

---

### Phase 4: Old Repository Cleanup

#### Step 1: Remove CNAME from Old Repository
Once the new site is live and domain is pointing to it:

```bash
cd ~/Desktop/Gourmet\ Haus
git rm CNAME
git commit -m "Remove CNAME - domain migrated to new repository"
git push origin main
```

#### Step 2: Archive or Delete Old Repository
**Option A - Archive** (Recommended):
1. Go to old repository settings on GitHub
2. Scroll to "Danger Zone"
3. Click "Archive this repository"
4. Confirm archival

**Option B - Delete** (Permanent):
1. Go to old repository settings on GitHub
2. Scroll to "Danger Zone"
3. Click "Delete this repository"
4. Type repository name to confirm

---

## Pre-Migration Checklist

- [ ] Create backup of current repository locally
- [ ] Create new GitHub repository
- [ ] Test site locally before migration
- [ ] Document current DNS settings
- [ ] Verify domain registrar access
- [ ] Note current analytics configuration (Clarity ID: tnuaj6b2r8)

---

## Migration Day Checklist

### New Repository Setup
- [ ] Copy all files to new repository
- [ ] Commit and push to new repository
- [ ] Enable GitHub Pages on new repository
- [ ] Verify CNAME file is present
- [ ] Wait for GitHub Pages deployment (usually 1-2 minutes)
- [ ] Access site via `YOUR_USERNAME.github.io/gourmet-haus-production`

### Domain Transfer
- [ ] Update DNS A records at domain registrar
- [ ] Update CNAME record (if applicable)
- [ ] Monitor DNS propagation
- [ ] Test site at `gourmetnhaus.com`
- [ ] Verify all pages load correctly
- [ ] Test mobile responsiveness
- [ ] Check analytics are working

### Cleanup
- [ ] Remove CNAME from old repository
- [ ] Archive or delete old repository
- [ ] Update any documentation with new repository URL
- [ ] Update local git remotes if needed

---

## Post-Migration Verification

### Functionality Testing
- [ ] Site loads at `gourmetnhaus.com`
- [ ] Loading screen animates correctly
- [ ] Navigation works (desktop and mobile)
- [ ] All sections scroll smoothly
- [ ] Particle effects display
- [ ] Scroll-to-top button functions
- [ ] Mobile menu toggles correctly
- [ ] All images load properly
- [ ] Analytics tracking verified (check Clarity dashboard)

### Performance Checks
- [ ] Page load speed acceptable
- [ ] No console errors
- [ ] SSL certificate active (https://)
- [ ] Favicon displays correctly

---

## Rollback Plan

If issues arise during migration:

1. **Immediate Rollback** - Revert DNS to old repository:
   - Keep old repository active
   - Re-add CNAME to old repository if removed
   - Wait for DNS to propagate back

2. **Temporary Solution** - Use GitHub Pages URL:
   - Access via `YOUR_USERNAME.github.io/repo-name`
   - Fix issues on new repository
   - Retry domain connection

---

## Key Considerations

### Why Migrate?
- Clean separation of production environment
- Better organization and version control
- Ability to test changes without affecting live site
- Fresh start with updated repository structure

### Timeline Estimate
- **Setup**: 30 minutes
- **DNS Propagation**: 1-48 hours (typically 2-6 hours)
- **Testing**: 1 hour
- **Total**: Plan for 1 day with buffer for DNS

### Risk Mitigation
- **Low Risk**: Static site with no database
- **Backup**: Full local copy maintained
- **Reversible**: Can revert DNS if needed
- **Zero Downtime**: Old site remains live until DNS switches

---

## Commands Reference

### Useful Git Commands
```bash
# Check current remote
git remote -v

# Change remote URL
git remote set-url origin NEW_URL

# View commit history
git log --oneline

# Check status
git status
```

### DNS Verification Commands
```bash
# Check DNS records
dig gourmetnhaus.com
dig www.gourmetnhaus.com

# Alternative DNS lookup
nslookup gourmetnhaus.com

# Check from different DNS servers
dig @8.8.8.8 gourmetnhaus.com  # Google DNS
dig @1.1.1.1 gourmetnhaus.com  # Cloudflare DNS
```

---

## Contact Information

**Current Contact Details in Footer:**
- Phone: (703) 867-5112
- Location: TBD
- Hours: TBD

**Analytics:**
- Microsoft Clarity ID: `tnuaj6b2r8`

---

## Notes

- Site uses no backend services (simplified from previous backend attempts)
- All assets are static files
- No build process required
- No dependencies to install
- Direct HTML/CSS/JS deployment
- Currently using GitHub Pages as hosting platform

---

**Document Created**: For migration from `SaurikS3/gourmet-haus-website` to new production repository  
**Domain**: gourmetnhaus.com  
**Status**: Planning Phase
