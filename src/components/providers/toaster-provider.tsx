'use client';

import { Toaster as Sonner } from 'sonner';

export function ToasterProvider() {
  return (
    <Sonner
      position="bottom-right"
      toastOptions={{
        style: {
          background: 'white',
          border: '1px solid #E2E8F0',
          borderRadius: '0.5rem',
        },
      }}
    />
  );
} 