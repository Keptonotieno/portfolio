/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Mail, Database, Code2, TrendingUp, Users, ArrowUpRight } from 'lucide-react';

interface VenturePortfolioProps {
  darkMode: boolean;
}

export default function VenturePortfolio({ darkMode }: VenturePortfolioProps) {
  const ventures = [
    {
      id: 'v-1',
      name: 'MailFlow.io',
      tag: 'Active',
      tagType: 'success', // green
      description: 'AI-driven email marketing automation for creators. Handles 1M+ emails daily.',
      techStack: 'Next.js • AWS SES • Redis',
      accentColor: 'from-emerald-400 to-teal-500',
      lineColor: 'bg-emerald-500',
      stats: [
        { label: 'Growth', value: '+12%', highlight: true },
        { label: 'MRR', value: 'KSh 546k' }
      ],
      icon: Mail,
      url: '#'
    },
    {
      id: 'v-2',
      name: 'AssetBase',
      tag: 'Scaling',
      tagType: 'purple',
      description: 'Digital Asset Management (DAM) system for remote design teams.',
      techStack: 'React • Firebase • Three.js',
      accentColor: 'from-purple-500 to-indigo-600',
      lineColor: 'bg-purple-600',
      stats: [
        { label: 'Growth', value: '+28%', highlight: true },
        { label: 'MRR', value: 'KSh 884k' }
      ],
      icon: Database,
      url: '#'
    },
    {
      id: 'v-3',
      name: 'SnippetHub',
      tag: 'Beta',
      tagType: 'blue',
      description: 'Marketplace for premium React component blocks and hooks.',
      techStack: 'Astro • Stripe • Supabase',
      accentColor: 'from-blue-400 to-cyan-500',
      lineColor: 'bg-blue-500',
      stats: [
        { label: 'Phase', value: 'Launch', highlight: true },
        { label: 'MRR', value: 'KSh 195k' }
      ],
      icon: Code2,
      url: '#'
    }
  ];

  return (
    <section id="ventures" className="py-24 px-6 relative border-t border-gray-500/10">
      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        
        {/* Header Block with Metrics */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-4 border-b border-gray-500/10">
          <div className="space-y-3">
            <span className="font-mono text-xs text-cyan-400 font-extrabold uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              SaaS Incubator
            </span>
            <h2 className={`text-3xl sm:text-4xl font-sans font-extrabold tracking-tight ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              My Venture Portfolio
            </h2>
            <p className={`text-sm max-w-xl ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              SaaS products I personally architected, launched, and currently scale.
            </p>
          </div>

          {/* Metrics Block from Mockup */}
          <div className="flex flex-wrap items-center gap-6 sm:gap-12 bg-white/5 dark:bg-gray-900/40 p-5 rounded-2xl border border-gray-200/10 dark:border-white/5 backdrop-blur-sm shadow-sm">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <TrendingUp size={16} className="text-emerald-400" />
                <span className={`text-2xl sm:text-3xl font-extrabold font-mono tracking-tight ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  KSh 1.62M
                </span>
              </div>
              <p className="font-mono text-[9px] uppercase text-gray-400 tracking-widest font-bold">
                Monthly Recurring Revenue
              </p>
            </div>
            
            <div className="w-[1px] h-10 bg-gray-500/20" />

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Users size={16} className="text-purple-400" />
                <span className={`text-2xl sm:text-3xl font-extrabold font-mono tracking-tight ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  45k+
                </span>
              </div>
              <p className="font-mono text-[9px] uppercase text-gray-400 tracking-widest font-bold">
                Total Active Users
              </p>
            </div>
          </div>
        </div>

        {/* Venture Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
          {ventures.map((venture) => {
            const IconComponent = venture.icon;
            
            // Tag styling
            let tagClass = 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
            if (venture.tagType === 'purple') {
              tagClass = 'text-purple-500 bg-purple-500/10 border-purple-500/20';
            } else if (venture.tagType === 'blue') {
              tagClass = 'text-blue-500 bg-blue-500/10 border-blue-500/20';
            }

            return (
              <div
                key={venture.id}
                className={`group rounded-3xl p-6 border transition-all duration-300 hover-scale flex flex-col justify-between ${
                  darkMode
                    ? 'bg-gray-900/30 border-white/5 hover:border-white/10 hover:bg-gray-900/50 shadow-2xl'
                    : 'bg-white border-gray-200/60 shadow-lg shadow-gray-100/50 hover:shadow-xl'
                }`}
              >
                <div>
                  {/* Top Bar with Icon and Tag */}
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${venture.accentColor} p-[1px] shadow-md group-hover:scale-105 transition-transform duration-300`}>
                      <div className="w-full h-full rounded-2xl bg-white dark:bg-gray-950 flex items-center justify-center">
                        <IconComponent size={20} className={`${
                          darkMode ? 'text-white' : 'text-gray-900'
                        }`} />
                      </div>
                    </div>
                    
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wider font-mono border uppercase ${tagClass}`}>
                      {venture.tag}
                    </span>
                  </div>

                  {/* Title and Description */}
                  <div className="space-y-3">
                    <h3 className={`text-xl font-extrabold tracking-tight ${
                      darkMode ? 'text-white group-hover:text-cyan-400' : 'text-gray-900 group-hover:text-cyan-600'
                    } transition-colors flex items-center gap-1.5`}>
                      <span>{venture.name}</span>
                      <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </h3>
                    <p className={`text-xs leading-relaxed ${
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {venture.description}
                    </p>
                  </div>
                </div>

                {/* Tech stack and stats */}
                <div className="mt-8 pt-4 border-t border-gray-500/10 space-y-4">
                  {/* Tech Stack Label with underline accent */}
                  <div>
                    <span className="font-mono text-[10px] uppercase text-gray-500 tracking-wider block mb-1">
                      Tech Stack
                    </span>
                    <span className={`font-sans font-semibold text-[11px] ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {venture.techStack}
                    </span>
                    <div className={`h-[2px] w-12 ${venture.lineColor} rounded-full mt-1.5 group-hover:w-20 transition-all duration-500`} />
                  </div>

                  {/* Stats breakdown */}
                  <div className="flex items-center justify-between pt-2">
                    {venture.stats.map((stat, sIdx) => (
                      <div key={sIdx} className="space-y-0.5">
                        <span className="font-mono text-[9px] uppercase text-gray-500 tracking-widest block">
                          {stat.label}
                        </span>
                        <span className={`text-xs font-bold font-mono ${
                          stat.highlight 
                            ? 'text-emerald-500' 
                            : darkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          {stat.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
