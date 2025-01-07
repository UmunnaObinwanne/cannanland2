import { base_url } from '@/lib/utils'

export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/*', '/admin/*'],
    },
    sitemap: `${base_url}/sitemap.xml`,
  }
}