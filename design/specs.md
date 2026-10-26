# FretLab Design Specifications

## Live design

https://fit-equity-47872459.figma.site/

## 1. COLORS (HEX & RGBA)

### Dark theme

The first nine variables are defined directly in `:root`; the remaining names document literal colors used by individual components.

| Suggested CSS variable | HEX | RGBA | Usage |
|---|---:|---:|---|
| `--bg-canvas` / existing `--bg` | `#111317` | `rgba(17, 19, 23, 1)` | Main canvas |
| `--bg-panel` / existing `--panel` | `#15181D` | `rgba(21, 24, 29, 1)` | Top panel |
| `--bg-fretboard` / existing `--slab` | `#181B20` | `rgba(24, 27, 32, 1)` | Fretboard slab |
| `--bg-raised` / existing `--raised` | `#20242B` | `rgba(32, 36, 43, 1)` | Active controls |
| `--border-default` / existing `--line` | `#303640` | `rgba(48, 54, 64, 1)` | Default borders |
| `--border-fret` / existing `--fret` | `#3B424D` | `rgba(59, 66, 77, 1)` | Fret wires |
| `--text-muted` / existing `--muted` | `#9CA3AF` | `rgba(156, 163, 175, 1)` | Secondary text |
| `--text-primary` / existing `--text` | `#F4F5F7` | `rgba(244, 245, 247, 1)` | Primary text |
| `--accent-orange` / existing `--orange` | `#FF5A1F` | `rgba(255, 90, 31, 1)` | Roots and primary actions |
| `--accent-green` / existing `--green` | `#10B981` | `rgba(16, 185, 129, 1)` | Chord tones and active states |
| `--accent-cyan` / existing `--cyan` | `#38BDF8` | `rgba(56, 189, 248, 1)` | Scale tones and voicing text |
| `--bg-deep` | `#0E1013` | `rgba(14, 16, 19, 1)` | Dock and mode controls |
| `--bg-code` | `#111419` | `rgba(17, 20, 25, 1)` | Formula pills and nut cells |
| `--bg-status` | `#12151A` | `rgba(18, 21, 26, 1)` | String status column |
| `--bg-control` | `#16191E` | `rgba(22, 25, 30, 1)` | Root buttons |
| `--bg-select` | `#171A1F` | `rgba(23, 26, 31, 1)` | Select controls |
| `--bg-status-button` | `#191D23` | `rgba(25, 29, 35, 1)` | String status buttons |
| `--bg-scale-marker` | `#1C2A31` | `rgba(28, 42, 49, 1)` | Scale note markers |
| `--border-string-row` | `#20252C` | `rgba(32, 37, 44, 1)` | String-row separators |
| `--border-status-row` | `#242932` | `rgba(36, 41, 50, 1)` | Status separators |
| `--gradient-highlight` | `#252A32` | `rgba(37, 42, 50, 1)` | Canvas radial gradient |
| `--metronome-led-off` | `#363C45` | `rgba(54, 60, 69, 1)` | Inactive beat LEDs |
| `--string-metal-dark` | `#4A515B` | `rgba(74, 81, 91, 1)` | String gradient |
| `--inlay` | `#555D68` | `rgba(85, 93, 104, 1)` | Fretboard inlays |
| `--border-status-control` | `#59616D` | `rgba(89, 97, 109, 1)` | String toggle borders |
| `--border-brand` | `#656D78` | `rgba(101, 109, 120, 1)` | Logo border |
| `--text-label-dark` | `#69717C` | `rgba(105, 113, 124, 1)` | Control labels |
| `--text-subtle` | `#6F7782` | `rgba(111, 119, 130, 1)` | Section descriptions |
| `--text-string-label` | `#767F8B` | `rgba(118, 127, 139, 1)` | String labels |
| `--nut-dark` | `#AAB0B9` | `rgba(170, 176, 185, 1)` | Nut edge |
| `--string-metal-light` | `#AEB4BD` | `rgba(174, 180, 189, 1)` | String gradient |
| `--nut-light` | `#C1C6CD` | `rgba(193, 198, 205, 1)` | Nut divider |
| `--text-formula` | `#C5CBD4` | `rgba(197, 203, 212, 1)` | Formula text |
| `--text-status` | `#D2D6DC` | `rgba(210, 214, 220, 1)` | Status control text |
| `--text-control` | `#DFE2E6` | `rgba(223, 226, 230, 1)` | Select text |
| `--shadow-black` | `#08090B` | `rgba(8, 9, 11, 1)` | Control shadows |
| `--green-contrast` | `#071A13` | `rgba(7, 26, 19, 1)` | Text over green markers |
| `--white` | `#FFFFFF` | `rgba(255, 255, 255, 1)` | Root markers and actions |

### Alpha and mixed colors

| Suggested variable | Actual CSS value | Equivalent result |
|---|---|---|
| `--panel-translucent` | `color-mix(in srgb, var(--panel) 94%, transparent)` | `rgba(21, 24, 29, 0.94)` |
| `--cyan-hover` | `color-mix(in srgb, var(--cyan) 8%, transparent)` | `rgba(56, 189, 248, 0.08)` |
| `--green-surface` | `color-mix(in srgb, var(--green) 12%, transparent)` | `rgba(16, 185, 129, 0.12)` |
| `--green-glow` | `color-mix(in srgb, var(--green) 42%, transparent)` | `rgba(16, 185, 129, 0.42)` |
| `--orange-surface` | `color-mix(in srgb, var(--orange) 10%, transparent)` | `rgba(255, 90, 31, 0.10)` |
| `--orange-glow-soft` | `color-mix(in srgb, var(--orange) 25%, transparent)` | `rgba(255, 90, 31, 0.25)` |
| `--orange-glow-strong` | `color-mix(in srgb, var(--orange) 52%, transparent)` | `rgba(255, 90, 31, 0.52)` |
| `--cyan-marker-border` | `color-mix(in srgb, var(--cyan) 50%, #20252c)` | `#2C7192` / `rgba(44, 113, 146, 1)` |

### Gradients

```css
radial-gradient(circle at 50% -20%, #252a32 0, #111317 38%);
linear-gradient(#aeb4bd, #4a515b);
```

### Light theme

No light-theme variables, media query, or alternate light color scheme currently exists.

## 2. TYPOGRAPHY

### Font families

```css
--font-sans: 'Manrope', sans-serif;
--font-mono: 'DM Mono', monospace;
```

- Manrope loaded weights: `400`, `500`, `600`, `700`, `800`
- DM Mono loaded weights: `400`, `500`

### Sizes, weights, and line heights

| Text style | Family | Weight | Size | Line height |
|---|---|---:|---:|---:|
| Body/default | Manrope | `400` | `16px / 1rem` | Browser `normal` |
| Main chord name | Manrope | `700` | `clamp(34px, 3.4vw, 54px)` / `2.125–3.375rem` | `1` |
| Brand name | Manrope | `700` | `18px / 1.125rem` | `1.1` |
| Brand subtitle | DM Mono | `500` | `9px / 0.5625rem` | `1.2` |
| Section heading | Manrope | `700` | `12px / 0.75rem` | Browser `normal` |
| Section description | DM Mono | `400` | `9px / 0.5625rem` | Browser `normal` |
| Formula/voicing pills | DM Mono | `500` | `10px / 0.625rem` | Browser `normal` |
| Eyebrows and legends | DM Mono | `500` | `9px / 0.5625rem` | Browser `normal` |
| Control labels | DM Mono | `500` | `8px / 0.5rem` | Browser `normal` |
| Standard controls | DM Mono | `500` | `9–10px / 0.5625–0.625rem` | Browser `normal` |
| String-status symbols | DM Mono | `500` | `11px / 0.6875rem` | Browser `normal` |
| Metronome button | DM Mono | `600` | `9px / 0.5625rem` | Browser `normal` |
| Selected note marker | DM Mono | `700` | `9px / 0.5625rem` | Browser `normal` |
| BPM readout | DM Mono | `500` | `25px / 1.5625rem` | Browser `normal` |
| BPM suffix | DM Mono | `400` | `8px / 0.5rem` | Browser `normal` |

### Letter spacing

```css
-2px;
-0.045em;
0.06em;
0.08em;
0.10em;
0.12em;
0.13em;
0.15em;
```

## 3. SPACING & LAYOUT

### Literal spacing scale

```text
3px, 4px, 5px, 6px, 7px, 8px, 9px, 10px, 12px, 13px, 14px,
15px, 16px, 17px, 18px, 20px, 22px, 24px, 25px, 26px, 28px,
31px, 34px, 38px, 42px, 43px, 88px
```

Viewport and percentage values: `3vw`, `3.4vw`, `100%`, `100vh`.

### Container width

There is no maximum application container width. The app spans the viewport. The fretboard uses horizontal scrolling:

```css
.board-grid {
  grid-template-columns: 88px minmax(1600px, 1fr);
  min-width: 1688px;
}
```

- Neck minimum: `1600px / 100rem`
- Status column plus neck: `1688px / 105.5rem`
- Status column: `88px / 5.5rem`

### Main section padding

```css
/* Header */             padding: 24px 3vw;
/* Workspace */          padding: 28px 3vw 26px;
/* Dock sections */      padding: 22px 3vw;
/* Mobile header */      padding: 20px;
/* Mobile workspace */   padding-inline: 20px;
/* Analysis panel */     padding: 0 28px;
/* Mobile analysis */    padding: 18px 0;
```

### Component padding

```css
/* Mode options */       padding: 10px 14px;
/* Formula pills */      padding: 6px 9px;
/* String status */      padding: 0 12px;
/* Selects */            padding: 0 34px 0 12px;
/* Metronome button */   padding: 0 13px;
```

### Key dimensions and breakpoints

- Header minimum height: `146px / 9.125rem`
- Workspace minimum height: `410px / 25.625rem`
- Dock minimum height: `166px / 10.375rem`
- String row: `43px / 2.6875rem`
- Icon button: `42px / 2.625rem`
- Status button and note bead: `25px / 1.5625rem`
- Root button: minimum `31px`, height `33px`
- Select and metronome button: `38px / 2.375rem`
- Top fret-number rail: `26px / 1.625rem`
- Breakpoints: `1050px / 65.625rem`, `700px / 43.75rem`

## 4. RADII & BORDERS

### Corner radii

| Value | rem equivalent | Usage |
|---:|---:|---|
| `3px` | `0.1875rem` | Active toggle segment |
| `4px` | `0.25rem` | Pills, root buttons, selects, metronome |
| `5px` | `0.3125rem` | Brand mark |
| `6px` | `0.375rem` | Mode-switch shell |
| `7px` | `0.4375rem` | Fretboard/status outer corners |
| `50%` | — | Circular buttons, notes, LEDs and inlays |

Directional radii:

```css
border-radius: 7px 0 0 7px;
border-radius: 0 7px 7px 0;
```

### Borders

```css
border: 1px solid #303640;
border: 1px solid #59616d;
border: 1px solid #656d78;
border: 1px solid #38bdf8;
border: 1px solid #10b981;
border: 1px solid color-mix(in srgb, #38bdf8 50%, #20252c);

border-bottom: 1px solid #303640;
border-top: 1px solid #303640;
border-left: 1px solid #303640;
border-right: 1px solid #303640;
border-bottom: 1px solid #242932;
border-bottom: 1px solid #20252c;
border-right: 1px solid #3b424d;

border-right: 3px solid #aab0b9;
border-right: 3px solid #c1c6cd;
```

String gauges use `1px`, `1.5px`, `2px`, `2.5px`, `3px`, and `4px`.

## 5. SHADOWS & MOTION

### Shadows

```css
box-shadow: inset 0 0 0 3px #111317;
box-shadow: 0 1px 4px #08090b;
box-shadow: 0 1px 1px #08090b;
box-shadow: 0 0 8px #10b981;
box-shadow: 0 0 8px #ff5a1f;
box-shadow: 0 0 14px rgba(16, 185, 129, 0.42);
box-shadow: 0 0 16px rgba(255, 90, 31, 0.52);
box-shadow: 0 0 15px rgba(255, 90, 31, 0.25);
box-shadow: 0 0 24px rgba(255, 90, 31, 0.25);
```

### Motion

There are no CSS transitions, animations, durations, or easing functions. Interactive visual state changes are immediate.

The JavaScript metronome interval is:

```js
60000 / bpm
```

At the default `108 BPM`, the interval is approximately `555.56ms`.
