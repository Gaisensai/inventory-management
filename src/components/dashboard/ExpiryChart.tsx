'use client';

import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useProducts } from '@/context/ProductContext';
import { useSettings } from '@/context/SettingsContext';
import { getExpiryStatus } from '@/lib/utils';
import Card from '@/components/ui/Card';

const COLORS = {
  green: '#22c55e',
  amber: '#f59e0b',
  red: '#ef4444',
};

export default function ExpiryChart() {
  const { products } = useProducts();
  const { settings } = useSettings();

  const data = useMemo(() => {
    const counts = { green: 0, amber: 0, red: 0 };

    products.forEach((product) => {
      const status = getExpiryStatus(
        product.expiryDate,
        settings.expiryThresholds
      );
      counts[status]++;
    });

    return [
      { name: 'Healthy', value: counts.green, color: COLORS.green },
      { name: 'Warning', value: counts.amber, color: COLORS.amber },
      { name: 'Critical', value: counts.red, color: COLORS.red },
    ].filter((item) => item.value > 0);
  }, [products, settings.expiryThresholds]);

  if (products.length === 0) {
    return (
      <Card>
        <h3 className="text-sm font-semibold text-gray-700 mb-4">
          Expiry Status
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
        Expiry Status Distribution
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
              label={({ name, percent }) =>
                `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
              }
              labelLine={false}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => [`${value} products`, 'Count']}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
