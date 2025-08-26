---
description: 'Enhances the PromptsReader UI with a manual theme toggle, tag-based filtering, prompt count display, and copy-to-clipboard feedback.'
mode: 'agent'
tools: ['codebase', 'editFiles']
---

# Role: Senior Frontend Developer

Your task is to implement several UI enhancements for the "PromptsReader" Chrome extension. You will be modifying `popup.tsx` and `options.tsx` to add new features and improve user feedback, ensuring a modern and intuitive experience.

## Part 1: Enhance Theme Support

The application should respect the system theme by default but also allow the user to manually override it.

1.  **In `options.tsx`**:
    -   Add a theme toggle component (e.g., a `Button` from `shadcn/ui` with sun/moon icons).
    -   Allow the user to cycle through three states: 'System', 'Light', and 'Dark'.
    -   Save the selected theme preference to `chrome.storage.sync`.

2.  **In the main layout/provider**:
    -   Read the theme preference from `chrome.storage.sync`.
    -   If the preference is 'Light' or 'Dark', apply the corresponding theme class to the root element.
    -   If the preference is 'System' (or not set), continue using the media query (`prefers-color-scheme`) to detect the system theme.

## Part 2: Implement Tag Filtering in `popup.tsx`

1.  **Display Tags**:
    -   Below the search input, create a new area to display all unique tags from the fetched prompts.
    -   Render each tag using the `Badge` component from `shadcn/ui` to make them look modern and clickable.

2.  **Filtering Logic**:
    -   Create a new state using `useState` to keep track of the `selectedTag`.
    -   When a user clicks a `Badge`, set it as the `selectedTag`. Clicking the active tag again should clear the filter (set `selectedTag` to `null`).
    -   Update the prompt list rendering logic to filter prompts based on the `selectedTag` in addition to the existing search term.

## Part 3: Add UI Feedback in `popup.tsx`

1.  **Display Prompt Count**:
    -   In the header, next to the "Refresh" button, display the total count of fetched prompts (e.g., "Refresh (152)").
    -   This count should be derived from the length of the prompts array provided by the `usePrompts` hook.

2.  **Copy Button Feedback**:
    -   When a user clicks the "Copy" button for a prompt, provide immediate visual feedback.
    -   The button's icon should change to a green checkmark icon for approximately 2 seconds before reverting to the original copy icon.
    -   You will need to manage this temporary state change within the prompt list item component.

## Part 4: Final Polish

-   Ensure all new UI elements, especially the `Badge` components for tags, have consistent rounded corners (`rounded-lg`) and theme-aware styling.

## Core Rule
You must adhere strictly to all project instructions. This includes diligently updating the `todo.md` file with new tasks for these features and logging all your actions in the `task-log.md` file.
