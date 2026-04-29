import React, { useState, useEffect } from 'react';
import { TopBar, Header, Footer } from './components/Layout';
import { Hero, Trusted } from './components/Hero';
import { 
  CourseSlider, 
  Catalog, 
  UdemyGrid, 
  WhyUs, 
  Categories, 
  Packages, 
  Testimonials, 
  FinalCTA 
} from './components/Sections';
import './index.css';

const TWEAK_DEFAULTS = {
  "accent": "blue",
  "density": "comfortable"
};

function applyTweaks(t) {
  const accents = {
    blue:   { "--brand-50":"#eff6ff","--brand-100":"#dbeafe","--brand-200":"#bfdbfe","--brand-500":"#2563eb","--brand-600":"#1d4ed8","--brand-700":"#1e40af","--brand-900":"#0b1e4a" },
    indigo: { "--brand-50":"#eef2ff","--brand-100":"#e0e7ff","--brand-200":"#c7d2fe","--brand-500":"#6366f1","--brand-600":"#4f46e5","--brand-700":"#4338ca","--brand-900":"#1e1b4b" },
    teal:   { "--brand-50":"#f0fdfa","--brand-100":"#ccfbf1","--brand-200":"#99f6e4","--brand-500":"#14b8a6","--brand-600":"#0d9488","--brand-700":"#0f766e","--brand-900":"#042f2e" },
    slate:  { "--brand-50":"#f8fafc","--brand-100":"#e2e8f0","--brand-200":"#cbd5e1","--brand-500":"#64748b","--brand-600":"#334155","--brand-700":"#1e293b","--brand-900":"#020617" },
  };
  const pal = accents[t.accent] || accents.blue;
  Object.entries(pal).forEach(([k, v]) => document.documentElement.style.setProperty(k, v));
}

function App() {
  const [tweaks, setTweaks] = useState(TWEAK_DEFAULTS);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => { 
    applyTweaks(tweaks); 
  }, [tweaks]);

  const update = (k, v) => {
    setTweaks(prev => ({ ...prev, [k]: v }));
  };

  return (
    <div className="app-container">
      <TopBar/>
      <Header onLogin={() => alert("Login modal placeholder")}/>
      <main>
        <Hero/>
        <Trusted/>
        <CourseSlider/>
        <Catalog/>
        <UdemyGrid/>
        <WhyUs/>
        <Categories/>
        <Packages/>
        <Testimonials/>
        <FinalCTA/>
      </main>
      <Footer/>

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
                   className={"sw" + (tweaks.accent === s.k ? " active" : "")}
                   style={{background: s.c}}
                   onClick={() => update("accent", s.k)} />
            ))}
          </div>
        </div>
      </div>
      
      {/* Edit mode toggle for development */}
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
          fontSize: '12px'
        }}
      >
        Toggle Tweaks
      </button>
    </div>
  );
}

export default App;
