---
name: WhatsApp Suggestion FAB
description: Add a floating action button to the bottom-right corner that redirects users to WhatsApp with a pre-filled suggestion template.
type: project
---

# Design Spec: WhatsApp Suggestion FAB

## Goal
Add a simple way for users to provide feedback or suggestions for the future of the Notion Timesheet app directly to the creator via WhatsApp.

## Technical Details

### Component Location
- **File:** `src/app/page.tsx`
- **Placement:** Within the main `Home` component, rendered as a fixed element relative to the viewport.

### Visual Design
- **Type:** Floating Action Button (FAB)
- **Shape:** Pill-shaped (rounded-full)
- **Label:** "💡 Suggestion"
- **Colors:** Gradient matching the main "Generate" button (`from-blue-600 to-indigo-600` for dark mode, `from-blue-500 to-indigo-500` for light mode).
- **Position:** Bottom-right corner (`bottom-6 right-6`).
- **Shadow:** Strong shadow (`shadow-lg` or `shadow-blue-500/20`) with hover effect (scale up).

### Integration Details
- **Target Number:** `087733236403`
- **Template Text:** `Halo RENN! I'm using your Notion Timesheet app and I'd like to suggest: `
- **Action:** Opens `https://wa.me/087733236403?text={encoded_text}` in a new tab.

## Implementation Plan
1. Define the WhatsApp URL with the encoded template text.
2. Add the FAB button to the JSX in `src/app/page.tsx`.
3. Apply Tailwind CSS classes for fixed positioning, styling, and animations.
4. Ensure the button is responsive and doesn't overlap with other critical UI elements.

## Success Criteria
- The button is visible in the bottom-right corner.
- Clicking the button opens WhatsApp with the correct phone number and pre-filled message.
- The button matches the app's overall design language.
