'use client';

import Link from 'next/link';

export function PrayerWidget() {
  return (
    <div className="hidden lg:block sticky top-24 h-[calc(100vh-8rem)] w-[200px] self-start mb-4">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 600" className="w-full h-full">
        <defs>
          <linearGradient id="bgGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#1e3a8a', stopOpacity: 1 }} />
            <stop offset="50%" style={{ stopColor: '#3b82f6', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#1e3a8a', stopOpacity: 1 }} />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <rect width="200" height="600" fill="url(#bgGradient)" />
        
        <path d="M0 300 L200 200" stroke="rgba(255,255,255,0.1)" strokeWidth="40" />
        <path d="M0 300 L200 400" stroke="rgba(255,255,255,0.1)" strokeWidth="40" />

        <text x="100" y="100" fontFamily="Arial, sans-serif" fontSize="24" 
              textAnchor="middle" fill="white" fontWeight="bold" filter="url(#glow)">
          SHARE
        </text>

        <text x="100" y="150" fontFamily="Arial, sans-serif" fontSize="28" 
              textAnchor="middle" fill="white" fontWeight="bold" filter="url(#glow)">
          YOUR
        </text>
        <text x="100" y="190" fontFamily="Arial, sans-serif" fontSize="28" 
              textAnchor="middle" fill="white" fontWeight="bold" filter="url(#glow)">
          PRAYER
        </text>
        <text x="100" y="230" fontFamily="Arial, sans-serif" fontSize="28" 
              textAnchor="middle" fill="white" fontWeight="bold" filter="url(#glow)">
          REQUEST
        </text>

        <line x1="50" y1="260" x2="150" y2="260" stroke="white" strokeWidth="2" opacity="0.5"/>

        <text x="100" y="320" fontFamily="Arial, sans-serif" fontSize="20" 
              textAnchor="middle" fill="white" opacity="0.9">
          We&apos;re Here
        </text>
        <text x="100" y="350" fontFamily="Arial, sans-serif" fontSize="20" 
              textAnchor="middle" fill="white" opacity="0.9">
          to Support
        </text>
        <text x="100" y="380" fontFamily="Arial, sans-serif" fontSize="20" 
              textAnchor="middle" fill="white" opacity="0.9">
          Your Journey
        </text>

        <Link href="/share-prayer-request">
          <rect x="30" y="420" width="140" height="45" rx="22.5" 
                fill="white" opacity="0.9" className="cursor-pointer hover:opacity-100"/>
          <text x="100" y="448" fontFamily="Arial, sans-serif" fontSize="18" 
                textAnchor="middle" fill="#1e3a8a" fontWeight="bold">
            POST NOW
          </text>
        </Link>

        <text x="100" y="520" fontFamily="Arial, sans-serif" fontSize="18" 
              textAnchor="middle" fill="white" opacity="0.8">
          Join Our
        </text>
        <text x="100" y="545" fontFamily="Arial, sans-serif" fontSize="18" 
              textAnchor="middle" fill="white" opacity="0.8">
          Prayer
        </text>
        <text x="100" y="570" fontFamily="Arial, sans-serif" fontSize="18" 
              textAnchor="middle" fill="white" opacity="0.8">
          Community
        </text>
      </svg>
    </div>
  );
} 