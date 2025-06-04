"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";

// Helper for random float
function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

// Geometric figure types
const FIGURES = [
  { type: "triangle", count: 10 },
  { type: "square", count: 10 },
  { type: "pentagon", count: 10 },
  { type: "hexagon", count: 10 },
];

export default function Home() {
  const { isAuthenticated, isLoading, profile } = useAuth();
  const router = useRouter();

  // --- Redirect logic (unchanged) ---
  useEffect(() => {
    if (!isLoading && isAuthenticated && profile?.role) {
      if (profile.role === "admin") {
        router.replace("/pages/dashboard/admin");
      } else if (profile.role === "freelancer") {
        router.replace("/pages/dashboard/freelancer");
      } else if (profile.role === "client") {
        router.replace("/pages/dashboard/client");
      }
    }
  }, [isAuthenticated, isLoading, profile, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  if (isAuthenticated) return null;

  // --- Interactive background state ---
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 }); // normalized
  const [figures, setFigures] = useState<any[]>([]);
  const [anvilPos, setAnvilPos] = useState({ x: 0.5, y: 0.8 });
  const [reveal, setReveal] = useState(false);
  const [revealRadius, setRevealRadius] = useState(0);
  const [figureHover, setFigureHover] = useState<{ [id: string]: boolean }>({});
  const [anvilHover, setAnvilHover] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // --- Animate floating figures and anvil ---
  useEffect(() => {
    if (reveal) return; // Stop animation when reveal is true
    let animationId: number;
    let lastTime = performance.now();
    function animate(now: number) {
      const dt = Math.min((now - lastTime) / 16.67, 2); // ~1 for 60fps, cap at 2x
      lastTime = now;
      setFigures((figs) =>
        figs.map((fig) => {
          let x = fig.x + fig.dx * dt;
          let y = fig.y + fig.dy * dt;
          // If out of bounds, respawn at random edge
          if (fig.type !== "anvil") {
            let visible = x > 0.01 && x < 0.99 && y > 0.01 && y < 0.99;
            if (!visible) {
              const edge = Math.floor(Math.random() * 4);
              if (edge === 0) { x = 0.01; y = Math.random() * 0.98 + 0.01; } // left
              if (edge === 1) { x = 0.99; y = Math.random() * 0.98 + 0.01; } // right
              if (edge === 2) { y = 0.01; x = Math.random() * 0.98 + 0.01; } // top
              if (edge === 3) { y = 0.99; x = Math.random() * 0.98 + 0.01; } // bottom
              // new random direction, constant speed
              const angle = Math.random() * 2 * Math.PI;
              const speed = 0.0012;
              return { ...fig, x, y, dx: Math.cos(angle) * speed, dy: Math.sin(angle) * speed };
            }
            return { ...fig, x, y };
          }
          return fig;
        })
      );
      setAnvilPos((prev) => {
        let { x, y, dx, dy } = prev as any;
        if (typeof dx !== "number" || typeof dy !== "number") {
          // Initialize random direction
          const angle = Math.random() * 2 * Math.PI;
          dx = Math.cos(angle) * 0.0012;
          dy = Math.sin(angle) * 0.0012;
        }
        x += dx * dt;
        y += dy * dt;
        // Bounce off borders
        if (x < 0.05) { x = 0.05; dx = -dx; }
        if (x > 0.95) { x = 0.95; dx = -dx; }
        if (y < 0.08) { y = 0.08; dy = -dy; }
        if (y > 0.92) { y = 0.92; dy = -dy; }
        return { x, y, dx, dy };
      });
      animationId = requestAnimationFrame(animate);
    }
    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [reveal]);

  // Generate random positions and directions for figures on mount
  useEffect(() => {
    const newFigures: any[] = [];
    let idx = 0;
    for (const { type, count } of FIGURES) {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * 2 * Math.PI;
        const speed = 0.0012;
        newFigures.push({
          id: `${type}-${i}`,
          type,
          x: randomBetween(0.05, 0.95),
          y: randomBetween(0.1, 0.9),
          size: randomBetween(40, 70),
          angle: randomBetween(0, 360),
          dx: Math.cos(angle) * speed,
          dy: Math.sin(angle) * speed,
        });
        idx++;
      }
    }
    setFigures(newFigures);
    // Initialize anvil floating direction
    setAnvilPos((pos) => {
      const angle = Math.random() * 2 * Math.PI;
      const speed = 0.0012;
      return { ...pos, dx: Math.cos(angle) * speed, dy: Math.sin(angle) * speed };
    });
  }, []);

  // Mouse move handler
  function handleMouseMove(e: React.MouseEvent) {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setMouse({ x, y });
  }

  // --- Anvil reveal animation ---
  useEffect(() => {
    if (!reveal) return;
    let raf: number;
    function animate() {
      setRevealRadius((r) => {
        if (r < 1.5) {
          raf = requestAnimationFrame(animate);
          return r + 0.025;
        } else {
          return 2;
        }
      });
    }
    animate();
    return () => cancelAnimationFrame(raf);
  }, [reveal]);

  // --- Helper: distance between two normalized points ---
  function dist(a: { x: number; y: number }, b: { x: number; y: number }) {
    return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
  }

  // --- Render geometric figures ---
  function renderFigure(fig: any, idx: number) {
    if (fig.type === "anvil") return null;
    // Figure position in %
    const style: React.CSSProperties = {
      position: "absolute",
      left: `${fig.x * 100}%`,
      top: `${fig.y * 100}%`,
      width: fig.size,
      height: fig.size,
      transform: `translate(-50%, -50%) rotate(${fig.angle}deg)`,
      transition: "transform 0.2s, opacity 0.2s",
      zIndex: 1,
      pointerEvents: "auto",
      opacity: (fig.x < 0.01 || fig.x > 0.99 || fig.y < 0.01 || fig.y > 0.99) ? 0 : undefined,
    };
    // Shadow/illumination logic
    let illuminated = false;
    if (reveal) {
      // Reveal radius from anvil
      const d = dist(fig, anvilPos);
      illuminated = d < revealRadius;
    } else {
      // Mouse light radius
      const d = dist(fig, mouse);
      illuminated = d < 0.18;
    }
    // Color
    let color = "#7dd3fc";
    if (fig.type === "square") color = "#fca5a5";
    if (fig.type === "pentagon") color = "#fcd34d";
    if (fig.type === "hexagon") color = "#a7f3d0";
    const hover = !!figureHover[fig.id];
    // SVGs for each shape
    let shapeSvg = null;
    if (fig.type === "triangle") {
      shapeSvg = (
        <svg width={fig.size} height={fig.size} viewBox="0 0 100 100">
          <polygon points="50,10 90,90 10,90" fill={color} />
        </svg>
      );
    } else if (fig.type === "square") {
      shapeSvg = (
        <svg width={fig.size} height={fig.size} viewBox="0 0 100 100">
          <rect x="15" y="15" width="70" height="70" rx="12" fill={color} />
        </svg>
      );
    } else if (fig.type === "pentagon") {
      shapeSvg = (
        <svg width={fig.size} height={fig.size} viewBox="0 0 100 100">
          <polygon points="50,10 90,38 73,85 27,85 10,38" fill={color} />
        </svg>
      );
    } else if (fig.type === "hexagon") {
      shapeSvg = (
        <svg width={fig.size} height={fig.size} viewBox="0 0 100 100">
          <polygon points="50,10 90,35 90,75 50,90 10,75 10,35" fill={color} />
        </svg>
      );
    }
    return (
      <div
        key={fig.id}
        style={{
          ...style,
          opacity: illuminated || hover ? 1 : 0.15,
          filter: illuminated || hover ? "none" : "brightness(0.3) blur(1.5px)",
          transform: `${style.transform} scale(${hover ? 1.15 : 1})`,
        }}
        onMouseEnter={() => setFigureHover((h) => ({ ...h, [fig.id]: true }))}
        onMouseLeave={() => setFigureHover((h) => ({ ...h, [fig.id]: false }))}
      >
        {shapeSvg}
      </div>
    );
  }

  // --- Render anvil ---
  function renderAnvil() {
    // Position in %
    const style: React.CSSProperties = {
      position: "absolute",
      left: `${anvilPos.x * 100}%`,
      top: `${anvilPos.y * 100}%`,
      width: 80,
      height: 80,
      transform: "translate(-50%, -50%)",
      zIndex: 2,
      cursor: reveal ? "default" : "pointer",
      filter: reveal ? "none" : "brightness(0.3) blur(1.5px)",
      opacity: reveal ? 1 : 0.15,
      transition: "filter 0.5s, opacity 0.5s",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    };
    const hover = anvilHover;
    return (
      <div
        style={{
          ...style,
          opacity: reveal || hover ? 1 : 0.15,
          filter: reveal || hover ? "none" : "brightness(0.3) blur(1.5px)",
          transform: `${style.transform} scale(${hover ? 1.12 : 1})`,
        }}
        onMouseEnter={() => setAnvilHover(true)}
        onMouseLeave={() => setAnvilHover(false)}
        onClick={() => {
          if (!reveal) setReveal(true);
        }}
      >
        {/* Use <img> for the anvil SVG */}
        <img src="/assets/anvil_svg.svg" alt="Anvil" width={64} height={64} style={{ display: "block" }} />
      </div>
    );
  }

  // --- Expanding border reveal effect ---
  function renderRevealBorder() {
    if (!reveal) return null;
    // Calculate px position of anvil
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return null;
    const cx = anvilPos.x * rect.width;
    const cy = anvilPos.y * rect.height;
    const maxR = Math.sqrt(rect.width ** 2 + rect.height ** 2);
    const r = revealRadius * maxR;
    return (
      <svg
        className="pointer-events-none fixed inset-0 z-30"
        width={rect.width}
        height={rect.height}
        style={{ left: 0, top: 0, position: "fixed" }}
      >
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="#fff"
          strokeWidth={r < maxR ? 32 : 0}
          style={{ transition: "stroke-width 0.3s" }}
        />
      </svg>
    );
  }

  // --- Dynamic light effect ---
  function renderLightCircle() {
    if (reveal) return null;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return null;
    const cx = mouse.x * rect.width;
    const cy = mouse.y * rect.height;
    // Fixed, smaller light radius
    const lightRadius = 200;
    return (
      <div
        className="pointer-events-none fixed inset-0 z-20"
        style={{ left: 0, top: 0, position: "fixed" }}
      >
        <svg width={rect.width} height={rect.height}>
          <defs>
            <radialGradient id="light" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fff" stopOpacity="0.18" />
              <stop offset="70%" stopColor="#fff" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#fff" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle
            cx={cx}
            cy={cy}
            r={lightRadius}
            fill="url(#light)"
            style={{ filter: "blur(40px)" }}
          />
        </svg>
      </div>
    );
  }

  // --- Main render ---
  return (
    <div
      ref={containerRef}
      className="relative min-h-screen w-full overflow-hidden"
      style={{ background: "#23272f" }}
      onMouseMove={handleMouseMove}
    >
      {/* Dynamic light effect */}
      {renderLightCircle()}
      {/* Expanding reveal border */}
      {renderRevealBorder()}
      {/* Floating figures */}
      {figures.map((fig, idx) => renderFigure(fig, idx))}
      {/* Floating anvil */}
      {renderAnvil()}
      {/* Central static content */}
      <main
        className="absolute left-1/2 top-1/2 z-40 flex w-full max-w-5xl -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center text-center"
        style={{ pointerEvents: "auto" }}
      >
        <h1 className="text-5xl font-extrabold mb-8 text-white drop-shadow-lg tracking-tight">
          Welcome to WorkForge
        </h1>
        <p className="mb-8 text-lg text-gray-200 max-w-2xl">
          The platform for freelancers and clients to achieve their goals.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/auth/login"
            className="px-0 py-0 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 text-lg font-semibold shadow-lg flex items-center justify-center text-center"
            style={{ width: 140, height: 52 }}
          >
            Login
          </Link>
          <Link
            href="/auth/register"
            className="px-0 py-0 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/90 text-lg font-semibold shadow-lg flex items-center justify-center text-center"
            style={{ width: 140, height: 51 }}
          >
            Sign Up
          </Link>
        </div>
      </main>
    </div>
  );
}
