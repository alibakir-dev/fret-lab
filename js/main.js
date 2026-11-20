// ============================================================================
// Module Imports
// ============================================================================

import {
  getScaleNotes,
  getChordNotes,
  getRotatedScale,
  TUNINGS,
} from "./theory.js";

import {
  renderFretboard,
  attachFretboardListener,
  getFretNote,
  getChordVoicing,
} from "./fretboard.js";

import {
  getAudioContext,
  pitchToMidi,
  midiToFrequency,
  pitchToFrequency,
  playNote,
  strumChord,
} from "./audio.js";

function bootstrap() {
  const rootStyles = getComputedStyle(document.documentElement);
  const accentColor = rootStyles.getPropertyValue("--accent-orange").trim();

  const statusEl = document.getElementById("boot-status");
  if (statusEl) {
    statusEl.textContent = `[SYSTEM READY] M0 Bootstrap OK - Signal Token: ${accentColor}`;
  }

  const toneSelectEl = document.getElementById("tone-select");
  const strumBtnEl = document.getElementById("strum-btn");

  const boardConfig = {
    rootNote: "C",
    scaleType: "major",
    chordType: "maj7",
    tuningKey: "standard",
  };

  // Mount & Render Interactive 24-Fret Neck
  const fretboardEl = document.getElementById("fretboard-mount");
  if (fretboardEl) {
    renderFretboard(fretboardEl, boardConfig);

    attachFretboardListener(fretboardEl, (selection) => {
      const selectedTone = toneSelectEl ? toneSelectEl.value : "acoustic";

      console.log("Fret clicked:", selection);
      playNote(selection.pitch, selectedTone, 0);

      if (statusEl) {
        const rootTag =
          selection.note === boardConfig.rootNote ? " [ROOT]" : "";
        statusEl.textContent = `[FRET SELECT] String ${selection.string} | Fret ${selection.fret} | Note: ${selection.note} | Pitch: ${selection.pitch}${rootTag}`;
      }
    });
  }

  // Wire Polyphonic Chord Strum Button
  if (strumBtnEl) {
    strumBtnEl.addEventListener("click", () => {
      const selectedTone = toneSelectEl ? toneSelectEl.value : "acoustic";

      const chordPitches = getChordVoicing(
        boardConfig.rootNote,
        boardConfig.chordType,
        boardConfig.tuningKey,
      );

      strumChord(chordPitches, selectedTone);

      if (statusEl) {
        statusEl.textContent = `[CHORD STRUM] ${boardConfig.rootNote}${boardConfig.chordType} | Notes: ${chordPitches.join(" - ")} | Tone: ${selectedTone}`;
      }
    });
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
  getFretNote,
  getAudioContext,
  pitchToMidi,
  midiToFrequency,
  pitchToFrequency,
  playNote,
  strumChord,
  getChordVoicing,
  TUNINGS,
});
