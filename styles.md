# UI Style Guide
## InvoicePro — Design Language & Visual Direction (Shadcn Update)

**Version:** 2.0  
**Theme:** Emerald Light (Shadcn)  
**Design Philosophy:** Modern, accessible, and vibrant

---

## 1. Design Principles

| Principle | Description |
|-----------|-------------|
| **Professional** | Clean, structured layouts that inspire confidence in financial contexts |
| **Trustworthy** | Consistent visual hierarchy, clear status indicators, no ambiguous UI |
| **Fast** | Minimal decorative elements, functional-first design, immediate feedback |
| **Accessible** | High contrast text, generous tap targets, keyboard-navigable |

---

## 2. Color Palette (Shadcn/Emerald)

### Primary — Emerald Green (CTA)
The primary action color is a vibrant emerald green, inspired by Shadcn's default palette.

| Token | Value | Usage |
|-------|-------|-------|
| `primary-600` | `#059669` | Primary CTA buttons, active nav links |
| `primary-700` | `#047857` | Hover states on primary buttons |
| `primary-400` | `#34d399` | Accent text, highlights |
| `primary-100` | `#d1fae5` | Light backgrounds, badges |
| `primary-50`  | `#ecfdf5` | Hover backgrounds, subtle fills |

### Content — Neutral
```
Heading text:     oklch(0.13 0.01 286)  /* --foreground */
Body text:        oklch(0.13 0.01 286)
Secondary text:   oklch(0.52 0.02 162)  /* --muted-foreground */
Muted text:       oklch(0.968 0.005 162)  /* --muted */
```

### Backgrounds
```
Page background:  oklch(0.985 0.004 286)  /* --background */
Card surface:     oklch(1 0 0)            /* --card */
Subtle fill:      oklch(0.968 0.012 162)  /* --secondary */
Border:           oklch(0.928 0.006 162)  /* --border */
Divider:          oklch(0.928 0.006 162)
```

### Status Colors
| Status | Background | Text | Dot |
|--------|-----------|------|-----|
| Draft   | oklch(0.968 0.012 162) | oklch(0.52 0.02 162) | oklch(0.968 0.005 162) |
| Sent    | oklch(0.945 0.025 162) | oklch(0.529 0.131 162) | oklch(0.34 0.13 162) |
| Paid    | oklch(0.529 0.131 162) | oklch(0.985 0 0) | oklch(0.10 0.19 162) |
| Overdue | oklch(0.577 0.245 27.325) | oklch(0.704 0.191 22.216) | oklch(0.704 0.191 22.216) |

### Semantic Colors
```
Success:   oklch(0.529 0.131 162)  /* emerald-600 */
Warning:   oklch(0.72 0.16 40)     /* amber-600 */
Error:     oklch(0.577 0.245 27.325) /* red-600 */
```

### Sidebar
```
Background:       #0f172a  (slate-900)
Active link:      #1e40af  (primary-800)
Nav text:         #cbd5e1  (slate-300)
Active nav text:  #ffffff  (white)
Border separator: rgba(255,255,255,0.10)
```

---

## 3. Typography

### Fonts (Shadcn/Emerald)
- **Geist Variable** — Primary font for UI: headings, labels, navigation, buttons, body text
- **Fallback:** system-ui, sans-serif

```css
font-family: 'Geist Variable', system-ui, sans-serif;
```

Fonts are imported via Shadcn CLI and @fontsource-variable/geist.

### Type Scale
| Role | Size | Weight | Font |
|------|------|--------|------|
| Page Title | 24px / 1.5rem | 700 Bold | Geist Variable |
| Section Heading | 16px / 1rem | 700 Bold | Geist Variable |
| Card Title | 14px / 0.875rem | 600 SemiBold | Geist Variable |
| Body | 14px / 0.875rem | 400 Regular | Geist Variable |
| Small / Caption | 12px / 0.75rem | 400 Regular | Geist Variable |
| Label | 11px / 0.6875rem | 600 SemiBold | Geist Variable (uppercase + tracking) |
| Invoice Number | 14px | 700 Bold | Geist Variable |
| Table Amount | 14px | 700 Bold | Geist Variable |

### Label Style
All form labels follow: `UPPERCASE`, `letter-spacing: 0.05em`, `text-xs (11px)`, `font-semibold`, `text-muted-foreground`

---

## 4. Spacing System

Uses Tailwind's default spacing scale (4px base unit):

| Token | px | Usage |
|-------|----|-------|
| 1 | 4px | Minimum gaps, inner icon padding |
| 2 | 8px | Small gaps, compact list items |
| 3 | 12px | Button icon gap, badge padding |
| 4 | 16px | Standard element spacing |
| 5 | 20px | Card inner padding (compact) |
| 6 | 24px | Page padding, card padding |
| 8 | 32px | Section gaps |
| 12 | 48px | Large section separation |

---

## 5. Component Styles

### Buttons (Shadcn)

**Primary (CTA)**
```
Background: oklch(0.529 0.131 162) (emerald-600)
Text: white, 14px, font-semibold
Padding: 10px 16px
Border radius: 12px (rounded-xl)
Hover: oklch(0.047857) (emerald-700)
Active: scale(0.98)
Shadow: card
```

**Secondary**
```
Background: white
Border: 1px solid oklch(0.928 0.006 162)
Text: oklch(0.13 0.01 286), 14px, font-semibold
Same radius, padding, transitions as Primary
```

**Danger**
```
Background: oklch(0.577 0.245 27.325) (red-600)
Hover: oklch(0.704 0.191 22.216) (red-700)
```

**Success**
```
Background: oklch(0.529 0.131 162) (emerald-600)
Hover: oklch(0.047857) (emerald-700)
```

### Cards
```
Background: oklch(1 0 0) (white)
Border: 1px solid oklch(0.928 0.006 162)
Border radius: 16px (rounded-2xl)
Shadow: card
Padding: 24px (p-6)
Hover shadow: card-hover
```

### Form Inputs
```
Background: oklch(1 0 0) (white)
Border: 1px solid oklch(0.928 0.006 162)
Border radius: 12px (rounded-xl)
Padding: 10px 14px
Font: 14px Geist Variable
Placeholder color: oklch(0.968 0.005 162)
Focus ring: 2px oklch(0.529 0.131 162), border transparent
Transition: all 150ms
```

### Status Badges
```
Display: inline-flex with dot indicator
Dot: 6px circle
Padding: 4px 10px
Border radius: full (pill)
Font: 12px, font-semibold
```

### Data Tables
```
Header row: 
  - bg-slate-50
  - text-xs font-semibold text-slate-500 UPPERCASE
  - letter-spacing: 0.05em
  - padding: 12px 16px

Data cells:
  - padding: 14px 16px
  - border-bottom: 1px slate-50
  - hover: bg-slate-50

Last row: no border
```

---

## 6. Navigation & Sidebar

### Sidebar (Desktop — fixed 256px)
```
Background: slate-900 (#0f172a)
Width: 256px (w-64)
Logo area: 20px vertical padding, border-bottom
Nav links: 40px height, 12px horizontal padding
Active: bg-primary-800, text-white
Inactive: text-slate-300, hover:bg-white/10 hover:text-white
Bottom user area: border-top
```

### Mobile Navigation
```
Sidebar: hidden by default, slides in from left on hamburger click
Overlay: black/50 behind sidebar
Hamburger: top-left of mobile header bar
Header bar: white, border-bottom, shows logo
```

### Nav Link Layout
```
flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
Icon: 18px, shrink-0
Label: text-sm
```

---

## 7. Invoice / Receipt Branding

### Invoice PDF Header
```
Background: #1e40af (dark blue)
Business name: white, 18px bold
Address/contact: primary-200 (light blue), 8.5px
"INVOICE" label: white, 22px bold (right-aligned)
Invoice number: white, 10px (right-aligned)
```

### Receipt PDF Header
```
Background: #059669 (emerald green — distinct from invoice)
"RECEIPT" label: white, 22px bold
Payment banner: emerald-100 bg, emerald-700 text, "✓ PAYMENT CONFIRMED"
```

### PDF Footer
```
Horizontal rule: slate-200
"Generated by InvoicePro" centered, gray, 8px
```

---

## 8. Iconography

Using **Lucide React** icon library throughout:
- 18px standard icon size in UI elements
- 16px in compact contexts (table actions, badges)
- 20px in stat cards and section headers
- 48px in empty state illustrations (0.3 opacity)

---

## 9. Responsive Breakpoints

| Breakpoint | Width | Layout |
|-----------|-------|--------|
| Mobile (default) | < 640px | Single column, hidden sidebar |
| Tablet (sm) | ≥ 640px | 2-column grids, modal forms |
| Desktop (lg) | ≥ 1024px | Sidebar visible, 3-col dashboard |
| Wide (xl) | ≥ 1280px | Max-width 1280px centered |

### Mobile-specific
- Sidebar replaced by slide-in drawer with overlay
- Hamburger menu in sticky top header
- Stats grid: 2 columns (vs 4 on desktop)
- Invoice table: horizontal scroll
- Modals: full-width with 16px padding

---

## 10. Animation & Interaction

```
Button active: transform scale(0.95), duration: 150ms
Sidebar transition: translateX, ease-out, 300ms
Card hover: shadow increase, duration: 200ms
Input focus: ring + border change, duration: 150ms
Status transitions: color/opacity, 150ms ease
Loading spinner: 1s linear infinite spin
```

---

## 11. Empty States

All empty states follow the same pattern:
```
Icon: 48px, slate-300, margin-bottom: 12px
Heading: 18px semibold, slate-700
Description: 14px, slate-400, max-width 384px, centered
CTA: primary button, margin-top: 24px
```

---

## 12. Accessibility

- All interactive elements have visible focus styles
- Color is never the sole indicator of state (always includes text)
- Minimum touch target: 44px × 44px (mobile)
- Modals trap focus and close on overlay click or Escape
- Form errors announced inline below inputs
