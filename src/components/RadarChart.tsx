import React from 'react';
import { motion } from 'motion/react';

interface RadarChartProps {
  metrics: {
    securityScore: number;
    testCoverage: number;
    performanceGrade: string;
    maintainability: string;
  };
  darkMode: boolean;
}

export default function RadarChart({ metrics, darkMode }: RadarChartProps) {
  // Map metrics to 0-100 scale
  const parsePerformance = (grade: string): number => {
    const clean = grade.trim().toUpperCase();
    if (clean.includes('A+')) return 98;
    if (clean.includes('A-')) return 85;
    if (clean.startsWith('A')) return 92;
    if (clean.startsWith('B')) return 78;
    if (clean.startsWith('C')) return 65;
    return 75;
  };

  const parseMaintainability = (level: string): number => {
    const clean = level.trim().toLowerCase();
    if (clean.includes('excellent')) return 96;
    if (clean.includes('high')) return 86;
    if (clean.includes('medium') || clean.includes('good')) return 75;
    return 70;
  };

  const security = metrics.securityScore;
  const coverage = metrics.testCoverage;
  const performance = parsePerformance(metrics.performanceGrade);
  const maintainability = parseMaintainability(metrics.maintainability);
  // Code quality is represented as the average of security, coverage, performance, and maintainability
  const codeQuality = Math.round((security + coverage + performance + maintainability) / 4);

  const data = [
    { label: 'Security', value: security },
    { label: 'Performance', value: performance },
    { label: 'Maintainability', value: maintainability },
    { label: 'Code Quality', value: codeQuality },
    { label: 'Test Coverage', value: coverage },
  ];

  const size = 300;
  const center = size / 2;
  const radius = 100;
  const totalAxes = data.length;

  // Calculate coordinates for grid lines
  const levels = [25, 50, 75, 100];

  const getCoordinates = (index: number, currentRadius: number) => {
    const angle = (Math.PI * 2 / totalAxes) * index - Math.PI / 2;
    return {
      x: center + currentRadius * Math.cos(angle),
      y: center + currentRadius * Math.sin(angle),
    };
  };

  // Generate grid polygons
  const gridPolygons = levels.map((level) => {
    const points = data.map((_, i) => {
      const { x, y } = getCoordinates(i, radius * (level / 100));
      return `${x},${y}`;
    }).join(' ');
    return { level, points };
  });

  // Calculate user data points
  const dataPoints = data.map((d, i) => {
    const { x, y } = getCoordinates(i, radius * (d.value / 100));
    return { x, y, label: d.label, value: d.value };
  });

  const polygonPointsStr = dataPoints.map(p => `${p.x},${p.y}`).join(' ');

  return (
    <div className="flex flex-col items-center justify-center p-2 rounded-2xl bg-gray-500/5 border border-gray-500/10 backdrop-blur-md relative overflow-hidden group">
      <div className="absolute top-2 left-3 flex items-center gap-1">
        <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
        <span className="text-[9px] font-mono tracking-widest text-gray-400 uppercase font-bold">Metrics Radar</span>
      </div>

      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="mx-auto overflow-visible">
        <defs>
          <radialGradient id="radar-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={darkMode ? '#8b5cf6' : '#a78bfa'} stopOpacity="0.45" />
            <stop offset="70%" stopColor={darkMode ? '#06b6d4' : '#22d3ee'} stopOpacity="0.25" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>
          <filter id="neon-glow-filter" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Concentric grid lines */}
        {gridPolygons.map((gp, idx) => (
          <polygon
            key={idx}
            points={gp.points}
            fill="none"
            stroke={darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}
            strokeWidth="1"
          />
        ))}

        {/* Level indicator labels */}
        {levels.map((level, idx) => {
          const { x, y } = getCoordinates(0, radius * (level / 100));
          return (
            <text
              key={idx}
              x={x + 4}
              y={y + 3}
              className="text-[8px] font-mono fill-gray-500 font-semibold"
              textAnchor="start"
            >
              {level}%
            </text>
          );
        })}

        {/* Axis lines */}
        {data.map((_, i) => {
          const outerPoint = getCoordinates(i, radius);
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={outerPoint.x}
              y2={outerPoint.y}
              stroke={darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}
              strokeDasharray="2,2"
              strokeWidth="1"
            />
          );
        })}

        {/* The radar data polygon with spring animation */}
        <motion.polygon
          points={polygonPointsStr}
          initial={{ opacity: 0, scale: 0.3 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 100, damping: 15 }}
          fill="url(#radar-glow)"
          stroke={darkMode ? '#06b6d4' : '#8b5cf6'}
          strokeWidth="2"
          className="drop-shadow-[0_0_8px_rgba(6,182,212,0.4)]"
        />

        {/* Data points (dots) with hover effects */}
        {dataPoints.map((pt, i) => (
          <g key={i}>
            <circle
              cx={pt.x}
              cy={pt.y}
              r="4"
              className="fill-cyan-400 stroke-white dark:stroke-gray-950 transition-all duration-300 hover:r-6 cursor-pointer"
              style={{ filter: darkMode ? 'drop-shadow(0 0 4px #06b6d4)' : 'none' }}
            />
            {/* Soft inner glow on data points */}
            <circle
              cx={pt.x}
              cy={pt.y}
              r="8"
              className="fill-cyan-400/20 opacity-0 hover:opacity-100 transition-opacity duration-200 cursor-pointer"
            />
          </g>
        ))}

        {/* Axis labels with responsive placement */}
        {dataPoints.map((pt, i) => {
          const labelDistMultiplier = 1.25; // Push labels slightly outwards from vertices
          const labelPos = getCoordinates(i, radius * labelDistMultiplier);
          
          // Adjust y-position slightly to center labels vertically
          let yOffset = 4;
          let textAnchor = "middle";
          
          if (labelPos.x < center - 20) textAnchor = "end";
          else if (labelPos.x > center + 20) textAnchor = "start";
          
          if (labelPos.y < center - 50) yOffset = -2;
          else if (labelPos.y > center + 50) yOffset = 10;

          return (
            <g key={i} className="select-none">
              <text
                x={labelPos.x}
                y={labelPos.y + yOffset}
                textAnchor={textAnchor}
                className="text-[10px] font-sans font-extrabold fill-gray-900 dark:fill-gray-100 tracking-tight"
              >
                {pt.label}
              </text>
              <text
                x={labelPos.x}
                y={labelPos.y + yOffset + 10}
                textAnchor={textAnchor}
                className="text-[9px] font-mono font-bold fill-cyan-400"
              >
                {pt.value}%
              </text>
            </g>
          );
        })}
      </svg>
      
      {/* Legend list below the radar chart */}
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 mt-2 text-[9px] font-mono border-t border-gray-500/10 pt-2 w-full max-w-[260px]">
        {data.map((item, idx) => (
          <div key={idx} className="flex items-center gap-1">
            <span className={`h-1.5 w-1.5 rounded-full ${idx === 0 ? 'bg-cyan-400' : idx === 1 ? 'bg-blue-400' : idx === 2 ? 'bg-indigo-400' : idx === 3 ? 'bg-purple-400' : 'bg-fuchsia-400'}`}></span>
            <span className="text-gray-400 font-medium">{item.label}:</span>
            <span className="font-bold text-gray-200">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
