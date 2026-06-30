/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Project, Skill, Experience, Education, Testimonial, BlogPost } from './types';

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    name: 'WifiFlow Core — ISP Billing & Portal OS',
    description: 'A robust multi-tenant ISP billing and subscriber portal featuring Safaricom M-Pesa Hook STK push callback simulator, MikroTik RADIUS daemon COA disconnect controller, and an interactive scratchcard PIN code batch generator.',
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=600&auto=format&fit=crop',
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Node.js', 'MikroTik API', 'M-Pesa API'],
    role: 'Lead Systems Architect',
    githubLink: 'https://github.com/Keptonotieno/wifi-flow',
    liveDemoLink: 'https://wifi-flow.vercel.app/',
    category: 'Full Stack',
    dateCreated: '2023-09-15'
  },
  {
    id: 'proj-2',
    name: 'Nexus HMS — Hospital EHR & Sync Node',
    description: 'State-of-the-art secure electronic health records (EHR) management dashboard featuring pharmacy list integrations, bed map occupancy telemetry systems, and live database synchronization.',
    image: '/assets/images/nexus_hms_dashboard_1782447647046.jpg',
    technologies: ['React', 'TypeScript', 'Supabase', 'Tailwind CSS', 'Context API'],
    role: 'Frontend & Database Engineer',
    githubLink: 'https://github.com/Keptonotieno/nexus-hospital',
    liveDemoLink: 'https://nuxe-hospital.netlify.app/',
    category: 'React',
    dateCreated: '2024-02-10'
  },
  {
    id: 'proj-3',
    name: 'Boda Connect Kenya',
    description: 'Fast, affordable, and reliable Boda Boda taxi ride-hailing and motorcycle logistics delivery services network across Kenya. Designed with safe, efficient, and real-time routing algorithms.',
    image: '/assets/images/boda_connect_app_1782447663004.jpg',
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Google Maps API', 'Node.js'],
    role: 'Product Systems Designer',
    githubLink: 'https://github.com/Keptonotieno/boda-connect',
    liveDemoLink: 'https://boda-connect-kenya.netlify.app/',
    category: 'Web Applications',
    dateCreated: '2024-05-18'
  },
  {
    id: 'proj-4',
    name: 'RefreshMart Manager — Smart Sales & Customer Intelligence',
    description: 'A real-time sales ledger tracking dashboard featuring custom low-stock alert monitors, Gemini AI financial coach analytics integration, and active CRM customer profile accounts tracking.',
    image: '/assets/images/refreshmart_dashboard_1782447472069.jpg',
    technologies: ['React', 'TypeScript', 'Gemini API', 'Tailwind CSS', 'D3.js Charts'],
    role: 'Lead Full Stack Engineer',
    githubLink: 'https://github.com/Keptonotieno/refreshmart-manager',
    liveDemoLink: 'https://refreshmart.app/dashboard',
    category: 'AI',
    dateCreated: '2025-01-20'
  }
];

export const INITIAL_SKILLS: Skill[] = [
  // Languages
  { id: 'sk-1', name: 'Java', category: 'languages', rating: 92 },
  { id: 'sk-2', name: 'JavaScript', category: 'languages', rating: 95 },
  { id: 'sk-3', name: 'Python', category: 'languages', rating: 88 },
  { id: 'sk-4', name: 'C++', category: 'languages', rating: 82 },
  { id: 'sk-5', name: 'TypeScript', category: 'languages', rating: 90 },

  // Frontend
  { id: 'sk-6', name: 'React', category: 'frontend', rating: 94 },
  { id: 'sk-7', name: 'HTML5', category: 'frontend', rating: 98 },
  { id: 'sk-8', name: 'CSS3', category: 'frontend', rating: 95 },

  // CSS Frameworks
  { id: 'sk-9', name: 'Tailwind CSS', category: 'css', rating: 96 },
  { id: 'sk-10', name: 'Bootstrap', category: 'css', rating: 88 },

  // Backend & Databases
  { id: 'sk-11', name: 'Spring Boot', category: 'backend', rating: 88 },
  { id: 'sk-12', name: 'REST API Development', category: 'backend', rating: 92 },
  { id: 'sk-13', name: 'Supabase', category: 'backend', rating: 90 },

  // Artificial Intelligence & Tools
  { id: 'sk-14', name: 'AI concepts & applications', category: 'other', rating: 90 },
  { id: 'sk-15', name: 'Exploring AI-driven software', category: 'other', rating: 88 },
  { id: 'sk-16', name: 'Git & GitHub Workflows', category: 'other', rating: 95 },
  { id: 'sk-17', name: 'Problem Solving & Adaptability', category: 'other', rating: 94 },
  { id: 'sk-18', name: 'Technical Research & Collaboration', category: 'other', rating: 92 }
];

export const INITIAL_EXPERIENCE: Experience[] = [
  {
    id: 'exp-1',
    role: 'Freelance Software Developer',
    company: 'Freelancer',
    level: 'Software & Website Development',
    duration: '2023 - Present',
    responsibilities: [
      'Developed websites and software applications based on client requirements.',
      'Designed responsive user interfaces using modern frontend technologies like React and Tailwind CSS.',
      'Built and improved application features using Java, JavaScript, Python, and other programming tools.',
      'Worked on database integration and backend development (Supabase and Spring Boot).',
      'Applied software development practices to deliver reliable, efficient, and well-structured code solutions.',
      'Communicated with clients to understand project needs, gather requirements, and provide professional technical solutions.'
    ]
  }
];

export const INITIAL_EDUCATION: Education[] = [
  {
    id: 'edu-1',
    degree: 'Diploma in Computer Science',
    institution: 'NIBS Technical College',
    duration: '2024 - 2026',
    type: 'Degree'
  },
  {
    id: 'edu-2',
    degree: 'Diploma in Computer Science',
    institution: 'NIBS Technical College',
    duration: '2024 - 2026',
    type: 'Certification'
  }
];

export const INITIAL_TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-1',
    author: 'Joy Wanjiku',
    role: 'Founder & CEO',
    company: 'Sahara Tech Ventures',
    text: 'Kepton is a rare breed of developer. He translates complex design requirements into interactive, responsive frontend systems with remarkable attention to detail. His full-stack knowledge and proactive integration of smart AI widgets added immense value to our customer platform.',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=150&auto=format&fit=crop'
  },
  {
    id: 'test-2',
    author: 'David Mwangi',
    role: 'Technical Lead',
    company: 'Nairobi InnoTech Hub',
    text: 'Working with Kepton was an absolute pleasure. His command of React, Tailwind CSS, and database architecture is stellar. He delivered our enterprise inventory panel ahead of schedule and with extensive documentation that our team found incredibly clear and easy to maintain.',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=150&auto=format&fit=crop'
  }
];

export const INITIAL_BLOG_POSTS: BlogPost[] = [
  {
    id: 'blog-1',
    title: 'Architecting High-Performance Full-Stack Apps with Supabase and React',
    snippet: 'Discover the power of serverless databases, real-time sync, and edge storage in building ultra-responsive single-page applications for recruiters and global scale.',
    content: 'Full-stack development has evolved remarkably with the rise of serverless platforms like Supabase. By pairing the speed of React and Vite with a PostgreSQL-backed database on Supabase, developers can build enterprise-grade architectures with authentication, file buckets, and edge functions in hours instead of weeks.\n\nIn this article, we cover how to establish secure database-level policies (RLS), leverage real-time subscriptions, and optimize our React custom hooks to perform zero-flicker UI updates.',
    date: 'June 18, 2026',
    category: 'Web Development',
    readTime: '6 min read',
    author: 'Kepton Otieno'
  },
  {
    id: 'blog-2',
    title: 'The Developer\'s Roadmap to Integrating AI Capabilities via Gemini API',
    snippet: 'An in-depth guide to adding conversational AI agents, structured JSON responses, and multimodality securely into modern web architectures.',
    content: 'Integrating AI into user interfaces isn\'t just about embedding chat frames anymore. Modern engineering calls for seamless orchestration where LLM endpoints run securely server-side. The new Google GenAI SDK allows full-stack developers to use gemini-3.5-flash to get structured data schemas, parse visual elements, and establish high-fidelity voice or text interfaces.\n\nLet\'s walk through establishing an Express proxy, securing the API credentials, and writing clean React custom states to stream responses with elegant micro-transitions.',
    date: 'May 24, 2026',
    category: 'Artificial Intelligence',
    readTime: '8 min read',
    author: 'Kepton Otieno'
  },
  {
    id: 'blog-3',
    title: 'Optimizing C++ Algorithms for High-Throughput Data Pipeline Modules',
    snippet: 'Unlocking raw performance and low memory footprints through vectorization, alignment, and modern C++ compilation flags in performance-critical loops.',
    content: 'When speed is the ultimate metric, full-stack engineers turn to languages like C++ to compile low-level backend components or high-speed data parses. In this guide, we dive into specific techniques for writing cache-friendly loop constructs, minimizing allocations with smart pointers, and leveraging compiler flags in GCC/Clang to get maximum throughput from numerical processes.',
    date: 'April 12, 2026',
    category: 'Programming',
    readTime: '10 min read',
    author: 'Kepton Otieno'
  }
];
