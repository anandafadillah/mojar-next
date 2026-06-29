import type { DefaultSession } from "next-auth";

type Role = "admin" | "guru";
type Status = "pending" | "active" | "inactive";

declare module "next-auth" {
  interface User {
    role: Role;
    status: Status;
  }

  interface Session {
    user: {
      id: string;
      role: Role;
      status: Status;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: Role;
    status: Status;
  }
}
