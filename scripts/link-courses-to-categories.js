// Run this with: node scripts/link-courses-to-categories.js

const mapping = {
  33: 33, // UI/UX Design
  32: 32, // Python Programming
  31: 31, // Cloud Computing
  30: 30, // Cybersecurity
  29: 29, // HR Tech
  28: 28, // Tech for Kids
  27: 27, // Digital Marketing... wait
  26: 26, // Web Development
  25: 25, // DevOps
  24: 24, // Data Analytics
  23: 23, // AI & Automation
}

async function linkCoursesToCategories() {
  try {
    console.log('🔄 Linking courses to categories...\n')

    let success = 0
    let failed = 0

    for (const [courseId, categoryId] of Object.entries(mapping)) {
      try {
        const response = await fetch(`http://localhost:3000/api/courses/${courseId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ category: parseInt(categoryId) })
        })

        if (response.ok) {
          console.log(`✅ Course ${courseId} → Category ${categoryId}`)
          success++
        } else {
          console.log(`❌ Course ${courseId} failed: ${response.status}`)
          failed++
        }
      } catch (e) {
        console.log(`❌ Course ${courseId} error: ${e.message}`)
        failed++
      }
    }

    console.log(`\n✅ Done! ${success} linked, ${failed} failed`)
  } catch (e) {
    console.error('Error:', e.message)
  }
}

linkCoursesToCategories()
