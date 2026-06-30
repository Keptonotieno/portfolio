import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Brain, Star, Clock, Trophy, RefreshCw, Share2, Sparkles, Flame, CheckCircle2, AlertTriangle, ArrowRight, BookOpen, ShieldAlert, Cpu } from 'lucide-react';

interface Question {
  id: string;
  question: string;
  category: 'Frontend' | 'Backend' | 'Languages' | 'AI' | 'Software Engineering' | 'Cybersecurity';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  options: string[];
  answer: string;
  explanation: string;
}

interface LeaderboardEntry {
  name: string;
  score: number;
  rank: string;
  date: string;
}

const QUESTION_BANK: Question[] = [
  // --- FRONTEND ---
  {
    id: 'fe-1',
    question: 'What is the main purpose of React?',
    category: 'Frontend',
    difficulty: 'Beginner',
    options: ['Database management', 'Building user interfaces', 'Operating systems', 'Network configuration'],
    answer: 'Building user interfaces',
    explanation: 'React is a component-based frontend library developed by Meta specifically for creating dynamic and interactive user interfaces.'
  },
  {
    id: 'fe-2',
    question: 'What is the Virtual DOM in React?',
    category: 'Frontend',
    difficulty: 'Intermediate',
    options: ['A direct replica of the actual HTML page', 'An in-memory lightweight representation of the real DOM', 'A server-side rendering frame', 'A web-standard database module'],
    answer: 'An in-memory lightweight representation of the real DOM',
    explanation: 'The Virtual DOM is a representation that React keeps in memory, allowing it to efficiently calculate and batch UI updates (diffing) before committing them to the real DOM.'
  },
  {
    id: 'fe-3',
    question: 'Which CSS property is used to create a responsive flex layout?',
    category: 'Frontend',
    difficulty: 'Beginner',
    options: ['display: flex', 'float: left', 'position: absolute', 'align-content: stretch'],
    answer: 'display: flex',
    explanation: 'Setting display to flex turns the element into a flex container, which allows aligning and distributing space among items dynamically.'
  },
  {
    id: 'fe-4',
    question: 'What does the React hook useCallback do?',
    category: 'Frontend',
    difficulty: 'Advanced',
    options: ['Memoizes a computed value', 'Memoizes a callback function instance', 'Triggers server-side fetching', 'Runs cleanups synchronously'],
    answer: 'Memoizes a callback function instance',
    explanation: 'useCallback returns a memoized version of the callback function that only changes if one of the dependencies has changed, preventing useless child re-renders.'
  },
  {
    id: 'fe-5',
    question: 'How do you perform tree shaking in modern bundle architectures?',
    category: 'Frontend',
    difficulty: 'Expert',
    options: ['By using CSS nested modules', 'By using ES Modules (import/export) to remove dead code at compile-time', 'By forcing garbage collection in browser loops', 'By compiling React to native C++ headers'],
    answer: 'By using ES Modules (import/export) to remove dead code at compile-time',
    explanation: 'Tree shaking is a form of dead-code elimination that relies on the static structure of ES2015 module syntax (import and export) to optimize production builds.'
  },

  // --- BACKEND ---
  {
    id: 'be-1',
    question: 'What is Supabase mainly used for?',
    category: 'Backend',
    difficulty: 'Beginner',
    options: ['Image editing', 'Backend services and databases', 'Game development', 'Video rendering'],
    answer: 'Backend services and databases',
    explanation: 'Supabase is an open-source Firebase alternative providing a complete PostgreSQL database, instant REST APIs, user authentication, and real-time subscriptions.'
  },
  {
    id: 'be-2',
    question: 'What is Row Level Security (RLS) in databases?',
    category: 'Backend',
    difficulty: 'Intermediate',
    options: ['Securing physical server hardware rows', 'Limiting table queries strictly to column indices', 'A PostgreSQL feature restricting which database rows are returned based on user status', 'An encryption key for API routes'],
    answer: 'A PostgreSQL feature restricting which database rows are returned based on user status',
    explanation: 'RLS lets you define policy functions that evaluate whether a database user (or authenticated role) has read/write permissions for specific rows in a table.'
  },
  {
    id: 'be-3',
    question: 'What is the standard HTTP status code for a successful resource creation?',
    category: 'Backend',
    difficulty: 'Beginner',
    options: ['200 OK', '201 Created', '404 Not Found', '500 Server Error'],
    answer: '201 Created',
    explanation: 'HTTP status 201 indicates that the request has been fulfilled and has resulted in one or more new resources being created successfully.'
  },
  {
    id: 'be-4',
    question: 'What is a JWT (JSON Web Token) typically used for?',
    category: 'Backend',
    difficulty: 'Intermediate',
    options: ['Storing large image attachments', 'Transmitting secure authenticated claims between client and server', 'Connecting databases', 'Speeding up DNS queries'],
    answer: 'Transmitting secure authenticated claims between client and server',
    explanation: 'JWT is an open standard that allows verifying user sessions and data integrity through compact, digitally-signed JSON structures.'
  },
  {
    id: 'be-5',
    question: 'What is the main benefit of connection pooling in highly active database applications?',
    category: 'Backend',
    difficulty: 'Advanced',
    options: ['It scales up CPU cores automatically', 'It maintains a cache of open reusable connections, avoiding connection establishment overhead', 'It converts SQL schemas to GraphQL schemas', 'It encrypts local storage keys'],
    answer: 'It maintains a cache of open reusable connections, avoiding connection establishment overhead',
    explanation: 'Creating database connections is expensive. Connection pooling keeps a cache of active connections ready to be shared, drastically improving API request throughput.'
  },

  // --- PROGRAMMING LANGUAGES ---
  {
    id: 'pl-1',
    question: 'Which of the following is NOT a primitive data type in JavaScript?',
    category: 'Languages',
    difficulty: 'Beginner',
    options: ['String', 'Boolean', 'Object', 'Number'],
    answer: 'Object',
    explanation: 'Objects are non-primitive (reference types) in JavaScript, whereas Strings, Booleans, Numbers, BigInts, Symbols, null, and undefined are primitive.'
  },
  {
    id: 'pl-2',
    question: 'In C++, what is a pointer?',
    category: 'Languages',
    difficulty: 'Intermediate',
    options: ['A function returning a boolean', 'A variable that stores the physical memory address of another variable', 'A UI component pointing to coordinates', 'A modern thread scheduler'],
    answer: 'A variable that stores the physical memory address of another variable',
    explanation: 'Pointers store the direct memory address of variables, which allows for powerful and high-performance low-level memory operations in C++.'
  },
  {
    id: 'pl-3',
    question: 'What is the Big O complexity of searching a value in a balanced Binary Search Tree (BST)?',
    category: 'Languages',
    difficulty: 'Advanced',
    options: ['O(1)', 'O(n)', 'O(log n)', 'O(n log n)'],
    answer: 'O(log n)',
    explanation: 'A balanced BST halves the search space at each comparison level, leading to an average and worst-case search complexity of logarithmic time, O(log n).'
  },
  {
    id: 'pl-4',
    question: 'How does python handle memory management?',
    category: 'Languages',
    difficulty: 'Intermediate',
    options: ['Manual allocation with malloc and free', 'An automatic Garbage Collector using reference counting and cyclic isolation', 'Strict static allocation during compile-time', 'By outsourcing arrays to C++ runtimes'],
    answer: 'An automatic Garbage Collector using reference counting and cyclic isolation',
    explanation: 'Python uses automatic reference counting for immediate memory reclamation, backed by a generational garbage collector to resolve reference cycles.'
  },
  {
    id: 'pl-5',
    question: 'What does the "this" keyword refer to in a regular JavaScript function?',
    category: 'Languages',
    difficulty: 'Advanced',
    options: ['The global window object always', 'The parent class instance only', 'The object that executed or called the function', 'The closure context array'],
    answer: 'The object that executed or called the function',
    explanation: 'In regular functions, "this" is determined dynamically by how the function is invoked. For arrow functions, it is lexically inherited from the surrounding context.'
  },

  // --- ARTIFICIAL INTELLIGENCE ---
  {
    id: 'ai-1',
    question: 'What does AI stand for?',
    category: 'AI',
    difficulty: 'Beginner',
    options: ['Automated Internet', 'Artificial Intelligence', 'Advanced Integration', 'Application Interface'],
    answer: 'Artificial Intelligence',
    explanation: 'AI stands for Artificial Intelligence—the simulation of human intelligence processes by machines, especially computer systems.'
  },
  {
    id: 'ai-2',
    question: 'What is a Large Language Model (LLM)?',
    category: 'AI',
    difficulty: 'Intermediate',
    options: ['A large database storing HTML code snippets', 'A machine learning system trained on extensive text corpora to understand and predict language sequence', 'A graphic rendering pipeline', 'A security encryption firewall'],
    answer: 'A machine learning system trained on extensive text corpora to understand and predict language sequence',
    explanation: 'LLMs are deep learning networks (typically Transformers) trained on massive textual assets, enabling them to predict contextually correct responses.'
  },
  {
    id: 'ai-3',
    question: 'In AI, what is Retrieval-Augmented Generation (RAG)?',
    category: 'AI',
    difficulty: 'Advanced',
    options: ['Retrieving user passwords using smart models', 'Sourcing contextual information from external data stores to ground an LLM prompt', 'A graphic acceleration module for 3D textures', 'Automatic speech recognition algorithms'],
    answer: 'Sourcing contextual information from external data stores to ground an LLM prompt',
    explanation: 'RAG improves LLM responses by querying custom text documents or search databases first and appending the relevant matches to the prompt context.'
  },
  {
    id: 'ai-4',
    question: 'What is the role of the "temperature" parameter in LLM text generation?',
    category: 'AI',
    difficulty: 'Intermediate',
    options: ['It controls the CPU/GPU thermal limits', 'It regulates the random creativity and diversity of the next token choices', 'It restricts text output lengths', 'It triggers automatic translation modules'],
    answer: 'It regulates the random creativity and diversity of the next token choices',
    explanation: 'A lower temperature (e.g., 0.1) produces deterministic and factual responses, while a higher temperature (e.g., 0.9) increases token randomness and creativity.'
  },

  // --- SOFTWARE ENGINEERING ---
  {
    id: 'se-1',
    question: 'What does CI/CD stand for?',
    category: 'Software Engineering',
    difficulty: 'Beginner',
    options: ['Computer Interface / Coding Design', 'Continuous Integration / Continuous Deployment', 'Controller Integration / Class Development', 'Critical Interface / Cloud Data'],
    answer: 'Continuous Integration / Continuous Deployment',
    explanation: 'CI/CD represents automation workflows that compile, test, and package code merges frequently (CI), and instantly push them to production environments (CD).'
  },
  {
    id: 'se-2',
    question: 'What is the main purpose of writing unit tests?',
    category: 'Software Engineering',
    difficulty: 'Beginner',
    options: ['To increase the final file bundle size', 'To verify that individual isolated blocks of code operate correctly', 'To bypass firewall routers', 'To automate database indexing'],
    answer: 'To verify that individual isolated blocks of code operate correctly',
    explanation: 'Unit tests run assertions against micro-functions or components in absolute isolation, catching syntax or logic bugs before code commits.'
  },
  {
    id: 'se-3',
    question: 'What is a Singleton design pattern?',
    category: 'Software Engineering',
    difficulty: 'Intermediate',
    options: ['A file containing exactly one function', 'A design pattern restricting a class to exactly one single global instance', 'An application running only on one container thread', 'A single-page React app structure'],
    answer: 'A design pattern restricting a class to exactly one single global instance',
    explanation: 'Singleton ensures that a class has only one instance and provides a global access point to it, highly useful for state managers or API loggers.'
  },
  {
    id: 'se-4',
    question: 'Which of the following describes SOLID principles in object-oriented architecture?',
    category: 'Software Engineering',
    difficulty: 'Advanced',
    options: ['Database backup scheduling rules', 'Five core design guidelines to make software more understandable, flexible, and maintainable', 'React hook render lifecycles', 'Encryption standards for web requests'],
    answer: 'Five core design guidelines to make software more understandable, flexible, and maintainable',
    explanation: 'SOLID represents Single Responsibility, Open-Closed, Liskov Substitution, Interface Segregation, and Dependency Inversion guidelines.'
  },

  // --- CYBERSECURITY ---
  {
    id: 'cy-1',
    question: 'What is Cross-Site Scripting (XSS)?',
    category: 'Cybersecurity',
    difficulty: 'Intermediate',
    options: ['Querying database keys across cross-origins', 'Injecting malicious scripts into trusted websites that are then executed by unsuspecting users', 'Server-side buffer overflows', 'A physical hardware port sniffer'],
    answer: 'Injecting malicious scripts into trusted websites that are then executed by unsuspecting users',
    explanation: 'XSS happens when a web app displays user inputs without proper sanitization, allowing attackers to run client-side JS in other users\' browsers.'
  },
  {
    id: 'cy-2',
    question: 'What is the main purpose of HTTPS relative to standard HTTP?',
    category: 'Cybersecurity',
    difficulty: 'Beginner',
    options: ['It serves larger visual assets', 'It encrypts the communication channel between user and server using SSL/TLS', 'It restricts user login domains', 'It increases server CPU speeds'],
    answer: 'It encrypts the communication channel between user and server using SSL/TLS',
    explanation: 'HTTPS encrypts all data packets in transit, preventing attackers on the same network from snooping or modifying communication.'
  },
  {
    id: 'cy-3',
    question: 'What is SQL Injection (SQLi)?',
    category: 'Cybersecurity',
    difficulty: 'Intermediate',
    options: ['Forcing SQL databases to scale up core CPU', 'Executing malicious SQL statements through input forms to hijack backend databases', 'Translating database rows to spreadsheet grids', 'Adding rows to relational tables'],
    answer: 'Executing malicious SQL statements through input forms to hijack backend databases',
    explanation: 'SQL Injection exploits apps that concatenate raw inputs directly into SQL string queries, allowing attackers to access, delete, or modify unauthorized database records.'
  },
  {
    id: 'cy-4',
    question: 'What does Salt refer to in cryptographic password hashing?',
    category: 'Cybersecurity',
    difficulty: 'Advanced',
    options: ['An encryption key stored in local cookie files', 'A random unique string added to a password before hashing to protect against Rainbow Table lookups', 'A physical security hardware USB token', 'A standard compression algorithm'],
    answer: 'A random unique string added to a password before hashing to protect against Rainbow Table lookups',
    explanation: 'Salting ensures that identical passwords hashing on different accounts produce completely distinct cryptographic strings, eliminating dictionary table hacking vectors.'
  }
];

export default function DeveloperIntelligenceTest({ darkMode }: { darkMode: boolean }) {
  // Game states
  const [gameState, setGameState] = useState<'intro' | 'active' | 'completed'>('intro');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'>('Intermediate');
  const [activeDeck, setActiveDeck] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  
  // Scoring
  const [xp, setXp] = useState<number>(0);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [dailyMode, setDailyMode] = useState<boolean>(false);
  
  // Timer
  const [timeLeft, setTimeLeft] = useState<number>(20);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [fastBonusEarned, setFastBonusEarned] = useState<boolean>(false);

  // Leaderboard state
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [playerName, setPlayerName] = useState<string>('');
  const [isScoreSaved, setIsScoreSaved] = useState<boolean>(false);
  
  // Copied alert
  const [copied, setCopied] = useState<boolean>(false);

  // Load Leaderboard on init
  useEffect(() => {
    const saved = localStorage.getItem('kepton_quiz_leaderboard');
    if (saved) {
      setLeaderboard(JSON.parse(saved));
    } else {
      const defaultLeaderboard: LeaderboardEntry[] = [
        { name: 'Kepton (Architect)', score: 9500, rank: 'Engineering Master', date: '2026-06-25' },
        { name: 'Developer Alpha', score: 1400, rank: 'Engineering Master', date: '2026-06-24' },
        { name: 'Sarah Apex', score: 880, rank: 'Software Developer', date: '2026-06-23' },
        { name: 'CodeKnight', score: 480, rank: 'Frontend Explorer', date: '2026-06-22' },
        { name: 'Visitor 03', score: 180, rank: 'Coding Beginner', date: '2026-06-21' }
      ];
      localStorage.setItem('kepton_quiz_leaderboard', JSON.stringify(defaultLeaderboard));
      setLeaderboard(defaultLeaderboard);
    }
  }, []);

  // Timer runner
  useEffect(() => {
    if (gameState === 'active' && !isAnswered) {
      setTimeLeft(20);
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleAnswerSubmit(''); // Time out
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState, currentIndex, isAnswered]);

  // Generate customized game deck
  const startChallenge = (isDaily: boolean = false) => {
    setDailyMode(isDaily);
    
    // Filter by difficulty and optionally category
    let available = QUESTION_BANK;
    if (!isDaily) {
      available = available.filter(q => q.difficulty === selectedDifficulty);
      if (selectedCategory !== 'All') {
        available = available.filter(q => q.category === selectedCategory);
      }
    } else {
      // Daily mode grabs 8 random items seeded by current calendar day
      const dayHash = new Date().getDate();
      available = [...QUESTION_BANK].sort(() => 0.5 - Math.sin(dayHash));
    }

    // Shuffle and pick max 10 questions
    const shuffled = [...available].sort(() => 0.5 - Math.random()).slice(0, 10);
    
    if (shuffled.length === 0) {
      // Fallback if no questions fit filters
      setActiveDeck(QUESTION_BANK.slice(0, 10));
    } else {
      setActiveDeck(shuffled);
    }

    setCurrentIndex(0);
    setXp(0);
    setCorrectCount(0);
    setStreak(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setIsScoreSaved(false);
    setGameState('active');
  };

  const handleAnswerSubmit = (optionSelected: string) => {
    if (isAnswered) return;
    
    if (timerRef.current) clearInterval(timerRef.current);
    
    setSelectedOption(optionSelected);
    setIsAnswered(true);
    
    const currentQuestion = activeDeck[currentIndex];
    const isCorrect = optionSelected === currentQuestion.answer;
    
    if (isCorrect) {
      setCorrectCount(prev => prev + 1);
      setStreak(prev => prev + 1);
      
      // Calculate XP
      let xpEarned = 10;
      // Fast answer bonus (answered in less than 7 seconds)
      const isFast = timeLeft > 13;
      setFastBonusEarned(isFast);
      if (isFast) {
        xpEarned += 5;
      }
      
      // Multiply if Daily mode
      if (dailyMode) {
        xpEarned *= 2;
      }

      setXp(prev => prev + xpEarned);
    } else {
      setStreak(0);
      setFastBonusEarned(false);
    }
  };

  const nextQuestion = () => {
    setSelectedOption(null);
    setIsAnswered(false);
    setFastBonusEarned(false);
    
    if (currentIndex + 1 < activeDeck.length) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setGameState('completed');
    }
  };

  const getRank = (score: number) => {
    if (score < 200) return 'Coding Beginner';
    if (score < 500) return 'Frontend Explorer';
    if (score < 1000) return 'Software Developer';
    return 'Engineering Master';
  };

  const saveScore = () => {
    if (!playerName.trim() || isScoreSaved) return;
    
    const newEntry: LeaderboardEntry = {
      name: playerName.trim(),
      score: xp,
      rank: getRank(xp),
      date: new Date().toISOString().split('T')[0]
    };

    const updated = [...leaderboard, newEntry]
      .sort((a, b) => b.score - a.score)
      .slice(0, 10); // Keep top 10

    setLeaderboard(updated);
    localStorage.setItem('kepton_quiz_leaderboard', JSON.stringify(updated));
    setIsScoreSaved(true);
  };

  const shareResult = () => {
    const text = `🧠 Kepton Developer Intelligence Test Completed!\n🏆 Rank: ${getRank(xp)}\n⚡ XP Earned: ${xp} XP\n📈 Score: ${Math.round((correctCount / activeDeck.length) * 100)}%\nPlay here: ${window.location.href}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Detect dominant category (strength)
  const getDominantCategory = () => {
    return selectedCategory !== 'All' ? selectedCategory : 'Full-Stack Software Engineering';
  };

  return (
    <section id="developer-test-section" className="py-12 relative overflow-hidden">
      {/* Background visual decors */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 space-y-8">
        {/* Title Node */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs font-mono text-purple-400">
            <Brain size={12} className="animate-pulse" />
            <span>Interactive Gamified Platform</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-sans font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-fuchsia-400">
            Kepton Developer Intelligence Test 🧠⚡
          </h2>
          <p className="text-xs md:text-sm text-gray-400 max-w-xl mx-auto leading-relaxed">
            Verify your programming knowledge, secure algorithmic XP, and showcase your developer rank on the live portfolio leaderboard.
          </p>
        </div>

        {/* --- STATE 1: INTRO/SETUP --- */}
        {gameState === 'intro' && (
          <div className={`rounded-3xl border p-6 md:p-8 space-y-6 ${
            darkMode ? 'bg-white/5 border-white/5 backdrop-blur-md shadow-2xl' : 'bg-white border-black/5 shadow-xl'
          }`}>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              {/* Setup column */}
              <div className="md:col-span-7 space-y-5">
                <div className="space-y-1">
                  <h3 className="font-sans font-extrabold text-lg text-cyan-400">Launch Assessment Session</h3>
                  <p className="text-xs text-gray-400">Configure parameters below to load a randomized 10-question challenge deck matching your technical grade.</p>
                </div>

                <div className="space-y-3.5">
                  {/* Select Category */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider font-bold">Technology Core</label>
                    <div className="flex flex-wrap gap-1.5">
                      {['All', 'Frontend', 'Backend', 'Languages', 'AI', 'Software Engineering', 'Cybersecurity'].map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setSelectedCategory(cat)}
                          className={`px-3 py-1 rounded-lg text-xs font-sans font-bold transition-all cursor-pointer ${
                            selectedCategory === cat
                              ? 'bg-purple-500 text-white shadow-md shadow-purple-500/20'
                              : darkMode
                              ? 'bg-white/5 text-gray-400 hover:bg-white/10'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Select Difficulty */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider font-bold">Difficulty Engine</label>
                    <div className="grid grid-cols-4 gap-2">
                      {(['Beginner', 'Intermediate', 'Advanced', 'Expert'] as const).map((diff) => (
                        <button
                          key={diff}
                          onClick={() => setSelectedDifficulty(diff)}
                          className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                            selectedDifficulty === diff
                              ? 'border-cyan-400 bg-cyan-400/10 text-cyan-400 font-extrabold'
                              : darkMode
                              ? 'border-white/5 bg-white/5 text-gray-400 hover:bg-white/10'
                              : 'border-black/5 bg-gray-50 text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          <span className="text-xs font-sans font-bold leading-none">{diff}</span>
                          <span className="text-[8px] font-mono opacity-80 uppercase tracking-tight">
                            {diff === 'Beginner' ? '+10XP' : diff === 'Intermediate' ? '+15XP' : diff === 'Advanced' ? '+20XP' : '+25XP'}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-3">
                  <button
                    id="start-custom-challenge-btn"
                    onClick={() => startChallenge(false)}
                    className="flex-1 py-3 px-5 rounded-2xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-gray-950 font-sans font-extrabold text-sm transition-all shadow-lg shadow-cyan-500/20 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Sparkles size={16} />
                    <span>Initialize Test</span>
                  </button>

                  <button
                    id="start-daily-challenge-btn"
                    onClick={() => startChallenge(true)}
                    className="py-3 px-5 rounded-2xl border border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 hover:text-white transition-all text-xs font-bold font-sans cursor-pointer flex items-center gap-1.5"
                    title="Curated unique deck for today. XP is doubled!"
                  >
                    <Flame size={14} className="text-amber-400 animate-bounce" />
                    <span>Daily Double XP</span>
                  </button>
                </div>
              </div>

              {/* Leaderboard column */}
              <div className="md:col-span-5 space-y-4 border-t md:border-t-0 md:border-l border-gray-500/10 pt-5 md:pt-0 md:pl-6">
                <div className="flex items-center gap-1.5">
                  <Trophy size={16} className="text-yellow-500" />
                  <h4 className="font-sans font-extrabold text-sm uppercase tracking-wider">Top Recruiter Scores</h4>
                </div>

                <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1">
                  {leaderboard.map((user, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center justify-between p-2 rounded-xl text-xs font-mono border ${
                        user.name.includes('Kepton')
                          ? 'bg-purple-500/10 border-purple-500/20 text-purple-300'
                          : darkMode
                          ? 'bg-white/5 border-white/5'
                          : 'bg-gray-50 border-black/5'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-gray-500 text-[10px] w-4">{idx + 1}.</span>
                        <span className="font-bold truncate max-w-[110px]">{user.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[9px] opacity-75">{user.rank.split(' ')[0]}</span>
                        <span className="font-bold text-cyan-400">{user.score} XP</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- STATE 2: ACTIVE CHALLENGE --- */}
        {gameState === 'active' && activeDeck.length > 0 && (() => {
          const q = activeDeck[currentIndex];
          const progressPercent = ((currentIndex + 1) / activeDeck.length) * 100;
          return (
            <div className={`rounded-3xl border p-6 md:p-8 space-y-6 relative overflow-hidden ${
              darkMode ? 'bg-gray-950 border-white/5 shadow-[0_0_50px_rgba(6,182,212,0.1)]' : 'bg-white border-black/5 shadow-2xl'
            }`}>
              {/* Question Info / Streak / Score row */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-500/10 pb-4">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-cyan-400/10 text-cyan-400 font-mono text-[9px] font-bold uppercase tracking-wider">
                    {q.category}
                  </span>
                  <span className={`px-2.5 py-1 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider ${
                    q.difficulty === 'Beginner' ? 'bg-emerald-500/10 text-emerald-400' :
                    q.difficulty === 'Intermediate' ? 'bg-blue-500/10 text-blue-400' :
                    q.difficulty === 'Advanced' ? 'bg-amber-500/10 text-amber-400' : 'bg-red-500/10 text-red-400'
                  }`}>
                    {q.difficulty}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-xs font-mono">
                  {streak >= 2 && (
                    <div className="flex items-center gap-1 text-amber-400">
                      <Flame size={14} className="animate-bounce" />
                      <span className="font-bold">{streak} STREAK</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1 text-gray-400">
                    <Star size={14} className="text-yellow-500" />
                    <span>SCORE: <strong className="text-cyan-400 font-bold">{xp} XP</strong></span>
                  </div>
                </div>
              </div>

              {/* Progress and Timer row */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-[10px] font-mono text-gray-400">
                  <span>Question {currentIndex + 1} of {activeDeck.length}</span>
                  <div className="flex items-center gap-1">
                    <Clock size={11} className={`${timeLeft <= 5 ? 'text-red-400 animate-pulse' : 'text-cyan-400'}`} />
                    <span className={timeLeft <= 5 ? 'text-red-400 font-bold' : 'text-gray-300'}>{timeLeft}s</span>
                  </div>
                </div>
                
                {/* Visual Custom Progress bar */}
                <div className="w-full bg-gray-500/15 h-2 rounded-full overflow-hidden">
                  <motion.div
                    className="bg-gradient-to-r from-cyan-400 via-purple-500 to-fuchsia-500 h-full rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>

              {/* The Question Text */}
              <div className="space-y-3">
                <p className="font-mono text-xs text-gray-400">⚡ QUERY TERMINAL NODE</p>
                <h3 className={`font-sans font-extrabold text-lg sm:text-xl leading-snug ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {q.question}
                </h3>
              </div>

              {/* Options Grid */}
              <div className="grid grid-cols-1 gap-2.5 pt-2">
                {q.options.map((option, idx) => {
                  const letter = String.fromCharCode(65 + idx);
                  const isThisSelected = selectedOption === option;
                  const isCorrectAnswer = option === q.answer;
                  
                  // Styling states
                  let optionClass = darkMode 
                    ? 'border-white/5 bg-white/5 hover:bg-white/10 text-gray-300' 
                    : 'border-black/5 bg-gray-50 hover:bg-gray-100 text-gray-700';
                  
                  if (isAnswered) {
                    if (isCorrectAnswer) {
                      optionClass = 'border-emerald-500 bg-emerald-500/10 text-emerald-400 font-semibold';
                    } else if (isThisSelected) {
                      optionClass = 'border-red-500 bg-red-500/10 text-red-400 font-semibold';
                    } else {
                      optionClass = darkMode ? 'border-white/5 bg-white/5 opacity-40 text-gray-500' : 'border-black/5 bg-gray-50 opacity-40 text-gray-500';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleAnswerSubmit(option)}
                      disabled={isAnswered}
                      className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center gap-3 cursor-pointer ${optionClass}`}
                    >
                      <span className={`w-7 h-7 rounded-lg font-mono text-xs font-extrabold flex items-center justify-center shrink-0 ${
                        isAnswered && isCorrectAnswer
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : isAnswered && isThisSelected
                          ? 'bg-red-500/20 text-red-400'
                          : darkMode
                          ? 'bg-white/10 text-gray-400'
                          : 'bg-gray-200 text-gray-600'
                      }`}>
                        {letter}
                      </span>
                      <span className="text-xs sm:text-sm font-sans font-bold leading-tight">{option}</span>
                      
                      {isAnswered && isCorrectAnswer && (
                        <CheckCircle2 size={16} className="text-emerald-400 ml-auto shrink-0" />
                      )}
                      {isAnswered && isThisSelected && !isCorrectAnswer && (
                        <ShieldAlert size={16} className="text-red-400 ml-auto shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Feedbacks / Explanations / Actions */}
              <AnimatePresence>
                {isAnswered && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4 pt-3 overflow-hidden"
                  >
                    {/* Fast Bonus Toast */}
                    {fastBonusEarned && (
                      <div className="flex items-center gap-1 text-[10px] font-mono text-amber-400 font-extrabold bg-amber-400/10 px-3 py-1 rounded-lg w-fit">
                        <Flame size={11} />
                        <span>FAST ANSWER SPEED BONUS! +5 XP ACCUMULATED</span>
                      </div>
                    )}

                    {/* Explanatory block */}
                    <div className={`p-4 rounded-2xl border text-xs leading-relaxed space-y-2 ${
                      selectedOption === q.answer 
                        ? 'bg-emerald-500/5 border-emerald-500/20 text-gray-300' 
                        : 'bg-red-500/5 border-red-500/20 text-gray-300'
                    }`}>
                      <p className="font-mono text-[10px] text-gray-400 font-extrabold uppercase tracking-wide flex items-center gap-1">
                        <BookOpen size={11} />
                        <span>Technical Explanation & Architecture</span>
                      </p>
                      <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>{q.explanation}</p>
                    </div>

                    <div className="flex justify-end">
                      <button
                        id="next-question-btn"
                        onClick={nextQuestion}
                        className="py-2.5 px-6 bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-400 hover:to-cyan-400 text-white font-sans font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <span>{currentIndex + 1 === activeDeck.length ? 'Show Results' : 'Next Question'}</span>
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })()}

        {/* --- STATE 3: RESULTS & SAVING --- */}
        {gameState === 'completed' && (
          <div className={`rounded-3xl border p-6 md:p-8 space-y-6 ${
            darkMode ? 'bg-white/5 border-white/5' : 'bg-white border-black/5 shadow-2xl'
          }`}>
            <div className="text-center space-y-3 pb-2 border-b border-gray-500/10">
              <span className="text-2xl">🚀</span>
              <h3 className="font-sans font-extrabold text-2xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                Developer Challenge Complete
              </h3>
              <p className="text-xs text-gray-400">Systems synchronized. Assessment results and technical scores calculated successfully.</p>
            </div>

            {/* Matrix details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-gray-500/5 border border-gray-500/10 text-center space-y-1">
                <p className="text-[10px] font-mono uppercase text-gray-400 tracking-wider">Accumulated Score</p>
                <p className="text-2xl font-bold text-cyan-400 font-mono">{xp} XP</p>
                <p className="text-[9px] text-gray-400 font-mono">Rank: {getRank(xp)}</p>
              </div>

              <div className="p-4 rounded-2xl bg-gray-500/5 border border-gray-500/10 text-center space-y-1">
                <p className="text-[10px] font-mono uppercase text-gray-400 tracking-wider">Correct Answers</p>
                <p className="text-2xl font-bold text-purple-400 font-mono">{correctCount} / {activeDeck.length}</p>
                <p className="text-[9px] text-gray-400 font-mono">Accuracy: {Math.round((correctCount / activeDeck.length) * 100)}%</p>
              </div>

              <div className="p-4 rounded-2xl bg-gray-500/5 border border-gray-500/10 text-center space-y-1">
                <p className="text-[10px] font-mono uppercase text-gray-400 tracking-wider">Primary Strength</p>
                <p className="text-base font-bold text-emerald-400 font-sans tracking-tight pt-1 truncate max-w-[180px] mx-auto">
                  {getDominantCategory()}
                </p>
                <p className="text-[9px] text-gray-400 font-mono">Evaluation: Highly Compliant</p>
              </div>
            </div>

            {/* Score Saving Form */}
            {!isScoreSaved ? (
              <div className={`p-5 rounded-2xl border space-y-4 ${
                darkMode ? 'bg-black/30 border-cyan-500/10' : 'bg-gray-50 border-cyan-500/5'
              }`}>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold font-sans text-cyan-400">Log score to Portfolio Leaderboard</h4>
                  <p className="text-[11px] text-gray-400">Save your high-score globally to compare performance with recruiters and developers.</p>
                </div>
                
                <div className="flex gap-2">
                  <input
                    id="recruiter-name-input"
                    type="text"
                    placeholder="Enter Recruiter/Company name..."
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    className="flex-1 px-4 py-2 text-xs rounded-xl bg-gray-500/5 border border-gray-500/15 focus:outline-none focus:border-cyan-400 text-white font-sans"
                  />
                  <button
                    id="submit-score-btn"
                    onClick={saveScore}
                    disabled={!playerName.trim()}
                    className="px-5 py-2.5 bg-cyan-400 hover:bg-cyan-300 disabled:opacity-50 text-gray-950 font-sans font-bold text-xs rounded-xl cursor-pointer"
                  >
                    Save Score
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 p-4 rounded-xl border border-emerald-500/20 w-fit mx-auto">
                <CheckCircle2 size={14} />
                <span>Score logged successfully to database! Check Leaderboard on Setup.</span>
              </div>
            )}

            {/* Bottom Actions */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-gray-500/10 pt-4">
              <button
                id="share-result-btn"
                onClick={shareResult}
                className="px-4 py-2 border border-gray-500/15 hover:border-cyan-500/30 bg-gray-500/5 hover:bg-cyan-500/10 text-gray-300 hover:text-cyan-400 transition-all text-xs font-bold font-sans rounded-xl flex items-center gap-1.5 cursor-pointer"
              >
                <Share2 size={13} />
                <span>{copied ? 'Copied to Clipboard!' : 'Share My Developer Score'}</span>
              </button>

              <button
                id="reset-challenge-btn"
                onClick={() => setGameState('intro')}
                className="px-4 py-2.5 bg-gray-500/10 hover:bg-gray-500/20 border border-gray-500/10 font-sans text-xs font-bold rounded-xl text-gray-300 hover:text-white transition-all cursor-pointer flex items-center gap-1"
              >
                <RefreshCw size={12} />
                <span>Configure New Assessment</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
