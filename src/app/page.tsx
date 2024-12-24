import { createClient } from "../../utils/supabase/server";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { LikeButton } from "@/components/like-button";
import DOMPurify from 'isomorphic-dompurify';
import { FaPrayingHands, FaBible, FaHeart, FaComments } from 'react-icons/fa';
import { PrayerWidget } from "@/components/prayer-widget";

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch all types of posts
  const [bibleStudies, prayerRequests, testimonies] = await Promise.all([
    supabase
      .from('bible_studies')
      .select('*, profiles(username)')
      .order('created_at', { ascending: false })
      .limit(5),
    supabase
      .from('prayer_requests')
      .select('*, profiles(username)')
      .order('created_at', { ascending: false })
      .limit(5),
    supabase
      .from('testimonies')
      .select('*, profiles(username)')
      .order('created_at', { ascending: false })
      .limit(5)
  ]);

  const allPosts = [
    ...(bibleStudies.data || []).map(post => ({ ...post, type: 'bible_study' })),
    ...(prayerRequests.data || []).map(post => ({ ...post, type: 'prayer_request' })),
    ...(testimonies.data || []).map(post => ({ ...post, type: 'testimony' }))
  ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return (
    <>
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
              Let's grow together in faith and support one another.
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
        <div className="container mx-auto max-w-4xl px-2 sm:px-4 py-4 sm:py-8">
          <div className="flex gap-8">
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
                        href={`/${post.type.replace('_', '-')}s/${post.id}`}
                        className="block space-y-1"
                      >
                        <h3 className="text-xl font-bold text-gray-900 transition-colors group-hover:text-blue-600">
                          {post.title}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <span>Posted by</span>
                            <span className="font-medium">
                              {post.is_anonymous ? 'Anonymous' : `@${post.profiles.username}`}
                            </span>
                          </span>
                          <span>•</span>
                          <span>{formatDistanceToNow(new Date(post.created_at))} ago</span>
                        </div>
                      </Link>
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
                            <span>{post.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
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
                            href={`/${post.type.replace('_', '-')}s/${post.id}`}
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

            {/* Side widget */}
            <PrayerWidget />
          </div>
        </div>
      </div>
    </>
  );
}
