import { createClient } from "../../../../utils/supabase/server";

export default async function TestimonyPage({
  params
}: {
  params: { slug: string }
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [testimonyData, responsesData] = await Promise.all([
    supabase
      .from('testimonies')
      .select(`
        *,
        profiles!testimonies_profile_id_fkey(username, avatar_url),
        user_likes
      `)
      .eq('slug', params.slug)
      .single(),
    supabase
      .from('testimony_responses')
      .select(`
        *,
        profiles!testimony_responses_profile_id_fkey(username, avatar_url)
      `)
      .eq('testimony_id', testimonyData?.data?.id)
      .eq('moderation_status', 'approved')
      .order('created_at', { ascending: true })
  ]);

  // ... Similar JSX structure with testimony specific labels and icons
}