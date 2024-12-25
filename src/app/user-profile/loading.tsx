import React from 'react';

export default function Loading() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* Profile Card */}
      <div className="rounded-lg bg-white p-6 shadow-md">
        <div className="flex items-center space-x-6">
          {/* Profile Image Skeleton */}
          <div className="relative h-24 w-24">
            <div className="h-24 w-24 animate-pulse rounded-full bg-gray-200" />
          </div>

          {/* Profile Info Skeleton */}
          <div className="space-y-3 flex-1">
            <div className="flex items-center justify-between">
              <div className="h-8 w-48 animate-pulse rounded-md bg-gray-200" />
              <div className="h-10 w-28 animate-pulse rounded-lg bg-gray-200" />
            </div>
            <div className="h-5 w-32 animate-pulse rounded bg-gray-200" />
          </div>
        </div>

        {/* Profile Details Skeleton */}
        <div className="mt-8 space-y-6">
          <div className="h-7 w-40 animate-pulse rounded bg-gray-200" />
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
                <div className="h-5 w-48 animate-pulse rounded bg-gray-200" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Activity Section Skeleton */}
      <div className="mt-8">
        <div className="mb-6 h-8 w-32 animate-pulse rounded bg-gray-200" />
        
        {/* Posts Skeleton */}
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="rounded-lg bg-white p-6 shadow-md">
              <div className="space-y-3">
                <div className="h-6 w-24 animate-pulse rounded-full bg-gray-200" />
                <div className="h-7 w-3/4 animate-pulse rounded bg-gray-200" />
                <div className="space-y-2">
                  <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
                  <div className="h-4 w-2/3 animate-pulse rounded bg-gray-200" />
                </div>
                <div className="h-5 w-32 animate-pulse rounded bg-gray-200" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 