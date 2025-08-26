# User Flow Documentation

This document outlines the key user journeys for the extension, from initial setup to core daily use.

## 1. First-Time Setup & Onboarding

This flow describes a new user's first interaction with the extension.

```mermaid
graph TD
    A[Install Extension] --> B{Click Extension Icon};
    B --> C[Popup Shows Welcome Message];
    C --> D[Click 'Go to Settings'];
    D --> E[Options Page Opens];
    E --> F[User Enters GitHub URL & Clicks Save];
    F --> G{URL Saved & Prompts Fetched};
    G --> H[Success Message Shown];
    H --> I[User Can Now Use The Extension];
```

## 2. Core User Journey

This flow describes the primary, day-to-day workflow for a configured user.

```mermaid
graph TD
    subgraph In Browser
        A[Need a Prompt] --> B{Press Shortcut or Click Icon};
    end
    subgraph Extension Popup
        B --> C[Popup Opens with Prompt List];
        C --> D[User Types in Search Bar];
        D --> E{List Filters in Real-time};
        E --> F[Finds Prompt];
        F -- Click Copy --> G[Prompt Copied to Clipboard];
        F -- Click Title --> H[Opens GitHub in New Tab];
    end
    G --> I[Paste Prompt in App];
```

## 3. Error Flow

This flow describes what happens when data fetching fails.

```mermaid
graph TD
    A{User Opens Popup} --> B{Data Fetch Fails};
    B --> C[Error Message Displayed];
    C --> D["e.g., 'Could not fetch prompts'"];
    D --> E[Link to Settings Page];
```
