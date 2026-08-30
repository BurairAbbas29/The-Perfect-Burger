# Interactive Burger Builder: Implementation Plan

## Context
The goal is to build a premium, highly interactive, and educational website that teaches users how to build the "perfect burger". The user wants a short, cinematic experience that combines drag-and-drop mechanics with physics-based scroll animations (a hybrid of pinning and scroll-linked drops). The project will be built for easy deployment.

## Design Engineering & Visual Identity
- **Framework**: React + Vite (perfect for fast Vercel deployment)
- **Typography**: Cabinet Grotesk / Inter fallback.
- **Hero Architecture**: Cinematic Center. A massive headline (strictly 2-3 lines) with a full-bleed dark radial wash.
- **Animation**: `gsap` & `@gsap/react` for pinning sections and dropping items. `@dnd-kit/core` for the drag/drop feature.

## The Hybrid Mechanism
1. **Pin**: User scrolls into a section (e.g., "The Patty"). GSAP pins the screen.
2. **Interact**: User sees floating ingredients. They drag the correct one to the dropzone. Incorrect items bounce back.
3. **Unlock**: Upon dropping the correct item, educational text scrubs in. GSAP unpins the section.
4. **Physics Drop**: As the user scrolls down, the successfully placed ingredient animates downward, falling onto the "Burger Stack" that persists globally.

## Implementation Steps
1. Initial scaffold (Vite + React + Tailwind + GSAP).
2. Wire up `App.jsx` with Lenis smooth scroll and core GSAP context.
3. Build the Cinematic Hero section.
4. Build `BurgerStack.jsx` component that lives globally and catches dropped ingredients.
5. Build `BurgerLayer.jsx` that handles the pinning, the DnDKit dropzone, and the unpin-when-completed logic.