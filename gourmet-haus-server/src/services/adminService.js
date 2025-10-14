import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase/config';

/**
 * Check if a user email is an admin
 * Checks database admins only (migration from hardcoded list is complete)
 */
export const isAdmin = async (email) => {
  if (!email) return false;
  
  const emailLower = email.toLowerCase();
  
  // Check database admins
  try {
    const adminsSnapshot = await getDocs(
      query(collection(db, 'admins'), where('email', '==', emailLower), where('isActive', '==', true))
    );
    return !adminsSnapshot.empty;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};

/**
 * Get all menu items
 */
export const getAllMenuItems = async () => {
  try {
    const querySnapshot = await getDocs(
      query(collection(db, 'menuItems'), orderBy('displayOrder', 'asc'))
    );
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching menu items:', error);
    throw error;
  }
};

/**
 * Get menu items by category
 */
export const getMenuItemsByCategory = async (category) => {
  try {
    const q = query(
      collection(db, 'menuItems'),
      where('category', '==', category),
      orderBy('displayOrder', 'asc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching menu items by category:', error);
    throw error;
  }
};

/**
 * Get a single menu item by ID
 */
export const getMenuItem = async (itemId) => {
  try {
    const docRef = doc(db, 'menuItems', itemId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.error('Error fetching menu item:', error);
    throw error;
  }
};

/**
 * Add a new menu item
 */
export const addMenuItem = async (itemData) => {
  try {
    const docRef = await addDoc(collection(db, 'menuItems'), {
      ...itemData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding menu item:', error);
    throw error;
  }
};

/**
 * Update an existing menu item
 */
export const updateMenuItem = async (itemId, itemData) => {
  try {
    const docRef = doc(db, 'menuItems', itemId);
    await updateDoc(docRef, {
      ...itemData,
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error('Error updating menu item:', error);
    throw error;
  }
};

/**
 * Delete a menu item
 */
export const deleteMenuItem = async (itemId) => {
  try {
    await deleteDoc(doc(db, 'menuItems', itemId));
    return true;
  } catch (error) {
    console.error('Error deleting menu item:', error);
    throw error;
  }
};

/**
 * Toggle menu item active status
 */
export const toggleMenuItemStatus = async (itemId, isActive) => {
  try {
    const docRef = doc(db, 'menuItems', itemId);
    await updateDoc(docRef, {
      isActive,
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error('Error toggling menu item status:', error);
    throw error;
  }
};

/**
 * Get all categories
 */
export const getAllCategories = async () => {
  try {
    const querySnapshot = await getDocs(
      query(collection(db, 'categories'), orderBy('displayOrder', 'asc'))
    );
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

/**
 * Add a new category
 */
export const addCategory = async (categoryName) => {
  try {
    const docRef = await addDoc(collection(db, 'categories'), {
      name: categoryName,
      displayOrder: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding category:', error);
    throw error;
  }
};

export const deleteCategory = async (categoryName) => {
  try {
    // Find and delete the category document
    const categoriesRef = collection(db, 'categories');
    const q = query(categoriesRef, where('name', '==', categoryName));
    const querySnapshot = await getDocs(q);
    
    const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
    
    return true;
  } catch (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
};

/**
 * Reorder menu items
 */
export const reorderMenuItems = async (items) => {
  try {
    const promises = items.map((item, index) => 
      updateDoc(doc(db, 'menuItems', item.id), {
        displayOrder: index + 1,
        updatedAt: serverTimestamp()
      })
    );
    await Promise.all(promises);
    return true;
  } catch (error) {
    console.error('Error reordering menu items:', error);
    throw error;
  }
};
