import { getPayloadHMR } from '@payloadcms/next/utilities'
import config from '../payload.config.js'

// Course to Category mapping
const mapping = {
  33: 33, // UI/UX Design
  32: 32, // Python Programming
  31: 31, // Cloud Computing
  30: 30, // Cybersecurity
  29: 29, // HR Tech
  28: 28, // Tech for Kids
  27: 27, // Digital Marketing
  26: 26, // Web Development
  25: 25, // DevOps
  24: 24, // Data Analytics
  23: 23, // AI & Automation
}

async function fixCategoryLinks() {
  try {
    const payload = await getPayloadHMR({ config })

    console.log('🔧 Fixing course category links...\n')

    let success = 0
    let failed = 0

    for (const [courseId, categoryId] of Object.entries(mapping)) {
      try {
        // Fetch the course
        const course = await payload.find({
          collection: 'courses',
          where: { id: { equals: courseId } },
          limit: 1,
        })

        if (course.docs.length === 0) {
          console.log(`⚠️  Course ${courseId} not found`)
          continue
        }

        // Update the course with the category
        const updated = await payload.update({
          collection: 'courses',
          id: courseId,
          data: {
            category: categoryId,
          },
        })

        console.log(`✅ Course ${courseId} → Category ${categoryId}`)
        success++
      } catch (e) {
        console.log(`❌ Course ${courseId} error: ${e.message}`)
        failed++
      }
    }

    console.log(`\n✅ Done! ${success} linked, ${failed} failed`)
    process.exit(0)
  } catch (e) {
    console.error('Fatal error:', e.message)
    process.exit(1)
  }
}

fixCategoryLinks()
