import { sql } from "drizzle-orm";
import { index, pgTableCreator, text, timestamp, varchar } from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `guestlist_${name}`);

export const guests = createTable(
  "guest",
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    name: d.varchar({ length: 256 }).notNull(),
    phone: d.varchar({ length: 20 }),
    email: d.varchar({ length: 256 }).notNull(),
    note: d.text(), // Private note to admin
    publicAction: d.varchar({ length: 100 }).notNull(), // "Just saying hi!", "Let's connect!", "Downloaded the resume"
    role: d.varchar({ length: 50 }).notNull(), // "business owner", "recruiter", "developer", "hiring manager", "professional", "friend", "other"
    displayNamePref: d.varchar({ length: 20 }).notNull(), // "full", "initial", "anonymous"
    profileImageUrl: d.varchar({ length: 500 }), // Google profile image URL
    hidden: d.boolean().default(false).notNull(), // Hide inappropriate comments
    createdAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  }),
  (t) => [
    index("email_idx").on(t.email),
    index("created_at_idx").on(t.createdAt),
    index("role_idx").on(t.role),
    index("hidden_idx").on(t.hidden),
  ]
);

export const profile = createTable(
  "profile",
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    name: d.varchar({ length: 256 }).notNull(),
    aboutMe: d.text().notNull(),
    networkingStatement: d.text().notNull(),
    profilePictureUrl: d.varchar({ length: 500 }).notNull(),
    appIconUrl: d.varchar({ length: 500 }), // App icon URL
    linkedinUrl: d.varchar({ length: 500 }),
    githubUrl: d.varchar({ length: 500 }),
    buyMeACoffeeUrl: d.varchar({ length: 500 }),
    portfolioUrl: d.varchar({ length: 500 }),
    resumeUrl: d.varchar({ length: 500 }),
    notificationEmail: d.varchar({ length: 256 }).notNull(),
    createdAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  })
);

export const resumes = createTable(
  "resume",
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    fileName: d.varchar({ length: 256 }).notNull(),
    fileUrl: d.varchar({ length: 500 }).notNull(),
    fileSize: d.integer().notNull(), // Size in bytes
    fileType: d.varchar({ length: 50 }).notNull(), // MIME type
    uploadThingId: d.varchar({ length: 100 }).notNull(), // UploadThing file ID
    isCurrent: d.boolean().default(false).notNull(), // Only one resume can be current at a time
    downloadCount: d.integer().default(0).notNull(), // Track downloads
    createdAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  }),
  (t) => [
    index("resume_upload_thing_id_idx").on(t.uploadThingId),
    index("resume_is_current_idx").on(t.isCurrent),
    index("resume_created_at_idx").on(t.createdAt),
  ]
);
