# ROADMAP: FretLab (v1.0.0)

Interactive 6-String Guitar Fretboard, Music Theory Engine, Polyphonic Synthesizer & Metronome.
Built with **plain HTML5, CSS3, and Vanilla JavaScript (ES Modules)**. No libraries, no build tools, zero dependencies.

---

## 1. Scope & Rules

| Topic             | Decision                                                                                                              |
| ----------------- | --------------------------------------------------------------------------------------------------------------------- |
| **Stack**         | Plain HTML5, CSS3, Vanilla JS (ES Modules). No framework, no npm, no build step                                       |
| **Audio**         | Native Web Audio API (`AudioContext`, `OscillatorNode`, `GainNode`)                                                   |
| **Architecture**  | Modular Vanilla JS (`js/theory.js`, `js/audio.js`, `js/fretboard.js`, `js/metronome.js`, `js/state.js`, `js/main.js`) |
| **State Pattern** | Decoupled Observer / Pub-Sub pattern                                                                                  |
| **Hosting**       | GitHub Pages (`https://<username>.github.io/fretlab/`)                                                                |

---

## 2. Milestones

### M0: Setup & Architecture Foundation
- **Branch:** `main` (initial bootstrap)
- **Tasks:**
  1. Set up clean directory structure: `index.html`, `css/tokens.css`, `css/base.css`, `css/components.css`, `js/main.js`.
  2. Implement CSS custom properties (tokens) matching Figma's matte industrial theme (`#111317` canvas, `#FF5A1F` signal orange, 14px root).
  3. Load Inter and JetBrains Mono fonts.
  4. Set up `README.md` and `.gitignore`.
- **Done when:**
  - `index.html` loads fonts and CSS tokens cleanly on Live Server.
  - Working tree is clean and pushed.

### M1: Theory Engine Algorithms (`js/theory.js`)
- **Branch:** `feat/theory-engine`
- **Tasks:**
  1. Define 12-tone chromatic scale array: `['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']`.
  2. Implement modulo arithmetic (`index % 12`) array rotation function to get notes starting from any root.
  3. Define scale interval formulas (Major: `[0, 2, 4, 5, 7, 9, 11]`, Minor Pentatonic: `[0, 3, 5, 7, 10]`, Blues, Dorian, Mixolydian).
  4. Define chord formulas (Major triad: `[0, 4, 7]`, Minor: `[0, 3, 7]`, 7th chords).
  5. Tuning definitions (Standard E: `['E4', 'B3', 'G3', 'D3', 'A2', 'E2']`, Drop D, DADGAD).
  6. Unit-test functions directly in the browser console (`getScaleNotes('A', 'minor-pentatonic')`).
- **Done when:**
  - Given any root note and scale/chord type, returns the exact note names and interval labels.

### M2: Interactive Fretboard DOM & Event Delegation (`js/fretboard.js`)
- **Branch:** `feat/fretboard-ui`
- **Tasks:**
  1. Render 6 strings and 24 frets dynamically using DOM methods or template strings.
  2. Render fret inlay markers (dots on 3, 5, 7, 9, 15, 17, 19, 21 and double dots on 12 & 24).
  3. Calculate note for every fret based on string open tuning and fret distance.
  4. Attach **ONE** event listener on the fretboard container (Event Delegation via `e.target.closest('[data-fret]')`).
  5. Highlight active scale notes on the neck (Signal Orange for Root, Studio Green for intervals).
- **Done when:**
  - Fretboard displays accurately at 24 frets.
  - Clicking any fret logs `{ string, fret, note }` without multiple listeners.

### M3: Web Audio Synthesizer Engine (`js/audio.js`)
- **Branch:** `feat/audio-synth`
- **Tasks:**
  1. Initialize `AudioContext` on first user gesture (unlocking browser audio autoplay policy).
  2. Implement note-to-frequency conversion formula: `f = 440 * Math.pow(2, (midiNumber - 69) / 12)`.
  3. Build sound synthesizer using `OscillatorNode` (Sine/Triangle/Sawtooth) + `GainNode` with ADSR envelope (Attack: 5ms, Decay: 150ms, Sustain: 0.3, Release: 400ms).
  4. Clicking any fret plays its real acoustic pitch.
  5. Implement "Strum Chord" function: takes active chord notes and plays them staggered (20ms delay per string) for a realistic guitar strum.
- **Done when:**
  - Clicking frets generates clean audio without clicking/popping artifacts.
  - Strum button plays clean polyphonic chords.

### M4: Rock-Solid Lookahead Metronome (`js/metronome.js`)
- **Branch:** `feat/metronome`
- **Tasks:**
  1. Implement Web Audio Lookahead Scheduler algorithm (using `audioContext.currentTime` instead of `setInterval` to eliminate drift).
  2. Synthesize high pitch click on beat 1 (880 Hz) and regular click on beats 2, 3, 4 (440 Hz).
  3. Sync visual pulsing LED with audio beats using `requestAnimationFrame`.
  4. Add BPM slider (40-240 BPM) and Tap Tempo calculator (averaging last 4 click time deltas).
- **Done when:**
  - Metronome runs continuously for 5 minutes without losing time.
  - BPM changes smoothly in real time.

### M5: State Management & Decoupled Pub/Sub (`js/state.js`)
- **Branch:** `feat/state-pubsub`
- **Tasks:**
  1. Write a 20-line Vanilla JS `createStore` / Pub-Sub event emitter.
  2. Centralize application state: `{ rootNote, scale, chord, tuning, bpm, isPlaying, waveType }`.
  3. Subscribe Fretboard, Audio, Metronome, and Info Display to state changes.
  4. Persist user preferences to `localStorage`.
- **Done when:**
  - Changing root note or scale instantly updates fretboard, audio sound, and inspector without direct module coupling.
  - Reloading page restores user settings.

### M6: Responsive Polish, Keyboard Controls & A11y
- **Branch:** `fix/polish-a11y`
- **Tasks:**
  1. Horizontal scrolling / pinch-zoom for fretboard on mobile screens.
  2. Keyboard shortcuts: Spacebar toggles metronome, numbers 1-6 pluck open strings.
  3. Ensure WCAG 4.5:1 text contrast and full `:focus-visible` states.
- **Done when:**
  - Works smoothly on desktop and mobile.
  - All interactive elements accessible via keyboard.

### M7: Deployment & Documentation
- **Branch:** `chore/deploy`
- **Tasks:**
  1. Deploy to GitHub Pages.
  2. Write comprehensive `README.md` explaining the music theory math, Web Audio timing algorithm, and architecture.
- **Done when:**
  - Live on GitHub Pages with zero console errors.