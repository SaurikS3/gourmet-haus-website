# CSS Architecture Documentation

## Overview
The Gourmet Haus project now uses a **modular CSS architecture** to improve maintainability, scalability, and organization. The monolithic `styles.css` file (3000+ lines) has been split into focused, component-specific files.

## File Structure

```
src/styles/
├── index.css          # Main entry point (imports all modules)
├── base.css          # Global styles, CSS reset, CSS variables
├── navigation.css    # Navigation bar and mobile menu
├── login.css         # Login and authentication pages
└── profile.css       # User profile dashboard
```

## File Descriptions

### 1. `index.css` (Main Entry)
- **Purpose**: Single import point for all styles
- **Size**: ~20 lines
- **Imports**: All modular CSS files
- **Usage**: Import this file in `App.js`

### 2. `base.css` (~200 lines)
- **Purpose**: Foundation styles for the entire application
- **Contains**:
  - CSS Reset (`*, :root`)
  - CSS Custom Properties (colors, fonts, spacing, animations)
  - Global HTML/body styles
  - Background effects (gradient orbs, particles)
  - Accessibility settings
  - Print styles

### 3. `navigation.css` (~190 lines)
- **Purpose**: Navigation components
- **Contains**:
  - `.luxury-nav` - Main navigation bar
  - `.nav-logo`, `.nav-links`, `.nav-link` - Navigation elements
  - `.mobile-menu-toggle` - Mobile menu button
  - Responsive navigation breakpoints

### 4. `login.css` (~260 lines)
- **Purpose**: Authentication and login pages
- **Contains**:
  - `.login-page`, `.login-container`, `.login-card`
  - `.login-header`, `.login-title`, `.login-subtitle`
  - `.google-sign-in-btn` - Sign-in button with animations
  - `.login-features` - Features list section
  - Responsive login layouts

### 5. `profile.css` (~550 lines)
- **Purpose**: User profile dashboard and management
- **Contains**:
  - `.profile-page`, `.profile-container`
  - `.profile-welcome` - Welcome header section
  - `.profile-sidebar`, `.profile-nav` - Sidebar navigation
  - `.profile-nav-item` - Tab navigation buttons
  - `.profile-section` - Main content sections
  - Form styles (`.form-input-profile`, `.form-label-profile`)
  - Button styles (`.btn-edit`, `.btn-save`, `.btn-cancel`)
  - `.preference-tag` - Dietary preference toggles
  - Empty states and responsive layouts

## Design System

### CSS Custom Properties (Variables)
All design tokens are defined in `base.css`:

```css
/* Colors */
--deep-black: #0a0a0a;
--champagne-gold: #d4af37;
--pearl-white: #f8f6f0;

/* Typography */
--font-display: 'Cinzel', 'Playfair Display', serif;
--font-body: 'Cormorant Garamond', serif;

/* Spacing */
--space-sm: 1rem;
--space-lg: 2.5rem;

/* Animations */
--ease-luxury: cubic-bezier(0.4, 0, 0.2, 1);
```

### Benefits of This Architecture

1. **Maintainability**: Each file is focused and under 600 lines
2. **Scalability**: Easy to add new component styles
3. **Performance**: Better caching and parallel loading
4. **Organization**: Clear separation of concerns
5. **Collaboration**: Multiple developers can work on different files
6. **Debugging**: Easier to locate and fix specific issues

## Usage

### In React Components
```javascript
// App.js
import './styles/index.css';
```

### Adding New Styles
1. Create a new file in `src/styles/` (e.g., `menu.css`)
2. Add your component-specific styles
3. Import it in `styles/index.css`:
   ```css
   @import './menu.css';
   ```

### Modifying Existing Styles
- Navigate to the appropriate file based on the component
- Make your changes
- Styles will hot-reload in development

## Component Class Naming

### Navigation
- `.luxury-nav` - Main navigation container
- `.nav-link` - Navigation links

### Login Page
- `.login-page` - Page wrapper
- `.login-card` - Main card container
- `.google-sign-in-btn` - Google sign-in button

### Profile Page
- `.profile-page` - Page wrapper
- `.profile-nav-item` - Sidebar navigation buttons
- `.profile-section` - Content sections
- `.preference-tag` - Dietary preference tags

## Responsive Design

All files include responsive breakpoints:
- **Desktop**: 1024px+
- **Tablet**: 768px - 1023px
- **Mobile**: < 768px
- **Small Mobile**: < 480px

## Animation Guidelines

Animations use luxury easing functions:
- `--ease-luxury`: Standard transitions
- `--ease-smooth`: Smooth, elegant movements
- `--ease-bounce`: Playful interactions

## Backup

The original `styles.css` has been renamed to `styles.css.old` for reference.

## Future Enhancements

Consider adding:
- `hero.css` - Homepage hero section
- `menu.css` - Menu items and sections
- `footer.css` - Footer components
- `forms.css` - Shared form components
- `buttons.css` - Button variants

---

**Last Updated**: October 10, 2025
**Maintained By**: Gourmet Haus Development Team
