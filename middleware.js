// middleware.js
import { authMiddleware, clerkClient } from "@clerk/nextjs/server";

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your middleware
export default authMiddleware({
  publicRoutes: ["/", "/products(.*)", "/api/products(.*)"],
  ignoredRoutes: ["/api/webhook"],
  async afterAuth(auth, req) {
    // Handle admin routes
    if (req.nextUrl.pathname.startsWith('/admin')) {
      if (!auth.userId) {
        console.log('No user ID, redirecting to sign-in');
        const signInUrl = new URL('/sign-in', req.url);
        signInUrl.searchParams.set('redirect_url', req.url);
        return Response.redirect(signInUrl);
      }

      try {
        // Fetch the full user object
        const user = await clerkClient.users.getUser(auth.userId);
        console.log('Fetched user:', {
          id: user.id,
          email: user.emailAddresses[0]?.emailAddress,
          metadata: user.publicMetadata
        });

        // Check if user has admin role
        const isAdmin = user.publicMetadata?.role === 'admin';
        console.log('Admin check:', { isAdmin, metadata: user.publicMetadata });

        if (!isAdmin) {
          console.log('Not admin, redirecting to home');
          return Response.redirect(new URL('/', req.url));
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        return Response.redirect(new URL('/', req.url));
      }
    }
  }
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
