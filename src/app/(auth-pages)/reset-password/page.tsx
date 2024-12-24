'use client';

import { useState, useCallback } from 'react';
import { createClient } from "@/lib/supabase/client";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/toast';
import { LoadingModal } from '@/components/loading-modal';

interface FormState {
  password: string;
  confirmPassword: string;
}

interface FormError {
  field: keyof FormState | 'general';
  message: string;
}

export default function ResetPassword() {
  const router = useRouter();
  const { showToast, ToastContainer } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [formData, setFormData] = useState<FormState>({
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState<FormError | null>(null);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (error?.field === name) {
      setError(null);
    }
  }, [error]);

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const validateForm = (): boolean => {
      if (formData.password.length < 6) {
        setError({ 
          field: 'password', 
          message: 'Password must be at least 6 characters long' 
        });
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setError({ 
          field: 'confirmPassword', 
          message: 'Passwords do not match' 
        });
        return false;
      }
      return true;
    };

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { error: updateError } = await supabase.auth.updateUser({
        password: formData.password
      });

      if (updateError) throw updateError;

      showToast('Password updated successfully', 'success');
      
      setIsRedirecting(true);
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      router.push('/sign-in?message=Password updated successfully. Please sign in with your new password.');
      router.refresh();
      
    } catch (error: any) {
      console.error('Error:', error);
      showToast(
        error.message || 'Failed to update password. Please try again.', 
        'error'
      );
      setError({
        field: 'general',
        message: error.message || 'Failed to update password'
      });
      setIsLoading(false);
      setIsRedirecting(false);
    }
  }, [formData, router, showToast]);

  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-gray-50">
      {/* Show loading modal when redirecting */}
      {isRedirecting && (
        <LoadingModal message="Redirecting to sign in..." />
      )}
      
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-lg">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Set New Password</h1>
          <p className="mt-2 text-sm text-gray-600">
            Enter your new password below.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {/* Password Field */}
          <div>
            <label 
              htmlFor="password" 
              className="block text-sm font-medium text-gray-700"
            >
              New Password
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className={`mt-1 ${
                error?.field === 'password' ? 'border-red-500' : ''
              }`}
              minLength={6}
              disabled={isLoading || isRedirecting}
            />
            {error?.field === 'password' && (
              <p className="mt-1 text-xs text-red-500">{error.message}</p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div>
            <label 
              htmlFor="confirmPassword" 
              className="block text-sm font-medium text-gray-700"
            >
              Confirm Password
            </label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
              className={`mt-1 ${
                error?.field === 'confirmPassword' ? 'border-red-500' : ''
              }`}
              minLength={6}
              disabled={isLoading || isRedirecting}
            />
            {error?.field === 'confirmPassword' && (
              <p className="mt-1 text-xs text-red-500">{error.message}</p>
            )}
          </div>

          {/* General Error Message */}
          {error?.field === 'general' && (
            <div className="rounded-md bg-red-50 p-3">
              <p className="text-sm text-red-600">{error.message}</p>
            </div>
          )}

          <Button
            type="submit"
            disabled={isLoading || isRedirecting}
            className="w-full"
          >
            {isLoading ? 'Updating Password...' : 
             isRedirecting ? 'Redirecting...' : 
             'Update Password'}
          </Button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}