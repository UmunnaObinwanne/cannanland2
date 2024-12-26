import React from 'react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="container mx-auto max-w-5xl px-4">
        <div className="mb-10 overflow-hidden rounded-xl bg-white shadow-lg">
          <div className="h-40 bg-gradient-to-r from-blue-500/50 to-purple-600/50 animate-pulse" />
          
          <div className="relative px-6 pb-6">
            <div className="flex items-end gap-6 -mt-12 mb-4">
              <div className="relative h-24 w-24 rounded-xl bg-gray-200 animate-pulse" />
              
              <div className="flex-1 pt-10">
                <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-2" />
                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>

            <div className="mt-6 flex gap-6 border-t border-gray-100 pt-6">
              <div className="space-y-2">
                <div className="h-6 w-16 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-12 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
          
          <div className="grid gap-6 md:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-xl bg-white p-6 shadow-md space-y-4">
                <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse" />
                <div className="h-24 w-full bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-1/4 bg-gray-200 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 