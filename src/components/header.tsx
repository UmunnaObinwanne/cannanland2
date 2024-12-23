// Header.tsx (Server Component)
import { createClient } from "../../utils/supabase/server";
import { HeaderClient } from "./header-client";
import Link from "next/link";
import Image from "next/image";

export async function Header() {
  const supabase =  await createClient();

    const {
    data: { user },
  } = await supabase.auth.getUser();


  return <HeaderClient user={user} />;
}

export default Header;