import React from 'react';
import { SITE_CONTENT } from '../content/siteContent';

interface ForgeLogoProps {
  showWordmark?: boolean;
  className?: string;
}

export const ForgeLogo: React.FC<ForgeLogoProps> = ({
  showWordmark = true,
  className = '',
}) => {
  return (
    <span
      className={`group inline-flex items-center gap-[var(--space-12)] select-none ${className}`}
    >
      {/* Abstract "F" made of two geometric planes moving toward each other with a small orange spark at the center */}
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="shrink-0 overflow-visible"
      >
        {/* Outer precision frame */}
        <rect
          x="1"
          y="1"
          width="26"
          height="26"
          rx="4"
          className="fill-[var(--ink-900)] stroke-[var(--border-color-strong)] transition-colors duration-[var(--duration-fast)] group-hover:stroke-[var(--ink-300)]"
          strokeWidth="1"
        />

        {/* Upper-left geometric plane (Vertical spine + top cantilever of the F) */}
        <path
          d="M6.5 5.5H21.5L18.5 9.5H11V22.5H6.5V5.5Z"
          className="fill-[var(--paper)] transition-transform duration-[var(--duration-fast)] ease-[var(--ease-default)] group-hover:translate-x-[0.75px] group-hover:translate-y-[0.5px]"
        />

        {/* Lower-right geometric plane moving toward the spine (Middle crossbar plane of the F) */}
        <path
          d="M14.5 13H21.5L19.5 17H12.5L14.5 13Z"
          className="fill-[var(--ink-300)] transition-transform duration-[var(--duration-fast)] ease-[var(--ease-default)] group-hover:-translate-x-[1px] group-hover:-translate-y-[0.5px]"
        />

        {/* Center convergence spark (the ONLY orange accent in the logo) */}
        <rect
          x="12.25"
          y="11.25"
          width="3.5"
          height="3.5"
          transform="rotate(45 12.25 11.25)"
          className="fill-[var(--forge)] transition-transform duration-[var(--duration-fast)] ease-[var(--ease-default)] group-hover:scale-110"
        />
      </svg>

      {showWordmark && (
        <span className="type-body-l font-[var(--font-display)] font-bold tracking-[0.08em] uppercase text-[var(--paper)] leading-none">
          {SITE_CONTENT.brand.name}
        </span>
      )}
    </span>
  );
};
