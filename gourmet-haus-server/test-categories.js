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

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function testCategories() {
  try {
    console.log('\n=== CATEGORY ANALYSIS ===\n');
    
    const menuItemsSnapshot = await getDocs(collection(db, 'menuItems'));
    
    const categoryMap = {};
    
    menuItemsSnapshot.forEach((doc) => {
      const data = doc.data();
      const cat = data.category;
      if (!categoryMap[cat]) {
        categoryMap[cat] = [];
      }
      categoryMap[cat].push({
        name: data.name,
        isActive: data.isActive
      });
    });
    
    console.log('All unique categories found in menuItems:');
    Object.keys(categoryMap).forEach(cat => {
      const items = categoryMap[cat];
      const activeCount = items.filter(i => i.isActive).length;
      console.log(`\n"${cat}"`);
      console.log(`  Total items: ${items.length}`);
      console.log(`  Active items: ${activeCount}`);
      console.log(`  Sample items: ${items.slice(0, 2).map(i => i.name).join(', ')}`);
    });
    
    console.log('\n=== END ===\n');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    process.exit(1);
  }
}

testCategories();
