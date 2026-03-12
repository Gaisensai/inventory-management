'use client';

import { ReactNode } from 'react';
import { SettingsProvider } from '@/context/SettingsContext';
import { ProductProvider } from '@/context/ProductContext';

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <SettingsProvider>
      <ProductProvider>{children}</ProductProvider>
    </SettingsProvider>
  );
}
