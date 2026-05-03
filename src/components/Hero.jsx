import React from 'react'
import { I } from './Icons'

export function Hero({ siteConfig }) {
  const badge = siteConfig?.heroBadge ?? ''
  const headline = siteConfig?.heroHeadline ?? ''
  const lede = siteConfig?.heroLede ?? ''
  const statLearners = siteConfig?.statLearners ?? ''
  const statCourses = siteConfig?.statCourses ?? ''
  const statPlacement = siteConfig?.statPlacement ?? ''
  const statRating = siteConfig?.statRating ?? ''

  return (
    <section className="hero">
      <div className="container">
        <div className="hero-grid">
          <div>
            <span className="pill"><span className="dot-live"/> {badge}</span>
            <h1>{headline}</h1>
            <p className="lede">{lede}</p>
            <div className="hero-ctas">
              <a href="#courses" className="btn btn-primary btn-lg">Explore Courses <I.Arrow size={16} /></a>
              <a href="#learning" className="btn btn-ghost btn-lg"><I.Play size={14} /> Start Learning</a>
            </div>
            <div className="hero-stats">
              <div className="hero-stat"><strong>{statLearners}</strong><span>Learners trained</span></div>
              <div className="hero-stat"><strong>{statCourses}</strong><span>Active courses</span></div>
              <div className="hero-stat"><strong>{statPlacement}</strong><span>Job placement</span></div>
              <div className="hero-stat"><strong>{statRating}</strong><span>Average rating</span></div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="browser">
              <div className="browser-top">
                <span className="browser-dot r"/><span className="browser-dot y"/><span className="browser-dot g"/>
                <span className="browser-url">learn.techfronthub.ng/dashboard</span>
              </div>
              <div className="browser-body">
                <div className="lms-sidebar">
                  <div style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.5 }}>My Learning</div>
                  <div className="row active"><span className="icn"/> Dashboard</div>
                  <div className="row"><span className="icn"/> My Courses</div>
                  <div className="row"><span className="icn"/> Assignments</div>
                  <div className="row"><span className="icn"/> Live Sessions</div>
                  <div className="row"><span className="icn"/> Certificates</div>
                  <div style={{ flex: 1 }}/>
                  <div className="row" style={{ background: 'rgba(37,99,235,0.18)', color: '#dbeafe' }}>
                    <span className="icn" style={{ background: '#60a5fa' }}/> Upgrade
                  </div>
                </div>
                <div className="lms-main">
                  <div className="lms-card alt">
                    <h4>Data Analytics - Week 6</h4>
                    <div className="bar"><div style={{ width: '62%' }}/></div>
                    <div className="meta"><span>Power BI - Dashboards</span><span>62%</span></div>
                  </div>
                  <div className="lms-card">
                    <h4>Applied AI & Automation</h4>
                    <div className="bar"><div style={{ width: '28%' }}/></div>
                    <div className="meta"><span>Prompt engineering</span><span>28%</span></div>
                  </div>
                  <div className="lms-card">
                    <h4>Cloud Fundamentals</h4>
                    <div className="bar"><div style={{ width: '84%' }}/></div>
                    <div className="meta"><span>AWS basics</span><span>84%</span></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="hero-floating cert">
              <div className="ic">V</div>
              <div>
                <div style={{ fontSize: 12, color: 'var(--ink-400)' }}>Certificate earned</div>
                <div>Power BI - Level 2</div>
              </div>
            </div>
            <div className="hero-floating score">
              <div className="ic">*</div>
              <div>
                <div style={{ fontSize: 12, color: 'var(--ink-400)' }}>Cohort average</div>
                <div>92 / 100</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export function Trusted({ siteConfig }) {
  const companies = siteConfig?.trustedCompanies?.length
    ? siteConfig.trustedCompanies.map((c) => c?.name).filter(Boolean)
    : []

  return (
    <div className="trusted">
      <div className="container">
        <div className="label">Trusted by teams & learners from</div>
        <div className="trusted-row">
          {companies.length ? companies.map((company, i) => (
            <div key={company} className="trusted-logo">
              <span
                className="sq"
                style={
                  i % 3 === 1
                    ? { borderRadius: '50%' }
                    : i % 3 === 2
                      ? { transform: 'rotate(45deg)' }
                      : undefined
                }
              />
              {company}
            </div>
          )) : (
            <div style={{ color: 'var(--ink-500)', padding: '12px 0' }}>
              No trusted companies configured.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
