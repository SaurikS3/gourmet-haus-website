const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, updateDoc, doc, query, where } = require('firebase/firestore');
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

async function fixSidesCategory() {
  console.log('Updating SIDES category to appear after LOADED FRIES...');
  
  const q = query(collection(db, 'menuItems'), where('category', '==', 'sides'));
  const snapshot = await getDocs(q);
  
  let updatedCount = 0;
  for (const docSnap of snapshot.docs) {
    await updateDoc(doc(db, 'menuItems', docSnap.id), {
      categoryNumber: '04.5'
    });
    updatedCount++;
  }
  
  console.log(`Updated ${updatedCount} items in SIDES category to categoryNumber 04.5`);
  console.log('\nNew order will be:');
  console.log('  01: BURGERS');
  console.log('  02: WRAPS');
  console.log('  03: RICE');
  console.log('  04: FRIES (LOADED FRIES)');
  console.log('  04.5: SIDES');
  console.log('  05: DESSERTS');
}

fixSidesCategory().then(() => process.exit(0)).catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
