# FretLab

Interactive 6-String Guitar Fretboard, Music Theory Engine, Polyphonic Web Audio Synthesizer & Lookahead Metronome.

## Tech Stack
- **Plain HTML5 & CSS3** (Custom Properties, Matte Industrial Theme)
- **Vanilla JavaScript (ES Modules)** — Zero dependencies, no npm, no bundlers
- **Native Web Audio API** (`AudioContext`, `OscillatorNode`, `GainNode`)

## Running Locally
Because ES Modules enforce CORS over `http://`, serve the root folder with VS Code **Live Server** or Python:

```bash
python -m http.server 5500
```