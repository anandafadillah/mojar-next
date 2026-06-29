import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-slate-50 p-8 text-center">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-slate-900">Pakar Modul Ajar</h1>
        <p className="max-w-md text-slate-600">
          Susun Modul Ajar Kurikulum Merdeka lengkap dengan bantuan AI —
          dari ATP hingga bank soal, siap ekspor ke Word.
        </p>
      </div>
      <div className="flex gap-3">
        <Link href="/register" className={buttonVariants()}>
          Daftar
        </Link>
        <Link href="/login" className={buttonVariants({ variant: "outline" })}>
          Login
        </Link>
      </div>
    </main>
  );
}
