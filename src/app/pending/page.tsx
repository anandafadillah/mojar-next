import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function PendingPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-2xl">
            ⏳
          </div>
          <CardTitle className="text-2xl">Menunggu Persetujuan</CardTitle>
          <CardDescription>Akun Anda berhasil dibuat.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-slate-600">
          <p>
            Akun Anda saat ini berstatus <strong>menunggu persetujuan admin</strong>.
            Silakan hubungi admin untuk mengaktifkan akun sebelum dapat
            menggunakan aplikasi.
          </p>
          <p>
            Hubungi admin di{" "}
            <a
              href="mailto:anandafadillah4@gmail.com"
              className="font-medium text-slate-900 underline"
            >
              anandafadillah4@gmail.com
            </a>
            . Anda akan menerima email setelah akun disetujui.
          </p>
          <Link
            href="/login"
            className={buttonVariants({ variant: "outline", className: "w-full" })}
          >
            Kembali ke Login
          </Link>
        </CardContent>
      </Card>
    </main>
  );
}
