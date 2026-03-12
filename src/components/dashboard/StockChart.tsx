'use client';

import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { useProducts } from '@/context/ProductContext';
import { useSettings } from '@/context/SettingsContext';
import { isLowStock } from '@/lib/utils';
import Card from '@/components/ui/Card';

export default function StockChart() {
  const { products } = useProducts();
  const { settings } = useSettings();

  const data = useMemo(() => {
    // Group by category and calculate stock levels
    const categoryStocks: Record<string, { total: number; low: number }> = {};

    products.forEach((product) => {
      if (!categoryStocks[product.category]) {
        categoryStocks[product.category] = { total: 0, low: 0 };
      }
      categoryStocks[product.category].total += product.stock;
      if (isLowStock(product, settings.globalLowStockThreshold)) {
        categoryStocks[product.category].low++;
      }
    });

    return Object.entries(categoryStocks)
      .map(([name, data]) => ({
        name,
        stock: data.total,
        lowItems: data.low,
      }))
      .sort((a, b) => b.stock - a.stock);
  }, [products, settings.globalLowStockThreshold]);

  if (products.length === 0) {
    return (
      <Card>
        <h3 className="text-sm font-semibold text-gray-700 mb-4">
          Stock by Category
        </h3>
        <div className="h-64 flex items-center justify-center text-gray-400">
          No data available
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <h3 className="text-sm font-semibold text-gray-700 mb-4">
        Stock Levels by Category
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
            <XAxis type="number" />
            <YAxis
              type="category"
              dataKey="name"
              width={80}
              tick={{ fontSize: 12 }}
            />
            <Tooltip
              formatter={(value, name) => [
                value,
                name === 'stock' ? 'Total Stock' : 'Low Stock Items',
              ]}
            />
            <Bar dataKey="stock" fill="#3b82f6" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
