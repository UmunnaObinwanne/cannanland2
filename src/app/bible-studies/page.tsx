import { createClient } from "../../../utils/supabase/server";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { FaComments, FaHeart } from "react-icons/fa";
import { LikeButton } from "@/components/like-button";
import DOMPurify from 'isomorphic-dompurify';

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
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-8 text-2xl font-bold">Bible Studies</h1>
      <div className="space-y-4">
        {posts?.map((post) => (
          <div key={post.id} className="rounded-lg bg-white p-6 shadow-md">
            <Link href={`/bible-study/${post.id}`}>
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
            {/* ... rest of the post card */}
          </div>
        ))}
      </div>
    </div>
  );
} 