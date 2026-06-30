/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  X, Plus, Trash2, Edit, Save, BookOpen, GraduationCap, Award, 
  Terminal, ShieldCheck, Mail, Database, Upload, Sparkles, MessageSquare, Check, AlertTriangle,
  Github, ExternalLink, Calendar
} from 'lucide-react';
import { Project, Skill, Education, Testimonial, BlogPost, ContactRequest } from '../types';
import { calculateReadingTime } from '../utils/readingTime';

interface AdminCMSProps {
  isOpen: boolean;
  onClose: () => void;
  darkMode: boolean;

  projects: Project[];
  setProjects: (projects: Project[]) => void;
  skills: Skill[];
  setSkills: (skills: Skill[]) => void;
  education: Education[];
  setEducation: (education: Education[]) => void;
  testimonials: Testimonial[];
  setTestimonials: (testimonials: Testimonial[]) => void;
  blogPosts: BlogPost[];
  setBlogPosts: (posts: BlogPost[]) => void;
  contacts: ContactRequest[];
  onClearContacts: () => void;

  profilePic: string;
  setProfilePic: (url: string) => void;
}

export default function AdminCMS({
  isOpen,
  onClose,
  darkMode,
  projects,
  setProjects,
  skills,
  setSkills,
  education,
  setEducation,
  testimonials,
  setTestimonials,
  blogPosts,
  setBlogPosts,
  contacts,
  onClearContacts,
  profilePic,
  setProfilePic
}: AdminCMSProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'projects' | 'education' | 'testimonials' | 'blog' | 'inbox'>('profile');

  // Supabase Connection State Simulation
  const [supabaseUrl, setSupabaseUrl] = useState((import.meta as any).env.VITE_SUPABASE_URL || '');
  const [supabaseKey, setSupabaseKey] = useState((import.meta as any).env.VITE_SUPABASE_ANON_KEY || '');
  const [isSupabaseConnected, setIsSupabaseConnected] = useState(!!((import.meta as any).env.VITE_SUPABASE_URL && (import.meta as any).env.VITE_SUPABASE_ANON_KEY));
  const [connectionMessage, setConnectionMessage] = useState(isSupabaseConnected ? 'Connected to Supabase Schema' : 'Local Fallback State (No Supabase Linked)');

  // Form States
  const [newProj, setNewProj] = useState<Partial<Project>>({
    name: '', description: '', technologies: [], role: '', githubLink: '', liveDemoLink: '', category: 'React', image: '', dateCreated: ''
  });
  const [newSkill, setNewSkill] = useState<Partial<Skill>>({ name: '', category: 'languages', rating: 90 });
  const [newEdu, setNewEdu] = useState<Partial<Education>>({ degree: '', institution: '', duration: '', type: 'Degree' });
  const [newTestimonial, setNewTestimonial] = useState<Partial<Testimonial>>({ author: '', role: '', company: '', text: '', avatar: '' });
  const [newPost, setNewPost] = useState<Partial<BlogPost>>({ title: '', snippet: '', content: '', category: 'Programming', readTime: '5 min read' });

  const handleConnectSupabase = (e: React.FormEvent) => {
    e.preventDefault();
    if (supabaseUrl && supabaseKey) {
      setIsSupabaseConnected(true);
      setConnectionMessage('Supabase client successfully initialized! Contact tables sync in action.');
    } else {
      setIsSupabaseConnected(false);
      setConnectionMessage('Local Cache persisted via localStorage fallback.');
    }
  };

  // Add Project
  const handleAddProject = () => {
    if (!newProj.name || !newProj.description) return;
    const projectToAdd: Project = {
      id: `proj-${Date.now()}`,
      name: newProj.name,
      description: newProj.description,
      image: newProj.image || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600&auto=format&fit=crop',
      technologies: newProj.technologies && newProj.technologies.length > 0 ? newProj.technologies : ['React', 'TypeScript', 'Tailwind CSS'],
      role: newProj.role || 'Full Stack Developer',
      githubLink: newProj.githubLink || 'https://github.com/Keptonotieno',
      liveDemoLink: newProj.liveDemoLink || '#',
      category: newProj.category as any || 'React',
      dateCreated: newProj.dateCreated || new Date().toISOString().split('T')[0]
    };
    setProjects([projectToAdd, ...projects]);
    setNewProj({ name: '', description: '', technologies: [], role: '', githubLink: '', liveDemoLink: '', category: 'React', image: '', dateCreated: '' });
  };

  // Delete Project
  const handleDeleteProject = (id: string) => {
    setProjects(projects.filter(p => p.id !== id));
  };

  // Add Skill
  const handleAddSkill = () => {
    if (!newSkill.name) return;
    const skillToAdd: Skill = {
      id: `sk-${Date.now()}`,
      name: newSkill.name,
      category: newSkill.category as any || 'languages',
      rating: Number(newSkill.rating) || 90
    };
    setSkills([...skills, skillToAdd]);
    setNewSkill({ name: '', category: 'languages', rating: 90 });
  };

  // Delete Skill
  const handleDeleteSkill = (id: string) => {
    setSkills(skills.filter(s => s.id !== id));
  };

  // Add Education
  const handleAddEdu = () => {
    if (!newEdu.degree || !newEdu.institution) return;
    const eduToAdd: Education = {
      id: `edu-${Date.now()}`,
      degree: newEdu.degree,
      institution: newEdu.institution,
      duration: newEdu.duration || '2024',
      type: newEdu.type as any || 'Degree'
    };
    setEducation([eduToAdd, ...education]);
    setNewEdu({ degree: '', institution: '', duration: '', type: 'Degree' });
  };

  // Delete Education
  const handleDeleteEdu = (id: string) => {
    setEducation(education.filter(e => e.id !== id));
  };

  // Add Testimonial
  const handleAddTestimonial = () => {
    if (!newTestimonial.author || !newTestimonial.text) return;
    const testToAdd: Testimonial = {
      id: `test-${Date.now()}`,
      author: newTestimonial.author,
      role: newTestimonial.role || 'Collaborator',
      company: newTestimonial.company || 'Tech Partner',
      text: newTestimonial.text,
      avatar: newTestimonial.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop'
    };
    setTestimonials([testToAdd, ...testimonials]);
    setNewTestimonial({ author: '', role: '', company: '', text: '', avatar: '' });
  };

  // Delete Testimonial
  const handleDeleteTestimonial = (id: string) => {
    setTestimonials(testimonials.filter(t => t.id !== id));
  };

  // Add Blog Post
  const handleAddPost = () => {
    if (!newPost.title || !newPost.content) return;
    const postToAdd: BlogPost = {
      id: `blog-${Date.now()}`,
      title: newPost.title,
      snippet: newPost.snippet || newPost.content.substring(0, 150) + '...',
      content: newPost.content,
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      category: newPost.category || 'Programming',
      readTime: calculateReadingTime(newPost.content),
      author: 'Kepton Otieno'
    };
    setBlogPosts([postToAdd, ...blogPosts]);
    setNewPost({ title: '', snippet: '', content: '', category: 'Programming', readTime: '' });
  };

  // Delete Blog Post
  const handleDeletePost = (id: string) => {
    setBlogPosts(blogPosts.filter(p => p.id !== id));
  };

  if (!isOpen) return null;

  return (
    <div id="cms-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-md">
      <div 
        id="cms-container" 
        className={`w-full max-w-5xl h-[85vh] flex flex-col rounded-2xl border shadow-2xl overflow-hidden transition-all duration-300 ${
          darkMode 
            ? 'bg-gray-950 border-white/10 text-white' 
            : 'bg-white border-black/10 text-gray-900'
        }`}
      >
        {/* Top Header */}
        <div className={`p-5 flex items-center justify-between border-b shrink-0 ${darkMode ? 'border-white/10 bg-gray-900/40' : 'border-black/10 bg-gray-50'}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center text-white glow-purple">
              <Terminal size={20} />
            </div>
            <div>
              <h2 className="font-sans font-bold text-base flex items-center gap-2">
                Developer Admin Center (CMS)
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Interactive Dev mode
                </span>
              </h2>
              <p className="font-mono text-[10px] text-gray-400">
                MANAGE PORTFOLIO DATA & CONTACT INBOX
              </p>
            </div>
          </div>
          <button 
            id="cms-close-btn"
            onClick={onClose}
            className={`p-2 rounded-lg hover:bg-gray-500/10 transition-colors ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Body Layout */}
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar Nav */}
          <aside className={`w-48 shrink-0 hidden md:flex flex-col border-r p-4 gap-1.5 ${darkMode ? 'border-white/10' : 'border-black/10'}`}>
            <span className="font-mono text-[10px] text-gray-500 font-bold px-3 uppercase mb-2">Content Nodes</span>
            
            <button
              id="cms-tab-profile"
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold font-sans text-left transition-all ${
                activeTab === 'profile'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-gray-400 hover:text-cyan-400 hover:bg-gray-500/5'
              }`}
            >
              <Database size={14} />
              <span>Identity & DB</span>
            </button>

            <button
              id="cms-tab-projects"
              onClick={() => setActiveTab('projects')}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold font-sans text-left transition-all ${
                activeTab === 'projects'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-gray-400 hover:text-cyan-400 hover:bg-gray-500/5'
              }`}
            >
              <Award size={14} />
              <span>Projects Showcase</span>
            </button>

            <button
              id="cms-tab-education"
              onClick={() => setActiveTab('education')}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold font-sans text-left transition-all ${
                activeTab === 'education'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-gray-400 hover:text-cyan-400 hover:bg-gray-500/5'
              }`}
            >
              <GraduationCap size={14} />
              <span>Education / Skill</span>
            </button>

            <button
              id="cms-tab-testimonials"
              onClick={() => setActiveTab('testimonials')}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold font-sans text-left transition-all ${
                activeTab === 'testimonials'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-gray-400 hover:text-cyan-400 hover:bg-gray-500/5'
              }`}
            >
              <MessageSquare size={14} />
              <span>Testimonials</span>
            </button>

            <button
              id="cms-tab-blog"
              onClick={() => setActiveTab('blog')}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold font-sans text-left transition-all ${
                activeTab === 'blog'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-gray-400 hover:text-cyan-400 hover:bg-gray-500/5'
              }`}
            >
              <BookOpen size={14} />
              <span>Technical Blog</span>
            </button>

            <div className={`my-3 border-t ${darkMode ? 'border-white/5' : 'border-black/5'}`} />

            <button
              id="cms-tab-inbox"
              onClick={() => setActiveTab('inbox')}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold font-sans text-left transition-all ${
                activeTab === 'inbox'
                  ? 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-300'
                  : 'text-gray-400 hover:text-cyan-400 hover:bg-gray-500/5'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Mail size={14} />
                <span>Contact Inbox</span>
              </div>
              {contacts.length > 0 && (
                <span className="px-1.5 py-0.5 rounded-md bg-cyan-400 text-gray-950 font-mono text-[9px] font-bold">
                  {contacts.length}
                </span>
              )}
            </button>
          </aside>

          {/* Main Form Fields Pane */}
          <main className="flex-1 p-6 overflow-y-auto">
            {/* Mobile Tab Swapper */}
            <div className="flex md:hidden gap-1.5 overflow-x-auto pb-4 mb-4 border-b border-gray-500/10 shrink-0">
              {(['profile', 'projects', 'education', 'testimonials', 'blog', 'inbox'] as const).map((tab) => (
                <button
                  id={`mobile-tab-btn-${tab}`}
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap capitalize ${
                    activeTab === tab 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-gray-500/10 text-gray-400'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* TAB 1: Profile & Supabase config */}
            {activeTab === 'profile' && (
              <div id="cms-pane-profile" className="space-y-6">
                <div>
                  <h3 className="font-sans font-bold text-lg mb-1 flex items-center gap-2">
                    <Database size={18} className="text-purple-400" />
                    Identity & Database Sync Configuration
                  </h3>
                  <p className="text-xs text-gray-400">
                    Customize your profile picture and establish active API connection points.
                  </p>
                </div>

                {/* Profile Picture Controller */}
                <div className={`p-4 rounded-xl border ${darkMode ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-black/5'} space-y-4`}>
                  <h4 className="font-sans font-bold text-xs uppercase text-cyan-400 tracking-wider">Professional Profile Photo URL</h4>
                  <div className="flex gap-4 items-center">
                    <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-white/10 bg-gray-900">
                      <img 
                        id="cms-profile-avatar-preview"
                        src={profilePic || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=200&auto=format&fit=crop'} 
                        alt="Profile Preview" 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                      <input
                        id="cms-profile-pic-input"
                        type="text"
                        value={profilePic}
                        onChange={(e) => setProfilePic(e.target.value)}
                        placeholder="Paste profile photo URL (e.g. Unsplash or professional portrait)"
                        className={`w-full px-3 py-2 rounded-lg text-xs border focus:outline-none focus:ring-1 focus:ring-cyan-400 ${
                          darkMode ? 'bg-black border-white/10 text-white' : 'bg-white border-black/10 text-gray-900'
                        }`}
                      />
                      <p className="text-[10px] text-gray-400">
                        *You can paste any image link or use a mock placeholder. Changes reflect in Hero Section in real-time.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Supabase Linker form */}
                <form 
                  id="cms-supabase-form"
                  onSubmit={handleConnectSupabase} 
                  className={`p-4 rounded-xl border ${darkMode ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-black/5'} space-y-4`}
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-sans font-bold text-xs uppercase text-cyan-400 tracking-wider">Supabase Sync Settings</h4>
                    <div className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-bold font-mono ${
                      isSupabaseConnected ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                    }`}>
                      {isSupabaseConnected ? <ShieldCheck size={10} /> : <AlertTriangle size={10} />}
                      <span>{isSupabaseConnected ? 'Sync Active' : 'Cache Persist'}</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-gray-400 leading-relaxed">
                    By default, this portfolio saves all CMS data (Projects, Skills, Education, Blog posts) and incoming contact messages into the browser's <strong>localStorage</strong> (fully active, instant mock backend). To sync with actual production Supabase instances, paste your details below.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono font-bold text-gray-400">SUPABASE_URL</label>
                      <input
                        id="cms-supabase-url-input"
                        type="text"
                        value={supabaseUrl}
                        onChange={(e) => setSupabaseUrl(e.target.value)}
                        placeholder="https://your-project.supabase.co"
                        className={`w-full px-3 py-2 rounded-lg text-xs border focus:outline-none focus:ring-1 focus:ring-cyan-400 ${
                          darkMode ? 'bg-black border-white/10 text-white' : 'bg-white border-black/10 text-gray-900'
                        }`}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono font-bold text-gray-400">SUPABASE_ANON_KEY</label>
                      <input
                        id="cms-supabase-key-input"
                        type="password"
                        value={supabaseKey}
                        onChange={(e) => setSupabaseKey(e.target.value)}
                        placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                        className={`w-full px-3 py-2 rounded-lg text-xs border focus:outline-none focus:ring-1 focus:ring-cyan-400 ${
                          darkMode ? 'bg-black border-white/10 text-white' : 'bg-white border-black/10 text-gray-900'
                        }`}
                      />
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <span className="text-[10px] font-mono text-gray-400">{connectionMessage}</span>
                    <button
                      id="cms-supabase-sync-btn"
                      type="submit"
                      className="px-4 py-1.5 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-lg text-xs font-bold hover:opacity-90 flex items-center gap-1.5"
                    >
                      <Check size={12} />
                      <span>Link Client</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* TAB 2: Projects manager */}
            {activeTab === 'projects' && (
              <div id="cms-pane-projects" className="space-y-6">
                <div>
                  <h3 className="font-sans font-bold text-lg mb-1 flex items-center gap-2">
                    <Award size={18} className="text-purple-400" />
                    Manage Projects Showcase
                  </h3>
                  <p className="text-xs text-gray-400">
                    Add new projects to the portfolio showcase or delete current listings.
                  </p>
                </div>

                {/* Add project panel */}
                <div className={`p-4 rounded-xl border ${darkMode ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-black/5'} space-y-3`}>
                  <h4 className="font-sans font-bold text-xs uppercase text-cyan-400 tracking-wider">Add New Project Listing</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      id="cms-proj-name-input"
                      type="text"
                      placeholder="Project Name"
                      value={newProj.name}
                      onChange={(e) => setNewProj({ ...newProj, name: e.target.value })}
                      className={`px-3 py-2 rounded-lg text-xs border focus:outline-none ${darkMode ? 'bg-black border-white/10' : 'bg-white border-black/10'}`}
                    />
                    <input
                      id="cms-proj-role-input"
                      type="text"
                      placeholder="Developer Role (e.g. Lead Dev)"
                      value={newProj.role}
                      onChange={(e) => setNewProj({ ...newProj, role: e.target.value })}
                      className={`px-3 py-2 rounded-lg text-xs border focus:outline-none ${darkMode ? 'bg-black border-white/10' : 'bg-white border-black/10'}`}
                    />
                  </div>

                  <input
                    id="cms-proj-desc-input"
                    placeholder="Short Description..."
                    value={newProj.description}
                    onChange={(e) => setNewProj({ ...newProj, description: e.target.value })}
                    className={`w-full px-3 py-2 rounded-lg text-xs border focus:outline-none ${darkMode ? 'bg-black border-white/10' : 'bg-white border-black/10'}`}
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      id="cms-proj-img-input"
                      type="text"
                      placeholder="Image URL (Unsplash or direct link)"
                      value={newProj.image}
                      onChange={(e) => setNewProj({ ...newProj, image: e.target.value })}
                      className={`px-3 py-2 rounded-lg text-xs border focus:outline-none ${darkMode ? 'bg-black border-white/10' : 'bg-white border-black/10'}`}
                    />
                    <select
                      id="cms-proj-category-select"
                      value={newProj.category}
                      onChange={(e) => setNewProj({ ...newProj, category: e.target.value as any })}
                      className={`px-3 py-2 rounded-lg text-xs border focus:outline-none ${darkMode ? 'bg-black border-white/10 text-white' : 'bg-white border-black/10 text-gray-900'}`}
                    >
                      <option value="React">React Project</option>
                      <option value="AI">AI Project</option>
                      <option value="Full Stack">Full Stack Project</option>
                      <option value="Web Applications">Web Application</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input
                      id="cms-proj-github-input"
                      type="text"
                      placeholder="GitHub URL"
                      value={newProj.githubLink}
                      onChange={(e) => setNewProj({ ...newProj, githubLink: e.target.value })}
                      className={`px-3 py-2 rounded-lg text-xs border focus:outline-none ${darkMode ? 'bg-black border-white/10' : 'bg-white border-black/10'}`}
                    />
                    <input
                      id="cms-proj-demo-input"
                      type="text"
                      placeholder="Live Demo URL"
                      value={newProj.liveDemoLink}
                      onChange={(e) => setNewProj({ ...newProj, liveDemoLink: e.target.value })}
                      className={`px-3 py-2 rounded-lg text-xs border focus:outline-none ${darkMode ? 'bg-black border-white/10' : 'bg-white border-black/10'}`}
                    />
                    <input
                      id="cms-proj-date-input"
                      type="text"
                      placeholder="Date Created (e.g., 2023-09-15)"
                      value={newProj.dateCreated || ''}
                      onChange={(e) => setNewProj({ ...newProj, dateCreated: e.target.value })}
                      className={`px-3 py-2 rounded-lg text-xs border focus:outline-none ${darkMode ? 'bg-black border-white/10' : 'bg-white border-black/10'}`}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <input
                      id="cms-proj-techs-input"
                      type="text"
                      placeholder="Technologies (comma separated, e.g. React, TypeScript, Node.js)"
                      onChange={(e) => setNewProj({ ...newProj, technologies: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                      className={`w-full px-3 py-2 rounded-lg text-xs border focus:outline-none ${darkMode ? 'bg-black border-white/10' : 'bg-white border-black/10'}`}
                    />
                  </div>

                  <button
                    id="cms-add-project-btn"
                    type="button"
                    onClick={handleAddProject}
                    className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                  >
                    <Plus size={14} />
                    <span>Add Project to Live Gallery</span>
                  </button>
                </div>

                {/* Current projects lists */}
                <div className="space-y-3">
                  <h4 className="font-sans font-bold text-xs uppercase text-cyan-400 tracking-wider">Current Listings ({projects.length})</h4>
                  <div className="grid grid-cols-1 gap-4">
                    {projects.map((proj) => (
                      <div 
                        key={proj.id} 
                        className={`p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs ${
                          darkMode ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-black/5'
                        }`}
                      >
                        <div className="space-y-3.5 flex-1">
                          <div className="flex items-center gap-3">
                            <img 
                              src={proj.image || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600&auto=format&fit=crop'} 
                              alt={proj.name}
                              referrerPolicy="no-referrer"
                              className="w-12 h-12 object-cover rounded-lg border border-gray-500/20 shadow-sm shrink-0"
                            />
                            <div>
                              <p className="font-bold text-sm text-purple-400">{proj.name}</p>
                              <p className="text-[10px] text-gray-400">{proj.category} — {proj.role}</p>
                            </div>
                          </div>
                                                    {/* Dedicated input fields for GitHub Repo, Live Demo, Cover Image, and Date Created */}
                          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-black/10 dark:bg-black/20 p-3 rounded-lg border border-gray-500/5">
                            <div className="space-y-1">
                              <label className="text-[9px] font-mono text-gray-400 uppercase tracking-wider flex items-center gap-1">
                                <Github size={10} />
                                <span>GitHub Repository URL</span>
                              </label>
                              <input
                                id={`cms-proj-list-github-${proj.id}`}
                                type="text"
                                value={proj.githubLink || ''}
                                onChange={(e) => {
                                  const updated = projects.map(p => p.id === proj.id ? { ...p, githubLink: e.target.value } : p);
                                  setProjects(updated);
                                }}
                                placeholder="https://github.com/..."
                                className={`w-full px-2.5 py-1.5 rounded-lg border text-[11px] font-mono focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all ${
                                  darkMode ? 'bg-gray-950 border-white/10 text-white' : 'bg-white border-black/10 text-gray-900'
                                }`}
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[9px] font-mono text-gray-400 uppercase tracking-wider flex items-center gap-1">
                                <ExternalLink size={10} />
                                <span>Live Demo URL</span>
                              </label>
                              <input
                                id={`cms-proj-list-demo-${proj.id}`}
                                type="text"
                                value={proj.liveDemoLink || ''}
                                onChange={(e) => {
                                  const updated = projects.map(p => p.id === proj.id ? { ...p, liveDemoLink: e.target.value } : p);
                                  setProjects(updated);
                                }}
                                placeholder="https://..."
                                className={`w-full px-2.5 py-1.5 rounded-lg border text-[11px] font-mono focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all ${
                                  darkMode ? 'bg-gray-950 border-white/10 text-white' : 'bg-white border-black/10 text-gray-900'
                                }`}
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[9px] font-mono text-gray-400 uppercase tracking-wider flex items-center gap-1">
                                <Upload size={10} />
                                <span>Project Cover Image URL</span>
                              </label>
                              <input
                                id={`cms-proj-list-image-${proj.id}`}
                                type="text"
                                value={proj.image || ''}
                                onChange={(e) => {
                                  const updated = projects.map(p => p.id === proj.id ? { ...p, image: e.target.value } : p);
                                  setProjects(updated);
                                }}
                                placeholder="https://images.unsplash.com/..."
                                className={`w-full px-2.5 py-1.5 rounded-lg border text-[11px] font-mono focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all ${
                                  darkMode ? 'bg-gray-950 border-white/10 text-white' : 'bg-white border-black/10 text-gray-900'
                                }`}
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[9px] font-mono text-gray-400 uppercase tracking-wider flex items-center gap-1">
                                <Calendar size={10} />
                                <span>Date Created</span>
                              </label>
                              <input
                                id={`cms-proj-list-date-${proj.id}`}
                                type="text"
                                value={proj.dateCreated || ''}
                                onChange={(e) => {
                                  const updated = projects.map(p => p.id === proj.id ? { ...p, dateCreated: e.target.value } : p);
                                  setProjects(updated);
                                }}
                                placeholder="YYYY-MM-DD"
                                className={`w-full px-2.5 py-1.5 rounded-lg border text-[11px] font-mono focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all ${
                                  darkMode ? 'bg-gray-950 border-white/10 text-white' : 'bg-white border-black/10 text-gray-900'
                                }`}
                              />
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex md:flex-col items-center justify-end gap-2 border-t md:border-t-0 pt-3 md:pt-0 border-gray-500/10 shrink-0">
                          <button
                            id={`delete-proj-${proj.id}`}
                            onClick={() => handleDeleteProject(proj.id)}
                            className="px-3 py-1.5 sm:p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
                            title="Delete project"
                          >
                            <Trash2 size={13} />
                            <span className="md:hidden">Delete Project</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: Education & skills */}
            {activeTab === 'education' && (
              <div id="cms-pane-education" className="space-y-6">
                <div>
                  <h3 className="font-sans font-bold text-lg mb-1 flex items-center gap-2">
                    <GraduationCap size={18} className="text-purple-400" />
                    Manage Skills & Education Nodes
                  </h3>
                  <p className="text-xs text-gray-400">
                    Add certifications, degree programs, training certifications, or customize core dev skills.
                  </p>
                </div>

                {/* Add education form */}
                <div className={`p-4 rounded-xl border ${darkMode ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-black/5'} space-y-3`}>
                  <h4 className="font-sans font-bold text-xs uppercase text-cyan-400 tracking-wider">Add Education / Certification Card</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      id="cms-edu-degree"
                      type="text"
                      placeholder="Course/Degree/Certification title"
                      value={newEdu.degree}
                      onChange={(e) => setNewEdu({ ...newEdu, degree: e.target.value })}
                      className={`px-3 py-2 rounded-lg text-xs border focus:outline-none ${darkMode ? 'bg-black border-white/10' : 'bg-white border-black/10'}`}
                    />
                    <input
                      id="cms-edu-inst"
                      type="text"
                      placeholder="Institution/Platform"
                      value={newEdu.institution}
                      onChange={(e) => setNewEdu({ ...newEdu, institution: e.target.value })}
                      className={`px-3 py-2 rounded-lg text-xs border focus:outline-none ${darkMode ? 'bg-black border-white/10' : 'bg-white border-black/10'}`}
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      id="cms-edu-duration"
                      type="text"
                      placeholder="Duration/Year (e.g. 2023 - 2024)"
                      value={newEdu.duration}
                      onChange={(e) => setNewEdu({ ...newEdu, duration: e.target.value })}
                      className={`px-3 py-2 rounded-lg text-xs border focus:outline-none ${darkMode ? 'bg-black border-white/10' : 'bg-white border-black/10'}`}
                    />
                    <select
                      id="cms-edu-type"
                      value={newEdu.type}
                      onChange={(e) => setNewEdu({ ...newEdu, type: e.target.value as any })}
                      className={`px-3 py-2 rounded-lg text-xs border focus:outline-none ${darkMode ? 'bg-black border-white/10 text-white' : 'bg-white border-black/10 text-gray-900'}`}
                    >
                      <option value="Degree">Degree Program</option>
                      <option value="Certification">Professional Certification</option>
                      <option value="Course">Specialized Course</option>
                      <option value="Technical Training">Technical Training Program</option>
                    </select>
                  </div>
                  <button
                    id="cms-add-edu-btn"
                    onClick={handleAddEdu}
                    className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5"
                  >
                    <Plus size={14} />
                    <span>Add Timeline Node</span>
                  </button>
                </div>

                {/* Add skill form */}
                <div className={`p-4 rounded-xl border ${darkMode ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-black/5'} space-y-3`}>
                  <h4 className="font-sans font-bold text-xs uppercase text-cyan-400 tracking-wider">Add Core Technical Skill</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input
                      id="cms-skill-name"
                      type="text"
                      placeholder="Skill name (e.g. Python)"
                      value={newSkill.name}
                      onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                      className={`px-3 py-2 rounded-lg text-xs border focus:outline-none ${darkMode ? 'bg-black border-white/10' : 'bg-white border-black/10'}`}
                    />
                    <select
                      id="cms-skill-cat"
                      value={newSkill.category}
                      onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value as any })}
                      className={`px-3 py-2 rounded-lg text-xs border focus:outline-none ${darkMode ? 'bg-black border-white/10 text-white' : 'bg-white border-black/10 text-gray-900'}`}
                    >
                      <option value="languages">Programming Language</option>
                      <option value="frontend">Frontend Stack</option>
                      <option value="css">CSS Framework</option>
                      <option value="backend">Backend & DB</option>
                      <option value="other">Architecture / Other</option>
                    </select>
                    <input
                      id="cms-skill-rating"
                      type="number"
                      placeholder="Proficiency (0-100)"
                      value={newSkill.rating}
                      onChange={(e) => setNewSkill({ ...newSkill, rating: Number(e.target.value) })}
                      className={`px-3 py-2 rounded-lg text-xs border focus:outline-none ${darkMode ? 'bg-black border-white/10' : 'bg-white border-black/10'}`}
                    />
                  </div>
                  <button
                    id="cms-add-skill-btn"
                    onClick={handleAddSkill}
                    className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5"
                  >
                    <Plus size={14} />
                    <span>Add Skill Bar</span>
                  </button>
                </div>

                {/* Listing educations */}
                <div className="space-y-2">
                  <h4 className="font-sans font-bold text-xs uppercase text-cyan-400 tracking-wider">Current Timelines</h4>
                  <div className="grid grid-cols-1 gap-2">
                    {education.map((edu) => (
                      <div 
                        key={edu.id} 
                        className={`p-3 rounded-lg border flex justify-between items-center text-xs ${
                          darkMode ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-black/5'
                        }`}
                      >
                        <div>
                          <p className="font-bold">{edu.degree}</p>
                          <p className="text-[10px] text-gray-400">{edu.institution} ({edu.duration}) — {edu.type}</p>
                        </div>
                        <button
                          id={`delete-edu-${edu.id}`}
                          onClick={() => handleDeleteEdu(edu.id)}
                          className="p-1.5 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: Testimonials manager */}
            {activeTab === 'testimonials' && (
              <div id="cms-pane-testimonials" className="space-y-6">
                <div>
                  <h3 className="font-sans font-bold text-lg mb-1 flex items-center gap-2">
                    <MessageSquare size={18} className="text-purple-400" />
                    Manage Testimonials & Client Reviews
                  </h3>
                  <p className="text-xs text-gray-400">
                    Add positive reviews, client feedback, or collaboration endorsements.
                  </p>
                </div>

                <div className={`p-4 rounded-xl border ${darkMode ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-black/5'} space-y-3`}>
                  <h4 className="font-sans font-bold text-xs uppercase text-cyan-400 tracking-wider">Add New Recommendation</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input
                      id="cms-test-author"
                      type="text"
                      placeholder="Reviewer Name"
                      value={newTestimonial.author}
                      onChange={(e) => setNewTestimonial({ ...newTestimonial, author: e.target.value })}
                      className={`px-3 py-2 rounded-lg text-xs border focus:outline-none ${darkMode ? 'bg-black border-white/10' : 'bg-white border-black/10'}`}
                    />
                    <input
                      id="cms-test-role"
                      type="text"
                      placeholder="Role (e.g. Project Lead)"
                      value={newTestimonial.role}
                      onChange={(e) => setNewTestimonial({ ...newTestimonial, role: e.target.value })}
                      className={`px-3 py-2 rounded-lg text-xs border focus:outline-none ${darkMode ? 'bg-black border-white/10' : 'bg-white border-black/10'}`}
                    />
                    <input
                      id="cms-test-comp"
                      type="text"
                      placeholder="Company"
                      value={newTestimonial.company}
                      onChange={(e) => setNewTestimonial({ ...newTestimonial, company: e.target.value })}
                      className={`px-3 py-2 rounded-lg text-xs border focus:outline-none ${darkMode ? 'bg-black border-white/10' : 'bg-white border-black/10'}`}
                    />
                  </div>
                  <textarea
                    id="cms-test-text"
                    placeholder="Review Feedback..."
                    rows={3}
                    value={newTestimonial.text}
                    onChange={(e) => setNewTestimonial({ ...newTestimonial, text: e.target.value })}
                    className={`w-full px-3 py-2 rounded-lg text-xs border focus:outline-none ${darkMode ? 'bg-black border-white/10' : 'bg-white border-black/10'}`}
                  />
                  <input
                    id="cms-test-avatar"
                    type="text"
                    placeholder="Avatar image link (Optional)"
                    value={newTestimonial.avatar}
                    onChange={(e) => setNewTestimonial({ ...newTestimonial, avatar: e.target.value })}
                    className={`w-full px-3 py-2 rounded-lg text-xs border focus:outline-none ${darkMode ? 'bg-black border-white/10' : 'bg-white border-black/10'}`}
                  />
                  <button
                    id="cms-add-test-btn"
                    onClick={handleAddTestimonial}
                    className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5"
                  >
                    <Plus size={14} />
                    <span>Post Recommendation</span>
                  </button>
                </div>

                <div className="space-y-2">
                  <h4 className="font-sans font-bold text-xs uppercase text-cyan-400 tracking-wider">Current Testimonials</h4>
                  <div className="grid grid-cols-1 gap-2">
                    {testimonials.map((t) => (
                      <div 
                        key={t.id} 
                        className={`p-3 rounded-lg border flex justify-between items-center text-xs ${
                          darkMode ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-black/5'
                        }`}
                      >
                        <div>
                          <p className="font-bold">{t.author}</p>
                          <p className="text-[10px] text-gray-400">{t.role} @ {t.company}</p>
                        </div>
                        <button
                          id={`delete-test-${t.id}`}
                          onClick={() => handleDeleteTestimonial(t.id)}
                          className="p-1.5 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: Technical Blog manager */}
            {activeTab === 'blog' && (
              <div id="cms-pane-blog" className="space-y-6">
                <div>
                  <h3 className="font-sans font-bold text-lg mb-1 flex items-center gap-2">
                    <BookOpen size={18} className="text-purple-400" />
                    Manage Space for Technical Blog Articles
                  </h3>
                  <p className="text-xs text-gray-400">
                    Write new programming, software engineering, or artificial intelligence articles.
                  </p>
                </div>

                <div className={`p-4 rounded-xl border ${darkMode ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-black/5'} space-y-3`}>
                  <h4 className="font-sans font-bold text-xs uppercase text-cyan-400 tracking-wider">Write New Technical Article</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input
                      id="cms-post-title"
                      type="text"
                      placeholder="Article Title"
                      value={newPost.title}
                      onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                      className={`px-3 py-2 rounded-lg text-xs border focus:outline-none sm:col-span-2 ${darkMode ? 'bg-black border-white/10' : 'bg-white border-black/10'}`}
                    />
                    <select
                      id="cms-post-cat"
                      value={newPost.category}
                      onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
                      className={`px-3 py-2 rounded-lg text-xs border focus:outline-none ${darkMode ? 'bg-black border-white/10 text-white' : 'bg-white border-black/10 text-gray-900'}`}
                    >
                      <option value="Programming">Programming</option>
                      <option value="Artificial Intelligence">Artificial Intelligence</option>
                      <option value="Web Development">Web Development</option>
                      <option value="Software Engineering">Software Engineering</option>
                    </select>
                  </div>
                  <input
                    id="cms-post-snippet"
                    placeholder="Short summary/snippet of the article..."
                    value={newPost.snippet}
                    onChange={(e) => setNewPost({ ...newPost, snippet: e.target.value })}
                    className={`w-full px-3 py-2 rounded-lg text-xs border focus:outline-none ${darkMode ? 'bg-black border-white/10' : 'bg-white border-black/10'}`}
                  />
                  <textarea
                    id="cms-post-content"
                    placeholder="Complete markdown or text article content..."
                    rows={5}
                    value={newPost.content}
                    onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                    className={`w-full px-3 py-2 rounded-lg text-xs border focus:outline-none ${darkMode ? 'bg-black border-white/10' : 'bg-white border-black/10'}`}
                  />
                  <button
                    id="cms-add-post-btn"
                    onClick={handleAddPost}
                    className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5"
                  >
                    <Plus size={14} />
                    <span>Publish Technical Article</span>
                  </button>
                </div>

                <div className="space-y-2">
                  <h4 className="font-sans font-bold text-xs uppercase text-cyan-400 tracking-wider">Current Publications</h4>
                  <div className="grid grid-cols-1 gap-2">
                    {blogPosts.map((post) => (
                      <div 
                        key={post.id} 
                        className={`p-3 rounded-lg border flex justify-between items-center text-xs ${
                          darkMode ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-black/5'
                        }`}
                      >
                        <div>
                          <p className="font-bold">{post.title}</p>
                          <p className="text-[10px] text-gray-400">{post.category} — {post.date}</p>
                        </div>
                        <button
                          id={`delete-post-${post.id}`}
                          onClick={() => handleDeletePost(post.id)}
                          className="p-1.5 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 6: Inbox Messages */}
            {activeTab === 'inbox' && (
              <div id="cms-pane-inbox" className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-sans font-bold text-lg mb-1 flex items-center gap-2">
                      <Mail size={18} className="text-cyan-400" />
                      Contact Form Storage Inbox
                    </h3>
                    <p className="text-xs text-gray-400">
                      Real-time submissions sent via the portfolio contact form.
                    </p>
                  </div>
                  {contacts.length > 0 && (
                    <button
                      id="cms-clear-inbox-btn"
                      onClick={onClearContacts}
                      className="px-3 py-1.5 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold transition-all"
                    >
                      Clear Inbox
                    </button>
                  )}
                </div>

                {contacts.length === 0 ? (
                  <div className="py-12 text-center space-y-3">
                    <Mail size={36} className="mx-auto text-gray-500/40 animate-pulse" />
                    <p className="text-sm text-gray-400 font-sans">No submissions in your inbox yet.</p>
                    <p className="text-[11px] text-gray-500 max-w-sm mx-auto leading-relaxed">
                      Go to the <strong>Contact Section</strong> in the main portfolio, send a test message, and it will appear here immediately!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {contacts.map((contact) => (
                      <div 
                        key={contact.id} 
                        className={`p-4 rounded-xl border flex flex-col gap-2 ${
                          darkMode ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-black/5'
                        }`}
                      >
                        <div className="flex justify-between items-center border-b border-gray-500/10 pb-2">
                          <div>
                            <span className="font-sans font-bold text-xs">{contact.name}</span>
                            <span className="font-mono text-[10px] text-gray-400 ml-2">({contact.email})</span>
                          </div>
                          <span className="font-mono text-[9px] text-cyan-400">{contact.date}</span>
                        </div>
                        <p className="font-sans text-xs text-gray-300 leading-relaxed whitespace-pre-wrap">
                          {contact.message}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
