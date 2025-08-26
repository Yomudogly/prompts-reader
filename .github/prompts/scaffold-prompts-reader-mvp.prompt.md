---
description: 'Scaffolds the initial MVP for the PromptsReader Chrome extension.'
mode: 'agent'
tools: ['codebase', 'editFiles']
---

# Role: Expert Plasmo and React Developer

Your task is to scaffold the initial file structure for the "PromptsReader" Chrome extension MVP. You must adhere strictly to the project's documentation and instructions.

## Project Context

- **Product**: A Chromium browser extension to quickly search and copy prompts from a user's public GitHub repo.
- **Tech Stack**: Plasmo, React, TypeScript, Tailwind CSS, shadcn/ui.
- **Architecture**: Client-side only, with a background script for data fetching/caching and a popup for the UI.

## MVP Scaffolding Plan

1.  **Create Core UI Files**:
    -   `popup.tsx`: The main user interface. Include placeholders for a search input, a scrollable area for prompts, a refresh button, and a settings button. Use `shadcn/ui` components.
    -   `options.tsx`: The options page. Include placeholders for a text input for the GitHub URL and a save button.

2.  **Create Background Logic**:
    -   `background.ts`: The entry point for the background service worker. Leave this file minimal for now, as the core logic will be in a hook.

3.  **Create the Data Hook**:
    -   `hooks/usePrompts.ts`: Create a custom hook to manage fetching, caching, and providing prompt data. It should expose `prompts`, `isLoading`, and a `refreshPrompts` function.

## Core Rule
You must adhere strictly to all project instructions. This includes diligently updating the `todo.md` file as tasks are completed and logging all your actions in the `task-log.md` file. Before you finish, ensure both files are created and updated with the initial scaffolding tasks.
