# ♿ Accessibility Compliance

VoterWise is built to exceed **WCAG 2.1 Level AA** standards, ensuring that civic intelligence is accessible to every citizen.

## 🛠️ Automated Auditing
- **Axe-core**: Integrated into the development environment to catch 90% of a11y issues before commit.
- **CI Checks**: Pipeline fails if automated accessibility scores drop below 98/100.

## ⌨️ Keyboard & Screen Reader Support
- **Semantic HTML**: Proper use of `main`, `nav`, `section`, and `article` elements for logical document structure.
- **ARIA Implementation**: Descriptive labels for all interactive elements and live regions for real-time election updates.
- **Focus Management**: Controlled focus trapping for modals (Chat Assistant) and logical tab-order across complex dashboards.

## 🎨 Visual Accessibility
- **Contrast**: All design tokens meet a minimum 4.5:1 contrast ratio.
- **Motion**: `prefers-reduced-motion` support via Framer Motion to prevent vestibular distress.
- **Responsiveness**: Fluid layout support for screen magnifiers and mobile accessibility.

## 🧪 Manual Verification Protocol
Every production release undergoes a manual walkthrough using:
- **MacOS VoiceOver**
- **NVDA** (Windows)
- **Keyboard-only navigation** (no mouse)
