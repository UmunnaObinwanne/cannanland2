import { getUserProfile } from "@/app/actions";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Image from "next/image";
import { formatDistanceToNow } from 'date-fns';
import Link from "next/link";

interface UserPost {
  id: string;
  title: string;
  content: string;
  created_at: string;
  profiles: {
    username: string;
  };
  slug: string;
}

async function getUserPosts(userId: string) {
  const supabase = await createClient();
  
  // Fetch all types of posts
  const [bibleStudies, prayerRequests, testimonies] = await Promise.all([
    supabase
      .from('bible_studies')
      .select('*, profiles(username)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false }),
    supabase
      .from('prayer_requests')
      .select('*, profiles(username)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false }),
    supabase
      .from('testimonies')
      .select('*, profiles(username)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
  ]);

  return {
    bibleStudies: bibleStudies.data || [],
    prayerRequests: prayerRequests.data || [],
    testimonies: testimonies.data || []
  };
}

export default async function UserProfilePage() {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/sign-in");
  }

  const [profile, userPosts] = await Promise.all([
    getUserProfile(),
    getUserPosts(user.id)
  ]);
  
  if (!profile) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800">Profile Not Found</h2>
          <p className="text-gray-600">Please complete your profile setup</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="rounded-lg bg-white p-6 shadow-md">
        <div className="flex items-center space-x-6">
          {/* Profile Image */}
          <div className="relative h-24 w-24">
            {profile.avatar_url ? (
              <Image
                src={profile.avatar_url}
                alt="Profile"
                height={500}
                width={500}
                className="rounded-full object-cover"
              />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gray-200 text-2xl text-gray-600">
                {profile.username?.[0]?.toUpperCase() || "U"}
              </div>
            )}
          </div>

          {/* Profile Info */}
          <div className="space-y-2">
            <div className="flex items-center gap-5 justify-between">
              <h1 className="text-2xl font-bold text-gray-900">
                {profile.full_name || "Anonymous User"}
              </h1>
              <Link
                href="/user-profile/edit"
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 px-4 py-2 text-sm font-medium text-white transition-all hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {/* Icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 transition-transform group-hover:-rotate-12"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                <span className="relative">Edit Profile</span>
                {/* Shine effect */}
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform group-hover:translate-x-full" />
              </Link>
            </div>
            <p className="text-gray-600">@{profile.username || "username"}</p>
          </div>
        </div>

        {/* Profile Details */}
        <div className="mt-8 grid gap-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Profile Details</h3>
            <div className="mt-4 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Email</label>
                <p className="text-gray-800">{user.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Username</label>
                <p className="text-gray-800">{profile.username || "Not set"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Full Name</label>
                <p className="text-gray-800">{profile.full_name || "Not set"}</p>
              </div>
              {/* Add more profile fields as needed */}
                 <div>
                <label className="text-sm font-medium text-gray-600">Your bio</label>
                <p className="text-gray-800">{profile.bio || "Not set"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* User Posts Section */}
      <div className="mt-8">
        <h2 className="mb-6 text-2xl font-bold text-gray-900">Activity</h2>
        
        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <div className="flex space-x-8">
            <button className="border-b-2 border-blue-500 pb-4 text-sm font-medium text-blue-600">
              All Posts ({userPosts.bibleStudies.length + userPosts.prayerRequests.length + userPosts.testimonies.length})
            </button>
          </div>
        </div>

        {/* Posts Grid */}
        <div className="space-y-4">
          {[
            ...userPosts.bibleStudies.map(post => ({ ...post, type: 'Bible Study' })),
            ...userPosts.prayerRequests.map(post => ({ ...post, type: 'Prayer Request' })),
            ...userPosts.testimonies.map(post => ({ ...post, type: 'Testimony' }))
          ]
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            .map((post) => (
              <div key={`${post.type}-${post.id}`} className="overflow-hidden rounded-lg bg-white shadow transition-all hover:shadow-md">
                <div className="p-6">
                  {/* Post Type Badge */}
                  <div className="mb-2">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                      ${post.type === 'Bible Study' ? 'bg-purple-100 text-purple-800' :
                        post.type === 'Prayer Request' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'}`}>
                      {post.type}
                    </span>
                  </div>

                  {/* Post Title */}
                  <h3 className="text-lg font-medium text-gray-900">
                    {post.title}
                  </h3>

                  {/* Post Preview */}
                  <p className="mt-2 line-clamp-2 text-sm text-gray-500">
                    {post.content}
                  </p>

                  {/* Post Metadata */}
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <span>{formatDistanceToNow(new Date(post.created_at))} ago</span>
                      {post.likes_count !== undefined && (
                        <>
                          <span>•</span>
                          <span>{post.likes_count} likes</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
