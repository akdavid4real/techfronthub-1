'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { getGlobal, updateGlobal } from '@/src/lib/payload-api'

const GLOBALS_SCHEMA = {
  'site-config': [
    { section: 'Hero', fields: [
      { name: 'heroBadge',    type: 'text',     label: 'Badge Text' },
      { name: 'heroHeadline', type: 'text',     label: 'Headline' },
      { name: 'heroLede',     type: 'textarea', label: 'Sub-headline' },
    ]},
    { section: 'Stats', fields: [
      { name: 'statLearners',  type: 'text', label: 'Learners Count' },
      { name: 'statCourses',   type: 'text', label: 'Courses Count' },
      { name: 'statPlacement', type: 'text', label: 'Placement Rate' },
      { name: 'statRating',    type: 'text', label: 'Rating' },
    ]},
    { section: 'CTA', fields: [
      { name: 'ctaHeadline', type: 'text',     label: 'CTA Headline' },
      { name: 'ctaBody',     type: 'textarea', label: 'CTA Body' },
    ]},
    { section: 'Trusted Companies', fields: [
      { name: 'trustedCompanies', type: 'array', label: 'Company Names' },
    ]},
  ],
}

function ArrayField({ label, value = [], onChange }) {
  const items = Array.isArray(value) ? value : []
  const update = (i, v) => { const n = [...items]; n[i] = { name: v }; onChange(n) }
  const add = () => onChange([...items, { name: '' }])
  const remove = (i) => onChange(items.filter((_, idx) => idx !== i))

  return (
    <div className="a-field" style={{ gridColumn: '1 / -1' }}>
      <label className="a-label">{label}</label>
      <div className="array-builder">
        {items.map((item, i) => (
          <div key={i} className="array-item">
            <input
              value={item?.name ?? ''}
              onChange={e => update(i, e.target.value)}
              placeholder={`Company ${i + 1}`}
            />
            <button type="button" className="btn btn-ghost btn-icon btn-sm" style={{ color: 'var(--a-danger)', flexShrink: 0 }} onClick={() => remove(i)}>✕</button>
          </div>
        ))}
        <button type="button" className="btn btn-ghost btn-sm" style={{ alignSelf: 'flex-start' }} onClick={add}>+ Add</button>
      </div>
    </div>
  )
}

export default function GlobalEditorPage() {
  const { slug } = useParams()
  const schema = GLOBALS_SCHEMA[slug] || []

  const [data, setData] = useState({})
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    getGlobal(slug)
      .then(d => setData(d))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [slug])

  const set = (name, value) => setData(prev => ({ ...prev, [name]: value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    setSaved(false)
    try {
      await updateGlobal(slug, data)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const renderField = (f) => {
    if (f.type === 'array') return (
      <ArrayField key={f.name} label={f.label} value={data[f.name]} onChange={v => set(f.name, v)} />
    )
    if (f.type === 'textarea') return (
      <div key={f.name} className="a-field" style={{ gridColumn: '1 / -1' }}>
        <label className="a-label">{f.label}</label>
        <textarea className="a-textarea" value={data[f.name] || ''} onChange={e => set(f.name, e.target.value)} />
      </div>
    )
    return (
      <div key={f.name} className="a-field">
        <label className="a-label">{f.label}</label>
        <input className="a-input" type="text" value={data[f.name] || ''} onChange={e => set(f.name, e.target.value)} />
      </div>
    )
  }

  const title = slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())

  return (
    <>
      <div className="admin-topbar">
        <div className="topbar-title">{title}</div>
        <div className="topbar-actions">
          <button className="btn btn-primary btn-sm" form="global-form" type="submit" disabled={submitting}>
            {submitting ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>

      <div className="admin-content">
        {error && <div className="a-error" style={{ marginBottom: 16 }}>{error}</div>}
        {saved && <div className="a-success-msg" style={{ marginBottom: 16 }}>Saved successfully.</div>}

        {loading ? (
          <div className="a-spinner" />
        ) : (
          <form id="global-form" onSubmit={handleSubmit}>
            {schema.map(({ section, fields }) => (
              <div key={section} className="a-card" style={{ maxWidth: 720, marginBottom: 20 }}>
                <div className="a-card-header">
                  <div className="a-card-title">{section}</div>
                </div>
                <div className="form-grid-2">
                  {fields.map(renderField)}
                </div>
              </div>
            ))}
          </form>
        )}
      </div>
    </>
  )
}
