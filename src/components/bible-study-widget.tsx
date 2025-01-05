'use client';

import Link from 'next/link';

export function BibleStudyWidget() {
  return (
    <div className="lg:sticky lg:top-24 h-[calc(100vh-6rem)] w-full lg:w-[200px] self-start relative">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 600" className="w-full h-full">
        <defs>
          <linearGradient id="bibleGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#4c1d95', stopOpacity: 1 }} />
            <stop offset="50%" style={{ stopColor: '#7c3aed', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#4c1d95', stopOpacity: 1 }} />
          </linearGradient>
          <filter id="bibleGlow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <rect width="200" height="600" fill="url(#bibleGradient)" />
        
        <path d="M0 300 L200 200" stroke="rgba(255,255,255,0.1)" strokeWidth="40" />
        <path d="M0 300 L200 400" stroke="rgba(255,255,255,0.1)" strokeWidth="40" />

        <text x="100" y="100" fontFamily="Arial, sans-serif" fontSize="40" 
              textAnchor="middle" fill="white" fontWeight="bold" filter="url(#bibleGlow)">
          Got
        </text>

        <text x="100" y="150" fontFamily="Arial, sans-serif" fontSize="32" 
              textAnchor="middle" fill="white" fontWeight="bold" filter="url(#bibleGlow)">
          SPIRITUAL
        </text>
        <text x="100" y="190" fontFamily="Arial, sans-serif" fontSize="30" 
              textAnchor="middle" fill="white" fontWeight="bold" filter="url(#bibleGlow)">
          QUESTIONS
        </text>
        <text x="100" y="240" fontFamily="Arial, sans-serif" fontSize="50" 
              textAnchor="middle" fill="white" fontWeight="bold" filter="url(#bibleGlow)">
          ?
        </text>

        <line x1="50" y1="260" x2="150" y2="260" stroke="white" strokeWidth="2" opacity="0.5"/>

        <text x="100" y="320" fontFamily="Arial, sans-serif" fontSize="24" 
              textAnchor="middle" fill="white" opacity="0.9">
          Share Your
        </text>
        <text x="100" y="350" fontFamily="Arial, sans-serif" fontSize="24" 
              textAnchor="middle" fill="white" opacity="0.9">
          Questions &
        </text>
        <text x="100" y="380" fontFamily="Arial, sans-serif" fontSize="24" 
              textAnchor="middle" fill="white" opacity="0.9">
          Insights
        </text>

        <rect x="30" y="420" width="140" height="45" rx="22.5" 
              fill="white" opacity="0.9" className="cursor-pointer"/>
              
        <text x="100" y="448" fontFamily="Arial, sans-serif" fontSize="18" 
              textAnchor="middle" fill="#4c1d95" fontWeight="bold"
              className="cursor-pointer">
          START NOW
        </text>

        <text x="100" y="520" fontFamily="Arial, sans-serif" fontSize="18" 
              textAnchor="middle" fill="white" opacity="0.8">
          Join Our
        </text>
        <text x="100" y="545" fontFamily="Arial, sans-serif" fontSize="18" 
              textAnchor="middle" fill="white" opacity="0.8">
          Bible Study
        </text>
        <text x="100" y="570" fontFamily="Arial, sans-serif" fontSize="18" 
              textAnchor="middle" fill="white" opacity="0.8">
          Community
        </text>
      </svg>
      
      {/* Overlay the Link component to cover the entire widget */}
      <Link 
        href="/share-spiritual-question"
        className="absolute inset-0 cursor-pointer"
        aria-label="Start sharing your spiritual questions now"
      >
        <span className="sr-only">Start Now</span>
      </Link>
    </div>
  );
}