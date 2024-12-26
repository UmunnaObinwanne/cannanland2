'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { formatDistanceToNow } from 'date-fns';
import DOMPurify from 'isomorphic-dompurify';
import { useRouter } from 'next/navigation';
import { FaTrash } from 'react-icons/fa';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { toast } from 'sonner';
import Link from 'next/link';
import { checkAdminStatus } from '@/app/actions';
import { formatPostType, slugifyPostType } from '@/utils/post-types';

type Post = {
  id: string;
  title: string;
  content: string;
  created_at: string;
  type: string;
  moderation_status: 'pending' | 'approved' | 'rejected';
  profiles: {
    username: string;
    email: string;
  };
  slug: string;
};

export default function AdminDashboard() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [expandedPosts, setExpandedPosts] = useState<Set<string>>(new Set());
  const [deletePost, setDeletePost] = useState<Post | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Verify admin status on component mount
    const verifyAdmin = async () => {
      try {
        await checkAdminStatus();
      } catch (error) {
        console.error('Admin verification failed:', error);
        router.push('/');
      }
    };
    verifyAdmin();
  }, [router]);

  const loadPosts = useCallback(async () => {
    setIsLoading(true);
    const supabase = createClient();

    try {
      // Fetch posts from all tables with moderation status
      const [bibleStudies, prayerRequests, testimonies, questions] = await Promise.all([
        supabase
          .from('bible_studies')
          .select(`
            id,
            title,
            content,
            created_at,
            moderation_status,
            profiles (
              username,
              email
            )
          `)
          .eq('moderation_status', filter)
          .order('created_at', { ascending: false }),
        supabase
          .from('prayer_requests')
          .select(`
            id,
            title,
            content,
            created_at,
            moderation_status,
            profiles (
              username,
              email
            )
          `)
          .eq('moderation_status', filter)
          .order('created_at', { ascending: false }),
        supabase
          .from('testimonies')
          .select(`
            id,
            title,
            content,
            created_at,
            moderation_status,
            profiles (
              username,
              email
            )
          `)
          .eq('moderation_status', filter)
          .order('created_at', { ascending: false }),
        supabase
          .from('spiritual_questions')
          .select(`
            id,
            title,
            content,
            created_at,
            moderation_status,
            profiles (
              username,
              email
            )
          `)
          .eq('moderation_status', filter)
          .order('created_at', { ascending: false }),
      ]);

      const allPosts = [
        ...(bibleStudies.data || []).map(post => ({ ...post, type: 'bible_study' })),
        ...(prayerRequests.data || []).map(post => ({ ...post, type: 'prayer_request' })),
        ...(testimonies.data || []).map(post => ({ ...post, type: 'testimony' })),
        ...(questions.data || []).map(post => ({ ...post, type: 'spiritual_question' }))
      ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      setPosts(allPosts);
    } catch (error) {
      console.error('Error loading posts:', error);
      toast.error('Failed to load posts');
    } finally {
      setIsLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  async function handleStatusUpdate(post: Post, newStatus: 'approved' | 'rejected' | 'pending') {
    const supabase = createClient();
    let table: string;

    // Map the post type to the corresponding table
    switch (post.type) {
      case 'bible_study':
        table = 'bible_studies';
        break;
      case 'prayer_request':
        table = 'prayer_requests';
        break;
      case 'testimony':
        table = 'testimonies';
        break;
      case 'spiritual_question':
        table = 'spiritual_questions';
        break;
      default:
        console.error(`Unknown post type: ${post.type}`);
        return; // Exit if the post type is invalid
    }

    // Update the post's moderation status in the appropriate table
    const { error } = await supabase
      .from(table)
      .update({ moderation_status: newStatus })
      .eq('id', post.id);

    // Handle response
    if (!error) {
      await loadPosts(); // Reload posts after successful update
      toast.success(
        `Post ${newStatus === 'approved' ? 'approved' : 'rejected'} successfully`,
        {
          description: `Post ${newStatus === 'approved' ? 'approved' : 'rejected'} successfully`,
        }
      );
    } else {
      console.error('Error updating status:', error);
      toast.error('Failed to update post status');
    }
  }

  const togglePostExpansion = (postId: string) => {
    setExpandedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  async function handleDelete(post: Post) {
    const supabase = createClient();
    let table: string;

    switch (post.type) {
      case 'bible_study':
        table = 'bible_studies';
        break;
      case 'prayer_request':
        table = 'prayer_requests';
        break;
      case 'testimony':
        table = 'testimonies';
        break;
      case 'spiritual_question':
        table = 'spiritual_questions';
        break;
      default:
        return;
    }

    const { error } = await supabase
      .from(table)
      .delete()
      .eq('id', post.id);

    if (!error) {
      await loadPosts();
      toast.success('Post deleted successfully');
    } else {
      console.error('Error deleting post:', error);
      toast.error('Failed to delete post');
    }
    setDeletePost(null);
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <div className="flex gap-2">
          {(['pending', 'approved', 'rejected'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`rounded-lg px-4 py-2 text-sm font-medium ${
                filter === status
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="rounded-lg bg-white p-6 shadow-md">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">
                    <Link
                      href={`/${slugifyPostType(post.type)}/${post.slug}`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      {post.title}
                    </Link>
                  </h2>
                  <p className="text-sm text-gray-500">
                    by {post.profiles.username} • {formatDistanceToNow(new Date(post.created_at))} ago
                  </p>
                  <span className="mt-1 inline-block rounded-full bg-gray-100 px-2 py-1 text-xs font-medium capitalize">
                    {post.type.replace('_', ' ')}
                  </span>
                </div>
                <div className="flex gap-2">
                  {filter === 'pending' ? (
                    <>
                      <button
                        onClick={() => handleStatusUpdate(post, 'approved')}
                        className="rounded-lg bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-600"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(post, 'rejected')}
                        className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
                      >
                        Reject
                      </button>
                    </>
                  ) : filter === 'approved' ? (
                    <>
                      <button
                        onClick={() => handleStatusUpdate(post, 'pending')}
                        className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
                      >
                        Move to Pending
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(post, 'rejected')}
                        className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
                      >
                        Reject
                      </button>
                    </>
                  ) : filter === 'rejected' && (
                    <>
                      <button
                        onClick={() => handleStatusUpdate(post, 'pending')}
                        className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
                      >
                        Move to Pending
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(post, 'approved')}
                        className="rounded-lg bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-600"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => setDeletePost(post)}
                        className="rounded-lg bg-red-100 p-2 text-red-600 hover:bg-red-200"
                      >
                        <FaTrash className="h-4 w-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
              <div className="prose prose-sm">
                <div
                  className={`${!expandedPosts.has(post.id) ? 'line-clamp-3' : ''}`}
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(post.content)
                  }}
                />
                <button
                  onClick={() => togglePostExpansion(post.id)}
                  className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                >
                  {expandedPosts.has(post.id) ? 'Show Less' : 'Show More'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deletePost}
        onClose={() => setDeletePost(null)}
        onConfirm={() => deletePost && handleDelete(deletePost)}
        title="Delete Post"
        message="Are you sure you want to delete this post? This action cannot be undone."
      />
    </div>
  );
} 