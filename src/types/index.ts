export interface Post {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at?: string;
  likes_count: number;
  user_likes: string[];
  is_anonymous: boolean;
  profiles: {
    username: string;
    avatar_url: string | null;
  };
  responses?: {
    id: string;
    content: string;
    created_at: string;
    profiles: {
      username: string;
      avatar_url: string | null;
    };
  }[];
  slug: string;
} 