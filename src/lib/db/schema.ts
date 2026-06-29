import { randomUUID } from "crypto";
import {
  boolean,
  date,
  int,
  json,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

/**
 * Helper kolom primary key UUID disimpan sebagai CHAR(36) via varchar(36).
 * UUID di-generate di sisi aplikasi agar konsisten lintas versi MySQL.
 */
const uuidPk = () =>
  varchar("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => randomUUID());

// ---------------------------------------------------------------------------
// users
// ---------------------------------------------------------------------------
export const users = mysqlTable("users", {
  id: uuidPk(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  role: mysqlEnum("role", ["admin", "guru"]).notNull().default("guru"),
  status: mysqlEnum("status", ["pending", "active", "inactive"])
    .notNull()
    .default("pending"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
});

// ---------------------------------------------------------------------------
// schoolSettings — identitas sekolah & penyusun (1 baris per user)
// ---------------------------------------------------------------------------
export const schoolSettings = mysqlTable("school_settings", {
  id: uuidPk(),
  userId: varchar("user_id", { length: 36 })
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: "cascade" }),
  namaSekolah: varchar("nama_sekolah", { length: 255 }),
  kota: varchar("kota", { length: 255 }),
  kepalaSekolah: varchar("kepala_sekolah", { length: 255 }),
  nipKepsek: varchar("nip_kepsek", { length: 50 }),
  tanggalDefault: date("tanggal_default"),
});

// ---------------------------------------------------------------------------
// apiKeys — API key Gemini per user (encryptedKey = AES ciphertext)
// ---------------------------------------------------------------------------
export const apiKeys = mysqlTable("api_keys", {
  id: uuidPk(),
  userId: varchar("user_id", { length: 36 })
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: "cascade" }),
  provider: varchar("provider", { length: 50 }).notNull().default("gemini"),
  encryptedKey: text("encrypted_key").notNull(),
  defaultModel: varchar("default_model", { length: 100 })
    .notNull()
    .default("gemini-2.0-flash"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ---------------------------------------------------------------------------
// promptTemplates — template prompt per section, dapat diedit admin
// ---------------------------------------------------------------------------
export const promptTemplates = mysqlTable("prompt_templates", {
  id: uuidPk(),
  sectionKey: varchar("section_key", { length: 100 }).notNull().unique(),
  templateBody: text("template_body").notNull(),
  modelOverride: varchar("model_override", { length: 100 }),
  isActive: boolean("is_active").notNull().default(true),
  updatedBy: varchar("updated_by", { length: 36 }).references(() => users.id, {
    onDelete: "set null",
  }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
});

// ---------------------------------------------------------------------------
// modulAjars — state wizard + metadata modul ajar
// ---------------------------------------------------------------------------
export type ModulFormData = {
  jenjang?: string;
  mataPelajaran?: string;
  kelas?: string;
  fase?: string;
  semester?: string;
  alokasiWaktu?: string;
  jumlahPertemuan?: number;
  praktikPedagogis?: string;
  topik?: string;
  tujuanPembelajaran?: string;
  [key: string]: unknown;
};

export const modulAjars = mysqlTable("modul_ajars", {
  id: uuidPk(),
  userId: varchar("user_id", { length: 36 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  status: mysqlEnum("status", ["draft", "selesai"]).notNull().default("draft"),
  currentStep: int("current_step").notNull().default(1),
  formData: json("form_data").$type<ModulFormData>(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
});

// ---------------------------------------------------------------------------
// modulSections — hasil generate per section (1 baris per sectionKey per modul)
// ---------------------------------------------------------------------------
export const modulSections = mysqlTable("modul_sections", {
  id: uuidPk(),
  modulAjarId: varchar("modul_ajar_id", { length: 36 })
    .notNull()
    .references(() => modulAjars.id, { onDelete: "cascade" }),
  sectionKey: varchar("section_key", { length: 100 }).notNull(),
  content: text("content"),
  generatedAt: timestamp("generated_at"),
  isEdited: boolean("is_edited").notNull().default(false),
});

// ---------------------------------------------------------------------------
// bankSoals — bank soal (content = JSON array soal)
// ---------------------------------------------------------------------------
export type Soal = {
  soal: string;
  pilihan?: string[];
  kunci_jawaban: string;
  level_bloom: string;
  keterangan?: string;
};

export const bankSoals = mysqlTable("bank_soals", {
  id: uuidPk(),
  modulAjarId: varchar("modul_ajar_id", { length: 36 })
    .notNull()
    .references(() => modulAjars.id, { onDelete: "cascade" }),
  format: varchar("format", { length: 50 }).notNull(),
  jumlah: int("jumlah").notNull(),
  content: json("content").$type<Soal[]>(),
});

// ---------------------------------------------------------------------------
// Tipe inferensi untuk dipakai di seluruh aplikasi
// ---------------------------------------------------------------------------
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type SchoolSetting = typeof schoolSettings.$inferSelect;
export type ApiKey = typeof apiKeys.$inferSelect;
export type PromptTemplate = typeof promptTemplates.$inferSelect;
export type ModulAjar = typeof modulAjars.$inferSelect;
export type ModulSection = typeof modulSections.$inferSelect;
export type BankSoal = typeof bankSoals.$inferSelect;
