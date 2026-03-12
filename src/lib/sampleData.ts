import { addDays, subDays } from 'date-fns';
import { Product, Settings } from './types';
import { generateId } from './utils';

export const defaultSettings: Settings = {
  expiryThresholds: {
    red: 7,
    amber: 30,
  },
  globalLowStockThreshold: 10,
};

const categories = ['Dairy', 'Produce', 'Meat', 'Bakery', 'Beverages', 'Snacks', 'Frozen'];

const productNames: Record<string, string[]> = {
  Dairy: ['Milk', 'Cheese', 'Yogurt', 'Butter', 'Cream'],
  Produce: ['Apples', 'Bananas', 'Carrots', 'Lettuce', 'Tomatoes'],
  Meat: ['Chicken Breast', 'Ground Beef', 'Pork Chops', 'Salmon', 'Turkey'],
  Bakery: ['Bread', 'Croissants', 'Muffins', 'Bagels', 'Donuts'],
  Beverages: ['Orange Juice', 'Apple Juice', 'Soda', 'Water', 'Coffee'],
  Snacks: ['Chips', 'Crackers', 'Cookies', 'Nuts', 'Pretzels'],
  Frozen: ['Ice Cream', 'Pizza', 'Vegetables', 'Waffles', 'Fish Sticks'],
};

export function generateSampleProducts(count: number = 20): Product[] {
  const products: Product[] = [];
  const now = new Date().toISOString();

  for (let i = 0; i < count; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const names = productNames[category];
    const name = names[Math.floor(Math.random() * names.length)];

    // Generate varied expiry dates: some expired, some critical, some ok
    let expiryOffset: number;
    const rand = Math.random();
    if (rand < 0.1) {
      // 10% expired
      expiryOffset = -Math.floor(Math.random() * 10) - 1;
    } else if (rand < 0.25) {
      // 15% critical (< 7 days)
      expiryOffset = Math.floor(Math.random() * 7);
    } else if (rand < 0.45) {
      // 20% warning (7-30 days)
      expiryOffset = 7 + Math.floor(Math.random() * 23);
    } else {
      // 55% healthy (> 30 days)
      expiryOffset = 30 + Math.floor(Math.random() * 60);
    }

    const expiryDate = expiryOffset >= 0
      ? addDays(new Date(), expiryOffset)
      : subDays(new Date(), Math.abs(expiryOffset));

    // Generate varied stock levels
    let stock: number;
    const stockRand = Math.random();
    if (stockRand < 0.1) {
      // 10% out of stock
      stock = 0;
    } else if (stockRand < 0.3) {
      // 20% low stock
      stock = Math.floor(Math.random() * 10) + 1;
    } else {
      // 70% normal stock
      stock = Math.floor(Math.random() * 90) + 11;
    }

    // Some products have custom min stock
    const minStock = Math.random() > 0.7 ? Math.floor(Math.random() * 15) + 5 : undefined;

    products.push({
      id: generateId(),
      name: `${name} ${i + 1}`,
      category,
      stock,
      minStock,
      expiryDate: expiryDate.toISOString(),
      createdAt: now,
      updatedAt: now,
    });
  }

  return products;
}
