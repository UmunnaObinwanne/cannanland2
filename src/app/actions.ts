"use server";
import { encodedRedirect } from "../../utils/utils";
import { createClient } from "../../utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from 'next/cache';

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

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect("error", "/sign-in", error.message);
  }

  return redirect("/");
};

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

export async function resetPasswordAction(formData: FormData) {
  'use server';

  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;

  if (password !== confirmPassword) {
    return {
      error: 'Passwords do not match',
    };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    return {
      error: 'Failed to update password. Please try again.',
    };
  }

  return {
    success: 'Password updated successfully. You can now sign in.',
  };
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

export async function toggleLikeAction(postId: string, postType: string) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { error: "Must be logged in to like posts", success: false };
    }

    // Determine the correct table name
    let table: string;
    switch (postType) {
      case 'bible_study':
        table = 'bible_studies';
        break;
      case 'prayer_request':
        table = 'prayer_requests';
        break;
      case 'testimony':
        table = 'testimonies';
        break;
      default:
        return { error: "Invalid post type", success: false };
    }

    // Get the current post with explicit column selection
    const { data: post, error: fetchError } = await supabase
      .from(table)
      .select('id, likes_count, user_likes')
      .eq('id', postId)
      .single();

    if (fetchError) {
      console.error('Fetch error:', fetchError);
      return { error: "Failed to fetch post", success: false };
    }

    // Initialize arrays and counts
    const userLikes = Array.isArray(post.user_likes) ? post.user_likes : [];
    const currentCount = typeof post.likes_count === 'number' ? post.likes_count : 0;
    const hasLiked = userLikes.includes(user.id);

    // Prepare the update
    const updates = {
      likes_count: hasLiked ? currentCount - 1 : currentCount + 1,
      user_likes: hasLiked 
        ? userLikes.filter(id => id !== user.id)
        : [...userLikes, user.id]
    };

    // Perform the update with better error handling
    const { error: updateError } = await supabase
      .from(table)
      .update(updates)
      .eq('id', postId)
      .select()
      .single();

    if (updateError) {
      console.error('Update error:', updateError);
      return { error: "Failed to update like", success: false };
    }

    return {
      success: true,
      hasLiked: !hasLiked,
      newCount: updates.likes_count,
      message: hasLiked ? "Like removed" : "Like added"
    };

  } catch (error) {
    console.error("Error in toggleLikeAction:", error);
    return { error: "Failed to process like action", success: false };
  }
}

export async function createResponse(formData: FormData) {
  'use server'
  
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { error: "Must be logged in to reply" };
    }

    const postId = formData.get('postId') as string;
    const postType = formData.get('postType') as string;
    const content = formData.get('content') as string;

    // Map the URL postType to the correct response table name
    const responseTable = {
      'bible-studies': 'biblestudy_responses',
      'prayer-requests': 'prayer_responses',
      'testimonies': 'testimony_responses'
    }[postType];

    if (!responseTable) {
      console.error('Invalid post type for response:', postType);
      return { error: `Invalid post type: ${postType}` };
    }

    // Map the URL postType to the correct foreign key name
    const foreignKeyId = {
      'bible-studies': 'request_id',
      'prayer-requests': 'request_id',
      'testimonies': 'request_id'
    }[postType];

    console.log('Creating response with:', {
      table: responseTable,
      foreignKey: foreignKeyId,
      postId,
      userId: user.id
    });

    const { error } = await supabase
      .from(responseTable)
      .insert({
        content,
        user_id: user.id,
        profile_id: user.id,
        [foreignKeyId]: postId
      });

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    revalidatePath(`/${postType}/${postId}`);
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