'use client'

import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

function authHeaders() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('instructor-token') : ''
  return { Authorization: `JWT ${token}`, 'Content-Type': 'application/json' }
}

function makeLesson() {
  return { title: '', duration: '', summary: '', content: '', videoUrls: [{ url: '' }], resources: [{ url: '' }] }
}

export default function LessonBuilderPage() {
  const { id } = useParams()
  const [courseTitle, setCourseTitle] = useState('Course')
  const [lessons, setLessons] = useState([makeLesson()])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const loadCourse = useCallback(() => {
    if (!id) return
    setLoading(true)
    fetch(`/api/courses/${id}`, { headers: authHeaders() })
      .then(r => r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`)))
      .then(data => {
        const doc = data?.doc ?? data
        const list = Array.isArray(doc?.courseContent) && doc.courseContent.length > 0
          ? doc.courseContent.map(item => ({
              title: item?.title ?? '',
              duration: item?.duration ?? '',
              summary: item?.summary ?? '',
              content: item?.content ?? '',
              videoUrls: Array.isArray(item?.videoUrls) && item.videoUrls.length > 0
                ? item.videoUrls.map(v => ({ url: v?.url ?? '' }))
                : [{ url: '' }],
              resources: Array.isArray(item?.resources) && item.resources.length > 0
                ? item.resources.map(r => ({ url: r?.url ?? '' }))
                : [{ url: '' }],
            }))
          : [makeLesson()]

        setCourseTitle(doc?.title ?? 'Course')
        setLessons(list)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [id])

  useEffect(() => { loadCourse() }, [loadCourse])

  function updateLesson(index, field, value) {
    setLessons(prev => prev.map((lesson, i) => i === index ? { ...lesson, [field]: value } : lesson))
    setMessage('')
  }

  function addLesson() {
    setLessons(prev => [...prev, makeLesson()])
    setMessage('')
  }

  function removeLesson(index) {
    setLessons(prev => prev.length === 1 ? prev : prev.filter((_, i) => i !== index))
    setMessage('')
  }

  function updateResource(lessonIndex, resourceIndex, value) {
    setLessons(prev => prev.map((lesson, i) => {
      if (i !== lessonIndex) return lesson
      return {
        ...lesson,
        resources: lesson.resources.map((r, ri) => ri === resourceIndex ? { url: value } : r),
      }
    }))
    setMessage('')
  }

  function addResource(lessonIndex) {
    setLessons(prev => prev.map((lesson, i) => i === lessonIndex
      ? { ...lesson, resources: [...lesson.resources, { url: '' }] }
      : lesson))
    setMessage('')
  }

  function removeResource(lessonIndex, resourceIndex) {
    setLessons(prev => prev.map((lesson, i) => {
      if (i !== lessonIndex) return lesson
      return {
        ...lesson,
        resources: lesson.resources.length === 1
          ? lesson.resources
          : lesson.resources.filter((_, ri) => ri !== resourceIndex),
      }
    }))
    setMessage('')
  }

  function updateVideo(lessonIndex, videoIndex, value) {
    setLessons(prev => prev.map((lesson, i) => {
      if (i !== lessonIndex) return lesson
      return {
        ...lesson,
        videoUrls: lesson.videoUrls.map((v, vi) => vi === videoIndex ? { url: value } : v),
      }
    }))
    setMessage('')
  }

  function addVideo(lessonIndex) {
    setLessons(prev => prev.map((lesson, i) => i === lessonIndex
      ? { ...lesson, videoUrls: [...lesson.videoUrls, { url: '' }] }
      : lesson))
    setMessage('')
  }

  function removeVideo(lessonIndex, videoIndex) {
    setLessons(prev => prev.map((lesson, i) => {
      if (i !== lessonIndex) return lesson
      return {
        ...lesson,
        videoUrls: lesson.videoUrls.length === 1
          ? lesson.videoUrls
          : lesson.videoUrls.filter((_, vi) => vi !== videoIndex),
      }
    }))
    setMessage('')
  }

  async function saveLessons() {
    const cleaned = lessons
      .map(lesson => ({
        title: lesson.title.trim(),
        duration: lesson.duration.trim(),
        summary: lesson.summary.trim(),
        content: lesson.content.trim(),
        videoUrls: lesson.videoUrls
          .map(v => ({ url: (v.url || '').trim() }))
          .filter(v => v.url),
        resources: lesson.resources
          .map(r => ({ url: (r.url || '').trim() }))
          .filter(r => r.url),
      }))
      .filter(lesson => lesson.title || lesson.content || lesson.summary)

    if (cleaned.length === 0) {
      setError('Add at least one lesson with a title, summary, or content before saving.')
      return
    }

    setSaving(true)
    setError('')
    setMessage('')

    try {
      const res = await fetch(`/api/courses/${id}`, {
        method: 'PATCH',
        headers: authHeaders(),
        body: JSON.stringify({ courseContent: cleaned, lessons: cleaned.length }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.errors?.[0]?.message ?? data?.message ?? 'Failed to save')
      setMessage('Lessons saved successfully.')
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="i-page"><div className="i-loading"><div className="i-spinner" /> Loading lesson builder...</div></div>
  }

  return (
    <div className="i-page">
      <nav className="i-breadcrumb">
        <Link href="/instructor/courses">My Courses</Link>
        <span className="i-sep">/</span>
        <Link href={`/instructor/courses/${id}`}>{courseTitle}</Link>
        <span className="i-sep">/</span>
        <span className="current">Lesson Builder</span>
      </nav>

      <div className="i-page-header">
        <div className="i-page-header-left">
          <h1>Lesson Builder</h1>
          <p>Create full lesson content for {courseTitle}.</p>
        </div>
      </div>

      {error && <div className="i-alert i-alert-error">{error}</div>}
      {message && <div className="i-alert i-alert-success">{message}</div>}

      <div className="i-lesson-stack">
        {lessons.map((lesson, i) => (
          <section key={i} className="i-form-section">
            <div className="i-form-section-header">
              <h2 className="i-form-section-title">Lesson {i + 1}</h2>
            </div>
            <div className="i-form-section-body">
              <div className="i-form-grid">
                <div className="i-field">
                  <label className="i-label">Lesson Title</label>
                  <input className="i-input" value={lesson.title} onChange={e => updateLesson(i, 'title', e.target.value)} placeholder="e.g. API Authentication Basics" />
                </div>
                <div className="i-field">
                  <label className="i-label">Duration</label>
                  <input className="i-input" value={lesson.duration} onChange={e => updateLesson(i, 'duration', e.target.value)} placeholder="e.g. 45 minutes" />
                </div>
              </div>

              <div className="i-field">
                <label className="i-label">Summary</label>
                <textarea className="i-textarea" rows={2} value={lesson.summary} onChange={e => updateLesson(i, 'summary', e.target.value)} placeholder="Short summary students see before opening this lesson." />
              </div>

              <div className="i-field">
                <label className="i-label">Lesson Content</label>
                <textarea className="i-textarea" rows={8} value={lesson.content} onChange={e => updateLesson(i, 'content', e.target.value)} placeholder="Full lesson notes, instructions, exercises, examples..." />
              </div>

              <div className="i-field">
                <label className="i-label">Video URLs</label>
                <div className="i-array-builder">
                  {lesson.videoUrls.map((video, vi) => (
                    <div key={vi} className="i-array-row">
                      <input className="i-input i-input-grow" value={video.url} onChange={e => updateVideo(i, vi, e.target.value)} placeholder="https://youtube.com/... or https://vimeo.com/..." />
                      <button type="button" className="i-btn i-btn-ghost i-btn-sm" onClick={() => removeVideo(i, vi)} disabled={lesson.videoUrls.length === 1}>Remove</button>
                    </div>
                  ))}
                  <button type="button" className="i-btn i-btn-secondary i-btn-sm" onClick={() => addVideo(i)}>Add Video URL</button>
                </div>
              </div>

              <div className="i-field">
                <label className="i-label">Resources</label>
                <div className="i-array-builder">
                  {lesson.resources.map((resource, ri) => (
                    <div key={ri} className="i-array-row">
                      <input className="i-input i-input-grow" value={resource.url} onChange={e => updateResource(i, ri, e.target.value)} placeholder="https://resource-link" />
                      <button type="button" className="i-btn i-btn-ghost i-btn-sm" onClick={() => removeResource(i, ri)} disabled={lesson.resources.length === 1}>Remove</button>
                    </div>
                  ))}
                  <button type="button" className="i-btn i-btn-secondary i-btn-sm" onClick={() => addResource(i)}>Add Resource</button>
                </div>
              </div>

              <div className="i-form-actions">
                <button type="button" className="i-btn i-btn-danger i-btn-sm" onClick={() => removeLesson(i)} disabled={lessons.length === 1}>Delete Lesson</button>
              </div>
            </div>
          </section>
        ))}
      </div>

      <div className="i-form-actions" style={{ marginTop: 16 }}>
        <button type="button" className="i-btn i-btn-secondary" onClick={addLesson}>+ Add Lesson</button>
        <button type="button" className="i-btn i-btn-primary" onClick={saveLessons} disabled={saving}>{saving ? 'Saving...' : 'Save Lessons'}</button>
      </div>
    </div>
  )
}
