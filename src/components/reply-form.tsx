'use client';

import { handleCreateResponse } from '@/app/actions';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { LoadingSpinner } from './loading-spinner';
import dynamic from 'next/dynamic';
import { Button } from './ui/button';

// Import Quill dynamically to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

export function ReplyForm({ postId, postType }: { postId: string; postType: string }) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [content, setContent] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Create FormData and append the rich text content
      const formData = new FormData();
      formData.append('postId', postId);
      formData.append('postType', postType);
      formData.append('content', content);

      const result = await handleCreateResponse(formData);
      if (result?.success) {
        formRef.current?.reset();
        setContent('');
        setIsOpen(false);
        router.refresh();
      }
    } catch (error) {
      console.error('Failed to post reply:', error);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        className="mt-8 w-full text-muted-foreground"
      >
        Write a response...
      </Button>
    );
  }

  return (
    <div className="mt-8 rounded-lg border bg-card p-4">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Leave a Reply</h3>
        <Button 
          onClick={() => setIsOpen(false)}
          variant="ghost"
          disabled={isSubmitting}
        >
          Cancel
        </Button>
      </div>
      <form ref={formRef} onSubmit={handleSubmit}>
        <input type="hidden" name="postId" value={postId} />
        <input type="hidden" name="postType" value={postType} />
        
        <div className="prose prose-sm min-h-[300px] mb-4">
          <ReactQuill
            theme="snow"
            value={content}
            onChange={setContent}
            placeholder="Write your reply..."
            modules={{
              toolbar: [
                [{ 'header': [1, 2, 3, false] }],
                ['bold', 'italic', 'underline'],
                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                ['blockquote', 'code-block'],
                ['link'],
                ['clean']
              ]
            }}
            formats={[
              'header',
              'bold', 'italic', 'underline',
              'list', 'bullet',
              'blockquote', 'code-block',
              'link'
            ]}
            className="min-h-[200px] h-[300px] mb-8"
            style={{
              height: '200px',
              fontSize: '16px'
            }}
          />
        </div>

        <div className="mt-4 flex justify-end">
          <Button 
            type="submit" 
            disabled={isSubmitting || !content.trim()}
            className="flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <LoadingSpinner className="h-4 w-4" />
                <span>Posting...</span>
              </>
            ) : (
              'Post Reply'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}