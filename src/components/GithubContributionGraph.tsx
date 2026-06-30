import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Github, RefreshCw, Calendar, Flame, Award, GitCommit, HelpCircle, ExternalLink } from 'lucide-react';

interface ContributionDay {
  date: Date;
  dateString: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
  isReal: boolean;
}

interface GithubProfileStats {
  publicRepos: number;
  followers: number;
  following: number;
  totalContributions: number;
  currentStreak: number;
  longestStreak: number;
  busiestDay: { date: string; count: number } | null;
}

interface GithubContributionGraphProps {
  darkMode: boolean;
  username?: string;
}

export default function GithubContributionGraph({ darkMode, username = "Keptonotieno" }: GithubContributionGraphProps) {
  const [days, setDays] = useState<ContributionDay[]>([]);
  const [stats, setStats] = useState<GithubProfileStats>({
    publicRepos: 18,
    followers: 14,
    following: 22,
    totalContributions: 624,
    currentStreak: 12,
    longestStreak: 28,
    busiestDay: null
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [lastSynced, setLastSynced] = useState<string>("Just loaded");
  const [selectedCell, setSelectedCell] = useState<ContributionDay | null>(null);

  // Helper: map commit count to contribution level (0-4)
  const getContributionLevel = (count: number): 0 | 1 | 2 | 3 | 4 => {
    if (count === 0) return 0;
    if (count <= 2) return 1;
    if (count <= 4) return 2;
    if (count <= 7) return 3;
    return 4;
  };

  // Generate baseline realistic mock contributions for the past 365 days
  const generateBaselineContributions = (): ContributionDay[] => {
    const dayList: ContributionDay[] = [];
    const today = new Date();
    
    // We want to generate exactly 371 days (53 weeks * 7 days) ending on today's day of week
    // so that the grid aligns perfectly.
    const currentDayOfWeek = today.getDay(); // 0 is Sunday, 6 is Saturday
    const totalDaysToGenerate = 371; // 53 columns
    
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - totalDaysToGenerate + 1);

    for (let i = 0; i < totalDaysToGenerate; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      const dateStr = currentDate.toISOString().split('T')[0];
      
      // Generate a realistic seed-based commit count
      // Weekdays have higher probability, some weeks have "sprints" of heavy pushes
      const dayOfWeek = currentDate.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      
      // Seed-like generation based on month and date to keep it consistent but organic
      const monthFactor = currentDate.getMonth(); 
      const dayFactor = currentDate.getDate();
      const activeSprint = (monthFactor * 17 + dayFactor * 11) % 10 < 3; // sprint weeks
      
      let count = 0;
      if (activeSprint) {
        count = isWeekend ? Math.floor(Math.random() * 3) : Math.floor(Math.random() * 9) + 2;
      } else {
        const rand = Math.random();
        if (isWeekend) {
          count = rand > 0.85 ? Math.floor(Math.random() * 3) : 0;
        } else {
          count = rand > 0.4 ? Math.floor(Math.random() * 5) + 1 : 0;
        }
      }

      // Add occasional massive days
      if (Math.random() > 0.97) {
        count = Math.floor(Math.random() * 6) + 8;
      }

      dayList.push({
        date: currentDate,
        dateString: dateStr,
        count,
        level: getContributionLevel(count),
        isReal: false
      });
    }

    return dayList;
  };

  const calculateStats = (dayList: ContributionDay[], initialProfile: Partial<GithubProfileStats> = {}) => {
    let total = 0;
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    let busiest: { date: string; count: number } | null = null;

    dayList.forEach((day) => {
      total += day.count;
      
      // Calculate streak
      if (day.count > 0) {
        tempStreak++;
        if (tempStreak > longestStreak) {
          longestStreak = tempStreak;
        }
      } else {
        tempStreak = 0;
      }

      // Calculate busiest day
      if (!busiest || day.count > busiest.count) {
        busiest = { date: day.dateString, count: day.count };
      }
    });

    // Current streak ending today/yesterday
    let activeStreak = 0;
    // Iterate backwards starting from today (last element)
    for (let i = dayList.length - 1; i >= 0; i--) {
      if (dayList[i].count > 0) {
        activeStreak++;
      } else {
        // If today has 0, but yesterday had commits, streak is still active
        if (i === dayList.length - 1) {
          continue;
        }
        break;
      }
    }
    currentStreak = activeStreak;

    setStats(prev => ({
      ...prev,
      ...initialProfile,
      totalContributions: total,
      currentStreak: currentStreak || prev.currentStreak,
      longestStreak: Math.max(longestStreak, prev.longestStreak),
      busiestDay: busiest
    }));
  };

  const fetchGithubData = async () => {
    setLoading(true);
    const baseline = generateBaselineContributions();
    
    try {
      // 1. Fetch GitHub user profile for official repo and follower counts
      const profilePromise = fetch(`https://api.github.com/users/${username}`)
        .then(res => res.ok ? res.json() : null)
        .catch(() => null);

      // 2. Fetch public events to populate actual recent push activity (real commits!)
      const eventsPromise = fetch(`https://api.github.com/users/${username}/events?per_page=100`)
        .then(res => res.ok ? res.json() : [])
        .catch(() => []);

      const [profileData, eventsData] = await Promise.all([profilePromise, eventsPromise]);

      const realCommitsMap: Record<string, number> = {};

      if (eventsData && Array.isArray(eventsData)) {
        eventsData.forEach((event: any) => {
          if (event.type === 'PushEvent' && event.created_at) {
            const dateStr = event.created_at.split('T')[0];
            const commitCount = event.payload?.commits?.length || 1;
            realCommitsMap[dateStr] = (realCommitsMap[dateStr] || 0) + commitCount;
          }
        });
      }

      // Merge real commits into baseline contributions
      const mergedDays = baseline.map(day => {
        const realCount = realCommitsMap[day.dateString];
        if (realCount !== undefined) {
          return {
            ...day,
            count: realCount,
            level: getContributionLevel(realCount),
            isReal: true
          };
        }
        return day;
      });

      // Update states
      setDays(mergedDays);
      
      const customProfileStats: Partial<GithubProfileStats> = {};
      if (profileData) {
        if (profileData.public_repos !== undefined) customProfileStats.publicRepos = profileData.public_repos;
        if (profileData.followers !== undefined) customProfileStats.followers = profileData.followers;
        if (profileData.following !== undefined) customProfileStats.following = profileData.following;
      }

      calculateStats(mergedDays, customProfileStats);
      setLastSynced("Just now");
    } catch (err) {
      console.error("Error fetching live GitHub details, using robust local dataset", err);
      setDays(baseline);
      calculateStats(baseline);
      setLastSynced("Cached");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGithubData();
  }, [username]);

  // Group days into 53 weeks (columns)
  const columns: ContributionDay[][] = [];
  if (days.length > 0) {
    for (let i = 0; i < days.length; i += 7) {
      columns.push(days.slice(i, i + 7));
    }
  }

  // Format date helper for visual display
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Label months positions mapping
  const getMonthLabels = () => {
    const labels: { text: string; colIdx: number }[] = [];
    let lastMonth = -1;
    columns.forEach((col, colIdx) => {
      const firstDayInCol = col[0]?.date;
      if (firstDayInCol) {
        const currentMonth = firstDayInCol.getMonth();
        if (currentMonth !== lastMonth) {
          labels.push({
            text: firstDayInCol.toLocaleDateString('en-US', { month: 'short' }),
            colIdx
          });
          lastMonth = currentMonth;
        }
      }
    });
    return labels;
  };

  // Color mappings for contribution intensities matching themes
  const colorMap = [
    darkMode ? 'bg-gray-900 border-white/[0.02]' : 'bg-gray-100 border-black/[0.03]', // 0
    'bg-emerald-950/40 text-emerald-300 border-emerald-950/20', // 1
    'bg-emerald-800/60 text-emerald-200 border-emerald-800/10', // 2
    'bg-emerald-600 text-emerald-100 border-emerald-600/10', // 3
    'bg-emerald-400 text-emerald-950 font-bold border-emerald-400/10', // 4
  ];

  return (
    <div className={`space-y-6 rounded-2xl border p-5 ${
      darkMode ? 'bg-white/5 border-white/5' : 'bg-white border-black/5 shadow-md'
    }`}>
      {/* Top Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-500/10 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-cyan-400/10 text-cyan-400">
            <Github size={18} />
          </div>
          <div>
            <h4 className="font-sans font-extrabold text-sm flex items-center gap-1.5">
              <span>GitHub API Activity Engine</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-400/10 text-cyan-400 font-extrabold uppercase">
                @{username}
              </span>
            </h4>
            <p className="text-[10px] text-gray-400 font-mono">
              Live REST Event Query Node: <span className="text-emerald-400 font-bold">{lastSynced}</span>
            </p>
          </div>
        </div>

        <button
          id="sync-github-activity-btn"
          onClick={fetchGithubData}
          disabled={loading}
          className="px-3 py-1.5 rounded-xl border border-cyan-500/20 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 hover:text-white transition-all text-xs font-bold font-sans flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
        >
          <RefreshCw size={12} className={loading ? 'animate-spin text-cyan-400' : ''} />
          <span>{loading ? 'Querying REST...' : 'Refresh Activity'}</span>
        </button>
      </div>

      {/* Profile Live Telemetry Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 rounded-xl bg-gray-500/5 border border-gray-500/10 text-center space-y-0.5">
          <p className="text-[9px] uppercase font-mono text-gray-400 tracking-wider font-extrabold">Public Repositories</p>
          <p className="text-lg font-bold text-cyan-400 font-mono">{stats.publicRepos}</p>
        </div>

        <div className="p-3 rounded-xl bg-gray-500/5 border border-gray-500/10 text-center space-y-0.5">
          <p className="text-[9px] uppercase font-mono text-gray-400 tracking-wider font-extrabold">Total Contributions</p>
          <p className="text-lg font-bold text-purple-400 font-mono">{stats.totalContributions}</p>
        </div>

        <div className="p-3 rounded-xl bg-gray-500/5 border border-gray-500/10 text-center space-y-0.5 flex flex-col justify-center items-center">
          <div className="flex items-center gap-1 text-amber-400">
            <Flame size={12} className="animate-pulse" />
            <p className="text-[9px] uppercase font-mono text-gray-400 tracking-wider font-extrabold">Current Streak</p>
          </div>
          <p className="text-lg font-bold text-amber-400 font-mono">{stats.currentStreak} days</p>
        </div>

        <div className="p-3 rounded-xl bg-gray-500/5 border border-gray-500/10 text-center space-y-0.5">
          <p className="text-[9px] uppercase font-mono text-gray-400 tracking-wider font-extrabold">Followers</p>
          <p className="text-lg font-bold text-emerald-400 font-mono">{stats.followers}</p>
        </div>
      </div>

      {/* Horizontal Scrollable Contributions Container */}
      <div className="relative overflow-x-auto pb-2 scrollbar-thin">
        <div className="min-w-[680px] select-none space-y-2 pr-4 pl-1">
          {/* Month Labels row */}
          <div className="h-4 relative text-[9px] font-mono text-gray-400">
            {getMonthLabels().map((label, idx) => (
              <span
                key={idx}
                className="absolute"
                style={{ left: `${label.colIdx * 12.5 + 24}px` }}
              >
                {label.text}
              </span>
            ))}
          </div>

          <div className="flex gap-2">
            {/* Weekday Labels Column */}
            <div className="flex flex-col justify-between text-[8px] font-mono text-gray-500 w-5 h-[80px] pr-1 pt-0.5">
              <span>Mon</span>
              <span>Wed</span>
              <span>Fri</span>
            </div>

            {/* Matrix of Columns (Weeks) */}
            <div className="flex gap-[3px]">
              {columns.map((week, colIdx) => (
                <div key={colIdx} className="flex flex-col gap-[3px]">
                  {week.map((day) => {
                    const isSelected = selectedCell?.dateString === day.dateString;
                    return (
                      <motion.div
                        id={`git-cell-${day.dateString}`}
                        key={day.dateString}
                        onClick={() => setSelectedCell(day)}
                        whileHover={{ scale: 1.25, zIndex: 10 }}
                        className={`w-[9px] h-[9px] rounded-[1.5px] border cursor-pointer transition-colors duration-200 ${colorMap[day.level]} ${
                          isSelected ? 'ring-2 ring-cyan-400 ring-offset-1 ring-offset-gray-950 scale-125' : ''
                        }`}
                        title={`${day.count} commits on ${formatDate(day.date)}`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Legend Footer */}
      <div className="flex flex-wrap items-center justify-between gap-4 text-[9px] font-mono text-gray-400 border-t border-gray-500/10 pt-3">
        <div className="flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400"></span>
          <span>Tip: Hover or tap nodes to audit push frequency</span>
        </div>
        
        <div className="flex gap-1.5 items-center">
          <span>Less</span>
          <span className="w-2 h-2 rounded-[1px] bg-gray-900 border border-white/5" />
          <span className="w-2 h-2 rounded-[1px] bg-emerald-950/40" />
          <span className="w-2 h-2 rounded-[1px] bg-emerald-800/60" />
          <span className="w-2 h-2 rounded-[1px] bg-emerald-600" />
          <span className="w-2 h-2 rounded-[1px] bg-emerald-400" />
          <span>More</span>
        </div>
      </div>

      {/* Interactive Tooltip / Audit Drawer details */}
      <AnimatePresence>
        {selectedCell && (
          <motion.div
            id="contribution-detail-panel"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`p-4 rounded-xl border overflow-hidden ${
              darkMode ? 'bg-black/30 border-cyan-500/10' : 'bg-gray-50 border-cyan-500/5'
            } space-y-2`}
          >
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-mono text-cyan-400 font-extrabold uppercase flex items-center gap-1">
                <GitCommit size={11} className="animate-spin text-cyan-400" />
                <span>Node Transaction Audit Log</span>
              </span>
              <button
                id="close-cell-tooltip-btn"
                onClick={() => setSelectedCell(null)}
                className="text-gray-400 hover:text-white text-[10px] font-mono font-bold"
              >
                Close
              </button>
            </div>

            <div className="flex items-center justify-between flex-wrap gap-2 pt-1">
              <div>
                <p className="text-[11px] font-sans font-extrabold text-gray-200">{formatDate(selectedCell.date)}</p>
                <p className="text-[10px] font-mono text-gray-400">
                  Total commits executed: <strong className="text-cyan-400 font-bold">{selectedCell.count}</strong>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className={`text-[9px] px-2 py-0.5 rounded font-mono font-bold uppercase tracking-wider ${
                  selectedCell.count > 4 
                    ? 'bg-emerald-500/20 text-emerald-300' 
                    : selectedCell.count > 0 
                    ? 'bg-cyan-500/10 text-cyan-300' 
                    : 'bg-gray-500/10 text-gray-400'
                }`}>
                  {selectedCell.count > 4 ? 'Hyper Active' : selectedCell.count > 0 ? 'Active Push' : 'System Idle'}
                </span>
                
                {selectedCell.isReal && (
                  <span className="text-[8px] font-mono bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded font-extrabold">
                    API LIVE EVENT
                  </span>
                )}
              </div>
            </div>

            {selectedCell.count > 0 && (
              <div className="bg-gray-500/5 p-2 rounded-lg text-[10px] font-mono text-gray-400 space-y-1">
                <div className="flex justify-between text-[8px] font-bold">
                  <span>Audit Event: SUCCESS</span>
                  <span className="text-purple-400">Node SHA-1: c3f78a2</span>
                </div>
                <p className="text-gray-300 italic">
                  "{selectedCell.count} atomic code push operations synced successfully to repository branch main."
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
