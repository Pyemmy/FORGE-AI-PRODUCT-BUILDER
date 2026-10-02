import React, { useState } from 'react';
import { Play } from 'lucide-react';
import { SITE_CONTENT } from '../content/siteContent';
import { ForgeSequence } from './ForgeSequence';
import { MagneticButton } from './InteractivePrimitives';

interface HeroProps {
  promptInputRef: React.RefObject<HTMLInputElement | null>;
  externalTriggerCount: number;
}

export const Hero: React.FC<HeroProps> = ({
  promptInputRef,
  externalTriggerCount,
}) => {
  const [promptValue, setPromptValue] = useState<string>('');
  const [submittedPrompt, setSubmittedPrompt] = useState<string>(
    SITE_CONTENT.hero.defaultPrompt
  );
  const [sequenceTrigger, setSequenceTrigger] = useState<number>(0);
  const [isGridActive, setIsGridActive] = useState<boolean>(true);

  const triggerForgeSequence = (customPrompt?: string) => {
    const nextPrompt =
      customPrompt !== undefined
        ? customPrompt
        : promptValue.trim().length > 0
        ? promptValue.trim()
        : SITE_CONTENT.hero.defaultPrompt;

    setSubmittedPrompt(nextPrompt);
    setSequenceTrigger((prev) => prev + 1);

    const el = document.getElementById('forge-sequence');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    triggerForgeSequence();
  };

  const combinedTriggerCount = sequenceTrigger + externalTriggerCount;

  return (
    <section
      id="top"
      aria-labelledby="hero-headline"
      className="relative w-full pt-[var(--space-64)] pb-[var(--space-96)] overflow-hidden"
    >
      {/* Subtle Background Grid that activates (brightens) when the sequence starts */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 transition-opacity duration-[var(--duration-expressive)] ease-[var(--ease-default)] ${
          isGridActive ? 'opacity-100' : 'opacity-35'
        }`}
        style={{
          backgroundImage: `
            linear-gradient(to right, ${
              isGridActive
                ? 'var(--border-color-strong)'
                : 'var(--border-color-default)'
            } 1px, transparent 1px),
            linear-gradient(to bottom, ${
              isGridActive
                ? 'var(--border-color-strong)'
                : 'var(--border-color-default)'
            } 1px, transparent 1px)
          `,
          backgroundSize: '64px 64px',
          maskImage:
            'radial-gradient(ellipse 80% 65% at 50% 32%, black 25%, transparent 100%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 80% 65% at 50% 32%, black 25%, transparent 100%)',
        }}
      />

      <div className="forge-container relative z-10">
        <div className="forge-grid">
          {/* Hero Typographic Focal Carrier (12 columns, centered architectural measure) */}
          <div className="col-span-4 md:col-span-8 lg:col-span-12 flex flex-col items-center text-center">
            {/* Eyebrow (small, mono, uppercase) */}
            <div className="type-mono uppercase tracking-[0.16em] text-[var(--ink-300)] mb-[var(--space-24)]">
              {SITE_CONTENT.hero.eyebrow}
            </div>

            {/* Headline (Display XL, Space Grotesk) */}
            <h1
              id="hero-headline"
              className="type-display-xl text-[var(--paper)] max-w-[920px] mb-[var(--space-24)]"
            >
              {SITE_CONTENT.hero.headline}
            </h1>

            {/* Supporting Copy */}
            <p className="type-body-l text-[var(--ink-300)] max-w-[640px] mb-[var(--space-48)]">
              {SITE_CONTENT.hero.supportingCopy}
            </p>

            {/* Prompt Box (JetBrains Mono placeholder + "Start building →" button) */}
            <form
              onSubmit={handleSubmit}
              className="w-full max-w-[720px] mb-[var(--space-24)]"
            >
              <div className="group relative flex flex-col sm:flex-row items-stretch sm:items-center gap-[var(--space-8)] p-[var(--space-8)] rounded-[var(--radius-12)] bg-[var(--ink-900)] border border-[var(--border-color-strong)] focus-within:border-[var(--paper)] transition-colors duration-[var(--duration-fast)]">
                <label htmlFor="forge-prompt-input" className="sr-only">
                  {SITE_CONTENT.hero.promptPlaceholder}
                </label>
                <input
                  ref={promptInputRef}
                  id="forge-prompt-input"
                  type="text"
                  value={promptValue}
                  onChange={(e) => setPromptValue(e.target.value)}
                  placeholder={SITE_CONTENT.hero.promptPlaceholder}
                  className="flex-1 min-w-0 bg-transparent px-[var(--space-16)] py-[var(--space-12)] type-mono text-[var(--paper)] placeholder:text-[var(--ink-300)] rounded-[var(--radius-8)]"
                />

                <MagneticButton
                  type="submit"
                  className="btn-primary-forge px-[var(--space-24)] py-[var(--space-12)] rounded-[var(--radius-8)] type-body-s inline-flex items-center justify-center gap-[var(--space-8)] whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <span>{SITE_CONTENT.hero.submitCtaLabel}</span>
                  <span className="arrow-shift" aria-hidden="true">
                    {SITE_CONTENT.hero.submitCtaArrow}
                  </span>
                </MagneticButton>
              </div>
            </form>

            {/* Secondary Actions: "Watch it forge" button & "See how it works" link */}
            <div className="flex flex-wrap items-center justify-center gap-[var(--space-24)] mb-[var(--space-64)]">
              <button
                type="button"
                onClick={() => {
                  setPromptValue(SITE_CONTENT.hero.defaultPrompt);
                  triggerForgeSequence(SITE_CONTENT.hero.defaultPrompt);
                }}
                className="px-[var(--space-16)] py-[var(--space-8)] rounded-[var(--radius-8)] bg-[var(--ink-800)] hover:bg-[var(--ink-700)] border border-[var(--border-color-default)] hover:border-[var(--border-color-strong)] type-body-s font-medium text-[var(--paper)] inline-flex items-center gap-[var(--space-8)] whitespace-nowrap cursor-pointer transition-colors duration-[var(--duration-micro)]"
              >
                <Play size={14} className="fill-current" />
                <span>{SITE_CONTENT.hero.watchCtaLabel}</span>
              </button>

              <a
                href="#forge-sequence"
                onClick={(e) => {
                  e.preventDefault();
                  triggerForgeSequence();
                }}
                className="type-body-s font-medium text-[var(--ink-300)] hover:text-[var(--paper)] underline underline-offset-[6px] decoration-[var(--border-color-strong)] hover:decoration-[var(--paper)] transition-colors duration-[var(--duration-micro)] whitespace-nowrap"
              >
                {SITE_CONTENT.hero.secondaryLinkLabel}
              </a>
            </div>
          </div>

          {/* THE FORGE SEQUENCE (Full 12-column hero visual) */}
          <div className="col-span-4 md:col-span-8 lg:col-span-12">
            <ForgeSequence
              activePrompt={submittedPrompt}
              sequenceTriggerCount={combinedTriggerCount}
              onSequenceActiveChange={setIsGridActive}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
