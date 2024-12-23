'use client';

export function LoadingModal() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm" />
      
      {/* Modal */}
      <div className="relative rounded-lg bg-white p-6 shadow-xl">
        <div className="flex flex-col items-center gap-4">
          {/* Loading spinner and progress bar */}
          <div className="w-64">
            <div className="mb-3 text-center text-sm font-medium text-gray-700">
              Posting Prayer Request...
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