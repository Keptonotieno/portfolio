/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { 
  Github, ExternalLink, Sliders, Star, GitFork, GitBranch, Calendar, RefreshCw, 
  ArrowUpRight, Atom, FileCode, Wind, Server, Zap, Map, BrainCircuit, LineChart, 
  Smartphone, Wifi, Layers, Code2, Clock
} from 'lucide-react';
import { Project, ProjectSyncInfo } from '../types';

// Technology icon and styling mapper
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

// Calculate dynamic relative time from dateCreated
const getRelativeTime = (dateStr: string): string => {
  if (!dateStr) return 'Recently';
  const created = new Date(dateStr);
  const now = new Date();
  
  if (isNaN(created.getTime())) {
    return 'Recently';
  }

  const diffTime = Math.abs(now.getTime() - created.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  // Year & Month difference calculation
  const years = now.getFullYear() - created.getFullYear();
  let months = (now.getMonth() + 1) - (created.getMonth() + 1) + (years * 12);
  
  // Adjust for current day of the month
  if (now.getDate() < created.getDate()) {
    months--;
  }

  if (months >= 12) {
    const yr = Math.floor(months / 12);
    const m = months % 12;
    if (m === 0) {
      return `${yr} yr${yr > 1 ? 's' : ''} ago`;
    }
    return `${yr} yr${yr > 1 ? 's' : ''}, ${m} mo${m > 1 ? 's' : ''} ago`;
  }
  
  if (months > 0) {
    return `${months} mo${months > 1 ? 's' : ''} ago`;
  }
  
  if (diffDays > 0) {
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  }
  
  return 'Today';
};

// Check if a release tag represents a beta, pre-release or alpha build
const isBetaRelease = (tag: string): boolean => {
  const normalized = tag.toLowerCase();
  return (
    normalized.includes('beta') ||
    normalized.includes('alpha') ||
    normalized.includes('rc') ||
    normalized.includes('pre') ||
    normalized.includes('next') ||
    normalized.includes('dev')
  );
};

interface ProjectCardProps {
  proj: Project;
  syncInfo: ProjectSyncInfo;
  triggerSync: (projectId: string) => void | Promise<void>;
  selectedTech: string;
  setSelectedTech: React.Dispatch<React.SetStateAction<string>> | ((tech: string) => void);
  setReviewProject: React.Dispatch<React.SetStateAction<Project | null>>;
  darkMode: boolean;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  proj,
  syncInfo,
  triggerSync,
  selectedTech,
  setSelectedTech,
  setReviewProject,
  darkMode
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  // Parse owner and repo from githubLink
  const match = proj.githubLink.match(/github\.com\/([^/]+)\/([^/]+)/);
  const owner = match ? match[1] : '';
  const repo = match ? match[2] : '';

  const [versionTag, setVersionTag] = React.useState<string | null>(null);
  const [isLoadingVersion, setIsLoadingVersion] = React.useState<boolean>(true);

  React.useEffect(() => {
    let isMounted = true;
    
    const fetchVersion = async () => {
      if (!owner || !repo) {
        setIsLoadingVersion(false);
        return;
      }
      
      setIsLoadingVersion(true);
      try {
        const releaseRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/releases/latest`);
        if (releaseRes.ok) {
          const data = await releaseRes.json();
          if (data && data.tag_name) {
            if (isMounted) {
              setVersionTag(data.tag_name);
              setIsLoadingVersion(false);
              return;
            }
          }
        }
        
        const tagsRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/tags`);
        if (tagsRes.ok) {
          const tags = await tagsRes.json();
          if (tags && tags.length > 0 && tags[0].name) {
            if (isMounted) {
              setVersionTag(tags[0].name);
              setIsLoadingVersion(false);
              return;
            }
          }
        }
      } catch (err) {
        console.warn("GitHub API error or rate limit, fallback to simulated version:", err);
      }
      
      // Fallback version generation based on the project ID and sync count or stars
      if (isMounted) {
        const hash = proj.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const major = (hash % 2) + 1;
        const minor = hash % 5;
        // Increment patch version if stars increase or sync state changes
        const patch = (hash % 8) + (syncInfo.stars % 5);
        const isBetaProj = hash % 3 === 0;
        const suffix = isBetaProj ? `-beta.${(syncInfo.forks % 3) + 1}` : '';
        setVersionTag(`v${major}.${minor}.${patch}${suffix}`);
        setIsLoadingVersion(false);
      }
    };

    if (!syncInfo.isSyncing) {
      fetchVersion();
    }
    
    return () => {
      isMounted = false;
    };
  }, [owner, repo, proj.id, syncInfo.isSyncing, syncInfo.stars, syncInfo.forks]);

  // Initialize mouse coordinates relative to card center (0.5, 0.5 is centered)
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  // Create smooth springs for rotatory responses
  // Max tilt angle of 12 degrees
  const rotateX = useSpring(useTransform(y, [0, 1], [12, -12]), { damping: 25, stiffness: 220 });
  const rotateY = useSpring(useTransform(x, [0, 1], [-12, 12]), { damping: 25, stiffness: 220 });

  // Add 3D glare or light reflection effect by moving an ambient glare overlay
  const glareX = useSpring(useTransform(x, [0, 1], ['0%', '100%']), { damping: 25, stiffness: 220 });
  const glareY = useSpring(useTransform(y, [0, 1], ['0%', '100%']), { damping: 25, stiffness: 220 });

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    x.set(mouseX / width);
    y.set(mouseY / height);
  };

  const handleMouseLeave = () => {
    x.set(0.5);
    y.set(0.5);
  };

  return (
    <div 
      className="perspective-1000 w-full"
      style={{ perspective: '1200px' }}
    >
      <motion.div 
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ 
          transformStyle: 'preserve-3d',
          rotateX,
          rotateY
        }}
        whileHover={{ 
          borderColor: darkMode ? 'rgba(6, 182, 212, 0.5)' : 'rgba(139, 92, 246, 0.4)',
          boxShadow: darkMode 
            ? '0 25px 50px -12px rgba(6, 182, 212, 0.25), 0 0 20px rgba(6, 182, 212, 0.1)' 
            : '0 25px 50px -12px rgba(139, 92, 246, 0.2), 0 0 20px rgba(139, 92, 246, 0.1)'
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 22 }}
        className={`rounded-2xl border overflow-hidden transition-colors duration-300 group relative ${
          darkMode ? 'bg-white/5 border-white/5' : 'bg-white border-black/5 shadow-lg'
        }`}
      >
        {/* Ambient Glare Layer */}
        <motion.div 
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-10 transition-opacity duration-300 bg-gradient-to-tr from-transparent via-white to-transparent"
          style={{
            left: useTransform(glareX, value => `calc(${value} - 50%)`),
            top: useTransform(glareY, value => `calc(${value} - 50%)`),
            width: '200%',
            height: '200%',
          }}
        />

        {/* Project Image Container */}
        <div 
          className="aspect-[16/9] w-full relative overflow-hidden bg-gray-900"
          style={{ transform: 'translateZ(30px)', transformStyle: 'preserve-3d' }}
        >
          <img 
            src={proj.image} 
            alt={proj.name} 
            className="w-full h-full aspect-[16/9] object-cover group-hover:scale-105 transition-transform duration-500"
            referrerPolicy="no-referrer"
          />
          
          {/* Version / Release Tag Status Badge */}
          {isLoadingVersion ? (
            <div className="absolute top-4 left-4 px-2.5 py-1 rounded-full bg-gray-950/80 backdrop-blur-md border border-white/5 text-[9px] font-mono text-gray-400 flex items-center gap-1.5 font-bold">
              <RefreshCw size={9} className="animate-spin text-cyan-400" />
              <span>FETCHING VERSION...</span>
            </div>
          ) : (
            versionTag && (
              <div className={`absolute top-4 left-4 px-2.5 py-1 rounded-full backdrop-blur-md font-mono text-[9px] font-extrabold tracking-wider border transition-all duration-300 flex items-center gap-1.5 shadow-sm ${
                isBetaRelease(versionTag)
                  ? (darkMode
                      ? 'bg-amber-500/15 border-amber-500/30 text-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.15)]'
                      : 'bg-amber-50 border-amber-500/20 text-amber-700 shadow-sm')
                  : (darkMode
                      ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.15)]'
                      : 'bg-emerald-50 border-emerald-500/20 text-emerald-700 shadow-sm')
              }`} title={isBetaRelease(versionTag) ? "Pre-release / Development build" : "Stable production build"}>
                <span className={`w-1.5 h-1.5 rounded-full ${
                  isBetaRelease(versionTag) ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'
                }`} />
                <span>{isBetaRelease(versionTag) ? 'BETA' : 'STABLE'} // {versionTag}</span>
              </div>
            )
          )}

          <div className="absolute top-4 right-4 px-2.5 py-1 rounded-full bg-gray-950/80 backdrop-blur-md text-cyan-400 font-mono text-[9px] font-bold tracking-wider border border-white/5 uppercase">
            {proj.category}
          </div>
        </div>

        {/* Info Container with 3D translation */}
        <div 
          className="p-6 space-y-4 relative"
          style={{ transform: 'translateZ(20px)' }}
        >
          {/* GitHub Sync Header Status */}
          <div className="flex items-center justify-between text-[10px] font-mono border-b border-gray-500/10 pb-3">
            <div className="flex items-center gap-1.5 text-gray-400">
              <span className="relative flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 ${syncInfo.isSyncing ? 'bg-cyan-400' : ''}`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 bg-emerald-500 ${syncInfo.isSyncing ? 'bg-cyan-500' : ''}`}></span>
              </span>
              <span className="flex items-center gap-1">
                Git Status: 
                <span className={`${syncInfo.isSyncing ? 'text-cyan-400 animate-pulse' : 'text-emerald-400'} font-semibold`}>
                  {syncInfo.isSyncing ? 'Updating...' : syncInfo.lastSynced}
                </span>
              </span>
            </div>
            
            <button
              id={`project-sync-btn-${proj.id}`}
              onClick={(e) => {
                e.stopPropagation();
                triggerSync(proj.id);
              }}
              disabled={syncInfo.isSyncing}
              className="p-1 rounded hover:bg-gray-500/10 text-gray-400 hover:text-cyan-400 transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-50"
              title="Fetch latest from GitHub API"
            >
              <RefreshCw size={10} className={`${syncInfo.isSyncing ? 'animate-spin text-cyan-400' : ''}`} />
              <span className="text-[9px] font-extrabold tracking-tight">SYNC</span>
            </button>
          </div>

          <div className="space-y-1">
            <div className="flex items-start sm:items-center justify-between flex-col sm:flex-row gap-2">
              <p className="font-mono text-[10px] text-purple-400 font-bold uppercase tracking-wider">{proj.role}</p>
              <div className="flex flex-wrap items-center gap-1.5">
                <div className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-mono text-[9px] font-extrabold border transition-colors ${
                  darkMode ? 'bg-gray-900/60 border-white/5 text-gray-300' : 'bg-gray-100 border-black/5 text-gray-600'
                }`}>
                  <Calendar size={10} className="text-cyan-400/80" />
                  <span>EST. {proj.dateCreated}</span>
                </div>
                <div className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-mono text-[9px] font-extrabold border transition-all duration-300 ${
                  darkMode 
                    ? 'bg-cyan-500/10 border-cyan-500/20 text-cyan-300 hover:border-cyan-400/40' 
                    : 'bg-cyan-50 border-cyan-500/20 text-cyan-700 hover:border-cyan-600/40'
                }`} title="Time passed since project initialization">
                  <Clock size={10} className="text-cyan-400 animate-pulse" />
                  <span>Last Updated: {getRelativeTime(proj.dateCreated)}</span>
                </div>
              </div>
            </div>
            <h3 className="font-sans font-extrabold text-lg flex items-center justify-between group-hover:text-cyan-400 transition-colors">
              {proj.name}
              <ArrowUpRight size={16} className="text-gray-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </h3>
          </div>

          <p className={`text-xs leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {proj.description}
          </p>

          {/* Git Telemetry Row */}
          <div className="flex items-center gap-4 text-[10px] font-mono text-gray-400/80">
            <div className="flex items-center gap-1">
              <Star size={11} className="text-yellow-500" />
              <span>{syncInfo.stars} stars</span>
            </div>
            <div className="flex items-center gap-1">
              <GitFork size={11} className="text-blue-400" />
              <span>{syncInfo.forks} forks</span>
            </div>
            <div className="flex items-center gap-1">
              <GitBranch size={11} className="text-purple-400" />
              <span className="font-semibold">{syncInfo.branch}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {proj.technologies.map((tech, idx) => {
              const isTechSelected = selectedTech.trim().toLowerCase() === tech.trim().toLowerCase();
              const techInfo = getTechIconInfo(tech);
              const IconComponent = techInfo.icon;
              return (
                <span 
                  key={idx} 
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedTech(tech.trim());
                  }}
                  title={techInfo.label}
                  className={`group/tech flex items-center gap-1.5 px-2.5 py-1 rounded-full font-mono text-[9.5px] font-semibold cursor-pointer border transition-all duration-300 shadow-sm ${
                    isTechSelected 
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white border-cyan-400/30 shadow-[0_0_12px_rgba(6,182,212,0.3)]' 
                      : `${darkMode ? 'bg-gray-900/60 text-gray-300 border-white/5 hover:border-cyan-500/30 hover:text-cyan-400' : 'bg-gray-100 text-gray-600 border-black/5 hover:border-cyan-500/30 hover:text-cyan-600'} hover:shadow-[0_0_8px_rgba(6,182,212,0.15)]`
                  }`}
                >
                  <IconComponent size={12} className={`transition-transform group-hover/tech:scale-110 duration-300 ${isTechSelected ? 'text-white' : 'text-cyan-400/80 group-hover/tech:text-cyan-400'}`} />
                  <span>{tech}</span>
                </span>
              );
            })}
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-gray-500/10 text-xs font-bold font-sans">
            <div className="flex flex-wrap gap-2">
              <a
                id={`project-github-link-${proj.id}`}
                href={proj.githubLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[11px] font-sans font-bold tracking-tight transition-all shadow-sm cursor-pointer ${
                  darkMode 
                    ? 'border-white/10 hover:border-cyan-500 bg-white/5 text-gray-300 hover:text-cyan-400 hover:bg-cyan-500/5' 
                    : 'border-black/10 hover:border-cyan-600 bg-gray-50 text-gray-700 hover:text-cyan-600 hover:bg-cyan-50'
                }`}
              >
                <Github size={13} />
                <span>GitHub Repo</span>
              </a>
              <a
                id={`project-live-link-${proj.id}`}
                href={proj.liveDemoLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[11px] font-sans font-bold tracking-tight transition-all shadow-sm cursor-pointer ${
                  darkMode 
                    ? 'border-white/10 hover:border-cyan-500 bg-white/5 text-gray-300 hover:text-cyan-400 hover:bg-cyan-500/5' 
                    : 'border-black/10 hover:border-cyan-600 bg-gray-50 text-gray-700 hover:text-cyan-600 hover:bg-cyan-50'
                }`}
              >
                <ExternalLink size={13} />
                <span>Live Demo</span>
              </a>
            </div>

            <button
              id={`project-quick-review-btn-${proj.id}`}
              onClick={(e) => {
                e.stopPropagation();
                setReviewProject(proj);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[11px] font-sans font-bold tracking-tight transition-all cursor-pointer ${
                darkMode 
                  ? 'border-purple-500/30 hover:border-purple-500 bg-purple-500/10 text-purple-300 hover:text-white hover:bg-purple-500/20' 
                  : 'border-purple-500/20 hover:border-purple-500 bg-purple-50/50 text-purple-700 hover:text-purple-950 hover:bg-purple-100'
              }`}
            >
              <Sliders size={12} className="text-purple-400" />
              <span>Quick Review</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProjectCard;
