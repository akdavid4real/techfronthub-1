import { sql } from 'drizzle-orm'

export const up = async ({ db }) => {
  await db.execute(sql`
    ALTER TABLE "users"
      ADD COLUMN IF NOT EXISTS "name" text,
      ADD COLUMN IF NOT EXISTS "role" text DEFAULT 'student',
      ADD COLUMN IF NOT EXISTS "status" text DEFAULT 'active',
      ADD COLUMN IF NOT EXISTS "phone" text,
      ADD COLUMN IF NOT EXISTS "avatar" text
  `)
}

export const down = async ({ db }) => {
  await db.execute(sql`
    ALTER TABLE "users"
      DROP COLUMN IF EXISTS "avatar",
      DROP COLUMN IF EXISTS "phone",
      DROP COLUMN IF EXISTS "status",
      DROP COLUMN IF EXISTS "role",
      DROP COLUMN IF EXISTS "name"
  `)
}
