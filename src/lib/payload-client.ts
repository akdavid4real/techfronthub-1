// Helper functions to fetch data from Payload CMS
// Note: In production, these would fetch from the Payload API endpoints
// For now, this serves as a template for when you wire up the actual API

export async function getCourses() {
  try {
    // const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/courses?limit=100`)
    // return res.json()
    return { docs: [] }
  } catch (err) {
    console.error('Failed to fetch courses:', err)
    return { docs: [] }
  }
}

export async function getTestimonials() {
  try {
    // const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/testimonials?limit=100`)
    // return res.json()
    return { docs: [] }
  } catch (err) {
    console.error('Failed to fetch testimonials:', err)
    return { docs: [] }
  }
}

export async function getCategories() {
  try {
    // const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/categories?limit=100`)
    // return res.json()
    return { docs: [] }
  } catch (err) {
    console.error('Failed to fetch categories:', err)
    return { docs: [] }
  }
}

export async function getPackages() {
  try {
    // const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/packages?limit=100`)
    // return res.json()
    return { docs: [] }
  } catch (err) {
    console.error('Failed to fetch packages:', err)
    return { docs: [] }
  }
}

export async function getUdemyCourses() {
  try {
    // const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/udemy-courses?limit=100`)
    // return res.json()
    return { docs: [] }
  } catch (err) {
    console.error('Failed to fetch Udemy courses:', err)
    return { docs: [] }
  }
}

export async function getSiteConfig() {
  try {
    // const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/globals/site-config`)
    // return res.json()
    return {}
  } catch (err) {
    console.error('Failed to fetch site config:', err)
    return {}
  }
}
