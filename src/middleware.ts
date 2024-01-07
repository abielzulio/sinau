import { authMiddleware, redirectToSignIn } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const publicPaths = ["/", "/api/trigger"];

export default authMiddleware({
  publicRoutes: publicPaths,
  afterAuth(auth, req) {
    // Handle users who aren't authenticated
    // TODO: Fix black screen on sign in after sign in
    if (!auth.userId && !auth.isPublicRoute) {
      return redirectToSignIn({ returnBackUrl: req.url });
    }

    if (auth.userId && req.nextUrl.pathname === "/") {
      return NextResponse.redirect(new URL("/subject", req.nextUrl.origin));
    }

    // If the user is logged in and trying to access a protected route, allow them to access route
    if (auth.userId && !auth.isPublicRoute) {
      return NextResponse.next();
    }

    // Allow users visiting public routes to access them
    return NextResponse.next();
  },
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
