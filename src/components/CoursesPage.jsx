'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { I } from './Icons'

function flyerBg(hue) {
  return {
    background: `linear-gradient(135deg, oklch(0.96 0.03 ${hue}), oklch(0.88 0.08 ${hue}))`,
  }
}

function CourseCard({ c }) {
  return (
    <a href={`/courses/${c.id}`} className="course-card" style={{textDecoration: "none", color: "inherit"}}>
      <div className="course-flyer" style={flyerBg(c.hue || 210)}>
        {c.featured && <span className="flyer-tag hot">Featured</span>}
      </div>
      <div className="course-body">
        <h3>{c.title}</h3>
        <p>{c.description}</p>
        <div className="course-meta">
          <span>{c.duration || '8 weeks'}</span><span className="sep"/>
          <span>{c.level || 'All levels'}</span>
        </div>
      </div>
      <div className="course-foot">
        <div className="course-price">
          ₦{c.price?.toLocaleString?.() || '0'}
        </div>
        <button className="btn btn-dark btn-sm">Enroll Now <I.Arrow size={12}/></button>
      </div>
    </a>
  )
}

function CategoryCard({ cat, courses = [] }) {
  return (
    <Link href={`/categories/${cat.id}`} style={{textDecoration: 'none'}}>
      <div className="cat-card" style={{cursor: 'pointer', transition: 'all 0.2s'}}>
        <div className="top">
          <div style={{width: 40, height: 40, borderRadius: 10, background: "var(--brand-50)", color: "var(--brand-600)", display: "grid", placeItems: "center", border: "1px solid var(--brand-100)"}}>
            {React.createElement(I[cat.icon || 'Code'], { size: 20 })}
          </div>
          <span className="num">{cat.n}</span>
        </div>
        <div>
          <h3>{cat.title}</h3>
          <p>{cat.desc}</p>
        </div>
        <div className="bar">
          <span>{cat.count}</span>
          <span className="arrow"><I.Arrow size={14}/></span>
        </div>
      </div>
    </Link>
  )
}

export function CoursesPage({ categories = [] }) {
  return (
    <div className="courses-page">
      <section className="courses-hero">
        <div className="container">
          <div className="hero-content">
            <div className="eyebrow">Career-focused learning</div>
            <h1>Pick a track, ship real work.</h1>
            <p>Each category maps to a career outcome, not just a topic list. Choose your path, learn alongside peers, graduate with a portfolio.</p>
            <div className="hero-stats">
              <div className="stat">
                <strong>{categories.length}</strong>
                <span>Career tracks</span>
              </div>
              <div className="stat">
                <strong>{categories.reduce((sum, cat) => sum + (parseInt(cat.count) || 0), 0)}+</strong>
                <span>Courses total</span>
              </div>
              <div className="stat">
                <strong>12,400+</strong>
                <span>Alumni</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="browse-tracks">
        <div className="container">
          <div style={{marginBottom: 36}}>
            <div className="eyebrow">All tracks</div>
            <h2>Choose your focus</h2>
          </div>
          <div className="cats-grid">
            {categories.map((cat) => (
              <CategoryCard key={cat.id} cat={cat} />
            ))}
          </div>
        </div>
      </section>

      <section className="faq-section">
        <div className="container">
          <div className="section-head" style={{textAlign: "center", flexDirection: "column", alignItems: "center"}}>
            <div>
              <div className="eyebrow">Questions?</div>
              <h2 style={{textAlign: "center"}}>How tracks work</h2>
            </div>
          </div>

          <div className="faq-grid">
            <div className="faq-card">
              <h3>Can I switch tracks?</h3>
              <p>Yes. Many learners start in one track and pivot. We support transitions within the first 2 weeks of cohort start.</p>
            </div>
            <div className="faq-card">
              <h3>Do I need prerequisites?</h3>
              <p>Most tracks are beginner-friendly. We assess your background and provide resources to bridge any gaps.</p>
            </div>
            <div className="faq-card">
              <h3>Multiple tracks?</h3>
              <p>Take them back-to-back or mix formats. Combine self-paced courses with bootcamps for deeper focus.</p>
            </div>
            <div className="faq-card">
              <h3>How long is each track?</h3>
              <p>Cohort tracks run 6–16 weeks. Self-paced varies. Corporate training timelines are fully customizable.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="final-cta">
        <div className="container">
          <div className="eyebrow" style={{color: "var(--brand-200)"}}>Ready to pick your track?</div>
          <h2>Start your tech journey today.</h2>
          <p>Join 12,400+ learners who traded uncertain futures for working careers in data, engineering and AI.</p>
          <div className="btns">
            <a href="#" className="btn btn-primary btn-lg">Enroll Now <I.Arrow size={16}/></a>
            <a href="#" className="btn btn-lg" style={{background: "transparent", border: "1px solid rgba(255,255,255,0.2)", color: "#fff"}}>Contact Us</a>
          </div>
        </div>
      </section>
    </div>
  )
}
