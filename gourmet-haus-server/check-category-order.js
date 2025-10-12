const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, query, orderBy } = require('firebase/firestore');
require('dotenv').config();

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function checkCategories() {
  const q = query(collection(db, 'menuItems'), orderBy('categoryNumber', 'asc'));
  const snapshot = await getDocs(q);
  
  const categories = new Map();
  snapshot.docs.forEach(doc => {
    const data = doc.data();
    if (!categories.has(data.category)) {
      categories.set(data.category, data.categoryNumber);
    }
  });
  
  console.log('Current category order:');
  Array.from(categories.entries())
    .sort((a, b) => a[1] - b[1])
    .forEach(([cat, num]) => {
      console.log(`  ${num}: ${cat}`);
    });
}

checkCategories().then(() => process.exit(0)).catch(err => {
  console.error(err);
  process.exit(1);
});
