import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
// import { jwtVerify } from "jose";

// const SECRET = new TextEncoder().encode(
//   process.env.JWT_SECRET || "supersecret"
// );

// export async function middleware(req: NextRequest) {
//   if (req.nextUrl.pathname.startsWith("/admin")) {
//     const token = req.cookies.get("auth_token")?.value;

//     if (!token) {
//       return NextResponse.redirect(new URL("/login", req.url));
//     }

//     try {
//       const { payload } = await jwtVerify(token, SECRET);

//       if (payload.role !== "admin") {
//         return NextResponse.redirect(new URL("/", req.url));
//       }
//     } catch (err) {
//       console.error("JWT Verification Error:", err);
//       return NextResponse.redirect(new URL("/login", req.url));
//     }
//   }

//   return NextResponse.next();
// }

/**
 * Middleware that blocks access to all pages and redirects to a service error page.
 * It allows internal Next.js assets, API routes and the error page itself to avoid redirect loops.
 */
export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // Allow next internals, api, static assets and the error page itself
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/favicon.ico" ||
    pathname === "/manifest.json" ||
    pathname === "/sw.js" ||
    pathname === "/erro-provedor"
  ) {
    return NextResponse.next();
  }

  // Redirect all other requests to the error page
  const url = req.nextUrl.clone();
  url.pathname = "/erro-provedor";
  return NextResponse.redirect(url);
}

export const config = {
  // matcher: ["/admin/:path*"],

  // Match all routes except Next.js internals, api routes and the error page
  matcher: [
    "/((?!_next|api|erro-provedor|favicon\\.ico|manifest\\.json|sw\\.js).*)",
  ],
};
