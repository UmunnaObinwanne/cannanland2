'use client';

import { Toaster as Sonner } from 'sonner';

export function ToasterProvider() {
  return (
    <Sonner
      className="toaster group"
      position="top-center"
      expand={true}
      richColors
      closeButton
      toastOptions={{
        className: 'group toast group-[.toaster]:bg-white group-[.toaster]:text-zinc-950',
        style: {
          border: '1px solid #E2E8F0',
          borderRadius: '0.5rem',
          padding: '1rem',
        },
        duration: 5000,
      }}
    />
  );
}