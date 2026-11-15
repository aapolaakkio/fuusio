import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."_locales" AS ENUM('fi', 'en');
  CREATE TYPE "public"."enum_pages_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__pages_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__pages_v_published_locale" AS ENUM('fi', 'en');
  CREATE TYPE "public"."enum_main_navigation_items_children_type" AS ENUM('page', 'external');
  CREATE TYPE "public"."enum_main_navigation_items_type" AS ENUM('page', 'external', 'menu');
  CREATE TYPE "public"."enum_main_navigation_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__main_navigation_v_version_items_children_type" AS ENUM('page', 'external');
  CREATE TYPE "public"."enum__main_navigation_v_version_items_type" AS ENUM('page', 'external', 'menu');
  CREATE TYPE "public"."enum__main_navigation_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__main_navigation_v_published_locale" AS ENUM('fi', 'en');
  CREATE TYPE "public"."enum_landing_page_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__landing_page_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__landing_page_v_published_locale" AS ENUM('fi', 'en');
  CREATE TABLE "documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"thumbnail_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"blur_data_url" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "media_locales" (
  	"alt" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"banner_image_id" integer,
  	"show_table_of_contents" boolean DEFAULT false,
  	"full_width" boolean DEFAULT false,
  	"no_index" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_pages_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "pages_locales" (
  	"title" varchar,
  	"content" jsonb,
  	"path" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_banner_image_id" integer,
  	"version_show_table_of_contents" boolean DEFAULT false,
  	"version_full_width" boolean DEFAULT false,
  	"version_no_index" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__pages_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__pages_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_pages_v_locales" (
  	"version_title" varchar,
  	"version_content" jsonb,
  	"version_path" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"sub" varchar,
  	"email" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"documents_id" integer,
  	"media_id" integer,
  	"pages_id" integer,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "main_navigation_items_children" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"type" "enum_main_navigation_items_children_type" DEFAULT 'page',
  	"page_id" integer
  );
  
  CREATE TABLE "main_navigation_items_children_locales" (
  	"label" varchar,
  	"url" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "main_navigation_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"type" "enum_main_navigation_items_type" DEFAULT 'page',
  	"page_id" integer
  );
  
  CREATE TABLE "main_navigation_items_locales" (
  	"label" varchar,
  	"url" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "main_navigation" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"logo_id" integer,
  	"_status" "enum_main_navigation_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "main_navigation_locales" (
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_main_navigation_v_version_items_children" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"type" "enum__main_navigation_v_version_items_children_type" DEFAULT 'page',
  	"page_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_main_navigation_v_version_items_children_locales" (
  	"label" varchar,
  	"url" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_main_navigation_v_version_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"type" "enum__main_navigation_v_version_items_type" DEFAULT 'page',
  	"page_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_main_navigation_v_version_items_locales" (
  	"label" varchar,
  	"url" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_main_navigation_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_logo_id" integer,
  	"version__status" "enum__main_navigation_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__main_navigation_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_main_navigation_v_locales" (
  	"version_title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "footer" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "footer_locales" (
  	"content" jsonb NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "footer_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar,
  	"locale" "_locales"
  );
  
  CREATE TABLE "landing_page_hero_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar
  );
  
  CREATE TABLE "landing_page_hero_links_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "landing_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"announcement_enabled" boolean DEFAULT false,
  	"announcement_color" varchar DEFAULT '#fbdb1d',
  	"announcement_text_color" varchar DEFAULT '#000000',
  	"_status" "enum_landing_page_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "landing_page_locales" (
  	"title" varchar,
  	"subtitle" varchar,
  	"announcement_content" jsonb,
  	"content" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "landing_page_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "_landing_page_v_version_hero_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_landing_page_v_version_hero_links_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_landing_page_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_announcement_enabled" boolean DEFAULT false,
  	"version_announcement_color" varchar DEFAULT '#fbdb1d',
  	"version_announcement_text_color" varchar DEFAULT '#000000',
  	"version__status" "enum__landing_page_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__landing_page_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_landing_page_v_locales" (
  	"version_title" varchar,
  	"version_subtitle" varchar,
  	"version_announcement_content" jsonb,
  	"version_content" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_landing_page_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "partner_section_partners" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"link" varchar NOT NULL,
  	"logo_id" integer NOT NULL
  );
  
  CREATE TABLE "partner_section" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "partner_section_locales" (
  	"title" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "documents" ADD CONSTRAINT "documents_thumbnail_id_media_id_fk" FOREIGN KEY ("thumbnail_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "media_locales" ADD CONSTRAINT "media_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_banner_image_id_media_id_fk" FOREIGN KEY ("banner_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_locales" ADD CONSTRAINT "pages_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_parent_id_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_banner_image_id_media_id_fk" FOREIGN KEY ("version_banner_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_locales" ADD CONSTRAINT "_pages_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_documents_fk" FOREIGN KEY ("documents_id") REFERENCES "public"."documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "main_navigation_items_children" ADD CONSTRAINT "main_navigation_items_children_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "main_navigation_items_children" ADD CONSTRAINT "main_navigation_items_children_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."main_navigation_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "main_navigation_items_children_locales" ADD CONSTRAINT "main_navigation_items_children_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."main_navigation_items_children"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "main_navigation_items" ADD CONSTRAINT "main_navigation_items_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "main_navigation_items" ADD CONSTRAINT "main_navigation_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."main_navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "main_navigation_items_locales" ADD CONSTRAINT "main_navigation_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."main_navigation_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "main_navigation" ADD CONSTRAINT "main_navigation_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "main_navigation_locales" ADD CONSTRAINT "main_navigation_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."main_navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_main_navigation_v_version_items_children" ADD CONSTRAINT "_main_navigation_v_version_items_children_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_main_navigation_v_version_items_children" ADD CONSTRAINT "_main_navigation_v_version_items_children_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_main_navigation_v_version_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_main_navigation_v_version_items_children_locales" ADD CONSTRAINT "_main_navigation_v_version_items_children_locales_parent__fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_main_navigation_v_version_items_children"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_main_navigation_v_version_items" ADD CONSTRAINT "_main_navigation_v_version_items_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_main_navigation_v_version_items" ADD CONSTRAINT "_main_navigation_v_version_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_main_navigation_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_main_navigation_v_version_items_locales" ADD CONSTRAINT "_main_navigation_v_version_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_main_navigation_v_version_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_main_navigation_v" ADD CONSTRAINT "_main_navigation_v_version_logo_id_media_id_fk" FOREIGN KEY ("version_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_main_navigation_v_locales" ADD CONSTRAINT "_main_navigation_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_main_navigation_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_locales" ADD CONSTRAINT "footer_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_texts" ADD CONSTRAINT "footer_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_page_hero_links" ADD CONSTRAINT "landing_page_hero_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."landing_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_page_hero_links_locales" ADD CONSTRAINT "landing_page_hero_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."landing_page_hero_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_page_locales" ADD CONSTRAINT "landing_page_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."landing_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_page_rels" ADD CONSTRAINT "landing_page_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."landing_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_page_rels" ADD CONSTRAINT "landing_page_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_landing_page_v_version_hero_links" ADD CONSTRAINT "_landing_page_v_version_hero_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_landing_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_landing_page_v_version_hero_links_locales" ADD CONSTRAINT "_landing_page_v_version_hero_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_landing_page_v_version_hero_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_landing_page_v_locales" ADD CONSTRAINT "_landing_page_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_landing_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_landing_page_v_rels" ADD CONSTRAINT "_landing_page_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_landing_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_landing_page_v_rels" ADD CONSTRAINT "_landing_page_v_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partner_section_partners" ADD CONSTRAINT "partner_section_partners_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "partner_section_partners" ADD CONSTRAINT "partner_section_partners_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partner_section"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partner_section_locales" ADD CONSTRAINT "partner_section_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partner_section"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "documents_thumbnail_idx" ON "documents" USING btree ("thumbnail_id");
  CREATE INDEX "documents_updated_at_idx" ON "documents" USING btree ("updated_at");
  CREATE INDEX "documents_created_at_idx" ON "documents" USING btree ("created_at");
  CREATE UNIQUE INDEX "documents_filename_idx" ON "documents" USING btree ("filename");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE UNIQUE INDEX "media_locales_locale_parent_id_unique" ON "media_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "media_locales_parent_id_idx" ON "media_locales" USING btree ("_parent_id");
  CREATE INDEX "pages_banner_image_idx" ON "pages" USING btree ("banner_image_id");
  CREATE INDEX "pages_updated_at_idx" ON "pages" USING btree ("updated_at");
  CREATE INDEX "pages_created_at_idx" ON "pages" USING btree ("created_at");
  CREATE INDEX "pages__status_idx" ON "pages" USING btree ("_status");
  CREATE UNIQUE INDEX "pages_path_idx" ON "pages_locales" USING btree ("path","_locale");
  CREATE UNIQUE INDEX "pages_locales_locale_parent_id_unique" ON "pages_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_locales_parent_id_idx" ON "pages_locales" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_parent_idx" ON "_pages_v" USING btree ("parent_id");
  CREATE INDEX "_pages_v_version_version_banner_image_idx" ON "_pages_v" USING btree ("version_banner_image_id");
  CREATE INDEX "_pages_v_version_version_updated_at_idx" ON "_pages_v" USING btree ("version_updated_at");
  CREATE INDEX "_pages_v_version_version_created_at_idx" ON "_pages_v" USING btree ("version_created_at");
  CREATE INDEX "_pages_v_version_version__status_idx" ON "_pages_v" USING btree ("version__status");
  CREATE INDEX "_pages_v_created_at_idx" ON "_pages_v" USING btree ("created_at");
  CREATE INDEX "_pages_v_updated_at_idx" ON "_pages_v" USING btree ("updated_at");
  CREATE INDEX "_pages_v_snapshot_idx" ON "_pages_v" USING btree ("snapshot");
  CREATE INDEX "_pages_v_published_locale_idx" ON "_pages_v" USING btree ("published_locale");
  CREATE INDEX "_pages_v_latest_idx" ON "_pages_v" USING btree ("latest");
  CREATE INDEX "_pages_v_autosave_idx" ON "_pages_v" USING btree ("autosave");
  CREATE INDEX "_pages_v_version_version_path_idx" ON "_pages_v_locales" USING btree ("version_path","_locale");
  CREATE UNIQUE INDEX "_pages_v_locales_locale_parent_id_unique" ON "_pages_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_locales_parent_id_idx" ON "_pages_v_locales" USING btree ("_parent_id");
  CREATE INDEX "users_sub_idx" ON "users" USING btree ("sub");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_documents_id_idx" ON "payload_locked_documents_rels" USING btree ("documents_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("pages_id");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "main_navigation_items_children_order_idx" ON "main_navigation_items_children" USING btree ("_order");
  CREATE INDEX "main_navigation_items_children_parent_id_idx" ON "main_navigation_items_children" USING btree ("_parent_id");
  CREATE INDEX "main_navigation_items_children_page_idx" ON "main_navigation_items_children" USING btree ("page_id");
  CREATE UNIQUE INDEX "main_navigation_items_children_locales_locale_parent_id_uniq" ON "main_navigation_items_children_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "main_navigation_items_children_locales_parent_id_idx" ON "main_navigation_items_children_locales" USING btree ("_parent_id");
  CREATE INDEX "main_navigation_items_order_idx" ON "main_navigation_items" USING btree ("_order");
  CREATE INDEX "main_navigation_items_parent_id_idx" ON "main_navigation_items" USING btree ("_parent_id");
  CREATE INDEX "main_navigation_items_page_idx" ON "main_navigation_items" USING btree ("page_id");
  CREATE UNIQUE INDEX "main_navigation_items_locales_locale_parent_id_unique" ON "main_navigation_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "main_navigation_items_locales_parent_id_idx" ON "main_navigation_items_locales" USING btree ("_parent_id");
  CREATE INDEX "main_navigation_logo_idx" ON "main_navigation" USING btree ("logo_id");
  CREATE INDEX "main_navigation__status_idx" ON "main_navigation" USING btree ("_status");
  CREATE UNIQUE INDEX "main_navigation_locales_locale_parent_id_unique" ON "main_navigation_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "main_navigation_locales_parent_id_idx" ON "main_navigation_locales" USING btree ("_parent_id");
  CREATE INDEX "_main_navigation_v_version_items_children_order_idx" ON "_main_navigation_v_version_items_children" USING btree ("_order");
  CREATE INDEX "_main_navigation_v_version_items_children_parent_id_idx" ON "_main_navigation_v_version_items_children" USING btree ("_parent_id");
  CREATE INDEX "_main_navigation_v_version_items_children_page_idx" ON "_main_navigation_v_version_items_children" USING btree ("page_id");
  CREATE UNIQUE INDEX "_main_navigation_v_version_items_children_locales_locale_par" ON "_main_navigation_v_version_items_children_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_main_navigation_v_version_items_children_locales_parent_idx" ON "_main_navigation_v_version_items_children_locales" USING btree ("_parent_id");
  CREATE INDEX "_main_navigation_v_version_items_order_idx" ON "_main_navigation_v_version_items" USING btree ("_order");
  CREATE INDEX "_main_navigation_v_version_items_parent_id_idx" ON "_main_navigation_v_version_items" USING btree ("_parent_id");
  CREATE INDEX "_main_navigation_v_version_items_page_idx" ON "_main_navigation_v_version_items" USING btree ("page_id");
  CREATE UNIQUE INDEX "_main_navigation_v_version_items_locales_locale_parent_id_un" ON "_main_navigation_v_version_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_main_navigation_v_version_items_locales_parent_id_idx" ON "_main_navigation_v_version_items_locales" USING btree ("_parent_id");
  CREATE INDEX "_main_navigation_v_version_version_logo_idx" ON "_main_navigation_v" USING btree ("version_logo_id");
  CREATE INDEX "_main_navigation_v_version_version__status_idx" ON "_main_navigation_v" USING btree ("version__status");
  CREATE INDEX "_main_navigation_v_created_at_idx" ON "_main_navigation_v" USING btree ("created_at");
  CREATE INDEX "_main_navigation_v_updated_at_idx" ON "_main_navigation_v" USING btree ("updated_at");
  CREATE INDEX "_main_navigation_v_snapshot_idx" ON "_main_navigation_v" USING btree ("snapshot");
  CREATE INDEX "_main_navigation_v_published_locale_idx" ON "_main_navigation_v" USING btree ("published_locale");
  CREATE INDEX "_main_navigation_v_latest_idx" ON "_main_navigation_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_main_navigation_v_locales_locale_parent_id_unique" ON "_main_navigation_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_main_navigation_v_locales_parent_id_idx" ON "_main_navigation_v_locales" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "footer_locales_locale_parent_id_unique" ON "footer_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "footer_locales_parent_id_idx" ON "footer_locales" USING btree ("_parent_id");
  CREATE INDEX "footer_texts_order_parent" ON "footer_texts" USING btree ("order","parent_id");
  CREATE INDEX "footer_texts_locale_parent" ON "footer_texts" USING btree ("locale","parent_id");
  CREATE INDEX "landing_page_hero_links_order_idx" ON "landing_page_hero_links" USING btree ("_order");
  CREATE INDEX "landing_page_hero_links_parent_id_idx" ON "landing_page_hero_links" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "landing_page_hero_links_locales_locale_parent_id_unique" ON "landing_page_hero_links_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "landing_page_hero_links_locales_parent_id_idx" ON "landing_page_hero_links_locales" USING btree ("_parent_id");
  CREATE INDEX "landing_page__status_idx" ON "landing_page" USING btree ("_status");
  CREATE UNIQUE INDEX "landing_page_locales_locale_parent_id_unique" ON "landing_page_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "landing_page_locales_parent_id_idx" ON "landing_page_locales" USING btree ("_parent_id");
  CREATE INDEX "landing_page_rels_order_idx" ON "landing_page_rels" USING btree ("order");
  CREATE INDEX "landing_page_rels_parent_idx" ON "landing_page_rels" USING btree ("parent_id");
  CREATE INDEX "landing_page_rels_path_idx" ON "landing_page_rels" USING btree ("path");
  CREATE INDEX "landing_page_rels_media_id_idx" ON "landing_page_rels" USING btree ("media_id");
  CREATE INDEX "_landing_page_v_version_hero_links_order_idx" ON "_landing_page_v_version_hero_links" USING btree ("_order");
  CREATE INDEX "_landing_page_v_version_hero_links_parent_id_idx" ON "_landing_page_v_version_hero_links" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_landing_page_v_version_hero_links_locales_locale_parent_id_" ON "_landing_page_v_version_hero_links_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_landing_page_v_version_hero_links_locales_parent_id_idx" ON "_landing_page_v_version_hero_links_locales" USING btree ("_parent_id");
  CREATE INDEX "_landing_page_v_version_version__status_idx" ON "_landing_page_v" USING btree ("version__status");
  CREATE INDEX "_landing_page_v_created_at_idx" ON "_landing_page_v" USING btree ("created_at");
  CREATE INDEX "_landing_page_v_updated_at_idx" ON "_landing_page_v" USING btree ("updated_at");
  CREATE INDEX "_landing_page_v_snapshot_idx" ON "_landing_page_v" USING btree ("snapshot");
  CREATE INDEX "_landing_page_v_published_locale_idx" ON "_landing_page_v" USING btree ("published_locale");
  CREATE INDEX "_landing_page_v_latest_idx" ON "_landing_page_v" USING btree ("latest");
  CREATE INDEX "_landing_page_v_autosave_idx" ON "_landing_page_v" USING btree ("autosave");
  CREATE UNIQUE INDEX "_landing_page_v_locales_locale_parent_id_unique" ON "_landing_page_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_landing_page_v_locales_parent_id_idx" ON "_landing_page_v_locales" USING btree ("_parent_id");
  CREATE INDEX "_landing_page_v_rels_order_idx" ON "_landing_page_v_rels" USING btree ("order");
  CREATE INDEX "_landing_page_v_rels_parent_idx" ON "_landing_page_v_rels" USING btree ("parent_id");
  CREATE INDEX "_landing_page_v_rels_path_idx" ON "_landing_page_v_rels" USING btree ("path");
  CREATE INDEX "_landing_page_v_rels_media_id_idx" ON "_landing_page_v_rels" USING btree ("media_id");
  CREATE INDEX "partner_section_partners_order_idx" ON "partner_section_partners" USING btree ("_order");
  CREATE INDEX "partner_section_partners_parent_id_idx" ON "partner_section_partners" USING btree ("_parent_id");
  CREATE INDEX "partner_section_partners_logo_idx" ON "partner_section_partners" USING btree ("logo_id");
  CREATE UNIQUE INDEX "partner_section_locales_locale_parent_id_unique" ON "partner_section_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "partner_section_locales_parent_id_idx" ON "partner_section_locales" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "documents" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "media_locales" CASCADE;
  DROP TABLE "pages" CASCADE;
  DROP TABLE "pages_locales" CASCADE;
  DROP TABLE "_pages_v" CASCADE;
  DROP TABLE "_pages_v_locales" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "main_navigation_items_children" CASCADE;
  DROP TABLE "main_navigation_items_children_locales" CASCADE;
  DROP TABLE "main_navigation_items" CASCADE;
  DROP TABLE "main_navigation_items_locales" CASCADE;
  DROP TABLE "main_navigation" CASCADE;
  DROP TABLE "main_navigation_locales" CASCADE;
  DROP TABLE "_main_navigation_v_version_items_children" CASCADE;
  DROP TABLE "_main_navigation_v_version_items_children_locales" CASCADE;
  DROP TABLE "_main_navigation_v_version_items" CASCADE;
  DROP TABLE "_main_navigation_v_version_items_locales" CASCADE;
  DROP TABLE "_main_navigation_v" CASCADE;
  DROP TABLE "_main_navigation_v_locales" CASCADE;
  DROP TABLE "footer" CASCADE;
  DROP TABLE "footer_locales" CASCADE;
  DROP TABLE "footer_texts" CASCADE;
  DROP TABLE "landing_page_hero_links" CASCADE;
  DROP TABLE "landing_page_hero_links_locales" CASCADE;
  DROP TABLE "landing_page" CASCADE;
  DROP TABLE "landing_page_locales" CASCADE;
  DROP TABLE "landing_page_rels" CASCADE;
  DROP TABLE "_landing_page_v_version_hero_links" CASCADE;
  DROP TABLE "_landing_page_v_version_hero_links_locales" CASCADE;
  DROP TABLE "_landing_page_v" CASCADE;
  DROP TABLE "_landing_page_v_locales" CASCADE;
  DROP TABLE "_landing_page_v_rels" CASCADE;
  DROP TABLE "partner_section_partners" CASCADE;
  DROP TABLE "partner_section" CASCADE;
  DROP TABLE "partner_section_locales" CASCADE;
  DROP TYPE "public"."_locales";
  DROP TYPE "public"."enum_pages_status";
  DROP TYPE "public"."enum__pages_v_version_status";
  DROP TYPE "public"."enum__pages_v_published_locale";
  DROP TYPE "public"."enum_main_navigation_items_children_type";
  DROP TYPE "public"."enum_main_navigation_items_type";
  DROP TYPE "public"."enum_main_navigation_status";
  DROP TYPE "public"."enum__main_navigation_v_version_items_children_type";
  DROP TYPE "public"."enum__main_navigation_v_version_items_type";
  DROP TYPE "public"."enum__main_navigation_v_version_status";
  DROP TYPE "public"."enum__main_navigation_v_published_locale";
  DROP TYPE "public"."enum_landing_page_status";
  DROP TYPE "public"."enum__landing_page_v_version_status";
  DROP TYPE "public"."enum__landing_page_v_published_locale";`)
}
