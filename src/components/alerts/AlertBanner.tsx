'use client';

import { useAlerts } from '@/hooks/useAlerts';
import Badge from '@/components/ui/Badge';
import { cn } from '@/lib/utils';

interface AlertBannerProps {
  className?: string;
}

export default function AlertBanner({ className }: AlertBannerProps) {
  const { criticalCount, warningCount, totalAlerts } = useAlerts();

  if (totalAlerts === 0) return null;

  return (
    <div
      className={cn(
        'flex items-center gap-4 px-4 py-3 rounded-lg',
        criticalCount > 0
          ? 'bg-red-50 border border-red-200'
          : 'bg-amber-50 border border-amber-200',
        className
      )}
    >
      <div className="flex items-center gap-2">
        {criticalCount > 0 ? (
          <svg
            className="w-5 h-5 text-red-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        ) : (
          <svg
            className="w-5 h-5 text-amber-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        )}
        <span
          className={cn(
            'font-medium',
            criticalCount > 0 ? 'text-red-800' : 'text-amber-800'
          )}
        >
          {totalAlerts} {totalAlerts === 1 ? 'alert' : 'alerts'} requiring
          attention
        </span>
      </div>

      <div className="flex gap-2">
        {criticalCount > 0 && (
          <Badge variant="danger" size="sm">
            {criticalCount} critical
          </Badge>
        )}
        {warningCount > 0 && (
          <Badge variant="warning" size="sm">
            {warningCount} warning
          </Badge>
        )}
      </div>
    </div>
  );
}
