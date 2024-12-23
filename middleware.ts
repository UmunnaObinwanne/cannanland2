import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "./utils/supabase/middleware";

export async function middleware(request: NextRequest) {
  const response = await updateSession(request);

  // Prevent signed-in users from accessing `/sign-in` or `/sign-up`
  const url = request.nextUrl;
  const user = response.cookies.get("supabase-auth-token"); // Check if user is signed in via Supabase auth token
  console.log('middleware', user)
  
  if (user && (url.pathname === "/sign-in" || url.pathname === "/sign-up")) {
    return NextResponse.redirect(new URL("/", request.url)); // Redirect to home page
  }

  // Return the default response for all other paths
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
