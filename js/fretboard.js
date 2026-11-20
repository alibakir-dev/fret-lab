// ============================================================================
// Fretboard Constants & Theory Imports
// ============================================================================

import {
  CHROMATIC_SCALE,
  TUNINGS,
  getScaleNotes,
  getChordNotes,
} from "./theory.js";

export const TOTAL_FRETS = 24;

const SINGLE_INLAY_FRETS = new Set([3, 5, 7, 9, 15, 17, 19, 21]);
const DOUBLE_INLAY_FRETS = new Set([12, 24]);

// ============================================================================
// Fret Pitch & Octave Calculation
// ============================================================================

export function getFretNote(of, fretNumber) {
  const openNote = of.slice(0, -1);
  const openOctave = Number(of.slice(-1));

  const openIndex = CHROMATIC_SCALE.indexOf(openNote);
  if (openIndex === -1) {
    throw new Error(`Invalid open string pitch: "${of}"`);
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
    rootNote = "C",
    scaleType = "major",
    tuningKey = "standard",
    displayMode = "intervals",
    selectedFrets = [0, 0, 0, 2, 3, null],
  } = config;

  const openStrings = TUNINGS[tuningKey] || TUNINGS.standard;
  const scaleData = getScaleNotes(rootNote, scaleType);

  const activeScaleMap = new Map(
    scaleData.steps.map((step) => [step.note, step]),
  );

  // 1. Build Top Fret Numbers Row (0..24)
  let numbersHtml = "";
  for (let fret = 0; fret <= TOTAL_FRETS; fret++) {
    numbersHtml += `<span>${fret}</span>`;
  }

  // 2. Build Fret Inlay Backdrop Layer
  let inlaysHtml = "";
  for (let fret = 0; fret <= TOTAL_FRETS; fret++) {
    let marker = "";
    if (SINGLE_INLAY_FRETS.has(fret)) {
      marker = '<i class="single-inlay"></i>';
    } else if (DOUBLE_INLAY_FRETS.has(fret)) {
      marker = '<i class="double-inlay"></i>';
    }
    inlaysHtml += `<div class="inlay-cell">${marker}</div>`;
  }

  // 3. Build Left String Status Column & 6 Guitar String Rows
  let statusRowsHtml = "";
  let stringsHtml = "";

  openStrings.forEach((openPitch, stringIndex) => {
    const stringNumber = stringIndex + 1;
    const openNote = openPitch.slice(0, -1);
    const activeFret = selectedFrets[stringIndex];

    let statusSymbol = "×";
    let statusBtnClass = "";
    if (activeFret === 0) {
      statusSymbol = "O";
    } else if (typeof activeFret === "number" && activeFret > 0) {
      statusSymbol = "•";
      statusBtnClass = "fretted";
    }

    statusRowsHtml += `
      <div class="string-status">
        <span>${stringNumber} · ${openNote}</span>
        <button
          type="button"
          class="${statusBtnClass}"
          data-status-string="${stringNumber}"
          aria-label="Toggle string ${stringNumber} status"
        >${statusSymbol}</button>
      </div>`;

    let fretsHtml = "";
    for (let fret = 0; fret <= TOTAL_FRETS; fret++) {
      const { note, pitch } = getFretNote(openPitch, fret);
      const scaleMatch = activeScaleMap.get(note);

      const isSelected = activeFret === fret;
      const isRootNote = note === rootNote;

      const selectedClass = isSelected ? " selected" : "";
      const rootClass = isSelected && isRootNote ? " is-root" : "";

      let beadHtml = "";
      if (scaleMatch || isSelected) {
        const intervalLabel = isRootNote
          ? "R"
          : scaleMatch
            ? scaleMatch.interval
            : note;
        const badgeText = displayMode === "intervals" ? intervalLabel : note;
        beadHtml = `<span class="note-bead">${badgeText}</span>`;
      }

      fretsHtml += `
        <button
          type="button"
          class="fret-cell${selectedClass}${rootClass}"
          data-string="${stringNumber}"
          data-fret="${fret}"
          data-note="${note}"
          data-pitch="${pitch}"
          aria-label="String ${stringNumber}, Fret ${fret}, Note ${pitch}"
        >${beadHtml}</button>`;
    }

    stringsHtml += `
      <div class="string-row gauge-${stringIndex}">
        ${fretsHtml}
      </div>`;
  });

  // 4. Commit Complete 2x2 Board Grid in a Single DOM Write
  container.innerHTML = `
    <div class="board-grid">
      <div class="status-label">STATUS</div>
      <div class="fret-top-label">${numbersHtml}</div>
      <div class="status-column">${statusRowsHtml}</div>
      <div class="fretboard">
        <div class="inlay-row" aria-hidden="true">${inlaysHtml}</div>
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

// ============================================================================
// Playable Guitar Chord Voicing Generator (Low-to-High Downstroke Order)
// ============================================================================

export function getChordVoicing(
  rootNote = "C",
  chordType = "maj7",
  tuningKey = "standard",
) {
  const openStrings = TUNINGS[tuningKey] || TUNINGS.standard;
  const chordData = getChordNotes(rootNote, chordType);
  const lowToHighStrings = [...openStrings].reverse();

  const pitches = [];
  let rootFound = false;
  for (const openPitch of lowToHighStrings) {
    for (let fret = 0; fret <= 4; fret++) {
      const { note, pitch } = getFretNote(openPitch, fret);

      const isValidNote = !rootFound
        ? note === chordData.root
        : chordData.notes.includes(note);

      if (isValidNote) {
        pitches.push(pitch);
        rootFound = true;
        break;
      }
    }
  }

  return pitches;
}