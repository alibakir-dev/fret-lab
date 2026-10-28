// ============================================================================
// Module Imports
// ============================================================================

import {
  getScaleNotes,
  getChordNotes,
  getRotatedScale,
  TUNINGS,
} from "./theory.js";

function bootstrap() {
  const rootStyles = getComputedStyle(document.documentElement);
  const accentColor = rootStyles.getPropertyValue("--accent-orange").trim();

  const statusEl = document.getElementById("boot-status");
  if (statusEl) {
    statusEl.textContent = `[SYSTEM READY] M0 Bootstrap OK - Signal Token: ${accentColor}`;
  }

  console.log(
    `%c FretLab M0 Ready %c Signal: ${accentColor}`,
    "background: #ff5a1f; color: #111317; font-weight: bold; padding: 2px 6px; border-radius: 3px;",
    "color: #9ca3af; font-family: monospace;",
  );
}

bootstrap();

// ============================================================================
// Console Diagnostics & Manual Testing Hook
// ============================================================================

Object.assign(window, {
  getScaleNotes,
  getChordNotes,
  getRotatedScale,
  TUNINGS,
});
