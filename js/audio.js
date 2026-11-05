// ============================================================================
// Web Audio Context Singleton & Autoplay Policy Unlock
// ============================================================================

import { CHROMATIC_SCALE } from "./theory.js";

let audioCtx = null;

export function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContextClass();
  }

  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }

  return audioCtx;
}

// ============================================================================
// Pitch, MIDI & Equal-Temperament Frequency Math
// ============================================================================

export function pitchToMidi(pitch) {
  const normalized = pitch.trim();
  const noteName = normalized.slice(0, -1).toUpperCase();
  const octave = Number(normalized.slice(-1));

  const noteIndex = CHROMATIC_SCALE.indexOf(noteName);
  if (noteIndex === -1 || Number.isNaN(octave)) {
    throw new Error(`Invalid scientific pitch: "${pitch}"`);
  }

  return (octave + 1) * 12 + noteIndex;
}

export function midiToFrequency(midiNumber) {
  return 440 * Math.pow(2, (midiNumber - 69) / 12);
}

export function pitchToFrequency(pitch) {
  return midiToFrequency(pitchToMidi(pitch));
}

// ============================================================================
// Synthesizer ADSR Envelope Constants (in Seconds)
// ============================================================================

const ADSR = {
  attack: 0.005,
  decay: 0.15,
  sustain: 0.3,
  release: 0.4,
  peakGain: 0.25,
};

// ============================================================================
// Polyphonic Tone Synthesizer
// ============================================================================

export function playFrequency(
  frequency,
  waveType = "triangle",
  delaySeconds = 0,
) {
  const ctx = getAudioContext();
  const startTime = ctx.currentTime + delaySeconds;

  const oscillator = ctx.createOscillator();
  const envelope = ctx.createGain();

  oscillator.type = waveType;
  oscillator.frequency.setValueAtTime(frequency, startTime);

  // Schedule ADSR Gain Envelope on the Hardware Audio Clock
  const attackEnd = startTime + ADSR.attack;
  const decayEnd = attackEnd + ADSR.decay;
  const releaseEnd = decayEnd + ADSR.release;
  const sustainGain = ADSR.peakGain * ADSR.sustain;

  envelope.gain.setValueAtTime(0.0001, startTime);
  envelope.gain.linearRampToValueAtTime(ADSR.peakGain, attackEnd);
  envelope.gain.exponentialRampToValueAtTime(sustainGain, decayEnd);
  envelope.gain.exponentialRampToValueAtTime(0.0001, releaseEnd);

  // Guitar Tone Shaping: Dynamic Low-Pass Filter (Pluck Brightness -> Warmth)
  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(Math.min(frequency * 10, 10000), startTime);
  filter.frequency.exponentialRampToValueAtTime(
    Math.max(frequency * 4, 900),
    decayEnd,
  );

  // Connect Audio Graph: Oscillator -> Envelope -> Speakers
  oscillator.connect(filter);
  filter.connect(envelope);
  envelope.connect(ctx.destination);

  oscillator.start(startTime);
  oscillator.stop(releaseEnd + 0.02);
}

// ============================================================================
// Karplus-Strong Physical Modeling Engine (Steel-String Acoustic Guitar)
// ============================================================================

export function playAcousticPluck(frequency, delaySeconds = 0) {
  const ctx = getAudioContext();
  const startTime = ctx.currentTime + delaySeconds;
  const sampleRate = ctx.sampleRate;
  const duration = 1.6;
  const totalSamples = Math.floor(sampleRate * duration);

  const buffer = ctx.createBuffer(1, totalSamples, sampleRate);
  const samples = buffer.getChannelData(0);

  const period = Math.max(2, Math.round(sampleRate / frequency));
  const damping = Math.min(0.9985, 0.992 + (frequency / 2000) * 0.006);

  // 1. Pick Strike Excitation: Fill first wave cycle with smoothed pluck burst
  let prevNoise = 0;
  for (let i = 0; i < period; i++) {
    const whiteNoise = Math.random() * 2 - 1;
    samples[i] = 0.5 * (whiteNoise + prevNoise);
    prevNoise = whiteNoise;
  }

  // 2. Wave Propagation: Average adjacent samples from previous vibration cycle
  for (let i = period; i < totalSamples; i++) {
    const first = samples[i - period];
    const second = i > period ? samples[i - period - 1] : samples[period - 1];
    samples[i] = damping * 0.5 * (first + second);
  }

  // 3. Play Synthesized String Buffer
  const source = ctx.createBufferSource();
  const outputGain = ctx.createGain();
  outputGain.gain.setValueAtTime(0.38, startTime);
  outputGain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

  source.buffer = buffer;
  source.connect(outputGain);
  outputGain.connect(ctx.destination);
  source.start(startTime);
}

export function playNote(pitch, toneType = "acoustic", delaySeconds = 0) {
  const frequency = pitchToFrequency(pitch);

  if (toneType === "acoustic") {
    playAcousticPluck(frequency, delaySeconds);
  } else if (toneType === "electric") {
    playFrequency(frequency, "sawtooth", delaySeconds);
  } else {
    playFrequency(frequency, toneType, delaySeconds);
  }
}

// ============================================================================
// Staggered Polyphonic Chord Strummer
// ============================================================================

export function strumChord(pitches, toneType = "acoustic", staggerMs = 20) {
  const staggerSeconds = staggerMs / 1000;

  pitches.forEach((pitch, index) => {
    playNote(pitch, toneType, staggerSeconds * index);
  });
}
