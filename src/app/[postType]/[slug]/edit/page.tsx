'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { createClient } from '@/lib/supabase/client';
import { LoadingModal } from '@/components/loading-modal';
import { getTableName } from '@/utils/post-types';
import { toast } from 'sonner';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

interface EditPostPageProps {
  params: {
    postType: string;
    slug: string;
  };
}

export default function EditPostPage({ params }: EditPostPageProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [scriptureReference, setScriptureReference] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const loadPost = async () => {
      try {
        const supabase = createClient();
        const tableName = getTableName(params.postType);
        
        const { data: post, error } = await supabase
          .from(tableName)
          .select('*')
          .eq('slug', params.slug)
          .single();

        if (error) {
          toast.error('Error loading post');
          router.push('/user-profile');
          return;
        }

        // Verify ownership
        const { data: { user } } = await supabase.auth.getUser();
        if (!user || post.user_id !== user.id) {
          toast.error('Unauthorized');
          router.push('/user-profile');
          return;
        }

        setTitle(post.title);
        setContent(post.content);
        setIsAnonymous(post.is_anonymous || false);
        if (tableName === 'bible_studies') {
          setScriptureReference(post.scripture_reference || '');
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error:', error);
        toast.error('Error loading post');
        router.push('/user-profile');
      }
    };

    loadPost();
  }, [params.postType, params.slug, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const supabase = createClient();
      const tableName = getTableName(params.postType);

      const updateData = {
        title,
        content,
        is_anonymous: isAnonymous,
        updated_at: new Date().toISOString(),
        ...(tableName === 'bible_studies' ? { scripture_reference: scriptureReference } : {})
      };

      const { error } = await supabase
        .from(tableName)
        .update(updateData)
        .eq('slug', params.slug);

      if (error) throw error;

      toast.success('Post updated successfully');
      router.push('/user-profile');
      router.refresh();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to update post');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <LoadingModal message="Loading post..." />;
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="rounded-lg bg-white p-6 shadow-md">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">Edit Post</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="mb-2 block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-2"
              required
            />
          </div>

          {params.postType === 'bible-study' && (
            <div>
              <label htmlFor="scriptureReference" className="mb-2 block text-sm font-medium text-gray-700">
                Scripture Reference
              </label>
              <input
                type="text"
                id="scriptureReference"
                value={scriptureReference}
                onChange={(e) => setScriptureReference(e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-2"
                placeholder="e.g., John 3:16"
              />
            </div>
          )}

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Content
            </label>
            <div className="prose prose-sm min-h-[200px]">
              <ReactQuill
                theme="snow"
                value={content}
                onChange={setContent}
                className="h-48"
                modules={{
                  toolbar: [
                    [{ 'header': [1, 2, 3, false] }],
                    ['bold', 'italic', 'underline'],
                    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                    ['clean']
                  ]
                }}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="anonymous"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300"
            />
            <label htmlFor="anonymous" className="text-sm text-gray-600">
              Post anonymously
            </label>
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className={`rounded-lg px-4 py-2 font-medium text-white transition-all
                ${isSaving 
                  ? 'cursor-not-allowed bg-gray-400'
                  : 'bg-blue-500 hover:bg-blue-600'
                }`}
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 