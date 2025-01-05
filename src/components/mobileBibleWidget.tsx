'use client';

import Link from 'next/link';

export function BibleStudyWidgetMobile() {
  return (
    <div className="lg:hidden w-full h-[160px] relative cursor-pointer">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 160" className="w-full h-full">
        <defs>
          <linearGradient id="bibleGradientMobile" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: '#4c1d95', stopOpacity: 1 }} />
            <stop offset="50%" style={{ stopColor: '#7c3aed', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#4c1d95', stopOpacity: 1 }} />
          </linearGradient>
          <filter id="bibleGlowMobile">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <rect width="800" height="160" fill="url(#bibleGradientMobile)" />
        
        {/* Decorative lines */}
        <path d="M0 80 L800 40" stroke="rgba(255,255,255,0.1)" strokeWidth="40" />
        <path d="M0 120 L800 80" stroke="rgba(255,255,255,0.1)" strokeWidth="40" />

        {/* Left section - Main text */}
        <g transform="translate(40, 80)">
          <text 
            fontFamily="Arial, sans-serif" 
            fontSize="36"
            textAnchor="start" 
            fill="white" 
            fontWeight="bold" 
            filter="url(#bibleGlowMobile)"
          >
            Got Spiritual Questions?
          </text>
          <text 
            y="35"
            fontFamily="Arial, sans-serif" 
            fontSize="18"
            textAnchor="start" 
            fill="white" 
            opacity="0.9"
          >
            Share your thoughts with our community
          </text>
        </g>

        {/* Right section - CTA */}
        <g transform="translate(600, 80)">
          {/* Button background */}
          <rect 
            x="0" 
            y="-25" 
            width="160" 
            height="50" 
            rx="25"
            fill="white" 
            opacity="0.9" 
            className="cursor-pointer"
          />
          
          {/* Button text */}
          <text 
            textAnchor="middle" 
            fill="#4c1d95" 
            fontFamily="Arial, sans-serif" 
            fontSize="18" 
            fontWeight="bold"
            x="80"
            className="cursor-pointer"
          >
            START NOW
          </text>
        </g>
      </svg>
      
      {/* Make the entire widget clickable */}
      <Link 
        href="/share-spiritual-question"
        className="absolute inset-0"
        aria-label="Start sharing your spiritual questions now"
      >
        <span className="sr-only">Start Now</span>
      </Link>
    </div>
  );
}