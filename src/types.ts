/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Project {
  id: string;
  name: string;
  description: string;
  image: string;
  technologies: string[];
  role: string;
  githubLink: string;
  liveDemoLink: string;
  category: 'React' | 'AI' | 'Full Stack' | 'Web Applications';
  dateCreated: string;
}

export interface Skill {
  id: string;
  name: string;
  category: 'languages' | 'frontend' | 'css' | 'backend' | 'other';
  rating: number; // 0 to 100
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  level: string;
  duration: string;
  responsibilities: string[];
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  duration: string;
  type: 'Degree' | 'Certification' | 'Course' | 'Technical Training';
}

export interface Testimonial {
  id: string;
  author: string;
  role: string;
  company: string;
  text: string;
  avatar?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  snippet: string;
  content: string;
  date: string;
  category: string;
  readTime: string;
  author: string;
}

export interface ContactRequest {
  id: string;
  name: string;
  email: string;
  message: string;
  date: string;
}

export interface ProjectSyncInfo {
  stars: number;
  forks: number;
  openIssues: number;
  latestCommitMessage: string;
  latestCommitHash: string;
  branch: string;
  lastSynced: string;
  isSyncing: boolean;
  codeQuality: {
    securityScore: number;
    testCoverage: number;
    performanceGrade: string;
    bundleSize: string;
    maintainability: string;
  };
  reviewReport: {
    summary: string;
    strengths: string[];
    improvements: string[];
  };
}

