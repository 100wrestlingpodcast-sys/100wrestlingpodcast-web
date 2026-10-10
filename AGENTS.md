# 100% Wrestling Web Application Rules

This document defines critical design decisions and layout rules for the **100% Wrestling Podcast** website. These rules must be strictly followed during any future updates, code modifications, or iterations.

## 1. Patreon / Exclusive Content Banner (Homepage)
- **Mobile Layout**: The Patreon Promo Banner MUST always maintain a **horizontal bar layout** (`flex-row`) on mobile/tablet viewports. It must NEVER be changed to a stacked vertical layout or a large full-screen card.
- **Mobile Dimensions & Spacing**:
  - Keep a minimal vertical height (approx. `90px` to `110px`) on mobile viewports.
  - Scale the Patreon logo to a compact size (e.g., `w-14 h-14` or `w-16 h-16`) on mobile.
  - Display benefits inline (e.g., separated by bullet dots `•`) in uppercase to save space.
  - Place the primary button as a compact pill on the right side.
- **Aesthetics**:
  - Strong solid black background (`bg-black`).
  - Striking thick yellow border (`border-2 border-[#FFD400]`) with a subtle yellow outer glow.
  - No background image overlays on the Patreon section.

## 2. Weekly Calendar Grid & Mobile Swipe Carousel
- **Desktop Viewport**: The schedule must remain in a clean, standard 3-column grid. Never let the desktop view stretch horizontally or capture desktop scroll gestures.
- **Mobile Viewport**: The schedule card row must display as a horizontal touch-swipe snap carousel with hidden scrollbars, snap alignments, and slide indicator dots.
