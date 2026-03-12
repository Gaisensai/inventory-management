'use client';

import { useAlerts } from '@/hooks/useAlerts';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { cn } from '@/lib/utils';

export default function AlertList() {
  const { alerts } = useAlerts();

  if (alerts.length === 0) {
    return (
      <Card className="text-center py-8 text-gray-500">
        <svg
          className="w-12 h-12 mx-auto text-gray-300 mb-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p>No alerts - all products are healthy!</p>
      </Card>
    );
  }

  const groupedAlerts = {
    critical: alerts.filter((a) => a.severity === 'critical'),
    warning: alerts.filter((a) => a.severity === 'warning'),
  };

  return (
    <div className="space-y-4">
      {groupedAlerts.critical.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-red-800 mb-2 flex items-center gap-2">
            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
            Critical ({groupedAlerts.critical.length})
          </h3>
          <Card padding="none" className="divide-y divide-gray-100">
            {groupedAlerts.critical.map((alert) => (
              <div
                key={alert.id}
                className="flex items-center justify-between px-4 py-3 bg-red-50"
              >
                <div className="flex items-center gap-3">
                  <Badge
                    variant={alert.type === 'low-stock' ? 'info' : 'danger'}
                    size="sm"
                  >
                    {alert.type === 'low-stock' ? 'Stock' : 'Expiry'}
                  </Badge>
                  <span className="text-sm text-gray-900">{alert.message}</span>
                </div>
              </div>
            ))}
          </Card>
        </div>
      )}

      {groupedAlerts.warning.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-amber-800 mb-2 flex items-center gap-2">
            <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
            Warning ({groupedAlerts.warning.length})
          </h3>
          <Card padding="none" className="divide-y divide-gray-100">
            {groupedAlerts.warning.map((alert) => (
              <div
                key={alert.id}
                className="flex items-center justify-between px-4 py-3 bg-amber-50"
              >
                <div className="flex items-center gap-3">
                  <Badge
                    variant={alert.type === 'low-stock' ? 'info' : 'warning'}
                    size="sm"
                  >
                    {alert.type === 'low-stock' ? 'Stock' : 'Expiry'}
                  </Badge>
                  <span className="text-sm text-gray-900">{alert.message}</span>
                </div>
              </div>
            ))}
          </Card>
        </div>
      )}
    </div>
  );
}
