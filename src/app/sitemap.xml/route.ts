import { createClient } from "@/lib/supabase/server"

export async function GET() {
  const supabase = await createClient()
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://cannanland.com'

  // Fetch all approved posts
  const [bibleStudies, prayerRequests, testimonies, questions] = await Promise.all([
    supabase
      .from('bible_studies')
      .select('slug, updated_at')
      .eq('moderation_status', 'approved'),
    supabase
      .from('prayer_requests')
      .select('slug, updated_at')
      .eq('moderation_status', 'approved'),
    supabase
      .from('testimonies')
      .select('slug, updated_at')
      .eq('moderation_status', 'approved'),
    supabase
      .from('spiritual_questions')
      .select('slug, updated_at')
      .eq('moderation_status', 'approved'),
  ])

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <!-- Static Pages -->
      ${generateUrlEntry(baseUrl, new Date().toISOString(), 1.0)}
      ${[
        '/bible-studies',
        '/prayer-requests',
        '/testimonies',
        '/spiritual-questions'
      ].map(route => 
        generateUrlEntry(`${baseUrl}${route}`, new Date().toISOString(), 0.8)
      ).join('')}

      <!-- Dynamic Post Pages -->
      ${[
        ...(bibleStudies.data || []).map(post => 
          generateUrlEntry(
            `${baseUrl}/bible-study/${post.slug}`,
            post.updated_at,
            0.6
          )
        ),
        ...(prayerRequests.data || []).map(post => 
          generateUrlEntry(
            `${baseUrl}/prayer-request/${post.slug}`,
            post.updated_at,
            0.6
          )
        ),
        ...(testimonies.data || []).map(post => 
          generateUrlEntry(
            `${baseUrl}/testimony/${post.slug}`,
            post.updated_at,
            0.6
          )
        ),
        ...(questions.data || []).map(post => 
          generateUrlEntry(
            `${baseUrl}/spiritual-question/${post.slug}`,
            post.updated_at,
            0.6
          )
        ),
      ].join('')}
    </urlset>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'max-age=0, s-maxage=3600', // Cache for 1 hour on CDN
    },
  })
}

function generateUrlEntry(url: string, lastmod: string, priority: number) {
  return `
    <url>
      <loc>${url}</loc>
      <lastmod>${lastmod}</lastmod>
      <changefreq>daily</changefreq>
      <priority>${priority}</priority>
    </url>
  `
}