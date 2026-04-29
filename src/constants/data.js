// Data for courses, categories, testimonials, packages
export const COURSES = [
  { tag: "BOOTCAMP", tagHot: true, code: "DA-201", title: "Data Analytics Bootcamp", desc: "Master Excel, SQL, Power BI and Python for real-world business analysis.", duration: "12 weeks", lessons: 86, level: "Intermediate", price: "₦185,000", old: "₦250,000", hue: 214 },
  { tag: "NEW", tagHot: false, code: "AI-110", title: "Applied AI & Automation", desc: "Build practical AI agents, prompt systems and automations for business.", duration: "8 weeks", lessons: 62, level: "All levels", price: "₦220,000", old: null, hue: 225 },
  { tag: "POPULAR", tagHot: true, code: "DVOP-305", title: "DevOps Engineering Track", desc: "Linux, Git, Docker, Kubernetes, CI/CD and cloud deployment in one program.", duration: "14 weeks", lessons: 104, level: "Advanced", price: "₦265,000", old: "₦320,000", hue: 205 },
  { tag: "LIVE COHORT", tagHot: false, code: "WEB-140", title: "Full-Stack Web Development", desc: "HTML/CSS, JavaScript, React, Node and databases — ship a real product.", duration: "16 weeks", lessons: 120, level: "Beginner", price: "₦195,000", old: null, hue: 218 },
  { tag: "SHORT COURSE", tagHot: false, code: "DM-070", title: "Digital Marketing Mastery", desc: "SEO, paid ads, content, email and analytics — end-to-end playbook.", duration: "6 weeks", lessons: 48, level: "Beginner", price: "₦95,000", old: "₦130,000", hue: 230 },
  { tag: "KIDS", tagHot: false, code: "KIDS-020", title: "Tech for Kids (Ages 8–14)", desc: "Scratch, Python and robotics fundamentals through projects and play.", duration: "10 weeks", lessons: 40, level: "Kids", price: "₦75,000", old: null, hue: 210 },
  { tag: "HR TECH", tagHot: false, code: "HR-150", title: "HR Tech & People Analytics", desc: "Modern HR tooling, analytics dashboards and workforce reporting.", duration: "8 weeks", lessons: 54, level: "Professional", price: "₦160,000", old: null, hue: 222 },
];

export const UDEMY = [
  { title: "The Complete Python Pro Masterclass", author: "Adebayo O. · TECHFRONT", rating: 4.8, count: "12,840", hours: "38.5 hrs", price: "₦7,500", udemyUrl: "https://www.udemy.com/course/complete-python-pro-masterclass/", hue: 214 },
  { title: "Power BI for Business Analysts", author: "Chioma E. · TECHFRONT", rating: 4.7, count: "6,210", hours: "22 hrs", price: "₦6,500", udemyUrl: "https://www.udemy.com/course/power-bi-for-business-analysts/", hue: 205 },
  { title: "AWS Certified Solutions Architect", author: "Ibrahim K. · TECHFRONT", rating: 4.9, count: "18,902", hours: "41 hrs", price: "₦9,000", udemyUrl: "https://www.udemy.com/course/aws-certified-solutions-architect-associate/", hue: 225 },
  { title: "ChatGPT & AI Automation for Work", author: "Tola A. · TECHFRONT", rating: 4.8, count: "9,470", hours: "14.5 hrs", price: "₦6,000", udemyUrl: "https://www.udemy.com/course/chatgpt-ai-automation-for-work/", hue: 220 },
];

export const WHY = [
  { icon: "Target", title: "Practical Learning", desc: "Every course is built around real deliverables, not passive video." },
  { icon: "Briefcase", title: "Industry-Relevant Skills", desc: "Curriculum refreshed each cohort from active hiring signals." },
  { icon: "Users", title: "Expert-Led Training", desc: "Instructors who ship in production — not career educators." },
  { icon: "Puzzle", title: "Real-World Projects", desc: "Portfolio-ready work reviewed by working engineers and analysts." },
  { icon: "Zap", title: "Career Support", desc: "CV clinics, mock interviews and a partner-company referral track." },
];

export const CATS = [
  { n: "01", title: "AI & Automation", desc: "LLMs, agents, workflow automation", count: "12 courses", icon: "Cpu" },
  { n: "02", title: "Data Analytics", desc: "SQL, Power BI, Python, dashboards", count: "18 courses", icon: "BarChart" },
  { n: "03", title: "DevOps", desc: "Docker, Kubernetes, CI/CD, cloud", count: "9 courses", icon: "GitBranch" },
  { n: "04", title: "Digital Marketing", desc: "SEO, paid media, content, email", count: "11 courses", icon: "Megaphone" },
  { n: "05", title: "Web Development", desc: "Frontend, backend, full-stack", count: "16 courses", icon: "Code" },
  { n: "06", title: "Tech for Kids", desc: "Scratch, Python, robotics", count: "6 courses", icon: "Puzzle" },
  { n: "07", title: "HR Tech", desc: "People analytics, HRIS, reporting", count: "5 courses", icon: "Users" },
  { n: "08", title: "Cybersecurity", desc: "Blue team, red team, compliance", count: "7 courses", icon: "Target" },
];

export const PACKAGES = [
  { icon: "Briefcase", featured: false, badge: null, name: "Professional Training", desc: "Structured programs with certification and career support.", price: "from ₦185,000", per: "per program", features: ["Cohort-based with live instructors", "Industry certification on completion", "CV clinics & mock interviews", "Partner-company referrals"] },
  { icon: "User", featured: true, badge: "MOST POPULAR", name: "Private Lessons", desc: "1-on-1 coaching matched to your schedule and pace.", price: "₦25,000", per: "per hour", features: ["Dedicated senior instructor", "Flexible weekday/weekend slots", "Custom curriculum for your goal", "Recorded sessions & playbooks"] },
  { icon: "Building", featured: false, badge: null, name: "Corporate Training", desc: "Upskill full teams with programs tailored to your stack.", price: "Custom quote", per: "10+ seats", features: ["On-site or remote delivery", "Custom curriculum & materials", "Skills assessment reports", "Dedicated account manager"] },
  { icon: "ShoppingBag", featured: false, badge: null, name: "Self-Paced Courses", desc: "Buy any course once and keep lifetime access.", price: "from ₦45,000", per: "per course", features: ["Lifetime updates & access", "Downloadable resources", "Certificate of completion", "Community Slack access"] },
];

export const TESTIMONIALS = [
  { name: "Funke Adebisi", role: "Data Analyst, Sterling Bank", initials: "FA", quote: "I walked in with Excel basics and walked out running Power BI dashboards for my team. The bootcamp is relentless in the best way." },
  { name: "Tunde Olawale", role: "DevOps Engineer, Flutterwave", initials: "TO", quote: "The DevOps track mirrored exactly what we use in production. I shipped my first CI/CD pipeline three weeks in and got promoted in four months." },
  { name: "Amaka Okonkwo", role: "Founder, Trellis Studio", initials: "AO", quote: "As a non-technical founder, the AI & Automation course gave me leverage I didn't know existed. It quietly became the best business investment of the year." },
];

export const DATA = { COURSES, UDEMY, WHY, CATS, PACKAGES, TESTIMONIALS };
