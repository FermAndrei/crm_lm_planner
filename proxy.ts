import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const url = request.url;
  // Match query parameter token or api_token preserving special characters
  const match = url.match(/[?&](?:token|api_token)=([^&]+)/i);

  if (match) {
    let token = "";
    try {
      token = decodeURIComponent(match[1]).trim();
      // If spaces were introduced by URL encoding (+ -> space), restore +
      if (token.includes(" ") && !token.includes("+")) {
        token = token.replace(/ /g, "+");
      }
    } catch {
      token = match[1].trim();
    }

    if (token) {
      // Clone URL and delete token parameter for a clean URL
      const cleanUrl = request.nextUrl.clone();
      cleanUrl.searchParams.delete("token");
      cleanUrl.searchParams.delete("api_token");

      // Redirect to the clean URL and set the cookie!
      const response = NextResponse.redirect(cleanUrl);

      const maxAge = 60 * 60 * 24 * 30; // 30 days
      response.cookies.set("api_token", token, {
        path: "/",
        maxAge,
        sameSite: "lax",
        httpOnly: false, // allows client-side code to read document.cookie
      });
      response.cookies.set("token", token, {
        path: "/",
        maxAge,
        sameSite: "lax",
        httpOnly: false,
      });

      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - static image/asset extensions
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
