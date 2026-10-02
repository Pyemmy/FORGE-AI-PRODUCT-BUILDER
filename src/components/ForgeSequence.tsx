import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { Play, RotateCcw, Pause, ArrowDown } from 'lucide-react';
import { SITE_CONTENT, ForgeStage } from '../content/siteContent';

interface ForgeSequenceProps {
  activePrompt: string;
  sequenceTriggerCount: number;
  onSequenceActiveChange?: (isActive: boolean) => void;
}

export const ForgeSequence: React.FC<ForgeSequenceProps> = ({
  activePrompt,
  sequenceTriggerCount,
  onSequenceActiveChange,
}) => {
  const systemReducedMotion = useReducedMotion();
  const [manualReducedMotion, setManualReducedMotion] = useState(false);
  const isReducedMotion = Boolean(systemReducedMotion || manualReducedMotion);

  const stages = SITE_CONTENT.sequence.stages;

  // When prefers-reduced-motion is enabled, skip straight to the static final state (09 / 09 FORGED)
  const [currentStageIndex, setCurrentStageIndex] = useState<number>(() =>
    isReducedMotion ? stages.length - 1 : 0
  );
  const [isPlaying, setIsPlaying] = useState<boolean>(() => !isReducedMotion);

  // Sub-step within Stage 01 (false = prompt box, true = floating root node)
  const [promptNodeMorphed, setPromptNodeMorphed] = useState<boolean>(false);

  // Streaming character index for Stage 06 (CODE panel)
  const fullCode = SITE_CONTENT.sequence.splitPanels.codeSnippet;
  const [streamedCharCount, setStreamedCharCount] = useState<number>(fullCode.length);

  // Interactive hover state for Stage 07 (PULSE UI)
  const [hoveredBarIndex, setHoveredBarIndex] = useState<number | null>(3); // THU default
  const [selectedBudgetId, setSelectedBudgetId] = useState<string>('dining');
  const [userInteractingWithPulse, setUserInteractingWithPulse] = useState<boolean>(false);

  const lastTriggerRef = useRef<number>(sequenceTriggerCount);

  const currentStage: ForgeStage = stages[currentStageIndex] || stages[0];

  // Notify parent Hero so background grid brightens when sequence is actively forging
  useEffect(() => {
    onSequenceActiveChange?.(isPlaying || currentStage.id === 'forged');
  }, [isPlaying, currentStage.id, onSequenceActiveChange]);

  // If reduced motion turns on, jump to static final state immediately
  useEffect(() => {
    if (isReducedMotion) {
      setIsPlaying(false);
      setCurrentStageIndex(stages.length - 1);
      setStreamedCharCount(fullCode.length);
      setPromptNodeMorphed(true);
    }
  }, [isReducedMotion, stages.length, fullCode.length]);

  // Trigger sequence from hero prompt submission or "Watch it forge" click
  useEffect(() => {
    if (sequenceTriggerCount !== lastTriggerRef.current) {
      lastTriggerRef.current = sequenceTriggerCount;
      if (isReducedMotion) {
        setCurrentStageIndex(stages.length - 1);
        setIsPlaying(false);
      } else {
        setCurrentStageIndex(0);
        setPromptNodeMorphed(false);
        setIsPlaying(true);
      }
    }
  }, [sequenceTriggerCount, isReducedMotion, stages.length]);

  // Stage progression timer
  useEffect(() => {
    if (!isPlaying || isReducedMotion) return;

    const stage = stages[currentStageIndex];
    if (!stage) return;

    if (currentStageIndex === stages.length - 1) {
      setIsPlaying(false);
      return;
    }

    const timer = window.setTimeout(() => {
      setCurrentStageIndex((prev) => Math.min(prev + 1, stages.length - 1));
    }, stage.durationMs);

    return () => window.clearTimeout(timer);
  }, [isPlaying, isReducedMotion, currentStageIndex, stages]);

  // Stage 01 internal morph: prompt box -> floating node
  useEffect(() => {
    if (currentStage.id !== 'prompt') {
      setPromptNodeMorphed(true);
      return;
    }
    if (isReducedMotion) {
      setPromptNodeMorphed(true);
      return;
    }
    setPromptNodeMorphed(false);
    const morphTimer = window.setTimeout(() => {
      setPromptNodeMorphed(true);
    }, 1050);

    return () => window.clearTimeout(morphTimer);
  }, [currentStage.id, isReducedMotion]);

  // Stage 06 internal code character streaming
  useEffect(() => {
    if (currentStage.id !== 'synthesis') {
      setStreamedCharCount(fullCode.length);
      return;
    }
    if (isReducedMotion) {
      setStreamedCharCount(fullCode.length);
      return;
    }

    setStreamedCharCount(0);
    const totalChars = fullCode.length;
    const intervalMs = Math.max(8, Math.floor((currentStage.durationMs - 500) / totalChars));

    const interval = window.setInterval(() => {
      setStreamedCharCount((prev) => {
        if (prev >= totalChars) {
          window.clearInterval(interval);
          return totalChars;
        }
        return prev + 3;
      });
    }, intervalMs);

    return () => window.clearInterval(interval);
  }, [currentStage.id, currentStage.durationMs, fullCode.length, isReducedMotion]);

  // Stage 07 automated hover demo when user isn't actively hovering
  useEffect(() => {
    if (currentStage.id !== 'interactive' || isReducedMotion || userInteractingWithPulse) {
      return;
    }

    const demoSequence = [
      { bar: 1, budget: 'dining' },
      { bar: 3, budget: 'books' },
      { bar: 5, budget: 'transit' },
      { bar: 3, budget: 'dining' },
    ];
    let step = 0;

    const interval = window.setInterval(() => {
      const next = demoSequence[step % demoSequence.length];
      setHoveredBarIndex(next.bar);
      setSelectedBudgetId(next.budget);
      step += 1;
    }, 600);

    return () => window.clearInterval(interval);
  }, [currentStage.id, isReducedMotion, userInteractingWithPulse]);

  const handleStartOrReplay = () => {
    if (isReducedMotion) {
      setCurrentStageIndex(stages.length - 1);
      return;
    }
    setCurrentStageIndex(0);
    setPromptNodeMorphed(false);
    setIsPlaying(true);
  };

  const handleSelectStage = (index: number) => {
    setIsPlaying(false);
    setCurrentStageIndex(index);
  };

  const displayedPrompt =
    activePrompt.trim().length > 0
      ? activePrompt.trim()
      : SITE_CONTENT.hero.defaultPrompt;

  // Transition helper respecting prefers-reduced-motion (simple fade only when reduced motion is active)
  const stageTransition = isReducedMotion
    ? { duration: 0.12 }
    : { duration: 0.42, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] };

  // Render the PULSE UI card (used in Stage 05 full, Stage 06 left split, Stage 07 interactive)
  const renderPulseInterface = (mode: 'full' | 'split' | 'interactive') => {
    const pulse = SITE_CONTENT.sequence.pulseApp;
    const isInteractive = mode === 'interactive';

    return (
      <div
        onMouseEnter={() => isInteractive && setUserInteractingWithPulse(true)}
        onMouseLeave={() => isInteractive && setUserInteractingWithPulse(false)}
        className={`w-full bg-[var(--ink-900)] border border-[var(--border-color-strong)] rounded-[var(--radius-12)] overflow-hidden transition-colors duration-[var(--duration-fast)] ${
          mode === 'split' ? 'p-[var(--space-16)]' : 'p-[var(--space-16)] sm:p-[var(--space-24)]'
        }`}
      >
        {/* PULSE Top Bar */}
        <div className="flex flex-wrap items-center justify-between gap-[var(--space-8)] pb-[var(--space-16)] mb-[var(--space-16)] border-b border-[var(--border-color-default)]">
          <div className="flex items-center gap-[var(--space-8)]">
            <span className="w-[8px] h-[8px] rounded-[var(--radius-4)] bg-[var(--paper)] inline-block shrink-0" />
            <span className="type-body-s font-[var(--font-display)] font-semibold tracking-[0.06em] text-[var(--paper)]">
              {pulse.name}
            </span>
            <span className="text-[var(--ink-300)]" aria-hidden="true">
              ·
            </span>
            <span className="type-mono text-[var(--ink-300)]">{pulse.tag}</span>
          </div>
          <span className="type-mono text-[var(--ink-300)]">{pulse.semesterLabel}</span>
        </div>

        {/* PULSE Main Grid */}
        <div
          className={`grid gap-[var(--space-16)] ${
            mode === 'split' ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-12'
          }`}
        >
          {/* Left Column: Balance Card + Spending Chart */}
          <div
            className={`flex flex-col gap-[var(--space-16)] ${
              mode === 'split' ? '' : 'lg:col-span-7'
            }`}
          >
            {/* Balance Card */}
            <div
              className={`bg-[var(--ink-800)] border rounded-[var(--radius-8)] p-[var(--space-16)] transition-colors duration-[var(--duration-micro)] ${
                isInteractive
                  ? 'border-[var(--border-color-strong)] hover:border-[var(--paper)]'
                  : 'border-[var(--border-color-default)]'
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-[var(--space-12)]">
                <div>
                  <div className="type-mono text-[var(--ink-300)] mb-[var(--space-4)]">
                    {pulse.balanceLabel}
                  </div>
                  <div className="type-heading-m text-[var(--paper)] leading-none tabular-nums">
                    {hoveredBarIndex !== null && isInteractive
                      ? pulse.chartPoints[hoveredBarIndex]?.amount || pulse.balanceAmount
                      : pulse.balanceAmount}
                  </div>
                </div>
                <div className="text-left sm:text-right">
                  <div className="type-mono text-[var(--ink-300)] mb-[var(--space-4)]">
                    {pulse.totalBalanceLabel}
                  </div>
                  <div className="type-mono text-[var(--paper)] font-medium">
                    {pulse.totalBalanceAmount}
                  </div>
                </div>
              </div>
              <div className="mt-[var(--space-12)] pt-[var(--space-12)] border-t border-[var(--border-color-default)] flex flex-wrap items-center justify-between gap-[var(--space-8)] type-mono text-[var(--ink-300)]">
                <span>
                  {hoveredBarIndex !== null && isInteractive
                    ? `Selected day: ${pulse.chartPoints[hoveredBarIndex]?.day} campus ledger`
                    : pulse.deltaLabel}
                </span>
                <span>AUTO-SYNC</span>
              </div>
            </div>

            {/* Spending Chart */}
            <div className="bg-[var(--ink-800)] border border-[var(--border-color-default)] rounded-[var(--radius-8)] p-[var(--space-16)]">
              <div className="flex flex-wrap items-center justify-between gap-[var(--space-8)] mb-[var(--space-12)]">
                <span className="type-mono text-[var(--ink-300)]">{pulse.chartTitle}</span>
                {isInteractive && (
                  <span className="type-mono text-[var(--paper)]">
                    HOVER OR TAB BARS
                  </span>
                )}
              </div>

              <div className="grid grid-cols-7 gap-[var(--space-4)] sm:gap-[var(--space-8)] items-end h-[96px] pt-[var(--space-12)]">
                {pulse.chartPoints.map((pt, idx) => {
                  const isHighlighted = isInteractive && hoveredBarIndex === idx;
                  return (
                    <button
                      key={pt.day}
                      type="button"
                      onMouseEnter={() => setHoveredBarIndex(idx)}
                      onFocus={() => setHoveredBarIndex(idx)}
                      onClick={() => setHoveredBarIndex(idx)}
                      className="group/bar flex flex-col items-center justify-end h-full gap-[var(--space-8)] cursor-pointer rounded-[var(--radius-4)]"
                      aria-label={`${pt.day}: ${pt.amount}`}
                    >
                      <div className="w-full h-[68px] flex items-end justify-center bg-[var(--ink-900)] rounded-[var(--radius-4)] p-[2px] border border-[var(--border-color-default)]">
                        <motion.div
                          initial={isReducedMotion ? false : { scaleY: 0 }}
                          animate={{ scaleY: 1 }}
                          transition={{
                            duration: isReducedMotion ? 0 : 0.35,
                            delay: isReducedMotion ? 0 : idx * 0.04,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                          style={{ height: `${pt.value}%`, originY: 1 }}
                          className={`w-full rounded-[2px] transition-colors duration-[var(--duration-micro)] ${
                            isHighlighted
                              ? 'bg-[var(--paper)]'
                              : 'bg-[var(--ink-300)] group-hover/bar:bg-[var(--paper)]'
                          }`}
                        />
                      </div>
                      <span
                        className={`type-caption font-[var(--font-mono)] transition-colors duration-[var(--duration-micro)] ${
                          isHighlighted ? 'text-[var(--paper)] font-semibold' : 'text-[var(--ink-300)]'
                        }`}
                      >
                        {pt.day}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Budget Envelopes List */}
          {mode !== 'split' && (
            <div className="lg:col-span-5 bg-[var(--ink-800)] border border-[var(--border-color-default)] rounded-[var(--radius-8)] p-[var(--space-16)] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-[var(--space-16)]">
                  <span className="type-mono text-[var(--ink-300)]">
                    {pulse.budgetsTitle}
                  </span>
                  <span className="type-mono text-[var(--ink-300)]">3 ACTIVE</span>
                </div>

                <div className="flex flex-col gap-[var(--space-12)]">
                  {pulse.budgets.map((item) => {
                    const isSelected = isInteractive && selectedBudgetId === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onMouseEnter={() => setSelectedBudgetId(item.id)}
                        onClick={() => setSelectedBudgetId(item.id)}
                        className={`w-full text-left p-[var(--space-12)] rounded-[var(--radius-8)] border transition-colors duration-[var(--duration-micro)] cursor-pointer ${
                          isSelected
                            ? 'bg-[var(--ink-900)] border-[var(--paper)]'
                            : 'bg-[var(--ink-900)] border-[var(--border-color-default)] hover:border-[var(--border-color-strong)]'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-[var(--space-8)] mb-[var(--space-8)]">
                          <span className="type-body-s font-medium text-[var(--paper)] truncate">
                            {item.category}
                          </span>
                          <span className="type-mono text-[var(--ink-300)] shrink-0">
                            {item.spent} / {item.allocated}
                          </span>
                        </div>
                        <div className="w-full h-[6px] bg-[var(--ink-800)] rounded-[var(--radius-pill)] overflow-hidden">
                          <div
                            style={{ width: `${item.percent}%` }}
                            className={`h-full rounded-[var(--radius-pill)] transition-colors duration-[var(--duration-micro)] ${
                              isSelected ? 'bg-[var(--paper)]' : 'bg-[var(--ink-300)]'
                            }`}
                          />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-[var(--space-16)] pt-[var(--space-12)] border-t border-[var(--border-color-default)] flex items-center justify-between type-mono text-[var(--ink-300)]">
                <span>SAFE ALLOWANCE LOCKED</span>
                <span className="text-[var(--paper)]">100% ALLOCATED</span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Render content for a given stage id (used in both Desktop Viewport and Mobile Vertical Stack)
  const renderStageBody = (stageId: ForgeStage['id'], isMobileStack: boolean) => {
    switch (stageId) {
      case 'prompt':
        return (
          <div className="w-full max-w-[640px] mx-auto flex flex-col items-center justify-center gap-[var(--space-16)]">
            {(!promptNodeMorphed || isMobileStack) && (
              <div className="w-full bg-[var(--ink-950)] border border-[var(--border-color-strong)] rounded-[var(--radius-12)] p-[var(--space-16)] sm:p-[var(--space-24)]">
                <div className="flex items-center justify-between mb-[var(--space-12)] type-mono text-[var(--ink-300)]">
                  <span>INPUT SPECIFICATION</span>
                  <span>UTF-8 · PROMPT</span>
                </div>
                <div className="type-body-m font-[var(--font-mono)] text-[var(--paper)] flex items-center gap-[var(--space-8)] break-words">
                  <span>{displayedPrompt}</span>
                  {!isReducedMotion && (
                    <span
                      className="inline-block w-[8px] h-[18px] bg-[var(--paper)] shrink-0"
                      aria-hidden="true"
                    />
                  )}
                </div>
              </div>
            )}
            {(promptNodeMorphed || isMobileStack) && (
              <div className="w-full sm:w-auto bg-[var(--ink-800)] border border-[var(--border-color-strong)] rounded-[var(--radius-12)] px-[var(--space-24)] py-[var(--space-16)] flex flex-col items-center gap-[var(--space-8)]">
                <div className="type-mono text-[var(--ink-300)]">ROOT INTENT NODE</div>
                <div className="type-mono text-[var(--paper)] text-center break-words">
                  &ldquo;{displayedPrompt}&rdquo;
                </div>
              </div>
            )}
          </div>
        );

      case 'deconstruct':
        if (isMobileStack) {
          /* Vertical Deconstruction Stack on Mobile (No horizontal shrinkage) */
          return (
            <div className="w-full flex flex-col items-center gap-[var(--space-12)]">
              <div className="px-[var(--space-16)] py-[var(--space-8)] rounded-[var(--radius-pill)] bg-[var(--ink-950)] border border-[var(--border-color-accent)] type-mono text-[var(--forge)] flex items-center gap-[var(--space-8)]">
                <span className="w-[8px] h-[8px] rounded-[var(--radius-pill)] bg-[var(--forge)]" />
                <span>SIGNAL PULSE · 5 DIMENSIONS</span>
              </div>
              <div className="w-[1px] h-[16px] bg-[var(--forge)]" aria-hidden="true" />
              <div className="w-full grid grid-cols-1 gap-[var(--space-8)]">
                {SITE_CONTENT.sequence.nodes.map((node) => (
                  <div
                    key={node.id}
                    className="px-[var(--space-16)] py-[var(--space-12)] rounded-[var(--radius-8)] bg-[var(--ink-800)] border border-[var(--border-color-strong)] flex items-center justify-between"
                  >
                    <span className="type-mono font-semibold text-[var(--paper)]">
                      {node.label}
                    </span>
                    <span className="type-mono text-[var(--ink-300)]">{node.spec}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        }

        return (
          <div className="relative z-10 w-full max-w-[760px] h-[360px] flex items-center justify-center">
            <svg
              viewBox="0 0 600 360"
              className="w-full h-full overflow-visible"
              aria-label="Signal pulse expanding root prompt into 5 nodes: USERS, FEATURES, FLOW, BRAND, DATA"
            >
              {!isReducedMotion && (
                <>
                  <motion.circle
                    cx="300"
                    cy="180"
                    r="24"
                    fill="none"
                    stroke="var(--forge)"
                    strokeWidth="1.5"
                    initial={{ scale: 0.4, opacity: 0.95 }}
                    animate={{ scale: 6.5, opacity: 0 }}
                    transition={{
                      duration: 1.6,
                      repeat: Infinity,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    style={{ transformOrigin: '300px 180px' }}
                  />
                  <motion.circle
                    cx="300"
                    cy="180"
                    r="24"
                    fill="none"
                    stroke="var(--forge)"
                    strokeWidth="1"
                    initial={{ scale: 0.4, opacity: 0.7 }}
                    animate={{ scale: 5, opacity: 0 }}
                    transition={{
                      duration: 1.6,
                      delay: 0.45,
                      repeat: Infinity,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    style={{ transformOrigin: '300px 180px' }}
                  />
                </>
              )}

              {isReducedMotion && (
                <circle
                  cx="300"
                  cy="180"
                  r="125"
                  fill="none"
                  stroke="var(--forge)"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
              )}

              {[
                { x: 300, y: 46 },
                { x: 485, y: 120 },
                { x: 425, y: 295 },
                { x: 175, y: 295 },
                { x: 115, y: 120 },
              ].map((pos, idx) => {
                const node = SITE_CONTENT.sequence.nodes[idx];
                return (
                  <g key={node.id}>
                    <line
                      x1="300"
                      y1="180"
                      x2={pos.x}
                      y2={pos.y}
                      stroke="var(--border-color-strong)"
                      strokeWidth="1.5"
                    />
                    <g>
                      <rect
                        x={pos.x - 58}
                        y={pos.y - 20}
                        width="116"
                        height="40"
                        rx="6"
                        fill="var(--ink-800)"
                        stroke="var(--border-color-strong)"
                        strokeWidth="1"
                      />
                      <text
                        x={pos.x}
                        y={pos.y + 4}
                        textAnchor="middle"
                        fill="var(--paper)"
                        className="type-mono font-semibold"
                      >
                        {node.label}
                      </text>
                    </g>
                  </g>
                );
              })}

              <circle
                cx="300"
                cy="180"
                r="10"
                fill="var(--ink-950)"
                stroke="var(--forge)"
                strokeWidth="2"
              />
              <circle cx="300" cy="180" r="3.5" fill="var(--forge)" />
            </svg>
          </div>
        );

      case 'blueprint':
        return (
          <div className="relative z-10 w-full max-w-[880px] mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-[var(--space-12)] sm:gap-[var(--space-16)]">
              {SITE_CONTENT.sequence.nodes.map((node, idx) => (
                <div
                  key={node.id}
                  className={`bg-[var(--ink-800)] border border-[var(--border-color-strong)] rounded-[var(--radius-8)] p-[var(--space-16)] flex flex-col justify-between ${
                    idx === 3 ? 'md:col-span-2' : ''
                  }`}
                >
                  <div className="flex items-center justify-between pb-[var(--space-8)] mb-[var(--space-8)] border-b border-[var(--border-color-default)]">
                    <span className="type-mono font-semibold text-[var(--paper)]">
                      {node.label}
                    </span>
                    <span className="type-mono text-[var(--ink-300)]">
                      NODE 0{idx + 1}
                    </span>
                  </div>
                  <div className="type-body-s font-medium text-[var(--paper)] mb-[var(--space-4)]">
                    {node.spec}
                  </div>
                  <div className="type-mono text-[var(--ink-300)]">{node.detail}</div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'wireframe':
        return (
          <div
            className="relative z-10 w-full max-w-[840px] mx-auto bg-[var(--ink-950)] border border-[var(--border-color-strong)] rounded-[var(--radius-12)] p-[var(--space-16)] sm:p-[var(--space-24)]"
            aria-label="Wireframe structure of the student financial planning application"
          >
            <div className="flex items-center justify-between pb-[var(--space-16)] mb-[var(--space-16)] border-b border-[var(--border-color-default)]">
              <div className="flex items-center gap-[var(--space-12)]">
                <div className="w-[16px] h-[16px] rounded-[var(--radius-4)] bg-[var(--ink-700)]" />
                <div className="w-[80px] sm:w-[96px] h-[12px] rounded-[var(--radius-4)] bg-[var(--ink-700)]" />
              </div>
              <div className="w-[96px] sm:w-[128px] h-[12px] rounded-[var(--radius-4)] bg-[var(--ink-800)] border border-[var(--border-color-default)]" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-[var(--space-16)]">
              <div className="lg:col-span-7 flex flex-col gap-[var(--space-16)]">
                <div className="bg-[var(--ink-900)] border border-[var(--border-color-default)] rounded-[var(--radius-8)] p-[var(--space-16)]">
                  <div className="w-[120px] h-[10px] rounded-[var(--radius-4)] bg-[var(--ink-700)] mb-[var(--space-12)]" />
                  <div className="w-[160px] h-[28px] rounded-[var(--radius-4)] bg-[var(--ink-700)] mb-[var(--space-16)]" />
                  <div className="w-full h-[1px] bg-[var(--border-color-default)] mb-[var(--space-12)]" />
                  <div className="flex justify-between">
                    <div className="w-[96px] h-[10px] rounded-[var(--radius-4)] bg-[var(--ink-800)]" />
                    <div className="w-[56px] h-[10px] rounded-[var(--radius-4)] bg-[var(--ink-800)]" />
                  </div>
                </div>

                <div className="bg-[var(--ink-900)] border border-[var(--border-color-default)] rounded-[var(--radius-8)] p-[var(--space-16)]">
                  <div className="w-[110px] h-[10px] rounded-[var(--radius-4)] bg-[var(--ink-700)] mb-[var(--space-16)]" />
                  <div className="grid grid-cols-7 gap-[var(--space-4)] sm:gap-[var(--space-8)] items-end h-[80px]">
                    {[38, 62, 28, 84, 52, 70, 30].map((val, i) => (
                      <div
                        key={i}
                        style={{ height: `${val}%` }}
                        className="w-full rounded-[var(--radius-4)] bg-[var(--ink-800)] border border-[var(--border-color-strong)]"
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 bg-[var(--ink-900)] border border-[var(--border-color-default)] rounded-[var(--radius-8)] p-[var(--space-16)] flex flex-col gap-[var(--space-12)]">
                <div className="w-[100px] h-[10px] rounded-[var(--radius-4)] bg-[var(--ink-700)] mb-[var(--space-4)]" />
                {[1, 2, 3].map((row) => (
                  <div
                    key={row}
                    className="p-[var(--space-12)] rounded-[var(--radius-8)] bg-[var(--ink-950)] border border-[var(--border-color-default)] flex flex-col gap-[var(--space-8)]"
                  >
                    <div className="flex justify-between">
                      <div className="w-[96px] h-[10px] rounded-[var(--radius-4)] bg-[var(--ink-700)]" />
                      <div className="w-[40px] h-[10px] rounded-[var(--radius-4)] bg-[var(--ink-800)]" />
                    </div>
                    <div className="w-full h-[6px] rounded-[var(--radius-pill)] bg-[var(--ink-700)]" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'interface':
        return (
          <div className="relative z-10 w-full max-w-[840px] mx-auto">
            {renderPulseInterface('full')}
          </div>
        );

      case 'synthesis':
        return (
          <div className="relative z-10 w-full max-w-[920px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-[var(--space-16)]">
            <div className="bg-[var(--ink-950)] border border-[var(--border-color-strong)] rounded-[var(--radius-12)] p-[var(--space-16)] flex flex-col">
              <div className="flex items-center justify-between pb-[var(--space-12)] mb-[var(--space-12)] border-b border-[var(--border-color-default)]">
                <span className="type-mono font-semibold text-[var(--paper)]">
                  {SITE_CONTENT.sequence.splitPanels.leftLabel}
                </span>
                <span className="type-mono text-[var(--ink-300)]">VIEWPORT · 1X</span>
              </div>
              {renderPulseInterface('split')}
            </div>

            <div className="bg-[var(--ink-950)] border border-[var(--border-color-strong)] rounded-[var(--radius-12)] p-[var(--space-16)] flex flex-col min-w-0">
              <div className="flex flex-wrap items-center justify-between gap-[var(--space-8)] pb-[var(--space-12)] mb-[var(--space-12)] border-b border-[var(--border-color-default)]">
                <span className="type-mono font-semibold text-[var(--paper)]">
                  {SITE_CONTENT.sequence.splitPanels.rightLabel}
                </span>
                <span className="type-mono text-[var(--ink-300)] truncate">
                  {SITE_CONTENT.sequence.splitPanels.filePath}
                </span>
              </div>
              <div className="flex-1 bg-[var(--ink-900)] border border-[var(--border-color-default)] rounded-[var(--radius-8)] p-[var(--space-16)] overflow-hidden">
                <pre className="type-mono text-[var(--ink-300)] whitespace-pre-wrap break-words sm:whitespace-pre">
                  <code>
                    {fullCode.slice(0, isMobileStack ? fullCode.length : streamedCharCount)}
                    {!isMobileStack && streamedCharCount < fullCode.length && (
                      <span
                        className="inline-block w-[7px] h-[14px] bg-[var(--paper)] align-middle ml-[2px]"
                        aria-hidden="true"
                      />
                    )}
                  </code>
                </pre>
              </div>
            </div>
          </div>
        );

      case 'interactive':
        return (
          <div className="relative z-10 w-full max-w-[840px] mx-auto">
            {renderPulseInterface('interactive')}
          </div>
        );

      case 'badge':
        return (
          <div className="relative z-10 flex flex-col items-center justify-center py-[var(--space-32)]">
            <div className="bg-[var(--ink-800)] border border-[var(--border-color-strong)] rounded-[var(--radius-12)] px-[var(--space-24)] sm:px-[var(--space-32)] py-[var(--space-24)] flex flex-col items-center gap-[var(--space-12)] text-center">
              <div className="flex items-center gap-[var(--space-12)]">
                <span className="w-[8px] h-[8px] rounded-[var(--radius-pill)] bg-[var(--paper)]" />
                <span className="type-body-l font-[var(--font-mono)] font-semibold tracking-[0.14em] text-[var(--paper)]">
                  {SITE_CONTENT.sequence.liveBadge.label}
                </span>
              </div>
              <div className="type-mono text-[var(--ink-300)]">
                {SITE_CONTENT.sequence.liveBadge.sublabel}
              </div>
            </div>
          </div>
        );

      case 'forged':
      default:
        return (
          <div className="relative z-10 flex flex-col items-center justify-center text-center py-[var(--space-24)] sm:py-[var(--space-32)]">
            <div className="inline-flex items-center gap-[var(--space-8)] mb-[var(--space-16)] type-mono text-[var(--forge)]">
              <span className="w-[6px] h-[6px] rotate-45 bg-[var(--forge)] inline-block" />
              <span>{SITE_CONTENT.sequence.liveBadge.label}</span>
            </div>

            <h2 className="type-display-l text-[var(--paper)] tracking-tight mb-[var(--space-16)]">
              {SITE_CONTENT.sequence.forgedState.headline.replace('.', '')}
              <span className="text-[var(--forge)]">.</span>
            </h2>

            <p className="type-body-l text-[var(--ink-300)] max-w-[460px] mb-[var(--space-32)]">
              {SITE_CONTENT.sequence.forgedState.subheadline}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-[var(--space-12)]">
              <button
                type="button"
                onClick={handleStartOrReplay}
                className="px-[var(--space-24)] py-[var(--space-12)] rounded-[var(--radius-8)] bg-[var(--ink-800)] hover:bg-[var(--ink-700)] border border-[var(--border-color-strong)] type-body-s font-medium text-[var(--paper)] inline-flex items-center gap-[var(--space-8)] cursor-pointer transition-colors duration-[var(--duration-micro)]"
              >
                <RotateCcw size={15} />
                <span>{SITE_CONTENT.hero.replayCtaLabel}</span>
              </button>
              <button
                type="button"
                onClick={() => handleSelectStage(6)}
                className="px-[var(--space-16)] py-[var(--space-12)] rounded-[var(--radius-8)] bg-transparent hover:bg-[var(--ink-800)] border border-[var(--border-color-default)] type-mono text-[var(--ink-300)] hover:text-[var(--paper)] cursor-pointer transition-colors duration-[var(--duration-micro)]"
              >
                Inspect PULSE UI (07)
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div
      id="forge-sequence"
      className="w-full rounded-[var(--radius-16)] bg-[var(--ink-900)] border border-[var(--border-color-strong)] overflow-hidden"
    >
      {/* Top Instrument Panel Header */}
      <div className="px-[var(--space-16)] sm:px-[var(--space-24)] py-[var(--space-12)] bg-[var(--ink-950)] border-b border-[var(--border-color-default)] flex flex-wrap items-center justify-between gap-[var(--space-12)]">
        {/* Left: Active Stage Indicator (Orange accent allowed ONLY here, on signal pulse, and final FORGED moment) */}
        <div className="flex items-center gap-[var(--space-12)]">
          <span
            className="w-[8px] h-[8px] rounded-[var(--radius-pill)] bg-[var(--forge)] shrink-0"
            aria-hidden="true"
          />
          <span
            className="type-mono font-semibold tracking-[0.08em] text-[var(--forge)] uppercase whitespace-nowrap"
            aria-live="polite"
          >
            {currentStage.code} / {SITE_CONTENT.sequence.totalStages}{' '}
            {currentStage.label}
          </span>
        </div>

        {/* Center: Desktop/Tablet Direct Stage Scrubber Stepper */}
        <div
          className="hidden lg:flex items-center gap-[var(--space-4)]"
          role="tablist"
          aria-label="Forge Sequence Stages"
        >
          {stages.map((st, idx) => {
            const isCurrent = idx === currentStageIndex;
            const isPast = idx < currentStageIndex;
            return (
              <button
                key={st.id}
                type="button"
                role="tab"
                aria-selected={isCurrent}
                aria-label={`Stage ${st.code}: ${st.label}`}
                onClick={() => handleSelectStage(idx)}
                className={`px-[var(--space-8)] py-[var(--space-4)] rounded-[var(--radius-4)] type-mono transition-colors duration-[var(--duration-micro)] cursor-pointer ${
                  isCurrent
                    ? 'bg-[var(--ink-800)] text-[var(--forge)] border border-[var(--border-color-accent)]'
                    : isPast
                    ? 'text-[var(--paper)] hover:bg-[var(--ink-800)]'
                    : 'text-[var(--ink-300)] hover:text-[var(--paper)] hover:bg-[var(--ink-800)]'
                }`}
              >
                {st.code}
              </button>
            );
          })}
        </div>

        {/* Right: Playback & Reduced Motion Controls */}
        <div className="flex flex-wrap items-center gap-[var(--space-8)]">
          <button
            type="button"
            onClick={() => setManualReducedMotion((prev) => !prev)}
            aria-pressed={isReducedMotion}
            className="px-[var(--space-12)] py-[var(--space-4)] rounded-[var(--radius-4)] type-mono text-[var(--ink-300)] hover:text-[var(--paper)] border border-[var(--border-color-default)] hover:border-[var(--border-color-strong)] transition-colors duration-[var(--duration-micro)] whitespace-nowrap cursor-pointer"
          >
            {isReducedMotion ? SITE_CONTENT.hero.reducedMotionNote : 'Static mode'}
          </button>

          {!isReducedMotion && currentStageIndex < stages.length - 1 && (
            <button
              type="button"
              onClick={() => setIsPlaying((prev) => !prev)}
              className="px-[var(--space-12)] py-[var(--space-4)] rounded-[var(--radius-4)] bg-[var(--ink-800)] hover:bg-[var(--ink-700)] border border-[var(--border-color-default)] type-mono text-[var(--paper)] inline-flex items-center gap-[var(--space-8)] whitespace-nowrap cursor-pointer transition-colors duration-[var(--duration-micro)]"
            >
              {isPlaying ? (
                <>
                  <Pause size={12} />
                  <span>{SITE_CONTENT.hero.pauseCtaLabel}</span>
                </>
              ) : (
                <>
                  <Play size={12} />
                  <span>{SITE_CONTENT.hero.resumeCtaLabel}</span>
                </>
              )}
            </button>
          )}

          <button
            type="button"
            onClick={handleStartOrReplay}
            className="px-[var(--space-12)] py-[var(--space-4)] rounded-[var(--radius-4)] bg-[var(--ink-800)] hover:bg-[var(--ink-700)] border border-[var(--border-color-strong)] type-mono text-[var(--paper)] inline-flex items-center gap-[var(--space-8)] whitespace-nowrap cursor-pointer transition-colors duration-[var(--duration-micro)]"
          >
            <RotateCcw size={12} />
            <span>
              {currentStageIndex === stages.length - 1
                ? SITE_CONTENT.hero.replayCtaLabel
                : SITE_CONTENT.hero.watchCtaLabel}
            </span>
          </button>
        </div>
      </div>

      {/* DESKTOP & TABLET SEQUENCE VIEWPORT (768px and up) */}
      <div className="hidden md:flex relative min-h-[480px] w-full items-center justify-center p-[var(--space-32)] overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 opacity-35"
          aria-hidden="true"
        >
          <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-[var(--border-color-default)]" />
          <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-[var(--border-color-default)]" />
        </div>

        {(currentStage.id === 'forged' || currentStage.id === 'deconstruct') && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 transition-opacity duration-[var(--duration-expressive)]"
            style={{
              background:
                currentStage.id === 'forged'
                  ? 'var(--glow-forge-strong)'
                  : 'var(--glow-forge-radial)',
            }}
          />
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStage.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={stageTransition}
            className="relative z-10 w-full flex items-center justify-center"
          >
            {renderStageBody(currentStage.id, false)}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* MOBILE RECOMPOSED VERTICAL TRANSFORMATION TIMELINE (< 768px: stages stack top to bottom) */}
      <div className="flex md:hidden flex-col p-[var(--space-16)] gap-[var(--space-12)]">
        {stages.map((st, idx) => {
          const isCurrent = idx === currentStageIndex;
          return (
            <div key={st.id} className="flex flex-col">
              <div
                className={`rounded-[var(--radius-12)] border transition-colors ${
                  isCurrent
                    ? 'bg-[var(--ink-950)] border-[var(--border-color-strong)]'
                    : 'bg-[var(--ink-950)] border-[var(--border-color-default)]'
                }`}
              >
                <button
                  type="button"
                  onClick={() => handleSelectStage(idx)}
                  aria-expanded={isCurrent}
                  className="w-full px-[var(--space-16)] py-[var(--space-12)] flex items-center justify-between gap-[var(--space-8)] text-left cursor-pointer"
                >
                  <div className="flex items-center gap-[var(--space-8)]">
                    <span
                      className={`w-[6px] h-[6px] rounded-[var(--radius-pill)] ${
                        isCurrent ? 'bg-[var(--forge)]' : 'bg-[var(--ink-300)]'
                      }`}
                    />
                    <span
                      className={`type-mono font-semibold ${
                        isCurrent ? 'text-[var(--forge)]' : 'text-[var(--paper)]'
                      }`}
                    >
                      {st.code} / {SITE_CONTENT.sequence.totalStages} {st.label}
                    </span>
                  </div>
                  <span className="type-mono text-[var(--ink-300)]">
                    {isCurrent ? 'ACTIVE' : 'INSPECT'}
                  </span>
                </button>

                {isCurrent && (
                  <div className="px-[var(--space-16)] pb-[var(--space-16)] pt-[var(--space-8)] border-t border-[var(--border-color-default)]">
                    <p className="type-body-s text-[var(--ink-300)] mb-[var(--space-16)]">
                      {st.summary}
                    </p>
                    {renderStageBody(st.id, true)}
                  </div>
                )}
              </div>

              {idx < stages.length - 1 && (
                <div
                  className="flex items-center justify-center py-[var(--space-4)] text-[var(--ink-300)]"
                  aria-hidden="true"
                >
                  <ArrowDown size={14} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Stage Summary Bar (Desktop/Tablet) */}
      <div className="hidden md:flex px-[var(--space-24)] py-[var(--space-12)] bg-[var(--ink-950)] border-t border-[var(--border-color-default)] items-center justify-between gap-[var(--space-12)]">
        <p className="type-body-s text-[var(--ink-300)]">{currentStage.summary}</p>
        <div className="flex lg:hidden items-center gap-[var(--space-4)]">
          {stages.map((st, idx) => (
            <button
              key={st.id}
              type="button"
              onClick={() => handleSelectStage(idx)}
              className={`px-[var(--space-8)] py-[var(--space-4)] rounded-[var(--radius-4)] type-mono cursor-pointer ${
                idx === currentStageIndex
                  ? 'bg-[var(--ink-800)] text-[var(--forge)] border border-[var(--border-color-accent)]'
                  : 'text-[var(--ink-300)]'
              }`}
            >
              {st.code}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
