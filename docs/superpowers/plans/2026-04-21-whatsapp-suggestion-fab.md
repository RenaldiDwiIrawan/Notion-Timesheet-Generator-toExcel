# WhatsApp Suggestion FAB Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a floating action button (FAB) that opens WhatsApp with a pre-filled suggestion template for the Notion Timesheet app.

**Architecture:** A fixed-position link styled as a pill-shaped button, integrated directly into the main page. It uses Tailwind CSS for styling and state-aware gradients.

**Tech Stack:** React, Next.js, Tailwind CSS.

---

### Task 1: Define WhatsApp Link and Logic

**Files:**
- Modify: `src/app/page.tsx:32-37` (near other state/refs)

- [ ] **Step 1: Define the WhatsApp link with encoded template**

Add the following constant inside the `Home` component:

```typescript
  const whatsappNumber = "087733236403";
  const whatsappTemplate = "Halo RENN! I'm using your Notion Timesheet app and I'd like to suggest: ";
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappTemplate)}`;
```

- [ ] **Step 2: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: define whatsapp contact logic"
```

### Task 2: Implement the Suggestion FAB

**Files:**
- Modify: `src/app/page.tsx:594-595` (before the "Crafted by" section)

- [ ] **Step 1: Add the FAB to the JSX**

Insert the button code before the footer text:

```tsx
          {/* WhatsApp Suggestion FAB */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold text-white shadow-lg transition-all hover:scale-105 active:scale-95 ${
              isDark
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 shadow-blue-500/20"
                : "bg-gradient-to-r from-blue-500 to-indigo-500 shadow-blue-400/30"
            }`}
          >
            <span>💡 Suggestion</span>
          </a>
```

- [ ] **Step 2: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: add floating whatsapp suggestion button"
```

### Task 3: Verification

**Files:**
- Test: Manual verification of UI and link

- [ ] **Step 1: Verify the link encoding**

Check that the generated URL is: `https://wa.me/087733236403?text=Halo%20RENN!%20I'm%20using%20your%20Notion%20Timesheet%20app%20and%20I'd%20like%20to%20suggest%3A%20`

- [ ] **Step 2: Final Check**

Verify the button is fixed at the bottom-right and looks consistent with the "Generate" button.

- [ ] **Step 3: Commit**

```bash
git commit --allow-empty -m "chore: verify whatsapp suggestion fab implementation"
```
