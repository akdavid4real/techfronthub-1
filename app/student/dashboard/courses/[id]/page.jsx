'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'
import { I } from '@/src/components/Icons'

const COURSE_TEMPLATES = {
  1: {
    title: 'Python for Beginners',
    category: 'Programming',
    icon: '🐍',
    instructor: 'Tunde Opakele',
  },
  2: {
    title: 'Web Development with JavaScript',
    category: 'Web Development',
    icon: '💻',
    instructor: 'Chioma Amara',
  },
  3: {
    title: 'Data Analysis with Python',
    category: 'Data Science',
    icon: '📊',
    instructor: 'Dr. Oluwaseun Adebayo',
  },
}

const getGenericCourse = (id) => {
  const templates = Object.values(COURSE_TEMPLATES)
  const template = templates[id % templates.length]

  return {
    id,
    title: template.title,
    category: template.category,
    icon: template.icon,
    description: `Master the fundamentals of ${template.category.toLowerCase()} with hands-on projects and real-world examples.`,
    instructor: template.instructor,
    duration: '8 weeks',
    level: id % 3 === 0 ? 'Advanced' : id % 3 === 1 ? 'Intermediate' : 'Beginner',
    progress: Math.floor((id * 23) % 100),
    modules: [
      {
        id: 1,
        title: 'Module 1: Getting Started',
        lessons: [
          { id: 1, title: 'Introduction to the Course', duration: '15 min', completed: true },
          { id: 2, title: 'Setting up your Environment', duration: '20 min', completed: true },
          { id: 3, title: 'Your First Project', duration: '25 min', completed: false },
          { id: 4, title: 'Core Concepts', duration: '30 min', completed: false },
        ]
      },
      {
        id: 2,
        title: 'Module 2: Fundamentals',
        lessons: [
          { id: 5, title: 'Understanding the Basics', duration: '20 min', completed: false },
          { id: 6, title: 'Key Principles', duration: '35 min', completed: false },
          { id: 7, title: 'Practical Applications', duration: '15 min', completed: false },
          { id: 8, title: 'Building Blocks', duration: '30 min', completed: false },
        ]
      },
      {
        id: 3,
        title: 'Module 3: Advanced Topics',
        lessons: [
          { id: 9, title: 'Advanced Techniques', duration: '25 min', completed: false },
          { id: 10, title: 'Best Practices', duration: '40 min', completed: false },
          { id: 11, title: 'Real World Examples', duration: '20 min', completed: false },
          { id: 12, title: 'Optimization', duration: '30 min', completed: false },
        ]
      },
      {
        id: 4,
        title: 'Module 4: Project Work',
        lessons: [
          { id: 13, title: 'Capstone Project Part 1', duration: '45 min', completed: false },
          { id: 14, title: 'Capstone Project Part 2', duration: '50 min', completed: false },
          { id: 15, title: 'Code Review & Feedback', duration: '30 min', completed: false },
          { id: 16, title: 'Final Submission', duration: '20 min', completed: false },
        ]
      },
      {
        id: 5,
        title: 'Module 5: Conclusion',
        lessons: [
          { id: 17, title: 'Course Summary', duration: '20 min', completed: false },
          { id: 18, title: 'Next Steps', duration: '25 min', completed: false },
          { id: 19, title: 'Additional Resources', duration: '15 min', completed: false },
          { id: 20, title: 'Certification', duration: '10 min', completed: false },
        ]
      },
    ]
  }
}

export default function CourseDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [expandedModule, setExpandedModule] = useState(0)

  const courseId = parseInt(params.id)
  const course = getGenericCourse(courseId)

  const totalLessons = course.modules.reduce((sum, m) => sum + m.lessons.length, 0)
  const completedLessons = course.modules.reduce(
    (sum, m) => sum + m.lessons.filter(l => l.completed).length,
    0
  )

  return (
    <div style={{ minHeight: '100vh', background: 'var(--ink-50)' }}>
      {/* Main Content */}
      <div className="container" style={{ padding: '60px 0' }}>
        {/* Back Link */}
        <Link href="/student/dashboard/courses" style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          color: 'var(--brand-600)',
          textDecoration: 'none',
          marginBottom: 40,
          fontSize: 14,
        }}>
          <I.Chev dir="left" size={16} />
          Back to My Courses
        </Link>

        {/* Course Header */}
        <div style={{
          background: 'var(--canvas)',
          border: '1px solid var(--ink-100)',
          borderRadius: 16,
          padding: 40,
          marginBottom: 40,
        }}>
          <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
            <div style={{
              width: 80,
              height: 80,
              borderRadius: 16,
              background: 'var(--brand-600)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 40,
              flexShrink: 0,
            }}>
              {course.icon}
            </div>

            <div style={{ flex: 1 }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                marginBottom: 12,
              }}>
                <span style={{
                  fontSize: 12,
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: 'var(--brand-600)',
                  background: 'rgba(37, 99, 235, 0.1)',
                  padding: '4px 12px',
                  borderRadius: 8,
                }}>
                  {course.category}
                </span>
                <span style={{
                  fontSize: 12,
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: 'var(--ink-400)',
                  background: 'var(--ink-100)',
                  padding: '4px 12px',
                  borderRadius: 8,
                }}>
                  {course.level}
                </span>
              </div>

              <h1 style={{
                fontSize: 36,
                fontWeight: 700,
                margin: '0 0 16px',
                color: 'var(--ink-50)',
              }}>
                {course.title}
              </h1>

              <p style={{
                fontSize: 16,
                color: 'var(--ink-200)',
                margin: '0 0 20px',
                lineHeight: 1.6,
              }}>
                {course.description}
              </p>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: 16,
                marginBottom: 20,
              }}>
                <div>
                  <div style={{ fontSize: 12, color: 'var(--ink-400)', marginBottom: 4 }}>Instructor</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink-50)' }}>
                    {course.instructor}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 12, color: 'var(--ink-400)', marginBottom: 4 }}>Duration</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink-50)' }}>
                    {course.duration}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 12, color: 'var(--ink-400)', marginBottom: 4 }}>Progress</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--brand-600)' }}>
                    {course.progress}%
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 8,
                }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink-200)' }}>
                    Overall Progress
                  </span>
                  <span style={{ fontSize: 12, color: 'var(--ink-400)' }}>
                    {completedLessons} of {totalLessons} lessons
                  </span>
                </div>
                <div style={{
                  width: '100%',
                  height: 8,
                  background: 'var(--ink-100)',
                  borderRadius: 999,
                  overflow: 'hidden',
                }}>
                  <div style={{
                    width: `${(completedLessons / totalLessons) * 100}%`,
                    height: '100%',
                    background: 'var(--brand-600)',
                    borderRadius: 999,
                    transition: 'width 0.3s ease',
                  }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Course Content */}
        <div style={{
          background: 'var(--canvas)',
          border: '1px solid var(--ink-100)',
          borderRadius: 16,
          overflow: 'hidden',
        }}>
          <div style={{
            padding: 32,
            background: 'linear-gradient(135deg, var(--brand-600), var(--brand-700))',
            borderBottom: '1px solid var(--brand-700)',
          }}>
            <h2 style={{
              fontSize: 24,
              fontWeight: 700,
              margin: 0,
              color: '#fff',
            }}>
              Course Curriculum
            </h2>
            <p style={{
              fontSize: 14,
              color: 'rgba(255, 255, 255, 0.8)',
              margin: '8px 0 0',
            }}>
              {course.modules.length} modules • {totalLessons} lessons
            </p>
          </div>

          {course.modules.map((module, idx) => (
            <div key={module.id} style={{
              borderBottom: idx < course.modules.length - 1 ? '1px solid var(--ink-100)' : 'none',
            }}>
              <button
                onClick={() => setExpandedModule(expandedModule === idx ? -1 : idx)}
                style={{
                  width: '100%',
                  padding: 24,
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--ink-50)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <div style={{ textAlign: 'left' }}>
                  <h3 style={{
                    fontSize: 16,
                    fontWeight: 700,
                    margin: '0 0 4px',
                    color: 'var(--ink-50)',
                  }}>
                    {module.title}
                  </h3>
                  <p style={{
                    fontSize: 13,
                    color: 'var(--ink-400)',
                    margin: 0,
                  }}>
                    {module.lessons.length} lessons
                  </p>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                }}>
                  <span style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: 'var(--brand-600)',
                    background: 'rgba(37, 99, 235, 0.1)',
                    padding: '4px 12px',
                    borderRadius: 999,
                  }}>
                    {module.lessons.filter(l => l.completed).length}/{module.lessons.length}
                  </span>
                  <I.Chev
                    dir={expandedModule === idx ? 'down' : 'right'}
                    size={20}
                    style={{ color: 'var(--ink-400)', transition: 'transform 0.2s ease' }}
                  />
                </div>
              </button>

              {expandedModule === idx && (
                <div style={{
                  background: 'var(--ink-50)',
                  padding: 24,
                  borderTop: '1px solid var(--ink-100)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                }}>
                  {module.lessons.map((lesson) => (
                    <div
                      key={lesson.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 16,
                        padding: 16,
                        background: 'var(--canvas)',
                        border: '1px solid var(--ink-100)',
                        borderRadius: 12,
                        cursor: lesson.completed ? 'default' : 'pointer',
                        transition: 'all 0.2s ease',
                        opacity: lesson.completed ? 0.7 : 1,
                      }}
                      onMouseEnter={(e) => !lesson.completed && (e.currentTarget.style.borderColor = 'var(--brand-600)')}
                      onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--ink-100)')}
                    >
                      <div style={{
                        width: 24,
                        height: 24,
                        borderRadius: 50,
                        background: lesson.completed ? 'var(--brand-600)' : 'var(--ink-200)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontSize: 14,
                        fontWeight: 700,
                        flexShrink: 0,
                      }}>
                        {lesson.completed ? '✓' : lesson.id}
                      </div>

                      <div style={{ flex: 1 }}>
                        <div style={{
                          fontSize: 14,
                          fontWeight: 600,
                          color: 'var(--ink-50)',
                          textDecoration: lesson.completed ? 'line-through' : 'none',
                        }}>
                          {lesson.title}
                        </div>
                        <div style={{
                          fontSize: 12,
                          color: 'var(--ink-400)',
                          marginTop: 2,
                        }}>
                          {lesson.duration}
                        </div>
                      </div>

                      {lesson.completed && (
                        <span style={{
                          fontSize: 12,
                          fontWeight: 600,
                          color: 'var(--brand-600)',
                          background: 'rgba(37, 99, 235, 0.1)',
                          padding: '4px 12px',
                          borderRadius: 999,
                        }}>
                          Completed
                        </span>
                      )}
                      {!lesson.completed && (
                        <button style={{
                          padding: '6px 16px',
                          background: 'var(--brand-600)',
                          color: '#fff',
                          border: 'none',
                          borderRadius: 6,
                          fontSize: 12,
                          fontWeight: 600,
                          cursor: 'pointer',
                          transition: 'background 0.2s ease',
                        }}
                        onMouseEnter={(e) => e.target.style.background = 'var(--brand-700)'}
                        onMouseLeave={(e) => e.target.style.background = 'var(--brand-600)'}
                        onClick={() => alert(`Starting lesson: ${lesson.title}`)}>
                          Start
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Continue Button */}
        <div style={{ marginTop: 40, textAlign: 'center' }}>
          <button style={{
            padding: '16px 40px',
            background: 'var(--brand-600)',
            color: '#fff',
            border: 'none',
            borderRadius: 12,
            fontSize: 16,
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'var(--brand-700)'
            e.target.style.transform = 'translateY(-2px)'
            e.target.style.boxShadow = '0 8px 24px rgba(37, 99, 235, 0.3)'
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'var(--brand-600)'
            e.target.style.transform = 'translateY(0)'
            e.target.style.boxShadow = 'none'
          }}
          onClick={() => alert('Continuing to next lesson...')}>
            Continue Learning
          </button>
        </div>
      </div>
    </div>
  )
}
