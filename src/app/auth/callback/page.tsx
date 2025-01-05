'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Image from 'next/image';

export default function AuthCallbackPage({
  searchParams,
}: {
  searchParams: { code?: string };
}) {
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      const supabase = createClient();
      
      if (searchParams.code) {
        await supabase.auth.exchangeCodeForSession(searchParams.code);
        router.push('/sign-in?verified=true');
      } else {
        router.push('/');
      }
    };

    handleCallback();
  }, [searchParams.code, router]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full mx-4 text-center">
        <div className="mb-6">
          <Image
            src="/images/jesus.jpg"
            alt="Logo"
            width={100}
            height={100}
            className="mx-auto rounded-full"
          />
        </div>
        
        <h1 className="text-xl font-semibold text-gray-900 mb-2">
          Verifying your email
        </h1>
        
        <p className="text-gray-600 mb-6">
          Please wait while we verify your email address and redirect you...
        </p>
        
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        </div>
      </div>
    </div>
  );
}