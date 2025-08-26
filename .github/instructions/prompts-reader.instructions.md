---
description: 'Coding standards and architectural guidelines for the PromptsReader Chrome Extension.'
applyTo: '**/*.ts, **/*.tsx, **/*.js, **/*.jsx, **/*.css'
---

# PromptsReader Development Instructions

You are building a Chromium browser extension using the Plasmo framework with React and Tailwind CSS. The primary goal is to provide users with quick access to their personal prompt library from a public GitHub repository.

## 1. Core Technologies & Architecture

- **Framework**: Plasmo with React.
- **Styling**: Tailwind CSS with shadcn/ui components.
- **Architecture**: Client-side only. There is no server-side component.
- **Core Logic**: A background script handles all data fetching and caching. The popup UI is for display and user interaction.

## 2. State Management

- **Global/Server State**: Use a custom React hook (`usePrompts`) as the single source of truth for prompt data. This hook will manage loading data from `chrome.storage.local` and provide a refresh function. **Do not use Redux or Zustand.**
- **Local UI State**: Use the standard React `useState` hook for component-level state (e.g., search input).
- **Persistence**:
  - The GitHub repo URL is persisted in `chrome.storage.sync`.
  - Fetched prompt data is cached in `chrome.storage.local` with a 24-hour expiration.

## 3. Component Design

- **Component Library**: You MUST use components from **`shadcn/ui`** (e.g., `Input`, `Button`, `ScrollArea`) for all standard UI elements to ensure consistency and accessibility.
- **Structure**:
  - **`popup.tsx`**: The main view, containing the search bar, prompt list, and settings/refresh buttons.
  - **`options.tsx`**: The configuration page for setting the GitHub repository URL.
- **Data Flow**: The UI should be "dumb" and receive all data and functions as props from higher-level components or the `usePrompts` hook.

## 4. API & Data Handling

- **API**: Interact with the public GitHub REST API for fetching repository content. All requests MUST be unauthenticated.
- **Error Handling**: Gracefully handle API errors (e.g., repository not found, rate limiting) by displaying clear messages in the UI.
- **Security**: Treat all fetched content as plain text. Do not use `dangerouslySetInnerHTML`. Validate the user-provided GitHub URL to ensure it points to `github.com`.

## 5. Project Management Mandates

- **TODO File**: You MUST create and maintain a `todo.md` file in the project root to track all major development tasks.
  - Example:
    - [ ] Frontend: Implement the basic popup UI structure with shadcn/ui components.
    - [ ] Backend: Create the `usePrompts` hook to fetch and cache data from GitHub.
    - [x] Project: Initial setup of the Plasmo project.
- **Task Log**: You MUST create and maintain a `task-log.md` file in the project root to log every significant action or automated step taken.
  - Example:
    ## Initialized Plasmo project.
    ## Added shadcn/ui Button component to the popup view.
