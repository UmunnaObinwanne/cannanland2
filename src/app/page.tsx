import { createClient } from "@/lib/supabase/server";
import { formatDistanceToNow } from "date-fns";
import { format } from "date-fns"
import Link from "next/link";
import { LikeButton } from "@/components/like-button";
import DOMPurify from 'isomorphic-dompurify';
import { FaPrayingHands, FaBible, FaHeart, FaComments } from 'react-icons/fa';
import { PrayerWidget } from "@/components/prayer-widget";
import { BibleStudyWidget } from "@/components/bible-study-widget";
import { formatPostType, slugifyPostType } from '@/utils/post-types';
import { Metadata } from 'next'
import { baseMetadata } from '@/config/metadata'

export const metadata: Metadata = {
  ...baseMetadata,
  title: 'Home',
  description: 'Join our Christian community to share and receive prayer requests, study the Bible together, and grow in faith.',
  openGraph: {
    ...baseMetadata.openGraph,
    title: 'Home | Cannanland',
    description: 'Join our Christian community to share and receive prayer requests, study the Bible together, and grow in faith.',
  }
}

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch all types of posts with correct profile relationships
  const [bibleStudies, prayerRequests, testimonies, spiritualQuestions] = await Promise.all([
    supabase
      .from('bible_studies')
      .select(`
        *,
        profiles!bible_studies_profile_id_fkey(username)
      `)
      .eq('moderation_status', 'approved')
      .order('created_at', { ascending: false }),
    supabase
      .from('prayer_requests')
      .select(`
        *,
        profiles!prayer_requests_profile_id_fkey(username)
      `)
      .eq('moderation_status', 'approved')
      .order('created_at', { ascending: false }),
    supabase
      .from('testimonies')
      .select(`
        *,
        profiles!testimonies_profile_id_fkey(username)
      `)
      .eq('moderation_status', 'approved')
      .order('created_at', { ascending: false }),
    supabase
      .from('spiritual_questions')
      .select(`
        *,
        profiles!spiritual_questions_profile_id_fkey(username)
      `)
      .eq('moderation_status', 'approved')
      .order('created_at', { ascending: false })
  ]);

  const allPosts = [
    ...(bibleStudies.data || []).map(post => ({ ...post, type: 'bible_study' })),
    ...(prayerRequests.data || []).map(post => ({ ...post, type: 'prayer_request' })),
    ...(testimonies.data || []).map(post => ({ ...post, type: 'testimony' })),
    ...(spiritualQuestions.data || []).map(post => ({ ...post, type: 'spiritual_question' }))
  ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  // Generate structured data for the homepage
  const websiteStructured = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Cannanland",
    description: "A Christian community platform for sharing prayer requests, Bible studies, testimonies, and spiritual questions.",
    url: process.env.NEXT_PUBLIC_APP_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${process.env.NEXT_PUBLIC_APP_URL}/search?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };

  const organizationStructured = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Cannanland",
    url: process.env.NEXT_PUBLIC_APP_URL,
    logo: `${process.env.NEXT_PUBLIC_APP_URL}/logo.png`,
    sameAs: [
      "https://twitter.com/cannanland",
      "https://facebook.com/cannanland",
      // Add other social media URLs
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([websiteStructured, organizationStructured]),
        }}
      />
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-b from-blue-900 to-blue-800 py-16 sm:py-24">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-800/90" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
              Welcome to Cannanland
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-blue-100">
              Join our community of believers sharing prayer requests, bible studies, and testimonies.
              Let us grow together in faith and support one another.
            </p>
            <div className="mx-auto mt-10 max-w-sm space-y-4">
              <Link
                href="/share-prayer-request"
                className="block rounded-lg bg-white px-4 py-2 text-center text-sm font-semibold text-blue-900 shadow-sm hover:bg-blue-50"
              >
                Share Your Prayer Request
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto max-w-6xl px-2 sm:px-4 py-4 sm:py-8">
          <div className="flex gap-8">
            {/* Left Widget */}
            <BibleStudyWidget />

            {/* Main content */}
            <div className="flex-1">
              <div className="space-y-8">
                {allPosts?.map((post) => (
                  <div 
                    key={post.id} 
                    className="group relative overflow-hidden rounded-xl border border-gray-100 bg-white/80 backdrop-blur-sm transition-all hover:shadow-lg hover:shadow-gray-200/50"
                  >
                    {/* Subtle gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

                    {/* Header Section with Accent Color */}
                    <div className={`relative border-l-4 px-6 py-4 
                      ${post.type === 'bible_study' 
                        ? 'border-purple-500 bg-purple-50/70' 
                        : post.type === 'prayer_request'
                        ? 'border-blue-500 bg-blue-50/70'
                        : 'border-green-500 bg-green-50/70'
                      }`}
                    >
                      <Link 
                        href={`/${slugifyPostType(post.type)}/${post.slug}`}
                        className="block space-y-1"
                      >
                        <h2 className="text-xl font-bold text-gray-900 transition-colors group-hover:text-blue-600">
                          {post.title}
                        </h2>
                         </Link>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <span>Posted by</span>
                            <span className="font-medium">
                              {post.is_anonymous ? 'Anonymous' : `@${post.profiles.username}`}
                            </span>
                          </span>
                          <span>•</span>
                          <span>{format(new Date(post.created_at), 'MMM d')}</span>
                        </div>
                     
                    </div>

                    {/* Content Section */}
                    <div className="relative p-6">
                      <div 
                        className="prose prose-sm mb-4 line-clamp-2 text-gray-600"
                        dangerouslySetInnerHTML={{
                          __html: DOMPurify.sanitize(post.content)
                        }}
                      />

                      {/* Footer Section */}
                      <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
                        <div className="flex items-center gap-4">
                          <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium transition-colors
                            ${post.type === 'bible_study' 
                              ? 'bg-purple-100 text-purple-800 hover:bg-purple-200' 
                              : post.type === 'prayer_request'
                              ? 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                              : 'bg-green-100 text-green-800 hover:bg-green-200'
                            }`}
                          >
                            {post.type === 'bible_study' && <FaBible className="text-xs" />}
                            {post.type === 'prayer_request' && <FaPrayingHands className="text-xs" />}
                            {post.type === 'testimony' && <FaHeart className="text-xs" />}
                            <span>{post.type.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}</span>
                          </span>
                          <LikeButton
                            postId={post.id}
                            postType={post.type}
                            initialLikesCount={post.likes_count || 0}
                            initialIsLiked={post.user_likes?.includes(user?.id || '')}
                            isLoggedIn={!!user}
                          />
                        </div>

                        {user ? (
                          <Link
                            href={`/${slugifyPostType(post.type)}/${post.slug}`}
                            className="flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium text-gray-600 transition-all hover:bg-gray-50"
                          >
                            <FaComments className="text-sm text-gray-400" />
                            <span>Reply</span>
                          </Link>
                        ) : (
                          <Link
                            href="/sign-in"
                            className="text-sm text-blue-600 hover:text-blue-800"
                          >
                            Sign in to reply
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Widget */}
            <PrayerWidget />
          </div>
        </div>
      </div>
    </>
  );
}
