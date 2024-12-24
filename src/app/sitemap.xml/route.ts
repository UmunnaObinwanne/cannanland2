import { createClient } from "../../../utils/supabase/server"

export async function GET() {
  const supabase = await createClient()
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL

  // Fetch all posts
  const [bibleStudies, prayerRequests, testimonies, questions] = await Promise.all([
    supabase.from('bible_studies').select('slug, updated_at'),
    supabase.from('prayer_requests').select('slug, updated_at'),
    supabase.from('testimonies').select('slug, updated_at'),
    supabase.from('spiritual_questions').select('slug, updated_at'),
  ])

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${generateUrlEntry(baseUrl, new Date().toISOString())}
      ${['/bible-studies', '/prayer-requests', '/testimonies', '/spiritual-questions']
        .map(route => generateUrlEntry(`${baseUrl}${route}`, new Date().toISOString()))
        .join('')}
      ${[
        ...(bibleStudies.data || []).map(post => 
          generateUrlEntry(`${baseUrl}/bible-study/${post.slug}`, post.updated_at)
        ),
        ...(prayerRequests.data || []).map(post => 
          generateUrlEntry(`${baseUrl}/prayer-request/${post.slug}`, post.updated_at)
        ),
        ...(testimonies.data || []).map(post => 
          generateUrlEntry(`${baseUrl}/testimony/${post.slug}`, post.updated_at)
        ),
        ...(questions.data || []).map(post => 
          generateUrlEntry(`${baseUrl}/spiritual-question/${post.slug}`, post.updated_at)
        ),
      ].join('')}
    </urlset>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'max-age=0, s-maxage=3600',
    },
  })
}

function generateUrlEntry(url: string, lastmod: string) {
  return `
    <url>
      <loc>${url}</loc>
      <lastmod>${lastmod}</lastmod>
      <changefreq>daily</changefreq>
      <priority>0.7</priority>
    </url>
  `
}