import React, { useRef, useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { SignInModal } from './components/SignInModal';
import {
  BlankCanvasSection,
  OneIdeaSection,
  ProductIntelligenceSection,
  DesignFlowSection,
  CodeSplitSection,
  IterateSection,
  ShipSection,
} from './components/WorkflowSections';
import {
  ProductTeamSection,
  ExamplesSection,
  PricingSection,
  FaqSection,
  FinalCtaSection,
  Footer,
} from './components/ShowcaseAndConversionSections';
import {
  ScrollProgressBar,
  ForgeVocabularyMarquee,
} from './components/InteractivePrimitives';

export default function App() {
  const [activeNav, setActiveNav] = useState<string>('product');
  const [signInOpen, setSignInOpen] = useState<boolean>(false);
  const [externalSequenceTrigger, setExternalSequenceTrigger] = useState<number>(0);
  const promptInputRef = useRef<HTMLInputElement | null>(null);

  // Scroll-spy: sync sliding highlight pill with the section currently in view
  useEffect(() => {
    const sectionIds = ['product', 'how-it-works', 'examples', 'pricing'];

    const updateActiveFromScroll = () => {
      const viewportAnchor = window.innerHeight * 0.35;
      let currentId = 'product';

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= viewportAnchor) {
            currentId = id;
          }
        }
      }

      setActiveNav(currentId);
    };

    updateActiveFromScroll();
    window.addEventListener('scroll', updateActiveFromScroll, { passive: true });
    return () => window.removeEventListener('scroll', updateActiveFromScroll);
  }, []);

  const handleStartBuilding = () => {
    if (promptInputRef.current) {
      promptInputRef.current.focus();
      promptInputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    setExternalSequenceTrigger((prev) => prev + 1);
  };

  const handleSelectNav = (id: string) => {
    setActiveNav(id);
    const targetEl = document.getElementById(id);
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleNavigateHref = (href: string) => {
    const id = href.replace('#', '');
    if (id === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const targetEl = document.getElementById(id);
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSelectPricingPlan = (_tierName: string) => {
    const ctaEl = document.getElementById('final-cta-prompt');
    if (ctaEl) {
      ctaEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      (ctaEl as HTMLInputElement).focus();
    }
  };

  const handleForgeFromFinalCta = (idea: string) => {
    if (promptInputRef.current) {
      promptInputRef.current.value = idea;
    }
    const sequenceEl = document.getElementById('forge-sequence');
    if (sequenceEl) {
      sequenceEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    setExternalSequenceTrigger((prev) => prev + 1);
  };

  return (
    <div className="relative min-h-screen bg-[var(--ink-950)] text-[var(--paper)] flex flex-col">
      {/* Thin Orange Scroll Progress Line at the Top of the Page */}
      <ScrollProgressBar />

      {/* Subtle Film-Grain / Noise Overlay Across the Page (Inline SVG Filter, Low Opacity, Zero Repaint Cost) */}
      <svg
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-30 h-full w-full opacity-[0.028]"
      >
        <filter id="forge-film-grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.8"
            numOctaves="3"
            stitchTiles="stitch"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#forge-film-grain)" />
      </svg>

      <Navbar
        activeNav={activeNav}
        onSelectNav={handleSelectNav}
        onStartBuilding={handleStartBuilding}
        onOpenSignIn={() => setSignInOpen(true)}
      />

      <main className="flex-1">
        {/* Hero & The Forge Sequence (Unchanged) */}
        <Hero
          promptInputRef={promptInputRef}
          externalTriggerCount={externalSequenceTrigger}
        />

        {/* 1. SECTION: The Blank Canvas */}
        <BlankCanvasSection />

        {/* 2. SECTION: One Idea (id: product) */}
        <OneIdeaSection />

        {/* 3. SECTION: Product Intelligence */}
        <ProductIntelligenceSection />

        {/* 4. SECTION: Design (id: how-it-works) */}
        <DesignFlowSection />

        {/* 5. SECTION: Code */}
        <CodeSplitSection />

        {/* 6. SECTION: Iterate */}
        <IterateSection />

        {/* 7. SECTION: Ship */}
        <ShipSection />

        {/* Looping Horizontal FORGE Vocabulary Marquee Between Sections */}
        <ForgeVocabularyMarquee />

        {/* 8. SECTION: Your AI product team */}
        <ProductTeamSection />

        {/* 9. SECTION: Examples (id: examples) */}
        <ExamplesSection />

        {/* 10. SECTION: Pricing (id: pricing) */}
        <PricingSection onSelectPlan={handleSelectPricingPlan} />

        {/* 11. SECTION: FAQ */}
        <FaqSection />

        {/* 12. SECTION: Final CTA */}
        <FinalCtaSection onForgePromptSubmit={handleForgeFromFinalCta} />
      </main>

      {/* 13. FOOTER (Unchanged) */}
      <Footer onNavigateSection={handleNavigateHref} />

      <SignInModal isOpen={signInOpen} onClose={() => setSignInOpen(true && false)} />
    </div>
  );
}
