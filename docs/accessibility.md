# VoterWise Accessibility Guidelines

## WCAG Compliance Checklist
- [x] **Color Contrast**: All text elements must meet WCAG AA (4.5:1) minimum contrast ratios.
- [x] **Semantic HTML**: Ensure every page has exactly one `<h1>` tag. Use proper `<nav>`, `<main>`, and `<article>` tags.
- [x] **Keyboard Navigation**: All interactive elements must be reachable via `Tab`.
- [x] **Screen Readers**: Provide `aria-label` or visually hidden text for icon-only buttons.
- [x] **Focus Management**: Modals must trap focus.

## Modal Focus Rules
The `ChatAssistant` modal uses `focus-trap-react`.
- When the assistant opens, focus is forced inside the chat window.
- Background elements are removed from the tab order.
- Closing the modal returns focus to the trigger button.

## ARIA Usage Strategy
- Only use ARIA when native HTML semantic elements are insufficient.
- Use `aria-live="polite"` for dynamic content updates (e.g., Live Election Ticker).
- Use `role="complementary"` for the Chat Assistant.
