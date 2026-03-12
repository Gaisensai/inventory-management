export interface Product {
  id: string;
  name: string;
  category: string;
  stock: number;
  minStock?: number; // Per-product threshold override
  expiryDate: string; // ISO date string
  createdAt: string;
  updatedAt: string;
}

export interface Settings {
  expiryThresholds: {
    red: number;   // Days until expiry for red status
    amber: number; // Days until expiry for amber status
  };
  globalLowStockThreshold: number;
}

export interface Alert {
  id: string;
  productId: string;
  productName: string;
  type: 'low-stock' | 'expiring-soon' | 'expired';
  severity: 'warning' | 'critical';
  message: string;
}

export type ExpiryStatus = 'green' | 'amber' | 'red';

export type SortField = 'name' | 'stock' | 'expiryDate' | 'category';
export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  field: SortField;
  direction: SortDirection;
}

export interface FilterConfig {
  search: string;
  status: ExpiryStatus | 'all';
  category: string;
  stockStatus: 'all' | 'low' | 'normal';
}
