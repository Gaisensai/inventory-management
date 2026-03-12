'use client';

import { createContext, useContext, ReactNode, useMemo } from 'react';
import { Product, SortConfig, FilterConfig, ExpiryStatus } from '@/lib/types';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { generateId, getExpiryStatus, isLowStock } from '@/lib/utils';
import { generateSampleProducts } from '@/lib/sampleData';
import { useSettings } from './SettingsContext';

interface ProductContextType {
  products: Product[];
  filteredProducts: Product[];
  sortConfig: SortConfig;
  filterConfig: FilterConfig;
  categories: string[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  setSortConfig: (config: SortConfig) => void;
  setFilterConfig: (config: Partial<FilterConfig>) => void;
  resetFilters: () => void;
  loadSampleData: () => void;
  clearAllProducts: () => void;
  exportToCSV: () => void;
}

const defaultFilterConfig: FilterConfig = {
  search: '',
  status: 'all',
  category: 'all',
  stockStatus: 'all',
};

const defaultSortConfig: SortConfig = {
  field: 'expiryDate',
  direction: 'asc',
};

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: ReactNode }) {
  const { settings } = useSettings();
  const [products, setProducts] = useLocalStorage<Product[]>(
    'inventory-products',
    []
  );
  const [sortConfig, setSortConfig] = useLocalStorage<SortConfig>(
    'inventory-sort',
    defaultSortConfig
  );
  const [filterConfig, setFilterConfigState] = useLocalStorage<FilterConfig>(
    'inventory-filter',
    defaultFilterConfig
  );

  const categories = useMemo(() => {
    const cats = new Set(products.map((p) => p.category));
    return Array.from(cats).sort();
  }, [products]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Apply search filter
    if (filterConfig.search) {
      const searchLower = filterConfig.search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(searchLower) ||
          p.category.toLowerCase().includes(searchLower)
      );
    }

    // Apply status filter
    if (filterConfig.status !== 'all') {
      result = result.filter((p) => {
        const status = getExpiryStatus(p.expiryDate, settings.expiryThresholds);
        return status === filterConfig.status;
      });
    }

    // Apply category filter
    if (filterConfig.category !== 'all') {
      result = result.filter((p) => p.category === filterConfig.category);
    }

    // Apply stock status filter
    if (filterConfig.stockStatus !== 'all') {
      result = result.filter((p) => {
        const low = isLowStock(p, settings.globalLowStockThreshold);
        return filterConfig.stockStatus === 'low' ? low : !low;
      });
    }

    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortConfig.field) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'stock':
          comparison = a.stock - b.stock;
          break;
        case 'expiryDate':
          comparison =
            new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime();
          break;
        case 'category':
          comparison = a.category.localeCompare(b.category);
          break;
      }
      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [products, filterConfig, sortConfig, settings]);

  const addProduct = (
    product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    const now = new Date().toISOString();
    const newProduct: Product = {
      ...product,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };
    setProducts((prev) => [...prev, newProduct]);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, ...updates, updatedAt: new Date().toISOString() }
          : p
      )
    );
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const setFilterConfig = (config: Partial<FilterConfig>) => {
    setFilterConfigState((prev) => ({ ...prev, ...config }));
  };

  const resetFilters = () => {
    setFilterConfigState(defaultFilterConfig);
  };

  const loadSampleData = () => {
    setProducts(generateSampleProducts(20));
  };

  const clearAllProducts = () => {
    setProducts([]);
  };

  const exportToCSV = () => {
    const headers = ['Name', 'Category', 'Stock', 'Min Stock', 'Expiry Date'];
    const rows = products.map((p) => [
      p.name,
      p.category,
      p.stock.toString(),
      p.minStock?.toString() || '',
      new Date(p.expiryDate).toLocaleDateString(),
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `inventory-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        filteredProducts,
        sortConfig,
        filterConfig,
        categories,
        addProduct,
        updateProduct,
        deleteProduct,
        setSortConfig,
        setFilterConfig,
        resetFilters,
        loadSampleData,
        clearAllProducts,
        exportToCSV,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
}
