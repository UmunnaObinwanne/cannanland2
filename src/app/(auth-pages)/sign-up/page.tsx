'use client';

import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import Image from "next/image";
import { signUpAction } from "./../../actions";
import { createClient } from "@/lib/supabase/client";
import { redirect, useRouter } from "next/navigation";
import { toast } from 'sonner';
import { useEffect, useState } from 'react';

export default function Signup({
  searchParams,
}: {
  searchParams: { error?: string
    message?: string;
    redirect?: string;
   };
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        router.push('/');
      }
      setIsLoading(false);
    };
    checkUser();
  }, [router]);

  if (isLoading) {
    return null; // or a loading spinner
  }

  /*
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success('Check your email to confirm your account');
      redirect('/sign-in');
    } catch (error) {
      toast.error('An error occurred while signing up');
    } finally {
      setIsLoading(false);
    }
  };
  */


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setIsLoading(true);

  const formData = new FormData(e.currentTarget);
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  try {
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success('Check your email to confirm your account', {
  position: 'top-center',
  duration: 5000,
  className: 'bg-green-50',
});
    router.push('/sign-in?message=Please check your email to confirm your account');
  } catch (error) {
    toast.error('An error occurred while signing up');
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="flex items-center justify-center bg-gray-50 mt-20 py-10">
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
                Find Peace and Growth <br /> In CannanLand
              </h2>
              <div className="rounded-lg bg-white/90 p-4">
                <p className="mx-auto max-w-md text-sm font-bold text-gray-800">
                  Join thousands of people building spiritual and meaningful habits in
                  their daily lives.
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
                Create your account
              </h1>
              <p className="text-sm text-gray-500">
                Get started on Prayerland today
              </p>
            </div>

            {/* Email Verification Message */}
            {searchParams?.message && (
              <div className="rounded-lg bg-blue-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">
                      Check Your Email
                    </h3>
                    <div className="mt-2 text-sm text-blue-700">
                      <p>
                        Please check your email for a verification link to complete your registration. 
                        Remember to check your spam folder if you don't see it in your inbox.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {searchParams?.error && (
              <div className="rounded-md bg-red-50 p-4">
                <p className="text-sm text-red-800">
                  {searchParams.error}
                </p>
              </div>
            )}

            {/* Form */}
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-4">
                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-1 block text-xs font-medium text-gray-600"
                  >
                    Email
                  </label>
                  <Input
                    name="email"
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="mb-1 block text-xs font-medium text-gray-600"
                  >
                    Password
                  </label>
                  <Input
                    name="password"
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    required
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <SubmitButton
                pendingText="Creating account..."
                className="w-full rounded-lg bg-blue-500 py-2 text-sm font-medium text-white shadow-md transition-all hover:bg-blue-600 hover:shadow-lg"
              >
                Sign up
              </SubmitButton>

              {/* Sign-In Link */}
              <p className="text-center text-xs text-gray-500">
                Already have an account?{" "}
                <Link href="/sign-in" className="text-blue-500 hover:text-blue-600">
                  Sign in
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
