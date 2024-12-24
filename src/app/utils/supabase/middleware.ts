import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export const updateSession = async (request: NextRequest) => {
  try {
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            );
            response = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    // Get the user's session or refresh if expired
    const { data: { user }, error } = await supabase.auth.getUser();

    const url = request.nextUrl;
    console.log('second middleware', user)

    // Prevent signed-in users from accessing /sign-in or /sign-up
    if (user && (url.pathname === "/sign-in" || url.pathname === "/sign-up")) {
      return NextResponse.redirect(new URL("/", request.url)); // Redirect to home page
    }

    return response;
  } catch (e) {
    console.error("Error in updateSession:", e);
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }
};
