import dotenv from 'dotenv'
import { Pool } from 'pg'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const mapping = {
  33: 33,
  32: 32,
  31: 31,
  30: 30,
  29: 29,
  28: 28,
  27: 27,
  26: 26,
  25: 25,
  24: 24,
  23: 23,
}

async function fixDatabase() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  })

  try {
    console.log('🔧 Fixing course-category relationships...\n')

    let updated = 0

    for (const [courseId, categoryId] of Object.entries(mapping)) {
      const res = await pool.query(
        'UPDATE courses SET category_id = $1 WHERE id = $2 RETURNING id',
        [categoryId, courseId]
      )

      if (res.rowCount > 0) {
        console.log(`✅ Course ${courseId} → Category ${categoryId}`)
        updated++
      } else {
        console.log(`⚠️  Course ${courseId} not found`)
      }
    }

    console.log(`\n✅ Updated ${updated} courses`)
  } catch (e) {
    console.error('❌ Error:', e.message)
  } finally {
    await pool.end()
  }
}

fixDatabase()
