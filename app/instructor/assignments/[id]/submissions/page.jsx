'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useInstructor } from '../../../context'

const auth = () => ({ Authorization: `JWT ${localStorage.getItem('instructor-token')}` })

const STATUS_BADGE = {
  submitted: <span className="i-badge i-badge-orange"><span className="i-dot i-dot-orange" />Submitted</span>,
  graded:    <span className="i-badge i-badge-green"><span className="i-dot i-dot-green" />Graded</span>,
  returned:  <span className="i-badge i-badge-blue"><span className="i-dot i-dot-blue" />Returned</span>,
}

export default function SubmissionsPage() {
  const { id } = useParams()
  const { instructor } = useInstructor()
  const [assignment, setAssignment] = useState(null)
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading]     = useState(true)
  const [saving, setSaving]       = useState(null) // submission id being saved
  const [grades, setGrades]       = useState({})   // { [submissionId]: { grade, feedback, status } }
  const [saved, setSaved]         = useState({})   // { [submissionId]: true }
  const [error, setError]         = useState('')

  const load = useCallback(async () => {
    if (!instructor) return
    try {
      const [aRes, sRes] = await Promise.all([
        fetch(`/api/assignments/${id}?depth=1`, { headers: auth() }),
        fetch(`/api/submissions?where[assignment][equals]=${id}&limit=200&sort=-createdAt`, { headers: auth() }),
      ])
      const aData = await aRes.json()
      const sData = await sRes.json()
      setAssignment(aData)
      const subs = sData.docs ?? []
      setSubmissions(subs)
      const g = {}
      subs.forEach(s => { g[s.id] = { grade: s.grade ?? '', feedback: s.feedback ?? '', status: s.status ?? 'submitted' } })
      setGrades(g)
    } catch { setError('Failed to load submissions.') }
    finally { setLoading(false) }
  }, [id, instructor])

  useEffect(() => { load() }, [load])

  const saveGrade = async (subId) => {
    setSaving(subId)
    const { grade, feedback, status } = grades[subId]
    try {
      const res = await fetch(`/api/submissions/${subId}`, {
        method: 'PATCH',
        headers: { ...auth(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ grade: grade === '' ? null : Number(grade), feedback, status }),
      })
      if (!res.ok) throw new Error()
      setSaved(prev => ({ ...prev, [subId]: true }))
      setTimeout(() => setSaved(prev => { const n = { ...prev }; delete n[subId]; return n }), 3000)
    } catch { setError('Failed to save grade.') }
    finally { setSaving(null) }
  }

  const set = (subId, key, val) => setGrades(prev => ({ ...prev, [subId]: { ...prev[subId], [key]: val } }))

  if (loading) return (
    <div className="i-loading"><div className="i-spinner" />Loading submissions…</div>
  )

  const graded    = submissions.filter(s => s.status === 'graded').length
  const submitted = submissions.filter(s => s.status === 'submitted').length
  const avgGrade  = submissions.filter(s => s.grade != null).length
    ? Math.round(submissions.filter(s => s.grade != null).reduce((a, s) => a + s.grade, 0) / submissions.filter(s => s.grade != null).length)
    : null

  return (
    <div className="i-content">
      {/* Breadcrumb */}
      <div className="i-breadcrumb">
        <Link href="/instructor/assignments">Assignments</Link>
        <span className="sep">›</span>
        <span className="current">{assignment?.title ?? 'Submissions'}</span>
      </div>

      {/* Page header */}
      <div className="i-page-header">
        <div className="i-page-header-left">
          <h1>{assignment?.title}</h1>
          <p>
            {assignment?.course?.title && <><span className="i-badge i-badge-blue" style={{ marginRight: 8 }}>{assignment.course.title}</span></>}
            {assignment?.dueDate && <>Due {new Date(assignment.dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} · </>}
            Max {assignment?.maxPoints ?? 100} pts
          </p>
        </div>
        <div className="i-page-header-right">
          <Link href="/instructor/assignments" className="i-btn i-btn-secondary i-btn-sm">← Back</Link>
        </div>
      </div>

      {error && <div className="i-alert i-alert-error" style={{ marginBottom: 20 }}>{error}</div>}

      {/* Summary stats */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 28 }}>
        {[
          { label: 'Total', value: submissions.length, color: 'blue' },
          { label: 'Pending',  value: submitted, color: 'orange' },
          { label: 'Graded',   value: graded,    color: 'green' },
          { label: 'Avg Grade', value: avgGrade != null ? `${avgGrade}%` : '—', color: 'purple' },
        ].map(({ label, value, color }) => (
          <div key={label} className={`i-stat ${color}`} style={{ flex: 1 }}>
            <div className="i-stat-value">{value}</div>
            <div className="i-stat-label">{label}</div>
          </div>
        ))}
      </div>

      {/* Submissions list */}
      {submissions.length === 0 ? (
        <div className="i-card">
          <div className="i-empty">
            <div className="i-empty-icon"><InboxIcon /></div>
            <h3>No submissions yet</h3>
            <p>Students haven't submitted their work for this assignment yet.</p>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {submissions.map(sub => {
            const g = grades[sub.id] ?? {}
            const isSaving = saving === sub.id
            const wasSaved = saved[sub.id]
            return (
              <div key={sub.id} className="i-card">
                <div style={{ padding: '20px 24px' }}>
                  {/* Header row */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, #2563eb, #7c3aed)', display: 'grid', placeItems: 'center', color: '#fff', fontWeight: 700, fontSize: 14, flexShrink: 0 }}>
                        {sub.studentEmail?.[0]?.toUpperCase() ?? '?'}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--i-text)' }}>{sub.studentEmail}</div>
                        <div style={{ fontSize: 12, color: 'var(--i-muted)', marginTop: 2 }}>
                          Submitted {new Date(sub.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      {STATUS_BADGE[sub.status] ?? STATUS_BADGE.submitted}
                      {wasSaved && <span className="i-badge i-badge-green">✓ Saved</span>}
                    </div>
                  </div>

                  {/* Submission content */}
                  {sub.content && (
                    <div style={{ background: 'var(--i-surface2)', border: '1px solid var(--i-border)', borderRadius: 'var(--i-r)', padding: '14px 16px', marginBottom: 20, fontSize: 13.5, color: 'var(--i-text-2)', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                      {sub.content}
                    </div>
                  )}

                  {/* Grading row */}
                  <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr auto', gap: 16, alignItems: 'flex-start' }}>
                    {/* Grade + status */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <label className="i-label">Grade <span style={{ color: 'var(--i-muted)', fontWeight: 400 }}>/ {assignment?.maxPoints ?? 100}</span></label>
                      <input
                        type="number" className="i-grade-input"
                        min={0} max={assignment?.maxPoints ?? 100}
                        value={g.grade ?? ''} placeholder="—"
                        onChange={e => set(sub.id, 'grade', e.target.value)}
                      />
                      <select
                        className="i-select" style={{ fontSize: 12, padding: '6px 10px' }}
                        value={g.status ?? 'submitted'}
                        onChange={e => set(sub.id, 'status', e.target.value)}
                      >
                        <option value="submitted">Submitted</option>
                        <option value="graded">Graded</option>
                        <option value="returned">Returned</option>
                      </select>
                    </div>

                    {/* Feedback */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <label className="i-label">Feedback to student</label>
                      <textarea
                        className="i-textarea" rows={3}
                        placeholder="Write feedback for this student…"
                        value={g.feedback ?? ''}
                        onChange={e => set(sub.id, 'feedback', e.target.value)}
                        style={{ minHeight: 'unset', resize: 'none' }}
                      />
                    </div>

                    {/* Save */}
                    <div style={{ paddingTop: 22 }}>
                      <button
                        className="i-btn i-btn-primary i-btn-sm"
                        onClick={() => saveGrade(sub.id)}
                        disabled={isSaving}
                      >
                        {isSaving ? <span className="i-spinner" style={{ width: 14, height: 14, borderWidth: 2 }} /> : <SaveIcon />}
                        {isSaving ? 'Saving…' : 'Save'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function SaveIcon()  { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg> }
function InboxIcon() { return <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg> }
