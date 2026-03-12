'use client';

import ThresholdConfig from '@/components/settings/ThresholdConfig';

export default function SettingsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500">
          Configure alert thresholds and application preferences
        </p>
      </div>

      <ThresholdConfig />
    </div>
  );
}
