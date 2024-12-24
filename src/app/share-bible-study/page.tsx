'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { LoadingModal } from '@/components/loading-modal';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

export default function ShareBibleStudy() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [scriptureReference, setScriptureReference] = useState('');
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
        .from('bible_studies')
        .insert({
          title,
          content,
          scripture_reference: scriptureReference,
          user_id: user.id,
          profile_id: user.id,
        });

      if (error) throw error;

      await router.push('/bible-studies');
      router.refresh();
    } catch (error) {
      console.error('Error submitting bible study:', error);
      alert('Failed to submit bible study. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      {isSubmitting && <LoadingModal />}
      
      <div className="rounded-lg bg-white p-6 shadow-md">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">Share Bible Study</h1>
        
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
              placeholder="Enter the title of your Bible study"
            />
          </div>

          <div>
            <label htmlFor="scripture" className="mb-2 block text-sm font-medium text-gray-700">
              Scripture Reference
            </label>
            <input
              type="text"
              id="scripture"
              value={scriptureReference}
              onChange={(e) => setScriptureReference(e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-2"
              required
              placeholder="e.g., John 3:16"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Study Content
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

          <div className="flex justify-end py-8">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`rounded-lg px-4 py-2 font-medium text-white transition-all
                ${isSubmitting 
                  ? 'cursor-not-allowed bg-gray-400'
                  : 'bg-blue-500 hover:bg-blue-600'
                }`}
            >
              Share Bible Study
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 