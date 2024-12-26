// Header.tsx (Server Component)
import { createClient } from "@/lib/supabase/server";
import { HeaderClient } from "./header-client";

export async function Header() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  let isAdmin = false;
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single();
    isAdmin = profile?.is_admin || false;
  }

  return <HeaderClient user={user} isAdmin={isAdmin} />;
}

export default Header;