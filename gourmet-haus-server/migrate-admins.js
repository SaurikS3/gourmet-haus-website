// Script to migrate hardcoded admins to Firestore database
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, getDocs, query, where } = require('firebase/firestore');

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDCEWSy_jZN8xwh8cwnhDjHVEfhYAxP5vU",
  authDomain: "gourmet-haus-edc33.firebaseapp.com",
  projectId: "gourmet-haus-edc33",
  storageBucket: "gourmet-haus-edc33.firebasestorage.app",
  messagingSenderId: "447159754338",
  appId: "1:447159754338:web:cd6cb03d6e93c1a4d28f48",
  measurementId: "G-8XRH3NLYMK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Hardcoded admin emails to migrate
const ADMIN_EMAILS = [
  'artkabul@gmail.com',
  'haidarizia@gmail.com',
  'gourmethausva@gmail.com'
];

async function migrateAdmins() {
  console.log('🚀 Starting admin migration...\n');
  
  for (const email of ADMIN_EMAILS) {
    try {
      // Check if admin already exists
      const adminsQuery = query(
        collection(db, 'admins'),
        where('email', '==', email)
      );
      const existingAdmins = await getDocs(adminsQuery);
      
      if (!existingAdmins.empty) {
        console.log(`✓ Admin ${email} already exists in database`);
        continue;
      }
      
      // Add admin to database
      await addDoc(collection(db, 'admins'), {
        email: email,
        addedBy: 'system',
        addedAt: new Date().toISOString(),
        isActive: true,
        isCoreAdmin: true // Mark as core admin (cannot be removed)
      });
      
      console.log(`✅ Added ${email} to admins database`);
    } catch (error) {
      console.error(`❌ Error adding ${email}:`, error);
    }
  }
  
  console.log('\n✨ Admin migration complete!');
  process.exit(0);
}

migrateAdmins();
