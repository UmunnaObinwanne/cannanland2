'use client';

import { format } from "date-fns";
import Image from 'next/image';
import { sanitizeHtml } from '@/lib/utils';


interface Response {
  id: string;
  content: string;
  created_at: string;
  is_ai?: boolean;
  username?: string;
  profiles?: {
    username?: string;
    avatar_url?: string | null;
  };
}

interface ResponsesSectionProps {
  responses?: Response[] | null;
}



export function ResponsesSection({ responses }: ResponsesSectionProps) {
  if (!responses?.length) {
    return (
      <div className="mt-8 rounded-lg bg-gray-50 p-6">
        <p className="text-center text-gray-600">No responses yet. Be the first to respond!</p>
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-6">
      <h3 className="text-lg font-semibold">Responses ({responses.length})</h3>
      <div className="divide-y divide-gray-200 rounded-lg bg-white shadow-sm">
        {responses.map((response) => (
          <div key={response.id} className="p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="relative size-8 overflow-hidden rounded-full">
                {response.is_ai ? (
                  <div className="flex size-full items-center justify-center bg-blue-200 text-sm">
                    {response.username?.[0]?.toUpperCase() || 'P'}
                  </div>
                ) : response.profiles?.avatar_url ? (
                  <Image
                    src={response.profiles.avatar_url}
                    alt={response.profiles?.username || 'Anonymous'}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex size-full items-center justify-center bg-gray-200 text-sm">
                    {response.profiles?.username?.[0]?.toUpperCase() || 'A'}
                  </div>
                )}
              </div>
              <div>
                <p className="font-bold">
                  {response.is_ai ? 
                    response.username || 'One of The Forum Pastors' : 
                    `@${response.profiles?.username || 'Anonymous'}`}
                </p>
                <p className="text-xs text-gray-500">
                  {format(new Date(response.created_at), 'MMM d')}
                </p>
              </div>
            </div>
      <div 
  className="prose prose-sm max-w-none
    [&>ol]:list-decimal [&>ol]:ml-6 [&>ol]:my-6
    [&>ol>li]:mb-3 [&>ol>li]:pl-2
    [&>ul]:list-disc [&>ul]:ml-6 [&>ul]:my-6
    [&>ul>li]:mb-3 [&>ul>li]:pl-2
    [&>p]:mb-4 [&>p>strong]:font-semibold
    [&>p>br]:content-[''] [&>p>br]:block [&>p>br]:my-4"
  dangerouslySetInnerHTML={{
    __html: sanitizeHtml(response.content)
  }}
/>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ResponsesSection;