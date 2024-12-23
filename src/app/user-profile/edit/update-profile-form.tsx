"use client";

import { useState } from "react";
import { createClient } from "../../../../utils/supabase/client";
import { Profile } from "../../../../utils/supabase/types";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export function UpdateProfileForm({ initialData }: { initialData: Profile }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [avatar, setAvatar] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    username: initialData.username || "",
    full_name: initialData.full_name || "",
    bio: initialData.bio || "",
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatar(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const supabase = createClient();

      // Upload avatar if changed
      let avatar_url = initialData.avatar_url;
      if (avatar) {
        const fileExt = avatar.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const { error: uploadError, data } = await supabase.storage
          .from('avatars')
          .upload(fileName, avatar);

        if (uploadError) throw uploadError;
        if (data) {
          const { data: { publicUrl } } = supabase.storage
            .from('avatars')
            .getPublicUrl(data.path);
          avatar_url = publicUrl;
        }
      }

      // Update profile
      const { error } = await supabase
        .from('profiles')
        .update({
          ...formData,
          avatar_url,
          updated_at: new Date().toISOString(),
        })
        .eq('id', initialData.id);

      if (error) throw error;

      router.refresh();
      router.push('/user-profile');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Avatar Upload */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Profile Picture
        </label>
        <div className="flex items-center space-x-4">
          <div className="relative h-20 w-20">
            <Image
              src={avatar ? URL.createObjectURL(avatar) : (initialData.avatar_url || "/images/default-avatar.png")}
              alt="Profile"
              fill
              className="rounded-full object-cover"
            />
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="text-sm text-gray-600 file:mr-4 file:rounded-full file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>
      </div>

      {/* Username */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Username
        </label>
        <Input
          value={formData.username}
          onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
          className="w-full"
          placeholder="Enter your username"
        />
      </div>

      {/* Full Name */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Full Name
        </label>
        <Input
          value={formData.full_name}
          onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
          className="w-full"
          placeholder="Enter your full name"
        />
      </div>

      {/* Bio */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Bio
        </label>
        <Textarea
          value={formData.bio}
          onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
          className="h-32 w-full"
          placeholder="Tell us about yourself..."
        />
      </div>

      {/* Submit Button */}
      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/user-profile')}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
} 