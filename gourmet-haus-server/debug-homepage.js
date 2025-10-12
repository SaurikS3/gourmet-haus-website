const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, query, orderBy } = require('firebase/firestore');
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

async function debugHomePage() {
  try {
    console.log('\n=== SIMULATING HOMEPAGE DATA FETCH ===\n');
    
    // Exactly what HomePage does
    const menuQuery = query(
      collection(db, 'menuItems'),
      orderBy('displayOrder', 'asc')
    );
    
    const snapshot = await getDocs(menuQuery);
    const items = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    console.log('✓ Firestore items received:', items.length);
    
    // Filter for active items (exactly what HomePage does)
    const activeItems = items.filter(item => item.isActive);
    console.log('✓ Active items to display:', activeItems.length);
    
    // Group by category (exactly what HomePage does)
    const groupedItems = activeItems.reduce((acc, item) => {
      const category = item.category;
      
      if (!acc[category]) {
        acc[category] = {
          items: [],
          categoryNumber: item.categoryNumber
        };
      }
      acc[category].items.push(item);
      return acc;
    }, {});
    
    console.log('\n✓ Grouped items by category:');
    Object.keys(groupedItems).forEach(cat => {
      console.log(`  - ${cat}: ${groupedItems[cat].items.length} items`);
    });
    
    console.log('\n✓ Object.keys(groupedItems).length:', Object.keys(groupedItems).length);
    
    if (Object.keys(groupedItems).length === 0) {
      console.log('\n❌ PROBLEM: groupedItems is EMPTY - this is why nothing shows!');
    } else {
      console.log('\n✅ SUCCESS: groupedItems has data - items SHOULD display');
      console.log('\n📋 Sample items from first category:');
      const firstCat = Object.keys(groupedItems)[0];
      const firstItems = groupedItems[firstCat].items.slice(0, 2);
      firstItems.forEach(item => {
        console.log(`   • ${item.name} (${item.category})`);
      });
    }
    
    console.log('\n=== END DEBUG ===\n');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

debugHomePage();
