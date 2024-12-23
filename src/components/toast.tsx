'use client';

import { useEffect, useState } from 'react';

export type ToastType = 'success' | 'error' | 'info';

type Toast = {
  id: number;
  message: string;
  type: ToastType;
};

let toastCount = 0;
const TOAST_DURATION = 3000; // 3 seconds

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: ToastType = 'info') => {
    const id = toastCount++;
    setToasts(prev => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, TOAST_DURATION);
  };

  return { showToast, ToastContainer };
}

function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const sub = subscribe((newToasts) => setToasts(newToasts));
    return () => sub();
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`animate-in slide-in-from-right rounded-lg px-4 py-2 text-white shadow-lg ${
            toast.type === 'success' ? 'bg-green-500' :
            toast.type === 'error' ? 'bg-red-500' :
            'bg-blue-500'
          }`}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}

// Simple pub/sub for toast state
let listeners: ((toasts: Toast[]) => void)[] = [];
let currentToasts: Toast[] = [];

function subscribe(listener: (toasts: Toast[]) => void) {
  listeners.push(listener);
  listener(currentToasts);
  return () => {
    listeners = listeners.filter(l => l !== listener);
  };
}

export function toast(message: string, type: ToastType = 'info') {
  const id = toastCount++;
  currentToasts = [...currentToasts, { id, message, type }];
  listeners.forEach(listener => listener(currentToasts));

  setTimeout(() => {
    currentToasts = currentToasts.filter(t => t.id !== id);
    listeners.forEach(listener => listener(currentToasts));
  }, TOAST_DURATION);
} 