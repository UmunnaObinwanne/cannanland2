'use client';

//import { useToast } from "@/components/ui/use-toast";
import { handleCreateResponse } from '@/app/actions';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';

export function ReplyForm({ postId, postType }: { postId: string; postType: string }) {
  //const { toast } = useToast();
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      const result = await handleCreateResponse(formData);
      if (result?.success) {
        formRef.current?.reset();
        setIsOpen(false);
        //toast({ title: "Success", description: "Your reply has been posted" });
        router.refresh();
      }
    } catch (error) {
      //toast({ title: "Error", description: "Failed to post reply" });
    }
  }

  if (!isOpen) {
    return (
      <div className="mt-8 text-center">
        <button 
          onClick={() => setIsOpen(true)}
          className="rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
        >
          Write a Reply
        </button>
      </div>
    );
  }

  return (
    <div className="mt-8 rounded-lg bg-white p-6 shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Leave a Reply</h3>
        <button 
          onClick={() => setIsOpen(false)}
          className="text-gray-500 hover:text-gray-700"
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
        />
        <div className="mt-4 flex justify-end">
          <button type="submit" className="rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600">
            Post Reply
          </button>
        </div>
      </form>
    </div>
  );
}

export default ReplyForm;