#!/usr/bin/env node

const BASE = 'http://localhost:3001/api'

const COURSES_BY_CATEGORY = {
  'Data Analytics': [
    { tag: 'BOOTCAMP',    tagHot: true,  code: 'DA-201',   title: 'Data Analytics Bootcamp',        desc: 'Master Excel, SQL, Power BI and Python for real-world business analysis.',                    duration: '12 weeks', lessons: 86,  level: 'Intermediate', price: '₦185,000', old: '₦250,000', hue: 214 },
  ],
  'AI & Automation': [
    { tag: 'NEW',         tagHot: false, code: 'AI-110',   title: 'Applied AI & Automation',         desc: 'Build practical AI agents, prompt systems and automations for business.',                     duration: '8 weeks',  lessons: 62,  level: 'All levels',   price: '₦220,000', old: null,        hue: 225 },
  ],
  'DevOps': [
    { tag: 'POPULAR',     tagHot: true,  code: 'DVOP-305', title: 'DevOps Engineering Track',        desc: 'Linux, Git, Docker, Kubernetes, CI/CD and cloud deployment in one program.',                  duration: '14 weeks', lessons: 104, level: 'Advanced',     price: '₦265,000', old: '₦320,000', hue: 205 },
  ],
  'Web Development': [
    { tag: 'LIVE',        tagHot: false, code: 'WEB-140',  title: 'Full-Stack Web Development',      desc: 'HTML/CSS, JavaScript, React, Node and databases — ship a real product.',                      duration: '16 weeks', lessons: 120, level: 'Beginner',     price: '₦195,000', old: null,        hue: 218 },
  ],
  'Digital Marketing': [
    { tag: 'BOOTCAMP',    tagHot: false, code: 'DM-070',   title: 'Digital Marketing Mastery',       desc: 'SEO, paid ads, content, email and analytics — end-to-end playbook.',                         duration: '6 weeks',  lessons: 48,  level: 'Beginner',     price: '₦95,000',  old: '₦130,000', hue: 230 },
  ],
  'Tech for Kids': [
    { tag: 'BOOTCAMP',    tagHot: false, code: 'KIDS-020', title: 'Tech for Kids (Ages 8–14)',       desc: 'Scratch, Python and robotics fundamentals through projects and play.',                        duration: '10 weeks', lessons: 40,  level: 'Beginner',     price: '₦75,000',  old: null,        hue: 210 },
  ],
  'HR Tech': [
    { tag: 'ADVANCED',    tagHot: false, code: 'HR-150',   title: 'HR Tech & People Analytics',      desc: 'Modern HR tooling, analytics dashboards and workforce reporting.',                             duration: '8 weeks',  lessons: 54,  level: 'Intermediate', price: '₦160,000', old: null,        hue: 222 },
  ],
  'Cybersecurity': [
    { tag: 'NEW',         tagHot: true,  code: 'SEC-200',  title: 'Cybersecurity Fundamentals',      desc: 'Threat modelling, network defence, ethical hacking basics and compliance.',                   duration: '10 weeks', lessons: 72,  level: 'Intermediate', price: '₦210,000', old: '₦260,000', hue: 208 },
  ],
  'Cloud Computing': [
    { tag: 'BOOTCAMP',    tagHot: false, code: 'CLD-180',  title: 'Cloud Computing (AWS)',           desc: 'EC2, S3, Lambda, RDS and serverless — architect and deploy on AWS.',                         duration: '12 weeks', lessons: 90,  level: 'Intermediate', price: '₦240,000', old: null,        hue: 200 },
  ],
  'Python Programming': [
    { tag: 'POPULAR',     tagHot: true,  code: 'PY-130',   title: 'Python for Data Science',         desc: 'NumPy, Pandas, Matplotlib, Scikit-learn and real ML projects from scratch.',                  duration: '10 weeks', lessons: 78,  level: 'Beginner',     price: '₦155,000', old: '₦200,000', hue: 217 },
  ],
  'UI/UX Design': [
    { tag: 'BOOTCAMP',    tagHot: false, code: 'UX-090',   title: 'UI/UX Design Fundamentals',       desc: 'Figma, design systems, user research and end-to-end product prototyping.',                    duration: '8 weeks',  lessons: 58,  level: 'Beginner',     price: '₦130,000', old: null,        hue: 235 },
  ],
}

async function api(method, path, data) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    ...(data ? { body: JSON.stringify(data) } : {}),
  })
  const json = await res.json()
  if (!res.ok) {
    const msg = json.message || json.error || `${method} ${path} → ${res.status}`
    throw new Error(msg)
  }
  return json
}

async function run() {
  console.log('🔗 Seeding Courses with Category Links')
  console.log('=====================================')
  console.log('Target:', BASE)

  try {
    // Get all categories
    const catsRes = await api('GET', '/categories?limit=100')
    const categoryMap = {}
    catsRes.docs.forEach(cat => {
      categoryMap[cat.title] = cat.id
    })
    console.log('\n📚 Found categories:')
    Object.entries(categoryMap).forEach(([title, id]) => {
      console.log(`  - ${title} (ID: ${id})`)
    })

    // Delete all existing courses
    const existingRes = await api('GET', '/courses?limit=100')
    if (existingRes.docs.length > 0) {
      console.log(`\n🗑️  Clearing ${existingRes.docs.length} existing courses...`)
      for (const course of existingRes.docs) {
        await api('DELETE', `/courses/${course.id}`)
      }
    }

    // Create courses
    console.log('\n📖 Creating courses with category links...')
    let created = 0, failed = 0

    for (const [catTitle, courses] of Object.entries(COURSES_BY_CATEGORY)) {
      const categoryId = categoryMap[catTitle]
      if (!categoryId) {
        console.warn(`  ⚠️  Category not found: ${catTitle}`)
        continue
      }

      for (const course of courses) {
        try {
          await api('POST', '/courses', { ...course, category: categoryId })
          console.log(`  ✅ ${course.title} → ${catTitle}`)
          created++
        } catch (e) {
          console.warn(`  ❌ ${course.title}: ${e.message}`)
          failed++
        }
      }
    }

    console.log(`\n✅ Done! ${created} created, ${failed} failed`)
  } catch (e) {
    console.error('❌ Error:', e.message)
    process.exit(1)
  }
}

run()
