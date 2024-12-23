import { getUserProfile } from "@/app/actions";

export default async function ProtectedPage() {
  const profile = await getUserProfile();

  if (!profile) {
    return <div>Loading profile...</div>;
  }

  return (
    <div>
      <h1>Welcome, {profile.full_name}</h1>
      {/* Display other profile fields */}
    </div>
  );
}
