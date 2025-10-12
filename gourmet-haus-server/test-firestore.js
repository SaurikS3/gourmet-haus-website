const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');
require('dotenv').config();

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

console.log('Firebase Config:', {
  projectId: firebaseConfig.projectId,
  authDomain: firebaseConfig.authDomain
});

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function testFirestore() {
  try {
    console.log('\n=== TESTING FIRESTORE CONNECTION ===\n');
    
    // Test menuItems collection
    console.log('Fetching menuItems collection...');
    const menuItemsSnapshot = await getDocs(collection(db, 'menuItems'));
    console.log(`Found ${menuItemsSnapshot.size} menu items`);
    
    if (menuItemsSnapshot.size > 0) {
      console.log('\nFirst 3 menu items:');
      let count = 0;
      menuItemsSnapshot.forEach((doc) => {
        if (count < 3) {
          const data = doc.data();
          console.log(`\n${count + 1}. ${data.name}`);
          console.log(`   Category: ${data.category}`);
          console.log(`   Active: ${data.isActive}`);
          console.log(`   Description: ${data.description?.substring(0, 50)}...`);
          count++;
        }
      });
    } else {
      console.log('\n⚠️  WARNING: No menu items found in database!');
    }
    
    // Test categories collection
    console.log('\n\nFetching categories collection...');
    const categoriesSnapshot = await getDocs(collection(db, 'categories'));
    console.log(`Found ${categoriesSnapshot.size} categories`);
    
    if (categoriesSnapshot.size > 0) {
      console.log('\nCategories:');
      categoriesSnapshot.forEach((doc) => {
        const data = doc.data();
        console.log(`- ${data.name}`);
      });
    } else {
      console.log('\n⚠️  WARNING: No categories found in database!');
    }
    
    console.log('\n=== TEST COMPLETE ===\n');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
}

testFirestore();
