import React, { useState, useRef, useEffect } from 'react';
import {
  motion,
  AnimatePresence,
  useInView,
  useReducedMotion,
} from 'motion/react';
import { ChevronDown, Check } from 'lucide-react';
import { SITE_CONTENT, TeamRoleCard, ExampleProjectCard } from '../content/siteContent';
import { ForgeLogo } from './ForgeLogo';
import { RevealSection } from './WorkflowSections';
import {
  WordRevealHeading,
  MagneticButton,
  ParallaxLogoPlanes,
} from './InteractivePrimitives';

/* ==========================================================================
   Role-Specific Looping Animated Visuals for Expanded AI Team Card
   ========================================================================== */
const RoleLoopingVisual: React.FC<{
  roleId: string;
  isExpanded: boolean;
  prefersReducedMotion: boolean;
}> = ({ roleId, isExpanded, prefersReducedMotion }) => {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!isExpanded || prefersReducedMotion) {
      setTick(3);
      return;
    }
    setTick(0);
    const interval = window.setInterval(() => {
      setTick((prev) => (prev + 1) % 4);
    }, 650);
    return () => window.clearInterval(interval);
  }, [isExpanded, prefersReducedMotion]);

  switch (roleId) {
    case 'strategist':
      // Strategist: nodes appearing sequentially
      return (
        <div className="w-full rounded-[var(--radius-8)] bg-[var(--ink-950)] border border-[var(--border-color-default)] p-[var(--space-12)]">
          <div className="flex items-center justify-between mb-[var(--space-8)]">
            <span className="type-caption font-[var(--font-mono)] text-[var(--amber)]">
              REQUIREMENTS GRAPH
            </span>
            <span className="type-caption font-[var(--font-mono)] text-[var(--ink-300)]">
              {Math.min(tick + 1, 4)} / 4 NODES
            </span>
          </div>
          <svg viewBox="0 0 240 64" className="w-full h-[56px]" aria-hidden="true">
            <line
              x1="36"
              y1="32"
              x2="104"
              y2="16"
              stroke={tick >= 1 ? 'var(--amber)' : 'var(--border-color-default)'}
              strokeWidth="1.4"
            />
            <line
              x1="36"
              y1="32"
              x2="104"
              y2="48"
              stroke={tick >= 2 ? 'var(--amber)' : 'var(--border-color-default)'}
              strokeWidth="1.4"
            />
            <line
              x1="140"
              y1="16"
              x2="196"
              y2="32"
              stroke={tick >= 3 ? 'var(--forge)' : 'var(--border-color-default)'}
              strokeWidth="1.4"
            />
            <line
              x1="140"
              y1="48"
              x2="196"
              y2="32"
              stroke={tick >= 3 ? 'var(--forge)' : 'var(--border-color-default)'}
              strokeWidth="1.4"
            />
            <circle
              cx="28"
              cy="32"
              r="9"
              fill="var(--ink-800)"
              stroke="var(--amber)"
              strokeWidth="1.5"
            />
            <g opacity={tick >= 1 ? 1 : 0.22}>
              <rect
                x="100"
                y="8"
                width="44"
                height="16"
                rx="3"
                fill="var(--ink-800)"
                stroke="var(--amber)"
              />
            </g>
            <g opacity={tick >= 2 ? 1 : 0.22}>
              <rect
                x="100"
                y="40"
                width="44"
                height="16"
                rx="3"
                fill="var(--ink-800)"
                stroke="var(--amber)"
              />
            </g>
            <g opacity={tick >= 3 ? 1 : 0.22}>
              <rect
                x="192"
                y="22"
                width="36"
                height="20"
                rx="4"
                fill="var(--forge)"
              />
            </g>
          </svg>
        </div>
      );

    case 'ux-architect':
      // UX Architect: connecting flow lines
      return (
        <div className="w-full rounded-[var(--radius-8)] bg-[var(--ink-950)] border border-[var(--border-color-default)] p-[var(--space-12)]">
          <div className="flex items-center justify-between mb-[var(--space-8)]">
            <span className="type-caption font-[var(--font-mono)] text-[var(--forge)]">
              JOURNEY TOPOLOGY
            </span>
            <span className="type-caption font-[var(--font-mono)] text-[var(--ink-300)]">
              PATH 0{tick + 1}
            </span>
          </div>
          <svg viewBox="0 0 240 64" className="w-full h-[56px]" aria-hidden="true">
            <rect
              x="12"
              y="18"
              width="42"
              height="28"
              rx="4"
              fill="var(--ink-800)"
              stroke="var(--paper)"
              strokeWidth="1.3"
            />
            <path
              d="M54 32 H98"
              stroke={tick >= 1 ? 'var(--forge)' : 'var(--border-color-strong)'}
              strokeWidth="2"
              strokeDasharray={tick >= 1 ? 'none' : '3 3'}
            />
            <rect
              x="98"
              y="18"
              width="44"
              height="28"
              rx="4"
              fill="var(--ink-800)"
              stroke={tick >= 1 ? 'var(--forge)' : 'var(--border-color-strong)'}
              strokeWidth="1.4"
            />
            <path
              d="M142 32 H186"
              stroke={tick >= 2 ? 'var(--forge)' : 'var(--border-color-strong)'}
              strokeWidth="2"
              strokeDasharray={tick >= 2 ? 'none' : '3 3'}
            />
            <rect
              x="186"
              y="18"
              width="42"
              height="28"
              rx="4"
              fill="var(--ink-800)"
              stroke={tick >= 2 ? 'var(--amber)' : 'var(--border-color-strong)'}
              strokeWidth="1.4"
            />
            {!prefersReducedMotion && (
              <motion.circle
                r="4"
                cy="32"
                fill="var(--forge)"
                animate={{ cx: [32, 120, 206] }}
                transition={{
                  duration: 1.6,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            )}
          </svg>
        </div>
      );

    case 'ui-designer':
      // UI Designer: color swatches and type samples
      return (
        <div className="w-full rounded-[var(--radius-8)] bg-[var(--ink-950)] border border-[var(--border-color-default)] p-[var(--space-12)]">
          <div className="flex items-center justify-between mb-[var(--space-8)]">
            <span className="type-caption font-[var(--font-mono)] text-[var(--forge-soft)]">
              VISUAL SYSTEM TOKENS
            </span>
            <span className="type-caption font-[var(--font-mono)] text-[var(--ink-300)]">
              AA VERIFIED
            </span>
          </div>
          <div className="flex items-center justify-between gap-[var(--space-12)] h-[56px]">
            <div className="flex items-center gap-[var(--space-8)]">
              {[
                { bg: 'var(--ink-800)', label: 'INK' },
                { bg: 'var(--forge)', label: 'FORGE' },
                { bg: 'var(--amber)', label: 'AMBER' },
                { bg: 'var(--paper)', label: 'PAPER' },
              ].map((sw, i) => (
                <div
                  key={sw.label}
                  style={{
                    backgroundColor: sw.bg,
                    transform:
                      tick === i && !prefersReducedMotion
                        ? 'scale(1.12)'
                        : 'scale(1)',
                  }}
                  className="w-[26px] h-[26px] rounded-[var(--radius-4)] border border-[var(--border-color-strong)] transition-transform duration-200"
                />
              ))}
            </div>
            <div className="flex items-baseline gap-[var(--space-8)] px-[var(--space-12)] py-[var(--space-4)] rounded-[var(--radius-4)] bg-[var(--ink-900)] border border-[var(--border-color-default)]">
              <span className="type-heading-s font-[var(--font-display)] text-[var(--paper)]">
                Aa
              </span>
              <span className="type-caption font-[var(--font-mono)] text-[var(--amber)]">
                96/0.92
              </span>
            </div>
          </div>
        </div>
      );

    case 'engineer': {
      // Engineer: streaming code lines
      const codeLines = [
        'const app = createForgeApp(schema);',
        'app.bind(<PulseLedger live />);',
        'export default app.compile();',
      ];
      return (
        <div className="w-full rounded-[var(--radius-8)] bg-[var(--ink-950)] border border-[var(--border-color-default)] p-[var(--space-12)]">
          <div className="flex items-center justify-between mb-[var(--space-8)]">
            <span className="type-caption font-[var(--font-mono)] text-[var(--forge)]">
              TSX COMPILER STREAM
            </span>
            <span className="type-caption font-[var(--font-mono)] text-[var(--ink-300)]">
              AST READY
            </span>
          </div>
          <div className="flex flex-col gap-[var(--space-4)] h-[56px] justify-center font-[var(--font-mono)] type-caption">
            {codeLines.map((line, idx) => {
              const visible = prefersReducedMotion || tick >= idx;
              return (
                <div
                  key={line}
                  className={`truncate transition-opacity duration-200 ${
                    visible
                      ? idx === 1
                        ? 'opacity-100 text-[var(--forge-soft)]'
                        : 'opacity-100 text-[var(--paper)]'
                      : 'opacity-20 text-[var(--ink-500)]'
                  }`}
                >
                  {line}
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    default: {
      // QA: a checklist ticking off
      const qaItems = [
        'Visual layout diff · 0px drift',
        '360px / 768px / 1440px bounds',
        'WCAG AA contrast & focus rings',
      ];
      return (
        <div className="w-full rounded-[var(--radius-8)] bg-[var(--ink-950)] border border-[var(--border-color-default)] p-[var(--space-12)]">
          <div className="flex items-center justify-between mb-[var(--space-8)]">
            <span className="type-caption font-[var(--font-mono)] text-[var(--paper)]">
              AUTOMATED QA SUITE
            </span>
            <span className="type-caption font-[var(--font-mono)] text-[var(--amber)]">
              PASS
            </span>
          </div>
          <div className="flex flex-col gap-[var(--space-4)] h-[56px] justify-center">
            {qaItems.map((checkLabel, idx) => {
              const checked = prefersReducedMotion || tick >= idx + 1;
              return (
                <div
                  key={checkLabel}
                  className="flex items-center gap-[var(--space-8)] type-caption font-[var(--font-mono)]"
                >
                  <span
                    className={`w-[12px] h-[12px] rounded-[2px] border flex items-center justify-center shrink-0 transition-colors duration-200 ${
                      checked
                        ? 'bg-[var(--forge)] border-[var(--forge)] text-[var(--ink-950)]'
                        : 'border-[var(--ink-500)] text-transparent'
                    }`}
                  >
                    <Check size={9} />
                  </span>
                  <span
                    className={`truncate ${
                      checked ? 'text-[var(--paper)]' : 'text-[var(--ink-300)]'
                    }`}
                  >
                    {checkLabel}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      );
    }
  }
};

/* ==========================================================================
   8. SECTION: Your AI product team (Interactive Slanted Cards)
   ========================================================================== */
export const ProductTeamSection: React.FC = () => {
  const { team } = SITE_CONTENT.sections;
  const prefersReducedMotion = useReducedMotion();

  // Default view auto-highlights nothing
  const [activeRoleId, setActiveRoleId] = useState<string | null>(null);
  const [spotlights, setSpotlights] = useState<
    Record<string, { x: number; y: number; active: boolean }>
  >({});

  const cardButtonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const isSectionInView = useInView(sectionRef, { once: false, amount: 0.15 });

  // Heat-spectrum gradient per role on a dark base
  const getRoleSurfaceGradient = (roleId: string, isExpanded: boolean) => {
    const intensity = isExpanded ? '0.28' : '0.16';
    switch (roleId) {
      case 'strategist':
        // Amber glow
        return `radial-gradient(circle at 50% 0%, rgba(255, 181, 71, ${intensity}) 0%, rgba(21, 24, 29, 0.94) 68%), var(--ink-900)`;
      case 'ux-architect':
        // Orange glow
        return `radial-gradient(circle at 50% 0%, rgba(255, 107, 53, ${intensity}) 0%, rgba(21, 24, 29, 0.94) 68%), var(--ink-900)`;
      case 'ui-designer':
        // Ember glow
        return `radial-gradient(circle at 50% 0%, rgba(255, 77, 46, ${intensity}) 0%, rgba(21, 24, 29, 0.94) 68%), var(--ink-900)`;
      case 'engineer':
        // Forge-deep glow
        return `radial-gradient(circle at 50% 0%, rgba(200, 68, 25, ${
          isExpanded ? '0.34' : '0.22'
        }) 0%, rgba(21, 24, 29, 0.94) 68%), var(--ink-900)`;
      default:
        // QA: Pale warm white glow
        return `radial-gradient(circle at 50% 0%, rgba(244, 245, 247, ${
          isExpanded ? '0.20' : '0.12'
        }) 0%, rgba(255, 181, 71, 0.06) 42%, rgba(21, 24, 29, 0.95) 72%), var(--ink-900)`;
    }
  };

  const handleCardMouseMove = (
    e: React.MouseEvent<HTMLButtonElement>,
    roleId: string
  ) => {
    if (prefersReducedMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setSpotlights((prev) => ({
      ...prev,
      [roleId]: {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active: true,
      },
    }));
  };

  const handleCardMouseLeave = (roleId: string) => {
    setSpotlights((prev) => ({
      ...prev,
      [roleId]: { ...(prev[roleId] || { x: 0, y: 0 }), active: false },
    }));
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLButtonElement>,
    idx: number,
    roleId: string
  ) => {
    const count = team.roles.length;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIdx = (idx + 1) % count;
      cardButtonRefs.current[nextIdx]?.focus();
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      const prevIdx = (idx - 1 + count) % count;
      cardButtonRefs.current[prevIdx]?.focus();
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setActiveRoleId((prev) => (prev === roleId ? null : roleId));
    }
  };

  const activeIndex = team.roles.findIndex((r) => r.id === activeRoleId);

  return (
    <RevealSection
      backgroundStyle="var(--bg-section-team)"
      dividerType="angle"
      glowBlob={{ tone: 'amber', positionClass: 'top-[10%] left-[8%]' }}
    >
      <div ref={sectionRef}>
        <div className="mb-[var(--space-48)]">
          <WordRevealHeading
            text={team.headline}
            className="type-heading-xl text-[var(--paper)]"
          />
        </div>

        {/* DESKTOP: 5 Slanted Parallelogram Panels in a Single Row */}
        <div
          onMouseLeave={() => setActiveRoleId(null)}
          className="hidden lg:flex items-stretch gap-[var(--space-12)] px-[var(--space-24)] min-h-[470px]"
        >
          {team.roles.map((item: TeamRoleCard, idx: number) => {
            const isExpanded = activeRoleId === item.id;
            const hasSelection = activeRoleId !== null;
            const isCompressed = hasSelection && !isExpanded;

            // Skew angles: default -8deg; expanded straightens slightly (-4deg); compressed skews harder (-14deg)
            const skewDeg = prefersReducedMotion
              ? 0
              : isExpanded
              ? -4
              : isCompressed
              ? -14
              : -8;

            const shiftX =
              prefersReducedMotion || !isCompressed || activeIndex === -1
                ? 0
                : idx < activeIndex
                ? -8
                : 8;

            const staggerDelay =
              prefersReducedMotion || activeIndex === -1
                ? 0
                : Math.abs(idx - activeIndex) * 0.028;

            const spot = spotlights[item.id];

            return (
              <motion.button
                key={item.id}
                ref={(el) => {
                  cardButtonRefs.current[idx] = el;
                }}
                type="button"
                aria-expanded={isExpanded}
                onMouseEnter={() => setActiveRoleId(item.id)}
                onMouseMove={(e) => handleCardMouseMove(e, item.id)}
                onMouseLeave={() => handleCardMouseLeave(item.id)}
                onClick={() =>
                  setActiveRoleId((prev) => (prev === item.id ? null : item.id))
                }
                onKeyDown={(e) => handleKeyDown(e, idx, item.id)}
                animate={{
                  flexGrow: isExpanded ? 3.1 : isCompressed ? 0.85 : 1,
                  skewX: skewDeg,
                  x: shiftX,
                  opacity: isCompressed ? 0.62 : 1,
                }}
                transition={
                  prefersReducedMotion
                    ? { duration: 0.2 }
                    : {
                        type: 'spring',
                        stiffness: 145,
                        damping: 22,
                        mass: 0.9,
                        delay: staggerDelay,
                      }
                }
                style={{
                  flexBasis: 0,
                  background: getRoleSurfaceGradient(item.id, isExpanded),
                }}
                className={`group relative rounded-[var(--radius-16)] p-[var(--space-24)] border text-left overflow-hidden flex flex-col justify-between cursor-pointer transition-colors duration-[var(--duration-fast)] min-w-0 ${
                  isExpanded
                    ? 'border-[var(--forge)]'
                    : 'border-[var(--border-color-strong)] hover:border-[var(--border-color-accent)]'
                }`}
              >
                {/* Cursor-Following Spotlight Glow Inside Each Panel */}
                {spot?.active && !prefersReducedMotion && (
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 transition-opacity duration-200"
                    style={{
                      background: `radial-gradient(260px circle at ${spot.x}px ${spot.y}px, rgba(255, 107, 53, 0.20), transparent 70%)`,
                    }}
                  />
                )}

                {/* Counter-Skewed Inner Container so Text Stays Upright and Readable */}
                <motion.div
                  animate={{ skewX: -skewDeg }}
                  transition={
                    prefersReducedMotion
                      ? { duration: 0.2 }
                      : {
                          type: 'spring',
                          stiffness: 145,
                          damping: 22,
                          mass: 0.9,
                        }
                  }
                  className="relative z-10 w-full h-full flex flex-col justify-between"
                >
                  {/* Top Header: Large Outlined Number (01 to 05) in Space Grotesk + Artifact Tag */}
                  <div>
                    <div className="flex items-start justify-between gap-[var(--space-8)] mb-[var(--space-24)]">
                      <span
                        className={`text-outline-display select-none ${
                          isExpanded ? 'text-outline-display-active' : ''
                        }`}
                      >
                        0{idx + 1}
                      </span>
                      <span
                        className={`type-caption font-[var(--font-mono)] transition-opacity duration-200 ${
                          isCompressed
                            ? 'opacity-0'
                            : isExpanded
                            ? 'text-[var(--amber)] opacity-100'
                            : 'text-[var(--ink-300)] opacity-85'
                        }`}
                      >
                        {item.artifact}
                      </span>
                    </div>

                    {/* Role Name */}
                    <h3 className="type-heading-m text-[var(--paper)] mb-[var(--space-12)] whitespace-nowrap truncate">
                      {item.role}
                    </h3>
                  </div>

                  {/* Expanded Content: Description + 3 Capability Chips + Looping Role Visual */}
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        key="expanded-details"
                        initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: prefersReducedMotion ? 0 : 8 }}
                        transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                        className="flex flex-col justify-end gap-[var(--space-16)] pt-[var(--space-16)] border-t border-[var(--border-color-default)]"
                      >
                        <p className="type-body-m text-[var(--ink-300)]">
                          {item.description}
                        </p>

                        {/* 3 Short Capability Chips */}
                        <div className="flex flex-wrap gap-[var(--space-8)]">
                          {item.capabilities.map((chip) => (
                            <span
                              key={chip}
                              className="px-[var(--space-12)] py-[var(--space-4)] rounded-[var(--radius-pill)] bg-[var(--ink-950)] border border-[var(--border-color-accent)] type-caption font-[var(--font-mono)] text-[var(--paper)]"
                            >
                              {chip}
                            </span>
                          ))}
                        </div>

                        {/* Small Looping Animated Visual Specific to the Role */}
                        <RoleLoopingVisual
                          roleId={item.id}
                          isExpanded={isExpanded && isSectionInView}
                          prefersReducedMotion={Boolean(prefersReducedMotion)}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Default / Compressed Bottom Hint */}
                  {!isExpanded && (
                    <div className="pt-[var(--space-16)] border-t border-[var(--border-color-default)] flex items-center justify-between">
                      <span className="type-mono text-[var(--ink-300)] truncate">
                        {isCompressed ? `0${idx + 1}` : 'INSPECT ROLE'}
                      </span>
                      <span
                        className="w-[6px] h-[6px] rounded-[var(--radius-pill)] bg-[var(--forge)] shrink-0"
                        aria-hidden="true"
                      />
                    </div>
                  )}
                </motion.div>
              </motion.button>
            );
          })}
        </div>

        {/* MOBILE & TABLET (< lg): Vertical Accordion Stack (No Skew) */}
        <div className="flex lg:hidden flex-col gap-[var(--space-12)]">
          {team.roles.map((item: TeamRoleCard, idx: number) => {
            const isExpanded = activeRoleId === item.id;
            return (
              <div
                key={item.id}
                style={{
                  background: getRoleSurfaceGradient(item.id, isExpanded),
                }}
                className={`rounded-[var(--radius-12)] border transition-colors duration-[var(--duration-fast)] overflow-hidden ${
                  isExpanded
                    ? 'border-[var(--forge)]'
                    : 'border-[var(--border-color-strong)]'
                }`}
              >
                <button
                  type="button"
                  aria-expanded={isExpanded}
                  onClick={() =>
                    setActiveRoleId((prev) =>
                      prev === item.id ? null : item.id
                    )
                  }
                  onKeyDown={(e) => handleKeyDown(e, idx, item.id)}
                  className="w-full p-[var(--space-24)] text-left flex items-center justify-between gap-[var(--space-16)] cursor-pointer"
                >
                  <div className="flex items-center gap-[var(--space-16)] min-w-0">
                    <span
                      className={`text-outline-display ${
                        isExpanded ? 'text-outline-display-active' : ''
                      }`}
                    >
                      0{idx + 1}
                    </span>
                    <div className="min-w-0">
                      <h3 className="type-heading-s text-[var(--paper)] truncate">
                        {item.role}
                      </h3>
                      <span className="type-caption font-[var(--font-mono)] text-[var(--ink-300)]">
                        {item.artifact}
                      </span>
                    </div>
                  </div>
                  <ChevronDown
                    size={18}
                    className={`shrink-0 transition-transform duration-200 ${
                      isExpanded
                        ? 'rotate-180 text-[var(--forge)]'
                        : 'text-[var(--ink-300)]'
                    }`}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-[var(--space-24)] pb-[var(--space-24)] pt-[var(--space-8)] border-t border-[var(--border-color-default)] flex flex-col gap-[var(--space-16)]">
                        <p className="type-body-m text-[var(--ink-300)]">
                          {item.description}
                        </p>
                        <div className="flex flex-wrap gap-[var(--space-8)]">
                          {item.capabilities.map((chip) => (
                            <span
                              key={chip}
                              className="px-[var(--space-12)] py-[var(--space-4)] rounded-[var(--radius-pill)] bg-[var(--ink-950)] border border-[var(--border-color-accent)] type-caption font-[var(--font-mono)] text-[var(--paper)]"
                            >
                              {chip}
                            </span>
                          ))}
                        </div>
                        <RoleLoopingVisual
                          roleId={item.id}
                          isExpanded={isExpanded && isSectionInView}
                          prefersReducedMotion={Boolean(prefersReducedMotion)}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </RevealSection>
  );
};

/* ==========================================================================
   9. SECTION: Examples (id: examples)
   Gentle 3D tilt (max ~8deg), moving light reflection across the surface,
   and mini-mockup layers floating at slightly different depths (parallax).
   On hover the card lifts and its border lights up in orange.
   ========================================================================== */
const TiltExampleCard: React.FC<{
  project: ExampleProjectCard;
  prefersReducedMotion: boolean;
  children: (parallax: { x: number; y: number; active: boolean }) => React.ReactNode;
}> = ({ project, prefersReducedMotion, children }) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [tiltState, setTiltState] = useState<{
    rotateX: number;
    rotateY: number;
    glareX: number;
    glareY: number;
    normX: number;
    normY: number;
    hovered: boolean;
  }>({
    rotateX: 0,
    rotateY: 0,
    glareX: 50,
    glareY: 50,
    normX: 0,
    normY: 0,
    hovered: false,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width; // 0 to 1
    const relY = (e.clientY - rect.top) / rect.height; // 0 to 1

    const normX = (relX - 0.5) * 2; // -1 to 1
    const normY = (relY - 0.5) * 2; // -1 to 1

    // Max ~8deg gentle 3D tilt
    const rotateY = normX * 7.5;
    const rotateX = -normY * 7.5;

    setTiltState({
      rotateX,
      rotateY,
      glareX: relX * 100,
      glareY: relY * 100,
      normX,
      normY,
      hovered: true,
    });
  };

  const handleMouseLeave = () => {
    setTiltState({
      rotateX: 0,
      rotateY: 0,
      glareX: 50,
      glareY: 50,
      normX: 0,
      normY: 0,
      hovered: false,
    });
  };

  return (
    <div style={{ perspective: '1100px' }} className="w-full">
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() =>
          setTiltState((prev) => ({ ...prev, hovered: true }))
        }
        onMouseLeave={handleMouseLeave}
        animate={
          prefersReducedMotion
            ? { rotateX: 0, rotateY: 0, y: 0 }
            : {
                rotateX: tiltState.rotateX,
                rotateY: tiltState.rotateY,
                y: tiltState.hovered ? -6 : 0,
              }
        }
        transition={{
          type: 'spring',
          stiffness: 220,
          damping: 22,
          mass: 0.6,
        }}
        style={{ transformStyle: 'preserve-3d' }}
        className={`relative rounded-[var(--radius-16)] bg-[var(--ink-800)] p-[var(--space-16)] sm:p-[var(--space-24)] flex flex-col justify-between gap-[var(--space-24)] border transition-colors duration-[var(--duration-fast)] overflow-hidden ${
          tiltState.hovered
            ? 'border-[var(--forge)]'
            : 'border-[var(--border-color-default)]'
        }`}
      >
        {/* Moving Light Reflection Across the Surface */}
        {tiltState.hovered && !prefersReducedMotion && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-20 transition-opacity duration-200"
            style={{
              background: `radial-gradient(380px circle at ${tiltState.glareX}% ${tiltState.glareY}%, rgba(255, 138, 92, 0.16), rgba(255, 255, 255, 0.06) 38%, transparent 70%)`,
            }}
          />
        )}

        {/* Parallax Mini-Mockup Container */}
        <div className="relative z-10">
          {children({
            x: prefersReducedMotion ? 0 : tiltState.normX,
            y: prefersReducedMotion ? 0 : tiltState.normY,
            active: tiltState.hovered,
          })}
        </div>

        {/* Floating Metadata Layer */}
        <motion.div
          animate={
            prefersReducedMotion
              ? { x: 0, y: 0 }
              : {
                  x: tiltState.normX * 4,
                  y: tiltState.normY * 4,
                }
          }
          transition={{ type: 'spring', stiffness: 220, damping: 22 }}
          className="relative z-10"
        >
          <div className="flex flex-wrap items-center justify-between gap-[var(--space-8)] mb-[var(--space-8)]">
            <h3 className="type-heading-m text-[var(--paper)]">
              {project.name}
            </h3>
            <span className="type-mono text-[var(--forge-soft)]">
              {project.domainTag}
            </span>
          </div>
          <p className="type-body-m text-[var(--ink-300)]">
            {project.description}
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export const ExamplesSection: React.FC = () => {
  const { examples } = SITE_CONTENT.sections;
  const prefersReducedMotion = useReducedMotion();

  const [studyDone, setStudyDone] = useState<Record<number, boolean>>({
    0: true,
    1: false,
    2: false,
  });
  const [invoicePaid, setInvoicePaid] = useState<boolean>(false);
  const [streakDays, setStreakDays] = useState<boolean[]>([
    true,
    true,
    true,
    false,
    true,
    true,
    false,
  ]);

  const renderMiniMockup = (
    projectId: string,
    parallax: { x: number; y: number; active: boolean }
  ) => {
    const headerLayerStyle = {
      transform: `translate3d(${parallax.x * 5}px, ${parallax.y * 5}px, 0px)`,
      transition: 'transform 120ms cubic-bezier(0.22, 1, 0.36, 1)',
    };
    const bodyLayerStyle = {
      transform: `translate3d(${parallax.x * 10}px, ${parallax.y * 10}px, 0px)`,
      transition: 'transform 120ms cubic-bezier(0.22, 1, 0.36, 1)',
    };

    switch (projectId) {
      case 'pulse':
        return (
          <div className="w-full min-h-[180px] rounded-[var(--radius-8)] bg-[var(--ink-950)] border border-[var(--border-color-default)] p-[var(--space-16)] flex flex-col justify-between overflow-hidden">
            <div
              style={headerLayerStyle}
              className="flex items-center justify-between gap-[var(--space-8)]"
            >
              <div>
                <div className="type-caption font-[var(--font-mono)] text-[var(--ink-300)]">
                  SAFE TO SPEND
                </div>
                <div className="type-heading-s text-[var(--paper)] tabular-nums">
                  $342.80
                </div>
              </div>
              <span className="type-caption font-[var(--font-mono)] text-[var(--amber)]">
                WK 06
              </span>
            </div>
            <div
              style={bodyLayerStyle}
              className="grid grid-cols-7 gap-[var(--space-4)] items-end h-[68px]"
            >
              {[42, 68, 35, 88, 54, 76, 48].map((h, i) => (
                <div
                  key={i}
                  style={{ height: `${h}%` }}
                  className={`w-full rounded-[2px] ${
                    i === 3 ? 'bg-[var(--forge)]' : 'bg-[var(--ink-700)]'
                  }`}
                />
              ))}
            </div>
          </div>
        );

      case 'studysync':
        return (
          <div className="w-full min-h-[180px] rounded-[var(--radius-8)] bg-[var(--ink-950)] border border-[var(--border-color-default)] p-[var(--space-16)] flex flex-col justify-between gap-[var(--space-12)] overflow-hidden">
            <div
              style={headerLayerStyle}
              className="flex flex-wrap items-center justify-between gap-[var(--space-8)] pb-[var(--space-8)] border-b border-[var(--border-color-default)]"
            >
              <span className="type-caption font-[var(--font-mono)] text-[var(--ink-300)]">
                SHARED DEADLINES
              </span>
              <span className="type-caption font-[var(--font-mono)] text-[var(--forge-soft)]">
                CS-302 COHORT
              </span>
            </div>
            <div
              style={bodyLayerStyle}
              className="flex flex-col gap-[var(--space-8)]"
            >
              {[
                { label: 'Distributed Systems Lab 4', due: 'THU 17:00' },
                { label: 'Compiler AST Peer Review', due: 'FRI 12:00' },
                { label: 'Linear Algebra Problem Set', due: 'MON 09:00' },
              ].map((task, idx) => {
                const checked = Boolean(studyDone[idx]);
                return (
                  <button
                    key={task.label}
                    type="button"
                    onClick={() =>
                      setStudyDone((prev) => ({ ...prev, [idx]: !prev[idx] }))
                    }
                    className="flex items-center justify-between text-left py-[var(--space-4)] px-[var(--space-8)] rounded-[var(--radius-4)] bg-[var(--ink-900)] border border-[var(--border-color-default)] hover:border-[var(--border-color-strong)] cursor-pointer"
                  >
                    <div className="flex items-center gap-[var(--space-8)] min-w-0">
                      <span
                        className={`w-[12px] h-[12px] rounded-[2px] border flex items-center justify-center shrink-0 ${
                          checked
                            ? 'bg-[var(--forge)] border-[var(--forge)] text-[var(--ink-950)]'
                            : 'border-[var(--ink-300)]'
                        }`}
                      >
                        {checked && <Check size={9} />}
                      </span>
                      <span
                        className={`type-caption truncate ${
                          checked
                            ? 'line-through text-[var(--ink-300)]'
                            : 'text-[var(--paper)]'
                        }`}
                      >
                        {task.label}
                      </span>
                    </div>
                    <span className="type-caption font-[var(--font-mono)] text-[var(--ink-300)] shrink-0 ml-[var(--space-8)]">
                      {task.due}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        );

      case 'invoicely':
        return (
          <div className="w-full min-h-[180px] rounded-[var(--radius-8)] bg-[var(--ink-950)] border border-[var(--border-color-default)] p-[var(--space-16)] flex flex-col justify-between overflow-hidden">
            <div
              style={headerLayerStyle}
              className="flex flex-wrap items-center justify-between gap-[var(--space-8)]"
            >
              <div>
                <div className="type-caption font-[var(--font-mono)] text-[var(--ink-300)]">
                  INVOICE #INV-204
                </div>
                <div className="type-heading-s text-[var(--paper)] tabular-nums">
                  $2,850.00
                </div>
              </div>
              <button
                type="button"
                onClick={() => setInvoicePaid((p) => !p)}
                className={`px-[var(--space-8)] py-[var(--space-4)] rounded-[var(--radius-4)] bg-[var(--ink-800)] border type-caption font-[var(--font-mono)] cursor-pointer transition-colors ${
                  invoicePaid
                    ? 'border-[var(--border-color-accent)] text-[var(--forge-soft)]'
                    : 'border-[var(--border-color-strong)] text-[var(--paper)]'
                }`}
              >
                {invoicePaid ? 'STATUS · PAID' : 'MARK PAID'}
              </button>
            </div>

            <div
              style={bodyLayerStyle}
              className="flex flex-col gap-[var(--space-8)]"
            >
              <div className="flex justify-between gap-[var(--space-8)] type-caption font-[var(--font-mono)] text-[var(--ink-300)]">
                <span className="truncate">Design Systems Retainer</span>
                <span className="shrink-0">$2,850.00</span>
              </div>
              <div className="w-full h-[6px] rounded-[var(--radius-pill)] bg-[var(--ink-800)] overflow-hidden">
                <div
                  style={{
                    width: invoicePaid ? '100%' : '65%',
                    background:
                      'linear-gradient(90deg, var(--forge) 0%, var(--amber) 100%)',
                  }}
                  className="h-full transition-all duration-[var(--duration-fast)]"
                />
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="w-full min-h-[180px] rounded-[var(--radius-8)] bg-[var(--ink-950)] border border-[var(--border-color-default)] p-[var(--space-16)] flex flex-col justify-between gap-[var(--space-12)] overflow-hidden">
            <div
              style={headerLayerStyle}
              className="flex flex-wrap items-center justify-between gap-[var(--space-8)]"
            >
              <span className="type-caption font-[var(--font-mono)] text-[var(--ink-300)]">
                WEEKLY GOAL · 5 DAYS
              </span>
              <span className="type-caption font-[var(--font-mono)] text-[var(--amber)]">
                {streakDays.filter(Boolean).length} / 7 COMPLETED
              </span>
            </div>

            <div
              style={bodyLayerStyle}
              className="grid grid-cols-7 gap-[var(--space-4)] sm:gap-[var(--space-8)]"
            >
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => {
                const active = streakDays[i];
                return (
                  <button
                    key={i}
                    type="button"
                    aria-label={`Toggle day ${d}`}
                    aria-pressed={active}
                    onClick={() =>
                      setStreakDays((prev) =>
                        prev.map((val, idx) => (idx === i ? !val : val))
                      )
                    }
                    className={`h-[56px] rounded-[var(--radius-4)] border flex flex-col items-center justify-center gap-[var(--space-4)] transition-colors cursor-pointer ${
                      active
                        ? 'bg-[var(--ink-800)] border-[var(--border-color-accent)] text-[var(--paper)]'
                        : 'bg-[var(--ink-900)] border-[var(--border-color-default)] text-[var(--ink-300)]'
                    }`}
                  >
                    <span className="type-caption font-[var(--font-mono)]">
                      {d}
                    </span>
                    <span
                      className={`w-[6px] h-[6px] rounded-[var(--radius-pill)] ${
                        active ? 'bg-[var(--forge)]' : 'bg-[var(--ink-700)]'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>
        );
    }
  };

  return (
    <RevealSection
      id={examples.id}
      backgroundStyle="var(--bg-section-examples)"
      dividerType="curve"
      glowBlob={{ tone: 'forge', positionClass: 'bottom-[15%] right-[10%]' }}
    >
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-[var(--space-12)] mb-[var(--space-48)]">
        <WordRevealHeading
          text={examples.headline}
          className="type-heading-xl text-[var(--paper)]"
        />
        <span className="type-mono text-[var(--ink-300)]">{examples.note}</span>
      </div>

      {/* 4 Example Project Cards with 3D Tilt, Glare Reflection & Layer Parallax */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-[var(--space-24)]">
        {examples.projects.map((project) => (
          <TiltExampleCard
            key={project.id}
            project={project}
            prefersReducedMotion={Boolean(prefersReducedMotion)}
          >
            {(parallax) => renderMiniMockup(project.id, parallax)}
          </TiltExampleCard>
        ))}
      </div>
    </RevealSection>
  );
};

/* ==========================================================================
   10. SECTION: Pricing (id: pricing)
   Bright Contrast Break: Paper (#F4F5F7) background with dark ink text,
   and the Pro card in dark ink with an orange border.
   ========================================================================== */
export const PricingSection: React.FC<{
  onSelectPlan: (tierName: string) => void;
}> = ({ onSelectPlan }) => {
  const { pricing } = SITE_CONTENT.sections;
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.section
      id={pricing.id}
      initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        duration: prefersReducedMotion ? 0 : 0.45,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="relative w-full bg-[var(--paper)] text-[var(--ink-950)] pt-[var(--space-80)] md:pt-[var(--space-128)] pb-[var(--space-80)] md:pb-[var(--space-128)] overflow-hidden"
    >
      {/* Top Curved SVG Divider Transition from Dark Ink into Paper */}
      <svg
        aria-hidden="true"
        viewBox="0 0 1440 44"
        preserveAspectRatio="none"
        className="pointer-events-none absolute top-0 left-0 w-full h-[28px] sm:h-[44px]"
      >
        <path
          d="M0,0 L1440,0 L1440,10 Q720,44 0,10 Z"
          fill="var(--ink-900)"
        />
      </svg>

      {/* Subtle Warm Radial Glow on Paper behind the Pro Card */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 50% 55%, rgba(255, 107, 53, 0.10) 0%, transparent 60%)',
        }}
      />

      <div className="forge-container relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-[var(--space-12)] mb-[var(--space-48)]">
          <WordRevealHeading
            text={pricing.headline}
            className="type-heading-xl text-[var(--ink-950)]"
          />
          <span className="type-mono text-[var(--ink-on-paper-muted)] font-medium">
            {pricing.note}
          </span>
        </div>

        {/* 3 Pricing Tiers */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-[var(--space-24)] items-stretch">
          {pricing.tiers.map((tier) => {
            const isPro = tier.highlighted;
            return (
              <div
                key={tier.id}
                className={`rounded-[var(--radius-16)] p-[var(--space-24)] sm:p-[var(--space-32)] flex flex-col justify-between transition-colors duration-[var(--duration-fast)] ${
                  isPro
                    ? 'bg-[var(--ink-900)] text-[var(--paper)] border-2 border-[var(--forge)]'
                    : 'bg-[var(--paper-elevated)] text-[var(--ink-950)] border border-[var(--border-color-on-paper)] hover:border-[var(--border-color-on-paper-strong)]'
                }`}
              >
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-[var(--space-8)] mb-[var(--space-16)]">
                    <h3
                      className={`type-heading-m ${
                        isPro ? 'text-[var(--paper)]' : 'text-[var(--ink-950)]'
                      }`}
                    >
                      {tier.name}
                    </h3>
                    {isPro && (
                      <span className="type-mono text-[var(--forge-soft)] font-semibold">
                        RECOMMENDED
                      </span>
                    )}
                  </div>

                  <div
                    className={`type-heading-l tracking-tight mb-[var(--space-24)] tabular-nums ${
                      isPro ? 'text-[var(--paper)]' : 'text-[var(--ink-950)]'
                    }`}
                  >
                    {tier.price}
                  </div>

                  <ul
                    className={`flex flex-col gap-[var(--space-12)] mb-[var(--space-32)] pt-[var(--space-24)] border-t ${
                      isPro
                        ? 'border-[var(--border-color-default)]'
                        : 'border-[var(--border-color-on-paper)]'
                    }`}
                  >
                    {tier.features.map((feat) => (
                      <li
                        key={feat}
                        className={`flex items-center gap-[var(--space-12)] type-body-m ${
                          isPro
                            ? 'text-[var(--ink-300)]'
                            : 'text-[var(--ink-on-paper-muted)]'
                        }`}
                      >
                        <Check
                          size={16}
                          className={`shrink-0 ${
                            isPro
                              ? 'text-[var(--forge)]'
                              : 'text-[var(--forge-deep)]'
                          }`}
                        />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {isPro ? (
                  <MagneticButton
                    type="button"
                    onClick={() => onSelectPlan(tier.name)}
                    className="w-full py-[var(--space-12)] px-[var(--space-24)] rounded-[var(--radius-8)] type-body-s font-medium whitespace-nowrap cursor-pointer transition-colors btn-primary-forge"
                  >
                    {tier.ctaLabel}
                  </MagneticButton>
                ) : (
                  <button
                    type="button"
                    onClick={() => onSelectPlan(tier.name)}
                    className="w-full py-[var(--space-12)] px-[var(--space-24)] rounded-[var(--radius-8)] type-body-s font-medium whitespace-nowrap cursor-pointer transition-colors bg-[var(--ink-950)] hover:bg-[var(--ink-800)] text-[var(--paper)] border border-[var(--ink-950)]"
                  >
                    {tier.ctaLabel}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Curved SVG Divider Transition from Paper back to Dark Ink */}
      <svg
        aria-hidden="true"
        viewBox="0 0 1440 44"
        preserveAspectRatio="none"
        className="pointer-events-none absolute bottom-0 left-0 w-full h-[28px] sm:h-[44px]"
      >
        <path
          d="M0,44 L1440,44 L1440,34 Q720,0 0,34 Z"
          fill="var(--ink-800)"
        />
      </svg>
    </motion.section>
  );
};

/* ==========================================================================
   11. SECTION: FAQ
   ========================================================================== */
export const FaqSection: React.FC = () => {
  const { faq } = SITE_CONTENT.sections;
  const prefersReducedMotion = useReducedMotion();
  const [openId, setOpenId] = useState<string | null>(faq.items[0]?.id ?? null);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLButtonElement>,
    index: number
  ) => {
    const count = faq.items.length;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      buttonRefs.current[(index + 1) % count]?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      buttonRefs.current[(index - 1 + count) % count]?.focus();
    } else if (e.key === 'Home') {
      e.preventDefault();
      buttonRefs.current[0]?.focus();
    } else if (e.key === 'End') {
      e.preventDefault();
      buttonRefs.current[count - 1]?.focus();
    }
  };

  return (
    <RevealSection
      id="faq"
      backgroundStyle="var(--bg-section-faq)"
      dividerType="none"
      glowBlob={{ tone: 'amber', positionClass: 'top-[20%] right-[15%]' }}
    >
      <div className="forge-grid">
        <div className="col-span-4 md:col-span-8 lg:col-span-5">
          <WordRevealHeading
            text={faq.headline}
            className="type-heading-xl text-[var(--paper)] mb-[var(--space-16)]"
          />
        </div>

        <div className="col-span-4 md:col-span-8 lg:col-span-7 flex flex-col divide-y divide-[var(--border-color-default)] border-t border-b border-[var(--border-color-default)]">
          {faq.items.map((item, idx) => {
            const isOpen = openId === item.id;
            const buttonId = `faq-trigger-${item.id}`;
            const panelId = `faq-panel-${item.id}`;

            return (
              <div key={item.id} className="py-[var(--space-24)]">
                <h3>
                  <button
                    ref={(el) => {
                      buttonRefs.current[idx] = el;
                    }}
                    id={buttonId}
                    type="button"
                    onClick={() => setOpenId(isOpen ? null : item.id)}
                    onKeyDown={(e) => handleKeyDown(e, idx)}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    className="w-full flex items-center justify-between gap-[var(--space-16)] text-left cursor-pointer group rounded-[var(--radius-4)] py-[var(--space-4)]"
                  >
                    <div className="flex items-baseline gap-[var(--space-16)]">
                      <span
                        className={`type-mono ${
                          isOpen
                            ? 'text-[var(--forge)] font-semibold'
                            : 'text-[var(--ink-300)]'
                        }`}
                      >
                        0{idx + 1}
                      </span>
                      <span className="type-heading-s text-[var(--paper)] group-hover:text-[var(--ink-300)] transition-colors">
                        {item.question}
                      </span>
                    </div>
                    <ChevronDown
                      size={18}
                      className={`shrink-0 transition-transform duration-[var(--duration-fast)] ${
                        isOpen
                          ? 'rotate-180 text-[var(--forge)]'
                          : 'text-[var(--ink-300)]'
                      }`}
                    />
                  </button>
                </h3>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={panelId}
                      role="region"
                      aria-labelledby={buttonId}
                      initial={
                        prefersReducedMotion
                          ? { opacity: 0 }
                          : { height: 0, opacity: 0 }
                      }
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={
                        prefersReducedMotion
                          ? { opacity: 0 }
                          : { height: 0, opacity: 0 }
                      }
                      transition={{
                        duration: prefersReducedMotion ? 0.12 : 0.22,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="overflow-hidden"
                    >
                      <p className="pt-[var(--space-16)] pl-[var(--space-32)] type-body-m text-[var(--ink-300)] max-w-[600px]">
                        {item.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </RevealSection>
  );
};

/* ==========================================================================
   12. SECTION: Final CTA
   Includes Parallax Geometric Logo Planes + Word Reveal Headline + Magnetic CTA
   ========================================================================== */
export const FinalCtaSection: React.FC<{
  onForgePromptSubmit: (idea: string) => void;
}> = ({ onForgePromptSubmit }) => {
  const { finalCta } = SITE_CONTENT.sections;
  const [ideaInput, setIdeaInput] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onForgePromptSubmit(
      ideaInput.trim().length > 0
        ? ideaInput.trim()
        : SITE_CONTENT.hero.defaultPrompt
    );
  };

  return (
    <RevealSection
      id="final-cta"
      backgroundStyle="var(--bg-section-final-cta)"
      dividerType="heat"
      glowBlob={{ tone: 'ember', positionClass: 'bottom-0 left-1/3' }}
    >
      <ParallaxLogoPlanes variant="final-cta" />

      <div className="relative z-10 rounded-[var(--radius-24)] bg-[var(--ink-900)] border border-[var(--border-color-accent)] p-[var(--space-24)] sm:p-[var(--space-48)] md:p-[var(--space-64)] overflow-hidden flex flex-col items-center text-center">
        {/* Subtle Heat Radial Glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{ background: 'var(--glow-forge-radial)' }}
        />

        <div className="relative z-10 w-full max-w-[680px] flex flex-col items-center">
          <WordRevealHeading
            text={finalCta.headline}
            className="type-display-m text-[var(--paper)] mb-[var(--space-16)]"
          />
          <p className="type-body-l text-[var(--ink-300)] mb-[var(--space-32)]">
            {finalCta.subtext}
          </p>

          <form onSubmit={handleSubmit} className="w-full">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-[var(--space-8)] p-[var(--space-8)] rounded-[var(--radius-12)] bg-[var(--ink-950)] border border-[var(--border-color-strong)] focus-within:border-[var(--forge)] transition-colors">
              <label htmlFor="final-cta-prompt" className="sr-only">
                {finalCta.promptPlaceholder}
              </label>
              <input
                id="final-cta-prompt"
                type="text"
                value={ideaInput}
                onChange={(e) => setIdeaInput(e.target.value)}
                placeholder={finalCta.promptPlaceholder}
                className="flex-1 min-w-0 bg-transparent px-[var(--space-16)] py-[var(--space-12)] type-mono text-[var(--paper)] placeholder:text-[var(--ink-300)] rounded-[var(--radius-8)]"
              />
              <MagneticButton
                type="submit"
                className="btn-primary-forge px-[var(--space-24)] py-[var(--space-12)] rounded-[var(--radius-8)] type-body-s whitespace-nowrap shrink-0 cursor-pointer"
              >
                {finalCta.buttonLabel}
              </MagneticButton>
            </div>
          </form>
        </div>
      </div>
    </RevealSection>
  );
};

/* ==========================================================================
   13. FOOTER (Unchanged)
   ========================================================================== */
export const Footer: React.FC<{
  onNavigateSection: (href: string) => void;
}> = ({ onNavigateSection }) => {
  const { footer } = SITE_CONTENT.sections;

  return (
    <footer className="w-full bg-[var(--ink-950)] border-t border-[var(--border-color-default)] pt-[var(--space-64)] pb-[var(--space-48)]">
      <div className="forge-container">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-[var(--space-32)] pb-[var(--space-48)] border-b border-[var(--border-color-default)]">
          {/* Brand Column */}
          <div className="md:col-span-4 flex flex-col justify-between gap-[var(--space-16)]">
            <div>
              <ForgeLogo />
              <p className="type-body-s text-[var(--ink-300)] mt-[var(--space-12)]">
                {SITE_CONTENT.brand.tagline}
              </p>
            </div>
            <div className="type-mono font-semibold tracking-[0.12em] text-[var(--ink-300)]">
              {footer.signatureLine}
            </div>
          </div>

          {/* 4 Navigation Columns: Product, Company, Resources, Legal */}
          <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-[var(--space-24)]">
            {footer.columns.map((col) => (
              <div key={col.id} className="flex flex-col gap-[var(--space-12)]">
                <div className="type-mono text-[var(--paper)] font-semibold">
                  {col.title}
                </div>
                <ul className="flex flex-col gap-[var(--space-8)]">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        onClick={(e) => {
                          e.preventDefault();
                          onNavigateSection(link.href);
                        }}
                        className="type-body-s text-[var(--ink-300)] hover:text-[var(--paper)] transition-colors rounded-[var(--radius-4)] inline-block py-[var(--space-4)]"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Copyright Row */}
        <div className="pt-[var(--space-24)] flex flex-col sm:flex-row items-center justify-between gap-[var(--space-12)]">
          <span className="type-mono text-[var(--ink-300)]">
            {footer.copyright}
          </span>
          <span className="type-mono text-[var(--ink-300)]">
            {footer.signatureLine}
          </span>
        </div>
      </div>
    </footer>
  );
};
