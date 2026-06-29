import type { NextAuthConfig } from "next-auth";

/**
 * Konfigurasi Auth.js yang AMAN untuk Edge runtime (dipakai middleware).
 * TIDAK boleh mengimpor mysql2 / bcryptjs di sini — provider Credentials
 * (yang butuh DB) ditambahkan terpisah di `auth.ts` untuk Node runtime.
 */

// Halaman yang hanya boleh diakses user dengan status `active`.
const PROTECTED_PREFIXES = ["/dashboard", "/modul-ajar", "/settings", "/admin"];

const isProtected = (pathname: string) =>
  PROTECTED_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  providers: [],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.status = user.status;
      }
      return token;
    },
    session({ session, token }) {
      if (token.sub) session.user.id = token.sub;
      // Cast defensif: tipe JWT bisa tidak ter-augment akibat duplikasi paket
      // @auth/core di pnpm; nilainya sudah di-set di callback jwt di atas.
      session.user.role = token.role as typeof session.user.role;
      session.user.status = token.status as typeof session.user.status;
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const status = auth?.user?.status;
      const { pathname } = nextUrl;

      // User pending hanya boleh berada di /pending.
      if (isLoggedIn && status === "pending") {
        if (pathname === "/pending") return true;
        return Response.redirect(new URL("/pending", nextUrl));
      }

      // Halaman terproteksi wajib login (status aktif diperketat di slice #3).
      if (isProtected(pathname) && !isLoggedIn) {
        return false; // diarahkan ke pages.signIn oleh Auth.js
      }

      return true;
    },
  },
} satisfies NextAuthConfig;
