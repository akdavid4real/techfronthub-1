'use client'

import React, { useEffect, useState } from 'react'
import { CoursesPage } from '@/src/components/CoursesPage'

export default function Page() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState({
    categories: [],
    courses: [],
  })

  useEffect(() => {
    const BASE = '/api'
    const get = (path) => fetch(`${BASE}${path}`).then(r => r.json()).catch(() => null)

    Promise.all([
      get('/categories?limit=50'),
      get('/courses?limit=100'),
    ]).then(([cats, courses]) => {
      setData({
        categories: cats?.docs?.length ? cats.docs : [],
        courses: courses?.docs?.length ? courses.docs : [],
      })
    }).finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        color: 'var(--ink-500)'
      }}>
        Loading courses...
      </div>
    )
  }

  return <CoursesPage categories={data.categories} courses={data.courses} />
}
