import React, { useState, useEffect, useRef } from 'react';
import {
  motion,
  AnimatePresence,
  useInView,
  useScroll,
  useTransform,
  useMotionValueEvent,
  useReducedMotion,
} from 'motion/react';
import { RotateCcw, ArrowRight, Check } from 'lucide-react';
import { SITE_CONTENT } from '../content/siteContent';
import { WordRevealHeading, ParallaxLogoPlanes } from './InteractivePrimitives';

/* ==========================================================================
   Slowly Drifting Blurred Glow Blob (Pauses off-screen & respects reduced motion)
   ========================================================================== */
export const DriftingGlowBlob: React.FC<{
  tone: 'forge' | 'amber' | 'ember';
  positionClass: string;
}> = ({ tone, positionClass }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(ref, { once: false, amount: 0.05 });
  const prefersReducedMotion = useReducedMotion();

  const colorVar =
    tone === 'amber'
      ? 'var(--amber)'
      : tone === 'ember'
      ? 'var(--ember)'
      : 'var(--forge)';

  const shouldAnimate = isInView && !prefersReducedMotion;

  return (
    <motion.div
      ref={ref}
      aria-hidden="true"
      initial={false}
      animate={
        shouldAnimate
          ? {
              x: [0, 28, -18, 0],
              y: [0, -22, 16, 0],
              scale: [1, 1.06, 0.96, 1],
            }
          : { x: 0, y: 0, scale: 1 }
      }
      transition={
        shouldAnimate
          ? {
              duration: 18,
              repeat: Infinity,
              ease: 'easeInOut',
            }
          : { duration: 0 }
      }
      className={`pointer-events-none absolute w-[320px] sm:w-[460px] h-[320px] sm:h-[460px] rounded-[var(--radius-pill)] blur-[110px] opacity-[0.11] ${positionClass}`}
      style={{
        background: `radial-gradient(circle, ${colorVar} 0%, transparent 70%)`,
      }}
    />
  );
};

/* Shared Scroll-Reveal Section Wrapper with Soft Divider Transitions & Custom Atmosphere */
export const RevealSection: React.FC<{
  id?: string;
  children: React.ReactNode;
  className?: string;
  backgroundStyle?: string;
  patternClass?: string;
  dividerType?: 'fade' | 'heat' | 'angle' | 'curve' | 'none';
  glowBlob?: { tone: 'forge' | 'amber' | 'ember'; positionClass: string };
}> = ({
  id,
  children,
  className = '',
  backgroundStyle,
  patternClass = '',
  dividerType = 'fade',
  glowBlob,
}) => {
  const prefersReducedMotion = useReducedMotion();
  return (
    <motion.section
      id={id}
      initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        duration: prefersReducedMotion ? 0 : 0.45,
        ease: [0.22, 1, 0.36, 1],
      }}
      style={backgroundStyle ? { background: backgroundStyle } : undefined}
      className={`relative w-full py-[var(--space-64)] md:py-[var(--space-96)] overflow-hidden ${className}`}
    >
      {/* Soft Divider Transition at Top of Section */}
      {dividerType === 'fade' && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-0 left-0 right-0 divider-fade-top"
        />
      )}
      {dividerType === 'heat' && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-0 left-0 right-0 divider-heat-horizon"
        />
      )}
      {dividerType === 'angle' && (
        <svg
          aria-hidden="true"
          viewBox="0 0 1440 28"
          preserveAspectRatio="none"
          className="pointer-events-none absolute top-0 left-0 w-full h-[20px] sm:h-[28px]"
        >
          <polygon
            points="0,0 1440,0 1440,6 0,28"
            fill="var(--ink-950)"
            fillOpacity="0.65"
          />
          <line
            x1="0"
            y1="27"
            x2="1440"
            y2="5"
            stroke="var(--border-color-accent)"
            strokeOpacity="0.35"
            strokeWidth="1"
          />
        </svg>
      )}
      {dividerType === 'curve' && (
        <svg
          aria-hidden="true"
          viewBox="0 0 1440 32"
          preserveAspectRatio="none"
          className="pointer-events-none absolute top-0 left-0 w-full h-[20px] sm:h-[32px]"
        >
          <path
            d="M0,0 L1440,0 L1440,8 Q720,32 0,8 Z"
            fill="var(--ink-950)"
            fillOpacity="0.6"
          />
          <path
            d="M0,8 Q720,32 1440,8"
            fill="none"
            stroke="var(--border-color-strong)"
            strokeWidth="1"
          />
        </svg>
      )}

      {/* Optional Geometric Pattern Overlay */}
      {patternClass && (
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 ${patternClass}`}
        />
      )}

      {/* Optional Slowly Drifting Blurred Glow Blob */}
      {glowBlob && (
        <DriftingGlowBlob
          tone={glowBlob.tone}
          positionClass={glowBlob.positionClass}
        />
      )}

      <div className="forge-container relative z-10">{children}</div>
    </motion.section>
  );
};

/* ==========================================================================
   1. SECTION: The Blank Canvas
   Atmosphere: Faint dot grid with a slow-drifting orange glow in one corner
   ========================================================================== */
export const BlankCanvasSection: React.FC = () => {
  const { blankCanvas } = SITE_CONTENT.sections;
  const prefersReducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 85%', 'center 45%'],
  });

  const [fillStep, setFillStep] = useState<number>(prefersReducedMotion ? 4 : 1);
  const [manualOverride, setManualOverride] = useState<boolean>(false);

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    if (prefersReducedMotion || manualOverride) return;
    if (latest < 0.2) setFillStep(0);
    else if (latest < 0.45) setFillStep(1);
    else if (latest < 0.7) setFillStep(2);
    else if (latest < 0.9) setFillStep(3);
    else setFillStep(4);
  });

  useEffect(() => {
    if (prefersReducedMotion) {
      setFillStep(4);
    }
  }, [prefersReducedMotion]);

  const opacityTransform = useTransform(scrollYProgress, [0, 1], [0.55, 1]);

  return (
    <RevealSection
      backgroundStyle="var(--bg-section-blank-canvas)"
      patternClass="pattern-dot-grid opacity-40"
      glowBlob={{ tone: 'forge', positionClass: '-top-[80px] -right-[80px]' }}
    >
      <ParallaxLogoPlanes variant="blank-canvas" />
      <div ref={containerRef} className="forge-grid items-start relative z-10">
        {/* Copy Header */}
        <div className="col-span-4 md:col-span-8 lg:col-span-5 flex flex-col justify-between">
          <div>
            <WordRevealHeading
              text={blankCanvas.headline}
              className="type-heading-xl text-[var(--paper)] mb-[var(--space-16)]"
            />
            <p className="type-body-l text-[var(--ink-300)] mb-[var(--space-32)]">
              {blankCanvas.body}
            </p>
          </div>

          {/* Interactive Assembly Layer Controls */}
          <div className="flex flex-col gap-[var(--space-8)]">
            {blankCanvas.layers.map((layer, index) => {
              const stepNum = index + 1;
              const isActive = fillStep >= stepNum;
              const isCurrent = fillStep === stepNum;
              return (
                <button
                  key={layer.id}
                  type="button"
                  onClick={() => {
                    setManualOverride(true);
                    setFillStep(stepNum);
                  }}
                  className={`w-full text-left px-[var(--space-16)] py-[var(--space-12)] rounded-[var(--radius-8)] border flex items-center justify-between gap-[var(--space-8)] transition-colors duration-[var(--duration-fast)] cursor-pointer ${
                    isCurrent
                      ? 'bg-[var(--ink-800)] border-[var(--border-color-accent)] text-[var(--paper)]'
                      : isActive
                      ? 'bg-[var(--ink-800)] border-[var(--border-color-strong)] text-[var(--paper)]'
                      : 'bg-[var(--ink-900)] border-[var(--border-color-default)] text-[var(--ink-300)] hover:text-[var(--paper)]'
                  }`}
                >
                  <span className="type-mono">{layer.label}</span>
                  <span
                    className={`type-mono ${
                      isCurrent
                        ? 'text-[var(--forge)] font-semibold'
                        : 'text-[var(--ink-300)]'
                    }`}
                  >
                    {isActive ? layer.status : 'PENDING'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Progressive Workspace Frame Visual */}
        <div className="col-span-4 md:col-span-8 lg:col-span-7 mt-[var(--space-32)] lg:mt-0">
          <motion.div
            style={prefersReducedMotion ? undefined : { opacity: opacityTransform }}
            className="w-full rounded-[var(--radius-16)] bg-[var(--ink-900)] border border-[var(--border-color-strong)] overflow-hidden"
          >
            {/* Instrument Frame Header */}
            <div className="px-[var(--space-16)] py-[var(--space-12)] bg-[var(--ink-950)] border-b border-[var(--border-color-default)] flex flex-wrap items-center justify-between gap-[var(--space-8)]">
              <div className="flex items-center gap-[var(--space-8)]">
                <span
                  className={`w-[6px] h-[6px] rounded-[var(--radius-pill)] transition-colors duration-[var(--duration-fast)] ${
                    fillStep >= 4 ? 'bg-[var(--forge)]' : 'bg-[var(--amber)]'
                  }`}
                />
                <span className="type-mono text-[var(--ink-300)]">
                  {blankCanvas.frameTitle}
                </span>
              </div>
              <span className="type-mono text-[var(--forge)]">
                STAGE 0{fillStep} / 04
              </span>
            </div>

            {/* Canvas Body */}
            <div className="relative min-h-[340px] p-[var(--space-16)] sm:p-[var(--space-24)] flex flex-col justify-between overflow-hidden">
              <div
                aria-hidden="true"
                className={`pointer-events-none absolute inset-0 transition-opacity duration-[var(--duration-standard)] ${
                  fillStep >= 1 ? 'opacity-100' : 'opacity-15'
                }`}
                style={{
                  backgroundImage: `
                    linear-gradient(to right, var(--border-color-default) 1px, transparent 1px),
                    linear-gradient(to bottom, var(--border-color-default) 1px, transparent 1px)
                  `,
                  backgroundSize: '36px 36px',
                }}
              />

              {/* Layer 2: Top Viewport Header Bar */}
              <motion.div
                initial={false}
                animate={{
                  opacity: fillStep >= 2 ? 1 : 0.15,
                  y: prefersReducedMotion ? 0 : fillStep >= 2 ? 0 : -6,
                }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="relative z-10 w-full px-[var(--space-16)] py-[var(--space-12)] rounded-[var(--radius-8)] bg-[var(--ink-950)] border border-[var(--border-color-strong)] flex flex-wrap items-center justify-between gap-[var(--space-8)] mb-[var(--space-16)]"
              >
                <span className="type-mono text-[var(--paper)]">
                  {blankCanvas.canvasBlocks.headerLabel}
                </span>
                <div className="flex items-center gap-[var(--space-8)]">
                  <div className="w-[40px] h-[8px] rounded-[var(--radius-4)] bg-[var(--ink-700)]" />
                  <div className="w-[20px] h-[8px] rounded-[var(--radius-4)] bg-[var(--forge)]" />
                </div>
              </motion.div>

              {/* Layer 2 & 3: Sidebar + Primary Product Surface */}
              <div className="relative z-10 grid grid-cols-12 gap-[var(--space-16)] flex-1">
                <motion.div
                  initial={false}
                  animate={{
                    opacity: fillStep >= 2 ? 1 : 0.12,
                    x: prefersReducedMotion ? 0 : fillStep >= 2 ? 0 : -8,
                  }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="col-span-12 sm:col-span-4 rounded-[var(--radius-8)] bg-[var(--ink-950)] border border-[var(--border-color-default)] p-[var(--space-16)] flex flex-col justify-between"
                >
                  <div>
                    <div className="type-mono text-[var(--ink-300)] mb-[var(--space-12)]">
                      {blankCanvas.canvasBlocks.sidebarLabel}
                    </div>
                    <div className="flex flex-col gap-[var(--space-8)]">
                      {[75, 55, 85, 62].map((w, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-[var(--space-8)]"
                        >
                          <span className="w-[6px] h-[6px] rounded-[var(--radius-4)] bg-[var(--ink-700)]" />
                          <div
                            style={{ width: `${w}%` }}
                            className="h-[8px] rounded-[var(--radius-4)] bg-[var(--ink-800)] border border-[var(--border-color-default)]"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="pt-[var(--space-12)] mt-[var(--space-12)] border-t border-[var(--border-color-default)] type-mono text-[var(--ink-300)]">
                    {blankCanvas.canvasBlocks.inspectorLabel}
                  </div>
                </motion.div>

                <div className="col-span-12 sm:col-span-8 flex flex-col gap-[var(--space-16)]">
                  <motion.div
                    initial={false}
                    animate={{
                      opacity: fillStep >= 3 ? 1 : 0.1,
                      scale: prefersReducedMotion ? 1 : fillStep >= 3 ? 1 : 0.98,
                    }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="flex-1 rounded-[var(--radius-8)] bg-[var(--ink-800)] border border-[var(--border-color-strong)] p-[var(--space-16)] flex flex-col justify-between"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-[var(--space-8)] mb-[var(--space-16)]">
                      <span className="type-mono text-[var(--paper)]">
                        {blankCanvas.canvasBlocks.mainPanelLabel}
                      </span>
                      <span className="type-mono text-[var(--amber)]">
                        12-COL BOUND
                      </span>
                    </div>

                    <svg
                      viewBox="0 0 400 72"
                      className="w-full h-[72px]"
                      aria-hidden="true"
                    >
                      <line
                        x1="0"
                        y1="68"
                        x2="400"
                        y2="68"
                        stroke="var(--border-color-strong)"
                        strokeWidth="1"
                      />
                      <polyline
                        fill="none"
                        stroke="var(--forge)"
                        strokeWidth="1.75"
                        points="0,58 55,44 115,48 175,24 235,34 295,14 355,22 400,8"
                      />
                    </svg>
                  </motion.div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-[var(--space-12)]">
                    {blankCanvas.canvasBlocks.metricLabels.map((lbl, idx) => (
                      <motion.div
                        key={lbl}
                        initial={false}
                        animate={{
                          opacity: fillStep >= 4 ? 1 : 0.08,
                          y: prefersReducedMotion ? 0 : fillStep >= 4 ? 0 : 8,
                        }}
                        transition={{
                          duration: 0.3,
                          delay: prefersReducedMotion ? 0 : idx * 0.05,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        className="p-[var(--space-12)] rounded-[var(--radius-8)] bg-[var(--ink-950)] border border-[var(--border-color-strong)]"
                      >
                        <div className="type-caption font-[var(--font-mono)] text-[var(--ink-300)] mb-[var(--space-8)]">
                          {lbl}
                        </div>
                        <div className="w-2/3 h-[10px] rounded-[var(--radius-4)] bg-[var(--paper)]" />
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </RevealSection>
  );
};

/* ==========================================================================
   2. SECTION: One Idea (id: product)
   Atmosphere: Soft radial gradient (ink-800 to ink-950) with a thin glowing
   horizontal line crossing it
   ========================================================================== */
export const OneIdeaSection: React.FC = () => {
  const { oneIdea } = SITE_CONTENT.sections;
  const prefersReducedMotion = useReducedMotion();
  const [selectedFieldId, setSelectedFieldId] = useState<string>('problem');

  return (
    <RevealSection
      id={oneIdea.id}
      backgroundStyle="var(--bg-section-one-idea)"
      dividerType="heat"
    >
      {/* Thin Glowing Horizontal Line Crossing the Section */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-0 right-0 top-[58%] h-[1px] opacity-80"
        style={{ background: 'var(--glow-horizon-line)' }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/4 right-1/4 top-[58%] -translate-y-1/2 h-[24px] blur-[18px] opacity-35"
        style={{ background: 'var(--glow-horizon-line)' }}
      />

      <div className="relative z-10 flex flex-col items-center text-center mb-[var(--space-48)] md:mb-[var(--space-64)]">
        <WordRevealHeading
          text={oneIdea.headline}
          className="type-heading-xl text-[var(--paper)] mb-[var(--space-16)]"
        />
        <p className="type-body-l text-[var(--ink-300)] max-w-[640px]">
          {oneIdea.body}
        </p>
      </div>

      {/* Prompt in a mono box transforming into a brief card with Problem, Users, Goals, Features */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-[var(--space-24)] items-center">
        {/* Left: Prompt Mono Box */}
        <div className="lg:col-span-5">
          <div className="rounded-[var(--radius-12)] bg-[var(--ink-900)] border border-[var(--border-color-strong)] p-[var(--space-24)]">
            <div className="flex items-center justify-between pb-[var(--space-12)] mb-[var(--space-16)] border-b border-[var(--border-color-default)]">
              <span className="type-mono text-[var(--ink-300)]">
                {oneIdea.promptLabel}
              </span>
              <span className="w-[6px] h-[6px] rounded-[var(--radius-pill)] bg-[var(--forge)]" />
            </div>
            <div className="type-body-m font-[var(--font-mono)] text-[var(--paper)] leading-relaxed p-[var(--space-16)] rounded-[var(--radius-8)] bg-[var(--ink-950)] border border-[var(--border-color-default)] break-words">
              &ldquo;{oneIdea.promptText}&rdquo;
            </div>
          </div>
        </div>

        {/* Center: Transformation Conduit Connector */}
        <div className="lg:col-span-1 flex items-center justify-center">
          <div className="hidden lg:flex items-center justify-center w-full">
            <svg
              viewBox="0 0 80 40"
              className="w-full h-[40px] overflow-visible"
              aria-hidden="true"
            >
              <line
                x1="0"
                y1="20"
                x2="80"
                y2="20"
                stroke="var(--border-color-accent)"
                strokeWidth="1.5"
              />
              {!prefersReducedMotion && (
                <motion.circle
                  cx="0"
                  cy="20"
                  r="4"
                  fill="var(--forge)"
                  animate={{ cx: [0, 80] }}
                  transition={{
                    duration: 1.4,
                    repeat: Infinity,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                />
              )}
              <polygon points="74,15 80,20 74,25" fill="var(--forge)" />
            </svg>
          </div>
          <div className="flex lg:hidden items-center justify-center py-[var(--space-8)]">
            <ArrowRight size={20} className="rotate-90 text-[var(--forge)]" />
          </div>
        </div>

        {/* Right: Structured Brief Card with Problem, Users, Goals, Features */}
        <div className="lg:col-span-6">
          <div className="rounded-[var(--radius-16)] bg-[var(--ink-900)] border border-[var(--border-color-strong)] p-[var(--space-16)] sm:p-[var(--space-24)]">
            <div className="flex flex-wrap items-center justify-between gap-[var(--space-8)] pb-[var(--space-16)] mb-[var(--space-16)] border-b border-[var(--border-color-default)]">
              <span className="type-mono font-semibold text-[var(--paper)]">
                {oneIdea.briefHeader}
              </span>
              <span className="type-mono text-[var(--amber)]">4 FIELDS PARSED</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-[var(--space-16)]">
              {oneIdea.briefFields.map((field) => {
                const isSelected = selectedFieldId === field.id;
                return (
                  <button
                    key={field.id}
                    type="button"
                    onClick={() => setSelectedFieldId(field.id)}
                    onMouseEnter={() => setSelectedFieldId(field.id)}
                    className={`text-left p-[var(--space-16)] rounded-[var(--radius-8)] border transition-colors duration-[var(--duration-fast)] cursor-pointer ${
                      isSelected
                        ? 'bg-[var(--ink-800)] border-[var(--border-color-accent)]'
                        : 'bg-[var(--ink-950)] border-[var(--border-color-default)] hover:border-[var(--border-color-strong)]'
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-[var(--space-8)] mb-[var(--space-8)]">
                      <span className="type-body-m font-[var(--font-display)] font-semibold text-[var(--paper)]">
                        {field.label}
                      </span>
                      <span
                        className={`type-caption font-[var(--font-mono)] ${
                          isSelected ? 'text-[var(--forge-soft)]' : 'text-[var(--ink-300)]'
                        }`}
                      >
                        {field.meta}
                      </span>
                    </div>
                    <p className="type-body-s text-[var(--ink-300)]">{field.value}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </RevealSection>
  );
};

/* ==========================================================================
   3. SECTION: Product Intelligence
   Atmosphere: Blueprint-style fine grid lines with a warm amber radial glow
   behind the system map
   ========================================================================== */
export const ProductIntelligenceSection: React.FC = () => {
  const { productIntelligence } = SITE_CONTENT.sections;
  const prefersReducedMotion = useReducedMotion();
  const [activeNodeIndex, setActiveNodeIndex] = useState<number>(0);
  const [userHovering, setUserHovering] = useState<boolean>(false);

  const nodes = productIntelligence.nodes;

  useEffect(() => {
    if (prefersReducedMotion || userHovering) return;
    const interval = window.setInterval(() => {
      setActiveNodeIndex((prev) => (prev + 1) % nodes.length);
    }, 1600);
    return () => window.clearInterval(interval);
  }, [prefersReducedMotion, userHovering, nodes.length]);

  const activeNode = nodes[activeNodeIndex] || nodes[0];
  const nextNode = nodes[(activeNodeIndex + 1) % nodes.length] || nodes[0];

  const edges: { from: typeof activeNode; to: typeof activeNode; id: string }[] = [];
  nodes.forEach((source) => {
    source.connections.forEach((targetId) => {
      const target = nodes.find((n) => n.id === targetId);
      if (target) {
        edges.push({
          from: source,
          to: target,
          id: `${source.id}-${target.id}`,
        });
      }
    });
  });

  return (
    <RevealSection
      backgroundStyle="var(--bg-section-intelligence)"
      patternClass="pattern-blueprint-grid opacity-80"
      glowBlob={{ tone: 'amber', positionClass: 'top-1/4 left-1/3' }}
    >
      <div className="flex flex-col items-center text-center mb-[var(--space-48)]">
        <WordRevealHeading
          text={productIntelligence.headline}
          className="type-heading-xl text-[var(--paper)] mb-[var(--space-16)]"
        />
        <p className="type-body-l text-[var(--ink-300)] max-w-[640px]">
          {productIntelligence.body}
        </p>
      </div>

      {/* System Map Container */}
      <div
        onMouseEnter={() => setUserHovering(true)}
        onMouseLeave={() => setUserHovering(false)}
        className="relative w-full rounded-[var(--radius-16)] bg-[var(--ink-900)] border border-[var(--border-color-strong)] overflow-hidden"
      >
        {/* Warm Amber Radial Glow Behind the System Map */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{ background: 'var(--glow-amber-radial)' }}
        />

        <div className="relative z-10 p-[var(--space-16)] sm:p-[var(--space-32)]">
          {/* Desktop / Tablet SVG Connected System Map */}
          <div className="hidden md:block w-full">
            <svg
              viewBox="0 0 900 360"
              className="w-full h-[340px] overflow-visible"
              aria-label="Product intelligence system map with six connected nodes: Users, Goals, Features, Flows, Requirements, Constraints"
            >
              <circle
                cx="450"
                cy="180"
                r="130"
                fill="none"
                stroke="var(--border-color-accent)"
                strokeDasharray="4 6"
              />

              {edges.map((edge) => {
                const isConnectedToActive =
                  edge.from.id === activeNode.id || edge.to.id === activeNode.id;
                return (
                  <g key={edge.id}>
                    <line
                      x1={edge.from.x}
                      y1={edge.from.y}
                      x2={edge.to.x}
                      y2={edge.to.y}
                      stroke={
                        isConnectedToActive
                          ? 'var(--amber)'
                          : 'var(--border-color-strong)'
                      }
                      strokeWidth={isConnectedToActive ? '1.5' : '1'}
                    />
                  </g>
                );
              })}

              {!prefersReducedMotion && (
                <motion.circle
                  key={`${activeNode.id}->${nextNode.id}`}
                  r="5.5"
                  fill="var(--amber)"
                  initial={{ cx: activeNode.x, cy: activeNode.y, opacity: 1 }}
                  animate={{ cx: nextNode.x, cy: nextNode.y, opacity: [1, 1, 0.4] }}
                  transition={{
                    duration: 1.35,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                />
              )}

              {nodes.map((node, index) => {
                const isActive = index === activeNodeIndex;
                return (
                  <g
                    key={node.id}
                    onClick={() => setActiveNodeIndex(index)}
                    onMouseEnter={() => setActiveNodeIndex(index)}
                    className="cursor-pointer"
                    role="button"
                    tabIndex={0}
                    aria-label={`${node.label}: ${node.spec}`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setActiveNodeIndex(index);
                      }
                    }}
                  >
                    <rect
                      x={node.x - 84}
                      y={node.y - 30}
                      width="168"
                      height="60"
                      rx="8"
                      fill={isActive ? 'var(--ink-800)' : 'var(--ink-950)'}
                      stroke={
                        isActive
                          ? 'var(--amber)'
                          : 'var(--border-color-strong)'
                      }
                      strokeWidth={isActive ? '1.5' : '1'}
                    />
                    <circle
                      cx={node.x - 64}
                      cy={node.y - 8}
                      r="3.5"
                      fill={isActive ? 'var(--amber)' : 'var(--ink-300)'}
                    />
                    <text
                      x={node.x - 52}
                      y={node.y - 4}
                      fill="var(--ink-300)"
                      className="type-caption font-[var(--font-mono)]"
                    >
                      {node.code}
                    </text>
                    <text
                      x={node.x - 64}
                      y={node.y + 16}
                      fill="var(--paper)"
                      className="type-body-m font-[var(--font-display)] font-semibold"
                    >
                      {node.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Mobile Responsive 6-Node Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-[var(--space-12)] md:hidden">
            {nodes.map((node, index) => {
              const isActive = index === activeNodeIndex;
              return (
                <button
                  key={node.id}
                  type="button"
                  onClick={() => setActiveNodeIndex(index)}
                  className={`p-[var(--space-16)] rounded-[var(--radius-8)] border text-left transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[var(--ink-800)] border-[var(--amber)]'
                      : 'bg-[var(--ink-950)] border-[var(--border-color-default)]'
                  }`}
                >
                  <div className="flex items-center gap-[var(--space-8)] mb-[var(--space-4)]">
                    <span
                      className={`w-[6px] h-[6px] rounded-[var(--radius-pill)] ${
                        isActive ? 'bg-[var(--amber)]' : 'bg-[var(--ink-300)]'
                      }`}
                    />
                    <span className="type-mono text-[var(--ink-300)]">{node.code}</span>
                  </div>
                  <div className="type-body-m font-[var(--font-display)] font-semibold text-[var(--paper)]">
                    {node.label}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Node Specification Inspector Bar */}
        <div className="relative z-10 px-[var(--space-16)] sm:px-[var(--space-24)] py-[var(--space-16)] bg-[var(--ink-950)] border-t border-[var(--border-color-default)] flex flex-col sm:flex-row sm:items-center justify-between gap-[var(--space-12)]">
          <div className="flex flex-wrap items-center gap-[var(--space-8)]">
            <span className="type-mono font-semibold text-[var(--amber)]">
              {activeNode.label.toUpperCase()}
            </span>
            <span className="text-[var(--ink-300)]" aria-hidden="true">
              ·
            </span>
            <span className="type-body-s text-[var(--ink-300)]">{activeNode.spec}</span>
          </div>
          <span className="type-mono text-[var(--ink-300)]">
            CONNECTED TO: {activeNode.connections.join(' · ').toUpperCase()}
          </span>
        </div>
      </div>
    </RevealSection>
  );
};

/* ==========================================================================
   4. SECTION: Design (id: how-it-works)
   Scroll-driven 4-step flow (sticky pinned on desktop; stacked on mobile)
   As the user scrolls, a progress line fills and each step's illustration
   transforms into the next.
   ========================================================================== */
export const DesignFlowSection: React.FC = () => {
  const { design } = SITE_CONTENT.sections;
  const prefersReducedMotion = useReducedMotion();
  const scrollTrackRef = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: scrollTrackRef,
    offset: ['start start', 'end end'],
  });

  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [manualStepOverride, setManualStepOverride] = useState<boolean>(false);

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    if (prefersReducedMotion || manualStepOverride) return;
    if (latest < 0.25) setActiveStepIndex(0);
    else if (latest < 0.52) setActiveStepIndex(1);
    else if (latest < 0.78) setActiveStepIndex(2);
    else setActiveStepIndex(3);
  });

  const progressScaleX = useTransform(scrollYProgress, [0, 1], [0.12, 1]);

  const renderShapeIllustration = (stepId: string, isActive: boolean) => {
    const strokeAccent = isActive ? 'var(--forge)' : 'var(--paper)';
    switch (stepId) {
      case 'blueprint':
        return (
          <svg viewBox="0 0 200 100" className="w-full h-[96px]" aria-hidden="true">
            <rect
              x="16"
              y="18"
              width="46"
              height="26"
              rx="4"
              fill="var(--ink-900)"
              stroke="var(--ink-300)"
              strokeWidth="1.2"
            />
            <rect
              x="138"
              y="18"
              width="46"
              height="26"
              rx="4"
              fill="var(--ink-900)"
              stroke="var(--ink-300)"
              strokeWidth="1.2"
            />
            <rect
              x="77"
              y="58"
              width="46"
              height="26"
              rx="4"
              fill="var(--ink-900)"
              stroke={strokeAccent}
              strokeWidth="1.5"
            />
            <path
              d="M62 31 H100 V58 M138 31 H100"
              fill="none"
              stroke="var(--border-color-strong)"
              strokeWidth="1.2"
            />
          </svg>
        );
      case 'wireframe':
        return (
          <svg viewBox="0 0 200 100" className="w-full h-[96px]" aria-hidden="true">
            <rect
              x="16"
              y="14"
              width="168"
              height="14"
              rx="3"
              fill="var(--ink-700)"
            />
            <rect
              x="16"
              y="34"
              width="52"
              height="52"
              rx="4"
              fill="var(--ink-800)"
              stroke={strokeAccent}
            />
            <rect
              x="74"
              y="34"
              width="110"
              height="24"
              rx="4"
              fill="var(--ink-800)"
              stroke="var(--border-color-strong)"
            />
            <rect
              x="74"
              y="62"
              width="110"
              height="24"
              rx="4"
              fill="var(--ink-800)"
              stroke="var(--border-color-strong)"
            />
          </svg>
        );
      case 'design-system':
        return (
          <svg viewBox="0 0 200 100" className="w-full h-[96px]" aria-hidden="true">
            <rect
              x="16"
              y="18"
              width="28"
              height="28"
              rx="4"
              fill="var(--ink-950)"
              stroke="var(--border-color-strong)"
            />
            <rect
              x="50"
              y="18"
              width="28"
              height="28"
              rx="4"
              fill="var(--forge)"
            />
            <rect
              x="84"
              y="18"
              width="28"
              height="28"
              rx="4"
              fill="var(--paper)"
            />
            <rect
              x="16"
              y="56"
              width="96"
              height="26"
              rx="6"
              fill="var(--ink-900)"
              stroke="var(--border-color-strong)"
            />
            <text
              x="154"
              y="64"
              textAnchor="middle"
              fill="var(--paper)"
              className="type-heading-m font-[var(--font-display)] font-bold"
            >
              Aa
            </text>
          </svg>
        );
      default:
        return (
          <svg viewBox="0 0 200 100" className="w-full h-[96px]" aria-hidden="true">
            <rect
              x="16"
              y="14"
              width="168"
              height="72"
              rx="6"
              fill="var(--ink-950)"
              stroke={strokeAccent}
              strokeWidth="1.2"
            />
            <rect x="28" y="26" width="64" height="10" rx="2" fill="var(--paper)" />
            <rect x="28" y="44" width="42" height="6" rx="2" fill="var(--ink-300)" />
            <rect x="116" y="46" width="12" height="28" rx="2" fill="var(--ink-300)" />
            <rect x="134" y="32" width="12" height="42" rx="2" fill="var(--forge)" />
            <rect x="152" y="52" width="12" height="22" rx="2" fill="var(--ink-300)" />
          </svg>
        );
    }
  };

  const renderTransformingStageCanvas = (stepIdx: number) => {
    const activeItem = design.steps[stepIdx] || design.steps[0];

    return (
      <div className="relative w-full rounded-[var(--radius-16)] bg-[var(--ink-950)] border border-[var(--border-color-strong)] p-[var(--space-24)] overflow-hidden mb-[var(--space-24)]">
        <div className="flex items-center justify-between pb-[var(--space-16)] mb-[var(--space-16)] border-b border-[var(--border-color-default)]">
          <div className="flex items-center gap-[var(--space-12)]">
            <span className="type-mono text-[var(--forge)] font-semibold">
              STAGE {activeItem.step} / 04
            </span>
            <span className="type-mono text-[var(--paper)]">
              {activeItem.label.toUpperCase()}
            </span>
          </div>
          <span className="type-mono text-[var(--ink-300)]">
            SCROLL TO TRANSFORM
          </span>
        </div>

        <div className="min-h-[164px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeItem.id}
              initial={
                prefersReducedMotion
                  ? { opacity: 1 }
                  : { opacity: 0, y: 12, scale: 0.98 }
              }
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={
                prefersReducedMotion
                  ? { opacity: 0 }
                  : { opacity: 0, y: -12, scale: 0.98 }
              }
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-[540px]"
            >
              {renderShapeIllustration(activeItem.id, true)}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    );
  };

  return (
    <section
      id={design.id}
      ref={scrollTrackRef}
      style={{ background: 'var(--bg-section-design)' }}
      className={`relative w-full ${
        prefersReducedMotion ? 'py-[var(--space-64)] md:py-[var(--space-96)]' : 'lg:min-h-[210vh] py-[var(--space-64)] lg:py-[var(--space-96)]'
      }`}
    >
      {/* Top Angled SVG Divider */}
      <svg
        aria-hidden="true"
        viewBox="0 0 1440 28"
        preserveAspectRatio="none"
        className="pointer-events-none absolute top-0 left-0 w-full h-[20px] sm:h-[28px]"
      >
        <polygon
          points="0,0 1440,0 1440,6 0,28"
          fill="var(--ink-950)"
          fillOpacity="0.65"
        />
        <line
          x1="0"
          y1="27"
          x2="1440"
          y2="5"
          stroke="var(--border-color-accent)"
          strokeOpacity="0.35"
          strokeWidth="1"
        />
      </svg>

      <DriftingGlowBlob
        tone="ember"
        positionClass="bottom-[10%] right-[12%]"
      />

      <div
        className={`forge-container relative z-10 ${
          prefersReducedMotion ? '' : 'lg:sticky lg:top-[104px]'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-[var(--space-16)] mb-[var(--space-32)]">
          <WordRevealHeading
            text={design.headline}
            className="type-heading-xl text-[var(--paper)]"
          />
          <span className="type-mono text-[var(--forge-soft)]">
            0{activeStepIndex + 1} · {design.steps[activeStepIndex]?.label.toUpperCase()}
          </span>
        </div>

        {/* Scroll-Driven Progress Line */}
        <div
          aria-hidden="true"
          className="w-full h-[3px] rounded-[var(--radius-pill)] bg-[var(--ink-800)] overflow-hidden mb-[var(--space-24)]"
        >
          <motion.div
            style={
              prefersReducedMotion || manualStepOverride
                ? {
                    width: `${((activeStepIndex + 1) / design.steps.length) * 100}%`,
                    background:
                      'linear-gradient(90deg, var(--forge) 0%, var(--amber) 100%)',
                  }
                : {
                    scaleX: progressScaleX,
                    transformOrigin: '0% 50%',
                    background:
                      'linear-gradient(90deg, var(--forge) 0%, var(--amber) 100%)',
                  }
            }
            className="h-full w-full transition-all duration-200"
          />
        </div>

        {/* Desktop Morphing Illustration Stage */}
        <div className="hidden lg:block">
          {renderTransformingStageCanvas(activeStepIndex)}
        </div>

        {/* 4-Step Horizontal Flow (Vertical on mobile) */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-[var(--space-16)]">
          {design.steps.map((item, idx) => {
            const isActive = idx === activeStepIndex;
            const isPassed = idx <= activeStepIndex;
            return (
              <button
                key={item.id}
                type="button"
                onMouseEnter={() => {
                  setManualStepOverride(true);
                  setActiveStepIndex(idx);
                }}
                onMouseLeave={() => setManualStepOverride(false)}
                onClick={() => {
                  setManualStepOverride(true);
                  setActiveStepIndex(idx);
                }}
                className={`w-full text-left rounded-[var(--radius-12)] p-[var(--space-24)] border transition-colors duration-[var(--duration-fast)] flex flex-col justify-between cursor-pointer ${
                  isActive
                    ? 'bg-[var(--ink-800)] border-[var(--border-color-accent)]'
                    : isPassed
                    ? 'bg-[var(--ink-900)] border-[var(--border-color-strong)]'
                    : 'bg-[var(--ink-900)] border-[var(--border-color-default)] hover:border-[var(--border-color-strong)]'
                }`}
              >
                <div className="w-full">
                  <div className="flex items-center justify-between mb-[var(--space-16)]">
                    <span
                      className={`type-mono ${
                        isActive
                          ? 'text-[var(--forge)] font-semibold'
                          : 'text-[var(--ink-300)]'
                      }`}
                    >
                      {item.step}
                    </span>
                    {idx < design.steps.length - 1 && (
                      <ArrowRight
                        size={14}
                        className={`rotate-90 lg:rotate-0 ${
                          isActive
                            ? 'text-[var(--forge)]'
                            : 'text-[var(--ink-300)]'
                        }`}
                        aria-hidden="true"
                      />
                    )}
                  </div>

                  <div className="mb-[var(--space-24)] rounded-[var(--radius-8)] bg-[var(--ink-950)] border border-[var(--border-color-default)] p-[var(--space-8)]">
                    {renderShapeIllustration(item.id, isActive)}
                  </div>

                  <h3 className="type-heading-s text-[var(--paper)] mb-[var(--space-8)]">
                    {item.label}
                  </h3>
                </div>

                <p className="type-body-s text-[var(--ink-300)]">{item.detail}</p>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

/* ==========================================================================
   5. SECTION: Code
   Atmosphere: Slightly lighter surface (ink-800) with a subtle scanline texture
   ========================================================================== */
export const CodeSplitSection: React.FC = () => {
  const { code } = SITE_CONTENT.sections;
  const pulse = SITE_CONTENT.sequence.pulseApp;
  const fullSnippet = SITE_CONTENT.sequence.splitPanels.codeSnippet;
  const prefersReducedMotion = useReducedMotion();

  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: false, amount: 0.35 });

  const [charCount, setCharCount] = useState<number>(fullSnippet.length);
  const [highlightedBlock, setHighlightedBlock] = useState<
    'balance' | 'chart' | 'envelopes' | null
  >(null);

  useEffect(() => {
    if (prefersReducedMotion) {
      setCharCount(fullSnippet.length);
      return;
    }
    if (!inView) return;

    setCharCount(0);
    const interval = window.setInterval(() => {
      setCharCount((prev) => {
        if (prev >= fullSnippet.length) {
          window.clearInterval(interval);
          return fullSnippet.length;
        }
        return prev + 4;
      });
    }, 16);

    return () => window.clearInterval(interval);
  }, [inView, prefersReducedMotion, fullSnippet.length]);

  const handleReplayStream = () => {
    if (prefersReducedMotion) return;
    setCharCount(0);
    const interval = window.setInterval(() => {
      setCharCount((prev) => {
        if (prev >= fullSnippet.length) {
          window.clearInterval(interval);
          return fullSnippet.length;
        }
        return prev + 4;
      });
    }, 16);
  };

  return (
    <RevealSection
      backgroundStyle="var(--bg-section-code)"
      patternClass="pattern-scanlines"
      dividerType="curve"
    >
      <div ref={ref}>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-[var(--space-16)] mb-[var(--space-48)]">
          <WordRevealHeading
            text={code.headline}
            className="type-heading-xl text-[var(--paper)]"
          />
          <button
            type="button"
            onClick={handleReplayStream}
            className="self-start sm:self-auto px-[var(--space-12)] py-[var(--space-8)] rounded-[var(--radius-8)] bg-[var(--ink-900)] hover:bg-[var(--ink-950)] border border-[var(--border-color-strong)] type-mono text-[var(--paper)] inline-flex items-center gap-[var(--space-8)] cursor-pointer transition-colors"
          >
            <RotateCcw size={13} />
            <span>Stream code</span>
          </button>
        </div>

        {/* Split Screen: Left "UI", Right "CODE." */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[var(--space-24)]">
          {/* Left Panel: UI */}
          <div className="rounded-[var(--radius-16)] bg-[var(--ink-900)] border border-[var(--border-color-strong)] p-[var(--space-16)] sm:p-[var(--space-24)] flex flex-col">
            <div className="flex items-center justify-between pb-[var(--space-16)] mb-[var(--space-16)] border-b border-[var(--border-color-default)]">
              <span className="type-mono font-semibold text-[var(--paper)]">
                {code.leftLabel}
              </span>
              <span className="type-mono text-[var(--ink-300)]">
                {pulse.name} · {pulse.tag}
              </span>
            </div>

            <div className="flex flex-col gap-[var(--space-16)] flex-1">
              <button
                type="button"
                onMouseEnter={() => setHighlightedBlock('balance')}
                onMouseLeave={() => setHighlightedBlock(null)}
                onFocus={() => setHighlightedBlock('balance')}
                onBlur={() => setHighlightedBlock(null)}
                className={`w-full text-left p-[var(--space-16)] rounded-[var(--radius-8)] bg-[var(--ink-800)] border transition-colors cursor-pointer ${
                  highlightedBlock === 'balance'
                    ? 'border-[var(--forge)]'
                    : 'border-[var(--border-color-default)]'
                }`}
              >
                <div className="type-mono text-[var(--ink-300)] mb-[var(--space-4)]">
                  {pulse.balanceLabel}
                </div>
                <div className="type-heading-m text-[var(--paper)] tabular-nums">
                  {pulse.balanceAmount}
                </div>
              </button>

              <button
                type="button"
                onMouseEnter={() => setHighlightedBlock('chart')}
                onMouseLeave={() => setHighlightedBlock(null)}
                onFocus={() => setHighlightedBlock('chart')}
                onBlur={() => setHighlightedBlock(null)}
                className={`w-full text-left p-[var(--space-16)] rounded-[var(--radius-8)] bg-[var(--ink-800)] border transition-colors cursor-pointer ${
                  highlightedBlock === 'chart'
                    ? 'border-[var(--forge)]'
                    : 'border-[var(--border-color-default)]'
                }`}
              >
                <div className="type-mono text-[var(--ink-300)] mb-[var(--space-12)]">
                  {pulse.chartTitle}
                </div>
                <div className="grid grid-cols-7 gap-[var(--space-4)] sm:gap-[var(--space-8)] items-end h-[64px]">
                  {pulse.chartPoints.map((pt, i) => (
                    <div
                      key={pt.day}
                      style={{ height: `${pt.value}%` }}
                      className={`w-full rounded-[2px] ${
                        i === 3 ? 'bg-[var(--forge)]' : 'bg-[var(--ink-300)]'
                      }`}
                    />
                  ))}
                </div>
              </button>

              <button
                type="button"
                onMouseEnter={() => setHighlightedBlock('envelopes')}
                onMouseLeave={() => setHighlightedBlock(null)}
                onFocus={() => setHighlightedBlock('envelopes')}
                onBlur={() => setHighlightedBlock(null)}
                className={`w-full text-left p-[var(--space-16)] rounded-[var(--radius-8)] bg-[var(--ink-800)] border transition-colors cursor-pointer ${
                  highlightedBlock === 'envelopes'
                    ? 'border-[var(--forge)]'
                    : 'border-[var(--border-color-default)]'
                }`}
              >
                <div className="type-mono text-[var(--ink-300)] mb-[var(--space-8)]">
                  {pulse.budgetsTitle}
                </div>
                <div className="flex flex-col gap-[var(--space-8)]">
                  {pulse.budgets.slice(0, 2).map((b) => (
                    <div
                      key={b.id}
                      className="flex items-center justify-between gap-[var(--space-8)] type-body-s text-[var(--paper)]"
                    >
                      <span className="truncate">{b.category}</span>
                      <span className="type-mono text-[var(--ink-300)] shrink-0">
                        {b.spent} / {b.allocated}
                      </span>
                    </div>
                  ))}
                </div>
              </button>
            </div>
          </div>

          {/* Right Panel: CODE. */}
          <div className="rounded-[var(--radius-16)] bg-[var(--ink-900)] border border-[var(--border-color-strong)] p-[var(--space-16)] sm:p-[var(--space-24)] flex flex-col min-w-0">
            <div className="flex flex-wrap items-center justify-between gap-[var(--space-8)] pb-[var(--space-16)] mb-[var(--space-16)] border-b border-[var(--border-color-default)]">
              <span className="type-mono font-semibold text-[var(--forge)]">
                {code.rightLabel}
              </span>
              <span className="type-mono text-[var(--ink-300)] truncate">
                {code.fileLabel}
              </span>
            </div>

            <div className="flex-1 rounded-[var(--radius-8)] bg-[var(--ink-950)] border border-[var(--border-color-default)] p-[var(--space-16)] sm:p-[var(--space-24)] overflow-hidden flex flex-col justify-between">
              <pre className="type-mono text-[var(--ink-300)] whitespace-pre-wrap break-words sm:whitespace-pre">
                <code>
                  {fullSnippet.slice(0, charCount)}
                  {charCount < fullSnippet.length && (
                    <span
                      className="inline-block w-[7px] h-[14px] bg-[var(--forge)] align-middle ml-[2px]"
                      aria-hidden="true"
                    />
                  )}
                </code>
              </pre>

              <div className="mt-[var(--space-16)] pt-[var(--space-12)] border-t border-[var(--border-color-default)] flex flex-wrap items-center justify-between gap-[var(--space-8)] type-mono text-[var(--ink-300)]">
                <span>
                  {highlightedBlock
                    ? `BOUND NODE: <${
                        highlightedBlock === 'balance'
                          ? 'BalanceCard'
                          : highlightedBlock === 'chart'
                          ? 'SpendChart'
                          : 'EnvelopeList'
                      } />`
                    : 'HOVER OR FOCUS UI TO INSPECT AST BINDING'}
                </span>
                <span className="text-[var(--amber)]">TSX</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </RevealSection>
  );
};

/* ==========================================================================
   6. SECTION: Iterate
   Atmosphere: Warm gradient glow rising from the bottom edge
   ========================================================================== */
export const IterateSection: React.FC = () => {
  const { iterate } = SITE_CONTENT.sections;
  const prefersReducedMotion = useReducedMotion();
  const [activeLoopStep, setActiveLoopStep] = useState<number>(2);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const timer = window.setInterval(() => {
      setActiveLoopStep((prev) => (prev + 1) % iterate.steps.length);
    }, 2400);
    return () => window.clearInterval(timer);
  }, [prefersReducedMotion, iterate.steps.length]);

  const isRefinedState = activeLoopStep >= 2;

  return (
    <RevealSection
      backgroundStyle="var(--bg-section-iterate)"
      glowBlob={{ tone: 'forge', positionClass: '-bottom-[120px] left-1/4' }}
    >
      <div className="mb-[var(--space-48)]">
        <WordRevealHeading
          text={iterate.headline}
          className="type-heading-xl text-[var(--paper)]"
        />
      </div>

      {/* 4-Step Loop: Prompt -> Change -> Preview -> Refine */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[var(--space-16)] mb-[var(--space-24)]">
        {iterate.steps.map((st, idx) => {
          const isCurrent = idx === activeLoopStep;
          return (
            <button
              key={st.id}
              type="button"
              onClick={() => setActiveLoopStep(idx)}
              className={`text-left p-[var(--space-24)] rounded-[var(--radius-12)] border transition-colors duration-[var(--duration-fast)] cursor-pointer ${
                isCurrent
                  ? 'bg-[var(--ink-800)] border-[var(--border-color-accent)]'
                  : 'bg-[var(--ink-900)] border-[var(--border-color-default)] hover:border-[var(--border-color-strong)]'
              }`}
            >
              <div className="flex items-center justify-between mb-[var(--space-12)]">
                <span
                  className={`type-mono ${
                    isCurrent
                      ? 'text-[var(--forge)] font-semibold'
                      : 'text-[var(--ink-300)]'
                  }`}
                >
                  {st.step}
                </span>
                <span className="type-mono text-[var(--ink-300)]">LOOP</span>
              </div>
              <div className="type-heading-s text-[var(--paper)] mb-[var(--space-8)]">
                {st.label}
              </div>
              <p className="type-body-s text-[var(--ink-300)]">{st.detail}</p>
            </button>
          );
        })}
      </div>

      {/* Example Prompt in Mono + Live Surface Transformation */}
      <div className="rounded-[var(--radius-16)] bg-[var(--ink-900)] border border-[var(--border-color-strong)] p-[var(--space-16)] sm:p-[var(--space-32)] grid grid-cols-1 lg:grid-cols-12 gap-[var(--space-24)] items-center">
        <div className="lg:col-span-6">
          <div className="type-mono text-[var(--forge-soft)] mb-[var(--space-12)]">
            ITERATION PROMPT
          </div>
          <div className="p-[var(--space-16)] sm:p-[var(--space-24)] rounded-[var(--radius-12)] bg-[var(--ink-950)] border border-[var(--border-color-strong)] type-body-m font-[var(--font-mono)] text-[var(--paper)] leading-relaxed break-words">
            &ldquo;{iterate.examplePrompt}&rdquo;
          </div>
        </div>

        <div className="lg:col-span-6">
          <div className="p-[var(--space-16)] sm:p-[var(--space-24)] rounded-[var(--radius-12)] bg-[var(--ink-950)] border border-[var(--border-color-default)]">
            <div className="flex flex-wrap items-center justify-between gap-[var(--space-8)] mb-[var(--space-16)]">
              <span className="type-mono text-[var(--ink-300)]">
                {isRefinedState ? iterate.afterLabel : iterate.beforeLabel}
              </span>
              <button
                type="button"
                onClick={() => setActiveLoopStep(isRefinedState ? 0 : 3)}
                className="type-mono text-[var(--forge-soft)] hover:text-[var(--paper)] underline underline-offset-4 cursor-pointer"
              >
                {isRefinedState ? 'View before' : 'View refined'}
              </button>
            </div>

            {isRefinedState ? (
              <div className="p-[var(--space-16)] sm:p-[var(--space-24)] rounded-[var(--radius-8)] bg-[var(--ink-900)] border border-[var(--border-color-accent)] flex flex-wrap items-center justify-between gap-[var(--space-12)]">
                <div>
                  <div className="type-mono text-[var(--ink-300)] mb-[var(--space-4)]">
                    SAFE TO SPEND
                  </div>
                  <div className="type-heading-m text-[var(--paper)] tracking-tight tabular-nums">
                    $342.80
                  </div>
                </div>
                <div className="text-left sm:text-right">
                  <div className="type-mono text-[var(--amber)]">FALL WK 06</div>
                  <div className="type-mono text-[var(--ink-300)]">RESERVE LOCKED</div>
                </div>
              </div>
            ) : (
              <div className="p-[var(--space-12)] rounded-[var(--radius-8)] bg-[var(--ink-800)] border border-[var(--border-color-strong)] grid grid-cols-1 sm:grid-cols-3 gap-[var(--space-8)]">
                <div className="p-[var(--space-8)] bg-[var(--ink-900)] border border-[var(--border-color-strong)] rounded-[var(--radius-4)]">
                  <div className="type-caption font-[var(--font-mono)] text-[var(--ink-300)]">
                    BAL_01
                  </div>
                  <div className="type-mono text-[var(--paper)]">$342.80</div>
                </div>
                <div className="p-[var(--space-8)] bg-[var(--ink-900)] border border-[var(--border-color-strong)] rounded-[var(--radius-4)]">
                  <div className="type-caption font-[var(--font-mono)] text-[var(--ink-300)]">
                    RES_02
                  </div>
                  <div className="type-mono text-[var(--paper)]">$4,180</div>
                </div>
                <div className="p-[var(--space-8)] bg-[var(--ink-900)] border border-[var(--border-color-strong)] rounded-[var(--radius-4)]">
                  <div className="type-caption font-[var(--font-mono)] text-[var(--ink-300)]">
                    DELTA
                  </div>
                  <div className="type-mono text-[var(--paper)]">-5.1%</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </RevealSection>
  );
};

/* ==========================================================================
   7. SECTION: Ship
   Atmosphere: Warm gradient glow rising from the bottom edge
   ========================================================================== */
export const ShipSection: React.FC = () => {
  const { ship } = SITE_CONTENT.sections;
  const prefersReducedMotion = useReducedMotion();
  const [buildKey, setBuildKey] = useState<number>(0);

  return (
    <RevealSection
      backgroundStyle="var(--bg-section-ship)"
      dividerType="heat"
      glowBlob={{ tone: 'ember', positionClass: '-bottom-[140px] right-1/3' }}
    >
      <div className="flex flex-col items-center text-center mb-[var(--space-48)]">
        <WordRevealHeading
          text={ship.headline}
          className="type-heading-xl text-[var(--paper)]"
        />
      </div>

      {/* Mono Progress Block: BUILD COMPLETE / full orange progress bar / LIVE */}
      <div className="max-w-[760px] mx-auto rounded-[var(--radius-16)] bg-[var(--ink-900)] border border-[var(--border-color-strong)] p-[var(--space-24)] sm:p-[var(--space-32)]">
        <div className="flex items-center justify-between mb-[var(--space-16)]">
          <span className="type-body-m font-[var(--font-mono)] font-semibold tracking-[0.08em] text-[var(--paper)]">
            {ship.statusLeft}
          </span>
          <div className="flex items-center gap-[var(--space-8)]">
            <span
              className="w-[8px] h-[8px] rounded-[var(--radius-pill)] bg-[var(--forge)]"
              aria-hidden="true"
            />
            <span className="type-body-m font-[var(--font-mono)] font-semibold tracking-[0.08em] text-[var(--forge)]">
              {ship.statusRight}
            </span>
          </div>
        </div>

        {/* Full Heat-Spectrum Progress Bar */}
        <div className="w-full h-[12px] rounded-[var(--radius-4)] bg-[var(--ink-950)] border border-[var(--border-color-default)] overflow-hidden p-[2px] mb-[var(--space-24)]">
          <motion.div
            key={buildKey}
            initial={prefersReducedMotion ? { scaleX: 1 } : { scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{
              duration: prefersReducedMotion ? 0 : 0.85,
              ease: [0.22, 1, 0.36, 1],
            }}
            style={{
              originX: 0,
              background:
                'linear-gradient(90deg, var(--ember) 0%, var(--forge) 55%, var(--amber) 100%)',
            }}
            className="w-full h-full rounded-[2px]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-[var(--space-12)] pt-[var(--space-16)] border-t border-[var(--border-color-default)]">
          {ship.checks.map((check) => (
            <div
              key={check}
              className="flex items-center gap-[var(--space-8)] type-mono text-[var(--ink-300)]"
            >
              <Check size={14} className="text-[var(--amber)] shrink-0" />
              <span>{check}</span>
            </div>
          ))}
        </div>

        <div className="mt-[var(--space-24)] flex justify-end">
          <button
            type="button"
            onClick={() => setBuildKey((prev) => prev + 1)}
            className="type-mono text-[var(--ink-300)] hover:text-[var(--paper)] inline-flex items-center gap-[var(--space-8)] cursor-pointer transition-colors"
          >
            <RotateCcw size={12} />
            <span>VERIFY BUILD PIPELINE</span>
          </button>
        </div>
      </div>
    </RevealSection>
  );
};
