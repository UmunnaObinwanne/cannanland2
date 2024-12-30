export function LoadingSpinner({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      className={`animate-pulse text-white ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
    >
      {/* Left Hand */}
      <path
        className="animate-[leftPray_2s_ease-in-out_infinite] origin-right"
        fill="currentColor"
        d="M7 8C7 8 4 10 4 14C4 17 6 20 6 20L11 16C11 16 9 14 9 12C9 10 10 9 10 9L7 8Z"
      />
      {/* Right Hand */}
      <path
        className="animate-[rightPray_2s_ease-in-out_infinite] origin-left"
        fill="currentColor"
        d="M17 8C17 8 20 10 20 14C20 17 18 20 18 20L13 16C13 16 15 14 15 12C15 10 14 9 14 9L17 8Z"
      />
      <style>
        {`
          @keyframes leftPray {
            0%, 100% { transform: rotate(0deg); }
            50% { transform: rotate(-20deg); }
          }
          @keyframes rightPray {
            0%, 100% { transform: rotate(0deg); }
            50% { transform: rotate(20deg); }
          }
        `}
      </style>
    </svg>
  );
}