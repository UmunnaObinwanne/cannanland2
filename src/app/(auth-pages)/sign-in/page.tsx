import { signInAction } from "./../../actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "../../../../utils/supabase/server";
import { redirect } from "next/navigation";

export default async function Login(props: { searchParams: Promise<Message> }) {
  // Create a Supabase client
  const supabase = await createClient();

  // Check if there's a logged-in user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Redirect to the home page or another protected page if the user is logged in
  if (user) {
    redirect("/"); // Redirect to the homepage or any other page you prefer
  }

  const searchParams = await props.searchParams;

  return (
    <div className="flex items-center justify-center bg-gray-50 mt-20 py-5">
      <div className="flex w-full max-w-5xl rounded-lg bg-white shadow-lg overflow-hidden lg:max-h-[700px]">
        {/* Left Section - Image */}
        <div className="relative hidden w-1/2 lg:flex">
          <Image
            src="/images/cross.png"
            height={700}
            width={700}
            priority
            alt="Spiritual Inspiration"
            className="size-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
            <p className="mb-4 text-2xl font-semibold leading-relaxed text-white">
              And By His Stripes,
              <br />
              We Are Made Whole
            </p>
            <p className="mt-2 text-sm text-white">- Isaiah 53:5</p>
          </div>
        </div>

        {/* Right Section - Form */}
        <div className="flex w-full flex-col justify-center px-8 py-10 lg:w-1/2">
          <div className="mx-auto w-full max-w-sm space-y-6">
            <div className="text-center">
              <h1 className="text-2xl font-semibold text-gray-800">
                Welcome Back
              </h1>
              <p className="text-sm text-gray-500">
                Sign in to continue your spiritual journey
              </p>
            </div>

            <form className="space-y-6" action={signInAction}>
              <div className="space-y-4">
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

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-xs text-gray-500">
                    Remember me
                  </span>
                </label>

              </div>

              <SubmitButton
                pendingText="Signing in..."
                className="w-full rounded-lg bg-blue-500 py-2 text-sm font-medium text-white shadow-md transition-all hover:bg-blue-600 hover:shadow-lg"
              >
                Sign in
              </SubmitButton>

              <FormMessage message={searchParams} />

              <p className="text-center text-xs text-gray-500">
                Don&apos;t have an account?{" "}
                <Link
                  href="/sign-up"
                  className="text-blue-500 hover:text-blue-600"
                >
                  Create one
                </Link>
              </p>

              <div className="text-center">
                <Link
                  href="/forgot-password"
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Forgot your password?
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
