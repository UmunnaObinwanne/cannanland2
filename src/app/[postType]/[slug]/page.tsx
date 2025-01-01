import { createClient } from "@/lib/supabase/server";
import { format } from "date-fns";
import { FaHeart, FaReply } from "react-icons/fa";
import { LikeButton } from "@/components/like-button";
import Image from "next/image";
import Link from "next/link";
import { createResponse } from "@/app/actions";
import { User } from '@supabase/supabase-js';
import { ReplyForm } from "@/components/reply-form";
import DOMPurify from 'isomorphic-dompurify';
import { Metadata } from 'next'
import { baseMetadata } from '@/config/metadata'
import { generatePostStructuredData } from "@/utils/structured-data";
import { ResponsesSection } from "@/components/responses-section";

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
  slug: string;
}

interface TableConfig {
  table: string;
type: 'bible_study' | 'prayer_request' | 'testimony' | 'spiritual_question';  
  responseTable: string;
}

// Define the table mapping as a regular object
const TABLE_MAP: Record<string, TableConfig> = {
  'bible-study': {
    table: 'bible_studies',
    type: 'bible_study',
    responseTable: 'biblestudy_responses'
  },
  'prayer-request': {
    table: 'prayer_requests',
    type: 'prayer_request',
    responseTable: 'prayer_responses'
  },
  'testimony': {
    table: 'testimonies',
    type: 'testimony',
    responseTable: 'testimony_responses'
  }, 
  'spiritual-question': {
    table: 'spiritual_questions',
    type: 'spiritual_question',
    responseTable: 'spiritual_question_responses'
  }
};

export async function generateMetadata({ params }: {
  params: { postType: string; slug: string }
}): Promise<Metadata> {
  const supabase = await createClient();
  
  // Get the post data with all fields
  const { data: post } = await supabase
    .from(TABLE_MAP[params.postType]?.table)
    .select('*, profiles(username)')  // Select all fields plus profile
    .eq('slug', params.slug)
    .single();

  if (!post) {
    return baseMetadata;
  }

  const title = `${post.title} | ${params.postType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}`;
  const description = post.content.substring(0, 155) + '...';

  return {
    ...baseMetadata,
    title,
    description,
    openGraph: {
      ...baseMetadata.openGraph,
      title,
      description,
      type: 'article',
      publishedTime: post.created_at,
      modifiedTime: post.updated_at,
      authors: post.is_anonymous ? ['Anonymous'] : [`@${post.profiles.username}`],
    },
    twitter: {
      ...baseMetadata.twitter,
      title,
      description,
    }
  }
}

export default async function PostDetailPage({
  params,
}: {
  params: { postType: string; slug: string };
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser() as { data: { user: User | null } };

  console.log('URL Params:', params);

  // Get the table configuration
  const tableConfig = TABLE_MAP[params.postType];

  if (!tableConfig) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="rounded-lg bg-red-50 p-6">
          <h2 className="text-xl font-bold text-red-800">Invalid post type: {params.postType}</h2>
          <p className="mt-2 text-red-600">This post type does not exist.</p>
        </div>
      </div>
    );
  }

  const { table, type, responseTable } = tableConfig;
  console.log('type from params', type)

  // Log the query details
  console.log('Query details:', {
    table,
    type,
    slug: params.slug,
    query: `
      *,
      profiles!${table}_profile_id_fkey(username, avatar_url),
  responses:${responseTable}!${responseTable}_${type}_id_fkey(
   id,
   content, 
   created_at,
   is_ai,
   username,
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
   responses:${responseTable}!${responseTable}_${type}_id_fkey(
     id,
     content,
     created_at,
     is_ai,
     profiles(username, avatar_url)
   )
 `)
 .eq('slug', params.slug)
 .single();

  console.log('Query result:', { post, error });

  if (error || !post) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="rounded-lg bg-red-50 p-6">
          <h2 className="text-xl font-bold text-red-800">Post not found</h2>
          <p className="mt-2 text-red-600">The requested post could not be found.</p>
        </div>
      </div>
    );
  }

  const typedPost = post as unknown as Post;

  // Generate the full URL for the current page
  const url = `${process.env.NEXT_PUBLIC_APP_URL}/${params.postType}/${params.slug}`;

  // Generate structured data
  const structuredData = generatePostStructuredData({
    post: typedPost,
    url,
    type: params.postType,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
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
                • {format(new Date(typedPost.created_at || Date.now()), 'MMM d')}
              </p>
            </div>
          </div>
          <LikeButton
            postId={typedPost.slug}
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
        <ReplyForm postId={typedPost.slug} postType={params.postType} />
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

      {/* Responses Section */}
      <ResponsesSection responses={typedPost.responses} />
    </div>
    </>
  );
}