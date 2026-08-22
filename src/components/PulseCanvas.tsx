import React, { useEffect, useRef } from 'react';

export const PulseCanvas: React.FC<{ activeEmployees?: number }> = ({ activeEmployees = 1248 }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let time = 0;

    const resize = () => {
      if (!canvas) return;
      canvas.width = canvas.parentElement?.clientWidth || 800;
      canvas.height = canvas.parentElement?.clientHeight || 220;
    };

    window.addEventListener('resize', resize);
    resize();

    const draw = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const w = canvas.width;
      const h = canvas.height;
      const centerY = h / 2;

      // Draw faint background grid
      ctx.strokeStyle = 'rgba(70, 69, 84, 0.15)';
      ctx.lineWidth = 1;
      const gridSize = 30;
      for (let x = 0; x < w; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Draw active attendance pulse wave
      ctx.beginPath();
      const points: { x: number; y: number }[] = [];

      for (let x = 0; x <= w; x += 3) {
        const progress = x / w;
        // heartbeat pulse packet moving across
        const pulsePos = (time * 0.25) % 1.2 - 0.1;
        const distFromPulse = Math.abs(progress - pulsePos);
        const spike = Math.exp(-distFromPulse * 28) * Math.sin((progress - pulsePos) * 60) * (h * 0.42);

        // subtle base wave
        const baseSine = Math.sin(progress * 8 - time * 1.5) * 6 + Math.sin(progress * 16 + time) * 3;

        const y = centerY + spike + baseSine;
        points.push({ x, y });

        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }

      // Glow backdrop
      ctx.strokeStyle = 'rgba(76, 215, 246, 0.25)';
      ctx.lineWidth = 6;
      ctx.stroke();

      // Sharp glowing primary line
      ctx.strokeStyle = '#4cd7f6';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Draw glowing pulse dot at the peak
      const currentPulseProgress = (time * 0.25) % 1.2 - 0.1;
      if (currentPulseProgress >= 0 && currentPulseProgress <= 1) {
        const dotX = currentPulseProgress * w;
        const dotIndex = Math.min(Math.floor(dotX / 3), points.length - 1);
        const dotY = points[dotIndex] ? points[dotIndex].y : centerY;

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(dotX, dotY, 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = 'rgba(192, 193, 255, 0.8)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(dotX, dotY, 9 + Math.sin(time * 6) * 3, 0, Math.PI * 2);
        ctx.stroke();
      }

      time += 0.035;
      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animId);
    };
  }, [activeEmployees]);

  return <canvas ref={canvasRef} className="w-full h-full block" />;
};
