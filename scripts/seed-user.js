#!/usr/bin/env node

async function createUser() {
  try {
    const res = await fetch('http://localhost:3000/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@techfronthub.com',
        password: 'Admin@2026'
      })
    })

    const data = await res.json()

    if (!res.ok) {
      if (data.message?.includes('duplicate') || data.message?.includes('already exists')) {
        console.log('✓ User already exists')
        process.exit(0)
      }
      throw new Error(data.message || `Request failed: ${res.status}`)
    }

    console.log('✓ Admin user created:')
    console.log(`  Email: ${data.doc?.email || data.email}`)
    console.log(`  Password: Admin@2026`)
    console.log('\nLogin at: http://localhost:3000/admin/login')
    process.exit(0)
  } catch (err) {
    console.error('Error:', err.message)
    console.error('\nNote: Make sure dev server is running on http://localhost:3000')
    process.exit(1)
  }
}

createUser()
