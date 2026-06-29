import { auth } from "@/lib/auth";

// Placeholder dashboard — diisi pada slice Riwayat (#13). Untuk saat ini hanya
// membuktikan proteksi route: user pending diarahkan ke /pending oleh middleware,
// user belum login diarahkan ke /login.
export default async function DashboardPage() {
  const session = await auth();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-2 p-8">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="text-slate-600">
        Selamat datang, {session?.user?.name ?? "Guru"}.
      </p>
    </main>
  );
}
