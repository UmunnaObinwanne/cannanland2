/*

'use client'

import { createContext, useContext, useState, ReactNode } from 'react';

// Define the type for the toast message
type ToastMessage = string;

// Create a context for the toast
const ToastContext = createContext<(message: ToastMessage) => void | null>(null);

// Define the props for the ToastProvider
interface ToastProviderProps {
  children: ReactNode;
}

// ToastProvider component
export const ToastProvider = ({ children }: ToastProviderProps) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const toast = (message: ToastMessage) => {
    setToasts((prev) => [...prev, message]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((_, i) => i !== 0));
    }, 3000); // Adjust duration as needed
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="fixed top-0 right-0 p-4 space-y-2 z-50">
        {toasts.map((toast, index) => (
          <div key={index} className="toast bg-white p-3 rounded shadow-md">
            {toast}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

// Custom hook to use the ToastContext
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context; // Return the toast function directly
}; 

*/