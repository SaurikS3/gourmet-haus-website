import React, { useState, useEffect, useRef } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase/config';
import { 
  addMenuItem, 
  updateMenuItem, 
  deleteMenuItem, 
  toggleMenuItemStatus,
  addCategory,
  deleteCategory
} from '../services/adminService';
import { migrateMenuData } from '../utils/migrateMenuData';
import '../styles/menuManager.css';

function MenuManager() {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isEditing, setIsEditing] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [isMigrating, setIsMigrating] = useState(false);
  const formRef = useRef(null);
  const [draggedItem, setDraggedItem] = useState(null);
  const [formData, setFormData] = useState({
    category: '',
    name: '',
    badge: '',
    ornament: '',
    luxuryType: '',
    description: '',
    isActive: true,
    displayOrder: 0
  });

  const luxuryTypes = ['premium', 'exclusive', 'select', 'artisan', 'royal', 'standard'];
  const badgeOptions = [
    { value: '', label: 'None', description: 'No badge displayed' },
    { value: 'SIGNATURE', label: 'SIGNATURE', description: 'House specialty item' },
    { value: 'CHEF\'S CHOICE', label: 'CHEF\'S CHOICE', description: 'Recommended by chef' },
    { value: 'NEW', label: 'NEW', description: 'Newly added item' },
    { value: 'POPULAR', label: 'POPULAR', description: 'Customer favorite' },
    { value: 'SPICY', label: 'SPICY', description: 'Contains spicy ingredients' },
    { value: 'VEGETARIAN', label: 'VEGETARIAN', description: 'Suitable for vegetarians' },
    { value: 'VEGAN', label: 'VEGAN', description: 'Suitable for vegans' },
    { value: 'GLUTEN-FREE', label: 'GLUTEN-FREE', description: 'Contains no gluten' },
    { value: 'LIMITED', label: 'LIMITED', description: 'Available for limited time' }
  ];
  const ornamentOptions = [
    { value: '', label: 'None', description: 'No ornament displayed' },
    { value: '◆', label: '◆ (Diamond)', description: 'Elegant diamond symbol' },
    { value: '★', label: '★ (Star)', description: 'Star symbol for highlights' },
    { value: '♦', label: '♦ (Suit)', description: 'Card suit diamond' },
    { value: '◇', label: '◇ (Outline)', description: 'Outline diamond' },
    { value: '●', label: '● (Circle)', description: 'Filled circle' },
    { value: '○', label: '○ (Ring)', description: 'Empty circle' },
    { value: '■', label: '■ (Square)', description: 'Filled square' },
    { value: '□', label: '□ (Box)', description: 'Empty square' }
  ];
  const [savedCategories, setSavedCategories] = useState([]);

  // Get unique categories from BOTH saved categories collection AND menu items
  const categories = [...new Set([
    ...savedCategories,
    ...menuItems.map(item => item.category)
  ])].filter(Boolean).sort();

  // Real-time sync with Firestore for menu items
  useEffect(() => {
    const menuQuery = query(
      collection(db, 'menuItems'),
      orderBy('displayOrder', 'asc')
    );

    const unsubscribe = onSnapshot(menuQuery, (snapshot) => {
      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMenuItems(items);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching menu items:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Real-time sync with Firestore for categories
  useEffect(() => {
    const categoriesQuery = query(
      collection(db, 'categories'),
      orderBy('displayOrder', 'asc')
    );

    const unsubscribe = onSnapshot(categoriesQuery, (snapshot) => {
      const cats = snapshot.docs.map(doc => doc.data().name);
      setSavedCategories(cats);
    }, (error) => {
      console.error('Error fetching categories:', error);
    });

    return () => unsubscribe();
  }, []);


  const resetForm = () => {
    setFormData({
      category: '',
      name: '',
      badge: '',
      ornament: '',
      luxuryType: '',
      description: '',
      isActive: true,
      displayOrder: 0
    });
    setCurrentItem(null);
    setIsEditing(false);
    setShowForm(false);
  };

  const handleEdit = (item) => {
    setCurrentItem(item);
    setFormData({
      category: item.category || '',
      name: item.name || '',
      badge: item.badge || '',
      ornament: item.ornament || '',
      luxuryType: item.luxuryType || '',
      description: item.description || '',
      isActive: item.isActive !== undefined ? item.isActive : true,
      displayOrder: item.displayOrder || 0
    });
    setIsEditing(true);
    setShowForm(true);
    
    // Scroll form into view
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleAdd = () => {
    resetForm();
    setShowForm(true);
    
    // Scroll form into view
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.category || !formData.name || !formData.description) {
      alert('Please fill in all required fields (Category, Name, Description)');
      return;
    }

    try {
      let itemData;
      
      if (isEditing && currentItem) {
        // When editing, keep the existing displayOrder
        itemData = {
          ...formData,
          displayOrder: parseInt(formData.displayOrder)
        };
        await updateMenuItem(currentItem.id, itemData);
        alert('Menu item updated successfully!');
      } else {
        // When adding new, find the max displayOrder and add 1
        const maxOrder = menuItems.length > 0 
          ? Math.max(...menuItems.map(item => item.displayOrder || 0))
          : -1;
        itemData = {
          ...formData,
          displayOrder: maxOrder + 1
        };
        await addMenuItem(itemData);
        alert('Menu item added successfully!');
      }
      
      resetForm();
    } catch (error) {
      console.error('Error saving menu item:', error);
      alert('Failed to save menu item: ' + error.message);
    }
  };

  const handleDelete = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this menu item?')) {
      return;
    }

    try {
      await deleteMenuItem(itemId);
      alert('Menu item deleted successfully!');
    } catch (error) {
      console.error('Error deleting menu item:', error);
      alert('Failed to delete menu item: ' + error.message);
    }
  };

  const handleToggleStatus = async (itemId, currentStatus) => {
    try {
      await toggleMenuItemStatus(itemId, !currentStatus);
    } catch (error) {
      console.error('Error toggling item status:', error);
      alert('Failed to toggle item status: ' + error.message);
    }
  };

  const handleMigration = async () => {
    if (!window.confirm(
      '⚠️ MIGRATE MENU DATA\n\n' +
      'This will populate Firestore with all menu items and categories.\n\n' +
      'Only run this once if the database is empty.\n\n' +
      'Continue?'
    )) {
      return;
    }

    setIsMigrating(true);
    try {
      const result = await migrateMenuData();
      if (result.success) {
        alert('✅ Migration completed successfully!\n\nAll menu items and categories have been added to Firestore.\n\nRefresh the page to see them.');
      } else {
        alert('❌ Migration failed: ' + result.error);
      }
    } catch (error) {
      console.error('Migration error:', error);
      alert('❌ Migration failed: ' + error.message);
    } finally {
      setIsMigrating(false);
    }
  };

  const handleAddNewCategory = async () => {
    if (newCategory.trim()) {
      const trimmedCategory = newCategory.trim();
      // Check if category already exists (case-insensitive)
      const categoryExists = categories.some(
        cat => cat.toLowerCase() === trimmedCategory.toLowerCase()
      );
      
      if (categoryExists) {
        alert('This category already exists. Please choose a different name.');
        return;
      }
      
      try {
        // Immediately save the category to Firestore
        await addCategory(trimmedCategory);
        setFormData({...formData, category: trimmedCategory});
        setNewCategory('');
        setShowNewCategoryInput(false);
        alert(`Category "${trimmedCategory}" created successfully!`);
      } catch (error) {
        console.error('Error creating category:', error);
        alert('Failed to create category: ' + error.message);
      }
    }
  };

  // Drag and drop handlers
  const handleDragStart = (e, item) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = 'move';
    e.currentTarget.style.opacity = '0.4';
  };

  const handleDragEnd = (e) => {
    e.currentTarget.style.opacity = '1';
    setDraggedItem(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e, targetItem) => {
    e.preventDefault();
    
    if (!draggedItem || draggedItem.id === targetItem.id) {
      return;
    }

    try {
      const draggedIndex = filteredItems.findIndex(item => item.id === draggedItem.id);
      const targetIndex = filteredItems.findIndex(item => item.id === targetItem.id);
      
      // Create new array with reordered items
      const newItems = [...filteredItems];
      newItems.splice(draggedIndex, 1);
      newItems.splice(targetIndex, 0, draggedItem);
      
      // Update displayOrder for all affected items
      const updates = newItems.map((item, index) => 
        updateMenuItem(item.id, { ...item, displayOrder: index })
      );
      
      await Promise.all(updates);
      
    } catch (error) {
      console.error('Error reordering items:', error);
      alert('Failed to reorder items: ' + error.message);
    }
  };

  const filteredItems = selectedCategory === 'All' 
    ? menuItems 
    : menuItems.filter(item => item.category.toLowerCase() === selectedCategory.toLowerCase());

  // Create sequential numbering map for all items
  const itemSequentialNumbers = {};
  let counter = 1;
  menuItems.forEach(item => {
    itemSequentialNumbers[item.id] = counter++;
  });

  if (loading) {
    return <div className="menu-manager-loading">Loading menu items...</div>;
  }

  return (
    <div className="menu-manager">
      <div className="menu-manager-header">
        <h2>Menu Manager</h2>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {menuItems.length === 0 && (
            <button 
              onClick={handleMigration} 
              disabled={isMigrating}
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                fontSize: '0.95rem',
                fontWeight: '600',
                cursor: isMigrating ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s',
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                opacity: isMigrating ? 0.6 : 1
              }}
              onMouseOver={(e) => {
                if (!isMigrating) {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.5)';
                }
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
              }}
            >
              {isMigrating ? '⏳ Migrating...' : '🚀 MIGRATE MENU DATA'}
            </button>
          )}
          <button onClick={handleAdd} className="btn-add">+ Add New Item</button>
        </div>
      </div>

      {showForm && (
        <div className="menu-form-overlay">
          <div className="menu-form" ref={formRef}>
            <div className="menu-form-header">
              <h3>{isEditing ? 'Edit Menu Item' : 'Add New Menu Item'}</h3>
              <button onClick={resetForm} className="btn-close">×</button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Category *</label>
                {showNewCategoryInput ? (
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <input 
                      type="text"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      placeholder="Enter new category name"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddNewCategory();
                        }
                      }}
                      autoFocus
                      style={{ flex: 1 }}
                    />
                    <button 
                      type="button"
                      onClick={handleAddNewCategory}
                      className="btn-add-small"
                      title="Confirm new category"
                    >
                      ✓
                    </button>
                    <button 
                      type="button"
                      onClick={() => {
                        setShowNewCategoryInput(false);
                        setNewCategory('');
                      }}
                      className="btn-cancel-small"
                      title="Cancel"
                    >
                      ✗
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <select 
                      value={formData.category} 
                      onChange={(e) => {
                        if (e.target.value === '__new__') {
                          setShowNewCategoryInput(true);
                          setNewCategory('');
                        } else {
                          setFormData({...formData, category: e.target.value});
                        }
                      }}
                      required
                      style={{ flex: 1 }}
                    >
                      <option value="">Select Category</option>
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                      <option value="__new__">+ Add New Category</option>
                    </select>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>Name *</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g., Lamb Royale"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Badge</label>
                  <select 
                    value={formData.badge}
                    onChange={(e) => setFormData({...formData, badge: e.target.value})}
                  >
                    {badgeOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {formData.badge && (
                    <div style={{ 
                      fontSize: '0.8rem', 
                      color: '#999', 
                      marginTop: '0.5rem',
                      fontStyle: 'italic'
                    }}>
                      ℹ️ {badgeOptions.find(o => o.value === formData.badge)?.description}
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label>Ornament</label>
                  <select 
                    value={formData.ornament}
                    onChange={(e) => setFormData({...formData, ornament: e.target.value})}
                  >
                    {ornamentOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {formData.ornament && (
                    <div style={{ 
                      fontSize: '0.8rem', 
                      color: '#999', 
                      marginTop: '0.5rem',
                      fontStyle: 'italic'
                    }}>
                      ℹ️ {ornamentOptions.find(o => o.value === formData.ornament)?.description}
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label>Luxury Type</label>
                  <select 
                    value={formData.luxuryType}
                    onChange={(e) => setFormData({...formData, luxuryType: e.target.value})}
                  >
                    <option value="">Select Type</option>
                    {luxuryTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Description *</label>
                <textarea 
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Enter item description"
                  rows="4"
                  required
                />
              </div>

              <div className="form-group checkbox-group">
                <label>
                  <input 
                    type="checkbox" 
                    checked={formData.isActive}
                    onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                  />
                  Active (visible on menu)
                </label>
              </div>

              <div style={{ 
                background: 'rgba(103, 58, 183, 0.1)', 
                padding: '12px', 
                borderRadius: '8px',
                fontSize: '0.9rem',
                color: '#666',
                marginTop: '12px'
              }}>
                💡 <strong>Tip:</strong> Use drag & drop in the table below to reorder items
              </div>

              <div className="form-actions">
                <button type="button" onClick={resetForm} className="btn-cancel">Cancel</button>
                {isEditing && currentItem && (
                  <button 
                    type="button" 
                    onClick={() => handleDelete(currentItem.id)} 
                    className="btn-delete"
                    style={{ marginLeft: 'auto', marginRight: '8px' }}
                  >
                    Delete
                  </button>
                )}
                <button type="submit" className="btn-save">
                  {isEditing ? 'Update Item' : 'Add Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="menu-filters">
        <button 
          className={selectedCategory === 'All' ? 'active' : ''}
          onClick={() => setSelectedCategory('All')}
        >
          All ({menuItems.length})
        </button>
        {categories.map(cat => {
          const count = menuItems.filter(item => item.category.toLowerCase() === cat.toLowerCase()).length;
          return (
            <div key={cat} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <button 
                className={selectedCategory === cat ? 'active' : ''}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat} ({count})
              </button>
              {count === 0 && (
                <button 
                  onClick={async () => {
                    if (window.confirm(`Delete category "${cat}"? This action cannot be undone.`)) {
                      try {
                        await deleteCategory(cat);
                        if (selectedCategory === cat) {
                          setSelectedCategory('All');
                        }
                        alert(`Category "${cat}" deleted successfully!`);
                      } catch (error) {
                        console.error('Error deleting category:', error);
                        alert('Failed to delete category: ' + error.message);
                      }
                    }
                  }}
                  style={{
                    background: 'rgba(244, 67, 54, 0.2)',
                    border: '1px solid rgba(244, 67, 54, 0.4)',
                    color: '#EF5350',
                    padding: '0.5rem 0.75rem',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.background = 'rgba(244, 67, 54, 0.3)';
                    e.target.style.transform = 'scale(1.05)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.background = 'rgba(244, 67, 54, 0.2)';
                    e.target.style.transform = 'scale(1)';
                  }}
                  title="Delete empty category"
                >
                  ×
                </button>
              )}
            </div>
          );
        })}
      </div>

      <div className="menu-items-list">
        {filteredItems.length === 0 ? (
          <div className="no-items">
            <p>No menu items found in this category.</p>
          </div>
        ) : (
          <table className="menu-table">
            <thead>
              <tr>
                <th style={{ width: '40px' }}>⋮⋮</th>
                <th>Status</th>
                <th>Order</th>
                <th>Category</th>
                <th>Name</th>
                <th>Badge</th>
                <th>Luxury Type</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map(item => (
                <tr 
                  key={item.id} 
                  className={!item.isActive ? 'inactive' : ''}
                  draggable="true"
                  onDragStart={(e) => handleDragStart(e, item)}
                  onDragEnd={handleDragEnd}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, item)}
                  onClick={(e) => {
                    // On mobile, clicking the row opens edit form (except when clicking buttons)
                    if (window.innerWidth <= 768 && !e.target.closest('button')) {
                      handleEdit(item);
                    }
                  }}
                  style={{ cursor: window.innerWidth <= 768 ? 'pointer' : 'move' }}
                >
                  <td data-label="Drag" style={{ textAlign: 'center', fontSize: '1.2rem', color: '#999', cursor: 'grab' }}>
                    ⋮⋮
                  </td>
                  <td data-label="Status">
                    <button 
                      className={`status-toggle ${item.isActive ? 'active' : 'inactive'}`}
                      onClick={() => handleToggleStatus(item.id, item.isActive)}
                      title={item.isActive ? 'Click to hide' : 'Click to show'}
                    >
                      {item.isActive ? '✓' : '✗'}
                    </button>
                  </td>
                  <td data-label="Order">{itemSequentialNumbers[item.id]}</td>
                  <td data-label="Category">{item.category}</td>
                  <td data-label="Name"><strong><span className="item-number">{itemSequentialNumbers[item.id]}.</span> {item.name}</strong></td>
                  <td data-label="Badge">{item.badge || '-'}</td>
                  <td data-label="Luxury Type">{item.luxuryType || '-'}</td>
                  <td data-label="Description" className="description-cell" title={item.description}>
                    {item.description}
                  </td>
                  <td data-label="Actions" className="actions-cell">
                    <button onClick={() => handleEdit(item)} className="btn-edit">Edit</button>
                    <button onClick={() => handleDelete(item.id)} className="btn-delete">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default MenuManager;
