'use client'

import React, { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { getCollection, deleteDoc } from '@/src/lib/payload-api'

const COLLECTION_META = {
  courses:       { title: 'Courses',       titleField: 'title',  cols: ['title', 'level', 'tag', 'price', 'lessons'] },
  categories:    { title: 'Categories',    titleField: 'title',  cols: ['title', 'icon', 'desc'] },
  packages:      { title: 'Packages',      titleField: 'name',   cols: ['name', 'price', 'per', 'featured'] },
  testimonials:  { title: 'Testimonials',  titleField: 'name',   cols: ['name', 'role', 'quote'] },
  'udemy-courses': { title: 'Udemy Courses', titleField: 'title', cols: ['title', 'author', 'rating', 'price'] },
  users:         { title: 'Users',         titleField: 'email',  cols: ['email'] },
}

function CellValue({ value, col }) {
  if (value === null || value === undefined || value === '') return <span style={{ color: 'var(--a-muted)' }}>—</span>
  if (typeof value === 'boolean') return value
    ? <span className="badge badge-green">Yes</span>
    : <span className="badge">No</span>
  if (col === 'quote') return <span style={{ color: 'var(--a-muted)', display: 'block', maxWidth: 260, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value}</span>
  return String(value)
}

export default function CollectionListPage() {
  const { slug } = useParams()
  const router = useRouter()
  const meta = COLLECTION_META[slug] || { title: slug, titleField: 'id', cols: ['id'] }

  const [docs, setDocs] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deleting, setDeleting] = useState(null)

  const LIMIT = 20

  const load = useCallback(() => {
    setLoading(true)
    setError('')
    getCollection(slug, { limit: LIMIT, page })
      .then(d => { setDocs(d.docs || []); setTotal(d.totalDocs || 0) })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [slug, page])

  useEffect(() => { load() }, [load])

  const handleDelete = async (id) => {
    if (!confirm('Delete this document?')) return
    setDeleting(id)
    try {
      await deleteDoc(slug, id)
      load()
    } catch (e) {
      alert(e.message)
    } finally {
      setDeleting(null)
    }
  }

  const pages = Math.ceil(total / LIMIT)

  return (
    <>
      <div className="admin-topbar">
        <div className="topbar-title">{meta.title}</div>
        <div className="topbar-actions">
          <span style={{ color: 'var(--a-muted)', fontSize: 12, marginRight: 8 }}>{total} total</span>
          {slug !== 'users' && (
            <Link href={`/admin/collections/${slug}/create`} className="btn btn-primary btn-sm">
              + New
            </Link>
          )}
        </div>
      </div>

      <div className="admin-content">
        {error && <div className="a-error" style={{ marginBottom: 16 }}>{error}</div>}

        <div className="a-card" style={{ padding: 0 }}>
          {loading ? (
            <div className="a-spinner" />
          ) : docs.length === 0 ? (
            <div className="a-empty">
              No {meta.title.toLowerCase()} yet.{' '}
              {slug !== 'users' && (
                <Link href={`/admin/collections/${slug}/create`} style={{ color: 'var(--a-brand)' }}>Create one →</Link>
              )}
            </div>
          ) : (
            <div className="a-table-wrap">
              <table className="a-table">
                <thead>
                  <tr>
                    {meta.cols.map(c => <th key={c}>{c}</th>)}
                    <th className="col-actions" />
                  </tr>
                </thead>
                <tbody>
                  {docs.map(doc => (
                    <tr key={doc.id} style={{ cursor: 'pointer' }} onClick={() => router.push(`/admin/collections/${slug}/${doc.id}`)}>
                      {meta.cols.map(c => (
                        <td key={c}><CellValue value={doc[c]} col={c} /></td>
                      ))}
                      <td className="col-actions" onClick={e => e.stopPropagation()}>
                        <button
                          className="btn btn-ghost btn-icon btn-sm"
                          title="Delete"
                          disabled={deleting === doc.id}
                          onClick={() => handleDelete(doc.id)}
                          style={{ color: 'var(--a-danger)' }}
                        >
                          {deleting === doc.id ? '…' : '✕'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {pages > 1 && (
          <div className="a-pagination">
            <button className="btn btn-ghost btn-sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
            <span>Page {page} of {pages}</span>
            <button className="btn btn-ghost btn-sm" disabled={page >= pages} onClick={() => setPage(p => p + 1)}>Next →</button>
          </div>
        )}
      </div>
    </>
  )
}
