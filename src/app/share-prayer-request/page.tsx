'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { LoadingModal } from '@/components/loading-modal';

// Import Quill dynamically to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

export default function SharePrayerRequest() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push('/sign-in');
        return;
      }

      const { error } = await supabase
        .from('prayer_requests')
        .insert({
          title,
          content,
          is_anonymous: isAnonymous,
          user_id: user.id,
          profile_id: user.id,
          moderation_status: 'pending'
        });

      if (error) throw error;

      await router.push('/prayer-requests');
      router.refresh();
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to submit. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      {/* Show loading modal when submitting */}
      {isSubmitting && <LoadingModal />}
      
      <div className="rounded-lg bg-white p-6 shadow-md">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">Share Prayer Request</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title Input */}
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
              placeholder="Enter the title of your prayer request"
            />
          </div>

          {/* Rich Text Editor */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Your Prayer Request
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

          {/* Anonymous Option */}
          <div className="flex items-center gap-2 py-8">
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

          {/* Submit Button - Updated with disabled styles */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`rounded-lg px-4 py-2 font-medium text-white transition-all
                ${isSubmitting 
                  ? 'cursor-not-allowed bg-gray-400'
                  : 'bg-blue-500 hover:bg-blue-600'
                }`}
            >
              Share Prayer Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 