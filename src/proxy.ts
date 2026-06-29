import NextAuth from "next-auth";

import { authConfig } from "@/lib/auth/auth.config";

// Next.js 16 mengganti konvensi `middleware.ts` menjadi `proxy.ts`.
// Memakai config Edge-safe (tanpa DB/bcrypt); logika proteksi route ada di
// callback `authorized` pada auth.config.ts.
const { auth } = NextAuth(authConfig);

export default auth;

export const config = {
  // Jalankan di semua route kecuali aset statis & internal Next.js.
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
