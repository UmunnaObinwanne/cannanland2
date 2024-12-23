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
    <>
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-b from-blue-900 to-blue-800">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <Image
            src="/images/pattern.png"
            alt="Background pattern"
            fill
            className="object-cover"
          />
        </div>
        
        <div className="container mx-auto max-w-7xl px-4 py-16">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-8">
            {/* Hero Content */}
            <div className="relative z-10 flex flex-col justify-center">
              <h1 className="mb-4 text-4xl font-bold tracking-tight text-white lg:text-5xl">
                Welcome to Our Christian Community
              </h1>
              <p className="mb-8 text-lg text-blue-100">
                Join thousands of believers sharing their faith journey through Bible studies, 
                prayer requests, and testimonies.
              </p>
              
              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="rounded-lg bg-white/10 p-4 text-center backdrop-blur-sm">
                  <FaUsers className="mx-auto mb-2 text-2xl text-blue-300" />
                  <div className="text-2xl font-bold text-white">1.2k+</div>
                  <div className="text-sm text-blue-200">Members</div>
                </div>
                <div className="rounded-lg bg-white/10 p-4 text-center backdrop-blur-sm">
                  <FaPrayingHands className="mx-auto mb-2 text-2xl text-blue-300" />
                  <div className="text-2xl font-bold text-white">3k+</div>
                  <div className="text-sm text-blue-200">Prayers</div>
                </div>
                <div className="rounded-lg bg-white/10 p-4 text-center backdrop-blur-sm">
                  <FaHandsHelping className="mx-auto mb-2 text-2xl text-blue-300" />
                  <div className="text-2xl font-bold text-white">5k+</div>
                  <div className="text-sm text-blue-200">Testimonies</div>
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative lg:mt-0">
              <div className="relative z-10 overflow-hidden rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
                <Image
                  src="/images/hero-image.jpg"
                  alt="Community"
                    height={500}
                  width={500}
                  priority
                
                  className="rounded-xl"
                />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-blue-900/50 to-transparent" />
                <div className="absolute bottom-8 left-8 right-8">
                  <div className="mb-2 text-sm font-medium text-blue-200">Featured Scripture</div>
                  <div className="text-lg font-medium text-white">
                    "For where two or three gather in my name, there am I with them."
                  </div>
                  <div className="mt-1 text-sm text-blue-200">Matthew 18:20</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Forum Section */}
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto max-w-4xl px-4">
          {/* Section Header */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Recent Discussions</h2>
            <p className="text-gray-600">Join the conversation and connect with fellow believers</p>
          </div>

          {/* Forum Posts */}
          <div className="space-y-4">
            {allPosts.map((post) => (
              <div 
                key={`${post.type}-${post.id}`} 
                className="group relative overflow-hidden rounded-lg bg-white shadow-sm transition-all hover:shadow-md"
              >
                {/* Category Indicator */}
                <div 
                  className={`absolute left-0 top-0 h-full w-1 bg-${post.color}-500`}
                  aria-hidden="true"
                />
                
                <div className="p-6 pl-8">
                  {/* Post Header */}
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {/* Author Avatar */}
                      <div className="relative h-10 w-10 overflow-hidden rounded-full">
                        {post.profiles.avatar_url ? (
                          <Image
                            src={post.profiles.avatar_url}
                            alt={post.profiles.username}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className={`flex h-full w-full items-center justify-center bg-${post.color}-100 text-${post.color}-600`}>
                            {post.profiles.username?.[0]?.toUpperCase()}
                          </div>
                        )}
                      </div>
                      
                      {/* Post Meta */}
                      <div>
                        <span className="flex text-sm font-medium text-gray-900">
                          {post.is_anonymous ? 'Anonymous' : `@${post.profiles.username}`}
                        </span>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span>{format(new Date(post.created_at), 'MMM d')}</span>
                        </div>
                      </div>
                    </div>

                    {/* Post Stats */}
                    <div className="flex items-center gap-4">
                      <div className={`flex items-center gap-1 rounded-full bg-${post.color}-50 px-3 py-1 text-sm text-${post.color}-700`}>
                        {post.type === 'bible_study' && <FaBible className="text-xs" />}
                        {post.type === 'prayer_request' && <FaPrayingHands className="text-xs" />}
                        {post.type === 'testimony' && <FaHeart className="text-xs" />}
                        <span className="text-xs font-medium capitalize">
                          {post.type.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <FaComments className="text-gray-400" />
                        <span>{post.responseCount}</span>
                      </div>
                    </div>
                  </div>

                  {/* Post Content */}
                  <Link 
                    href={`/${post.type.replace('_', '-')}s/${post.id}`}
                    className="block space-y-2"
                  >
                    <h3 className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors pb-2 border-b border-dashed border-gray-200">
                      {post.title}
                    </h3>
                    <div className="prose prose-sm line-clamp-2 text-gray-600">
                      <div
                        dangerouslySetInnerHTML={{
                          __html: DOMPurify.sanitize(post.content, {
                            ALLOWED_TAGS: [
                              'p', 'br', 'b', 'i', 'em', 'strong', 'a',
                              'h1', 'h2', 'h3', 'h4', 'h5', 'h6'
                            ],
                            ALLOWED_ATTR: ['href', 'target', 'rel']
                          })
                        }}
                      />
                    </div>
                  </Link>

                  {/* Post Actions */}
                  <div className="mt-4 flex items-center gap-4 border-t border-gray-100 pt-4">
                    <LikeButton
                      postId={post.id}
                      postType={post.type}
                      initialLikesCount={post.likes_count || 0}
                      initialIsLiked={post.user_likes?.includes(userId)}
                      isLoggedIn={!!user}
                    />

                    {user ? (
                      <Link
                        href={`/${post.type.replace('_', '-')}s/${post.id}`}
                        className="flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
                      >
                        <FaComments className="text-sm text-gray-400" />
                        <span>Reply</span>
                      </Link>
                    ) : (
                      <Link
                        href="/sign-in"
                        className="flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-50"
                      >
                        <FaComments className="text-sm text-gray-400" />
                        <span>Sign in to reply</span>
                      </Link>
                    )}

                    {/* Category Badge - Moved to the right */}
                    <div className="ml-auto">
                      <div className={`flex items-center gap-1 rounded-full bg-${post.color}-50 px-3 py-1 text-sm text-${post.color}-700`}>
                        {post.type === 'bible_study' && <FaBible className="text-xs" />}
                        {post.type === 'prayer_request' && <FaPrayingHands className="text-xs" />}
                        {post.type === 'testimony' && <FaHeart className="text-xs" />}
                        <span className="text-xs font-medium capitalize">
                          {post.type.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
