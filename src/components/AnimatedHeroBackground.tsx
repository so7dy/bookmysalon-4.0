import { useEffect, useRef } from "react";

export default function AnimatedHeroBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const setCanvasSize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.offsetWidth;
        canvas.height = parent.offsetHeight;
      }
    };

    setCanvasSize();
    window.addEventListener("resize", setCanvasSize);

    let animationId: number;
    let time = 0;

    // Create audio bars configuration
    const barCount = 60;
    const bars: { height: number; targetHeight: number; speed: number; phase: number }[] = [];
    
    // Initialize bars with random properties
    for (let i = 0; i < barCount; i++) {
      bars.push({
        height: Math.random() * 0.3 + 0.1,
        targetHeight: Math.random() * 0.8 + 0.2,
        speed: Math.random() * 0.02 + 0.01,
        phase: Math.random() * Math.PI * 2
      });
    }

    const animate = () => {
      time += 0.03;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const barWidth = canvas.width / barCount;
      const maxHeight = canvas.height * 0.7;
      const minHeight = canvas.height * 0.05;

      // Update and draw each bar
      for (let i = 0; i < barCount; i++) {
        const bar = bars[i];
        
        // Create smooth, organic movement using sine waves
        const wave1 = Math.sin(time + bar.phase) * 0.3;
        const wave2 = Math.sin(time * 1.5 + bar.phase + i * 0.1) * 0.2;
        const wave3 = Math.sin(time * 0.8 + bar.phase - i * 0.05) * 0.15;
        
        // Calculate target height with organic variation
        bar.targetHeight = 0.3 + wave1 + wave2 + wave3;
        bar.targetHeight = Math.max(0.1, Math.min(0.95, bar.targetHeight));
        
        // Smooth interpolation toward target
        bar.height += (bar.targetHeight - bar.height) * bar.speed;
        
        const barHeight = minHeight + (maxHeight - minHeight) * bar.height;
        const x = i * barWidth;
        const y = (canvas.height - barHeight) / 2;

        // Create gradient for each bar
        const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
        
        // Vary opacity based on position for depth effect
        const centerDistance = Math.abs(i - barCount / 2) / (barCount / 2);
        const baseOpacity = 0.3 - centerDistance * 0.15;
        
        gradient.addColorStop(0, `rgba(151, 249, 27, ${baseOpacity * 0.3})`);
        gradient.addColorStop(0.5, `rgba(151, 249, 27, ${baseOpacity})`);
        gradient.addColorStop(1, `rgba(151, 249, 27, ${baseOpacity * 0.3})`);

        // Draw the bar with rounded corners
        const barPadding = barWidth * 0.2;
        const barX = x + barPadding;
        const barActualWidth = barWidth - barPadding * 2;
        const cornerRadius = barActualWidth / 2;

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(barX, y, barActualWidth, barHeight, cornerRadius);
        ctx.fill();

        // Add a subtle glow effect to taller bars
        if (bar.height > 0.6) {
          ctx.shadowBlur = 15;
          ctx.shadowColor = `rgba(151, 249, 27, ${(bar.height - 0.6) * 0.5})`;
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.roundRect(barX, y, barActualWidth, barHeight, cornerRadius);
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }

      // Add subtle waveform overlay in the center
      ctx.globalAlpha = 0.15;
      ctx.beginPath();
      const centerY = canvas.height / 2;
      
      for (let x = 0; x <= canvas.width; x += 3) {
        const progress = x / canvas.width;
        const wave = Math.sin(progress * Math.PI * 4 + time * 2) * 30;
        const y = centerY + wave;
        
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      
      ctx.strokeStyle = "rgba(151, 249, 27, 0.8)";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.globalAlpha = 1;

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", setCanvasSize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 1 }}
    />
  );
}
