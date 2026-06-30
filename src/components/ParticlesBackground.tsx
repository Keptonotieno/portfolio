/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef } from 'react';

interface ParticlesBackgroundProps {
  darkMode: boolean;
}

export default function ParticlesBackground({ darkMode }: ParticlesBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Particle class
    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        // Slow speed for clean non-distracting movement
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.radius = Math.random() * 2 + 1;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce on boundaries
        if (this.x < 0 || this.x > width) this.vx = -this.vx;
        if (this.y < 0 || this.y > height) this.vy = -this.vy;
      }

      draw(context: CanvasRenderingContext2D) {
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        context.fillStyle = darkMode 
          ? 'rgba(6, 182, 212, 0.4)' // Cyan in dark mode
          : 'rgba(59, 130, 246, 0.2)'; // Blue in light mode
        context.fill();
      }
    }

    // Populate particles
    const particleCount = Math.min(Math.floor((width * height) / 15000), 80);
    const particles: Particle[] = Array.from({ length: particleCount }, () => new Particle());

    // Connection threshold
    const connectionDist = 120;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw cybernet grid lines
      ctx.strokeStyle = darkMode 
        ? 'rgba(255, 255, 255, 0.02)' 
        : 'rgba(0, 0, 0, 0.01)';
      ctx.lineWidth = 1;

      // Draw connection lines
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        p1.update();
        p1.draw(ctx);

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDist) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            const opacity = (1 - dist / connectionDist) * 0.12;
            ctx.strokeStyle = darkMode
              ? `rgba(6, 182, 212, ${opacity})`
              : `rgba(59, 130, 246, ${opacity})`;
            ctx.stroke();
          }
        }
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, [darkMode]);

  return (
    <canvas
      id="particles-canvas"
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
    />
  );
}
