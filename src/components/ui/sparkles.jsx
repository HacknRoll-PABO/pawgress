import React, { useEffect, useRef } from "react";

function random(min, max) {
  return Math.random() * (max - min) + min;
}

function createParticle(x, y, ctx, particleColor) {
  const vx = random(-0.5, 0.5);
  const vy = random(-0.5, 0.5);
  const size = random(0.5, 2);
  const life = random(150, 300);
  let currentLife = random(0, life); // Random starting point for more organic feel

  function update() {
    currentLife++;
    if (currentLife >= life) {
      // Reset particle instead of removing it
      currentLife = 0;
      x = random(0, ctx.canvas.width);
      y = random(0, ctx.canvas.height);
      return true;
    }

    // Add slight wobble to movement
    x += vx + Math.sin(currentLife * 0.05) * 0.1;
    y += vy + Math.cos(currentLife * 0.05) * 0.1;

    // Wrap around screen edges
    if (x < 0) x = ctx.canvas.width;
    if (x > ctx.canvas.width) x = 0;
    if (y < 0) y = ctx.canvas.height;
    if (y > ctx.canvas.height) y = 0;

    // Pulsing effect
    const pulseSpeed = 0.05;
    const pulseSize = Math.sin(currentLife * pulseSpeed) * 0.5 + 1;
    const fadeInOut = Math.sin((currentLife / life) * Math.PI);
    const opacity = fadeInOut * 0.8; // Max opacity 0.8 for softer look

    ctx.beginPath();
    ctx.arc(x, y, size * pulseSize, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${particleColor}, ${opacity})`;
    ctx.fill();

    return true;
  }

  return update;
}

export const SparklesCore = ({
  id,
  background,
  minSize,
  maxSize,
  particleDensity,
  particleColor,
  className,
  style,
}) => {
  const canvasRef = useRef(null);
  const particles = useRef([]);
  const animationRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    let width = canvas.offsetWidth;
    let height = canvas.offsetHeight;

    const handleResize = () => {
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width;
      canvas.height = height;

      // Recreate particles on resize
      const numParticles = Math.floor((width * height) / particleDensity);
      particles.current = [];
      for (let i = 0; i < numParticles; i++) {
        const x = random(0, width);
        const y = random(0, height);
        particles.current.push(createParticle(x, y, ctx, particleColor));
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Update all particles
      particles.current.forEach(particle => particle());
      
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [particleColor, particleDensity]);

  return (
    <canvas
      ref={canvasRef}
      id={id}
      style={{
        background,
        width: "100%",
        height: "100%",
        ...style,
      }}
      className={className}
    />
  );
}; 