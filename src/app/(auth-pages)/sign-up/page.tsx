'use client';

import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import Image from "next/image";
import { signUpAction } from "./../../actions";
import { createClient } from "../../../../utils/supabase/server";
import { redirect } from "next/navigation";
import { toast } from 'sonner';

export default async function Signup({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const supabase = await createClient();

  // Get current user from session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Redirect if user is logged in
  if (user) {
    redirect("/sign-in"); // Redirect to the homepage or any other page you prefer
  }

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
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />
          {/* Additional contrast layer for text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center backdrop-brightness-75">
            {/* Text Container with its own background */}
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

            {/* Conditional FormMessage */}
           {searchParams && <p className="text-red-900">{searchParams.error}</p>}

            {/* Form */}
            <form className="space-y-6" action={signUpAction}>
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
                <Link
                  href="/sign-in"
                  className="text-blue-500 hover:text-blue-600"
                >
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
