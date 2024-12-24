import { createClient } from "../../../utils/supabase/server";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { LikeButton } from "@/components/like-button";
import DOMPurify from 'isomorphic-dompurify';

export default async function PrayerRequestsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: posts, error } = await supabase
    .from('prayer_requests')
    .select(`
      *,
      profiles!prayer_requests_profile_id_fkey(username, avatar_url),
      user_likes
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching prayer requests:', error);
    return <div>Error loading prayer requests</div>;
  }

  return (
    <div className="container mx-auto max-w-4xl px-2 sm:px-4 py-4 sm:py-8">
      <h1 className="mb-4 sm:mb-8 text-2xl font-bold">Prayer Requests</h1>
      <div className="space-y-4">
        {posts?.map((post) => (
          <div key={post.id} className="rounded-lg bg-white p-6 shadow-md">
            <Link href={`/prayer-request/${post.id}`}>
              <h2 className="mb-2 text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
                {post.title}
              </h2>
            </Link>
            <div 
              className="prose prose-sm mb-4 line-clamp-2"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(post.content)
              }}
            />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">
                  Posted by {post.profiles.username} • {formatDistanceToNow(new Date(post.created_at))} ago
                </span>
              </div>
              <LikeButton
                postId={post.id}
                postType="prayer_request"
                initialLikesCount={post.likes_count || 0}
                initialIsLiked={post.user_likes?.includes(user?.id)}
                isLoggedIn={!!user}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 