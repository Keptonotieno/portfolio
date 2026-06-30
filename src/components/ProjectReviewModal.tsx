import React, { useState, useEffect, useRef } from 'react';
import { 
  X, ShieldCheck, Check, Gauge, Sliders, Sparkles, Github, Star, 
  GitFork, Bug, RefreshCw, ExternalLink, Play, ShoppingCart, 
  Trash2, Trophy, ArrowRight, Save, Globe, Award, Laptop, Key, Terminal, 
  Gamepad2, ArrowUp, ArrowDown, ArrowLeft, ArrowRight as ArrowRightIcon,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import RadarChart from './RadarChart';
import { Project, ProjectSyncInfo } from '../types';

interface ProjectReviewModalProps {
  project: Project | null;
  onClose: () => void;
  syncInfo: ProjectSyncInfo;
  triggerSync: (projectId: string) => Promise<void>;
  onUpdateProject: (projectId: string, liveDemoLink: string, githubLink: string) => void;
  darkMode: boolean;
}

export default function ProjectReviewModal({
  project,
  onClose,
  syncInfo,
  triggerSync,
  onUpdateProject,
  darkMode
}: ProjectReviewModalProps) {
  if (!project) return null;

  const [activeTab, setActiveTab] = useState<'audit' | 'live'>('audit');
  
  // Link editing state
  const [liveLink, setLiveLink] = useState(project.liveDemoLink);
  const [gitLink, setGitLink] = useState(project.githubLink);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Sync inputs if project changes
  useEffect(() => {
    setLiveLink(project.liveDemoLink);
    setGitLink(project.githubLink);
  }, [project]);

  const handleSaveLinks = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProject(project.id, liveLink, gitLink);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div id="project-review-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div
        id="project-review-card"
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.95 }}
        className={`w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-3xl border p-4 sm:p-6 md:p-8 space-y-6 ${
          darkMode ? 'bg-gray-950 border-white/10 text-white shadow-[0_0_50px_rgba(139,92,246,0.15)]' : 'bg-white border-black/10 text-gray-900 shadow-2xl'
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-start border-b border-gray-500/10 pb-4">
          <div className="space-y-1">
            <span className="px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-400 font-mono text-[9px] font-bold uppercase tracking-wider">
              {project.category} // INTERACTIVE EXPERIMENT
            </span>
            <h3 className="font-sans font-extrabold text-xl sm:text-2xl mt-2 flex items-center gap-2">
              {project.name}
            </h3>
            <p className="font-mono text-[10px] text-gray-400">By {project.role}</p>
          </div>
          <button
            id="close-project-review-btn"
            onClick={onClose}
            className={`p-1.5 rounded-lg hover:bg-gray-500/10 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab Selection Switcher */}
        <div className="flex border-b border-gray-500/10">
          <button
            onClick={() => setActiveTab('audit')}
            className={`flex-1 py-3 text-[10px] sm:text-xs font-bold font-mono tracking-wider transition-all border-b-2 ${
              activeTab === 'audit' 
                ? 'border-purple-500 text-purple-400 bg-purple-500/5' 
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            REPOSITORY AUDIT & TELEMETRY
          </button>
          <button
            onClick={() => setActiveTab('live')}
            className={`flex-1 py-3 text-[10px] sm:text-xs font-bold font-mono tracking-wider transition-all border-b-2 flex items-center justify-center gap-2 ${
              activeTab === 'live' 
                ? 'border-cyan-500 text-cyan-400 bg-cyan-500/5' 
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <Play size={12} className="text-cyan-400 animate-pulse" />
            LIVE INTERACTIVE SIMULATOR
          </button>
        </div>

        {/* Dynamic Content Panels */}
        <div className="space-y-6">
          {activeTab === 'audit' ? (
            <div className="space-y-6">
              {/* Visual Radar Audit Section */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                {/* Radar Chart Visual Representation */}
                <div className="md:col-span-6 flex justify-center">
                  <RadarChart metrics={syncInfo.codeQuality} darkMode={darkMode} />
                </div>
                
                {/* Quick Audit Metrics Details List */}
                <div className="md:col-span-6 space-y-4">
                  <h4 className="text-[11px] font-bold font-mono text-purple-400 uppercase tracking-widest">Repository Vital Signs</h4>
                  <div className="space-y-2.5">
                    <div className={`p-3 rounded-2xl border ${darkMode ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-black/5'} flex items-center justify-between`}>
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-cyan-400/10 text-cyan-400">
                          <ShieldCheck size={14} />
                        </div>
                        <div>
                          <p className="text-[9px] font-mono text-gray-400 tracking-wider font-extrabold">Security</p>
                          <p className="text-[11px] font-bold">Vulnerability Audit</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold font-mono text-cyan-400">{syncInfo.codeQuality.securityScore}%</span>
                    </div>

                    <div className={`p-3 rounded-2xl border ${darkMode ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-black/5'} flex items-center justify-between`}>
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400">
                          <Check size={14} />
                        </div>
                        <div>
                          <p className="text-[9px] font-mono text-gray-400 tracking-wider font-extrabold">Test Coverage</p>
                          <p className="text-[11px] font-bold">Automated Suite</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold font-mono text-purple-400">{syncInfo.codeQuality.testCoverage}%</span>
                    </div>

                    <div className={`p-3 rounded-2xl border ${darkMode ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-black/5'} flex items-center justify-between`}>
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-emerald-400/10 text-emerald-400">
                          <Gauge size={14} />
                        </div>
                        <div>
                          <p className="text-[9px] font-mono text-gray-400 tracking-wider font-extrabold">Performance</p>
                          <p className="text-[11px] font-bold">Optimization Grade</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold font-mono text-emerald-400">{syncInfo.codeQuality.performanceGrade}</span>
                    </div>

                    <div className={`p-3 rounded-2xl border ${darkMode ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-black/5'} flex items-center justify-between`}>
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-fuchsia-400/10 text-fuchsia-400">
                          <Sliders size={14} />
                        </div>
                        <div>
                          <p className="text-[9px] font-mono text-gray-400 tracking-wider font-extrabold">Maintainability</p>
                          <p className="text-[11px] font-bold">Code Smell Grade</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold font-mono text-fuchsia-400">{syncInfo.codeQuality.maintainability}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Evaluation Report Card */}
              <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-black/5'} space-y-3`}>
                <div className="flex items-center gap-2 text-xs font-bold font-sans text-purple-400">
                  <Sparkles size={14} className="animate-pulse" />
                  <span>INTELLIGENT REPOSITORY AUDIT SUMMARY</span>
                </div>
                <p className={`text-xs leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {syncInfo.reviewReport.summary}
                </p>
              </div>

              {/* Strengths & Recommendations */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="text-[11px] font-bold font-mono text-emerald-400 uppercase tracking-wider">Key Architecture Strengths</h4>
                  <ul className="space-y-1.5">
                    {syncInfo.reviewReport.strengths.map((str, idx) => (
                      <li key={idx} className="flex gap-2 items-start text-[11px] text-gray-400 leading-tight">
                        <span className="text-emerald-400 font-bold">✓</span>
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2">
                  <h4 className="text-[11px] font-bold font-mono text-amber-400 uppercase tracking-wider">Strategic Recommendations</h4>
                  <ul className="space-y-1.5">
                    {syncInfo.reviewReport.improvements.map((imp, idx) => (
                      <li key={idx} className="flex gap-2 items-start text-[11px] text-gray-400 leading-tight">
                        <span className="text-amber-400 font-bold">!</span>
                        <span>{imp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Git Telemetry Panel with Live Sync Trigger */}
              <div className={`p-5 rounded-2xl border ${
                darkMode ? 'bg-black/40 border-cyan-500/20' : 'bg-gray-50 border-cyan-500/10'
              } space-y-4`}>
                <div className="flex items-center justify-between border-b border-gray-500/10 pb-2">
                  <div className="flex items-center gap-2 text-xs font-bold font-mono text-cyan-400">
                    <Github size={14} />
                    <span>GITHUB REPOSITORY TELEMETRY</span>
                  </div>
                  <span className="font-mono text-[9px] px-2 py-0.5 rounded bg-cyan-400/10 text-cyan-400 font-semibold uppercase">
                    Branch: {syncInfo.branch}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center font-mono">
                  <div className="p-2 bg-gray-500/5 rounded-xl">
                    <p className="text-gray-400 text-[10px]">Stars</p>
                    <p className="text-sm font-bold text-yellow-500 mt-0.5 flex items-center justify-center gap-1">
                      <Star size={12} /> {syncInfo.stars}
                    </p>
                  </div>
                  <div className="p-2 bg-gray-500/5 rounded-xl">
                    <p className="text-gray-400 text-[10px]">Forks</p>
                    <p className="text-sm font-bold text-blue-400 mt-0.5 flex items-center justify-center gap-1">
                      <GitFork size={12} /> {syncInfo.forks}
                    </p>
                  </div>
                  <div className="p-2 bg-gray-500/5 rounded-xl">
                    <p className="text-gray-400 text-[10px]">Open Issues</p>
                    <p className="text-sm font-bold text-red-400 mt-0.5 flex items-center justify-center gap-1">
                      <Bug size={12} /> {syncInfo.openIssues}
                    </p>
                  </div>
                </div>

                <div className="bg-gray-500/5 p-3.5 rounded-xl space-y-1.5">
                  <div className="flex justify-between text-[10px] font-mono text-gray-400">
                    <span>LATEST COMMIT</span>
                    <span className="bg-purple-500/20 px-1.5 py-0.5 rounded text-[9px] text-purple-300 font-semibold">{syncInfo.latestCommitHash}</span>
                  </div>
                  <p className="font-mono text-xs text-gray-300 italic">
                    "{syncInfo.latestCommitMessage}"
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  <div className="flex items-center gap-2 text-[10px] font-mono text-gray-400">
                    <span className="relative flex h-2 w-2">
                      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 ${syncInfo.isSyncing ? 'bg-cyan-400' : ''}`}></span>
                      <span className={`relative inline-flex rounded-full h-2 w-2 bg-emerald-500 ${syncInfo.isSyncing ? 'bg-cyan-500' : ''}`}></span>
                    </span>
                    <span>Synced Status: <strong className="text-emerald-400 font-semibold">{syncInfo.lastSynced}</strong></span>
                  </div>

                  <button
                    id="modal-sync-now-action-btn"
                    onClick={() => triggerSync(project.id)}
                    disabled={syncInfo.isSyncing}
                    className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-gray-950 font-bold font-sans rounded-xl text-xs shadow-md shadow-cyan-500/10 flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                  >
                    <RefreshCw size={12} className={syncInfo.isSyncing ? 'animate-spin' : ''} />
                    <span>{syncInfo.isSyncing ? 'Connecting...' : 'Fetch Live Status'}</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            // LIVE INTERACTIVE SIMULATOR TAB
            <div className="space-y-6">
              {/* Dynamic Deployed Link Editor Form */}
              <form onSubmit={handleSaveLinks} className={`p-4 rounded-2xl border ${darkMode ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-black/5'} space-y-4`}>
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold font-mono text-cyan-400 flex items-center gap-2">
                    <Globe size={13} />
                    <span>DEPLOYED ENVIRONMENT CONFIGURATION</span>
                  </h4>
                  <span className="text-[10px] text-gray-400 font-mono">Real-time Persistence</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-gray-400 font-bold block">DEPLOYED WEBSITE URL (LIVE DEMO)</label>
                    <input
                      type="text"
                      value={liveLink}
                      onChange={(e) => setLiveLink(e.target.value)}
                      placeholder="e.g. https://kepton-app.vercel.app"
                      className={`w-full px-3 py-2 text-xs font-mono rounded-xl border ${
                        darkMode 
                          ? 'bg-black/40 border-white/10 text-white focus:border-cyan-500' 
                          : 'bg-white border-black/10 text-gray-900 focus:border-cyan-500'
                      } outline-none transition-all`}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-gray-400 font-bold block">GITHUB REPOSITORY URL</label>
                    <input
                      type="text"
                      value={gitLink}
                      onChange={(e) => setGitLink(e.target.value)}
                      placeholder="e.g. https://github.com/Keptonotieno/repo"
                      className={`w-full px-3 py-2 text-xs font-mono rounded-xl border ${
                        darkMode 
                          ? 'bg-black/40 border-white/10 text-white focus:border-cyan-500' 
                          : 'bg-white border-black/10 text-gray-900 focus:border-cyan-500'
                      } outline-none transition-all`}
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center pt-1">
                  <div>
                    <AnimatePresence>
                      {saveSuccess && (
                        <motion.span
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0 }}
                          className="text-xs text-emerald-400 font-mono font-bold flex items-center gap-1"
                        >
                          <Check size={12} /> Saved & Updated Simulator!
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-gray-950 font-sans text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-md shadow-cyan-500/10 cursor-pointer"
                  >
                    <Save size={12} />
                    <span>Apply Settings</span>
                  </button>
                </div>
              </form>

              {/* Realistic Web Browser Wrapper */}
              <div className={`rounded-2xl border ${darkMode ? 'bg-black border-white/10' : 'bg-gray-100 border-black/10'} overflow-hidden shadow-2xl`}>
                {/* Browser top navigation bar */}
                <div className={`px-4 py-2.5 flex items-center justify-between gap-4 border-b ${darkMode ? 'bg-gray-900/60 border-white/5' : 'bg-gray-200/80 border-black/5'}`}>
                  {/* Browser window circles */}
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                  </div>

                  {/* Address Input Area */}
                  <div className={`flex-1 flex items-center gap-2 px-3 py-1 rounded-lg text-[11px] font-mono ${
                    darkMode ? 'bg-black/50 text-gray-300' : 'bg-white text-gray-700'
                  }`}>
                    <span className="text-emerald-500 text-[10px] font-bold">✓ SSL Secure</span>
                    <span className="text-gray-500 select-none">|</span>
                    <span className="truncate">{liveLink || 'sandbox://localhost:3000/interactive-test'}</span>
                  </div>

                  <div className="flex items-center gap-3 text-xs font-mono text-gray-400">
                    <span className="text-[10px] bg-cyan-500/15 text-cyan-400 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                      {liveLink.startsWith('http') ? 'Real IFrame Enabled' : 'Custom Simulator'}
                    </span>
                  </div>
                </div>

                {/* Main Render Area */}
                <div className="relative min-h-[360px] max-h-[420px] overflow-y-auto">
                  {liveLink.startsWith('http') ? (
                    <div className="w-full h-[360px] relative">
                      <iframe
                        src={liveLink}
                        title={`Live IFrame for ${project.name}`}
                        className="w-full h-full border-0 bg-white"
                        referrerPolicy="no-referrer"
                        sandbox="allow-scripts allow-same-origin allow-popups"
                      />
                      <div className="absolute bottom-2 right-2 bg-black/80 px-2.5 py-1 rounded font-mono text-[9px] text-gray-400 pointer-events-none border border-white/5">
                        Security Notice: If loading fails, site blocks standard iframe embeds (X-Frame-Options). Use 'Live Demo' footer button.
                      </div>
                    </div>
                  ) : (
                    // NATIVE CUSTOM HIGH-FIDELITY SIMULATION INTERFACES
                    <div className={`p-6 h-full w-full ${darkMode ? 'bg-gray-950 text-white' : 'bg-white text-gray-900'}`}>
                      {project.id === 'proj-1' ? (
                        <Proj1Simulator darkMode={darkMode} />
                      ) : project.id === 'proj-2' ? (
                        <Proj2Simulator darkMode={darkMode} />
                      ) : project.id === 'proj-3' ? (
                        <Proj3Simulator darkMode={darkMode} />
                      ) : project.id === 'proj-4' ? (
                        <Proj4Simulator darkMode={darkMode} />
                      ) : (
                        // Generic Fallback Dashboard Sandbox
                        <GenericWorkspaceSandbox project={project} darkMode={darkMode} />
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer with Direct Navigation buttons */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-gray-500/10">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <a
              id="review-github-btn"
              href={gitLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white font-sans text-xs font-extrabold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Github size={14} />
              <span>GitHub Repo</span>
            </a>
            <a
              id="review-live-demo-btn"
              href={liveLink.startsWith('#') ? undefined : liveLink}
              onClick={(e) => {
                if (liveLink.startsWith('#')) {
                  e.preventDefault();
                  const targetElem = document.querySelector(liveLink);
                  if (targetElem) {
                    onClose();
                    targetElem.scrollIntoView({ behavior: 'smooth' });
                  }
                }
              }}
              target={liveLink.startsWith('#') ? undefined : "_blank"}
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-sans text-xs font-extrabold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/10 transition-all cursor-pointer"
            >
              <ExternalLink size={14} />
              <span>Live Demo</span>
            </a>
          </div>
          <button
            id="review-close-done-btn"
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 bg-gray-500/10 hover:bg-gray-500/20 border border-gray-500/10 font-sans text-xs font-bold rounded-xl text-gray-300 hover:text-white transition-all cursor-pointer text-center"
          >
            Close Review
          </button>
        </div>
      </motion.div>
    </div>
  );
}

/* =========================================================================
   CUSTOM NATIVE PROJECT SIMULATORS (HIGH FIDELITY, HIGHLY INTERACTIVE)
   ========================================================================= */

// 1. PROJECT 1 SIMULATOR: Kepton Developer Intelligence Test (Quiz)
function Proj1Simulator({ darkMode }: { darkMode: boolean }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const [username, setUsername] = useState('');
  const [leaderboard, setLeaderboard] = useState<{name: string, score: number, tag: string}[]>([
    { name: "Sarah_Jenkins", score: 3, tag: "AI Expert" },
    { name: "David_Mwangi", score: 3, tag: "C++ Wizard" },
    { name: "Alice_System", score: 2, tag: "Cloud Admin" }
  ]);

  const questions = [
    {
      q: "Which C++ standard officially introduced smart pointers like std::unique_ptr?",
      opts: ["C++98", "C++11", "C++17", "C++20"],
      ans: 1,
      explain: "C++11 introduced std::unique_ptr, std::shared_ptr, and std::weak_ptr to facilitate automated resource management."
    },
    {
      q: "What is a primary architectural benefit of React Server Components (RSC)?",
      opts: ["Synchronous client state hydration", "Replacing Node.js database pools", "Zero bundle size impact on the browser", "Direct local storage synchronization"],
      ans: 2,
      explain: "React Server Components run exclusively on the server, meaning their package dependencies have zero bundle size footprint on the client-side."
    },
    {
      q: "In TypeScript, which utility constructs a type with all properties of Type set to optional?",
      opts: ["Required<T>", "Omit<T>", "Partial<T>", "Readonly<T>"],
      ans: 2,
      explain: "Partial<T> wraps every key of the interface with an optional '?' signifier."
    }
  ];

  const handleStart = () => {
    setIsPlaying(true);
    setCurrentQ(0);
    setSelectedOpt(null);
    setScore(0);
    setIsDone(false);
  };

  const handleSelect = (idx: number) => {
    if (selectedOpt !== null) return;
    setSelectedOpt(idx);
    if (idx === questions[currentQ].ans) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ(prev => prev + 1);
      setSelectedOpt(null);
    } else {
      setIsDone(true);
    }
  };

  const handleAddLeaderboard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;
    const tag = score === 3 ? "Intelligence Master" : score === 2 ? "Senior Dev" : "Frontend Cadet";
    setLeaderboard(prev => [{ name: username.trim(), score, tag }, ...prev]);
    setUsername('');
  };

  if (!isPlaying) {
    return (
      <div className="flex flex-col items-center justify-center text-center space-y-4 h-full py-8">
        <div className="p-4 rounded-full bg-cyan-500/10 text-cyan-400">
          <Award size={40} className="animate-bounce" />
        </div>
        <h4 className="font-sans font-extrabold text-lg">Kepton Assessment Arena SIM</h4>
        <p className="text-xs text-gray-400 max-w-sm">
          Take the mini rapid-fire developer quiz on TypeScript, React, and C++ to test your software knowledge and submit your rating to the leaderboards.
        </p>
        <button
          onClick={handleStart}
          className="px-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-gray-950 font-bold font-sans text-xs rounded-xl shadow-lg shadow-cyan-500/10 transition-all cursor-pointer"
        >
          Start Quiz Challenge
        </button>
      </div>
    );
  }

  if (isDone) {
    return (
      <div className="space-y-5 py-4">
        <div className="text-center space-y-2">
          <Trophy size={36} className="text-yellow-500 mx-auto animate-pulse" />
          <h4 className="font-sans font-extrabold text-lg">Challenge Completed!</h4>
          <p className="text-xs font-mono text-cyan-400">Your Score: <strong className="text-base text-white">{score} / {questions.length}</strong></p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left Column - Submit score */}
          <div className={`p-4 rounded-xl border ${darkMode ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-black/5'} space-y-3`}>
            <p className="text-[10px] font-mono text-gray-400 uppercase tracking-wider font-bold">Add to Live Rankings</p>
            <form onSubmit={handleAddLeaderboard} className="space-y-2">
              <input
                type="text"
                placeholder="Enter Your GitHub Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={`w-full px-3 py-1.5 text-xs font-mono rounded-lg outline-none border ${
                  darkMode ? 'bg-black border-white/10 text-white' : 'bg-white border-black/10 text-gray-900'
                }`}
              />
              <button
                type="submit"
                disabled={!username}
                className="w-full py-1.5 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-sans text-xs font-bold rounded-lg disabled:opacity-50 transition-all cursor-pointer"
              >
                Publish Ranking
              </button>
            </form>
            <button
              onClick={handleStart}
              className="w-full py-1.5 bg-gray-500/10 hover:bg-gray-500/20 text-xs text-gray-300 font-sans font-semibold rounded-lg transition-all border border-gray-500/5 cursor-pointer"
            >
              Retry Challenge
            </button>
          </div>

          {/* Right Column - Leaderboard */}
          <div className={`p-4 rounded-xl border ${darkMode ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-black/5'} space-y-2.5`}>
            <p className="text-[10px] font-mono text-purple-400 uppercase tracking-wider font-bold">Arena Leaderboard</p>
            <div className="space-y-1.5 max-h-[140px] overflow-y-auto pr-1">
              {leaderboard.map((user, idx) => (
                <div key={idx} className="flex justify-between items-center text-[10px] font-mono p-1.5 rounded bg-gray-500/5 border border-gray-500/5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-gray-500">#{idx+1}</span>
                    <span className="font-bold text-gray-200">{user.name}</span>
                    <span className="text-[8px] px-1 py-0.2 rounded bg-purple-500/15 text-purple-400 uppercase font-bold">{user.tag}</span>
                  </div>
                  <span className="text-cyan-400 font-bold">{user.score} / 3</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const activeQ = questions[currentQ];

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center text-[10px] font-mono text-gray-400">
        <span>QUESTION {currentQ + 1} OF {questions.length}</span>
        <span className="text-cyan-400 font-bold">Score: {score}</span>
      </div>

      <div className="space-y-2">
        <h5 className="font-sans font-extrabold text-sm text-gray-100 leading-snug">{activeQ.q}</h5>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
          {activeQ.opts.map((opt, idx) => {
            const isSelected = selectedOpt === idx;
            const isCorrect = idx === activeQ.ans;
            const isWrong = isSelected && !isCorrect;

            let borderClass = 'border-gray-500/10 hover:border-cyan-400/40 bg-gray-500/5';
            let iconColor = 'text-gray-500';
            if (selectedOpt !== null) {
              if (isCorrect) {
                borderClass = 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300';
                iconColor = 'text-emerald-400';
              } else if (isWrong) {
                borderClass = 'border-red-500/50 bg-red-500/10 text-red-300';
                iconColor = 'text-red-400';
              } else {
                borderClass = 'border-gray-500/10 opacity-40';
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                className={`p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between cursor-pointer ${borderClass}`}
              >
                <span>{opt}</span>
                {selectedOpt !== null && isCorrect && <Check size={12} className={iconColor} />}
                {selectedOpt !== null && isWrong && <X size={12} className={iconColor} />}
              </button>
            );
          })}
        </div>
      </div>

      {selectedOpt !== null && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-3.5 rounded-xl border text-[11px] leading-relaxed font-mono ${
            selectedOpt === activeQ.ans 
              ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-300' 
              : 'bg-red-500/5 border-red-500/20 text-red-300'
          }`}
        >
          <strong className="block mb-1">{selectedOpt === activeQ.ans ? '✓ Correct Answer!' : '✗ Incorrect Option'}</strong>
          {activeQ.explain}
        </motion.div>
      )}

      <div className="flex justify-end pt-2">
        <button
          onClick={handleNext}
          disabled={selectedOpt === null}
          className="px-5 py-2 bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-400 hover:to-cyan-400 text-white font-sans text-xs font-bold rounded-xl disabled:opacity-50 transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <span>{currentQ === questions.length - 1 ? 'Finish Test' : 'Next Question'}</span>
          <ArrowRight size={12} />
        </button>
      </div>
    </div>
  );
}

// 2. PROJECT 2 SIMULATOR: Apex SaaS Predictive Analytics & AI Engine (Sliders + Custom SVG waves)
function Proj2Simulator({ darkMode }: { darkMode: boolean }) {
  const [cpuLoad, setCpuLoad] = useState(45);
  const [testCoverage, setTestCoverage] = useState(82);
  const [buildVelocity, setBuildVelocity] = useState(5);
  const [isComputing, setIsComputing] = useState(false);
  const [riskFactor, setRiskFactor] = useState<'LOW' | 'MEDIUM' | 'HIGH'>('LOW');
  const [efficiency, setEfficiency] = useState(86.5);
  const [logs, setLogs] = useState<string[]>([
    "🚀 Initializing Predictive Regression matrices...",
    "📊 Ingesting server build pipelines...",
    "🔒 Nominal telemetry state verified."
  ]);

  const handleCompute = () => {
    setIsComputing(true);
    setLogs(prev => ["🤖 AI Engine starting regression diagnostics...", ...prev.slice(0, 3)]);
    
    setTimeout(() => {
      // Logic calculations
      const calculatedScore = (testCoverage * 1.3 - cpuLoad * 0.4 + buildVelocity * 1.5);
      const risk = calculatedScore > 110 ? 'LOW' : calculatedScore > 80 ? 'MEDIUM' : 'HIGH';
      const effValue = Math.min(100, Math.max(10, testCoverage + (100 - cpuLoad)/4 + buildVelocity));

      setRiskFactor(risk);
      setEfficiency(Number(effValue.toFixed(1)));
      setLogs(prev => [
        `✓ Computed AI Risk Index: ${risk} (Raw Grade: ${calculatedScore.toFixed(0)})`,
        `📈 Optimal Pipeline efficiency set to ${effValue.toFixed(1)}%`,
        "⚙️ Regression model successfully refreshed with active telemetry.",
        ...prev
      ]);
      setIsComputing(false);
    }, 1200);
  };

  // Generate dynamic wave coordinate paths based on inputs
  const getWavePath = (frequency: number, amplitude: number, phase: number) => {
    let points = [];
    for (let x = 0; x <= 300; x += 10) {
      const y = 60 + Math.sin((x / frequency) + phase) * amplitude;
      points.push(`${x},${y}`);
    }
    return `M ${points.join(' L ')}`;
  };

  const waveFreq = 15 + (10 - buildVelocity) * 3;
  const waveAmp = 5 + (cpuLoad / 4);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h4 className="font-sans font-extrabold text-sm flex items-center gap-1.5">
          <Sliders size={15} className="text-purple-400" />
          <span>Interactive Predictive Analytics Engine</span>
        </h4>
        <span className="font-mono text-[9px] px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 font-bold uppercase">
          AI Agent Mode
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* Left Column - Controls */}
        <div className={`md:col-span-5 p-4 rounded-xl border ${darkMode ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-black/5'} space-y-4`}>
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] font-mono font-bold text-gray-300">
              <span>SYSTEM CPU LOAD</span>
              <span className="text-amber-400">{cpuLoad}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              value={cpuLoad}
              onChange={(e) => setCpuLoad(Number(e.target.value))}
              className="w-full accent-purple-500 cursor-pointer"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-[10px] font-mono font-bold text-gray-300">
              <span>CODE TEST COVERAGE</span>
              <span className="text-emerald-400">{testCoverage}%</span>
            </div>
            <input
              type="range"
              min="30"
              max="100"
              value={testCoverage}
              onChange={(e) => setTestCoverage(Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-[10px] font-mono font-bold text-gray-300">
              <span>DAILY BUILD VELOCITY</span>
              <span className="text-cyan-400">{buildVelocity} deploys</span>
            </div>
            <input
              type="range"
              min="1"
              max="15"
              value={buildVelocity}
              onChange={(e) => setBuildVelocity(Number(e.target.value))}
              className="w-full accent-cyan-500 cursor-pointer"
            />
          </div>

          <button
            onClick={handleCompute}
            disabled={isComputing}
            className="w-full py-2 bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-400 hover:to-cyan-400 text-white font-sans font-bold text-xs rounded-lg shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            {isComputing ? (
              <>
                <RefreshCw size={12} className="animate-spin" />
                <span>AI Regressing...</span>
              </>
            ) : (
              <>
                <Sparkles size={12} />
                <span>Compute AI Forecast</span>
              </>
            )}
          </button>
        </div>

        {/* Right Column - Visual graphs and AI output */}
        <div className="md:col-span-7 space-y-4">
          {/* Dynamic SVG Wave plot */}
          <div className={`p-3 rounded-xl border relative h-[110px] flex items-center justify-center overflow-hidden ${
            darkMode ? 'bg-black border-white/5 shadow-inner' : 'bg-gray-50 border-black/5'
          }`}>
            <span className="absolute top-2 left-2 font-mono text-[9px] text-gray-500">REALTIME MODEL WAVEFORM</span>
            <svg className="w-full h-full max-w-[300px]" viewBox="0 0 300 120">
              {/* Grid lines */}
              <line x1="0" y1="30" x2="300" y2="30" stroke={darkMode ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)"} />
              <line x1="0" y1="60" x2="300" y2="60" stroke={darkMode ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)"} />
              <line x1="0" y1="90" x2="300" y2="90" stroke={darkMode ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)"} />
              {/* Primary computed wave path */}
              <path
                d={getWavePath(waveFreq, waveAmp, 0)}
                fill="none"
                stroke={cpuLoad > 75 ? "#f87171" : "#22d3ee"}
                strokeWidth="2.5"
                className="transition-all duration-300"
              />
              {/* Secondary offset backing wave path */}
              <path
                d={getWavePath(waveFreq * 1.4, waveAmp * 0.7, 2.5)}
                fill="none"
                stroke="#a855f7"
                strokeWidth="1.5"
                strokeDasharray="4 2"
                className="transition-all duration-300 opacity-60"
              />
            </svg>
            <div className="absolute bottom-2 right-2 font-mono text-[9px] flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${cpuLoad > 75 ? 'bg-red-500 animate-ping' : 'bg-emerald-500'}`} />
              <span className={cpuLoad > 75 ? 'text-red-400' : 'text-emerald-400'}>State: {cpuLoad > 75 ? 'CRITICAL' : 'OPTIMAL'}</span>
            </div>
          </div>

          {/* KPI Output Block */}
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className={`p-2.5 rounded-xl border ${darkMode ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-black/5'}`}>
              <p className="text-gray-400 text-[10px] font-mono">Predicted Efficiency</p>
              <p className="text-lg font-bold text-white mt-0.5 font-mono">{efficiency}%</p>
            </div>
            <div className={`p-2.5 rounded-xl border ${darkMode ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-black/5'}`}>
              <p className="text-gray-400 text-[10px] font-mono">Pipeline Release Risk</p>
              <p className={`text-lg font-bold mt-0.5 font-mono uppercase ${
                riskFactor === 'LOW' ? 'text-emerald-400' : riskFactor === 'MEDIUM' ? 'text-yellow-500' : 'text-red-500 animate-pulse'
              }`}>{riskFactor}</p>
            </div>
          </div>

          {/* Streaming Log panel */}
          <div className={`p-2.5 rounded-xl border font-mono text-[9px] space-y-1 h-[75px] overflow-y-auto ${
            darkMode ? 'bg-black/40 border-white/5 text-gray-300' : 'bg-gray-50 border-black/5 text-gray-700'
          }`}>
            {logs.map((log, index) => (
              <p key={index} className="truncate">{log}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// 3. PROJECT 3 SIMULATOR: CyberSpace Glassmorphism E-Commerce Ecosystem (Stripe Shopping Cart Sim)
function Proj3Simulator({ darkMode }: { darkMode: boolean }) {
  const [cart, setCart] = useState<{ id: string, name: string, price: number, qty: number }[]>([]);
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'pay' | 'success'>('cart');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const inventory = [
    { id: "item-1", name: "Slate Neo Mechanical Keyboard", price: 19370, desc: "Anodized aluminum, hot-swappable custom linear switches." },
    { id: "item-2", name: "Glassmorphic Code Editor License", price: 5070, desc: "Lifetime professional cloud activation." },
    { id: "item-3", name: "AI Quantum Debugger Token Pack", price: 1560, desc: "100 priority execution slots in backend pipelines." }
  ];

  const addToCart = (item: typeof inventory[0]) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { id: item.id, name: item.name, price: item.price, qty: 1 }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(i => i.id !== itemId));
  };

  const getSubtotal = () => cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const getTax = () => Number((getSubtotal() * 0.08).toFixed(2));
  const getTotal = () => Number((getSubtotal() + getTax()).toFixed(2));

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setCheckoutStep('success');
      setCart([]);
    }, 1800);
  };

  if (checkoutStep === 'success') {
    return (
      <div className="text-center py-10 space-y-4 max-w-sm mx-auto">
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/20">
          <CheckCircle2 size={32} className="animate-bounce" />
        </div>
        <div className="space-y-1">
          <h4 className="font-sans font-extrabold text-base">Payment Completed!</h4>
          <p className="text-xs text-gray-400 font-mono">Simulated via Stripe Sandbox Protocol</p>
        </div>
        <div className={`p-4 rounded-xl border text-left font-mono text-[10px] space-y-2 ${darkMode ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-black/5'}`}>
          <div className="flex justify-between text-gray-400">
            <span>TX-HASH:</span>
            <span className="text-gray-200">ch_stripe_sandbox_{Math.random().toString(36).substr(2, 9)}</span>
          </div>
          <div className="flex justify-between text-gray-400">
            <span>LICENSING KEY:</span>
            <span className="text-purple-400 font-bold">KPTN-NEON-DEB-992F</span>
          </div>
          <div className="border-t border-gray-500/10 pt-2 text-emerald-400 font-bold flex items-center gap-1.5 justify-center">
            <Key size={11} /> Transaction Authenticated Securely
          </div>
        </div>
        <button
          onClick={() => setCheckoutStep('cart')}
          className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-sans text-xs font-bold rounded-xl transition-all shadow-md shadow-cyan-500/10 cursor-pointer"
        >
          Return to Storefront
        </button>
      </div>
    );
  }

  if (checkoutStep === 'pay') {
    return (
      <div className="space-y-5">
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
          <ShoppingCart size={13} />
          <span>STRIPE CYBER-PAYMENT TERMINAL</span>
        </div>

        <form onSubmit={handleCheckout} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className={`p-4 rounded-xl border ${darkMode ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-black/5'} space-y-3`}>
            <h5 className="text-[10px] font-mono text-gray-400 font-bold uppercase">Payment Credentials</h5>
            
            <div className="space-y-1">
              <label className="text-[8px] font-mono text-gray-500 font-bold block">NAME ON CARD</label>
              <input
                required
                type="text"
                placeholder="e.g. Kepton Recruiter"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                className={`w-full px-2.5 py-1.5 text-xs font-mono rounded-lg outline-none border ${
                  darkMode ? 'bg-black border-white/10 text-white' : 'bg-white border-black/10 text-gray-900'
                }`}
              />
            </div>

            <div className="space-y-1">
              <label className="text-[8px] font-mono text-gray-500 font-bold block">CARD NUMBER (SANDBOX)</label>
              <input
                required
                type="text"
                maxLength={19}
                placeholder="4242 •••• •••• 4242"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                className={`w-full px-2.5 py-1.5 text-xs font-mono rounded-lg outline-none border ${
                  darkMode ? 'bg-black border-white/10 text-white' : 'bg-white border-black/10 text-gray-900'
                }`}
              />
            </div>
          </div>

          {/* Invoice Summary */}
          <div className={`p-4 rounded-xl border flex flex-col justify-between ${darkMode ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-black/5'}`}>
            <div className="space-y-2 font-mono text-[10px]">
              <h5 className="text-[10px] text-gray-400 font-bold uppercase mb-1">Receipt Invoice</h5>
              <div className="flex justify-between">
                <span>Cart Subtotal:</span>
                <span className="text-gray-300">KSh {getSubtotal().toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Stripe Sandbox Tax (8%):</span>
                <span className="text-gray-300">KSh {getTax().toLocaleString()}</span>
              </div>
              <div className="border-t border-gray-500/10 pt-1.5 flex justify-between font-bold text-xs">
                <span className="text-cyan-400">TOTAL DUE:</span>
                <span className="text-white">KSh {getTotal().toLocaleString()}</span>
              </div>
            </div>

            <div className="space-y-2 pt-4">
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-gray-950 font-sans text-xs font-extrabold rounded-lg flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/10 transition-all cursor-pointer"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw size={12} className="animate-spin" />
                    <span>Processing Stripe Gate...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck size={12} />
                    <span>Pay KSh {getTotal().toLocaleString()} Securely</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => setCheckoutStep('cart')}
                className="w-full py-1 text-[10px] font-mono text-gray-400 hover:text-white transition-all text-center cursor-pointer"
              >
                ← Edit Shopping Cart
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="font-sans font-extrabold text-sm flex items-center gap-1.5">
          <ShoppingCart size={15} className="text-cyan-400" />
          <span>Glassmorphic E-Commerce Checkout SIM</span>
        </h4>
        <span className="font-mono text-[9px] px-2 py-0.5 rounded bg-cyan-400/10 text-cyan-400 font-bold uppercase">
          Stripe Sandbox
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* Inventory List */}
        <div className="md:col-span-7 space-y-2 max-h-[220px] overflow-y-auto pr-1">
          {inventory.map((item) => (
            <div key={item.id} className={`p-3 rounded-xl border ${
              darkMode ? 'bg-white/5 border-white/5 hover:bg-white/10' : 'bg-gray-50 border-black/5 hover:bg-gray-100'
            } flex justify-between items-center gap-3 transition-all`}>
              <div className="space-y-0.5 text-left">
                <h5 className="text-[11px] font-sans font-extrabold text-gray-100">{item.name}</h5>
                <p className="text-[9px] text-gray-400 leading-snug">{item.desc}</p>
              </div>
              <div className="text-right shrink-0 flex items-center gap-2">
                <span className="font-mono text-xs text-cyan-400 font-bold">KSh {item.price.toLocaleString()}</span>
                <button
                  onClick={() => addToCart(item)}
                  className="p-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-gray-950 transition-all cursor-pointer"
                  title="Add to Cart"
                >
                  <ShoppingCart size={11} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Floating Mini Cart */}
        <div className={`md:col-span-5 p-3 rounded-xl border flex flex-col justify-between min-h-[160px] ${
          darkMode ? 'bg-black border-white/5' : 'bg-gray-50 border-black/5'
        }`}>
          <div className="space-y-2">
            <h5 className="text-[10px] font-mono text-purple-400 font-bold uppercase border-b border-gray-500/10 pb-1">YOUR SHOPPING BASKET</h5>
            {cart.length === 0 ? (
              <p className="text-[9px] font-mono text-gray-500 italic text-center py-6">Your shopping cart is currently empty. Add developers assets above!</p>
            ) : (
              <div className="space-y-1.5 max-h-[120px] overflow-y-auto pr-1">
                {cart.map((cartItem) => (
                  <div key={cartItem.id} className="flex justify-between items-center text-[10px] font-mono">
                    <span className="truncate max-w-[120px]">{cartItem.name} <span className="text-cyan-400 text-[9px] font-bold">x{cartItem.qty}</span></span>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-300 font-bold">KSh {(cartItem.price * cartItem.qty).toLocaleString()}</span>
                      <button
                        onClick={() => removeFromCart(cartItem.id)}
                        className="text-red-400 hover:text-red-500 transition-all cursor-pointer"
                      >
                        <Trash2 size={10} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {cart.length > 0 && (
            <div className="border-t border-gray-500/10 pt-2.5 space-y-2">
              <div className="flex justify-between font-mono text-[10px] font-bold">
                <span>Subtotal:</span>
                <span className="text-white">KSh {getSubtotal().toLocaleString()}</span>
              </div>
              <button
                onClick={() => setCheckoutStep('pay')}
                className="w-full py-1.5 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-sans text-xs font-bold rounded-lg text-center transition-all shadow-md shadow-cyan-500/10 cursor-pointer"
              >
                Go to Checkout (KSh {getSubtotal().toLocaleString()})
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// 4. PROJECT 4 SIMULATOR: Kepton Code Snake Arena (Fully playable arcade snake game!)
function Proj4Simulator({ darkMode }: { darkMode: boolean }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [snake, setSnake] = useState<{ x: number, y: number }[]>([
    { x: 7, y: 7 },
    { x: 7, y: 8 },
    { x: 7, y: 9 }
  ]);
  const [food, setFood] = useState<{ x: number, y: number, label: string }>({ x: 4, y: 4, label: "TS" });
  const [dir, setDir] = useState<{ x: number, y: number }>({ x: 0, y: -1 });
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return Number(localStorage.getItem('kepton_snake_modal_high') || '8');
  });
  const [gameOver, setGameOver] = useState(false);
  const [speed, setSpeed] = useState(150);
  
  const boardSize = 14; // Grid sizing (14x14)
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  const badges = ["TS", "C++", "React", "AI", "Go", "Git"];

  const handleStartGame = () => {
    setIsPlaying(true);
    setGameOver(false);
    setScore(0);
    setSnake([
      { x: 7, y: 7 },
      { x: 7, y: 8 },
      { x: 7, y: 9 }
    ]);
    setDir({ x: 0, y: -1 });
    generateFood([{ x: 7, y: 7 }, { x: 7, y: 8 }, { x: 7, y: 9 }]);
    setSpeed(150);
  };

  const generateFood = (currSnake: { x: number, y: number }[]) => {
    let newX, newY;
    let valid = false;
    while (!valid) {
      newX = Math.floor(Math.random() * boardSize);
      newY = Math.floor(Math.random() * boardSize);
      valid = !currSnake.some(part => part.x === newX && part.y === newY);
    }
    const label = badges[Math.floor(Math.random() * badges.length)];
    setFood({ x: newX!, y: newY!, label });
  };

  // On Screen tactile inputs for mobile
  const handleDirection = (newDir: { x: number, y: number }) => {
    if (gameOver || !isPlaying) return;
    // Prevent 180 degree instant reverse into self
    if (newDir.x !== 0 && dir.x !== 0) return;
    if (newDir.y !== 0 && dir.y !== 0) return;
    setDir(newDir);
  };

  // Keyboard navigation listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlaying || gameOver) return;
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          e.preventDefault();
          handleDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          e.preventDefault();
          handleDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          e.preventDefault();
          handleDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          e.preventDefault();
          handleDirection({ x: 1, y: 0 });
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, gameOver, dir]);

  // Main game tick engine loop
  useEffect(() => {
    if (!isPlaying || gameOver) return;

    gameLoopRef.current = setInterval(() => {
      setSnake(prev => {
        const head = prev[0];
        const nextHead = { x: head.x + dir.x, y: head.y + dir.y };

        // Wall collisions
        if (nextHead.x < 0 || nextHead.x >= boardSize || nextHead.y < 0 || nextHead.y >= boardSize) {
          setGameOver(true);
          clearInterval(gameLoopRef.current!);
          return prev;
        }

        // Body collisions
        if (prev.some(part => part.x === nextHead.x && part.y === nextHead.y)) {
          setGameOver(true);
          clearInterval(gameLoopRef.current!);
          return prev;
        }

        const newSnake = [nextHead, ...prev];

        // Check if food eaten
        if (nextHead.x === food.x && nextHead.y === food.y) {
          setScore(curr => {
            const nextScore = curr + 1;
            if (nextScore > highScore) {
              setHighScore(nextScore);
              localStorage.setItem('kepton_snake_modal_high', String(nextScore));
            }
            return nextScore;
          });
          generateFood(newSnake);
          // Scale speed
          setSpeed(prevSp => Math.max(80, prevSp - 5));
        } else {
          newSnake.pop(); // Remove tail
        }

        return newSnake;
      });
    }, speed);

    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [isPlaying, gameOver, dir, food, speed, highScore]);

  if (!isPlaying) {
    return (
      <div className="flex flex-col items-center justify-center text-center space-y-4 h-full py-8">
        <div className="p-4 rounded-full bg-cyan-500/10 text-cyan-400">
          <Gamepad2 size={40} className="animate-pulse" />
        </div>
        <h4 className="font-sans font-extrabold text-lg">Kepton Code Snake Retro Arcade</h4>
        <p className="text-xs text-gray-400 max-w-sm">
          Eat technology badges (<span className="text-cyan-400 font-mono font-bold">TS</span>, <span className="text-purple-400 font-mono font-bold">C++</span>, <span className="text-yellow-500 font-mono font-bold">React</span>) to grow and code the system. Use WASD / Arrow keys or the mobile D-pad below to steer.
        </p>
        <button
          onClick={handleStartGame}
          className="px-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-gray-950 font-bold font-sans text-xs rounded-xl shadow-lg shadow-cyan-500/10 transition-all cursor-pointer"
        >
          Initialize Arcade Session
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
      {/* Game board */}
      <div className="md:col-span-7 flex justify-center">
        <div className={`relative border rounded-2xl p-1.5 overflow-hidden ${
          darkMode ? 'bg-black border-white/10' : 'bg-gray-100 border-black/10'
        }`}>
          {/* Game Over Screen Overlay */}
          <AnimatePresence>
            {gameOver && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/85 backdrop-blur-xs flex flex-col items-center justify-center text-center p-4 space-y-3 z-20"
              >
                <Trophy size={28} className="text-red-400" />
                <div>
                  <h5 className="font-sans font-bold text-red-400 text-sm">Arcade Terminal Crashed</h5>
                  <p className="text-[10px] text-gray-400 font-mono mt-0.5">Final Score: <strong className="text-white">{score}</strong></p>
                </div>
                <button
                  onClick={handleStartGame}
                  className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-gray-950 font-bold font-sans text-xs rounded-lg transition-all cursor-pointer"
                >
                  Restart Arcade
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Snake Sandbox 14x14 Grid rendering */}
          <div 
            className="grid gap-[2px]" 
            style={{ 
              gridTemplateColumns: `repeat(${boardSize}, minmax(0, 1fr))`,
              width: '230px', 
              height: '230px' 
            }}
          >
            {Array.from({ length: boardSize * boardSize }).map((_, idx) => {
              const x = idx % boardSize;
              const y = Math.floor(idx / boardSize);
              
              const isHead = snake[0].x === x && snake[0].y === y;
              const isBody = snake.slice(1).some(part => part.x === x && part.y === y);
              const isFood = food.x === x && food.y === y;

              let cellStyle = 'bg-gray-500/5 rounded-xs';
              let content = null;

              if (isHead) {
                cellStyle = 'bg-cyan-400 rounded-md shadow-md shadow-cyan-400/20';
              } else if (isBody) {
                cellStyle = 'bg-gradient-to-br from-purple-500 to-purple-600 rounded-sm';
              } else if (isFood) {
                cellStyle = 'bg-emerald-500/20 border border-emerald-400 text-emerald-300 font-mono font-bold text-[8px] flex items-center justify-center rounded-lg animate-pulse';
                content = food.label;
              }

              return (
                <div key={idx} className={`w-full h-full aspect-square flex items-center justify-center select-none ${cellStyle}`}>
                  {content}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Stats and Mobile Direction D-Pad controls */}
      <div className="md:col-span-5 space-y-4">
        <div className={`p-3 rounded-xl border ${darkMode ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-black/5'} grid grid-cols-2 gap-2 text-center font-mono text-[10px]`}>
          <div>
            <span className="text-gray-400">Current Score</span>
            <p className="text-sm font-bold text-cyan-400 mt-0.5">{score}</p>
          </div>
          <div>
            <span className="text-gray-400">Local Record</span>
            <p className="text-sm font-bold text-yellow-500 mt-0.5">{highScore}</p>
          </div>
        </div>

        {/* Mobile responsive arrow d-pad */}
        <div className="flex flex-col items-center gap-1 bg-gray-500/5 p-2 rounded-2xl max-w-[150px] mx-auto">
          {/* Row 1 */}
          <button
            onClick={() => handleDirection({ x: 0, y: -1 })}
            className="w-9 h-9 flex items-center justify-center bg-gray-500/10 hover:bg-gray-500/20 active:bg-cyan-500/30 rounded-xl transition-all cursor-pointer"
          >
            <ArrowUp size={16} className="text-cyan-400" />
          </button>
          {/* Row 2 */}
          <div className="flex gap-4">
            <button
              onClick={() => handleDirection({ x: -1, y: 0 })}
              className="w-9 h-9 flex items-center justify-center bg-gray-500/10 hover:bg-gray-500/20 active:bg-cyan-500/30 rounded-xl transition-all cursor-pointer"
            >
              <ArrowLeft size={16} className="text-cyan-400" />
            </button>
            <button
              onClick={() => handleDirection({ x: 0, y: 1 })}
              className="w-9 h-9 flex items-center justify-center bg-gray-500/10 hover:bg-gray-500/20 active:bg-cyan-500/30 rounded-xl transition-all cursor-pointer"
            >
              <ArrowDown size={16} className="text-cyan-400" />
            </button>
            <button
              onClick={() => handleDirection({ x: 1, y: 0 })}
              className="w-9 h-9 flex items-center justify-center bg-gray-500/10 hover:bg-gray-500/20 active:bg-cyan-500/30 rounded-xl transition-all cursor-pointer"
            >
              <ArrowRightIcon size={16} className="text-cyan-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// 5. GENERIC SIMULATOR: Interactive Developer Assistant Terminal Sandbox
function GenericWorkspaceSandbox({ project, darkMode }: { project: Project, darkMode: boolean }) {
  const [history, setHistory] = useState<string[]>([
    `💻 Kepton Virtual Container v1.0.4 Online`,
    `📡 Project Directory: /sandbox/${project.id}/src`,
    `Type "help" to list instructions...`
  ]);
  const [command, setCommand] = useState('');

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = command.trim();
    if (!cmd) return;

    let output = '';
    const query = cmd.toLowerCase();

    if (query === 'help') {
      output = "Supported directives:\n - 'about': View project synopsis\n - 'git log': Show mock commits\n - 'run build': Compile testing suites\n - 'clear': Clear screen records";
    } else if (query === 'about') {
      output = `Synopsis: ${project.description}\nLead: ${project.role}\nStack: ${project.technologies.join(', ')}`;
    } else if (query === 'git log') {
      output = `* Hash: ${Math.random().toString(36).substr(2, 7)} - feat: optimized ${project.technologies[0]} bundle size\n* Hash: ${Math.random().toString(36).substr(2, 7)} - refactor: modularized core handlers\n* Hash: f209a32 - init: workspace scaffolding bootstrap`;
    } else if (query === 'run build') {
      output = `⠋ Compiling project using Vite standard asset bundling...\n✓ Successfully built in 842ms\n⚡ Main Bundle Size: 128.4 kB\n⚠️ Warnings: 0, Errors: 0`;
    } else if (query === 'clear') {
      setHistory([]);
      setCommand('');
      return;
    } else {
      output = `Command not recognized: "${cmd}". Type "help" for a list of available directives.`;
    }

    setHistory(prev => [...prev, `> ${cmd}`, ...output.split('\n')]);
    setCommand('');
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center font-mono text-xs text-purple-400">
        <span className="flex items-center gap-1.5"><Terminal size={14} /> Kepton Developer Terminal Sandbox</span>
        <span className="text-[10px] bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded font-bold uppercase">CMD Shell</span>
      </div>

      <div className={`p-4 rounded-xl border font-mono text-[10px] space-y-1.5 h-[180px] overflow-y-auto ${
        darkMode ? 'bg-black border-white/5 text-gray-300' : 'bg-gray-50 border-black/5 text-gray-700'
      }`}>
        {history.map((line, idx) => (
          <p key={idx} className="whitespace-pre-wrap">{line}</p>
        ))}
      </div>

      <form onSubmit={handleCommandSubmit} className="flex gap-2 font-mono text-xs">
        <span className="text-cyan-400 self-center select-none">$</span>
        <input
          type="text"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          placeholder='e.g. "help", "about", "git log", "run build"'
          className={`flex-1 px-3 py-2 rounded-lg outline-none border ${
            darkMode ? 'bg-black border-white/10 text-white focus:border-cyan-500' : 'bg-white border-black/10 text-gray-900 focus:border-cyan-500'
          }`}
        />
        <button
          type="submit"
          className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-sans font-bold rounded-lg transition-all cursor-pointer"
        >
          Execute
        </button>
      </form>
    </div>
  );
}
