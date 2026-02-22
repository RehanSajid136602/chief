import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

export default NextAuth(authConfig).auth((req) => {
  const isProtected = 
    req.nextUrl.pathname.startsWith("/ai") || 
    req.nextUrl.pathname.startsWith("/dashboard");

  if (!req.auth && isProtected) {
    const callbackUrl = req.nextUrl.pathname;
    const loginUrl = new URL("/auth/login", req.nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", callbackUrl);
    return Response.redirect(loginUrl);
  }
});


export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
