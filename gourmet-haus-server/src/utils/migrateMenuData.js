import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';

// Current menu data extracted from HomePage.js
const MENU_DATA = {
  categories: [
    { id: 'burgers', name: 'BURGERS', subtitle: 'Handcrafted Perfection', categoryNumber: '01', displayOrder: 1 },
    { id: 'wraps', name: 'WRAPS', subtitle: 'Artful Compositions', categoryNumber: '02', displayOrder: 2 },
    { id: 'rice', name: 'RICE DISHES', subtitle: 'Aromatic Treasures', categoryNumber: '03', displayOrder: 3 },
    { id: 'fries', name: 'LOADED FRIES', subtitle: 'Indulgent Creations', categoryNumber: '04', displayOrder: 4 },
    { id: 'sides', name: 'SIDES', subtitle: 'Perfect Pairings', categoryNumber: '', displayOrder: 5 },
    { id: 'desserts', name: 'DESSERTS', subtitle: 'Divine Finales', categoryNumber: '05', displayOrder: 6 }
  ],
  
  menuItems: [
    // BURGERS
    {
      category: 'burgers',
      categoryNumber: '01',
      itemNumber: 1,
      name: 'Lamb Royale',
      badge: 'SIGNATURE',
      ornament: '◆',
      luxuryType: 'premium',
      description: 'Discover Lamb Royale: a bold fusion of soft spiced lamb minced and crunchy onion bhaji, layered with crisp greens and a cool drizzle of mint yoghurt, mango, and tangy tamarind all tucked into a pillowy brioche bun.',
      isActive: true,
      displayOrder: 1
    },
    {
      category: 'burgers',
      categoryNumber: '01',
      itemNumber: 2,
      name: 'Grilled Haus Burger',
      badge: "CHEF'S CHOICE",
      ornament: '◆',
      luxuryType: 'exclusive',
      description: 'Indulge juicy grilled chicken thighs meeting melted cheese and crisp, fresh salad in a buttery brioche bun. Finished with our signature Haus sauce.',
      isActive: true,
      displayOrder: 2
    },
    {
      category: 'burgers',
      categoryNumber: '01',
      itemNumber: 3,
      name: 'Leaf & Cheese',
      badge: 'GARDEN',
      ornament: '◇',
      luxuryType: 'select',
      description: 'Crunch into Golden, crispy paneer meets fresh, vibrant spinach in a buttery brioche bun, layered with melted cheese for gooey goodness.',
      isActive: true,
      displayOrder: 3
    },
    {
      category: 'burgers',
      categoryNumber: '01',
      itemNumber: 4,
      name: 'Haus Bites',
      badge: 'ARTISAN',
      ornament: '●',
      luxuryType: 'artisan',
      description: 'Grab hand-coated nuggets fried to a crisp golden hue, kissed with a tangy tamarind-mango glaze, and served piping hot.',
      isActive: true,
      displayOrder: 4
    },
    
    // WRAPS
    {
      category: 'wraps',
      categoryNumber: '02',
      itemNumber: 5,
      name: 'The Haus Wrap',
      badge: 'SIGNATURE',
      ornament: '◆',
      luxuryType: 'premium',
      description: 'Unwrap a flavor roll-up that means business. Juicy grilled chicken joins crisp greens, all tucked in warm, soft flatbread and finished with our signature Haus sauce. Each wrap bursts with smoky, zesty, and fresh goodness—simple, satisfying, and seriously tasty.',
      isActive: true,
      displayOrder: 5
    },
    {
      category: 'wraps',
      categoryNumber: '02',
      itemNumber: 6,
      name: 'Leaf & Cheese',
      badge: 'GARDEN',
      ornament: '◇',
      luxuryType: 'select',
      description: 'Dive into fresh vibes and bold flavors. Golden, crispy paneer and vibrant spinach come together in a soft flatbread, dressed with tangy sauce for that perfect kick. It\'s a crispy-creamy wrap with attitude—light, lively, and seriously addictive.',
      isActive: true,
      displayOrder: 6
    },
    {
      category: 'wraps',
      categoryNumber: '02',
      itemNumber: 7,
      name: 'Haus Bites',
      badge: 'FUSION',
      ornament: '●',
      luxuryType: 'artisan',
      description: 'Sink into a wrap that brings the crunch. Our golden, hand-coated Haus Bites meet crisp greens and a lacing of tangy tamarind-mango sauce, all rolled in soft flatbread. Every wrap hits that sweet, spicy, and savory groove—bold, messy, and downright craveable.',
      isActive: true,
      displayOrder: 7
    },
    
    // RICE DISHES
    {
      category: 'rice',
      categoryNumber: '03',
      itemNumber: 8,
      name: 'Qabli Palaw',
      badge: 'ROYAL HERITAGE',
      ornament: '♛',
      luxuryType: 'royal',
      description: 'Journey into the heart of Afghan flavor. Fluffy, long-grain rice layered with succulent lamb, caramelized carrots, and plump raisins—each grain infused with delicate spices and slow-cooked richness. It\'s a soulful classic where sweet meets savory in perfect harmony, comfort served the Afghan way.',
      isActive: true,
      displayOrder: 8
    },
    {
      category: 'rice',
      categoryNumber: '03',
      itemNumber: 9,
      name: 'Gourmet Chicken',
      badge: "CHEF'S SPECIAL",
      ornament: '◆',
      luxuryType: 'premium',
      description: 'Experience tender, juicy chicken layered over aromatic, perfectly cooked rice, infused with a symphony of spices and fresh herbs. Every mouthful delivers a savory, tangy, and satisfying journey—comforting yet vibrant, familiar yet unforgettable.',
      isActive: true,
      displayOrder: 9
    },
    
    // LOADED FRIES
    {
      category: 'fries',
      categoryNumber: '04',
      itemNumber: 10,
      name: 'Grilled Chicken',
      badge: 'INDULGENCE',
      ornament: '◆',
      luxuryType: 'premium',
      description: 'Stacked with golden, crispy fries and smoky, juicy grilled chicken, finished with a punchy splash of zesty sauce. Every forkful bursts with bold, savory, and lively flavors—hearty, satisfying, and impossible to resist.',
      isActive: true,
      displayOrder: 10
    },
    {
      category: 'fries',
      categoryNumber: '04',
      itemNumber: 11,
      name: 'Haus Bites',
      badge: 'SYMPHONY',
      ornament: '●',
      luxuryType: 'artisan',
      description: 'Craving something epic? Dive into golden, crispy fries piled high with smoky, crispy Haus Bites, tossed with crisp greens and finished with a zesty tamarind-mango kick. Every forkful hits sweet, spicy, and savory notes in perfect harmony—messy, bold, and guaranteed to satisfy even the fiercest hunger.',
      isActive: true,
      displayOrder: 11
    },
    {
      category: 'fries',
      categoryNumber: '04',
      itemNumber: 12,
      name: 'Lamb',
      badge: 'MAJESTY',
      ornament: '♛',
      luxuryType: 'royal',
      description: 'Go all in on golden fries piled with spiced minced lamb and crisp greens, topped with a silky yogurt ribbon and our zesty green secret sauce. Every forkful bursts with bold, tangy, and herb-forward flavors—hearty, playful, and impossible to put down.',
      isActive: true,
      displayOrder: 12
    },
    
    // SIDES
    {
      category: 'sides',
      categoryNumber: '',
      itemNumber: 0,
      name: 'Gourmet Spiced Fries',
      badge: '',
      ornament: '◆',
      luxuryType: 'premium',
      description: 'Turn up the flavor with golden fries tossed in a bold blend of aromatic spices. Crispy on the outside, tender on the inside, each fry delivers a punch of savory heat and irresistible seasoning—perfect as a snack, a side, or a craving crusher.',
      isActive: true,
      displayOrder: 13
    },
    {
      category: 'sides',
      categoryNumber: '',
      itemNumber: 0,
      name: 'Regular Fries',
      badge: '',
      ornament: '○',
      luxuryType: 'artisan',
      description: 'Classic golden fries, crispy on the outside and fluffy within—simple, timeless perfection.',
      isActive: true,
      displayOrder: 14
    },
    
    // DESSERTS
    {
      category: 'desserts',
      categoryNumber: '05',
      itemNumber: 13,
      name: 'Rice Pudding',
      badge: 'SIGNATURE',
      ornament: '◇',
      luxuryType: 'exclusive',
      description: 'Spoon into velvety rice cooked in sweet, fragrant milk and lightly scented with cardamom.',
      isActive: true,
      displayOrder: 15
    },
    {
      category: 'desserts',
      categoryNumber: '05',
      itemNumber: 14,
      name: 'Baklava',
      badge: 'HERITAGE',
      ornament: '♛',
      luxuryType: 'royal',
      description: 'Bite into layers of crisp, golden pastry filled with a sweet, nutty mix of pistachios and almonds, all drizzled with honey.',
      isActive: true,
      displayOrder: 16
    }
  ]
};

/**
 * Migrate menu data to Firestore
 * Run this once to populate the database
 */
export const migrateMenuData = async () => {
  try {
    console.log('Starting menu data migration...');
    
    // Migrate categories
    console.log('Migrating categories...');
    for (const category of MENU_DATA.categories) {
      await addDoc(collection(db, 'categories'), {
        ...category,
        isActive: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      console.log(`✓ Category: ${category.name}`);
    }
    
    // Migrate menu items
    console.log('\nMigrating menu items...');
    for (const item of MENU_DATA.menuItems) {
      await addDoc(collection(db, 'menuItems'), {
        ...item,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      console.log(`✓ Item: ${item.name} (${item.category})`);
    }
    
    console.log('\n✅ Migration completed successfully!');
    console.log(`Total categories: ${MENU_DATA.categories.length}`);
    console.log(`Total menu items: ${MENU_DATA.menuItems.length}`);
    
    return { success: true, message: 'Migration completed' };
  } catch (error) {
    console.error('❌ Migration failed:', error);
    return { success: false, error: error.message };
  }
};

// Export menu data for reference
export { MENU_DATA };
