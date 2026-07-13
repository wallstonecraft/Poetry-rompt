import React, { useState } from 'react';

/* Quiet, low-emphasis entry point to reporting — lives in an overflow menu,
   never a prominent icon in the primary action row, so the feed doesn't
   feel like it's bracing for conflict. */

export function ReportAction({ onReport, style }) {
  const [open, setOpen] = useState(false);
  const REASONS = ['Spam', 'Harassment or hate', 'Plagiarism', 'Something else'];
  return (
    <div style={{ position: 'relative', ...style }}>
      <button
        aria-label="More options"
        onClick={() => setOpen((o) => !o)}
        style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--ink-3)', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <circle cx="5" cy="12" r="1.6" fill="currentColor" />
          <circle cx="12" cy="12" r="1.6" fill="currentColor" />
          <circle cx="19" cy="12" r="1.6" fill="currentColor" />
        </svg>
      </button>
      {open && (
        <div style={{ position: 'absolute', right: 0, top: 36, background: 'var(--paper-0)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-md)', border: '1px solid var(--border-hairline)', minWidth: 176, overflow: 'hidden', zIndex: 30 }}>
          {REASONS.map((r) => (
            <div
              key={r}
              onClick={() => { setOpen(false); onReport && onReport(r); }}
              style={{ padding: '10px 14px', font: 'var(--text-body)', color: 'var(--text-primary)', cursor: 'pointer' }}
            >
              {r}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
