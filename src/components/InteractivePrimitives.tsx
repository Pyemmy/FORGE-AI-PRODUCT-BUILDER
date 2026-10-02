import React, { useRef, useState, useEffect } from 'react';
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useInView,
  useReducedMotion,
  useAnimationFrame,
  useMotionValue,
} from 'motion/react';
import { SITE_CONTENT } from '../content/siteContent';

/* ==========================================================================
   1. Thin Scroll Progress Line in Orange at the Top of the Page
   ========================================================================== */
export const ScrollProgressBar: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const prefersReducedMotion = useReducedMotion();

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 28,
    restDelta: 0.001,
  });

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 right-0 z-50 h-[2px] bg-transparent"
    >
      <motion.div
        style={{
          scaleX: prefersReducedMotion ? scrollYProgress : smoothProgress,
          transformOrigin: '0% 50%',
          background:
            'linear-gradient(90deg, var(--forge) 0%, var(--forge-soft) 65%, var(--amber) 100%)',
        }}
        className="h-full w-full"
      />
    </div>
  );
};

/* ==========================================================================
   2. Magnetic Primary CTA Button
   Subtly follows the cursor when near; disabled under prefers-reduced-motion
   ========================================================================== */
interface MagneticButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  strength?: number;
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  className = '',
  strength = 0.24,
  onMouseMove,
  onMouseLeave,
  ...rest
}) => {
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const [offset, setOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    onMouseMove?.(e);
    if (prefersReducedMotion || !buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = (e.clientX - centerX) * strength;
    const deltaY = (e.clientY - centerY) * strength;

    const clampedX = Math.max(-8, Math.min(8, deltaX));
    const clampedY = Math.max(-5, Math.min(5, deltaY));

    setOffset({ x: clampedX, y: clampedY });
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    onMouseLeave?.(e);
    setOffset({ x: 0, y: 0 });
  };

  return (
    <motion.button
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={
        prefersReducedMotion
          ? { x: 0, y: 0 }
          : { x: offset.x, y: offset.y }
      }
      transition={{
        type: 'spring',
        stiffness: 240,
        damping: 18,
        mass: 0.4,
      }}
      className={className}
      {...rest}
    >
      {children}
    </motion.button>
  );
};

/* ==========================================================================
   3. Scroll-Triggered Word-by-Word Headline Reveal
   Reveals section headlines word by word with a slight upward motion
   ========================================================================== */
interface WordRevealHeadingProps {
  text: string;
  className?: string;
  as?: 'h2' | 'h3';
}

export const WordRevealHeading: React.FC<WordRevealHeadingProps> = ({
  text,
  className = '',
  as: Tag = 'h2',
}) => {
  const ref = useRef<HTMLHeadingElement | null>(null);
  const isInView = useInView(ref, { once: true, amount: 0.35 });
  const prefersReducedMotion = useReducedMotion();

  const words = text.split(' ');

  if (prefersReducedMotion) {
    return (
      <Tag ref={ref} className={className}>
        {text}
      </Tag>
    );
  }

  return (
    <Tag ref={ref} aria-label={text} className={className}>
      {words.map((word, index) => (
        <span
          key={`${word}-${index}`}
          aria-hidden="true"
          className="inline-block overflow-hidden align-bottom mr-[0.26em] last:mr-0 pb-[0.06em]"
        >
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{
              duration: 0.44,
              delay: index * 0.048,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="inline-block will-change-transform"
          >
            {word}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
};

/* ==========================================================================
   4. Looping Horizontal Vocabulary Marquee
   Large outlined Space Grotesk text:
   FORGE / SHAPE / CRAFT / BUILD / COMPOSE / PROTOTYPE / BLUEPRINT / ITERATE / SHIP
   Slow, reverses direction on scroll direction, pauses on hover & off-screen
   ========================================================================== */
export const ForgeVocabularyMarquee: React.FC = () => {
  const words = SITE_CONTENT.sections.marqueeVocabulary;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(containerRef, { once: false, amount: 0.05 });
  const prefersReducedMotion = useReducedMotion();

  const [isHovered, setIsHovered] = useState(false);
  const directionRef = useRef<number>(-1); // -1 = left, 1 = right
  const lastScrollYRef = useRef<number>(0);
  const xPercent = useMotionValue(0);

  // Reverse direction based on scroll direction
  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      const delta = currentY - lastScrollYRef.current;
      if (Math.abs(delta) > 2) {
        directionRef.current = delta > 0 ? -1 : 1;
      }
      lastScrollYRef.current = currentY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useAnimationFrame((_time, delta) => {
    if (prefersReducedMotion || !isInView || isHovered) return;

    // Slow, steady pace (~0.0022% per ms -> ~45s per full loop)
    const speed = 0.0022;
    let next = xPercent.get() + directionRef.current * speed * delta;

    // Wrap cleanly between -50% and 0% (since track is duplicated 2x)
    if (next <= -50) {
      next += 50;
    } else if (next > 0) {
      next -= 50;
    }

    xPercent.set(next);
  });

  const xTransform = useTransform(xPercent, (v) => `${v}%`);

  const renderTrackItems = (prefix: string) =>
    words.map((word, idx) => (
      <span
        key={`${prefix}-${word}-${idx}`}
        className="inline-flex items-center gap-[var(--space-32)] pr-[var(--space-32)] select-none"
      >
        <span className="text-outline-marquee">{word}</span>
        <span
          className="type-heading-l font-[var(--font-mono)] text-[var(--forge)] opacity-75"
          aria-hidden="true"
        >
          /
        </span>
      </span>
    ));

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label="FORGE engineering vocabulary"
      className="relative w-full py-[var(--space-32)] sm:py-[var(--space-48)] bg-[var(--ink-950)] border-t border-b border-[var(--border-color-default)] overflow-hidden"
    >
      {/* Subtle Edge Vignettes */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 w-[64px] sm:w-[128px] z-10"
        style={{
          background:
            'linear-gradient(90deg, var(--ink-950) 0%, transparent 100%)',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 w-[64px] sm:w-[128px] z-10"
        style={{
          background:
            'linear-gradient(270deg, var(--ink-950) 0%, transparent 100%)',
        }}
      />

      {prefersReducedMotion ? (
        <div className="forge-container flex flex-wrap items-center justify-center gap-x-[var(--space-24)] gap-y-[var(--space-12)]">
          {words.map((word, i) => (
            <React.Fragment key={word}>
              <span className="type-heading-l font-[var(--font-display)] text-[var(--ink-300)]">
                {word}
              </span>
              {i < words.length - 1 && (
                <span className="type-heading-m font-[var(--font-mono)] text-[var(--forge)]">
                  /
                </span>
              )}
            </React.Fragment>
          ))}
        </div>
      ) : (
        <motion.div
          style={{ x: xTransform }}
          className="flex whitespace-nowrap w-max will-change-transform"
        >
          <div className="flex items-center">{renderTrackItems('track-a')}</div>
          <div className="flex items-center" aria-hidden="true">
            {renderTrackItems('track-b')}
          </div>
        </motion.div>
      )}
    </div>
  );
};

/* ==========================================================================
   5. Subtle Floating Geometric Shapes (Planes Echoing the FORGE Logo)
   Drifting with Parallax in Blank Canvas and Final CTA Sections
   ========================================================================== */
export const ParallaxLogoPlanes: React.FC<{
  variant?: 'blank-canvas' | 'final-cta';
}> = ({ variant = 'blank-canvas' }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const yPlaneLeft = useTransform(scrollYProgress, [0, 1], [36, -42]);
  const yPlaneRight = useTransform(scrollYProgress, [0, 1], [-28, 38]);
  const rotatePlane = useTransform(scrollYProgress, [0, 1], [-4, 6]);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden z-0"
    >
      {/* Left Converging Geometric Plane echoing Logo Mark */}
      <motion.div
        style={
          prefersReducedMotion
            ? undefined
            : { y: yPlaneLeft, rotate: rotatePlane }
        }
        className={`absolute ${
          variant === 'blank-canvas'
            ? 'top-[12%] left-[4%] opacity-25'
            : 'top-[10%] left-[6%] opacity-30'
        }`}
      >
        <svg width="160" height="160" viewBox="0 0 160 160" fill="none">
          {/* Upper architectural plane */}
          <path
            d="M24 20H132L108 54H54V76H24V20Z"
            stroke="var(--border-color-strong)"
            strokeWidth="1.25"
            fill="var(--ink-800)"
            fillOpacity="0.35"
          />
          {/* Lower converging plane */}
          <path
            d="M24 92H94L74 122H54V142H24V92Z"
            stroke="var(--border-color-accent)"
            strokeWidth="1.25"
            fill="var(--ink-900)"
            fillOpacity="0.45"
          />
          {/* Spark vertex */}
          <rect
            x="104"
            y="74"
            width="16"
            height="16"
            rx="2"
            transform="rotate(45 104 74)"
            stroke="var(--forge)"
            strokeWidth="1.25"
            fill="var(--forge)"
            fillOpacity="0.2"
          />
        </svg>
      </motion.div>

      {/* Right Drifting Isometric Plane echoing Logo Mark */}
      <motion.div
        style={prefersReducedMotion ? undefined : { y: yPlaneRight }}
        className={`absolute ${
          variant === 'blank-canvas'
            ? 'bottom-[10%] right-[5%] opacity-20'
            : 'bottom-[12%] right-[6%] opacity-25'
        }`}
      >
        <svg width="180" height="180" viewBox="0 0 180 180" fill="none">
          <polygon
            points="36,32 152,32 122,74 36,74"
            stroke="var(--border-color-strong)"
            strokeWidth="1.2"
            fill="var(--ink-800)"
            fillOpacity="0.28"
          />
          <polygon
            points="56,92 140,92 116,130 56,130"
            stroke="var(--amber)"
            strokeOpacity="0.4"
            strokeWidth="1.2"
            fill="var(--ink-900)"
            fillOpacity="0.35"
          />
          <circle
            cx="138"
            cy="82"
            r="4"
            fill="var(--forge)"
            fillOpacity="0.55"
          />
        </svg>
      </motion.div>
    </div>
  );
};
