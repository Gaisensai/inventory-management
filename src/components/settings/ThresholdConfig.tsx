'use client';

import { useState } from 'react';
import { useSettings } from '@/context/SettingsContext';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function ThresholdConfig() {
  const { settings, updateExpiryThresholds, updateGlobalLowStockThreshold, resetSettings } =
    useSettings();

  const [redDays, setRedDays] = useState(settings.expiryThresholds.red.toString());
  const [amberDays, setAmberDays] = useState(settings.expiryThresholds.amber.toString());
  const [lowStock, setLowStock] = useState(settings.globalLowStockThreshold.toString());
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    const red = parseInt(redDays) || 7;
    const amber = parseInt(amberDays) || 30;
    const stock = parseInt(lowStock) || 10;

    // Ensure amber > red
    const validAmber = Math.max(amber, red + 1);

    updateExpiryThresholds({ red, amber: validAmber });
    updateGlobalLowStockThreshold(stock);

    setAmberDays(validAmber.toString());
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    resetSettings();
    setRedDays('7');
    setAmberDays('30');
    setLowStock('10');
  };

  return (
    <div className="space-y-6">
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Expiry Thresholds
        </h3>
        <p className="text-sm text-gray-500 mb-6">
          Configure when products should be flagged based on their expiry date.
        </p>

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                <span className="font-medium text-red-800">Critical (Red)</span>
              </div>
              <Input
                type="number"
                min="1"
                max="365"
                value={redDays}
                onChange={(e) => setRedDays(e.target.value)}
                className="bg-white"
              />
              <p className="text-xs text-red-600 mt-2">
                Products expiring within this many days
              </p>
            </div>

            <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-3 h-3 bg-amber-500 rounded-full"></span>
                <span className="font-medium text-amber-800">Warning (Amber)</span>
              </div>
              <Input
                type="number"
                min="1"
                max="365"
                value={amberDays}
                onChange={(e) => setAmberDays(e.target.value)}
                className="bg-white"
              />
              <p className="text-xs text-amber-600 mt-2">
                Products expiring within this many days
              </p>
            </div>
          </div>

          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-3 h-3 bg-green-500 rounded-full"></span>
              <span className="font-medium text-green-800">Healthy (Green)</span>
            </div>
            <p className="text-sm text-green-600">
              Products with more than {amberDays} days until expiry
            </p>
          </div>
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Stock Thresholds
        </h3>
        <p className="text-sm text-gray-500 mb-6">
          Set the global low stock threshold. Individual products can override this.
        </p>

        <div className="max-w-xs">
          <Input
            label="Global Low Stock Threshold"
            type="number"
            min="1"
            max="1000"
            value={lowStock}
            onChange={(e) => setLowStock(e.target.value)}
          />
          <p className="text-xs text-gray-500 mt-2">
            Products at or below this quantity will trigger a low stock alert
          </p>
        </div>
      </Card>

      <div className="flex items-center justify-between">
        <Button variant="secondary" onClick={handleReset}>
          Reset to Defaults
        </Button>
        <div className="flex items-center gap-3">
          {saved && (
            <span className="text-sm text-green-600 flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Settings saved
            </span>
          )}
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </div>
    </div>
  );
}
