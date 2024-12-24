import { createClient } from "../../utils/supabase/server";
import Link from "next/link";
import { formatDistanceToNow, format } from "date-fns";
import { FaComments, FaPrayingHands, FaBible, FaHeart, FaUsers, FaHandsHelping } from "react-icons/fa";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { getUserProfile } from "@/app/actions";
import { LikeButton } from "@/components/like-button";
import DOMPurify from 'isomorphic-dompurify';

async function getAllPosts() {
  const supabase = await createClient();
  
  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  
  // Fetch all types of posts
  const [bibleStudies, prayerRequests, testimonies] = await Promise.all([
    supabase
      .from('bible_studies')
      .select(`
        *,
        profiles!bible_studies_profile_id_fkey(username, avatar_url),
        user_likes
      `)
      .eq('moderation_status', 'approved')
      .order('created_at', { ascending: false }),
    supabase
      .from('prayer_requests')
      .select(`
        *,
        profiles!prayer_requests_profile_id_fkey(username, avatar_url),
        user_likes
      `)
      .eq('moderation_status', 'approved')
      .order('created_at', { ascending: false }),
    supabase
      .from('testimonies')
      .select(`
        *,
        profiles!testimonies_profile_id_fkey(username, avatar_url),
        user_likes
      `)
      .eq('moderation_status', 'approved')
      .order('created_at', { ascending: false })
  ]);

  // Add logging to check what data we're getting
  console.log('Bible Studies:', bibleStudies.data?.length);
  console.log('Prayer Requests:', prayerRequests.data?.length);
  console.log('Testimonies:', testimonies.data?.length);

  // Check for any errors
  if (bibleStudies.error) console.error('Bible Studies Error:', bibleStudies.error);
  if (prayerRequests.error) console.error('Prayer Requests Error:', prayerRequests.error);
  if (testimonies.error) console.error('Testimonies Error:', testimonies.error);

  // Combine and format all posts
  const allPosts = [
    ...(bibleStudies.data || []).map(post => ({
      ...post,
      type: 'bible_study',
      responseCount: post.likes_count || 0,
      color: 'purple'
    })),
    ...(prayerRequests.data || []).map(post => ({
      ...post,
      type: 'prayer_request',
      responseCount: post.prayer_count || 0,
      color: 'blue'
    })),
    ...(testimonies.data || []).map(post => ({
      ...post,
      type: 'testimony',
      responseCount: post.likes_count || 0,
      color: 'green'
    }))
  ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  // Log the final combined posts
  console.log('Total Posts:', allPosts.length);
  console.log('Posts by type:', {
    bibleStudies: allPosts.filter(p => p.type === 'bible_study').length,
    prayerRequests: allPosts.filter(p => p.type === 'prayer_request').length,
    testimonies: allPosts.filter(p => p.type === 'testimony').length
  });

  return { allPosts, userId: user?.id };
}

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { allPosts, userId } = await getAllPosts();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Decorative background pattern */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[300px] w-full bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 blur-[100px]" />
      </div>

      <div className="container mx-auto max-w-4xl px-2 sm:px-4 py-4 sm:py-8">
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
    </div>
  );
}
