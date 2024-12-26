'use client';

import { Button } from "@/components/ui/button";
import { FaEdit } from "react-icons/fa";
import Link from "next/link";

interface EditPostButtonProps {
  postType: string;
  postId: string;
  slug: string;
}

export function EditPostButton({ postType, postId, slug }: EditPostButtonProps) {
  const editUrl = `/${postType}/${slug}/edit`;
  
  return (
    <Button 
      variant="ghost" 
      size="sm" 
      asChild
      className="text-gray-600 hover:text-blue-600"
    >
      <Link href={editUrl}>
        <FaEdit className="mr-2 h-4 w-4" />
        Edit
      </Link>
    </Button>
  );
} 