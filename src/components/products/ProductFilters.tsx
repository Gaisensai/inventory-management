'use client';

import { useProducts } from '@/context/ProductContext';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';

export default function ProductFilters() {
  const { filterConfig, setFilterConfig, resetFilters, categories } =
    useProducts();

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'green', label: 'Healthy (Green)' },
    { value: 'amber', label: 'Warning (Amber)' },
    { value: 'red', label: 'Critical (Red)' },
  ];

  const stockOptions = [
    { value: 'all', label: 'All Stock' },
    { value: 'low', label: 'Low Stock' },
    { value: 'normal', label: 'Normal Stock' },
  ];

  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    ...categories.map((cat) => ({ value: cat, label: cat })),
  ];

  const hasActiveFilters =
    filterConfig.search ||
    filterConfig.status !== 'all' ||
    filterConfig.category !== 'all' ||
    filterConfig.stockStatus !== 'all';

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="flex-1">
        <Input
          placeholder="Search products..."
          value={filterConfig.search}
          onChange={(e) => setFilterConfig({ search: e.target.value })}
          className="w-full"
        />
      </div>

      <div className="flex flex-wrap gap-3">
        <Select
          options={statusOptions}
          value={filterConfig.status}
          onChange={(e) =>
            setFilterConfig({
              status: e.target.value as typeof filterConfig.status,
            })
          }
          className="w-40"
        />

        <Select
          options={categoryOptions}
          value={filterConfig.category}
          onChange={(e) => setFilterConfig({ category: e.target.value })}
          className="w-40"
        />

        <Select
          options={stockOptions}
          value={filterConfig.stockStatus}
          onChange={(e) =>
            setFilterConfig({
              stockStatus: e.target.value as typeof filterConfig.stockStatus,
            })
          }
          className="w-36"
        />

        {hasActiveFilters && (
          <Button variant="ghost" onClick={resetFilters} className="text-sm">
            Clear filters
          </Button>
        )}
      </div>
    </div>
  );
}
