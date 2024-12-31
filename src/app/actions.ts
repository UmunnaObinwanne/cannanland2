"use server";
import { encodedRedirect } from "./utils/utils";
import { createClient } from "@/lib/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from 'next/cache';

import { PostType, getTableName, formatPostType } from "@/utils/post-types";

export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  if (!email || !password) {
    return encodedRedirect(
      "error",
      "/sign-up",
      "Email and password are required",
    );
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    console.error(error.code + " " + error.message);
    return encodedRedirect("error", "/sign-up", error.message);
  } else {
    return encodedRedirect(
      "success",
      "/sign-up",
      "Thanks for signing up! Please check your email for a verification link.",
    );
  }
};

export async function signInAction(formData: FormData) {
  'use server';

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect(
      "error",
      "/sign-in",
      "Invalid email or password. Please try again."
    );
  }

  redirect('/');
}

export const forgotPasswordAction = async (formData: FormData) => {
  'use server';
  
  const email = formData.get('email') as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password`,
  });

  if (error) {
    return {
      error: 'Failed to send reset instructions. Please try again.',
    };
  }

  return {
    success: 'Check your email for the password reset link.',
  };
};

export async function resetPasswordAction(formData: FormData): Promise<void> {
  'use server';

  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;

  if (password !== confirmPassword) {
    throw new Error('Passwords do not match');
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.updateUser({
      password: password,
    });

    if (error) throw error;

    // Redirect to sign-in page after successful password reset
    redirect('/sign-in?message=Password updated successfully. Please sign in with your new password.');

  } catch (error) {
    throw new Error('Failed to update password. Please try again.');
  }
}

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/sign-in");
};

export async function getUserProfile() {
  const supabase = await createClient();
  
  // First get the current user's ID
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;

  // Then fetch their profile from the profiles table
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }

  return profile;
}

export async function toggleLikeAction(slug: string, postType: PostType) {
 try {
   const supabase = await createClient();
   const { data: { user } } = await supabase.auth.getUser();
   
   if (!user) return { error: "Must be logged in", success: false };

   const table = getTableName(postType);

   console.log('this is the table I want to update', table)

   const { data: post, error: fetchError } = await supabase
     .from(table)
     .select('id, likes_count, user_likes, slug')
     .eq('slug', slug)
     .single();

   if (fetchError) return { error: "Failed to fetch post", success: false };

   const userLikes = Array.isArray(post.user_likes) ? post.user_likes : [];
   const hasLiked = userLikes.includes(user.id);
   
   const updates = {
     likes_count: hasLiked ? post.likes_count - 1 : post.likes_count + 1,
     user_likes: hasLiked ? userLikes.filter(id => id !== user.id) : [...userLikes, user.id]
   };

   console.log('Preparing update:', { updates, postId: post.id });

   const { data: updateData,  error: updateError } = await supabase
     .from(table)
     .update(updates)
     .eq('id', post.id)
     .select()
     .single();

console.log('Update result:', { updateData, updateError });

   return {
     success: true,
     hasLiked: !hasLiked,
     newCount: updates.likes_count
   };
 } catch (error) {
   return { error: "Failed to process like action", success: false };
 }
}


// Define table mapping first
const tableMap = {
  'bible-study': 'bible_studies',
  'prayer-request': 'prayer_requests',
  'testimony': 'testimonies',
  'spiritual-question': 'spiritual_questions'
} as const;

// Then define response table mapping using the table map type
type TableToResponseMap = {
  [K in (typeof tableMap)[keyof typeof tableMap]]: string;
};

const responseTableMap: TableToResponseMap = {
  'bible_studies': 'biblestudy_responses',
  'prayer_requests': 'prayer_responses',
  'testimonies': 'testimony_responses',
  'spiritual_questions': 'spiritual_question_responses'
} as const;

export async function createResponse(formData: FormData) {
  'use server'
  
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { error: "Must be logged in to reply" };
    }

    const slug = formData.get('postId') as string;
    const postType = formData.get('postType') as keyof typeof tableMap;
    const content = formData.get('content') as string;

    const table = tableMap[postType];
    if (!table) {
      return { error: `Invalid post type: ${postType}` };
    }

    // First get the actual post ID using the slug
    const { data: post, error: fetchError } = await supabase
      .from(table)
      .select('id')
      .eq('slug', slug)
      .single();

    if (fetchError || !post) {
      console.error('Error fetching post:', fetchError);
      return { error: "Failed to find post" };
    }

    // Map to response tables
    const responseTable = responseTableMap[table as keyof typeof responseTableMap];
    if (!responseTable) {
      return { error: "Invalid response table mapping" };
    }

    const { error } = await supabase
      .from(responseTable)
      .insert({
        content,
        user_id: user.id,
        profile_id: user.id,
        response_id: post.id
      });

    if (error) throw error;
    
    return { success: true };
  } catch (error) {
    console.error('Error creating response:', error);
    return { error: "Failed to create response" };
  }
}

export async function handleCreateResponse(formData: FormData) {
  const result = await createResponse(formData);
  if (result.error) {
    throw new Error(result.error);
  }
  revalidatePath(`/${formData.get('postType')}/${formData.get('postId')}`);
  return { success: true };
}

export async function checkAdminStatus() {
  const supabase = await createClient();
  
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    redirect('/sign-in');
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single();

  if (profileError || !profile?.is_admin) {
    redirect('/');
  }

  return { user, isAdmin: profile.is_admin };
}