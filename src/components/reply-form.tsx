'use client';

import { handleCreateResponse } from '@/app/actions';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { LoadingSpinner } from './loading-spinner';

export function ReplyForm({ postId, postType }: { postId: string; postType: string }) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);

    try {
      const result = await handleCreateResponse(formData);
      if (result?.success) {
        formRef.current?.reset();
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
      <button
        onClick={() => setIsOpen(true)}
        className="mt-8 flex w-full items-center justify-center rounded-lg border border-gray-200 p-4 text-gray-500 hover:bg-gray-50"
      >
        Write a response...
      </button>
    );
  }

  return (
    <div className="mt-8 rounded-lg border border-gray-200 bg-white p-4">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Leave a Reply</h3>
        <button 
          onClick={() => setIsOpen(false)}
          className="text-gray-500 hover:text-gray-700"
          disabled={isSubmitting}
        >
          Cancel
        </button>
      </div>
      <form ref={formRef} onSubmit={handleSubmit}>
        <input type="hidden" name="postId" value={postId} />
        <input type="hidden" name="postType" value={postType} />
        <textarea
          name="content"
          className="w-full rounded-md border border-gray-200 p-3"
          rows={4}
          placeholder="Write your reply..."
          required
          autoFocus
          disabled={isSubmitting}
        />
        <div className="mt-4 flex justify-end">
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="flex items-center gap-2 rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <LoadingSpinner className="h-4 w-4" />
                Posting...
              </>
            ) : (
              'Post Reply'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}