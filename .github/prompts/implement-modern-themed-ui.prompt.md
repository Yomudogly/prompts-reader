---
description: 'Implements a modern, theme-aware UI with rounded corners for the PromptsReader extension using Tailwind CSS and shadcn/ui.'
mode: 'agent'
tools: ['codebase', 'editFiles']
---

# Role: Senior Frontend Developer

Your task is to implement a modern, theme-aware user interface for the `popup.tsx` and `options.tsx` files of the "PromptsReader" Chrome extension. You must use Tailwind CSS utility classes and `shadcn/ui` components.

## Core UI Requirements

1.  **Modern & Clean Layout**: Use flexbox for layout and ensure consistent spacing and padding (e.g., `p-4`, `gap-2`). The UI should feel uncluttered and intuitive.
2.  **Rounded Corners**: The main body of the popup and options page, as well as key interactive elements like inputs and buttons, must have rounded corners (e.g., `rounded-lg`).
3.  **Theme Matching (Dark/Light Mode)**: The extension's theme MUST adapt to the browser's/system's theme. Use Tailwind's `dark:` variant for styling. Implement this by using CSS variables for colors (e.g., `bg-background`, `text-foreground`) consistent with `shadcn/ui` theming.
4.  **Accessibility**: Ensure all interactive elements are accessible. For icon-only buttons, provide an `aria-label`.

## Implementation Plan

### Task 1: Style `popup.tsx`

- **Main Container**:
    - Apply a background color that respects light/dark themes (`bg-background text-foreground`).
    - Set a fixed width (e.g., `w-96`) and padding (`p-4`).
    - Add rounded corners (`rounded-lg`).
- **Header**:
    - Use flexbox (`flex justify-between items-center`) to layout the title and action buttons.
- **Search Input**:
    - Use the `Input` component from `shadcn/ui`.
    - Ensure it has rounded corners and theme-aware styling.
- **Prompt List Area**:
    - This area should be a scrollable list. Use placeholders for now if the data hook isn't implemented.
    - Each item in the list should be a `Card` from `shadcn/ui` with rounded corners and a subtle hover effect.
- **Action Buttons (Refresh/Settings)**:
    - Use the `Button` component from `shadcn/ui` with the `ghost` or `outline` variant for a modern look.

### Task 2: Style `options.tsx`

- **Main Container**:
    - Apply the same theme-aware background, padding, and rounded corner styles as the popup.
    - Center the content on the page.
- **Form Elements**:
    - Use `Input` and `Button` components from `shadcn/ui` for the repository URL input and save button.
    - Use a `Label` for the input field for accessibility.

## Core Rule
You must adhere strictly to all project instructions. This includes diligently updating the `todo.md` file as tasks are completed and logging all your actions in the `task-log.md` file. For this task, update `todo.md` to show the UI implementation is complete and add corresponding entries to `task-log.md`.
