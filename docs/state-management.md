# State Management Documentation

## 1. Local (Component) State

* **Method**: Standard React `useState` hook.
* **Use Case**: To manage transient UI state within individual components, such as the current value of the search input field.

## 2. Global & Server State

* **Method**: A custom React hook (e.g., `usePrompts`) will be created. No external libraries like Redux or Zustand will be used, to keep the extension lightweight.
* **Responsibilities**: This hook will be the single source of truth for the prompt data. It will:
  * Load the prompt list from the cache (`chrome.storage.local`).
  * Provide the data to the React UI components.
  * Expose a function to trigger a manual data refresh.

## 3. State Persistence

* **Repository URL**: The user's GitHub repo URL setting will be persisted in **`chrome.storage.sync`**.
* **Prompt Data Cache**: The fetched prompt data will be persisted in **`chrome.storage.local`**.
* **UI State**: The search query will **not** be persisted. It will reset to an empty string every time the user opens the popup.
