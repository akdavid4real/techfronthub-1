'use client'

import React, { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { pageBg, shell, card } from '../../_components/ui'

function lessonDurationLabel(value) {
  return value || 'Duration not set'
}

export default function CourseLessonViewPage() {
  const params = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [course, setCourse] = useState(null)
  const [activeLesson, setActiveLesson] = useState(0)
  const [accessDenied, setAccessDenied] = useState(false)

  useEffect(() => {
    let active = true

    const token = typeof window !== 'undefined' ? localStorage.getItem('payload-token') : ''
    if (!token) {
      router.push('/student/login')
      return
    }

    const load = async () => {
      try {
        const res = await fetch(`/api/student/courses/${params.id}/lessons`, {
          headers: { Authorization: `JWT ${token}` },
        })
        const data = await res.json()

        if (!active) return
        if (res.status === 403) {
          setAccessDenied(true)
          setLoading(false)
          return
        }
        if (!res.ok) throw new Error(data?.message || `HTTP ${res.status}`)

        setCourse(data)
        setLoading(false)
      } catch (e) {
        if (!active) return
        setError(e.message || 'Failed to load lessons')
        setLoading(false)
      }
    }

    load()
    return () => { active = false }
  }, [params.id, router])

  const lessons = useMemo(() => {
    const list = Array.isArray(course?.courseContent) ? course.courseContent : []
    return list.map((lesson, index) => ({
      id: index + 1,
      title: lesson?.title || `Lesson ${index + 1}`,
      duration: lessonDurationLabel(lesson?.duration),
      summary: lesson?.summary || '',
      content: lesson?.content || '',
      videoUrls: Array.isArray(lesson?.videoUrls) ? lesson.videoUrls.map(v => v?.url).filter(Boolean) : [],
      resources: Array.isArray(lesson?.resources) ? lesson.resources.map(r => r?.url).filter(Boolean) : [],
    }))
  }, [course])

  const activeContent = lessons[activeLesson] || null

  if (loading) {
    return <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', color: 'var(--ink-400)' }}>Loading lessons...</div>
  }

  if (error || accessDenied) {
    return (
      <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24 }}>
        <div style={{ ...card, borderRadius: 16, padding: 24, maxWidth: 560, width: '100%' }}>
          <h2 style={{ margin: 0, color: 'var(--ink-900)' }}>{accessDenied ? 'Access restricted' : 'Could not load lessons'}</h2>
          <p style={{ color: 'var(--ink-600)' }}>{accessDenied ? 'You are not enrolled in this course yet.' : error}</p>
          <Link href="/student/dashboard/courses" style={{ color: 'var(--brand-600)', textDecoration: 'none', fontWeight: 600 }}>Back to My Courses</Link>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: pageBg.background }}>
      <div className="container" style={{ padding: shell.padding }}>
        <Link href="/student/dashboard/courses" style={{ color: 'var(--brand-600)', textDecoration: 'none', fontSize: 14 }}>Back to My Courses</Link>

        <div style={{ marginTop: 14, marginBottom: 20 }}>
          <h1 style={{ margin: '0 0 8px', color: 'var(--ink-900)', fontSize: 'clamp(28px,4vw,38px)' }}>{course?.title || 'Course Lessons'}</h1>
          <p style={{ margin: 0, color: 'var(--ink-600)' }}>{lessons.length} lesson{lessons.length === 1 ? '' : 's'} available</p>
        </div>

        {lessons.length === 0 ? (
          <div style={{ ...card, borderRadius: 16, padding: 20, color: 'var(--ink-600)' }}>
            No lesson content has been added for this course yet.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(250px, 320px) 1fr', gap: 16 }}>
            <aside style={{ ...card, borderRadius: 16, padding: 12, alignSelf: 'start', position: 'sticky', top: 16 }}>
              {lessons.map((lesson, idx) => (
                <button
                  key={lesson.id}
                  type="button"
                  onClick={() => setActiveLesson(idx)}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    background: idx === activeLesson ? 'rgba(37,99,235,0.10)' : 'transparent',
                    border: `1px solid ${idx === activeLesson ? 'rgba(37,99,235,0.3)' : 'var(--ink-200)'}`,
                    borderRadius: 10,
                    padding: 10,
                    marginBottom: 8,
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ color: 'var(--ink-900)', fontWeight: 700, fontSize: 14 }}>{lesson.title}</div>
                  <div style={{ color: 'var(--ink-500)', fontSize: 12, marginTop: 2 }}>{lesson.duration}</div>
                </button>
              ))}
            </aside>

            <section style={{ ...card, borderRadius: 16, padding: 22 }}>
              {activeContent && (
                <>
                  <h2 style={{ margin: '0 0 6px', color: 'var(--ink-900)' }}>{activeContent.title}</h2>
                  <p style={{ margin: '0 0 14px', color: 'var(--ink-500)', fontWeight: 600 }}>{activeContent.duration}</p>

                  {activeContent.summary && (
                    <div style={{ marginBottom: 16 }}>
                      <h3 style={{ margin: '0 0 8px', color: 'var(--ink-800)', fontSize: 16 }}>Summary</h3>
                      <p style={{ margin: 0, color: 'var(--ink-700)', lineHeight: 1.7 }}>{activeContent.summary}</p>
                    </div>
                  )}

                  {activeContent.content && (
                    <div style={{ marginBottom: 16 }}>
                      <h3 style={{ margin: '0 0 8px', color: 'var(--ink-800)', fontSize: 16 }}>Lesson Content</h3>
                      <pre style={{ margin: 0, whiteSpace: 'pre-wrap', fontFamily: 'inherit', color: 'var(--ink-700)', lineHeight: 1.8, background: 'var(--ink-50)', border: '1px solid var(--ink-200)', borderRadius: 12, padding: 14 }}>{activeContent.content}</pre>
                    </div>
                  )}

                  {activeContent.videoUrls.length > 0 && (
                    <div style={{ marginBottom: 16 }}>
                      <h3 style={{ margin: '0 0 8px', color: 'var(--ink-800)', fontSize: 16 }}>Videos</h3>
                      <ul style={{ margin: 0, paddingLeft: 18 }}>
                        {activeContent.videoUrls.map((url, i) => (
                          <li key={`${url}-${i}`} style={{ marginBottom: 8 }}>
                            <a href={url} target="_blank" rel="noreferrer" style={{ color: 'var(--brand-600)', textDecoration: 'none' }}>{url}</a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {activeContent.resources.length > 0 && (
                    <div>
                      <h3 style={{ margin: '0 0 8px', color: 'var(--ink-800)', fontSize: 16 }}>Resources</h3>
                      <ul style={{ margin: 0, paddingLeft: 18 }}>
                        {activeContent.resources.map((url, i) => (
                          <li key={`${url}-${i}`} style={{ marginBottom: 8 }}>
                            <a href={url} target="_blank" rel="noreferrer" style={{ color: 'var(--brand-600)', textDecoration: 'none' }}>{url}</a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              )}
            </section>
          </div>
        )}
      </div>
    </div>
  )
}
