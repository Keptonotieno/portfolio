/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Menu, X, Sun, Moon, Database, Shield, Github, Linkedin, MessageSquareCode } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HeaderProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
  adminMode: boolean;
  setAdminMode: (mode: boolean) => void;
  onOpenChat: () => void;
}

export default function Header({
  darkMode,
  toggleDarkMode,
  adminMode,
  setAdminMode,
  onOpenChat
}: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', href: '#hero' },
    { name: 'Ventures', href: '#ventures' },
    { name: 'Projects', href: '#projects' },
    { name: 'Arena', href: '#developer-intelligence' },
    { name: 'Services', href: '#services' },
    { name: 'Blog', href: '#blog' },
  ];

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      <header
        id="navbar-header"
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled
            ? darkMode
              ? 'bg-gray-950/80 backdrop-blur-md border-b border-white/5 py-4'
              : 'bg-white/80 backdrop-blur-md border-b border-black/5 py-4'
            : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between relative">
          {/* Logo */}
          <a
            id="brand-logo"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-2 group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center text-white font-mono font-bold text-sm shadow-md group-hover:scale-105 transition-transform duration-300">
              KO
            </div>
            <div className="flex flex-col">
              <span className={`font-sans font-extrabold text-sm leading-tight ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Kepton Otieno
              </span>
              <span className="font-mono text-[9px] text-cyan-400 font-bold tracking-wider uppercase">
                Full Stack Architect
              </span>
            </div>
          </a>

          {/* Absolute Centered Capsule Pill Navigation (Mockup Style) */}
          <nav id="desktop-nav" className="absolute left-1/2 transform -translate-x-1/2 hidden lg:flex items-center gap-1 px-3 py-1 rounded-full border border-gray-200/60 dark:border-white/10 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md shadow-sm">
            {navItems.map((item) => (
              <a
                key={item.name}
                id={`nav-item-${item.name.toLowerCase()}`}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(item.href);
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold font-sans transition-all hover:bg-gray-100 dark:hover:bg-white/5 ${
                  darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {item.name}
              </a>
            ))}
            <a
              id="nav-item-contact-pill"
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('#contact');
              }}
              className="ml-2 px-4 py-1.5 rounded-full bg-gray-950 dark:bg-white text-white dark:text-gray-950 text-xs font-semibold hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md font-sans"
            >
              Contact
            </a>
          </nav>

          {/* Right utility dashboard */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              id="theme-toggle-btn"
              onClick={toggleDarkMode}
              className={`p-2 rounded-xl transition-all duration-300 border ${
                darkMode
                  ? 'border-white/10 hover:bg-white/5 text-yellow-400 bg-white/5'
                  : 'border-black/10 hover:bg-black/5 text-purple-600 bg-black/5'
              }`}
              aria-label="Toggle Theme"
            >
              {darkMode ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {/* Admin CMS Access */}
            <button
              id="admin-cms-toggle-btn"
              onClick={() => setAdminMode(!adminMode)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-bold font-mono border transition-all duration-300 ${
                adminMode
                  ? 'bg-purple-500/20 border-purple-500/40 text-purple-300'
                  : darkMode
                  ? 'border-white/10 hover:bg-white/5 text-gray-300 bg-white/5'
                  : 'border-black/10 hover:bg-black/5 text-gray-700 bg-black/5'
              }`}
              title="Toggle Content Management Dashboard (CMS)"
            >
              <Database size={12} />
              <span>{adminMode ? 'Exit CMS' : 'Admin CMS'}</span>
            </button>

            {/* AI Assistant Drawer */}
            <button
              id="nav-ai-assistant-btn"
              onClick={onOpenChat}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-cyan-500 to-purple-600 hover:opacity-95 text-white font-sans text-[10px] font-bold rounded-xl shadow-md transition-all duration-300 hover:scale-[1.02]"
            >
              <MessageSquareCode size={12} />
              <span>AI Co-Pilot</span>
            </button>
          </div>

          {/* Mobile Menu Actions */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              id="mobile-theme-toggle"
              onClick={toggleDarkMode}
              className={`p-2 rounded-xl border ${
                darkMode ? 'border-white/10 text-yellow-400 bg-white/5' : 'border-black/10 text-purple-600 bg-black/5'
              }`}
            >
              {darkMode ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 rounded-xl border ${
                darkMode ? 'border-white/10 text-gray-200 bg-white/5' : 'border-black/10 text-gray-800 bg-black/5'
              }`}
            >
              {mobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-menu-drawer"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className={`fixed inset-x-0 top-[72px] z-30 p-6 lg:hidden border-b shadow-xl ${
              darkMode
                ? 'bg-gray-950 border-white/5 text-white'
                : 'bg-white border-black/5 text-gray-900'
            }`}
          >
            <ul className="flex flex-col gap-4 mb-6">
              {navItems.map((item) => (
                <li key={item.name}>
                  <a
                    id={`mobile-nav-${item.name.toLowerCase()}`}
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(item.href);
                    }}
                    className={`block py-1 font-sans text-base font-medium transition-colors ${
                      darkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>

            <div className="flex flex-col gap-3">
              <button
                id="mobile-admin-toggle"
                onClick={() => {
                  setAdminMode(!adminMode);
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center justify-center gap-2 py-3 rounded-xl font-mono text-sm font-semibold border ${
                  adminMode
                    ? 'bg-purple-500/20 border-purple-500/40 text-purple-300'
                    : 'border-dashed border-gray-500/30'
                }`}
              >
                <Database size={16} />
                <span>{adminMode ? 'Exit CMS mode' : 'Enter Admin CMS'}</span>
              </button>

              <button
                id="mobile-chat-toggle"
                onClick={() => {
                  onOpenChat();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-xl font-sans text-sm font-semibold shadow-lg"
              >
                <MessageSquareCode size={16} />
                <span>Talk to AI Co-Pilot</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
