---
description: 'Finalizes the PromptsReader backend logic in background.ts and sets up GitHub Actions for CI/CD.'
mode: 'agent'
tools: ['codebase', 'editFiles', 'new']
---

# Role: Senior Full-Stack Developer

Your final task is to implement the backend data logic and set up the Continuous Integration (CI) workflow for the "PromptsReader" extension. You must follow the project's documentation precisely.

## Part 1: Implement Backend & Caching Logic

Your primary goal is to implement the data fetching and caching mechanism that powers the extension. This logic should be placed within the `background.ts` script and consumed by the `hooks/usePrompts.ts` hook.

1.  **Data Fetching**:
    - Implement the function to recursively fetch `.md`, `.xml`, and `.txt` files from the user-configured public GitHub repository URL using the GitHub REST API (`GET /repos/{owner}/{repo}/contents/{path}`).
    - Extract tags from the repository's folder structure.

2.  **Caching Strategy**:
    - Use `chrome.storage.local` to cache the fetched prompt data.
    - The cache MUST include a `timestamp`. Before fetching, check if the cached data is less than 24 hours old. If it is, use the cached data.
    - Implement a manual refresh capability that bypasses the timestamp check.

3.  **Error Handling**:
    - Your logic must gracefully handle API errors:
        - **404 Not Found**: "Repository not found. Please check the URL in settings."
        - **403 Forbidden/Rate Limited**: "Could not access repository. It may be private or the API limit was reached."
        - **Network Failure**: "Network error. Please check your internet connection."

4.  **Hook Integration**:
    - Ensure the `hooks/usePrompts.ts` hook correctly retrieves data from the cache and exposes it to the React UI, along with loading and error states.

## Part 2: Create GitHub Actions CI Workflow

Based on the `devops.md` documentation, create a GitHub Actions workflow to build and package the extension.

1.  **Create Workflow File**: Create a new file at `.github/workflows/ci.yml`.
2.  **Define Trigger**: The workflow must run on every push to the `main` branch.
3.  **Define Jobs**: Configure the workflow with the following jobs and steps:
    - **Job: `build-extension`**:
        - **Step 1: Checkout Code**: Use `actions/checkout`.
        - **Step 2: Setup Node.js**: Use `actions/setup-node`.
        - **Step 3: Install Dependencies**: Run `npm install` (or the equivalent for your package manager).
        - **Step 4: Build Extension**: Run the Plasmo build command to create a production-ready zip package (`plasmo build --zip`).
        - **Step 5: Archive Artifact**: Use `actions/upload-artifact` to save the generated `.zip` file as a build artifact.

## Core Rule
You must adhere strictly to all project instructions. This includes diligently updating the `todo.md` file to mark the backend and CI/CD tasks as complete and logging these final actions in the `task-log.md` file.