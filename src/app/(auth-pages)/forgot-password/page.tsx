'use client';

import { useState } from 'react';
import { createClient } from '../../../../utils/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useToast } from '@/components/toast';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const { showToast, ToastContainer } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        throw error;
      }

      setIsEmailSent(true);
      showToast('Password reset link sent to your email', 'success');
    } catch (error) {
      console.error('Error:', error);
      showToast('Failed to send reset link. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-lg">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Reset Password</h1>
          <p className="mt-2 text-sm text-gray-600">
            Enter your email address and we will send you a link to reset your password.
          </p>
        </div>

        {isEmailSent ? (
          <div className="rounded-lg bg-green-50 p-4 text-center">
            <p className="text-sm text-green-800">
              If that email is valid, you will receive a link to reset your password. The link will expire in 24 hours.
            </p>
            <Link
              href="/sign-in"
              className="mt-4 inline-block text-sm text-blue-600 hover:text-blue-800"
            >
              Return to Sign In
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1"
                placeholder="you@example.com"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </Button>

            <div className="text-center">
              <Link
                href="/sign-in"
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Back to Sign In
              </Link>
        </div>
      </form>
        )}
      </div>
      <ToastContainer />
    </div>
  );
}
