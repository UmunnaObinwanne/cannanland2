'use client';

import { FaHeart } from "react-icons/fa";
import { useState, useEffect } from "react";
import { toggleLikeAction } from "@/app/actions";
import { useRouter } from "next/navigation";
//import { useToast } from "@/components/ui/use-toast";

interface LikeButtonProps {
  postId: string;
  postType: string;
  initialLikesCount: number;
  initialIsLiked: boolean;
  isLoggedIn: boolean;
}

export function LikeButton({ 
  postId, 
  postType, 
  initialLikesCount, 
  initialIsLiked,
  isLoggedIn 
}: LikeButtonProps) {
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [likesCount, setLikesCount] = useState(initialLikesCount);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  //const toast = useToast();

  useEffect(() => {
    setIsLiked(initialIsLiked);
    setLikesCount(initialLikesCount);
  }, [initialIsLiked, initialLikesCount]);

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isLoggedIn) {
      router.push('/sign-in');
      return;
    }

    if (isLoading) return;

    setIsLoading(true);

    try {
      const result = await toggleLikeAction(postId, postType);
      
      if (result.success) {
        setIsLiked(result.hasLiked);
        setLikesCount(result.newCount);
        console.log('Like updated:', { hasLiked: result.hasLiked, count: result.newCount });
      } else {
        console.error('Failed to update like:', result.error);
      }
    } catch (error) {
      console.error('Error in handleLike:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleLike}
      disabled={isLoading}
      className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium transition-all
        ${isLiked 
          ? 'bg-red-50 text-red-600' 
          : 'text-gray-600 hover:bg-gray-50'
        }
        ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      <FaHeart 
        className={`text-sm transition-colors ${
          isLiked ? 'text-red-500' : 'text-gray-400'
        }`} 
      />
      <span>{likesCount}</span>
    </button>
  );
}