'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '../../../../utils/supabase/client';
import { LoadingModal } from '@/components/loading-modal';
import { Input } from "@/components/ui/input";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';

interface SignInProps {
  searchParams: { 
    error?: string;
    message?: string;
  };
}

interface FormState {
  email: string;
  password: string;
}

interface FormError {
  field: keyof FormState | 'general';
  message: string;
}

export default function SignIn({ searchParams }: SignInProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormState>({
    email: '',
    password: ''
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

  const validateForm = (): boolean => {
    if (!formData.email) {
      setError({ field: 'email', message: 'Email is required' });
      return false;
    }
    if (!formData.password) {
      setError({ field: 'password', message: 'Password is required' });
      return false;
    }
    return true;
  };

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error('Invalid email or password');
        return;
      }

      toast.success('Signed in successfully');
      router.push('/');
      router.refresh();
    } catch (error) {
      toast.error('An error occurred while signing in');
    } finally {
      setIsLoading(false);
    }
  }, [formData, router]);

  // Memoized form section
  const renderForm = useCallback(() => (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        {/* Email Input */}
        <div>
          <label htmlFor="email" className="mb-1 block text-xs font-medium text-gray-600">
            Email
          </label>
          <Input
            name="email"
            id="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="you@example.com"
            disabled={isLoading}
            className={`w-full rounded-lg border ${
              error?.field === 'email' ? 'border-red-500' : 'border-gray-200'
            } bg-gray-50 px-4 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500`}
          />
          {error?.field === 'email' && (
            <p className="mt-1 text-xs text-red-500">{error.message}</p>
          )}
        </div>

        {/* Password Input */}
        <div>
          <label htmlFor="password" className="mb-1 block text-xs font-medium text-gray-600">
            Password
          </label>
          <Input
            name="password"
            id="password"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="••••••••"
            disabled={isLoading}
            className={`w-full rounded-lg border ${
              error?.field === 'password' ? 'border-red-500' : 'border-gray-200'
            } bg-gray-50 px-4 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500`}
          />
          {error?.field === 'password' && (
            <p className="mt-1 text-xs text-red-500">{error.message}</p>
          )}
        </div>

        {/* Forgot Password Link */}
        <div className="text-sm">
          <Link href="/forgot-password" className="text-blue-600 hover:text-blue-800">
            Forgot your password?
          </Link>
        </div>
      </div>

      {/* General Error Message */}
      {(error?.field === 'general' || searchParams.error) && (
        <div className="rounded-md bg-red-50 p-3">
          <p className="text-sm text-red-600">
            {error?.message || searchParams.error}
          </p>
        </div>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isLoading}
        className="w-full"
        variant={isLoading ? "ghost" : "default"}
      >
        {isLoading ? 'Signing in...' : 'Sign in'}
      </Button>

      {/* Sign-Up Link */}
      <p className="text-center text-xs text-gray-500">
        Don't have an account?{" "}
        <Link href="/sign-up" className="text-blue-500 hover:text-blue-600">
          Sign up
        </Link>
      </p>
    </form>
  ), [formData, error, isLoading, handleInputChange, handleSubmit, searchParams.error]);

  return (
    <div className="flex items-center justify-center bg-gray-50 mt-20 py-10">
      {isLoading && <LoadingModal message="Signing in..." />}
      
      <div className="flex w-full max-w-5xl overflow-hidden rounded-lg bg-white shadow-lg lg:max-h-[700px]">
        {/* Left Section - Image */}
        <div className="relative hidden w-1/2 lg:flex">
          <Image
            src="/images/jesus.jpg"
            height={500}
            width={500}
            priority
            alt="Spiritual Inspiration"
            className="size-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />
          <div className="absolute inset-0 flex flex-col items-center justify-center backdrop-brightness-75">
            <div className="rounded-xl bg-black/30 p-6 backdrop-blur-sm">
              <h2 className="mb-4 text-3xl font-light leading-tight text-white drop-shadow-lg">
                Welcome Back to <br /> CannanLand
              </h2>
              <div className="rounded-lg bg-white/90 p-4">
                <p className="mx-auto max-w-md text-sm font-bold text-gray-800">
                  Continue your spiritual journey with us.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Form */}
        <div className="flex w-full flex-col justify-center px-8 py-10 lg:w-1/2">
          <div className="mx-auto w-full max-w-sm space-y-6">
            {/* Header */}
            <div className="text-center">
              <h1 className="text-2xl font-semibold text-gray-800">
                Welcome Back Congregation
              </h1>
              <p className="text-sm text-gray-500">
                Sign in to continue your spiritual journey
              </p>
            </div>

            {renderForm()}
          </div>
        </div>
      </div>
    </div>
  );
}