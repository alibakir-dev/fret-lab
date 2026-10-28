// ============================================================================
// Chromatic Scale & Interval Constants
// ============================================================================

export const CHROMATIC_SCALE = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
];

export const INTERVAL_LABELS = [
  "1",
  "b2",
  "2",
  "b3",
  "3",
  "4",
  "b5",
  "5",
  "b6",
  "6",
  "b7",
  "7",
];

// ============================================================================
// Scale, Chord & Tuning Formula Dictionaries
// ============================================================================

export const SCALE_FORMULAS = {
  major: [0, 2, 4, 5, 7, 9, 11],
  "natural-minor": [0, 2, 3, 5, 7, 8, 10],
  "minor-pentatonic": [0, 3, 5, 7, 10],
  blues: [0, 3, 5, 6, 7, 10],
  dorian: [0, 2, 3, 5, 7, 9, 10],
  mixolydian: [0, 2, 4, 5, 7, 9, 10],
};

export const CHORD_FORMULAS = {
  // Triads, Power & Suspended Chords
  major: [0, 4, 7],
  minor: [0, 3, 7],
  dim: [0, 3, 6],
  aug: [0, 4, 8],
  sus2: [0, 2, 7],
  sus4: [0, 5, 7],
  power: [0, 7],
  // 7th Chords (4-Note Tetrads)
  dom7: [0, 4, 7, 10],
  maj7: [0, 4, 7, 11],
  min7: [0, 3, 7, 10],
  m7b5: [0, 3, 6, 10],
  dim7: [0, 3, 6, 9],
};
export const TUNINGS = {
  standard: ["E4", "B3", "G3", "D3", "A2", "E2"],
  "drop-d": ["E4", "B3", "G3", "D3", "A2", "D2"],
  dadgad: ["D4", "A3", "G3", "D3", "A2", "D2"],
};

// ============================================================================
// Chromatic Array Rotation (Modulo 12 Arithmetic)
// ============================================================================

export function getRotatedScale(rootNote) {
  const normalizedRoot = rootNote.trim().toUpperCase();
  const rootIndex = CHROMATIC_SCALE.indexOf(normalizedRoot);

  if (rootIndex === -1) {
    throw new Error(`Invalid root note: "${rootNote}"`);
  }

  return CHROMATIC_SCALE.map((_, step) => {
    const wrappedIndex = (rootIndex + step) % CHROMATIC_SCALE.length;
    return CHROMATIC_SCALE[wrappedIndex];
  });
}

// ============================================================================
// Scale & Chord Resolution Engine
// ============================================================================

function resolveFormula(rootNote, formulaKey, dictionary, label) {
  const intervals = dictionary[formulaKey];

  if (!intervals) {
    throw new Error(`Unknown ${label} type: "${formulaKey}"`);
  }

  const rotatedScale = getRotatedScale(rootNote);

  const steps = intervals.map((semitone) => ({
    note: rotatedScale[semitone % 12],
    interval: INTERVAL_LABELS[semitone % 12],
    semitones: semitone,
    isRoot: semitone === 0,
  }));

  return {
    root: rotatedScale[0],
    type: formulaKey,
    notes: steps.map((item) => item.note),
    intervals: steps.map((item) => item.interval),
    steps,
  };
}

export function getScaleNotes(rootNote, scaleType = "major") {
  return resolveFormula(rootNote, scaleType, SCALE_FORMULAS, "scale");
}

export function getChordNotes(rootNote, chordType = "major") {
  return resolveFormula(rootNote, chordType, CHORD_FORMULAS, "chord");
}
