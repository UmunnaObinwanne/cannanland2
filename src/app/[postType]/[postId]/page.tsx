import { createClient } from "../../../../utils/supabase/server";
import { formatDistanceToNow } from "date-fns";
import { FaHeart, FaReply } from "react-icons/fa";
import { LikeButton } from "@/components/like-button";
import Image from "next/image";
import Link from "next/link";
import { createResponse } from "@/app/actions";
import { User } from '@supabase/supabase-js';
import { ReplyForm } from "@/components/reply-form";
import DOMPurify from 'isomorphic-dompurify';

// Add this configuration to disable static path generation
export const dynamic = 'force-dynamic';

// Define types for the response and post
interface Profile {
  username: string;
  avatar_url: string | null;
}

interface Response {
  id: string;
  content: string;
  created_at: string;
  profiles: Profile;
}

interface Post {
  id: string;
  title: string;
  content: string;
  created_at: string;
  likes_count: number;
  user_likes: string[];
  is_anonymous: boolean;
  profiles: Profile;
  responses?: Response[];
}

// Get the response table name correctly
const getResponseTable = (table: string | undefined): string => {
  switch (table) {
    case 'bible_studies':
      return 'biblestudy_responses';
    case 'prayer_requests':
      return 'prayer_responses';
    case 'testimonies':
      return 'testimony_responses';
    default:
      return '';
  }
};

export default async function PostDetailPage({
  params,
}: {
  params: { postType: string; postId: string };
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser() as { data: { user: User | null } };

  console.log('URL Params:', params);

  // Get the correct table name and base post type
  const tableMap = {
    'bible-studys': { table: 'bible_studies', type: 'bible_study' },
    'prayer-requests': { table: 'prayer_requests', type: 'prayer_request' },
    'testimonys': { table: 'testimonies', type: 'testimony' }
  }[params.postType];

  console.log('TableMap:', tableMap);

  if (!tableMap) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="rounded-lg bg-red-50 p-6">
          <h2 className="text-xl font-bold text-red-800">Invalid post type: {params.postType}</h2>
          <p className="mt-2 text-red-600">This post type does not exist.</p>
        </div>
      </div>
    );
  }

  const { table, type } = tableMap;
  const responseTable = getResponseTable(table);

  // Log the query details
  console.log('Query details:', {
    table,
    type,
    postId: params.postId,
    query: `
      *,
      profiles!${table}_profile_id_fkey(username, avatar_url),
      responses:${responseTable}(
        id,
        content,
        created_at,
        profiles(username, avatar_url)
      )
    `
  });

  // Fetch the post with its author's profile
  const { data: post, error } = await supabase
    .from(table)
    .select(`
      *,
      profiles!${table}_profile_id_fkey(username, avatar_url),
      responses:${responseTable}(
        id,
        content,
        created_at,
        profiles(username, avatar_url)
      )
    `)
    .eq('id', params.postId)
    .single();

  console.log('Query result:', { post, error });

  if (error || !post) {
    console.error('Error or no post:', { error, post });
    return <div>Post not found</div>;
  }

  const typedPost = post as unknown as Post;
  console.log(typedPost)
  console.log('this is post', post)

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      {/* Original Post */}
      <div className="rounded-lg bg-white p-6 shadow-md">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative h-12 w-12 overflow-hidden rounded-full">
              {typedPost.profiles.avatar_url ? (
                <Image
                  src={typedPost.profiles.avatar_url}
                  alt={typedPost.profiles.username}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gray-200">
                  {typedPost.profiles.username?.[0]?.toUpperCase()}
                </div>
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold">{typedPost.title}</h2>
              <p className="text-sm text-gray-500">
                Posted by {typedPost.is_anonymous ? 'Anonymous' : `@${typedPost.profiles.username}`}{' '}
                • {formatDistanceToNow(new Date(typedPost.created_at || Date.now()))} ago
              </p>
            </div>
          </div>
          <LikeButton
            postId={typedPost.id}
            postType={type}
            initialLikesCount={typedPost.likes_count || 0}
            initialIsLiked={typedPost.user_likes?.includes(user?.id || '')}
            isLoggedIn={!!user}
          />
        </div>
        <div className="prose prose-lg max-w-none">
          <div 
            className="whitespace-pre-wrap text-gray-700 [&>h1]:text-3xl [&>h1]:font-bold [&>h1]:mb-4 
              [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:mb-3 
              [&>h3]:text-xl [&>h3]:font-bold [&>h3]:mb-2
              [&>p]:mb-4 [&>ul]:list-disc [&>ul]:ml-4 [&>ol]:list-decimal [&>ol]:ml-4
              [&>blockquote]:border-l-4 [&>blockquote]:border-gray-300 [&>blockquote]:pl-4 [&>blockquote]:italic
              [&>pre]:bg-gray-100 [&>pre]:p-4 [&>pre]:rounded-lg [&>pre]:overflow-x-auto
              [&>code]:bg-gray-100 [&>code]:px-1 [&>code]:rounded"
            dangerouslySetInnerHTML={{ 
              __html: DOMPurify.sanitize(typedPost.content, {
                ALLOWED_TAGS: [
                  'p', 'br', 'b', 'i', 'em', 'strong', 'a', 'ul', 'ol', 'li',
                  'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'pre', 'code'
                ],
                ALLOWED_ATTR: ['href', 'target', 'rel']
              })
            }}
          />
        </div>
      </div>

      {/* Reply Section */}
      {user ? (
        <ReplyForm postId={params.postId} postType={params.postType} />
      ) : (
        <div className="mt-8 rounded-lg bg-gray-50 p-6 text-center">
          <p className="text-gray-600">
            Please{' '}
            <Link href="/sign-in" className="text-blue-500 hover:underline">
              sign in
            </Link>{' '}
            to reply to this post.
          </p>
        </div>
      )}

      {/* Responses */}
      <div className="mt-8 space-y-6">
        <h3 className="text-lg font-semibold">Responses ({typedPost.responses?.length || 0})</h3>
        {typedPost.responses?.map((response) => (
          <div key={response.id} className="rounded-lg bg-white p-6 shadow-md">
            <div className="mb-2 flex items-center gap-3">
              <div className="relative h-8 w-8 overflow-hidden rounded-full">
                {response.profiles.avatar_url ? (
                  <Image
                    src={response.profiles.avatar_url}
                    alt={response.profiles.username}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gray-200 text-sm">
                    {response.profiles.username?.[0]?.toUpperCase()}
                  </div>
                )}
              </div>
              <div>
                <p className="font-medium">@{response.profiles.username}</p>
                <p className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(response.created_at || Date.now()))} ago
                </p>
              </div>
            </div>
            <p className="whitespace-pre-wrap text-gray-700">{response.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
} 