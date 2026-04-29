'use client'

import React, { useState } from 'react'

const SCHEMA = {
  courses: [
    { name: 'title',    type: 'text',     required: true },
    { name: 'code',     type: 'text' },
    { name: 'desc',     type: 'text' },
    { name: 'tag',      type: 'select',   options: ['BOOTCAMP', 'NEW', 'POPULAR', 'ADVANCED', 'LIVE'] },
    { name: 'tagHot',   type: 'checkbox' },
    { name: 'level',    type: 'select',   options: ['Beginner', 'Intermediate', 'Advanced', 'All levels'] },
    { name: 'duration', type: 'text' },
    { name: 'lessons',  type: 'number' },
    { name: 'price',    type: 'text' },
    { name: 'old',      type: 'text',     label: 'Old Price' },
    { name: 'hue',      type: 'number',   label: 'Card Hue (0–360)' },
  ],
  categories: [
    { name: 'title', type: 'text', required: true },
    { name: 'n',     type: 'text', label: 'Short Name' },
    { name: 'desc',  type: 'text' },
    { name: 'count', type: 'text' },
    { name: 'icon',  type: 'select', options: ['Code', 'Brain', 'Zap', 'Target', 'Rocket', 'Users', 'Shield', 'TrendingUp'] },
  ],
  packages: [
    { name: 'name',      type: 'text',     required: true },
    { name: 'icon',      type: 'select',   options: ['BookOpen', 'Video', 'Users', 'MessageCircle'] },
    { name: 'featured',  type: 'checkbox' },
    { name: 'badge',     type: 'text' },
    { name: 'desc',      type: 'text' },
    { name: 'price',     type: 'text' },
    { name: 'per',       type: 'text',     label: 'Per (e.g. /month)' },
    { name: 'features',  type: 'array',    label: 'Feature List' },
    { name: 'sortOrder', type: 'number' },
  ],
  testimonials: [
    { name: 'name',     type: 'text',     required: true },
    { name: 'role',     type: 'text' },
    { name: 'initials', type: 'text',     label: 'Initials (2 chars)' },
    { name: 'quote',    type: 'textarea', required: true },
  ],
  'udemy-courses': [
    { name: 'title',  type: 'text',   required: true },
    { name: 'author', type: 'text' },
    { name: 'rating', type: 'number' },
    { name: 'count',  type: 'text',   label: 'Review Count' },
    { name: 'hours',  type: 'text' },
    { name: 'price',  type: 'text' },
    { name: 'hue',    type: 'number', label: 'Card Hue (0–360)' },
  ],
  users: [
    { name: 'email',    type: 'text',     required: true },
    { name: 'password', type: 'password', label: 'New Password' },
  ],
}

function ArrayField({ label, value = [], onChange }) {
  const items = Array.isArray(value) ? value : []
  const update = (i, v) => { const n = [...items]; n[i] = { feature: v }; onChange(n) }
  const add = () => onChange([...items, { feature: '' }])
  const remove = (i) => onChange(items.filter((_, idx) => idx !== i))

  return (
    <div className="a-field">
      <label className="a-label">{label}</label>
      <div className="array-builder">
        {items.map((item, i) => (
          <div key={i} className="array-item">
            <input
              value={item?.feature ?? ''}
              onChange={e => update(i, e.target.value)}
              placeholder={`Item ${i + 1}`}
            />
            <button type="button" className="btn btn-ghost btn-icon btn-sm" style={{ color: 'var(--a-danger)', flexShrink: 0 }} onClick={() => remove(i)}>✕</button>
          </div>
        ))}
        <button type="button" className="btn btn-ghost btn-sm" style={{ alignSelf: 'flex-start' }} onClick={add}>+ Add item</button>
      </div>
    </div>
  )
}

export default function DocForm({ slug, initialData = {}, onSubmit, submitting, submitLabel = 'Save' }) {
  const fields = SCHEMA[slug] || []
  const [data, setData] = useState(() => {
    const d = { ...initialData }
    fields.forEach(f => { if (!(f.name in d)) d[f.name] = f.type === 'checkbox' ? false : f.type === 'array' ? [] : '' })
    return d
  })

  const set = (name, value) => setData(prev => ({ ...prev, [name]: value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    const payload = { ...data }
    if (slug === 'users' && !payload.password) delete payload.password
    onSubmit(payload)
  }

  const renderField = (f) => {
    const label = f.label || f.name.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())

    if (f.type === 'array') return (
      <ArrayField key={f.name} label={label} value={data[f.name]} onChange={v => set(f.name, v)} />
    )

    if (f.type === 'checkbox') return (
      <div key={f.name} className="a-field">
        <div className="a-checkbox-row">
          <input id={f.name} type="checkbox" className="a-checkbox" checked={!!data[f.name]} onChange={e => set(f.name, e.target.checked)} />
          <label htmlFor={f.name} className="a-label" style={{ marginBottom: 0, cursor: 'pointer' }}>{label}</label>
        </div>
      </div>
    )

    if (f.type === 'textarea') return (
      <div key={f.name} className="a-field" style={{ gridColumn: '1 / -1' }}>
        <label className="a-label">{label}{f.required && ' *'}</label>
        <textarea className="a-textarea" value={data[f.name] || ''} onChange={e => set(f.name, e.target.value)} required={f.required} />
      </div>
    )

    if (f.type === 'select') return (
      <div key={f.name} className="a-field">
        <label className="a-label">{label}</label>
        <select className="a-select" value={data[f.name] || ''} onChange={e => set(f.name, e.target.value)}>
          <option value="">— none —</option>
          {f.options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      </div>
    )

    return (
      <div key={f.name} className="a-field">
        <label className="a-label">{label}{f.required && ' *'}</label>
        <input
          className="a-input"
          type={f.type === 'number' ? 'number' : f.type === 'password' ? 'password' : 'text'}
          value={data[f.name] ?? ''}
          onChange={e => set(f.name, f.type === 'number' ? (e.target.value === '' ? '' : Number(e.target.value)) : e.target.value)}
          required={f.required}
          {...(f.name === 'initials' ? { maxLength: 2 } : {})}
        />
      </div>
    )
  }

  const gridFields = fields.filter(f => f.type !== 'array' && f.type !== 'textarea')
  const fullFields = fields.filter(f => f.type === 'array' || f.type === 'textarea')

  return (
    <form className="a-form" onSubmit={handleSubmit}>
      <div className="form-grid-2">
        {gridFields.map(renderField)}
      </div>
      {fullFields.map(renderField)}
      <div style={{ marginTop: 4 }}>
        <button className="btn btn-primary" type="submit" disabled={submitting}>
          {submitting ? 'Saving…' : submitLabel}
        </button>
      </div>
    </form>
  )
}
