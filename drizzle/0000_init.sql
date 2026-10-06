CREATE TABLE "basic_needs" (
	"id" serial PRIMARY KEY NOT NULL,
	"child_id" integer NOT NULL,
	"category" text NOT NULL,
	"item" text NOT NULL,
	"priority" text DEFAULT 'Sedang' NOT NULL,
	"status" text DEFAULT 'Dibutuhkan' NOT NULL,
	"estimated_cost" integer,
	"due_date" date,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "children" (
	"id" serial PRIMARY KEY NOT NULL,
	"full_name" text NOT NULL,
	"gender" text NOT NULL,
	"birth_date" date NOT NULL,
	"birth_place" text,
	"orphan_type" text DEFAULT 'Yatim Piatu' NOT NULL,
	"entry_date" date NOT NULL,
	"education" text,
	"school_name" text,
	"room" text,
	"status" text DEFAULT 'Aktif' NOT NULL,
	"blood_type" text,
	"background" text,
	"health_notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "health_records" (
	"id" serial PRIMARY KEY NOT NULL,
	"child_id" integer NOT NULL,
	"type" text NOT NULL,
	"status" text DEFAULT 'Terjadwal' NOT NULL,
	"check_date" date NOT NULL,
	"weight_kg" real,
	"height_cm" real,
	"diagnosis" text,
	"handler" text,
	"next_check_date" date,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "protection_cases" (
	"id" serial PRIMARY KEY NOT NULL,
	"child_id" integer NOT NULL,
	"type" text NOT NULL,
	"severity" text DEFAULT 'Sedang' NOT NULL,
	"status" text DEFAULT 'Terbuka' NOT NULL,
	"reported_date" date NOT NULL,
	"handler" text,
	"description" text NOT NULL,
	"action_taken" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"expires_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"role" text DEFAULT 'pengasuh' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "basic_needs" ADD CONSTRAINT "basic_needs_child_id_children_id_fk" FOREIGN KEY ("child_id") REFERENCES "public"."children"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "health_records" ADD CONSTRAINT "health_records_child_id_children_id_fk" FOREIGN KEY ("child_id") REFERENCES "public"."children"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "protection_cases" ADD CONSTRAINT "protection_cases_child_id_children_id_fk" FOREIGN KEY ("child_id") REFERENCES "public"."children"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;