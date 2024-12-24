'use client';

import { createClient } from "@/lib/supabase/client";

export function LoadingModal({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm" />
      
      <div className="relative rounded-lg bg-white p-6 shadow-xl">
        <div className="flex flex-col items-center gap-4">
          <div className="w-64">
            <div className="mb-3 text-center text-sm font-medium text-gray-700">
              {message}
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
              <div className="h-full w-full origin-left animate-[progress_2s_ease-in-out_infinite] rounded-full bg-blue-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 