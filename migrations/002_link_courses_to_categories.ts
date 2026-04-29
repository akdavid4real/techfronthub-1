import { sql } from 'drizzle-orm'

export const up = async ({ db }) => {
  const mapping = {
    33: 33, 32: 32, 31: 31, 30: 30, 29: 29, 28: 28, 27: 27, 26: 26, 25: 25, 24: 24, 23: 23,
  }

  console.log('🔧 Linking courses to categories...')

  for (const [courseId, categoryId] of Object.entries(mapping)) {
    try {
      await db.execute(sql`
        UPDATE courses
        SET category_id = ${categoryId}
        WHERE id = ${courseId}
      `)
      console.log(`✅ Course ${courseId} → Category ${categoryId}`)
    } catch (e) {
      console.error(`❌ Course ${courseId}:`, e.message)
    }
  }

  console.log('✅ Done!')
}

export const down = async ({ db }) => {
  await db.execute(sql`UPDATE courses SET category_id = NULL`)
}
