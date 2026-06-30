import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Gamepad2, Trophy, RefreshCw, Star, Play, Pause, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Sparkles, Terminal, Volume2, VolumeX, ShieldCheck } from 'lucide-react';

interface SnakeSegment {
  x: number;
  y: number;
}

interface PickableSkill {
  name: string;
  symbol: string;
  color: string;
  points: number;
  levelRequired: number;
}

interface LeaderboardEntry {
  name: string;
  score: number;
  levelName: string;
  date: string;
}

const COLLECTIBLE_SKILLS: PickableSkill[] = [
  { name: 'JavaScript', symbol: 'JS', color: '#f7df1e', points: 50, levelRequired: 1 },
  { name: 'HTML5', symbol: 'HTML', color: '#e34f26', points: 30, levelRequired: 1 },
  { name: 'CSS3', symbol: 'CSS', color: '#1572b6', points: 30, levelRequired: 1 },
  { name: 'React', symbol: '⚛', color: '#61dafb', points: 100, levelRequired: 2 },
  { name: 'TypeScript', symbol: 'TS', color: '#3178c6', points: 120, levelRequired: 2 },
  { name: 'Tailwind', symbol: 'TW', color: '#38b2ac', points: 80, levelRequired: 2 },
  { name: 'Supabase', symbol: '⚡', color: '#3ecf8e', points: 150, levelRequired: 3 },
  { name: 'APIs', symbol: 'REST', color: '#9f7aea', points: 110, levelRequired: 3 },
  { name: 'Databases', symbol: 'SQL', color: '#ecc94b', points: 140, levelRequired: 3 },
  { name: 'AI Models', symbol: '🤖', color: '#a78bfa', points: 250, levelRequired: 4 },
  { name: 'Automation', symbol: 'AUTO', color: '#f472b6', points: 180, levelRequired: 4 },
  { name: 'Machine Learning', symbol: 'ML', color: '#22d3ee', points: 220, levelRequired: 4 }
];

export default function KeptonCodeSnake({ darkMode }: { darkMode: boolean }) {
  // Grid config
  const GRID_SIZE = 20; // 20x20 grid cells
  const CELL_COUNT = 20;
  
  // Game state
  const [snake, setSnake] = useState<SnakeSegment[]>([
    { x: 10, y: 10 },
    { x: 10, y: 11 },
    { x: 10, y: 12 }
  ]);
  const [direction, setDirection] = useState<string>('UP');
  const [nextDir, setNextDir] = useState<string>('UP');
  const [food, setFood] = useState<SnakeSegment>({ x: 5, y: 5 });
  const [activeSkill, setActiveSkill] = useState<PickableSkill>(COLLECTIBLE_SKILLS[0]);
  const [score, setScore] = useState<number>(0);
  const [skillsCollected, setSkillsCollected] = useState<string[]>([]);
  const [currentLevelName, setCurrentLevelName] = useState<string>('Frontend Explorer');
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isStarted, setIsStarted] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  
  // High scores leaderboard
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [playerName, setPlayerName] = useState<string>('');
  const [scoreSaved, setScoreSaved] = useState<boolean>(false);
  
  // Easter eggs
  const [keptonMode, setKeptonMode] = useState<boolean>(false);
  const keystrokeHistory = useRef<string[]>([]);

  // Canvas context reference
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const gameIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Easter egg keyboard listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Monitor arrow/WASD inputs for directional changes to prevent window scrolling
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd'].includes(e.key.toLowerCase()) && isStarted && !isPaused) {
        e.preventDefault();
      }

      // Direction keys
      const key = e.key.toLowerCase();
      if ((key === 'arrowup' || key === 'w') && direction !== 'DOWN') setNextDir('UP');
      if ((key === 'arrowdown' || key === 's') && direction !== 'UP') setNextDir('DOWN');
      if ((key === 'arrowleft' || key === 'a') && direction !== 'RIGHT') setNextDir('LEFT');
      if ((key === 'arrowright' || key === 'd') && direction !== 'LEFT') setNextDir('RIGHT');

      // Easter egg track: "KEPTON"
      keystrokeHistory.current.push(e.key.toUpperCase());
      if (keystrokeHistory.current.length > 20) {
        keystrokeHistory.current.shift();
      }
      const codeStr = keystrokeHistory.current.join('');
      if (codeStr.includes('KEPTON')) {
        setKeptonMode(true);
        setScore(prev => prev + 1000);
        setSkillsCollected(prev => [...new Set([...prev, 'C++', 'AI Master', 'Cloud Shell'])]);
        keystrokeHistory.current = []; // Reset
        setTimeout(() => setKeptonMode(false), 5000);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [direction, isStarted, isPaused]);

  // Load High Scores
  useEffect(() => {
    const saved = localStorage.getItem('kepton_snake_leaderboard');
    if (saved) {
      setLeaderboard(JSON.parse(saved));
    } else {
      const defaultHighs: LeaderboardEntry[] = [
        { name: 'Kepton', score: 9500, levelName: 'AI Developer', date: '2026-06-25' },
        { name: 'BetaTester', score: 3200, levelName: 'Full Stack Developer', date: '2026-06-24' },
        { name: 'Sarah Apex', score: 1850, levelName: 'Frontend Engineer', date: '2026-06-23' },
        { name: 'Visitor-01', score: 650, levelName: 'Frontend Explorer', date: '2026-06-22' }
      ];
      localStorage.setItem('kepton_snake_leaderboard', JSON.stringify(defaultHighs));
      setLeaderboard(defaultHighs);
    }
  }, []);

  // Set level names according to score points
  useEffect(() => {
    if (score < 500) {
      setCurrentLevelName('Frontend Explorer');
    } else if (score < 1200) {
      setCurrentLevelName('Frontend Engineer');
    } else if (score < 2500) {
      setCurrentLevelName('Full Stack Developer');
    } else {
      setCurrentLevelName('AI Developer');
    }
  }, [score]);

  // Spawn food helper
  const spawnFood = (currentSnake: SnakeSegment[]) => {
    let newFood: SnakeSegment;
    let collision: boolean;
    
    // Pick skill matching level limits
    let levelIndex = 1;
    if (score >= 2500) levelIndex = 4;
    else if (score >= 1200) levelIndex = 3;
    else if (score >= 500) levelIndex = 2;

    const matchedSkills = COLLECTIBLE_SKILLS.filter(s => s.levelRequired <= levelIndex);
    const selected = matchedSkills[Math.floor(Math.random() * matchedSkills.length)];
    setActiveSkill(selected);

    do {
      collision = false;
      newFood = {
        x: Math.floor(Math.random() * CELL_COUNT),
        y: Math.floor(Math.random() * CELL_COUNT)
      };
      
      // Ensure food doesn't spawn inside snake body
      for (const segment of currentSnake) {
        if (segment.x === newFood.x && segment.y === newFood.y) {
          collision = true;
          break;
        }
      }
    } while (collision);

    setFood(newFood);
  };

  // Start game process
  const startGame = () => {
    setSnake([
      { x: 10, y: 10 },
      { x: 10, y: 11 },
      { x: 10, y: 12 }
    ]);
    setDirection('UP');
    setNextDir('UP');
    setScore(0);
    setSkillsCollected([]);
    setIsGameOver(false);
    setIsPaused(false);
    setScoreSaved(false);
    setIsStarted(true);
    spawnFood([{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }]);
  };

  // Main game tick update
  const gameLoop = () => {
    if (isGameOver || isPaused || !isStarted) return;

    setSnake((prevSnake) => {
      const currentDir = nextDir;
      setDirection(currentDir);
      
      const head = { ...prevSnake[0] };

      if (currentDir === 'UP') head.y -= 1;
      else if (currentDir === 'DOWN') head.y += 1;
      else if (currentDir === 'LEFT') head.x -= 1;
      else if (currentDir === 'RIGHT') head.x += 1;

      // Wrap-around grid borders (or standard collision, let's do wrapping for a smoother modern UX, but self-collision is game over!)
      if (head.x < 0) head.x = CELL_COUNT - 1;
      if (head.x >= CELL_COUNT) head.x = 0;
      if (head.y < 0) head.y = CELL_COUNT - 1;
      if (head.y >= CELL_COUNT) head.y = 0;

      // Self-collision detection
      for (let i = 1; i < prevSnake.length; i++) {
        if (prevSnake[i].x === head.x && prevSnake[i].y === head.y) {
          setIsGameOver(true);
          return prevSnake;
        }
      }

      const newSnake = [head, ...prevSnake];

      // Eat food
      if (head.x === food.x && head.y === food.y) {
        setScore(prev => prev + activeSkill.points);
        setSkillsCollected(prev => [...new Set([...prev, activeSkill.name])]);
        spawnFood(newSnake);
      } else {
        newSnake.pop(); // Remove tail
      }

      return newSnake;
    });
  };

  // Manage interval timings based on scoring (gradually increases speed!)
  useEffect(() => {
    if (isStarted && !isPaused && !isGameOver) {
      // Speed starts fast but increases dynamically with level
      const baseSpeed = 120;
      const speedModifier = Math.min(score / 50, 45); // Limit max speed cap
      const currentSpeed = baseSpeed - speedModifier;

      gameIntervalRef.current = setInterval(gameLoop, currentSpeed);
    }

    return () => {
      if (gameIntervalRef.current) clearInterval(gameIntervalRef.current);
    };
  }, [isStarted, isPaused, isGameOver, nextDir, food, activeSkill, score]);

  // Render game frame elements onto HTML Canvas API
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Grid Cell size dimensions
    const cellW = canvas.width / CELL_COUNT;
    const cellH = canvas.height / CELL_COUNT;

    // Draw background matrix dots
    ctx.fillStyle = darkMode ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.015)';
    for (let i = 0; i < CELL_COUNT; i++) {
      for (let j = 0; j < CELL_COUNT; j++) {
        ctx.beginPath();
        ctx.arc(i * cellW + cellW / 2, j * cellH + cellH / 2, 1.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Draw Skill Food block with glowing circles
    const fx = food.x * cellW;
    const fy = food.y * cellH;
    
    // Outer glow
    ctx.shadowBlur = 10;
    ctx.shadowColor = activeSkill.color;
    ctx.fillStyle = activeSkill.color;
    
    // Draw rounded skill target node
    ctx.beginPath();
    ctx.arc(fx + cellW / 2, fy + cellH / 2, cellW / 2.2, 0, Math.PI * 2);
    ctx.fill();

    // Inner symbol
    ctx.shadowBlur = 0; // reset
    ctx.fillStyle = '#030712'; // dark center
    ctx.font = 'bold 9px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(activeSkill.symbol[0], fx + cellW / 2, fy + cellH / 2);

    // Draw snake body segments
    snake.forEach((segment, idx) => {
      const sx = segment.x * cellW;
      const sy = segment.y * cellH;

      ctx.shadowBlur = idx === 0 ? 8 : 2;
      ctx.shadowColor = keptonMode ? '#f472b6' : '#06b6d4';
      
      // Color gradient head-to-tail
      if (idx === 0) {
        ctx.fillStyle = keptonMode ? '#f472b6' : '#22d3ee'; // bright cyan head
      } else {
        const factor = idx / snake.length;
        ctx.fillStyle = keptonMode
          ? `rgba(244, 114, 182, ${1 - factor * 0.7})`
          : `rgba(139, 92, 246, ${1 - factor * 0.7})`; // deep violet tail
      }

      // Draw segment with rounded corners
      ctx.beginPath();
      ctx.roundRect(sx + 1, sy + 1, cellW - 2, cellH - 2, 4);
      ctx.fill();
    });

    // Reset shadow values
    ctx.shadowBlur = 0;
  }, [snake, food, activeSkill, darkMode, keptonMode]);

  // Virtual directional button clicks
  const triggerMobileDir = (dir: string) => {
    if (dir === 'UP' && direction !== 'DOWN') setNextDir('UP');
    if (dir === 'DOWN' && direction !== 'UP') setNextDir('DOWN');
    if (dir === 'LEFT' && direction !== 'RIGHT') setNextDir('LEFT');
    if (dir === 'RIGHT' && direction !== 'LEFT') setNextDir('RIGHT');
  };

  // Submit high score
  const saveHighScore = () => {
    if (!playerName.trim() || scoreSaved) return;

    const newEntry: LeaderboardEntry = {
      name: playerName.trim(),
      score,
      levelName: currentLevelName,
      date: new Date().toISOString().split('T')[0]
    };

    const updated = [...leaderboard, newEntry]
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);

    setLeaderboard(updated);
    localStorage.setItem('kepton_snake_leaderboard', JSON.stringify(updated));
    setScoreSaved(true);
  };

  return (
    <section id="snake-arena-section" className="py-12 relative overflow-hidden">
      {/* Kepton Mode Activation Flash banner */}
      <AnimatePresence>
        {keptonMode && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 bg-gradient-to-r from-pink-500 via-purple-600 to-cyan-500 text-white font-mono px-6 py-3 rounded-2xl shadow-2xl flex flex-col items-center border border-white/20 text-center w-[90%] max-w-md"
          >
            <div className="flex items-center gap-2 font-black text-sm">
              <Sparkles size={16} className="animate-spin text-yellow-300" />
              <span>DEVELOPER MODE UNLOCKED 🚀</span>
            </div>
            <p className="text-[10px] uppercase opacity-90 tracking-widest mt-1">
              AI Systems Online 🤖 Welcome to Kepton's Sandbox
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto px-4 space-y-6">
        {/* Title Group */}
        <div className="text-center space-y-1.5">
          <h3 className="text-2xl md:text-3xl font-sans font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-indigo-500">
            Play With My Code 🎮🐍
          </h3>
          <p className="text-xs text-gray-400 max-w-xl mx-auto leading-relaxed">
            A small interactive experience built to showcase my frontend engineering skills and creativity. Use keyboard arrows or virtual mobile controls to maneuver.
          </p>
        </div>

        {/* Dashboard Grid Arena */}
        <div className={`rounded-3xl border p-5 md:p-6 ${
          darkMode ? 'bg-white/5 border-white/5 backdrop-blur-md shadow-2xl' : 'bg-white border-black/5 shadow-xl'
        } grid grid-cols-1 lg:grid-cols-12 gap-6 items-center`}>
          
          {/* LEFT SIDE: Interactive game board */}
          <div className="lg:col-span-7 flex flex-col items-center space-y-4">
            <div className="flex justify-between w-full max-w-[340px] items-center text-xs font-mono text-gray-400">
              <span className="font-bold flex items-center gap-1">
                <Terminal size={12} className="text-cyan-400" />
                SNAKE ARENA
              </span>
              <div className="flex items-center gap-2">
                <span>SPEED: {120 - Math.min(score / 50, 45)}ms</span>
              </div>
            </div>

            {/* Canvas / Container Wrapper */}
            <div className="relative border border-cyan-500/10 rounded-2xl overflow-hidden bg-gray-950 p-1 shadow-[0_0_30px_rgba(6,182,212,0.05)]">
              <canvas
                id="snake-canvas"
                ref={canvasRef}
                width={340}
                height={340}
                className="block rounded-xl bg-gray-950 max-w-full"
              />

              {/* Startup overlay screen */}
              {!isStarted && (
                <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center p-6 text-center space-y-4">
                  <Gamepad2 size={40} className="text-cyan-400 animate-bounce" />
                  <div className="space-y-1">
                    <h4 className="font-sans font-extrabold text-white text-base">Initialize Code Snake Arena</h4>
                    <p className="text-[10px] text-gray-400 max-w-[260px] font-mono leading-relaxed">
                      Collect glowing technology tokens, level up from Frontend Explorer to AI Architect, and log your high scores!
                    </p>
                  </div>
                  <button
                    id="launch-snake-game-btn"
                    onClick={startGame}
                    className="py-2.5 px-6 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-gray-950 font-sans font-bold text-xs shadow-lg shadow-cyan-400/20 transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Play size={12} />
                    <span>LAUNCH NODE ENGINE</span>
                  </button>
                </div>
              )}

              {/* Game Over Screen */}
              {isStarted && isGameOver && (
                <div className="absolute inset-0 bg-black/95 flex flex-col items-center justify-center p-6 text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center font-bold text-lg animate-pulse">
                    !
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-sans font-extrabold text-red-500 text-sm tracking-wide uppercase">MISSION COMPLETE / SYSTEM FAIL</h4>
                    <p className="text-[10px] text-gray-400 font-mono">You achieved: <strong className="text-cyan-400">{score} XP</strong> at <strong className="text-purple-400">{currentLevelName}</strong></p>
                    <p className="text-[9px] text-gray-500 font-mono">Total skills collected: {skillsCollected.length}</p>
                  </div>

                  {/* Score Save block */}
                  {!scoreSaved ? (
                    <div className="bg-white/5 p-3 rounded-xl border border-white/5 space-y-2 w-full max-w-[260px]">
                      <input
                        id="snake-username-input"
                        type="text"
                        placeholder="Recruiter / Name..."
                        value={playerName}
                        onChange={(e) => setPlayerName(e.target.value)}
                        className="w-full px-3 py-1.5 text-[10px] rounded bg-gray-900 border border-white/10 text-white text-center focus:outline-none focus:border-cyan-400 font-sans"
                      />
                      <button
                        id="save-snake-score-btn"
                        onClick={saveHighScore}
                        disabled={!playerName.trim()}
                        className="w-full py-1 bg-cyan-400 hover:bg-cyan-300 disabled:opacity-50 text-gray-950 font-sans font-bold text-[10px] rounded transition-all cursor-pointer"
                      >
                        LOG SCORE TO TERMINAL
                      </button>
                    </div>
                  ) : (
                    <p className="text-[9px] text-emerald-400 font-mono font-bold">✓ Score persisted successfully</p>
                  )}

                  <div className="flex gap-2 w-full max-w-[260px]">
                    <button
                      id="retry-snake-btn"
                      onClick={startGame}
                      className="flex-1 py-2 bg-purple-500 hover:bg-purple-400 text-white font-sans font-bold text-[10px] rounded-xl cursor-pointer flex items-center justify-center gap-1 shadow-md shadow-purple-500/10"
                    >
                      <RefreshCw size={10} />
                      <span>RETRY SESSION</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Pause overlay Screen */}
              {isStarted && !isGameOver && isPaused && (
                <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center p-6 text-center space-y-2">
                  <Gamepad2 size={24} className="text-yellow-500 animate-pulse" />
                  <h4 className="font-sans font-bold text-white text-sm">SANDBOX INTERRUPT / PAUSED</h4>
                  <button
                    id="resume-snake-btn"
                    onClick={() => setIsPaused(false)}
                    className="py-1.5 px-4 rounded bg-cyan-400 text-gray-950 font-sans font-bold text-[10px]"
                  >
                    RESUME ENGINE
                  </button>
                </div>
              )}
            </div>

            {/* Quick action buttons & pause under canvas */}
            {isStarted && !isGameOver && (
              <div className="flex gap-2.5">
                <button
                  id="snake-pause-btn"
                  onClick={() => setIsPaused(!isPaused)}
                  className="p-1.5 px-3 rounded-lg border border-gray-500/20 text-[10px] font-mono hover:bg-gray-500/10 flex items-center gap-1 cursor-pointer"
                >
                  {isPaused ? <Play size={10} /> : <Pause size={10} />}
                  <span>{isPaused ? 'RESUME' : 'PAUSE'}</span>
                </button>
                <button
                  id="snake-terminate-btn"
                  onClick={() => setIsGameOver(true)}
                  className="p-1.5 px-3 rounded-lg border border-red-500/10 text-[10px] font-mono hover:bg-red-500/10 text-red-400 cursor-pointer"
                >
                  TERMINATE
                </button>
              </div>
            )}

            {/* Mobile Touch Keys Overlay (Visible on smaller screens md:hidden etc) */}
            <div className="md:hidden flex flex-col items-center gap-1.5 pt-2">
              <button
                id="touch-up-btn"
                onClick={() => triggerMobileDir('UP')}
                className="w-10 h-10 rounded-xl bg-gray-500/10 border border-gray-500/15 flex items-center justify-center text-gray-300 active:bg-cyan-500 active:text-gray-950"
              >
                <ArrowUp size={16} />
              </button>
              <div className="flex gap-1.5">
                <button
                  id="touch-left-btn"
                  onClick={() => triggerMobileDir('LEFT')}
                  className="w-10 h-10 rounded-xl bg-gray-500/10 border border-gray-500/15 flex items-center justify-center text-gray-300 active:bg-cyan-500 active:text-gray-950"
                >
                  <ArrowLeft size={16} />
                </button>
                <div className="w-10" />
                <button
                  id="touch-right-btn"
                  onClick={() => triggerMobileDir('RIGHT')}
                  className="w-10 h-10 rounded-xl bg-gray-500/10 border border-gray-500/15 flex items-center justify-center text-gray-300 active:bg-cyan-500 active:text-gray-950"
                >
                  <ArrowRight size={16} />
                </button>
              </div>
              <button
                id="touch-down-btn"
                onClick={() => triggerMobileDir('DOWN')}
                className="w-10 h-10 rounded-xl bg-gray-500/10 border border-gray-500/15 flex items-center justify-center text-gray-300 active:bg-cyan-500 active:text-gray-950"
              >
                <ArrowDown size={16} />
              </button>
            </div>
          </div>

          {/* RIGHT SIDE: Developer statistics panel */}
          <div className="lg:col-span-5 space-y-5">
            {/* Live Scores & Stats Dashboard */}
            <div className="space-y-3">
              <h4 className="font-sans font-extrabold text-sm text-cyan-400 border-b border-gray-500/10 pb-2 flex items-center gap-1.5">
                <Star size={14} className="text-yellow-500" />
                <span>EXPERIENCE & STATS NODE</span>
              </h4>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-500/5 p-3 rounded-2xl border border-gray-500/10">
                  <p className="text-[9px] font-mono text-gray-400 uppercase tracking-wider">Accumulated Score</p>
                  <p className="text-xl font-extrabold text-cyan-400 font-mono mt-0.5">{score} XP</p>
                </div>

                <div className="bg-gray-500/5 p-3 rounded-2xl border border-gray-500/10">
                  <p className="text-[9px] font-mono text-gray-400 uppercase tracking-wider">Developer level</p>
                  <p className="text-[11px] font-bold text-purple-400 truncate mt-1">{currentLevelName}</p>
                </div>
              </div>

              {/* Level Progress indicator details */}
              <div className="bg-gray-500/5 p-3 rounded-2xl border border-gray-500/10 space-y-1.5">
                <div className="flex justify-between text-[10px] font-mono text-gray-400">
                  <span>Leveling Progress Tracker</span>
                  <span>{Math.min(score, 3000)} / 3000 XP</span>
                </div>
                <div className="w-full bg-gray-500/20 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-cyan-400 to-purple-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${Math.min((score / 3000) * 100, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-[8px] font-mono text-gray-500">
                  <span>HTML Explorer (0XP)</span>
                  <span>AI Architect (2.5k+)</span>
                </div>
              </div>
            </div>

            {/* Collected Skills list display */}
            <div className="space-y-2.5">
              <h4 className="font-sans font-extrabold text-xs text-purple-400 uppercase tracking-widest">
                Knowledge Tokens Collected ({skillsCollected.length})
              </h4>
              <div className="flex flex-wrap gap-1.5 max-h-[100px] overflow-y-auto p-1 border border-gray-500/5 rounded-xl">
                {skillsCollected.length === 0 ? (
                  <p className="text-[9px] font-mono text-gray-500 italic">No skills cataloged. Guide snake to target nodes!</p>
                ) : (
                  skillsCollected.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 bg-cyan-400/10 text-cyan-400 border border-cyan-400/20 rounded font-mono text-[9px] font-bold"
                    >
                      ✓ {skill}
                    </span>
                  ))
                )}
              </div>
            </div>

            {/* Leaderboard panel list */}
            <div className="space-y-2.5 border-t border-gray-500/10 pt-4">
              <div className="flex items-center gap-1.5">
                <Trophy size={13} className="text-yellow-500 animate-pulse" />
                <h4 className="font-sans font-extrabold text-xs uppercase tracking-wider">SNAKE HALL OF FAME</h4>
              </div>

              <div className="space-y-1">
                {leaderboard.slice(0, 4).map((user, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center text-[10px] font-mono p-1 px-2.5 rounded bg-gray-500/5 text-gray-400"
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="text-gray-500 font-bold">{idx + 1}.</span>
                      <span className="font-bold text-gray-300">{user.name}</span>
                    </div>
                    <div className="flex gap-2.5">
                      <span>{user.levelName.split(' ')[0]}</span>
                      <strong className="text-cyan-400 font-bold">{user.score} XP</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
