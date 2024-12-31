'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { LoadingModal } from '@/components/loading-modal';
import { generateResponse } from '@/utils/openai';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

const aiUsernames = [
  'Rev Wilson',
  'Pastor Tobi',
  'Rev Fernand',
  'Cardinal Augusto',
  'Pastor James'
];

const randomUsername = aiUsernames[Math.floor(Math.random() * aiUsernames.length)];

export default function ShareTestimony() {
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

      const {data: request, error } = await supabase
        .from('testimonies')
        .insert({
          title,
          content,
          is_anonymous: isAnonymous,
          user_id: user.id,
          profile_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      //Generate AI Response
      const aiResponse = await generateResponse(content, 'testimony');
await supabase
 .from('testimony_responses')
 .insert({
   testimony_id: request.id,
   content: aiResponse,
   is_ai: true,
   username: 'One of your Forum Pastors', 
   profile_id: null
 });

      await router.push('/testimonies');
      router.refresh();


    } catch (error) {
      console.error('Error:', error);
      alert('Failed to submit. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      {isSubmitting && <LoadingModal />}
      
      <div className="rounded-lg bg-white p-6 shadow-md">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">Share Your Testimony</h1>
        
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
              placeholder="Enter a title for your testimony"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Your Testimony
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

          <div className="flex items-center gap-2 py-8">
            <input
              type="checkbox"
              id="anonymous"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300"
            />
            <label htmlFor="anonymous" className="text-sm text-gray-600">
              Share anonymously
            </label>
          </div>

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
              Share Testimony
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 