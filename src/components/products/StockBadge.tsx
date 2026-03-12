'use client';

import Badge from '@/components/ui/Badge';
import { ExpiryStatus } from '@/lib/types';

interface StockBadgeProps {
  status: ExpiryStatus;
  daysUntilExpiry: number;
}

export default function StockBadge({ status, daysUntilExpiry }: StockBadgeProps) {
  const variant = {
    green: 'success',
    amber: 'warning',
    red: 'danger',
  }[status] as 'success' | 'warning' | 'danger';

  const label =
    daysUntilExpiry < 0
      ? 'Expired'
      : daysUntilExpiry === 0
      ? 'Expires today'
      : daysUntilExpiry === 1
      ? '1 day left'
      : `${daysUntilExpiry} days`;

  return (
    <Badge variant={variant} size="sm">
      {label}
    </Badge>
  );
}
