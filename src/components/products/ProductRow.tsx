'use client';

import { Product } from '@/lib/types';
import { cn, getExpiryStatus, getDaysUntilExpiry, isLowStock, formatDate } from '@/lib/utils';
import { useSettings } from '@/context/SettingsContext';
import StockBadge from './StockBadge';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

interface ProductRowProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export default function ProductRow({
  product,
  onEdit,
  onDelete,
}: ProductRowProps) {
  const { settings } = useSettings();

  const expiryStatus = getExpiryStatus(
    product.expiryDate,
    settings.expiryThresholds
  );
  const daysUntilExpiry = getDaysUntilExpiry(product.expiryDate);
  const lowStock = isLowStock(product, settings.globalLowStockThreshold);

  const rowColors = {
    green: 'bg-green-50 hover:bg-green-100',
    amber: 'bg-amber-50 hover:bg-amber-100',
    red: 'bg-red-50 hover:bg-red-100',
  };

  return (
    <tr className={cn('transition-colors', rowColors[expiryStatus])}>
      <td className="px-4 py-3 whitespace-nowrap">
        <div className="font-medium text-gray-900">{product.name}</div>
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        <Badge variant="default">{product.category}</Badge>
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              'font-medium',
              lowStock ? 'text-red-600' : 'text-gray-900'
            )}
          >
            {product.stock}
          </span>
          {lowStock && (
            <Badge variant="danger" size="sm">
              Low
            </Badge>
          )}
        </div>
        {product.minStock && (
          <div className="text-xs text-gray-500">Min: {product.minStock}</div>
        )}
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        <div className="flex flex-col gap-1">
          <span className="text-sm text-gray-900">
            {formatDate(product.expiryDate)}
          </span>
          <StockBadge status={expiryStatus} daysUntilExpiry={daysUntilExpiry} />
        </div>
      </td>
      <td className="px-4 py-3 whitespace-nowrap text-right">
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(product)}
            aria-label="Edit product"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(product)}
            aria-label="Delete product"
            className="text-red-600 hover:bg-red-50"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </Button>
        </div>
      </td>
    </tr>
  );
}
