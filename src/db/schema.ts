import {
  date,
  integer,
  pgTable,
  real,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: text("role").notNull().default("pengasuh"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at").notNull(),
});

export const children = pgTable("children", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  gender: text("gender").notNull(),
  birthDate: date("birth_date", { mode: "string" }).notNull(),
  birthPlace: text("birth_place"),
  orphanType: text("orphan_type").notNull().default("Yatim Piatu"),
  entryDate: date("entry_date", { mode: "string" }).notNull(),
  education: text("education"),
  schoolName: text("school_name"),
  room: text("room"),
  status: text("status").notNull().default("Aktif"),
  bloodType: text("blood_type"),
  background: text("background"),
  healthNotes: text("health_notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const basicNeeds = pgTable("basic_needs", {
  id: serial("id").primaryKey(),
  childId: integer("child_id")
    .notNull()
    .references(() => children.id, { onDelete: "cascade" }),
  category: text("category").notNull(),
  item: text("item").notNull(),
  priority: text("priority").notNull().default("Sedang"),
  status: text("status").notNull().default("Dibutuhkan"),
  estimatedCost: integer("estimated_cost"),
  dueDate: date("due_date", { mode: "string" }),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const protectionCases = pgTable("protection_cases", {
  id: serial("id").primaryKey(),
  childId: integer("child_id")
    .notNull()
    .references(() => children.id, { onDelete: "cascade" }),
  type: text("type").notNull(),
  severity: text("severity").notNull().default("Sedang"),
  status: text("status").notNull().default("Terbuka"),
  reportedDate: date("reported_date", { mode: "string" }).notNull(),
  handler: text("handler"),
  description: text("description").notNull(),
  actionTaken: text("action_taken"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const healthRecords = pgTable("health_records", {
  id: serial("id").primaryKey(),
  childId: integer("child_id")
    .notNull()
    .references(() => children.id, { onDelete: "cascade" }),
  type: text("type").notNull(),
  status: text("status").notNull().default("Terjadwal"),
  checkDate: date("check_date", { mode: "string" }).notNull(),
  weightKg: real("weight_kg"),
  heightCm: real("height_cm"),
  diagnosis: text("diagnosis"),
  handler: text("handler"),
  nextCheckDate: date("next_check_date", { mode: "string" }),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
