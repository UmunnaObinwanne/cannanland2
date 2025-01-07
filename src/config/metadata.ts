import { Metadata } from 'next'
import { base_url } from '@/lib/utils'

const siteConfig = {
  name: 'Cannanland',
  description: 'A Christian community platform for sharing prayer requests, Bible studies, testimonies, and spiritual questions.',
  url: base_url,
  ogImage: '/og-image.jpg',
}

export const baseMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    'Christian community',
    'Christian forum',
    'Prayer forum',
    'Prayer requests',
    'Bible study',
    'Testimonies',
    'Spiritual questions',
    'Faith community',
    'Christian fellowship',
    'Online church',
  ],
  authors: [{ name: 'Cannanland' }],
  creator: 'Cannanland',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: '@cannanland',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico'
  },
  verification: {
    google: 'BpG6TiWALZCQvUimoLjdpU3RhdEc5dJtvvVap1iV6Bs',
  },
  alternates: {
    canonical: siteConfig.url,
  },
}

export default siteConfig