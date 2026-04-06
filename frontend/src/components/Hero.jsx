import { useState, useEffect, useCallback, useRef } from "react";
import { MapPin } from "@phosphor-icons/react";

const TERMINAL_LINES = [
  { id: "cmd", text: "$ ping geamyservices.com", delay: 0 },
  { id: "ping1", text: "PING geamyservices.com (142.250.190.14)", delay: 800 },
  { id: "seq1", text: "64 bytes: icmp_seq=1 ttl=117 time=12.4 ms", delay: 1200 },
  { id: "seq2", text: "64 bytes: icmp_seq=2 ttl=117 time=11.8 ms", delay: 1600 },
  { id: "blank", text: "", delay: 2000 },
  { id: "status", text: "--- Status: ONLINE ---", delay: 2200, status: true },
];

const STATS = [
  { id: "exp", value: "12+", label: "Years Experience" },
  { id: "proj", value: "50+", label: "Projects Delivered" },
  { id: "warranty", value: "30", label: "Day Work Warranty" },
];

const Hero = () => {
  const [terminalLines, setTerminalLines] = useState([]);
  const [showCursor, setShowCursor] = useState(true);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    
    TERMINAL_LINES.forEach((line) => {
      setTimeout(() => {
        if (mountedRef.current) {
          setTerminalLines((prev) => {
            if (prev.some(p => p.id === line.id)) return prev;
            return [...prev, line];
          });
        }
      }, line.delay);
    });

    const cursorInterval = setInterval(() => {
      if (mountedRef.current) {
        setShowCursor((prev) => !prev);
      }
    }, 500);

    return () => {
      mountedRef.current = false;
      clearInterval(cursorInterval);
    };
  }, []);

  const scrollToSection = useCallback((e, href) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  return (
    <section className="relative min-h-screen flex items-center pt-20" id="hero" data-testid="hero-section">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-24 md:py-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            {/* Availability Badge */}
            <div className="inline-flex items-center gap-3 glass-panel px-4 py-2" data-testid="availability-badge">
              <span className="status-dot" />
              <span className="font-mono text-sm text-gray-400">
                Available for new clients
              </span>
              <span className="flex items-center gap-1 text-[#00d4ff] font-mono text-sm">
                <MapPin size={14} weight="fill" />
                Miami, FL
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight" data-testid="hero-headline">
              IT Solutions
              <br />
              <span className="text-gradient">Built to Last.</span>
            </h1>

            {/* Subtext */}
            <p className="font-mono text-lg text-gray-400 leading-relaxed max-w-xl" data-testid="hero-subtext">
              Security, infrastructure, and automation for businesses that can't
              afford downtime. Network setup, Microsoft 365 migrations, firewalls,
              CCTV, web hosting — all under one roof.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <a
                href="#contact"
                onClick={(e) => scrollToSection(e, "#contact")}
                className="btn-neon"
                data-testid="hero-cta-quote"
              >
                Get a Free Quote
              </a>
              <a
                href="#services"
                onClick={(e) => scrollToSection(e, "#services")}
                className="btn-ghost"
                data-testid="hero-cta-services"
              >
                View Services
              </a>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/10" data-testid="stats-bar">
              {STATS.map((stat) => (
                <div key={stat.id} className="text-center lg:text-left">
                  <div className="font-heading text-3xl sm:text-4xl font-bold text-[#00d4ff]">
                    {stat.value}
                  </div>
                  <div className="font-mono text-xs sm:text-sm text-gray-500 uppercase tracking-wider mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Terminal Widget */}
          <div className="relative" data-testid="terminal-widget">
            <div className="terminal-window">
              <div className="terminal-header">
                <div className="terminal-dot bg-red-500" />
                <div className="terminal-dot bg-yellow-500" />
                <div className="terminal-dot bg-green-500" />
                <span className="ml-4 font-mono text-xs text-gray-500">
                  terminal — bash
                </span>
              </div>

              <div className="terminal-body min-h-[200px]">
                {terminalLines.map((line) => (
                  <div
                    key={line.id}
                    className={line.status ? "text-[#00ff88] font-bold mt-2" : "text-gray-400"}
                  >
                    {line.text}
                  </div>
                ))}
                {showCursor && <span className="typing-cursor" />}
              </div>
            </div>

            <div className="absolute -top-4 -right-4 w-24 h-24 border border-[#00d4ff]/20 -z-10" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 border border-[#00ff88]/10 -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
