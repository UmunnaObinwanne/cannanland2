import { createClient } from "@/lib/supabase/server"
import { formatISO } from "date-fns"

export async function GET() {
  const supabase = await createClient()

  // Fetch all posts from different tables
  const [bibleStudies, prayerRequests, testimonies, questions] = await Promise.all([
    supabase.from('bible_studies').select('slug, updated_at, created_at'),
    supabase.from('prayer_requests').select('slug, updated_at, created_at'),
    supabase.from('testimonies').select('slug, updated_at, created_at'),
    supabase.from('spiritual_questions').select('slug, updated_at, created_at')
  ])

  // Format date to ISO 8601 format
  const formatDate = (date: string | null) => {
    if (!date) return formatISO(new Date())
    return formatISO(new Date(date))
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <url>
        <loc>${process.env.NEXT_PUBLIC_APP_URL}</loc>
        <lastmod>${formatDate(new Date().toISOString())}</lastmod>
        <priority>1.0</priority>
      </url>
      ${bibleStudies.data?.map(post => `
        <url>
          <loc>${process.env.NEXT_PUBLIC_APP_URL}/bible-study/${post.slug}</loc>
          <lastmod>${formatDate(post.updated_at || post.created_at)}</lastmod>
          <priority>0.8</priority>
        </url>
      `).join('')}
      ${prayerRequests.data?.map(post => `
        <url>
          <loc>${process.env.NEXT_PUBLIC_APP_URL}/prayer-request/${post.slug}</loc>
          <lastmod>${formatDate(post.updated_at || post.created_at)}</lastmod>
          <priority>0.8</priority>
        </url>
      `).join('')}
      ${testimonies.data?.map(post => `
        <url>
          <loc>${process.env.NEXT_PUBLIC_APP_URL}/testimony/${post.slug}</loc>
          <lastmod>${formatDate(post.updated_at || post.created_at)}</lastmod>
          <priority>0.8</priority>
        </url>
      `).join('')}
      ${questions.data?.map(post => `
        <url>
          <loc>${process.env.NEXT_PUBLIC_APP_URL}/spiritual-question/${post.slug}</loc>
          <lastmod>${formatDate(post.updated_at || post.created_at)}</lastmod>
          <priority>0.8</priority>
        </url>
      `).join('')}
    </urlset>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'max-age=0, s-maxage=3600',
    },
  })
}