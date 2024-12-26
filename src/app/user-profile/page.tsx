import { createClient } from "@/lib/supabase/server";
import { EditPostButton } from "@/components/edit-post-button";
import { formatDistanceToNow, format } from "date-fns";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import DOMPurify from 'isomorphic-dompurify';
import { FaBible, FaPray, FaHeart, FaQuestion } from 'react-icons/fa';

export default async function UserProfilePage() {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/sign-in');
  }

  // Get user's profile with all fields
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  // Fetch all post types
  const [bibleStudies, prayerRequests, testimonies, questions] = await Promise.all([
    supabase
      .from('bible_studies')
      .select('*, profiles(username)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false }),
    supabase
      .from('prayer_requests')
      .select('*, profiles(username)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false }),
    supabase
      .from('testimonies')
      .select('*, profiles(username)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false }),
    supabase
      .from('spiritual_questions')
      .select('*, profiles(username)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false }),
  ]);

  // Combine and sort all posts
  const allPosts = [
    ...(bibleStudies.data || []).map(post => ({ ...post, type: 'bible-study', icon: FaBible })),
    ...(prayerRequests.data || []).map(post => ({ ...post, type: 'prayer-request', icon: FaPray })),
    ...(testimonies.data || []).map(post => ({ ...post, type: 'testimony', icon: FaHeart })),
    ...(questions.data || []).map(post => ({ ...post, type: 'spiritual-question', icon: FaQuestion })),
  ].sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  // Format the joined date
  const joinedDate = profile?.created_at 
    ? format(new Date(profile.created_at), 'MMMM yyyy')
    : null;

  console.log(profile)

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="container mx-auto max-w-5xl px-4">
        {/* Profile Header */}
        <div className="mb-10 overflow-hidden rounded-xl bg-white shadow-lg">
          {/* Cover Image */}
          <div className="h-40 bg-gradient-to-r from-blue-500 to-purple-600 mb-10" />
          
          <div className="relative px-6 pb-6">
            {/* Profile Image and Info Container */}
            <div className="flex items-end gap-6 -mt-12 mb-4">
              {/* Profile Image */}
              <div className="relative h-24 w-24 overflow-hidden rounded-xl border-4 border-white bg-white shadow-lg flex-shrink-0">
                {profile?.avatar_url ? (
                  <Image
                    src={profile.avatar_url}
                    alt={profile.username || 'Profile'}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-100 to-blue-50 text-2xl font-bold text-blue-500">
                    {profile?.username?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}
                  </div>
                )}
              </div>

              {/* Profile Info */}
              <div className="flex flex-1 items-center justify-between">
                <div className="pt-10">
                  <h1 className="text-2xl font-bold text-gray-900">
                    {profile?.full_name || 'Anonymous User'}
                  </h1>
                  <div className="flex items-center gap-3 text-gray-600">
                    <span>@{profile?.username || 'username'}</span>
                    {joinedDate && (
                      <>
                        <span className="text-gray-300">•</span>
                        <span className="flex items-center gap-1 text-sm">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          Joined {joinedDate}
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <Link
                  href="/user-profile/edit"
                  className="group relative inline-flex items-center gap-2 overflow-hidden rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 px-4 py-2 text-sm font-medium text-white transition-all hover:from-blue-600 hover:to-blue-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                  Edit Profile
                  <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform group-hover:translate-x-full" />
                </Link>
              </div>
            </div>

            {/* Bio */}
            {profile?.bio && (
              <p className="mt-4 text-gray-600">{profile.bio}</p>
            )}

            {/* Stats */}
            <div className="mt-6 flex gap-6 border-t border-gray-100 pt-6">
              <div>
                <div className="text-2xl font-bold text-gray-900">{allPosts.length}</div>
                <div className="text-sm text-gray-500">Posts</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {allPosts.reduce((sum, post) => sum + (post.likes_count || 0), 0)}
                </div>
                <div className="text-sm text-gray-500">Total Likes</div>
              </div>
            </div>
          </div>
        </div>

        {/* Posts Section */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-900">Your Posts</h2>
          
          <div className="grid gap-6 md:grid-cols-2">
            {allPosts.map((post) => {
              const Icon = post.icon;
              return (
                <div key={post.id} 
                  className="group relative overflow-hidden rounded-xl bg-white p-6 shadow-md transition-all hover:shadow-lg"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                  
                  <div className="relative">
                    {/* Header */}
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="rounded-full bg-blue-100 p-2 text-blue-600">
                          <Icon className="h-4 w-4" />
                        </span>
                        <h3 className="font-semibold text-gray-900">{post.title}</h3>
                      </div>
                      {user.id === post.user_id && (
                        <EditPostButton
                          postType={post.type}
                          postId={post.id}
                          slug={post.slug}
                        />
                      )}
                    </div>

                    {/* Content Preview */}
                    <div 
                      className="mb-4 line-clamp-3 text-sm text-gray-600"
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(post.content)
                      }}
                    />

                    {/* Footer */}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">
                        {formatDistanceToNow(new Date(post.created_at))} ago
                        {post.is_anonymous && ' • Anonymous'}
                      </span>
                      <Link
                        href={`/${post.type}/${post.slug}`}
                        className="font-medium text-blue-600 hover:text-blue-700"
                      >
                        Read More →
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {allPosts.length === 0 && (
            <div className="rounded-xl bg-gray-50 p-12 text-center">
              <h3 className="mb-2 text-lg font-semibold text-gray-900">No Posts Yet</h3>
              <p className="mb-6 text-gray-600">Share your first post with the community</p>
              <Link
                href="/share-prayer-request"
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Create Your First Post
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
