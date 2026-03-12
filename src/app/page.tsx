'use client';

import { useProducts } from '@/context/ProductContext';
import { useSettings } from '@/context/SettingsContext';
import { useAlerts } from '@/hooks/useAlerts';
import { getExpiryStatus, isLowStock } from '@/lib/utils';
import StatsCard from '@/components/dashboard/StatsCard';
import ExpiryChart from '@/components/dashboard/ExpiryChart';
import StockChart from '@/components/dashboard/StockChart';
import AlertBanner from '@/components/alerts/AlertBanner';
import AlertList from '@/components/alerts/AlertList';
import Button from '@/components/ui/Button';
import Link from 'next/link';

export default function DashboardPage() {
  const { products, loadSampleData } = useProducts();
  const { settings } = useSettings();
  const { criticalCount, warningCount } = useAlerts();

  const totalProducts = products.length;
  const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
  const lowStockCount = products.filter((p) =>
    isLowStock(p, settings.globalLowStockThreshold)
  ).length;

  if (products.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-12 h-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome to Inventory Management
          </h1>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">
            Track your product stock levels and expiry dates with real-time
            alerts. Get started by adding products or loading sample data.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button onClick={loadSampleData}>Load Sample Data</Button>
            <Link href="/products">
              <Button variant="secondary">Add Products Manually</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500">Overview of your inventory status</p>
      </div>

      <AlertBanner className="mb-6" />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard
          title="Total Products"
          value={totalProducts}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          }
        />

        <StatsCard
          title="Total Stock"
          value={totalStock.toLocaleString()}
          subtitle="units"
          variant="success"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
          }
        />

        <StatsCard
          title="Low Stock Items"
          value={lowStockCount}
          variant={lowStockCount > 0 ? 'warning' : 'success'}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          }
        />

        <StatsCard
          title="Critical Alerts"
          value={criticalCount}
          subtitle={warningCount > 0 ? `+${warningCount} warnings` : undefined}
          variant={criticalCount > 0 ? 'danger' : 'success'}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          }
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <ExpiryChart />
        <StockChart />
      </div>

      {/* Alerts List */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Active Alerts</h2>
        <AlertList />
      </div>
    </div>
  );
}
