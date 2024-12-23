import { getUserProfile } from "@/app/actions";
import { createClient } from "../../../../utils/supabase/server";
import { redirect } from "next/navigation";
import { UpdateProfileForm } from "./update-profile-form";

export default async function EditProfilePage() {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/sign-in");
  }

  const profile = await getUserProfile();
  if (!profile) {
    redirect("/user-profile");
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Edit Profile</h1>
        <p className="text-sm text-gray-600">Update your profile information</p>
      </div>
      
      <UpdateProfileForm initialData={profile} />
    </div>
  );
} 