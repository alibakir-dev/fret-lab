// ============================================================================
// Fretboard Constants & Theory Imports
// ============================================================================

import { CHROMATIC_SCALE, TUNINGS, getScaleNotes } from "./theory.js";

export const TOTAL_FRETS = 24;

const SINGLE_INLAY_FRETS = new Set([3, 5, 7, 9, 15, 17, 19, 21]);
const DOUBLE_INLAY_FRETS = new Set([12, 24]);
const STRING_GAUGES = ["1px", "1.3px", "1.6px", "2px", "2.5px", "3px"];

// ============================================================================
// Fret Pitch & Octave Calculation
// ============================================================================

export function getFretNote(openPitch, fretNumber) {
  const openNote = openPitch.slice(0, -1);
  const openOctave = Number(openPitch.slice(-1));

  const openIndex = CHROMATIC_SCALE.indexOf(openNote);
  if (openIndex === -1) {
    throw new Error(`Invalid open string pitch: "${openPitch}"`);
  }

  const absoluteSteps = openIndex + fretNumber;
  const note = CHROMATIC_SCALE[absoluteSteps % CHROMATIC_SCALE.length];
  const octaveShift = Math.floor(absoluteSteps / CHROMATIC_SCALE.length);
  const octave = openOctave + octaveShift;

  return {
    note,
    octave,
    pitch: `${note}${octave}`,
  };
}

// ============================================================================
// Dynamic Fretboard DOM Renderer
// ============================================================================

export function renderFretboard(container, config = {}) {
  const {
    rootNote = "A",
    scaleType = "minor-pentatonic",
    tuningKey = "standard",
  } = config;

  const openStrings = TUNINGS[tuningKey] || TUNINGS.standard;
  const scaleData = getScaleNotes(rootNote, scaleType);

  const activeScaleMap = new Map(
    scaleData.steps.map((step) => [step.note, step]),
  );

  // 1. Build Fret Numbers Row (0 = OPEN, 1..24)
  let numbersHTML = "";
  for (let fret = 0; fret <= TOTAL_FRETS; fret++) {
    const isMarked =
      SINGLE_INLAY_FRETS.has(fret) || DOUBLE_INLAY_FRETS.has(fret);
    const markedClass = isMarked ? " fretboard__number--marked" : "";
    const label = fret === 0 ? "OPEN" : fret;
    numbersHTML += `<span class="fretboard__number${markedClass}">${label}</span>`;
  }

  // 2. Build Fret Inlay Backdrop LAyer
  let inlaysHtml = "";
  for (let fret = 0; fret <= TOTAL_FRETS; fret++) {
    let dots = "";
    if (SINGLE_INLAY_FRETS.has(fret)) {
      dots = '<span class="fretboard__inlay-dot"></span>';
    } else if (DOUBLE_INLAY_FRETS.has(fret)) {
      dots =
        '<span class="fretboard__inlay-dot"></span><span class="fretboard__inlay-dot"></span>';
    }
    inlaysHtml += `<div class="fretboard__inlay-slot">${dots}</div>`;
  }

  // 3. Build 6 Guitar Strings & 25 Fret Positions (0..24) per String
  let stringsHtml = "";
  openStrings.forEach((openPitch, stringIndex) => {
    const stringNumber = stringIndex + 1;
    const gauge = STRING_GAUGES[stringIndex] || "1.5px";
    let fretsHtml = "";

    for (let fret = 0; fret <= TOTAL_FRETS; fret++) {
      const { note, pitch } = getFretNote(openPitch, fret);
      const scaleMatch = activeScaleMap.get(note);

      let stateClass = "";
      if (scaleMatch) {
        stateClass = scaleMatch.isRoot
          ? " fret-cell--root"
          : " fret-cell--scale";
      }
      const openClass = fret === 0 ? " fret-cell--open" : "";

      fretsHtml += `
        <button
          type="button"
          class="fret-cell${openClass}${stateClass}"
          data-string="${stringNumber}"
          data-fret="${fret}"
          data-note="${note}"
          data-pitch="${pitch}"
          aria-label="String ${stringNumber}, Fret ${fret}, Note ${pitch}"
        >
          <span class="note-badge">${note}</span>
        </button>`;
    }

    stringsHtml += `
        <div class="fretboard__string" style="--string-gauge: ${gauge}">
          ${fretsHtml}
        </div>`;
  });

  // 4. Commit Complete Fretboard HTML in a single DOM Write
  container.innerHTML = `
        <div class="fretboard">
          <div class="fretboard__numbers">${numbersHTML}</div>
          <div class="fretboard__neck">
            <div class="fretboard__inlays" aria-hidden="true">${inlaysHtml}</div>
            ${stringsHtml}
          </div>
        </div>`;
}

// ============================================================================
// Event Delegation Controller (Single Container Listener)
// ============================================================================

export function attachFretboardListener(container, onFretSelect) {
  container.addEventListener("click", (event) => {
    const fretbutton = event.target.closest("[data-fret]");

    if (!fretbutton || !container.contains(fretbutton)) {
      return;
    }

    const payload = {
      string: Number(fretbutton.dataset.string),
      fret: Number(fretbutton.dataset.fret),
      note: fretbutton.dataset.note,
      pitch: fretbutton.dataset.pitch,
    };

    if (typeof onFretSelect === "function") {
      onFretSelect(payload);
    }
  });
}
