/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Github, Linkedin, Mail, MessageSquare, Terminal, MapPin, Download, 
  ExternalLink, Code2, BookOpen, BrainCircuit, Sparkles, Send, 
  Database, ShieldCheck, Check, Calendar, Laptop, Server, Award, Layout, 
  Sliders, MessageSquareCode, ArrowUpRight, GraduationCap, Clock, Upload, Edit, 
  ChevronRight, ArrowRight, X, RefreshCw, GitFork, Star, GitBranch, CheckCircle2, 
  Bug, Gauge, Phone, Atom, Wind, Zap, Map, LineChart, Smartphone, Wifi, Layers, FileCode,
  ArrowUpDown, ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Imports of custom modular sub-components
import ParticlesBackground from './components/ParticlesBackground';
import Header from './components/Header';
import AIChatbot from './components/AIChatbot';
import AdminCMS from './components/AdminCMS';
import VenturePortfolio from './components/VenturePortfolio';
import ExpertiseSection from './components/ExpertiseSection';
import RadarChart from './components/RadarChart';
import GithubContributionGraph from './components/GithubContributionGraph';
import DeveloperIntelligenceTest from './components/DeveloperIntelligenceTest';
import KeptonCodeSnake from './components/KeptonCodeSnake';
import ProjectReviewModal from './components/ProjectReviewModal';
import ProjectCard from './components/ProjectCard';

// Imports of structural static datasets
import { 
  INITIAL_PROJECTS, 
  INITIAL_SKILLS, 
  INITIAL_EXPERIENCE, 
  INITIAL_EDUCATION, 
  INITIAL_TESTIMONIALS, 
  INITIAL_BLOG_POSTS 
} from './data';
import { Project, Skill, Experience, Education, Testimonial, BlogPost, ContactRequest, ProjectSyncInfo } from './types';
import { calculateReadingTime } from './utils/readingTime';

// Futuristic technology to icon & styling mapper helper
const getTechIconInfo = (techName: string) => {
  const normalized = techName.trim().toLowerCase();
  
  if (normalized.includes('react')) {
    return {
      icon: Atom,
      color: 'text-sky-400 border-sky-500/20 bg-sky-950/30 hover:shadow-sky-500/10',
      label: 'React SPA Framework'
    };
  }
  if (normalized.includes('typescript')) {
    return {
      icon: FileCode,
      color: 'text-blue-400 border-blue-500/20 bg-blue-950/30 hover:shadow-blue-500/10',
      label: 'TypeScript Static Typing'
    };
  }
  if (normalized.includes('tailwind')) {
    return {
      icon: Wind,
      color: 'text-teal-400 border-teal-500/20 bg-teal-950/30 hover:shadow-teal-500/10',
      label: 'Tailwind Utility CSS'
    };
  }
  if (normalized.includes('node')) {
    return {
      icon: Server,
      color: 'text-emerald-400 border-emerald-500/20 bg-emerald-950/30 hover:shadow-emerald-500/10',
      label: 'Node.js Runtime'
    };
  }
  if (normalized.includes('supabase')) {
    return {
      icon: Zap,
      color: 'text-emerald-500 border-emerald-500/20 bg-emerald-950/30 hover:shadow-emerald-500/10',
      label: 'Supabase Serverless DB'
    };
  }
  if (normalized.includes('maps')) {
    return {
      icon: Map,
      color: 'text-red-400 border-red-500/20 bg-red-950/30 hover:shadow-red-500/10',
      label: 'Google Maps API Navigation'
    };
  }
  if (normalized.includes('gemini') || normalized.includes('ai')) {
    return {
      icon: BrainCircuit,
      color: 'text-indigo-400 border-indigo-500/20 bg-indigo-950/30 hover:shadow-indigo-500/10',
      label: 'Gemini LLM Cognitive API'
    };
  }
  if (normalized.includes('charts') || normalized.includes('d3')) {
    return {
      icon: LineChart,
      color: 'text-amber-400 border-amber-500/20 bg-amber-950/30 hover:shadow-amber-500/10',
      label: 'D3.js Interactive Charts'
    };
  }
  if (normalized.includes('mpesa') || normalized.includes('m-pesa')) {
    return {
      icon: Smartphone,
      color: 'text-lime-500 border-lime-500/20 bg-lime-950/30 hover:shadow-lime-500/10',
      label: 'Safaricom M-Pesa STK Push'
    };
  }
  if (normalized.includes('mikrotik') || normalized.includes('radius')) {
    return {
      icon: Wifi,
      color: 'text-orange-400 border-orange-500/20 bg-orange-950/30 hover:shadow-orange-500/10',
      label: 'MikroTik Network Router OS'
    };
  }
  if (normalized.includes('context')) {
    return {
      icon: Layers,
      color: 'text-violet-400 border-violet-500/20 bg-violet-950/30 hover:shadow-violet-500/10',
      label: 'React Context API State'
    };
  }
  return {
    icon: Code2,
    color: 'text-gray-400 border-gray-500/20 bg-gray-950/30 hover:shadow-gray-500/10',
    label: techName
  };
};

const MOCK_COMMIT_MESSAGES = [
  "refactor: optimize rendering and canvas paint operations",
  "fix: handle responsive breakpoints on landscape viewports",
  "feat: add robust client-side encryption helper",
  "docs: update API endpoints documentation and environment variables",
  "chore: upgrade to React 19 core dependencies",
  "perf: reduce main bundle size by dynamic lazy-loading heavy dependencies",
  "test: include detailed automated end-to-end integration tests",
  "feat: add soundless notification alerts and visual cues"
];

const MOCK_COMMIT_HASHES = ["c0d3f82", "a2b9d0e", "e4f8a12", "8b7d6f1", "f4e5d6c", "b9a8c7d", "e2f3a4b", "d5c6b7a"];

const INITIAL_PROJECT_SYNC_DATA: Record<string, ProjectSyncInfo> = {
  'proj-1': {
    stars: 48,
    forks: 12,
    openIssues: 1,
    latestCommitMessage: "feat: implement persistent theme state & custom visual canvas",
    latestCommitHash: "c0d3f82",
    branch: "main",
    lastSynced: "2 hours ago",
    isSyncing: false,
    codeQuality: {
      securityScore: 99,
      testCoverage: 92,
      performanceGrade: 'A+',
      bundleSize: "4.8 KB",
      maintainability: "Excellent"
    },
    reviewReport: {
      summary: "This codebase displays stellar React practices with high modularity and robust client-side storage caching. Built using high-performance Tailwind styling.",
      strengths: [
        "Perfect separation of concerns across sub-components",
        "Efficient rendering with optimized Framer Motion handlers",
        "Clean server-side API routing logic that secures all AI integrations"
      ],
      improvements: [
        "Can add comprehensive service worker integration for true offline capability",
        "Increase unit test coverage in the CMS state-reducer methods"
      ]
    }
  },
  'proj-2': {
    stars: 84,
    forks: 21,
    openIssues: 3,
    latestCommitMessage: "perf: optimize high-density D3 charts debounce handlers",
    latestCommitHash: "a2b9d0e",
    branch: "main",
    lastSynced: "4 hours ago",
    isSyncing: false,
    codeQuality: {
      securityScore: 95,
      testCoverage: 88,
      performanceGrade: 'A',
      bundleSize: "18.2 KB",
      maintainability: "High"
    },
    reviewReport: {
      summary: "High-performance data-processing engine linking LLMs with mathematical visualization libraries. Outstanding data structures and robust stream management.",
      strengths: [
        "Highly responsive chart rendering with canvas-backed coordinate trees",
        "Dynamic prompt engineering with safe local fallback routines",
        "FastAPI pipeline is clean and well-typed throughout"
      ],
      improvements: [
        "Optimize initial asset load using code-splitting on large D3 dependencies",
        "Consider moving calculations to Web Workers to ensure complete UI thread responsiveness"
      ]
    }
  },
  'proj-3': {
    stars: 32,
    forks: 7,
    openIssues: 0,
    latestCommitMessage: "fix: resolve stripe checkout webhook signature verification",
    latestCommitHash: "e4f8a12",
    branch: "production",
    lastSynced: "5 hours ago",
    isSyncing: false,
    codeQuality: {
      securityScore: 100,
      testCoverage: 96,
      performanceGrade: 'A+',
      bundleSize: "11.4 KB",
      maintainability: "Excellent"
    },
    reviewReport: {
      summary: "Extremely secure transactional layout using Supabase backend constraints. Flawless state preservation during third-party redirect handshakes.",
      strengths: [
        "100% security rating on automated payment Webhook verification",
        "Fully relational PostgreSQL row-level security (RLS) enforcement",
        "Stunning glassmorphic responsive visual design"
      ],
      improvements: [
        "Add a visual cart drawer instead of multi-step full page checks",
        "Implement Redis caching layer for rapid asset catalog querying"
      ]
    }
  },
  'proj-4': {
    stars: 56,
    forks: 14,
    openIssues: 2,
    latestCommitMessage: "feat: add multi-agent fallback protocol and websocket retry limits",
    latestCommitHash: "8b7d6f1",
    branch: "main",
    lastSynced: "1 day ago",
    isSyncing: false,
    codeQuality: {
      securityScore: 97,
      testCoverage: 90,
      performanceGrade: 'A-',
      bundleSize: "7.1 KB",
      maintainability: "High"
    },
    reviewReport: {
      summary: "State-authoritative multiplayer canvas implementation with high performance. Smart usage of custom scheduling intervals and message batching.",
      strengths: [
        "Excellent latency-compensation algorithms on mouse-canvas vectors",
        "Automatic reconnection handshake with linear backoff safety",
        "Sleek and responsive custom slider control panel"
      ],
      improvements: [
        "Introduce binary data serialization (e.g., Protobuf) to reduce frame payload sizes",
        "Incorporate detailed FPS metric overlay in developer-mode logs"
      ]
    }
  }
};

function generateMockSyncData(projectId: string, projectName: string): ProjectSyncInfo {
  const hash = projectId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const stars = 12 + (hash % 65);
  const forks = 3 + (hash % 15);
  const openIssues = hash % 4;
  const commitHash = MOCK_COMMIT_HASHES[hash % MOCK_COMMIT_HASHES.length];
  const commitMsg = MOCK_COMMIT_MESSAGES[hash % MOCK_COMMIT_MESSAGES.length];
  
  return {
    stars,
    forks,
    openIssues,
    latestCommitMessage: commitMsg,
    latestCommitHash: commitHash,
    branch: "main",
    lastSynced: "Just loaded",
    isSyncing: false,
    codeQuality: {
      securityScore: 88 + (hash % 13),
      testCoverage: 80 + (hash % 18),
      performanceGrade: hash % 2 === 0 ? 'A+' : 'A',
      bundleSize: `${(hash % 8) + 2}.${hash % 9} KB`,
      maintainability: 'High'
    },
    reviewReport: {
      summary: `A high-quality codebase for ${projectName}. Implemented with standardized modular architectures, type systems, and rich reactive styles.`,
      strengths: [
        "Strict typescript integration with complete type safety",
        "Fluid CSS animations that align with a modern theme",
        "Optimized components that load and render with minimal latency"
      ],
      improvements: [
        "Increase unit test configurations for full-scale automation",
        "Ensure assets are lazy-loaded to optimize initial load speeds"
      ]
    }
  };
}

export default function App() {
  // Theme state: default to dark
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const cached = localStorage.getItem('kepton_dark_mode');
    return cached !== 'false'; // Dark mode is default (true)
  });
  const [isTransitioningTheme, setIsTransitioningTheme] = useState<boolean>(false);

  // Admin CMS and Chat Widget active states
  const [adminMode, setAdminMode] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  // Core editable datasets initialized from LocalStorage fallbacks
  const [projects, setProjects] = useState<Project[]>(() => {
    const cached = localStorage.getItem('kepton_projects');
    if (cached) {
      try {
        const parsed = JSON.parse(cached) as Project[];
        const hasWifiFlow = parsed.some(p => p.name.includes("WifiFlow Core"));
        if (hasWifiFlow) {
          // Auto-sanitize old /src/assets/ paths to /assets/ if found
          const sanitized = parsed.map(p => {
            const updated = { ...p };
            if (updated.image && updated.image.startsWith('/src/assets/')) {
              updated.image = updated.image.replace('/src/assets/', '/assets/');
            }
            if (!updated.dateCreated) {
              const orig = INITIAL_PROJECTS.find(op => op.id === updated.id);
              updated.dateCreated = orig ? orig.dateCreated : '2024-01-01';
            }
            return updated;
          });
          return sanitized;
        }
      } catch (e) {
        console.error(e);
      }
    }
    localStorage.setItem('kepton_projects', JSON.stringify(INITIAL_PROJECTS));
    return INITIAL_PROJECTS;
  });

  const [skills, setSkills] = useState<Skill[]>(() => {
    const cached = localStorage.getItem('kepton_skills');
    return cached ? JSON.parse(cached) : INITIAL_SKILLS;
  });

  const [education, setEducation] = useState<Education[]>(() => {
    const cached = localStorage.getItem('kepton_education');
    return cached ? JSON.parse(cached) : INITIAL_EDUCATION;
  });

  const [testimonials, setTestimonials] = useState<Testimonial[]>(() => {
    const cached = localStorage.getItem('kepton_testimonials');
    return cached ? JSON.parse(cached) : INITIAL_TESTIMONIALS;
  });

  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(() => {
    const cached = localStorage.getItem('kepton_blog_posts');
    return cached ? JSON.parse(cached) : INITIAL_BLOG_POSTS;
  });

  const [contacts, setContacts] = useState<ContactRequest[]>(() => {
    const cached = localStorage.getItem('kepton_contacts');
    return cached ? JSON.parse(cached) : [];
  });

  // Custom customizable profile picture
  const [profilePic, setProfilePic] = useState<string>(() => {
    return localStorage.getItem('kepton_profile_pic') || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=300&auto=format&fit=crop';
  });

  // Contact form state
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Project Filter state
  const [projectFilter, setProjectFilter] = useState<'All' | 'Web Apps' | 'Mobile' | 'Open Source'>('All');
  const [selectedTech, setSelectedTech] = useState<string>('All');
  const [projectSortOrder, setProjectSortOrder] = useState<'newest' | 'oldest'>('newest');

  // Real-time simulated GitHub Sync state
  const [projectSyncData, setProjectSyncData] = useState<Record<string, ProjectSyncInfo>>(() => {
    const cached = localStorage.getItem('kepton_project_sync_data');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {
        console.error("Error parsing cached sync data", e);
      }
    }
    return INITIAL_PROJECT_SYNC_DATA;
  });

  // State to hold active project undergoing Quick Review
  const [reviewProject, setReviewProject] = useState<Project | null>(null);

  // Blog modal viewer
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  // Drag-and-drop file upload state for profile photo
  const [isDragging, setIsDragging] = useState(false);

  // Sync cache changes to localStorage
  useEffect(() => {
    localStorage.setItem('kepton_project_sync_data', JSON.stringify(projectSyncData));
  }, [projectSyncData]);

  // Handler to trigger simulated live GitHub API repository fetching
  const triggerSync = async (projectId: string) => {
    // 1. Mark isSyncing as true
    setProjectSyncData(prev => {
      const current = prev[projectId] || generateMockSyncData(projectId, "Custom Project");
      return {
        ...prev,
        [projectId]: {
          ...current,
          isSyncing: true
        }
      };
    });

    // 2. Simulate random API fetch delay (800ms - 1500ms)
    const delay = 800 + Math.floor(Math.random() * 700);
    await new Promise(resolve => setTimeout(resolve, delay));

    // 3. Update stats with newly fetched parameters
    setProjectSyncData(prev => {
      const current = prev[projectId] || generateMockSyncData(projectId, "Custom Project");
      const randomHashIndex = Math.floor(Math.random() * MOCK_COMMIT_HASHES.length);
      const randomMsgIndex = Math.floor(Math.random() * MOCK_COMMIT_MESSAGES.length);
      const randCommitHash = MOCK_COMMIT_HASHES[randomHashIndex];
      const randCommitMsg = MOCK_COMMIT_MESSAGES[randomMsgIndex];
      
      const starInc = Math.random() > 0.4 ? 1 : 0;
      const forkInc = Math.random() > 0.8 ? 1 : 0;
      
      return {
        ...prev,
        [projectId]: {
          ...current,
          stars: current.stars + starInc,
          forks: current.forks + forkInc,
          latestCommitHash: randCommitHash,
          latestCommitMessage: randCommitMsg,
          lastSynced: "Just now",
          isSyncing: false
        }
      };
    });
  };

  const handleToggleDarkMode = () => {
    setIsTransitioningTheme(true);
    const changeTheme = () => {
      setDarkMode(prev => !prev);
    };

    if (document && (document as any).startViewTransition) {
      (document as any).startViewTransition(() => {
        changeTheme();
      });
    } else {
      changeTheme();
    }

    setTimeout(() => {
      setIsTransitioningTheme(false);
    }, 500);
  };

  useEffect(() => {
    localStorage.setItem('kepton_dark_mode', String(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('kepton_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    // If the cached projects still use the old placeholder projects or are missing dateCreated, reset to INITIAL_PROJECTS so user sees the new beautiful ones!
    const cached = localStorage.getItem('kepton_projects');
    if (cached) {
      try {
        const parsed = JSON.parse(cached) as Project[];
        const hasOldProjects = parsed.some(p => p.name.includes("Developer Intelligence Test") || p.name.includes("Apex SaaS Predictive"));
        const hasOldRefreshMartImage = parsed.some(p => p.id === 'proj-4' && p.image.includes("unsplash.com") && p.image.includes("1611162617213"));
        const hasOldHospitalImage = parsed.some(p => p.id === 'proj-2' && p.image.includes("unsplash.com") && p.image.includes("1504813184591"));
        const hasOldBodaImage = parsed.some(p => p.id === 'proj-3' && p.image.includes("unsplash.com") && p.image.includes("1626224583764"));
        const missingDateCreated = parsed.some(p => !p.dateCreated);
        
        if (hasOldProjects || hasOldRefreshMartImage || hasOldHospitalImage || hasOldBodaImage || missingDateCreated) {
          setProjects(INITIAL_PROJECTS);
          localStorage.setItem('kepton_projects', JSON.stringify(INITIAL_PROJECTS));
        }
      } catch (e) {
        console.error("Failed to parse projects from local storage:", e);
      }
    }

    // Force refresh skills and education cache if they contain old placeholder values
    const cachedSkills = localStorage.getItem('kepton_skills');
    if (cachedSkills) {
      try {
        const parsedSkills = JSON.parse(cachedSkills) as Skill[];
        const hasOldSkill = parsedSkills.some(s => s.name === 'REST & GraphQL APIs');
        if (hasOldSkill) {
          setSkills(INITIAL_SKILLS);
          localStorage.setItem('kepton_skills', JSON.stringify(INITIAL_SKILLS));
        }
      } catch (e) {
        console.error(e);
      }
    }

    const cachedEdu = localStorage.getItem('kepton_education');
    if (cachedEdu) {
      try {
        const parsedEdu = JSON.parse(cachedEdu) as Education[];
        const hasOldEdu = parsedEdu.some(e => e.institution.includes('Tech Institute') || e.degree.includes('Software Engineering Training'));
        if (hasOldEdu) {
          setEducation(INITIAL_EDUCATION);
          localStorage.setItem('kepton_education', JSON.stringify(INITIAL_EDUCATION));
        }
      } catch (e) {
        console.error(e);
      }
    }

    const cachedTestimonials = localStorage.getItem('kepton_testimonials');
    if (cachedTestimonials) {
      try {
        const parsedTest = JSON.parse(cachedTestimonials) as Testimonial[];
        const hasOldTest = parsedTest.some(t => t.author === 'Sarah Jenkins' || t.avatar.includes('1507003211169'));
        if (hasOldTest) {
          setTestimonials(INITIAL_TESTIMONIALS);
          localStorage.setItem('kepton_testimonials', JSON.stringify(INITIAL_TESTIMONIALS));
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleUpdateProjectLinks = (projectId: string, liveDemoLink: string, githubLink: string) => {
    setProjects(prev => {
      const updated = prev.map(p => p.id === projectId ? { ...p, liveDemoLink, githubLink } : p);
      localStorage.setItem('kepton_projects', JSON.stringify(updated));
      return updated;
    });
    setReviewProject(prev => {
      if (prev && prev.id === projectId) {
        return { ...prev, liveDemoLink, githubLink };
      }
      return prev;
    });
  };

  useEffect(() => {
    localStorage.setItem('kepton_skills', JSON.stringify(skills));
  }, [skills]);

  useEffect(() => {
    localStorage.setItem('kepton_education', JSON.stringify(education));
  }, [education]);

  useEffect(() => {
    localStorage.setItem('kepton_testimonials', JSON.stringify(testimonials));
  }, [testimonials]);

  useEffect(() => {
    localStorage.setItem('kepton_blog_posts', JSON.stringify(blogPosts));
  }, [blogPosts]);

  useEffect(() => {
    localStorage.setItem('kepton_contacts', JSON.stringify(contacts));
  }, [contacts]);

  useEffect(() => {
    localStorage.setItem('kepton_profile_pic', profilePic);
  }, [profilePic]);

  // Handle Contact submit
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMessage) return;

    setIsSubmitting(true);
    
    const newRequest: ContactRequest = {
      id: `contact-${Date.now()}`,
      name: contactName,
      email: contactEmail,
      message: contactMessage,
      date: new Date().toLocaleDateString('en-US', { hour: '2-digit', minute: '2-digit', year: 'numeric', month: 'short', day: 'numeric' })
    };

    // Simulate database/Supabase integration wait time
    await new Promise(resolve => setTimeout(resolve, 800));

    setContacts(prev => [newRequest, ...prev]);
    setIsSubmitting(false);
    setSubmitSuccess(true);
    setContactName('');
    setContactEmail('');
    setContactMessage('');

    // Clear success message after 4s
    setTimeout(() => setSubmitSuccess(false), 4000);
  };

  // Profile image upload handlers
  const processImageFile = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfilePic(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processImageFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      processImageFile(file);
    }
  };

  const handleDownloadResume = () => {
    // Generate an elegant, scannable raw-text curriculum vitae download
    const cvText = `
--------------------------------------------------
KEPTON OTIENO - SOFTWARE DEVELOPER
Nairobi, Kenya | keptonotieno@gmail.com | keptonokoth@gmail.com
Phone: 0700830335
GitHub: https://github.com/Keptonotieno?tab=repositories
LinkedIn: https://www.linkedin.com/in/kepton-otieno
--------------------------------------------------

PROFESSIONAL SUMMARY:
"Software Developer specializing in website development and application development. Skilled in designing, developing, and improving modern software solutions using Java, JavaScript, Python, C++, React, TypeScript, and Spring Boot. Experienced in building responsive web applications, working with databases, and applying problem-solving skills to create efficient solutions. Interested in artificial intelligence and emerging technologies, with a strong commitment to continuous learning and software development practices."

TECHNICAL SKILLS:
- Programming Languages: Java, JavaScript, Python, C++
- Frontend Development: React, TypeScript, HTML5, CSS3, Bootstrap, Tailwind CSS
- Backend Development: Spring Boot, REST API Development
- Databases: Supabase
- Artificial Intelligence: AI concepts and applications, Exploring AI-driven software solutions
- Tools & Platforms: Git, GitHub

WORK EXPERIENCE:
Freelance Software Developer (Freelancer)
2023 - Present
- Developed websites and software applications based on client requirements.
- Designed responsive user interfaces using modern frontend technologies.
- Built and improved application features using Java, JavaScript, Python, and other programming tools.
- Worked on database integration and backend development.
- Applied software development practices to deliver reliable solutions.
- Communicated with clients to understand project needs and provide technical solutions.

EDUCATION:
- Diploma in Computer Science (NIBS Technical College, 2024 - 2026)
- Diploma in Computer Science (Certification)

ADDITIONAL INFORMATION:
- Problem Solving, Team Collaboration, Software Development Practices, Continuous Learning, Adaptability, Technical Research
    `;
    const blob = new Blob([cvText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Kepton_Otieno_Resume.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Dynamically extract all technologies from the projects array
  const availableTechnologies = React.useMemo(() => {
    const techSet = new Set<string>();
    projects.forEach(p => {
      if (p.technologies) {
        p.technologies.forEach(t => {
          if (t && t.trim()) {
            techSet.add(t.trim());
          }
        });
      }
    });
    return ['All', ...Array.from(techSet).sort()];
  }, [projects]);

  // Count how many projects use each technology
  const techCounts = React.useMemo(() => {
    const counts: Record<string, number> = {};
    projects.forEach(p => {
      if (p.technologies) {
        p.technologies.forEach(t => {
          const cleanTech = t.trim();
          counts[cleanTech] = (counts[cleanTech] || 0) + 1;
        });
      }
    });
    return counts;
  }, [projects]);

  // Filtered and sorted projects based on Category, Technology and Sort Order
  const filteredProjects = projects.filter(p => {
    // 1. Category check
    let matchesCategory = true;
    if (projectFilter === 'Web Apps') {
      matchesCategory = p.category === 'Full Stack' || p.category === 'React' || p.category === 'Web Applications' || p.category === 'AI';
    } else if (projectFilter === 'Mobile') {
      matchesCategory = p.description.toLowerCase().includes('responsive') || p.description.toLowerCase().includes('mobile') || p.technologies.some(t => t.toLowerCase().includes('responsive'));
    } else if (projectFilter === 'Open Source') {
      matchesCategory = !!(p.githubLink && p.githubLink.includes('github.com'));
    }

    // 2. Technology check
    let matchesTech = true;
    if (selectedTech !== 'All') {
      matchesTech = p.technologies && p.technologies.map(t => t.trim().toLowerCase()).includes(selectedTech.trim().toLowerCase());
    }

    return matchesCategory && matchesTech;
  }).sort((a, b) => {
    const timeA = a.dateCreated ? new Date(a.dateCreated).getTime() : 0;
    const timeB = b.dateCreated ? new Date(b.dateCreated).getTime() : 0;
    if (projectSortOrder === 'newest') {
      return timeB - timeA;
    } else {
      return timeA - timeB;
    }
  });

  return (
    <div className={`min-h-screen font-sans ${
      isTransitioningTheme ? 'theme-transition' : 'transition-colors duration-500'
    } ${
      darkMode ? 'bg-gray-950 text-gray-100' : 'bg-slate-50 text-gray-800'
    }`}>
      {/* Interactive Floating Canvas Network */}
      <ParticlesBackground darkMode={darkMode} />

      {/* Floating Header */}
      <Header 
        darkMode={darkMode} 
        toggleDarkMode={handleToggleDarkMode}
        adminMode={adminMode}
        setAdminMode={setAdminMode}
        onOpenChat={() => setChatOpen(true)}
      />

      {/* 1. HERO SECTION */}
      <section 
        id="hero" 
        className={`relative pt-32 pb-24 px-6 overflow-hidden flex items-center min-h-[90vh] ${
          darkMode ? 'cyber-grid text-white' : 'cyber-grid-light'
        }`}
      >
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          {/* Hero Bio */}
          <div className="lg:col-span-7 space-y-8 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold font-mono border bg-cyan-500/10 border-cyan-500/30 text-cyan-400 glow-cyan">
              <Sparkles size={12} className="animate-spin" />
              <span>Nairobi, Kenya</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>

            <h1 className="text-4xl sm:text-6xl font-sans font-extrabold tracking-tight leading-[1.1]">
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
                Kepton Otieno
              </span>
              <span className={`block text-xl sm:text-2xl mt-3 font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Software Developer | Web & Application Developer | AI Enthusiast
              </span>
            </h1>

            <p className={`text-sm sm:text-base max-w-xl leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Software Developer specializing in website and application development. Skilled in designing, developing, and improving modern software solutions using Java, JavaScript, Python, C++, React, TypeScript, and Spring Boot.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <a
                id="hero-view-projects-btn"
                href="#projects"
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-6 py-3.5 bg-gradient-to-r from-cyan-500 to-purple-600 hover:opacity-95 text-white text-sm font-semibold rounded-xl shadow-lg hover:shadow-cyan-500/20 hover:scale-[1.02] transition-all flex items-center gap-2"
              >
                <span>View My Work</span>
                <ArrowRight size={16} />
              </a>

              <button
                id="hero-download-resume-btn"
                onClick={handleDownloadResume}
                className={`px-6 py-3.5 border rounded-xl text-sm font-semibold hover:scale-[1.02] transition-all flex items-center gap-2 ${
                  darkMode 
                    ? 'border-white/10 hover:bg-white/5 text-gray-200' 
                    : 'border-black/10 hover:bg-black/5 text-gray-700'
                }`}
              >
                <Download size={16} />
                <span>Download Resume</span>
              </button>

              <a
                id="hero-contact-btn"
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`px-6 py-3.5 border rounded-xl text-sm font-semibold hover:scale-[1.02] transition-all flex items-center gap-2 ${
                  darkMode 
                    ? 'border-white/10 hover:bg-white/5 text-gray-200' 
                    : 'border-black/10 hover:bg-black/5 text-gray-700'
                }`}
              >
                <MessageSquare size={16} />
                <span>Contact Me</span>
              </a>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-500/10 max-w-md font-mono">
              <div>
                <p className="text-xl sm:text-2xl font-bold text-cyan-400">Mid</p>
                <p className="text-[10px] uppercase text-gray-400 tracking-wider">Level Dev</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold text-purple-400">100%</p>
                <p className="text-[10px] uppercase text-gray-400 tracking-wider">Responsive</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold text-emerald-400">AI</p>
                <p className="text-[10px] uppercase text-gray-400 tracking-wider">Integrated</p>
              </div>
            </div>
          </div>

          {/* Hero Profile Photo Container (Editable via Drag & Drop or Click) */}
          <div className="lg:col-span-5 flex justify-center relative">
            <div 
              id="hero-profile-dropzone"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`relative group w-72 h-72 sm:w-85 sm:h-85 rounded-3xl p-3 border transition-all duration-300 ${
                isDragging 
                  ? 'border-cyan-400 bg-cyan-500/10 scale-105' 
                  : darkMode 
                  ? 'border-white/10 bg-gray-900/40 backdrop-blur-md' 
                  : 'border-black/10 bg-white shadow-xl'
              }`}
            >
              <div className="w-full h-full rounded-2xl overflow-hidden relative bg-gray-800">
                <img 
                  id="hero-profile-avatar"
                  src={profilePic} 
                  alt="Kepton Otieno" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                
                {/* Upload Banner overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4 text-center text-white">
                  <Upload size={24} className="text-cyan-400 mb-2 animate-bounce" />
                  <p className="font-sans text-xs font-bold">Drag & Drop Profile Picture</p>
                  <p className="text-[10px] text-gray-400 mt-1">or click to choose image file</p>
                  
                  <label className="absolute inset-0 cursor-pointer">
                    <input 
                      id="hero-avatar-file-input"
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageChange} 
                      className="hidden" 
                    />
                  </label>
                </div>
              </div>

              {/* Glowing Corner Accents */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyan-400 rounded-tl-3xl pointer-events-none" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-purple-500 rounded-br-3xl pointer-events-none" />
            </div>
          </div>

        </div>
      </section>

      {/* VENTURE PORTFOLIO (Mockup Style) */}
      <VenturePortfolio darkMode={darkMode} />

      {/* 2. ABOUT ME SECTION */}
      <section id="about" className="py-24 px-6 relative border-t border-gray-500/10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-5 space-y-6">
            <div className={`p-6 rounded-2xl border ${
              darkMode ? 'bg-white/5 border-white/5' : 'bg-white border-black/5 shadow-md'
            }`}>
              <span className="font-mono text-xs text-purple-400 font-semibold uppercase tracking-widest block mb-2">Core philosophy</span>
              <p className={`font-sans text-sm italic leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                "I combine software engineering skills with artificial intelligence knowledge to create modern digital solutions. My journey is driven by continuous learning, maintaining technical precision, and solving real-world challenges through elegant architectures."
              </p>
              <div className="flex gap-2 mt-4 items-center">
                <div className="w-8 h-[1px] bg-purple-500" />
                <span className="font-sans font-bold text-xs text-gray-400">Kepton Otieno</span>
              </div>
            </div>

            <div className={`p-6 rounded-2xl border ${
              darkMode ? 'bg-white/5 border-white/5' : 'bg-white border-black/5 shadow-md'
            } grid grid-cols-2 gap-4`}>
              <div>
                <span className="font-mono text-[10px] text-gray-400 uppercase">Focus Area</span>
                <p className="font-sans text-sm font-bold text-cyan-400 mt-0.5">Full Stack Engineering</p>
              </div>
              <div>
                <span className="font-mono text-[10px] text-gray-400 uppercase">Tech Mindset</span>
                <p className="font-sans text-sm font-bold text-purple-400 mt-0.5">AI Integrated Systems</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 text-left space-y-6">
            <div className="space-y-2">
              <span className="font-mono text-xs text-cyan-400 font-bold uppercase tracking-wider">01 // IDENTITY NODE</span>
              <h2 className="text-3xl font-sans font-extrabold tracking-tight">Biography & Profile Summary</h2>
            </div>

            <p className={`text-sm sm:text-base leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              I am a freelance and mid-level full-stack developer specializing in building responsive, scalable web applications. I combine software engineering skills with artificial intelligence knowledge to create modern digital solutions.
            </p>

            <p className={`text-sm leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              With strong competence in backend logic orchestration and custom frontend implementation, I focus on robust codebases that load at extreme speeds. I hold a deep passion for continuous self-directed learning, allowing me to stay ahead in web technologies, database patterns, and modern API infrastructures.
            </p>

            {/* Bullets highlighting problem solving */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="flex gap-3 items-start">
                <div className="w-5 h-5 rounded-full bg-cyan-400/20 text-cyan-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Check size={12} />
                </div>
                <div>
                  <h4 className="font-sans font-bold text-sm">Problem-Solving Mindset</h4>
                  <p className="text-xs text-gray-400 mt-0.5">Navigating complex algorithmic paths with C++ and Python.</p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <div className="w-5 h-5 rounded-full bg-cyan-400/20 text-cyan-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Check size={12} />
                </div>
                <div>
                  <h4 className="font-sans font-bold text-sm">Continuous Learning</h4>
                  <p className="text-xs text-gray-400 mt-0.5">Constantly experimenting with Gemini, LLMs, and SaaS patterns.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* EXPERTISE SECTION (Mockup Style: Technical Arsenal + How I Can Help You) */}
      <ExpertiseSection darkMode={darkMode} />

      {/* 4. EXPERIENCE SECTION (Timeline style) */}
      <section id="experience" className="py-24 px-6 relative border-t border-gray-500/10">
        <div className="max-w-5xl mx-auto space-y-12">
          
          <div className="text-center space-y-3 max-w-xl mx-auto">
            <span className="font-mono text-xs text-cyan-400 font-bold uppercase tracking-widest">03 // CHRONOLOGY LOGS</span>
            <h2 className="text-3xl font-sans font-extrabold tracking-tight">Professional Experience Timeline</h2>
          </div>

          <div className="relative border-l border-gray-500/20 ml-4 md:ml-6 space-y-12 pt-4">
            {INITIAL_EXPERIENCE.map((exp, index) => (
              <div key={exp.id} className="relative pl-8 sm:pl-10 group">
                {/* Connector point */}
                <div className="absolute left-0 top-1 w-4 h-4 rounded-full bg-cyan-400 border-4 border-gray-950 -translate-x-[9px] group-hover:scale-125 transition-transform" />

                <div className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h3 className="font-sans font-bold text-lg">{exp.role}</h3>
                      <p className="font-mono text-xs text-cyan-400">{exp.company}</p>
                    </div>
                    <span className="px-3 py-1 bg-gray-500/10 rounded-full font-mono text-[10px] font-bold text-gray-400 border border-gray-500/20">
                      {exp.duration}
                    </span>
                  </div>

                  <p className="font-sans text-xs font-semibold text-purple-400">
                    {exp.level}
                  </p>

                  <ul className="space-y-2.5 text-xs text-gray-400 leading-relaxed max-w-3xl list-disc list-inside">
                    {exp.responsibilities.map((resp, rIdx) => (
                      <li key={rIdx}>{resp}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 5. EDUCATION SECTION (Timeline style, editable in CMS) */}
      <section id="education" className={`py-24 px-6 relative border-t border-gray-500/10 ${
        darkMode ? 'bg-gray-900/10' : 'bg-white'
      }`}>
        <div className="max-w-5xl mx-auto space-y-12">
          
          <div className="text-center space-y-3 max-w-xl mx-auto">
            <span className="font-mono text-xs text-purple-400 font-bold uppercase tracking-widest">04 // KNOWLEDGE NODES</span>
            <h2 className="text-3xl font-sans font-extrabold tracking-tight">Education & Certifications</h2>
            <p className="text-xs text-gray-400">
              Credentials validating software engineering acumen and continuous tech training.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {education.map((edu) => (
              <div 
                key={edu.id}
                className={`p-6 rounded-2xl border transition-all hover-scale ${
                  darkMode ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-black/5 shadow-sm'
                } flex gap-4 items-start`}
              >
                <div className="w-10 h-10 rounded-xl bg-purple-600/10 text-purple-400 flex items-center justify-center shrink-0">
                  <GraduationCap size={20} />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 font-mono text-[9px] font-bold">
                      {edu.type}
                    </span>
                    <span className="font-mono text-[10px] text-gray-500 font-semibold">{edu.duration}</span>
                  </div>
                  <h3 className="font-sans font-bold text-sm leading-snug">{edu.degree}</h3>
                  <p className="text-xs text-gray-400">{edu.institution}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 6. PROJECTS SHOWCASE */}
      <section id="projects" className="py-24 px-6 relative border-t border-gray-500/10">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <span className="font-mono text-xs text-cyan-400 font-extrabold uppercase tracking-widest">// Code Repositories</span>
            <h2 className="text-3xl sm:text-4xl font-sans font-extrabold tracking-tight">Recent Projects</h2>
            <p className="text-xs text-gray-400">
              Explore my latest client-commissioned solutions, open-source architectures, and full-stack modules.
            </p>
          </div>

          {/* Dual Filtering Panel */}
          <div className="space-y-6 max-w-4xl mx-auto">
            {/* Category Filter */}
            <div className="flex flex-col items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-gray-400 font-extrabold">
                Filter by Stream
              </span>
              <div className="flex flex-wrap items-center justify-center gap-2">
                {(['All', 'Web Apps', 'Mobile', 'Open Source'] as const).map((cat) => (
                  <button
                    id={`project-filter-${cat.toLowerCase().replace(' ', '-')}`}
                    key={cat}
                    onClick={() => {
                      setProjectFilter(cat);
                    }}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold font-sans transition-all duration-300 ${
                      projectFilter === cat
                        ? 'bg-cyan-500 text-gray-950 shadow-md shadow-cyan-500/20 font-bold hover:scale-105'
                        : darkMode 
                        ? 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/5 hover:scale-105' 
                        : 'bg-white hover:bg-gray-100 text-gray-600 border border-black/5 shadow-sm hover:scale-105'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Dynamic Technology Filter */}
            <div className="flex flex-col items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-gray-400 font-extrabold">
                Filter by Tech Stack
              </span>
              <div className="flex flex-wrap items-center justify-center gap-1.5 max-w-3xl">
                {availableTechnologies.map((tech) => {
                  const isSelected = selectedTech === tech;
                  const count = techCounts[tech];
                  return (
                    <button
                      id={`project-tech-filter-${tech.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                      key={tech}
                      onClick={() => setSelectedTech(tech)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium font-mono transition-all duration-200 flex items-center gap-1.5 hover:scale-105 ${
                        isSelected
                          ? 'bg-purple-500 text-white shadow-md shadow-purple-500/20'
                          : darkMode
                          ? 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/5'
                          : 'bg-white text-gray-500 hover:text-gray-950 hover:bg-gray-100 border border-black/5 shadow-sm'
                      }`}
                    >
                      <span>{tech}</span>
                      {tech !== 'All' && count !== undefined && (
                        <span className={`text-[9px] px-1 rounded-md font-sans ${
                          isSelected 
                            ? 'bg-purple-600/50 text-purple-100' 
                            : darkMode 
                            ? 'bg-white/10 text-gray-400' 
                            : 'bg-gray-100 text-gray-500'
                        }`}>
                          {count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sorting Dropdown */}
            <div className="flex flex-col items-center gap-2 pt-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-gray-400 font-extrabold flex items-center gap-1.5">
                <ArrowUpDown size={11} className="text-cyan-400" />
                Sort Projects By
              </span>
              <div className="relative inline-block w-52">
                <select
                  id="project-sort-select"
                  value={projectSortOrder}
                  onChange={(e) => setProjectSortOrder(e.target.value as 'newest' | 'oldest')}
                  className={`w-full pl-4 pr-10 py-2 rounded-xl text-xs font-bold font-sans transition-all duration-300 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-400 ${
                    darkMode
                      ? 'bg-white/5 text-gray-300 border border-white/5 hover:bg-white/10'
                      : 'bg-white text-gray-700 border border-black/5 shadow-sm hover:bg-gray-50'
                  }`}
                >
                  <option value="newest" className={darkMode ? 'bg-gray-900 text-white font-bold' : 'bg-white text-gray-900 font-bold'}>
                    Newest First (Date)
                  </option>
                  <option value="oldest" className={darkMode ? 'bg-gray-900 text-white font-bold' : 'bg-white text-gray-900 font-bold'}>
                    Oldest First (Date)
                  </option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-cyan-400">
                  <ChevronDown size={12} />
                </div>
              </div>
            </div>
          </div>

          {/* Projects gallery */}
          {filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 pt-4">
              {filteredProjects.map((proj) => {
                const syncInfo = projectSyncData[proj.id] || generateMockSyncData(proj.id, proj.name);
                return (
                  <ProjectCard
                    key={proj.id}
                    proj={proj}
                    syncInfo={syncInfo}
                    triggerSync={triggerSync}
                    selectedTech={selectedTech}
                    setSelectedTech={setSelectedTech}
                    setReviewProject={setReviewProject}
                    darkMode={darkMode}
                  />
                );
              })}
            </div>
          ) : (
            <div className={`p-12 text-center rounded-2xl border ${
              darkMode ? 'bg-white/5 border-white/5' : 'bg-white border-black/5 shadow-md'
            } space-y-4 max-w-lg mx-auto mt-8`}>
              <div className="mx-auto w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400">
                <Sliders size={20} />
              </div>
              <h3 className="font-sans font-extrabold text-lg">No matching projects found</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                There are currently no projects matching both the selected stream <span className="text-cyan-400 font-semibold font-mono">"{projectFilter}"</span> and technology <span className="text-purple-400 font-semibold font-mono">"{selectedTech}"</span>.
              </p>
              <button
                id="reset-project-filters-btn"
                onClick={() => {
                  setProjectFilter('All');
                  setSelectedTech('All');
                }}
                className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 text-gray-950 font-bold font-sans rounded-xl text-xs shadow-md shadow-cyan-500/10 hover:shadow-cyan-500/20 hover:scale-[1.02] transition-all"
              >
                Reset Filter Parameters
              </button>
            </div>
          )}

        </div>
      </section>

      {/* 6.5 INTERACTIVE GAMIFICATION HUB */}
      <section id="developer-intelligence" className="py-24 px-6 relative border-t border-gray-500/10">
        <div className="max-w-7xl mx-auto space-y-16">
          
          {/* Test Component */}
          <DeveloperIntelligenceTest darkMode={darkMode} />

          {/* Code Snake Game Component */}
          <KeptonCodeSnake darkMode={darkMode} />

        </div>
      </section>

      {/* 7. SERVICES SECTION */}
      <section id="services" className={`py-24 px-6 relative border-t border-gray-500/10 ${
        darkMode ? 'bg-gray-900/10' : 'bg-white'
      }`}>
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-center space-y-3 max-w-xl mx-auto">
            <span className="font-mono text-xs text-purple-400 font-bold uppercase tracking-widest">06 // FUNCTIONAL SERVICES</span>
            <h2 className="text-3xl font-sans font-extrabold tracking-tight">Full Stack Services Offered</h2>
            <p className="text-xs text-gray-400">
              Technical capability structures ready for hire, corporate consultancy, and contract execution.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Service 1 */}
            <div className={`p-6 rounded-2xl border transition-all hover-scale ${
              darkMode ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-black/5 shadow-sm'
            } space-y-4`}>
              <div className="w-10 h-10 rounded-xl bg-cyan-400/10 text-cyan-400 flex items-center justify-center">
                <Laptop size={18} />
              </div>
              <h3 className="font-sans font-bold text-sm uppercase tracking-wider">Full Stack Web Development</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Assembling end-to-end web products. Establishing high-speed backend integrations paired with pixel-perfect user interfaces in React.
              </p>
            </div>

            {/* Service 2 */}
            <div className={`p-6 rounded-2xl border transition-all hover-scale ${
              darkMode ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-black/5 shadow-sm'
            } space-y-4`}>
              <div className="w-10 h-10 rounded-xl bg-purple-600/10 text-purple-400 flex items-center justify-center">
                <Layout size={18} />
              </div>
              <h3 className="font-sans font-bold text-sm uppercase tracking-wider">Frontend Development</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Compiling high-fidelity, smooth interactive user interfaces using modern CSS frameworks like Tailwind CSS, backed by Framer Motion.
              </p>
            </div>

            {/* Service 3 */}
            <div className={`p-6 rounded-2xl border transition-all hover-scale ${
              darkMode ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-black/5 shadow-sm'
            } space-y-4`}>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <BrainCircuit size={18} />
              </div>
              <h3 className="font-sans font-bold text-sm uppercase tracking-wider">AI Integration</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Securing LLMs server-side. Building custom chat co-pilots, structured intelligence responses, and automated prompt flows.
              </p>
            </div>

            {/* Service 4 */}
            <div className={`p-6 rounded-2xl border transition-all hover-scale ${
              darkMode ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-black/5 shadow-sm'
            } space-y-4`}>
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <Database size={18} />
              </div>
              <h3 className="font-sans font-bold text-sm uppercase tracking-wider">Database Solutions</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Architecting schemas, security policy declarations, file buckets, and backend logic flows leveraging Postgres and Supabase.
              </p>
            </div>

            {/* Service 5 */}
            <div className={`p-6 rounded-2xl border transition-all hover-scale ${
              darkMode ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-black/5 shadow-sm'
            } space-y-4`}>
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                <Sliders size={18} />
              </div>
              <h3 className="font-sans font-bold text-sm uppercase tracking-wider">Website Optimization</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Elevating page velocities, streamlining modular dependencies, checking core web vitals, and asserting robust technical SEO.
              </p>
            </div>

            {/* Service 6 */}
            <div className={`p-6 rounded-2xl border transition-all hover-scale ${
              darkMode ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-black/5 shadow-sm'
            } space-y-4`}>
              <div className="w-10 h-10 rounded-xl bg-pink-500/10 text-pink-400 flex items-center justify-center">
                <Server size={18} />
              </div>
              <h3 className="font-sans font-bold text-sm uppercase tracking-wider">Backend Integration</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Orchestrating robust REST or GraphQL API structures, custom route controllers, proxy services, and secure webhook setups.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 8. GITHUB INTEGRATION SHOWCASE */}
      <section id="github-showcase" className="py-24 px-6 relative border-t border-gray-500/10">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-center space-y-3 max-w-xl mx-auto">
            <span className="font-mono text-xs text-cyan-400 font-bold uppercase tracking-widest">07 // TELEMETRY CODE LOGS</span>
            <h2 className="text-3xl font-sans font-extrabold tracking-tight">GitHub Activity showcase</h2>
          </div>

          <GithubContributionGraph darkMode={darkMode} username="Keptonotieno" />

        </div>
      </section>

      {/* 9. TESTIMONIALS SECTION */}
      <section id="testimonials" className={`py-24 px-6 relative border-t border-gray-500/10 ${
        darkMode ? 'bg-gray-900/20' : 'bg-white'
      }`}>
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-center space-y-3 max-w-xl mx-auto">
            <span className="font-mono text-xs text-purple-400 font-bold uppercase tracking-widest">08 // RECOGNITION REGISTRIES</span>
            <h2 className="text-3xl font-sans font-extrabold tracking-tight">Testimonials & Client Feedback</h2>
            <p className="text-xs text-gray-400">
              Evaluations from collaborative software engineering partnerships and contract achievements.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((test) => (
              <div 
                key={test.id}
                className={`p-6 sm:p-8 rounded-2xl border flex flex-col justify-between hover-scale ${
                  darkMode ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-black/5 shadow-sm'
                }`}
              >
                <p className={`font-sans text-xs sm:text-sm leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  "{test.text}"
                </p>

                <div className="flex items-center gap-4 pt-6 border-t border-gray-500/10 mt-6">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-800 shrink-0">
                    <img 
                      src={test.avatar} 
                      alt={test.author} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <h4 className="font-sans font-bold text-xs">{test.author}</h4>
                    <p className="text-[10px] text-gray-400 font-mono">{test.role} // {test.company}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 10. TECHNICAL BLOG SECTION */}
      <section id="blog" className="py-24 px-6 relative border-t border-gray-500/10">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-center space-y-3 max-w-xl mx-auto">
            <span className="font-mono text-xs text-cyan-400 font-bold uppercase tracking-widest">09 // CHRONICLED WRITINGS</span>
            <h2 className="text-3xl font-sans font-extrabold tracking-tight">Technical Publications & Blog</h2>
            <p className="text-xs text-gray-400">
              Deep dives and guides covering advanced web architectures, software logic, and AI integrations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <div 
                key={post.id}
                className={`p-6 rounded-2xl border flex flex-col justify-between hover-scale group cursor-pointer ${
                  darkMode ? 'bg-white/5 border-white/5' : 'bg-white border-black/5 shadow-md'
                }`}
                onClick={() => setSelectedPost(post)}
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-[10px] font-mono font-bold text-cyan-400 border-b border-gray-500/10 pb-2.5">
                    <span>{post.category}</span>
                    <span className="text-gray-500 font-semibold">{post.date}</span>
                  </div>

                  <h3 className="font-sans font-bold text-sm leading-snug group-hover:text-cyan-400 transition-colors">
                    {post.title}
                  </h3>

                  <p className={`text-xs leading-relaxed line-clamp-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {post.snippet}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-gray-500/10 mt-6 text-[10px] font-semibold text-gray-500 font-mono">
                  <span className="flex items-center gap-1.5">
                    <Clock size={11} className="text-cyan-400" />
                    {calculateReadingTime(post.content)}
                  </span>
                  <span className="text-cyan-400 group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                    Read Article
                    <ChevronRight size={10} />
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 11. CONTACT SECTION */}
      <section id="contact" className={`py-24 px-6 relative border-t border-gray-500/10 ${
        darkMode ? 'bg-gray-900/20' : 'bg-white'
      }`}>
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column info */}
          <div className="lg:col-span-5 space-y-6 text-left">
            <div className="space-y-2">
              <span className="font-mono text-xs text-purple-400 font-bold uppercase tracking-widest">10 // COMMUNICATION TERMINAL</span>
              <h2 className="text-3xl font-sans font-extrabold tracking-tight">Initiate Technical Sync</h2>
              <p className="text-xs text-gray-400">
                Are you a recruiter, startup founder, or looking for high-end freelance engineering? Let's connect.
              </p>
            </div>

            <p className={`text-xs sm:text-sm leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Fill out the interactive contact matrix. Messages synched in real-time and stored directly for review inside the Admin CMS Panel Inbox.
            </p>

            <div className="space-y-4 pt-4 font-sans text-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-400/10 text-cyan-400 flex items-center justify-center shrink-0">
                  <Mail size={16} />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest font-mono">Direct Communication</p>
                  <div className="flex flex-col">
                    <a href="mailto:keptonotieno@gmail.com" className="font-bold hover:underline">keptonotieno@gmail.com</a>
                    <a href="mailto:keptonokoth@gmail.com" className="font-semibold hover:underline text-gray-400">keptonokoth@gmail.com</a>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-400/10 text-emerald-400 flex items-center justify-center shrink-0">
                  <Phone size={16} />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest font-mono">Mobile Terminal</p>
                  <a href="tel:0700830335" className="font-bold hover:underline">0700830335</a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-600/10 text-purple-400 flex items-center justify-center shrink-0">
                  <MapPin size={16} />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest font-mono">Location Base</p>
                  <p className="font-bold">Nairobi, Kenya</p>
                </div>
              </div>
            </div>

            {/* Social icons row */}
            <div className="flex gap-4 pt-6">
              <a 
                id="social-link-github"
                href="https://github.com/Keptonotieno?tab=repositories" 
                target="_blank" 
                rel="noopener noreferrer"
                className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-colors ${
                  darkMode ? 'border-white/10 hover:bg-white/5 text-gray-300' : 'border-black/10 hover:bg-black/5 text-gray-600'
                }`}
              >
                <Github size={18} />
              </a>
              <a 
                id="social-link-linkedin"
                href="https://www.linkedin.com/in/kepton-otieno" 
                target="_blank" 
                rel="noopener noreferrer"
                className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-colors ${
                  darkMode ? 'border-white/10 hover:bg-white/5 text-gray-300' : 'border-black/10 hover:bg-black/5 text-gray-600'
                }`}
              >
                <Linkedin size={18} />
              </a>
              <a 
                id="social-link-tiktok"
                href="https://www.tiktok.com/@keptonotieno" 
                target="_blank" 
                rel="noopener noreferrer"
                className={`w-10 h-10 rounded-xl border flex items-center justify-center font-bold tracking-widest transition-colors ${
                  darkMode ? 'border-white/10 hover:bg-white/5 text-gray-300' : 'border-black/10 hover:bg-black/5 text-gray-600'
                }`}
              >
                <span className="text-xs font-mono font-bold">T</span>
              </a>
            </div>
          </div>

          {/* Right Column: Contact form */}
          <div className="lg:col-span-7">
            <form 
              id="portfolio-contact-form"
              onSubmit={handleContactSubmit}
              className={`p-6 sm:p-8 rounded-3xl border text-left space-y-4 ${
                darkMode ? 'bg-white/5 border-white/5' : 'bg-white border-black/5 shadow-xl'
              }`}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase text-gray-400 font-mono font-bold tracking-widest">Ident name</label>
                  <input
                    id="contact-name-input"
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Enter full name"
                    className={`w-full px-4 py-3 rounded-xl text-xs border focus:outline-none focus:ring-1 focus:ring-cyan-400 ${
                      darkMode ? 'bg-black border-white/10 text-white' : 'bg-slate-50 border-black/10 text-gray-900'
                    }`}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase text-gray-400 font-mono font-bold tracking-widest">Email address</label>
                  <input
                    id="contact-email-input"
                    type="email"
                    required
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="example@gmail.com"
                    className={`w-full px-4 py-3 rounded-xl text-xs border focus:outline-none focus:ring-1 focus:ring-cyan-400 ${
                      darkMode ? 'bg-black border-white/10 text-white' : 'bg-slate-50 border-black/10 text-gray-900'
                    }`}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase text-gray-400 font-mono font-bold tracking-widest">Technical details / message</label>
                <textarea
                  id="contact-message-input"
                  required
                  rows={4}
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  placeholder="Tell me about your project opportunity..."
                  className={`w-full px-4 py-3 rounded-xl text-xs border focus:outline-none focus:ring-1 focus:ring-cyan-400 ${
                    darkMode ? 'bg-black border-white/10 text-white' : 'bg-slate-50 border-black/10 text-gray-900'
                  }`}
                />
              </div>

              <button
                id="contact-form-submit-btn"
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-purple-600 hover:opacity-95 text-white rounded-xl text-xs font-bold shadow-lg hover:shadow-cyan-500/15 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                ) : (
                  <>
                    <Send size={14} />
                    <span>Send Technical Message</span>
                  </>
                )}
              </button>

              <AnimatePresence>
                {submitSuccess && (
                  <motion.div
                    id="contact-success-banner"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl text-center text-xs font-medium"
                  >
                    Message successfully dispatched! View it in the <strong>Admin CMS Inbox</strong> node!
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className={`py-12 border-t border-gray-500/10 text-center text-xs ${
        darkMode ? 'bg-gray-950 text-gray-400' : 'bg-white text-gray-500'
      }`}>
        <div className="max-w-7xl mx-auto px-6 space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                KO
              </div>
              <span className={`font-bold font-sans ${darkMode ? 'text-white' : 'text-gray-900'}`}>Kepton Otieno</span>
            </div>
            
            <ul className="flex flex-wrap justify-center gap-6 font-medium">
              <li><a href="#about" className="hover:text-cyan-400">About</a></li>
              <li><a href="#skills" className="hover:text-cyan-400">Skills</a></li>
              <li><a href="#projects" className="hover:text-cyan-400">Projects</a></li>
              <li><a href="#developer-intelligence" className="hover:text-cyan-400">Arena</a></li>
              <li><a href="#blog" className="hover:text-cyan-400">Blog</a></li>
              <li><a href="#contact" className="hover:text-cyan-400">Contact</a></li>
              <li>
                <button 
                  id="footer-cms-trigger"
                  onClick={() => setAdminMode(true)} 
                  className="text-purple-400 font-semibold hover:underline"
                >
                  Admin CMS Mode
                </button>
              </li>
            </ul>
          </div>

          <div className="h-[1px] bg-gray-500/10" />

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[10px] text-gray-500">
            <p>© {new Date().getFullYear()} Kepton Otieno. All rights reserved.</p>
            <p>DESIGNED FOR INNOVATION // POWERED BY GEMINI 3.5 FLASH</p>
          </div>
        </div>
      </footer>

      {/* 12. FLOATING ASSISTANT DISPATCHER ACCENT BUTTON */}
      <button
        id="floating-ai-co-pilot-btn"
        onClick={() => setChatOpen(true)}
        className="fixed bottom-6 right-6 z-30 p-4 bg-gradient-to-tr from-cyan-400 to-purple-600 hover:scale-105 transition-transform duration-300 rounded-2xl shadow-2xl flex items-center justify-center text-white group"
        title="Open AI Co-Pilot Assistant"
      >
        <MessageSquareCode size={22} className="group-hover:rotate-12 transition-transform" />
        <span className="absolute right-full mr-3 bg-gray-900/95 backdrop-blur border border-white/10 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none text-cyan-400">
          Ask my Co-Pilot
        </span>
      </button>

      {/* MODAL 1: AI Chatbot sliding Drawer widget */}
      <AIChatbot 
        isOpen={chatOpen} 
        onClose={() => setChatOpen(false)} 
        darkMode={darkMode}
      />

      {/* MODAL 2: Admin CMS Dashboard Overlay */}
      <AdminCMS
        isOpen={adminMode}
        onClose={() => setAdminMode(false)}
        darkMode={darkMode}
        projects={projects}
        setProjects={setProjects}
        skills={skills}
        setSkills={setSkills}
        education={education}
        setEducation={setEducation}
        testimonials={testimonials}
        setTestimonials={setTestimonials}
        blogPosts={blogPosts}
        setBlogPosts={setBlogPosts}
        contacts={contacts}
        onClearContacts={() => setContacts([])}
        profilePic={profilePic}
        setProfilePic={setProfilePic}
      />

      {/* MODAL 3: Detailed Blog Post Reader */}
      <AnimatePresence>
        {selectedPost && (
          <div id="blog-reader-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              id="blog-reader-card"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl border p-6 sm:p-8 space-y-6 ${
                darkMode ? 'bg-gray-950 border-white/10 text-white' : 'bg-white border-black/10 text-gray-900'
              }`}
            >
              <div className="flex justify-between items-start border-b border-gray-500/10 pb-4">
                <div className="space-y-1">
                  <span className="px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 font-mono text-[9px] font-bold uppercase tracking-wider">
                    {selectedPost.category}
                  </span>
                  <h3 className="font-sans font-extrabold text-xl sm:text-2xl mt-2">{selectedPost.title}</h3>
                  <p className="font-mono text-[10px] text-gray-400">{selectedPost.date} // By {selectedPost.author}</p>
                </div>
                <button
                  id="close-blog-reader-btn"
                  onClick={() => setSelectedPost(null)}
                  className={`p-1.5 rounded-lg hover:bg-gray-500/10 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
                >
                  <X size={20} />
                </button>
              </div>

              <div className={`font-sans text-xs sm:text-sm leading-relaxed space-y-4 whitespace-pre-line ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {selectedPost.content}
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-gray-500/10">
                <span className="font-mono text-[10px] text-gray-500 flex items-center gap-1.5">
                  <Clock size={11} className="text-cyan-400" />
                  {calculateReadingTime(selectedPost.content)}
                </span>
                <button
                  id="blog-reader-close-action-btn"
                  onClick={() => setSelectedPost(null)}
                  className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-sans text-xs font-bold rounded-lg"
                >
                  Done Reading
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 4: Interactive Project Quick Review */}
      <AnimatePresence>
        {reviewProject && (
          <ProjectReviewModal
            project={reviewProject}
            onClose={() => setReviewProject(null)}
            syncInfo={projectSyncData[reviewProject.id] || generateMockSyncData(reviewProject.id, reviewProject.name)}
            triggerSync={triggerSync}
            onUpdateProject={handleUpdateProjectLinks}
            darkMode={darkMode}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
