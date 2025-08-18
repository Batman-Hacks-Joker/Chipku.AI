"use client";
import React, { useEffect, useRef } from "react";
import { createNoise3D } from "simplex-noise";
import { cn } from "@/lib/utils";

interface VortexProps {
  children?: any;
  className?: string;
  containerClassName?: string;
  particleCount?: number;
  rangeY?: number;
  baseHue?: number;
  baseSpeed?: number;
  rangeSpeed?: number;
  baseRadius?: number;
  rangeRadius?: number;
  backgroundColor?: string;
}

const Vortex = (props: VortexProps) => {
  const {
    children,
    className,
    containerClassName,
    particleCount = 700,
    rangeY = 100,
    baseHue = 220,
    baseSpeed = 0.0,
    rangeSpeed = 1.5,
    baseRadius = 1,
    rangeRadius = 2,
    backgroundColor = "#000",
  } = props;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = React.useState({ width: 0, height: 0 });

  const noise3D = createNoise3D();

  class Particle {
    x: number;
    y: number;
    z: number;
    px: number;
    py: number;
    pz: number;
    radius: number;
    speed: number;
    hue: number;
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;

    constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
      this.canvas = canvas;
      this.ctx = context;
      this.x = Math.random() * this.canvas.width;
      this.y = Math.random() * this.canvas.height;
      this.z = Math.random() * this.canvas.width;
      this.px = 0;
      this.py = 0;
      this.pz = 0;
      this.radius = Math.random() * baseRadius + rangeRadius;
      this.speed = Math.random() * baseSpeed + rangeSpeed;
      this.hue = Math.random() * 60 + baseHue;
    }

    update() {
      const { width } = this.canvas;
      this.px = this.x;
      this.py = this.y;
      this.pz = this.z;

      const n = noise3D(this.x / width, this.y / width, this.z / width);
      const a = n * Math.PI * 2;

      this.x += Math.cos(a) * this.speed;
      this.y += Math.sin(a) * this.speed;

      this.hue += 0.1;

      if (this.x < 0 || this.x > width || this.y < 0 || this.y > width) {
        this.x = Math.random() * width;
        this.y = Math.random() * width;
      }
    }

    draw() {
      this.ctx.beginPath();
      this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = `hsla(${this.hue}, 50%, 50%, 0.5)`;
      this.ctx.fill();
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const { width, height } = containerRef.current
        ? (containerRef.current as HTMLElement).getBoundingClientRect()
        : { width: 0, height: 0 };
      setDimensions({ width, height });
      canvas.width = width;
      canvas.height = height;
    };
    resize();
    window.addEventListener("resize", resize);

    const particles = Array.from({ length: particleCount }, () => new Particle(canvas, ctx));

    let rAF: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.update();
        p.draw();
      });

      rAF = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(rAF);
    };
  }, [
    baseHue,
    baseRadius,
    baseSpeed,
    particleCount,
    rangeRadius,
    rangeSpeed,
    rangeY,
    backgroundColor,
    noise3D,
  ]);

  return (
    <div className={cn("relative h-full w-full", containerClassName)} ref={containerRef}>
      <canvas
        className={cn(
          "absolute inset-0 h-full w-full bg-transparent z-0",
          className
        )}
        ref={canvasRef}
      ></canvas>
      <div className="relative z-10">{children}</div>
    </div>
  );
};
export { Vortex };