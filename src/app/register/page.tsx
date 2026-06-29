"use client";

import Link from "next/link";
import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { registerAction, type RegisterState } from "./actions";

const initialState: RegisterState = {};

export default function RegisterPage() {
  const [state, formAction, pending] = useActionState(
    registerAction,
    initialState,
  );

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Daftar Akun</CardTitle>
          <CardDescription>
            Buat akun guru untuk mulai menyusun Modul Ajar.
          </CardDescription>
        </CardHeader>

        <form action={formAction}>
          <CardContent className="space-y-4">
            {state.error ? (
              <p className="rounded-md bg-red-50 p-3 text-sm text-red-600">
                {state.error}
              </p>
            ) : null}

            <div className="space-y-2">
              <Label htmlFor="name">Nama Lengkap</Label>
              <Input id="name" name="name" type="text" autoComplete="name" required />
              {state.fieldErrors?.name ? (
                <p className="text-sm text-red-600">{state.fieldErrors.name}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
              />
              {state.fieldErrors?.email ? (
                <p className="text-sm text-red-600">{state.fieldErrors.email}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
              />
              {state.fieldErrors?.password ? (
                <p className="text-sm text-red-600">
                  {state.fieldErrors.password}
                </p>
              ) : (
                <p className="text-xs text-slate-500">Minimal 8 karakter.</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
              />
              {state.fieldErrors?.confirmPassword ? (
                <p className="text-sm text-red-600">
                  {state.fieldErrors.confirmPassword}
                </p>
              ) : null}
            </div>
          </CardContent>

          <CardFooter className="mt-2 flex flex-col gap-3">
            <Button type="submit" className="w-full" disabled={pending}>
              {pending ? "Memproses…" : "Daftar"}
            </Button>
            <p className="text-center text-sm text-slate-500">
              Sudah punya akun?{" "}
              <Link href="/login" className="font-medium text-slate-900 underline">
                Login
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </main>
  );
}
