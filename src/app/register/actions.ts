"use server";

import { hash } from "bcryptjs";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { z } from "zod";

import { db, users } from "@/lib/db";

const registerSchema = z
  .object({
    name: z.string().trim().min(1, "Nama wajib diisi"),
    email: z.string().trim().toLowerCase().email("Format email tidak valid"),
    password: z.string().min(8, "Password minimal 8 karakter"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Konfirmasi password tidak cocok",
    path: ["confirmPassword"],
  });

export type RegisterState = {
  error?: string;
  fieldErrors?: Partial<Record<"name" | "email" | "password" | "confirmPassword", string>>;
};

export async function registerAction(
  _prevState: RegisterState,
  formData: FormData,
): Promise<RegisterState> {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    const fieldErrors: RegisterState["fieldErrors"] = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0] as keyof NonNullable<RegisterState["fieldErrors"]>;
      if (field && !fieldErrors[field]) fieldErrors[field] = issue.message;
    }
    return { fieldErrors };
  }

  const { name, email, password } = parsed.data;

  const existing = await db.query.users.findFirst({
    where: eq(users.email, email),
  });
  if (existing) {
    return { fieldErrors: { email: "Email sudah terdaftar. Silakan login." } };
  }

  const passwordHash = await hash(password, 10);

  try {
    // status default `pending`, role default `guru` (lihat schema).
    await db.insert(users).values({ name, email, passwordHash });
  } catch {
    return {
      error: "Terjadi kesalahan saat membuat akun. Coba lagi sebentar.",
    };
  }

  redirect("/pending");
}
