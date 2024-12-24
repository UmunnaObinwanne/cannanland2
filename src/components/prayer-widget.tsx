'use client';

import Link from 'next/link';

export function PrayerWidget() {
  return (
    <div className="hidden lg:block sticky top-4 w-[160px]">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 600" className="w-full">
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

        <rect width="160" height="600" fill="url(#bgGradient)" />
        
        <path d="M0 300 L160 200" stroke="rgba(255,255,255,0.1)" strokeWidth="40" />
        <path d="M0 300 L160 400" stroke="rgba(255,255,255,0.1)" strokeWidth="40" />

        <text x="80" y="100" fontFamily="Arial, sans-serif" fontSize="24" 
              textAnchor="middle" fill="white" fontWeight="bold" filter="url(#glow)">
          SHARE
        </text>

        <text x="80" y="150" fontFamily="Arial, sans-serif" fontSize="28" 
              textAnchor="middle" fill="white" fontWeight="bold" filter="url(#glow)">
          YOUR
        </text>
        <text x="80" y="190" fontFamily="Arial, sans-serif" fontSize="28" 
              textAnchor="middle" fill="white" fontWeight="bold" filter="url(#glow)">
          PRAYER
        </text>
        <text x="80" y="230" fontFamily="Arial, sans-serif" fontSize="28" 
              textAnchor="middle" fill="white" fontWeight="bold" filter="url(#glow)">
          REQUEST
        </text>

        <line x1="40" y1="260" x2="120" y2="260" stroke="white" strokeWidth="2" opacity="0.5"/>

        <text x="80" y="320" fontFamily="Arial, sans-serif" fontSize="20" 
              textAnchor="middle" fill="white" opacity="0.9">
          We're Here
        </text>
        <text x="80" y="350" fontFamily="Arial, sans-serif" fontSize="20" 
              textAnchor="middle" fill="white" opacity="0.9">
          to Support
        </text>
        <text x="80" y="380" fontFamily="Arial, sans-serif" fontSize="20" 
              textAnchor="middle" fill="white" opacity="0.9">
          Your Journey
        </text>

        <Link href="/share-prayer-request">
          <rect x="20" y="420" width="120" height="40" rx="20" 
                fill="white" opacity="0.9" className="cursor-pointer hover:opacity-100"/>
          <text x="80" y="445" fontFamily="Arial, sans-serif" fontSize="16" 
                textAnchor="middle" fill="#1e3a8a" fontWeight="bold">
            POST NOW
          </text>
        </Link>

        <text x="80" y="520" fontFamily="Arial, sans-serif" fontSize="16" 
              textAnchor="middle" fill="white" opacity="0.8">
          Join Our
        </text>
        <text x="80" y="545" fontFamily="Arial, sans-serif" fontSize="16" 
              textAnchor="middle" fill="white" opacity="0.8">
          Prayer
        </text>
        <text x="80" y="570" fontFamily="Arial, sans-serif" fontSize="16" 
              textAnchor="middle" fill="white" opacity="0.8">
          Community
        </text>
      </svg>
    </div>
  );
} 