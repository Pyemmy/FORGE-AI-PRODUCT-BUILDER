import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { X } from 'lucide-react';
import { SITE_CONTENT } from '../content/siteContent';
import { ForgeLogo } from './ForgeLogo';

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SignInModal: React.FC<SignInModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!isOpen) {
      setSubmitted(false);
      setEmail('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-[var(--space-24)]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="signin-modal-title"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onClose}
            className="fixed inset-0 bg-[var(--ink-950)]/80 backdrop-blur-sm"
          />

          {/* Dialog Surface */}
          <motion.div
            initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full max-w-[420px] bg-[var(--ink-900)] border border-[var(--border-color-strong)] rounded-[var(--radius-16)] p-[var(--space-32)]"
          >
            <div className="flex items-center justify-between mb-[var(--space-24)]">
              <ForgeLogo />
              <button
                type="button"
                onClick={onClose}
                aria-label={SITE_CONTENT.signInModal.closeLabel}
                className="w-[36px] h-[36px] inline-flex items-center justify-center rounded-[var(--radius-8)] text-[var(--ink-300)] hover:text-[var(--paper)] hover:bg-[var(--ink-800)] transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <h2
              id="signin-modal-title"
              className="type-heading-s text-[var(--paper)] mb-[var(--space-8)]"
            >
              {SITE_CONTENT.signInModal.title}
            </h2>
            <p className="type-body-s text-[var(--ink-300)] mb-[var(--space-24)]">
              {SITE_CONTENT.signInModal.subtitle}
            </p>

            {submitted ? (
              <div className="p-[var(--space-16)] rounded-[var(--radius-8)] bg-[var(--ink-800)] border border-[var(--border-color-strong)]">
                <p className="type-mono text-[var(--paper)] mb-[var(--space-12)]">
                  {SITE_CONTENT.signInModal.feedbackMessage}
                </p>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-[var(--space-8)] px-[var(--space-16)] rounded-[var(--radius-8)] bg-[var(--ink-900)] border border-[var(--border-color-default)] type-body-s text-[var(--paper)] cursor-pointer"
                >
                  {SITE_CONTENT.signInModal.closeLabel}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-[var(--space-16)]">
                <div>
                  <label
                    htmlFor="signin-email"
                    className="block type-mono text-[var(--ink-300)] mb-[var(--space-8)]"
                  >
                    {SITE_CONTENT.signInModal.emailLabel}
                  </label>
                  <input
                    id="signin-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={SITE_CONTENT.signInModal.emailPlaceholder}
                    className="w-full px-[var(--space-16)] py-[var(--space-12)] rounded-[var(--radius-8)] bg-[var(--ink-950)] border border-[var(--border-color-strong)] focus:border-[var(--paper)] type-mono text-[var(--paper)] placeholder:text-[var(--ink-300)]"
                  />
                </div>

                <button
                  type="submit"
                  className="btn-primary-forge w-full py-[var(--space-12)] px-[var(--space-16)] rounded-[var(--radius-8)] type-body-s inline-flex items-center justify-center cursor-pointer"
                >
                  {SITE_CONTENT.signInModal.submitLabel}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
