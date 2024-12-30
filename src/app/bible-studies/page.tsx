import { createClient } from "@/lib/supabase/server";
import { format } from "date-fns";
import Link from "next/link";
import { LikeButton } from "@/components/like-button";
import DOMPurify from 'isomorphic-dompurify';
import { FaBible, FaComments } from 'react-icons/fa';
import { sanitizeHtml } from '@/lib/utils';

export default async function BibleStudiesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: posts, error } = await supabase
    .from('bible_studies')
    .select(`
      *,
      profiles!bible_studies_profile_id_fkey(username, avatar_url),
      user_likes
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching bible studies:', error);
    return <div>Error loading bible studies</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto max-w-4xl px-2 sm:px-4 py-4 sm:py-8">
        <h1 className="mb-4 sm:mb-8 text-2xl font-bold">Bible Studies</h1>
        <div className="space-y-8">
          {posts?.map((post) => (
            <div 
              key={post.id} 
              className="group relative overflow-hidden rounded-xl border border-gray-100 bg-white/80 backdrop-blur-sm transition-all hover:shadow-lg hover:shadow-gray-200/50"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

              <div className="relative border-l-4 border-purple-500 bg-purple-50/70 px-6 py-4">
                <Link 
                  href={`/bible-study/${post.slug}`}
                  className="block space-y-1"
                >
                  <h3 className="text-xl font-bold text-gray-900 transition-colors group-hover:text-purple-600">
                    {post.title}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <span>Posted by</span>
                      <span className="font-medium">@{post.profiles.username}</span>
                    </span>
                    <span>•</span>
                    <span>{format(new Date(post.created_at), 'MMM d')}</span>
                  </div>
                </Link>
              </div>

              <div className="relative p-6">
                <div 
                  className="prose prose-sm mb-4 line-clamp-2 text-gray-600"
                  dangerouslySetInnerHTML={{
                    __html: sanitizeHtml(post.content)
                  }}
                />

                <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
                  <div className="flex items-center gap-4">
                    <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-800 hover:bg-purple-200">
                      <FaBible className="text-xs" />
                      <span>Bible Study</span>
                    </span>
                    <LikeButton
                      postId={post.id}
                      postType="bible_study"
                      initialLikesCount={post.likes_count || 0}
                      initialIsLiked={post.user_likes?.includes(user?.id)}
                      isLoggedIn={!!user}
                    />
                  </div>

                  {user ? (
                    <Link
                      href={`/bible-study/${post.id}`}
                      className="flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
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