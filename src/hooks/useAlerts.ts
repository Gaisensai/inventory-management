'use client';

import { useMemo } from 'react';
import { Alert } from '@/lib/types';
import { generateAlerts } from '@/lib/utils';
import { useProducts } from '@/context/ProductContext';
import { useSettings } from '@/context/SettingsContext';

export function useAlerts() {
  const { products } = useProducts();
  const { settings } = useSettings();

  const alerts = useMemo(() => {
    return generateAlerts(products, settings);
  }, [products, settings]);

  const criticalAlerts = useMemo(() => {
    return alerts.filter((a) => a.severity === 'critical');
  }, [alerts]);

  const warningAlerts = useMemo(() => {
    return alerts.filter((a) => a.severity === 'warning');
  }, [alerts]);

  const lowStockAlerts = useMemo(() => {
    return alerts.filter((a) => a.type === 'low-stock');
  }, [alerts]);

  const expiryAlerts = useMemo(() => {
    return alerts.filter(
      (a) => a.type === 'expiring-soon' || a.type === 'expired'
    );
  }, [alerts]);

  return {
    alerts,
    criticalAlerts,
    warningAlerts,
    lowStockAlerts,
    expiryAlerts,
    totalAlerts: alerts.length,
    criticalCount: criticalAlerts.length,
    warningCount: warningAlerts.length,
  };
}
