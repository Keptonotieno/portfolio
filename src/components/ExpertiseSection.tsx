/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Sparkles, Cpu, Award, Zap } from 'lucide-react';
import { motion } from 'motion/react';

interface ExpertiseSectionProps {
  darkMode: boolean;
}

export default function ExpertiseSection({ darkMode }: ExpertiseSectionProps) {
  const frontendSkills = [
    { name: 'React & TypeScript', level: 'Expert', percentage: 94, color: 'from-cyan-400 to-blue-500' },
    { name: 'Tailwind CSS & CSS3', level: 'Expert', percentage: 96, color: 'from-sky-400 to-cyan-500' },
    { name: 'HTML5 & Bootstrap', level: 'Expert', percentage: 98, color: 'from-blue-400 to-indigo-500' }
  ];

  const backendSkills = [
    { name: 'Spring Boot & Java', level: 'Advanced', percentage: 88, color: 'from-purple-400 to-indigo-500' },
    { name: 'REST API & Python', level: 'Expert', percentage: 92, color: 'from-cyan-400 to-purple-500' },
    { name: 'Supabase & Databases', level: 'Advanced', percentage: 90, color: 'from-emerald-400 to-teal-500' }
  ];

  const otherSkills = [
    { name: 'AI concepts & Exploring AI Solutions', level: 'Advanced', percentage: 88, color: 'from-amber-400 to-orange-500' },
    { name: 'Git & GitHub Workflows', level: 'Expert', percentage: 95, color: 'from-rose-400 to-pink-500' }
  ];

  const getLevelBadgeStyles = (level: string) => {
    switch (level) {
      case 'Expert':
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
      case 'Advanced':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      default:
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    }
  };

  const services = [
    {
      title: 'MVP Development',
      description: 'from concept to scalable product in weeks.'
    },
    {
      title: 'Performance Tuning',
      description: 'optimizing Core Web Vitals & Server response.'
    },
    {
      title: 'UI/UX System',
      description: 'creating consistent, accessible design systems.'
    },
    {
      title: 'Technical Strategy',
      description: 'CTO-as-a-Service for early stage startups.'
    }
  ];

  return (
    <section id="expertise-split" className="py-24 px-6 relative border-t border-gray-500/10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch relative z-10">
        
        {/* Left Side: Technical Arsenal Card */}
        <div className={`lg:col-span-5 rounded-3xl p-8 border flex flex-col justify-between ${
          darkMode
            ? 'bg-gray-900/30 border-white/5 hover:border-white/10 shadow-xl'
            : 'bg-white border-gray-200/60 shadow-lg shadow-gray-100/50'
        }`}>
          <div className="space-y-6">
            <div className="space-y-2">
              <span className="font-mono text-xs text-cyan-400 font-extrabold uppercase tracking-widest flex items-center gap-2">
                <Cpu size={14} />
                Skill Stack
              </span>
              <h3 className={`text-2xl sm:text-3xl font-sans font-extrabold tracking-tight ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Technical Arsenal
              </h3>
            </div>

            {/* Frontend Group */}
            <div className="space-y-4 pt-2">
              <span className="font-mono text-[10px] uppercase font-bold text-gray-400 tracking-wider block">
                Frontend Engineering
              </span>
              <div className="space-y-3.5">
                {frontendSkills.map((skill) => (
                  <div key={skill.name} className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                        {skill.name}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getLevelBadgeStyles(skill.level)}`}>
                          {skill.level}
                        </span>
                        <span className={`font-mono font-bold text-[10px] ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {skill.percentage}%
                        </span>
                      </div>
                    </div>
                    {/* Progress Bar Track */}
                    <div className={`h-1.5 w-full rounded-full overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                      <motion.div
                        className={`h-full rounded-full bg-gradient-to-r ${skill.color}`}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.percentage}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, ease: 'easeOut' }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Backend Group */}
            <div className="space-y-4 pt-2">
              <span className="font-mono text-[10px] uppercase font-bold text-gray-400 tracking-wider block">
                Backend & Cloud
              </span>
              <div className="space-y-3.5">
                {backendSkills.map((skill) => (
                  <div key={skill.name} className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                        {skill.name}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getLevelBadgeStyles(skill.level)}`}>
                          {skill.level}
                        </span>
                        <span className={`font-mono font-bold text-[10px] ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {skill.percentage}%
                        </span>
                      </div>
                    </div>
                    {/* Progress Bar Track */}
                    <div className={`h-1.5 w-full rounded-full overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                      <motion.div
                        className={`h-full rounded-full bg-gradient-to-r ${skill.color}`}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.percentage}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, ease: 'easeOut' }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Other / Tools Group */}
            <div className="space-y-4 pt-2">
              <span className="font-mono text-[10px] uppercase font-bold text-gray-400 tracking-wider block">
                Intelligence & Version Control
              </span>
              <div className="space-y-3.5">
                {otherSkills.map((skill) => (
                  <div key={skill.name} className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                        {skill.name}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getLevelBadgeStyles(skill.level)}`}>
                          {skill.level}
                        </span>
                        <span className={`font-mono font-bold text-[10px] ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {skill.percentage}%
                        </span>
                      </div>
                    </div>
                    {/* Progress Bar Track */}
                    <div className={`h-1.5 w-full rounded-full overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                      <motion.div
                        className={`h-full rounded-full bg-gradient-to-r ${skill.color}`}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.percentage}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, ease: 'easeOut' }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-500/10 mt-8 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award size={16} className="text-purple-400" />
              <span className={`text-xs font-bold font-mono ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                100% Production Ready
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: How I Can Help You Card (Dark-themed container even in light mode for maximum style contrast) */}
        <div className="lg:col-span-7 rounded-3xl p-8 bg-gray-950 border border-white/10 text-white shadow-2xl relative overflow-hidden flex flex-col justify-between">
          
          {/* Subtle Ambient Background Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-[80px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px] pointer-events-none" />

          <div className="space-y-8 relative z-10">
            <div className="space-y-2">
              <span className="font-mono text-xs text-purple-400 font-extrabold uppercase tracking-widest flex items-center gap-2">
                <Sparkles size={14} className="animate-pulse" />
                Value proposition
              </span>
              <h3 className="text-2xl sm:text-3xl font-sans font-extrabold tracking-tight text-white">
                How I Can Help You
              </h3>
            </div>

            {/* 2x2 Services Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              {services.map((srv, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl border border-white/5 bg-white/5 hover:bg-white/10 transition-all duration-300 group hover:border-white/10"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-mono text-xs text-cyan-400 font-bold">
                      0{idx + 1}
                    </span>
                    <h4 className="font-sans font-bold text-sm text-white group-hover:text-cyan-400 transition-colors">
                      {srv.title}
                    </h4>
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed font-sans">
                    {srv.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Bar info */}
          <div className="pt-8 border-t border-white/5 mt-8 flex flex-wrap items-center justify-between gap-4 relative z-10">
            <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest font-bold">
              // Collaboration Ready • Global Delivery
            </p>
            <a
              id="help-cta-contact"
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-4 py-2 rounded-full bg-white hover:bg-gray-100 text-gray-950 text-xs font-bold transition-all shadow-md inline-flex items-center gap-1 hover:scale-105"
            >
              <span>Get in Touch</span>
              <Zap size={11} className="text-yellow-500 fill-yellow-500" />
            </a>
          </div>

        </div>

      </div>
    </section>
  );
}
