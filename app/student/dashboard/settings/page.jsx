'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { I } from '@/src/components/Icons'

export default function SettingsPage() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('profile')
  const [formData, setFormData] = useState({
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [saveMessage, setSaveMessage] = useState('')
  const router = useRouter()

  useEffect(() => {
    let isMounted = true

    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('payload-token')
        if (!token) {
          router.push('/student/login')
          return
        }

        const res = await fetch('/api/users/me', {
          headers: { Authorization: `JWT ${token}` },
        })

        if (!isMounted) return

        const data = await res.json()
        if (res.ok) {
          setUser(data.user || data)
          setFormData(prev => ({ ...prev, email: data.user?.email || data.email || '' }))
          setLoading(false)
        } else {
          router.push('/student/login')
        }
      } catch (e) {
        if (isMounted) {
          console.error('Error fetching user:', e)
          setError('Failed to load settings')
          setLoading(false)
        }
      }
    }

    fetchUser()
    return () => { isMounted = false }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('payload-token')
    localStorage.removeItem('user-email')
    router.push('/')
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSaveProfile = async (e) => {
    e.preventDefault()
    setSaveMessage('')

    try {
      const token = localStorage.getItem('payload-token')
      if (!token) {
        router.push('/student/login')
        return
      }

      const res = await fetch(`/api/users/${user.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `JWT ${token}`,
        },
        body: JSON.stringify({ email: formData.email }),
      })

      if (res.ok) {
        setSaveMessage('✓ Profile updated successfully')
        setTimeout(() => setSaveMessage(''), 3000)
      } else {
        setSaveMessage('Failed to update profile')
      }
    } catch (e) {
      console.error('Error saving profile:', e)
      setSaveMessage('An error occurred')
    }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    setSaveMessage('')

    if (formData.newPassword !== formData.confirmPassword) {
      setSaveMessage('Passwords do not match')
      return
    }

    if (formData.newPassword.length < 8) {
      setSaveMessage('Password must be at least 8 characters')
      return
    }

    try {
      const token = localStorage.getItem('payload-token')
      const res = await fetch(`/api/users/${user.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `JWT ${token}`,
        },
        body: JSON.stringify({ password: formData.newPassword }),
      })

      if (res.ok) {
        setSaveMessage('✓ Password changed successfully')
        setFormData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        }))
        setTimeout(() => setSaveMessage(''), 3000)
      } else {
        setSaveMessage('Failed to change password')
      }
    } catch (e) {
      console.error('Error changing password:', e)
      setSaveMessage('An error occurred')
    }
  }

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        color: 'var(--ink-300)',
      }}>
        Loading settings...
      </div>
    )
  }

  if (error) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}>
        <div style={{
          background: 'var(--canvas)',
          border: '1px solid var(--ink-100)',
          borderRadius: 16,
          padding: 40,
          maxWidth: 500,
          textAlign: 'center',
        }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12, color: 'var(--ink-50)' }}>
            Error Loading Settings
          </h2>
          <p style={{ color: 'var(--ink-200)', marginBottom: 24 }}>{error}</p>
          <Link href="/student/dashboard" className="btn btn-primary">
            Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--ink-50)' }}>
      {/* Main Content */}
      <div className="container" style={{ padding: '60px 0' }}>
        {/* Back Link */}
        <Link href="/student/dashboard" style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          color: 'var(--brand-600)',
          textDecoration: 'none',
          marginBottom: 40,
          fontSize: 14,
        }}>
          <I.Chev dir="left" size={16} />
          Back to Dashboard
        </Link>

        {/* Page Title */}
        <div style={{ marginBottom: 40 }}>
          <h1 style={{
            fontSize: 40,
            fontWeight: 700,
            margin: '0 0 12px',
            color: 'var(--ink-50)',
          }}>
            Settings
          </h1>
          <p style={{
            fontSize: 18,
            color: 'var(--ink-300)',
            margin: 0,
          }}>
            Update your profile and preferences
          </p>
        </div>

        {/* Settings Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 40 }}>
          {/* Sidebar */}
          <div>
            <div style={{
              background: 'var(--canvas)',
              border: '1px solid var(--ink-100)',
              borderRadius: 16,
              overflow: 'hidden',
            }}>
              <button
                onClick={() => setActiveTab('profile')}
                style={{
                  width: '100%',
                  padding: '16px 20px',
                  background: activeTab === 'profile' ? 'var(--brand-600)' : 'transparent',
                  color: activeTab === 'profile' ? '#fff' : 'var(--ink-100)',
                  border: 'none',
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                  textAlign: 'left',
                  borderBottom: '1px solid var(--ink-100)',
                  transition: 'all 0.2s ease',
                }}
              >
                📋 Profile
              </button>
              <button
                onClick={() => setActiveTab('password')}
                style={{
                  width: '100%',
                  padding: '16px 20px',
                  background: activeTab === 'password' ? 'var(--brand-600)' : 'transparent',
                  color: activeTab === 'password' ? '#fff' : 'var(--ink-100)',
                  border: 'none',
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s ease',
                }}
              >
                🔐 Password
              </button>
            </div>
          </div>

          {/* Content */}
          <div>
            {activeTab === 'profile' && (
              <div style={{
                background: 'var(--canvas)',
                border: '1px solid var(--ink-100)',
                borderRadius: 16,
                padding: 40,
              }}>
                <h2 style={{
                  fontSize: 24,
                  fontWeight: 700,
                  margin: '0 0 24px',
                  color: 'var(--ink-50)',
                }}>
                  Profile Information
                </h2>

                <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: 14,
                      fontWeight: 600,
                      marginBottom: 6,
                      color: 'var(--ink-50)',
                    }}>
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid var(--ink-200)',
                        borderRadius: 8,
                        fontSize: 14,
                        boxSizing: 'border-box',
                        background: 'var(--paper)',
                        color: 'var(--ink-50)',
                      }}
                    />
                  </div>

                  {saveMessage && (
                    <div style={{
                      padding: 12,
                      background: saveMessage.includes('✓') ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                      border: `1px solid ${saveMessage.includes('✓') ? '#10b981' : '#ef4444'}`,
                      color: saveMessage.includes('✓') ? '#10b981' : '#ef4444',
                      borderRadius: 8,
                      fontSize: 14,
                    }}>
                      {saveMessage}
                    </div>
                  )}

                  <button
                    type="submit"
                    style={{
                      padding: '10px 16px',
                      background: 'var(--brand-600)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 8,
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'background 0.2s ease',
                    }}
                    onMouseEnter={(e) => e.target.style.background = 'var(--brand-700)'}
                    onMouseLeave={(e) => e.target.style.background = 'var(--brand-600)'}
                  >
                    Save Changes
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'password' && (
              <div style={{
                background: 'var(--canvas)',
                border: '1px solid var(--ink-100)',
                borderRadius: 16,
                padding: 40,
              }}>
                <h2 style={{
                  fontSize: 24,
                  fontWeight: 700,
                  margin: '0 0 24px',
                  color: 'var(--ink-50)',
                }}>
                  Change Password
                </h2>

                <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: 14,
                      fontWeight: 600,
                      marginBottom: 6,
                      color: 'var(--ink-50)',
                    }}>
                      Current Password
                    </label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleInputChange}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid var(--ink-200)',
                        borderRadius: 8,
                        fontSize: 14,
                        boxSizing: 'border-box',
                        background: 'var(--paper)',
                        color: 'var(--ink-50)',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: 14,
                      fontWeight: 600,
                      marginBottom: 6,
                      color: 'var(--ink-50)',
                    }}>
                      New Password
                    </label>
                    <input
                      type="password"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleInputChange}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid var(--ink-200)',
                        borderRadius: 8,
                        fontSize: 14,
                        boxSizing: 'border-box',
                        background: 'var(--paper)',
                        color: 'var(--ink-50)',
                      }}
                    />
                    <p style={{ fontSize: 12, color: 'var(--ink-400)', margin: '6px 0 0' }}>
                      At least 8 characters
                    </p>
                  </div>

                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: 14,
                      fontWeight: 600,
                      marginBottom: 6,
                      color: 'var(--ink-50)',
                    }}>
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid var(--ink-200)',
                        borderRadius: 8,
                        fontSize: 14,
                        boxSizing: 'border-box',
                        background: 'var(--paper)',
                        color: 'var(--ink-50)',
                      }}
                    />
                  </div>

                  {saveMessage && (
                    <div style={{
                      padding: 12,
                      background: saveMessage.includes('✓') ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                      border: `1px solid ${saveMessage.includes('✓') ? '#10b981' : '#ef4444'}`,
                      color: saveMessage.includes('✓') ? '#10b981' : '#ef4444',
                      borderRadius: 8,
                      fontSize: 14,
                    }}>
                      {saveMessage}
                    </div>
                  )}

                  <button
                    type="submit"
                    style={{
                      padding: '10px 16px',
                      background: 'var(--brand-600)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 8,
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'background 0.2s ease',
                    }}
                    onMouseEnter={(e) => e.target.style.background = 'var(--brand-700)'}
                    onMouseLeave={(e) => e.target.style.background = 'var(--brand-600)'}
                  >
                    Change Password
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
