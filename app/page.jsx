'use client'

import React, { useState, useEffect } from 'react'
import { Hero, Trusted } from '@/src/components/Hero'
import {
  CourseSlider,
  Catalog,
  UdemyGrid,
  WhyUs,
  Categories,
  Packages,
  Testimonials,
  FinalCTA
} from '@/src/components/Sections'

const ACCENTS = {
  blue:   { "--brand-50":"#eff6ff","--brand-100":"#dbeafe","--brand-200":"#bfdbfe","--brand-500":"#2563eb","--brand-600":"#1d4ed8","--brand-700":"#1e40af","--brand-900":"#0b1e4a" },
  indigo: { "--brand-50":"#eef2ff","--brand-100":"#e0e7ff","--brand-200":"#c7d2fe","--brand-500":"#6366f1","--brand-600":"#4f46e5","--brand-700":"#4338ca","--brand-900":"#1e1b4b" },
  teal:   { "--brand-50":"#f0fdfa","--brand-100":"#ccfbf1","--brand-200":"#99f6e4","--brand-500":"#14b8a6","--brand-600":"#0d9488","--brand-700":"#0f766e","--brand-900":"#042f2e" },
  slate:  { "--brand-50":"#f8fafc","--brand-100":"#e2e8f0","--brand-200":"#cbd5e1","--brand-500":"#64748b","--brand-600":"#334155","--brand-700":"#1e293b","--brand-900":"#020617" },
};

export default function Page() {
  const [accent, setAccent] = useState('blue');
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    courses:      null,
    categories:   null,
    testimonials: null,
    packages:     null,
    udemy:        null,
    siteConfig:   null,
  });

  useEffect(() => {
    const pal = ACCENTS[accent] || ACCENTS.blue;
    Object.entries(pal).forEach(([k, v]) => document.documentElement.style.setProperty(k, v));
  }, [accent]);

  useEffect(() => {
    const BASE = '/api';
    const get = (path) => fetch(`${BASE}${path}`).then(r => r.json()).catch(() => null);

    Promise.all([
      get('/courses?limit=50'),
      get('/categories?limit=50'),
      get('/testimonials?limit=50'),
      get('/packages?limit=50'),
      get('/udemy-courses?limit=50'),
      get('/globals/site-config'),
    ]).then(([courses, cats, testimonials, packages, udemy, siteConfig]) => {
      setData({
        courses:      courses?.docs?.length      ? courses.docs      : null,
        categories:   cats?.docs?.length         ? cats.docs         : null,
        testimonials: testimonials?.docs?.length ? testimonials.docs : null,
        packages:     packages?.docs?.length     ? packages.docs     : null,
        udemy:        udemy?.docs?.length        ? udemy.docs        : null,
        siteConfig:   siteConfig?.doc            ?? null,
      });
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div className="app-container">
      <main>
        <Hero siteConfig={data.siteConfig}/>
        <Trusted siteConfig={data.siteConfig}/>
        <CourseSlider  courses={data.courses} loading={loading}/>
        <Catalog/>
        <UdemyGrid     udemy={data.udemy}/>
        <WhyUs/>
        <Categories    categories={data.categories}/>
        <Packages      packages={data.packages}/>
        <Testimonials  testimonials={data.testimonials}/>
        <FinalCTA siteConfig={data.siteConfig}/>
      </main>

      <div className={"tweaks" + (editMode ? " on" : "")}>
        <h5>Tweaks</h5>
        <div className="row">
          <span>Accent</span>
          <div className="swatches">
            {[
              {k: "blue",   c: "#2563eb"},
              {k: "indigo", c: "#4f46e5"},
              {k: "teal",   c: "#0d9488"},
              {k: "slate",  c: "#334155"},
            ].map(s => (
              <div key={s.k}
                   className={"sw" + (accent === s.k ? " active" : "")}
                   style={{background: s.c}}
                   onClick={() => setAccent(s.k)} />
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={() => setEditMode(!editMode)}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 1000,
          padding: '8px 12px',
          background: 'var(--brand-600)',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '12px',
        }}
      >
        Toggle Tweaks
      </button>
    </div>
  )
}
