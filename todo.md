# PromptsReader MVP Todo List

## Project Setup

- [x] Review project documentation and scaffolding requirements
- [x] Create core UI files (popup.tsx, options.tsx)
- [x] Create background script (background.ts)
- [x] Create data hook (hooks/usePrompts.ts)
- [x] Set up Plasmo project configuration
- [x] Add shadcn/ui components and Tailwind CSS setup
- [x] Fix dependency version conflicts and build errors

## Frontend Development

- [x] Implement basic popup UI structure with shadcn/ui components
- [x] Implement options page UI for GitHub URL configuration
- [x] Add search functionality to filter prompts
- [x] Add copy-to-clipboard functionality
- [x] Add settings navigation from popup to options page

## Backend Development

- [x] Create usePrompts hook to fetch and cache data from GitHub
- [x] Implement GitHub API integration for repository content fetching
- [x] Implement caching strategy with 24-hour expiration
- [x] Add error handling for API failures
- [x] Add manual refresh capability

## Integration & Testing

- [x] Connect UI components to data hook
- [x] Test popup functionality
- [x] Test options page configuration
- [x] Test data fetching and caching
- [x] Test error scenarios

## DevOps & CI/CD

- [x] Create GitHub Actions workflow for automated testing
- [x] Set up build and packaging automation
- [x] Implement security scanning
- [x] Add code quality validation
- [x] Configure release automation

## Project Management

- [x] Maintain task log with all development actions
- [x] Update todo items as they are completed
- [x] Create comprehensive README.md documentation
- [x] Fix Chrome extension permissions and service worker issues

## UI Enhancement Phase

- [x] Implement manual theme toggle in options.tsx with System/Light/Dark states
- [x] Add theme persistence with chrome.storage.sync and apply theme classes based on user preference  
- [x] Implement tag-based filtering with Badge components in popup.tsx - extract unique tags from prompts, add clickable filter UI
- [x] Display prompt count in header showing "X of Y prompts" to indicate filtering effectiveness
- [x] Add copy button feedback with visual state changes (check icon) and timeout reset after 2 seconds
- [x] Polish UI consistency - ensure consistent styling, spacing, and hover states across all components

## API Enhancement Phase

- [x] Add optional GitHub API key input field in options.tsx for improved rate limits
- [x] Implement API key validation to test if the provided key is valid
- [x] Update background.ts to use API key for GitHub requests when available
- [x] Enhance rate limits from 60 requests/hour (anonymous) to 5,000 requests/hour (authenticated)
- [x] Add comprehensive help documentation for API key setup and benefits
