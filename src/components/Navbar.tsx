import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { ForgeLogo } from './ForgeLogo';
import { SITE_CONTENT } from '../content/siteContent';
import { MagneticButton } from './InteractivePrimitives';

interface NavbarProps {
  activeNav: string;
  onSelectNav: (id: string) => void;
  onStartBuilding: () => void;
  onOpenSignIn: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeNav,
  onSelectNav,
  onStartBuilding,
  onOpenSignIn,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredNavId, setHoveredNavId] = useState<string | null>(null);
  const [isCompact, setIsCompact] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const lastScrollY = useRef<number>(0);
  const hamburgerButtonRef = useRef<HTMLButtonElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);

  // Compact on scroll down, return to full size on scroll up (300ms smooth transition)
  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      const delta = currentY - lastScrollY.current;

      if (currentY <= 24) {
        setIsCompact(false);
      } else if (delta > 6 && currentY > 56) {
        setIsCompact(true);
      } else if (delta < -6) {
        setIsCompact(false);
      }

      lastScrollY.current = currentY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Trap focus and close on Escape when mobile full-screen overlay is open
  useEffect(() => {
    if (!mobileMenuOpen) {
      document.body.style.overflow = '';
      return;
    }

    document.body.style.overflow = 'hidden';

    const overlayEl = overlayRef.current;
    const focusableSelector =
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';
    const focusables = overlayEl
      ? Array.from(overlayEl.querySelectorAll<HTMLElement>(focusableSelector))
      : [];

    if (focusables.length > 0) {
      focusables[0].focus();
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setMobileMenuOpen(false);
        hamburgerButtonRef.current?.focus();
        return;
      }

      if (e.key === 'Tab' && focusables.length > 0) {
        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [mobileMenuOpen]);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    id: string
  ) => {
    e.preventDefault();
    onSelectNav(id);
    setMobileMenuOpen(false);
  };

  const highlightedNavId = hoveredNavId ?? activeNav;

  return (
    <>
      {/* Layout spacer so Hero keeps its exact vertical position */}
      <div className="h-[76px] sm:h-[84px]" aria-hidden="true" />

      <header className="fixed top-[16px] sm:top-[20px] left-0 right-0 z-40 px-[var(--space-16)] sm:px-[var(--space-24)] pointer-events-none flex justify-center">
        {/* Detached Centered Floating Pill (max-width ~960px) */}
        <div
          className={`pointer-events-auto w-full max-w-[960px] surface-pill-nav rounded-[var(--radius-pill)] flex items-center justify-between gap-[var(--space-12)] transition-all duration-300 ease-[var(--ease-default)] ${
            isCompact
              ? 'px-[var(--space-16)] py-[var(--space-8)]'
              : 'px-[var(--space-24)] py-[var(--space-12)]'
          }`}
        >
          {/* Left: Brand Wordmark Lockup */}
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              onSelectNav('product');
              window.scrollTo({
                top: 0,
                behavior: prefersReducedMotion ? 'auto' : 'smooth',
              });
            }}
            className="inline-flex items-center whitespace-nowrap shrink-0 rounded-[var(--radius-pill)] py-[var(--space-4)] px-[var(--space-4)]"
            aria-label={SITE_CONTENT.brand.name}
          >
            <ForgeLogo />
          </a>

          {/* Center: Sliding Highlight Pill Navigation Links (Desktop) */}
          <nav
            aria-label="Primary"
            onMouseLeave={() => setHoveredNavId(null)}
            className="hidden md:flex items-center gap-[var(--space-4)] p-[var(--space-4)] rounded-[var(--radius-pill)]"
          >
            {SITE_CONTENT.navigation.links.map((item) => {
              const isHighlighted = highlightedNavId === item.id;
              const isActive = activeNav === item.id;
              return (
                <a
                  key={item.id}
                  href={item.href}
                  onMouseEnter={() => setHoveredNavId(item.id)}
                  onFocus={() => setHoveredNavId(item.id)}
                  onBlur={() => setHoveredNavId(null)}
                  onClick={(e) => handleNavClick(e, item.id)}
                  aria-current={isActive ? 'location' : undefined}
                  className={`relative px-[var(--space-16)] rounded-[var(--radius-pill)] type-body-s font-medium whitespace-nowrap shrink-0 transition-all duration-300 ease-[var(--ease-default)] ${
                    isCompact ? 'py-[var(--space-4)]' : 'py-[var(--space-8)]'
                  } ${
                    isHighlighted
                      ? 'text-[var(--paper)]'
                      : 'text-[var(--ink-300)] hover:text-[var(--paper)]'
                  }`}
                >
                  {isHighlighted && (
                    <motion.span
                      layoutId={
                        prefersReducedMotion
                          ? undefined
                          : 'floating-pill-nav-highlight'
                      }
                      className="absolute inset-0 rounded-[var(--radius-pill)] bg-[var(--ink-800)] border border-[var(--border-color-pill)] -z-10"
                      transition={{
                        duration: 0.26,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    />
                  )}
                  <span className="relative z-10">{item.label}</span>
                </a>
              );
            })}
          </nav>

          {/* Right: "Sign in" (ghost) and "Start building →" (orange) */}
          <div className="hidden md:flex items-center gap-[var(--space-8)] shrink-0">
            <button
              type="button"
              onClick={onOpenSignIn}
              className={`px-[var(--space-16)] type-body-s font-medium text-[var(--ink-300)] hover:text-[var(--paper)] hover:bg-[var(--ink-800)] rounded-[var(--radius-pill)] transition-all duration-300 whitespace-nowrap shrink-0 cursor-pointer ${
                isCompact ? 'py-[var(--space-4)]' : 'py-[var(--space-8)]'
              }`}
            >
              {SITE_CONTENT.navigation.signInLabel}
            </button>

            <MagneticButton
              type="button"
              onClick={onStartBuilding}
              className={`btn-primary-forge px-[var(--space-16)] type-body-s rounded-[var(--radius-pill)] inline-flex items-center gap-[var(--space-8)] whitespace-nowrap shrink-0 cursor-pointer transition-all duration-300 ${
                isCompact ? 'py-[var(--space-4)]' : 'py-[var(--space-8)]'
              }`}
            >
              <span>{SITE_CONTENT.navigation.primaryCtaLabel}</span>
              <span className="arrow-shift" aria-hidden="true">
                {SITE_CONTENT.navigation.primaryCtaArrow}
              </span>
            </MagneticButton>
          </div>

          {/* Mobile Hamburger Trigger inside Compact Pill */}
          <div className="flex md:hidden items-center">
            <button
              ref={hamburgerButtonRef}
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-fullscreen-nav"
              aria-label="Open navigation menu"
              className="w-[40px] h-[40px] inline-flex items-center justify-center rounded-[var(--radius-pill)] text-[var(--paper)] hover:bg-[var(--ink-800)] border border-transparent hover:border-[var(--border-color-default)] transition-colors duration-[var(--duration-micro)] cursor-pointer"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Full-Screen Overlay with Staggered Space Grotesk Links & Focus Trap */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            ref={overlayRef}
            id="mobile-fullscreen-nav"
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0.1 : 0.24 }}
            className="fixed inset-0 z-50 md:hidden bg-[var(--ink-950)] flex flex-col justify-between p-[var(--space-24)] overflow-y-auto"
            style={{
              backgroundImage: 'var(--bg-section-iterate)',
            }}
          >
            {/* Overlay Top Bar */}
            <div className="flex items-center justify-between pb-[var(--space-16)] border-b border-[var(--border-color-default)]">
              <a
                href="#top"
                onClick={(e) => {
                  e.preventDefault();
                  setMobileMenuOpen(false);
                  window.scrollTo({
                    top: 0,
                    behavior: prefersReducedMotion ? 'auto' : 'smooth',
                  });
                }}
                className="inline-flex items-center rounded-[var(--radius-8)] py-[var(--space-4)]"
              >
                <ForgeLogo />
              </a>

              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  hamburgerButtonRef.current?.focus();
                }}
                aria-label="Close navigation menu"
                className="w-[44px] h-[44px] inline-flex items-center justify-center rounded-[var(--radius-pill)] bg-[var(--ink-800)] text-[var(--paper)] border border-[var(--border-color-strong)] cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Staggered Large Space Grotesk Navigation Links */}
            <motion.nav
              aria-label="Mobile Primary"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: prefersReducedMotion ? 0 : 0.06,
                    delayChildren: prefersReducedMotion ? 0 : 0.05,
                  },
                },
              }}
              className="flex flex-col gap-[var(--space-16)] my-[var(--space-32)]"
            >
              {SITE_CONTENT.navigation.links.map((item, idx) => {
                const isActive = activeNav === item.id;
                return (
                  <motion.a
                    key={item.id}
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.id)}
                    variants={{
                      hidden: {
                        opacity: 0,
                        y: prefersReducedMotion ? 0 : 18,
                      },
                      visible: {
                        opacity: 1,
                        y: 0,
                        transition: {
                          duration: 0.32,
                          ease: [0.16, 1, 0.3, 1],
                        },
                      },
                    }}
                    className={`group flex items-baseline justify-between py-[var(--space-12)] border-b border-[var(--border-color-default)] rounded-[var(--radius-4)] ${
                      isActive ? 'text-[var(--paper)]' : 'text-[var(--ink-300)]'
                    }`}
                  >
                    <span className="type-heading-xl font-[var(--font-display)] tracking-tight group-hover:text-[var(--paper)] transition-colors">
                      {item.label}
                    </span>
                    <span
                      className={`type-mono ${
                        isActive ? 'text-[var(--forge)]' : 'text-[var(--ink-300)]'
                      }`}
                    >
                      0{idx + 1}
                    </span>
                  </motion.a>
                );
              })}
            </motion.nav>

            {/* Bottom Actions */}
            <div className="pt-[var(--space-16)] flex flex-col gap-[var(--space-12)]">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenSignIn();
                }}
                className="w-full py-[var(--space-16)] px-[var(--space-24)] type-body-m font-medium text-[var(--paper)] bg-[var(--ink-800)] border border-[var(--border-color-strong)] rounded-[var(--radius-pill)] whitespace-nowrap cursor-pointer"
              >
                {SITE_CONTENT.navigation.signInLabel}
              </button>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onStartBuilding();
                }}
                className="w-full btn-primary-forge py-[var(--space-16)] px-[var(--space-24)] type-body-m rounded-[var(--radius-pill)] inline-flex items-center justify-center gap-[var(--space-8)] whitespace-nowrap cursor-pointer"
              >
                <span>{SITE_CONTENT.navigation.primaryCtaLabel}</span>
                <span className="arrow-shift" aria-hidden="true">
                  {SITE_CONTENT.navigation.primaryCtaArrow}
                </span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
