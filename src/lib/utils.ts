import { differenceInDays } from 'date-fns';
import { ExpiryStatus, Product, Settings, Alert } from './types';

export function getExpiryStatus(
  expiryDate: string,
  thresholds: Settings['expiryThresholds']
): ExpiryStatus {
  const daysUntilExpiry = differenceInDays(new Date(expiryDate), new Date());

  if (daysUntilExpiry < 0) return 'red'; // Already expired
  if (daysUntilExpiry <= thresholds.red) return 'red';
  if (daysUntilExpiry <= thresholds.amber) return 'amber';
  return 'green';
}

export function getDaysUntilExpiry(expiryDate: string): number {
  return differenceInDays(new Date(expiryDate), new Date());
}

export function isLowStock(product: Product, globalThreshold: number): boolean {
  const threshold = product.minStock ?? globalThreshold;
  return product.stock <= threshold;
}

export function generateAlerts(
  products: Product[],
  settings: Settings
): Alert[] {
  const alerts: Alert[] = [];

  products.forEach((product) => {
    const daysUntilExpiry = getDaysUntilExpiry(product.expiryDate);
    const expiryStatus = getExpiryStatus(product.expiryDate, settings.expiryThresholds);
    const lowStock = isLowStock(product, settings.globalLowStockThreshold);

    // Expired alert
    if (daysUntilExpiry < 0) {
      alerts.push({
        id: `${product.id}-expired`,
        productId: product.id,
        productName: product.name,
        type: 'expired',
        severity: 'critical',
        message: `${product.name} expired ${Math.abs(daysUntilExpiry)} days ago`,
      });
    }
    // Expiring soon alert
    else if (expiryStatus === 'red') {
      alerts.push({
        id: `${product.id}-expiring`,
        productId: product.id,
        productName: product.name,
        type: 'expiring-soon',
        severity: 'critical',
        message: `${product.name} expires in ${daysUntilExpiry} days`,
      });
    } else if (expiryStatus === 'amber') {
      alerts.push({
        id: `${product.id}-expiring`,
        productId: product.id,
        productName: product.name,
        type: 'expiring-soon',
        severity: 'warning',
        message: `${product.name} expires in ${daysUntilExpiry} days`,
      });
    }

    // Low stock alert
    if (lowStock) {
      const threshold = product.minStock ?? settings.globalLowStockThreshold;
      alerts.push({
        id: `${product.id}-lowstock`,
        productId: product.id,
        productName: product.name,
        type: 'low-stock',
        severity: product.stock === 0 ? 'critical' : 'warning',
        message: `${product.name} has low stock (${product.stock}/${threshold})`,
      });
    }
  });

  return alerts;
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

export function cn(...classes: (string | boolean | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
