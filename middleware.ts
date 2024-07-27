import authConfig from "./auth.config";
import NextAuth from "next-auth";
import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  publicRoutes,
  authRoutes,
} from "@/routes";
import { redirect } from "next/navigation";
const { auth } = NextAuth(authConfig);
//@ts-ignore
export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

        if (isApiAuthRoute ) {return null};

        if (isAuthRoute) {
            if (isLoggedIn) {
               return  Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl) );
            }
                return null;
        }


          if (!isLoggedIn && !isPublicRoute) {

              let callback = nextUrl.pathname

              if(nextUrl.search){
                callback += nextUrl.search
              }

              const encodedCallback = encodeURIComponent(callback)

            return  Response.redirect(new URL(`/auth/login?callbackUrl=${encodedCallback}`, nextUrl) );

          }


          return null

    });

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
