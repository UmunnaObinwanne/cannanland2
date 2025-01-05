'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

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

  return null; // This page doesn't need to render anything
}