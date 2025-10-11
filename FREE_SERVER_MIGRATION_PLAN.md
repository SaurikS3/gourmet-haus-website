# Gourmet Haus - Free Full-Stack Server Migration
## GitHub + Free Services (No Monthly Costs)

---

## Perfect Solution: GitHub + Free Tier Services

You want a **real server with full features** without monthly costs. Here's how:

---

## Architecture: The Free Stack

```
┌─────────────────────────────────────────────────┐
│  Frontend: React/Next.js (Static Export)       │
│  Hosting: GitHub Pages (FREE)                   │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│  Authentication: Firebase Auth (FREE)           │
│  - User signup/login                            │
│  - Password reset                               │
│  - Email verification                           │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│  Database: Firebase Firestore (FREE)            │
│  - User profiles                                │
│  - Orders                                       │
│  - Menu items                                   │
│  - Coupons                                      │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│  Email: EmailJS or Brevo (FREE)                 │
│  - Order confirmations                          │
│  - Password resets                              │
│  - Receipts                                     │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│  Payments: Stripe (Pay per transaction)         │
│  - No monthly fee                               │
│  - 2.9% + $0.30 per transaction                 │
└─────────────────────────────────────────────────┘
```

---

## 🎯 What You Get (All FREE)

### User Features
✅ **User Registration & Login** (Firebase Auth)
✅ **Password Reset via Email** (Firebase + Email)
✅ **User Dashboard/Portal** (Order history, favorites)
✅ **Profile Management** (Address, phone, preferences)
✅ **Shopping Cart** (Persistent across devices)
✅ **Online Ordering** (Full checkout flow)
✅ **Order Tracking** (Real-time status updates)
✅ **Coupon System** (Apply discount codes)
✅ **Favorites/Saved Items** (Per user)
✅ **Order History** (Past orders and receipts)

### Admin Features
✅ **Admin Dashboard** (Manage everything)
✅ **Menu Management** (Add/edit/delete items)
✅ **Order Management** (View, update order status)
✅ **Coupon Creation** (Create and manage discounts)
✅ **User Management** (View customer data)
✅ **Analytics** (Orders, revenue, popular items)

### Technical Features
✅ **Real-time Database** (Firebase Firestore)
✅ **Email Notifications** (SMTP via EmailJS/Brevo)
✅ **Image Storage** (Firebase Storage - free 5GB)
✅ **Search & Filtering** (Client-side + Firestore queries)
✅ **Mobile Responsive** (Works on all devices)
✅ **PWA Support** (Install as app)

---

## Free Services Breakdown

### 1. Firebase (Google) - FREE Tier
**Generous free tier that covers most restaurants:**

- **Authentication**: Unlimited users
- **Firestore Database**: 
  - 50,000 reads/day
  - 20,000 writes/day
  - 20,000 deletes/day
  - 1 GB storage
- **Storage**: 5 GB storage, 1 GB/day downloads
- **Hosting**: 10 GB storage, 360 MB/day transfer

**Perfect for:** Up to ~100-200 orders/day before hitting limits

### 2. EmailJS - FREE Tier
- **200 emails/month** free
- SMTP configuration
- Email templates
- Form to email

**Or Brevo (formerly SendInBlue):**
- **300 emails/day** free
- Better for higher volume

### 3. GitHub Pages - FREE
- Unlimited bandwidth
- Unlimited page builds
- Custom domain support
- HTTPS/SSL included

### 4. Stripe Payments
- **No monthly fee**
- **2.9% + $0.30 per transaction** only when you get paid
- Industry standard
- Full featured

### 5. Cloudinary (Optional - Images)
- **FREE Tier**: 25 GB storage, 25 GB bandwidth/month
- Image optimization
- CDN delivery

---

## Complete Tech Stack

```javascript
// Frontend
- React.js (or vanilla JS if you prefer)
- Tailwind CSS (your current styles work too)
- Firebase SDK

// Backend Services
- Firebase Authentication (login/signup)
- Firebase Firestore (database)
- Firebase Storage (images)
- Firebase Cloud Functions (FREE tier: 2M invocations/month)

// Email
- EmailJS or Brevo SMTP

// Payments
- Stripe Checkout (pay-as-you-go)

// Hosting
- GitHub Pages (static files)

// Total Monthly Cost: $0 💰
```

---

## Project Structure

```
gourmet-haus-full-stack/
├── public/
│   ├── index.html
│   ├── images/
│   └── manifest.json
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   ├── Login.js
│   │   │   ├── Signup.js
│   │   │   └── PasswordReset.js
│   │   ├── menu/
│   │   │   ├── MenuItem.js
│   │   │   └── MenuSection.js
│   │   ├── cart/
│   │   │   ├── Cart.js
│   │   │   └── Checkout.js
│   │   ├── user/
│   │   │   ├── Dashboard.js
│   │   │   ├── Profile.js
│   │   │   └── OrderHistory.js
│   │   └── admin/
│   │       ├── AdminDashboard.js
│   │       ├── MenuManager.js
│   │       ├── OrderManager.js
│   │       └── CouponManager.js
│   ├── services/
│   │   ├── firebase.js
│   │   ├── auth.js
│   │   ├── database.js
│   │   ├── email.js
│   │   └── payments.js
│   ├── styles/
│   │   └── styles.css (your current styles)
│   └── App.js
├── firebase.json
├── .firebaserc
├── package.json
└── README.md
```

---

## Implementation Guide

### Phase 1: Setup Firebase (10 minutes)

#### Step 1: Create Firebase Project
1. Go to https://firebase.google.com
2. Click "Get Started" (free, no credit card)
3. Create new project: "Gourmet Haus"
4. Enable Google Analytics (optional)

#### Step 2: Enable Services
```javascript
// In Firebase Console:

// 1. Authentication
- Click Authentication → Get Started
- Enable Email/Password
- Enable Google Sign-In (optional)

// 2. Firestore Database
- Click Firestore Database → Create Database
- Start in test mode (we'll secure it later)
- Choose location (closest to you)

// 3. Storage
- Click Storage → Get Started
- Start in test mode

// 4. Get Configuration
- Project Settings → Your apps
- Click Web icon
- Copy configuration
```

#### Step 3: Firebase Configuration
```javascript
// src/services/firebase.js
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "gourmet-haus.firebaseapp.com",
  projectId: "gourmet-haus",
  storageBucket: "gourmet-haus.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)
```

---

### Phase 2: User Authentication

#### Login/Signup Component
```javascript
// src/components/auth/Signup.js
import { auth } from '../../services/firebase'
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth'

export default function Signup() {
  const handleSignup = async (email, password, name) => {
    try {
      // Create user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user
      
      // Send verification email
      await sendEmailVerification(user)
      
      // Create user profile in Firestore
      await createUserProfile(user.uid, { name, email })
      
      alert('Signup successful! Check your email to verify.')
    } catch (error) {
      console.error('Signup error:', error)
    }
  }
  
  return (
    <form onSubmit={(e) => {
      e.preventDefault()
      handleSignup(email, password, name)
    }}>
      {/* Form fields */}
    </form>
  )
}
```

#### Login Component
```javascript
// src/components/auth/Login.js
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../../services/firebase'

export default function Login() {
  const handleLogin = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password)
      // Redirect to dashboard
    } catch (error) {
      console.error('Login error:', error)
    }
  }
  
  return <form>{/* Login form */}</form>
}
```

---

### Phase 3: Database Structure

#### Firestore Collections
```javascript
// Database structure

users/
  {userId}/
    - email: string
    - name: string
    - phone: string
    - addresses: array
    - createdAt: timestamp
    - role: 'customer' | 'admin'

menu/
  {itemId}/
    - name: string
    - description: string
    - price: number
    - category: string
    - image: string
    - available: boolean
    - badge: string
    - luxury: string

orders/
  {orderId}/
    - userId: string
    - items: array
    - total: number
    - status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered'
    - customerInfo: object
    - createdAt: timestamp
    - couponUsed: string (optional)

coupons/
  {couponCode}/
    - code: string
    - discount: number (percentage or fixed)
    - type: 'percentage' | 'fixed'
    - expiresAt: timestamp
    - usageLimit: number
    - usedCount: number
    - active: boolean

favorites/
  {userId}/
    - items: array of itemIds
```

#### Database Service
```javascript
// src/services/database.js
import { db } from './firebase'
import { collection, doc, getDoc, setDoc, updateDoc, deleteDoc, query, where, getDocs } from 'firebase/firestore'

export const database = {
  // Menu
  async getMenu() {
    const menuRef = collection(db, 'menu')
    const snapshot = await getDocs(menuRef)
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  },
  
  // Orders
  async createOrder(orderData) {
    const ordersRef = collection(db, 'orders')
    const newOrderRef = doc(ordersRef)
    await setDoc(newOrderRef, {
      ...orderData,
      createdAt: new Date(),
      status: 'pending'
    })
    return newOrderRef.id
  },
  
  async getUserOrders(userId) {
    const ordersRef = collection(db, 'orders')
    const q = query(ordersRef, where('userId', '==', userId))
    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  },
  
  // Coupons
  async validateCoupon(code) {
    const couponRef = doc(db, 'coupons', code)
    const couponSnap = await getDoc(couponRef)
    
    if (!couponSnap.exists()) return { valid: false, error: 'Invalid coupon' }
    
    const coupon = couponSnap.data()
    if (!coupon.active) return { valid: false, error: 'Coupon expired' }
    if (coupon.usedCount >= coupon.usageLimit) return { valid: false, error: 'Coupon limit reached' }
    
    return { valid: true, discount: coupon.discount, type: coupon.type }
  },
  
  // User Profile
  async getUserProfile(userId) {
    const userRef = doc(db, 'users', userId)
    const userSnap = await getDoc(userRef)
    return userSnap.exists() ? userSnap.data() : null
  }
}
```

---

### Phase 4: Email Service

#### Setup EmailJS
```javascript
// src/services/email.js
import emailjs from '@emailjs/browser'

emailjs.init('YOUR_PUBLIC_KEY') // Get from emailjs.com

export const sendOrderConfirmation = async (orderDetails) => {
  try {
    await emailjs.send(
      'YOUR_SERVICE_ID',
      'YOUR_TEMPLATE_ID',
      {
        to_email: orderDetails.customerEmail,
        customer_name: orderDetails.customerName,
        order_id: orderDetails.orderId,
        items: orderDetails.items.map(i => i.name).join(', '),
        total: orderDetails.total
      }
    )
  } catch (error) {
    console.error('Email error:', error)
  }
}
```

---

### Phase 5: User Dashboard

```javascript
// src/components/user/Dashboard.js
import { useEffect, useState } from 'react'
import { auth } from '../../services/firebase'
import { database } from '../../services/database'

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [orders, setOrders] = useState([])
  
  useEffect(() => {
    const currentUser = auth.currentUser
    if (currentUser) {
      loadUserData(currentUser.uid)
    }
  }, [])
  
  const loadUserData = async (userId) => {
    const profile = await database.getUserProfile(userId)
    const userOrders = await database.getUserOrders(userId)
    setUser(profile)
    setOrders(userOrders)
  }
  
  return (
    <div className="dashboard">
      <h1>Welcome, {user?.name}</h1>
      
      <section className="order-history">
        <h2>Your Orders</h2>
        {orders.map(order => (
          <div key={order.id} className="order-card">
            <p>Order #{order.id}</p>
            <p>Status: {order.status}</p>
            <p>Total: ${order.total}</p>
            <p>Date: {order.createdAt.toDate().toLocaleDateString()}</p>
          </div>
        ))}
      </section>
      
      <section className="favorites">
        <h2>Your Favorites</h2>
        {/* Favorite items */}
      </section>
    </div>
  )
}
```

---

### Phase 6: Admin Dashboard

```javascript
// src/components/admin/AdminDashboard.js
export default function AdminDashboard() {
  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      
      <div className="admin-sections">
        <MenuManager />
        <OrderManager />
        <CouponManager />
        <Analytics />
      </div>
    </div>
  )
}

// Menu Manager
function MenuManager() {
  const [items, setItems] = useState([])
  
  const addMenuItem = async (itemData) => {
    await setDoc(doc(db, 'menu', generateId()), itemData)
    // Refresh menu
  }
  
  return <div>{/* Menu management UI */}</div>
}
```

---

### Phase 7: Coupon System

```javascript
// src/components/cart/Checkout.js
export default function Checkout() {
  const [couponCode, setCouponCode] = useState('')
  const [discount, setDiscount] = useState(0)
  
  const applyCoupon = async () => {
    const result = await database.validateCoupon(couponCode)
    if (result.valid) {
      const discountAmount = result.type === 'percentage' 
        ? cartTotal * (result.discount / 100)
        : result.discount
      setDiscount(discountAmount)
    } else {
      alert(result.error)
    }
  }
  
  return (
    <div>
      <input 
        value={couponCode}
        onChange={(e) => setCouponCode(e.target.value)}
        placeholder="Coupon code"
      />
      <button onClick={applyCoupon}>Apply</button>
      
      <div>
        <p>Subtotal: ${cartTotal}</p>
        <p>Discount: -${discount}</p>
        <p>Total: ${cartTotal - discount}</p>
      </div>
    </div>
  )
}
```

---

## Deployment to GitHub Pages

### Build for Production
```bash
# Install dependencies
npm install

# Build static site
npm run build

# The build folder contains your static files
```

### Deploy to GitHub
```bash
# Initialize git
git init
git add .
git commit -m "Initial commit: Full-stack restaurant site"

# Create GitHub repo and push
gh repo create gourmet-haus-production --public --source=. --push

# Enable GitHub Pages
# Settings → Pages → Source: main branch → /build folder
```

### Alternative: Use Firebase Hosting (Also Free)
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize hosting
firebase init hosting

# Deploy
firebase deploy

# You get: gourmet-haus.web.app (free subdomain)
# Or connect custom domain: gourmetnhaus.com
```

---

## Monthly Cost Breakdown

```
GitHub Pages: $0
Firebase (Auth + Firestore + Storage): $0 (free tier)
EmailJS: $0 (200 emails/month free)
Stripe: $0 monthly (only 2.9% + $0.30 per transaction)
Domain: $1/month (you already have this)

TOTAL: $1/month 🎉
```

### When You Might Pay:
- **If you exceed Firebase free tier** (~200+ orders/day)
  - Firestore: ~$0.06 per 100,000 reads
  - Still very cheap
- **If you need more emails** 
  - EmailJS Pro: $15/month for unlimited
  - Brevo free tier: 300/day (likely enough)

---

## Migration Steps

1. **Setup Firebase** (10 min)
2. **Create React app** with your design (1-2 days)
3. **Implement authentication** (1 day)
4. **Build database structure** (1 day)
5. **Create user dashboard** (2 days)
6. **Build admin panel** (2 days)
7. **Add coupon system** (1 day)
8. **Integrate email** (1 day)
9. **Add Stripe payments** (1 day)
10. **Deploy to GitHub Pages** (1 hour)

**Total: 1-2 weeks of development**

---

## Security Rules (Firebase)

```javascript
// Firestore Security Rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read their own data
    match /users/{userId} {
      allow read: if request.auth.uid == userId;
      allow write: if request.auth.uid == userId;
    }
    
    // Anyone can read menu
    match /menu/{menuId} {
      allow read: if true;
      allow write: if request.auth.token.admin == true;
    }
    
    // Users can create orders and read their own
    match /orders/{orderId} {
      allow create: if request.auth != null;
      allow read: if request.auth.uid == resource.data.userId || 
                     request.auth.token.admin == true;
    }
    
    // Only admins can manage coupons
    match /coupons/{couponId} {
      allow read: if request.auth != null;
      allow write: if request.auth.token.admin == true;
    }
  }
}
```

---

## This Solution Gives You:

✅ **Real server functionality** (via Firebase)
✅ **GitHub repository** (code storage)
✅ **Free hosting** (GitHub Pages or Firebase Hosting)
✅ **User authentication** (login/signup)
✅ **User portals** (dashboard, orders, favorites)
✅ **Admin panel** (manage everything)
✅ **Coupons & discounts**
✅ **Email notifications** (SMTP)
✅ **Payment processing** (Stripe)
✅ **Real database** (Firestore)
✅ **Image storage** (Firebase Storage)
✅ **$0-1/month cost** 💰

---

**Ready to build this?** I can start implementing the Firebase setup and converting your current site to this full-stack architecture right now!
