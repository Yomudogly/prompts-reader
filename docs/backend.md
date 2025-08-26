# Backend Documentation

## 1. Architecture

* **Type**: Client-side only (Chrome Extension). There is no server-side component.
* **Core Logic**: The extension's background script is responsible for all data fetching, caching, and storage operations.

## 2. API Integration

* **Primary Service**: The extension will act as a client to the official **GitHub REST API** to fetch repository contents.
* **API Design**: The internal data flow is as follows:
  1. The background script fetches data from the GitHub API.
  2. The data is processed and structured (extracting tags from folder paths).
  3. The processed data is saved to the local cache.
  4. The popup UI reads directly from this cache for instant loading.

## 3. Authentication

* **Method**: **Unauthenticated access**. For the MVP, the extension will read from public repositories without requiring a user login or Personal Access Token (PAT). This simplifies the user experience.

## 4. Data Storage

* **Settings Storage**: The user's GitHub repository URL will be stored using **`chrome.storage.sync`**. This enables the setting to be automatically synchronized across a user's logged-in browsers.
* **Data Cache**: The fetched prompt data (filenames, content, tags) will be cached using **`chrome.storage.local`**, which provides a larger storage capacity suitable for this purpose.

## 5. Caching & Refresh Strategy

* **Manual Refresh**: A "Refresh" button in the popup UI will allow the user to manually clear the cache and trigger a new fetch from the GitHub API.
* **Automatic Refresh**: The local cache will have a Time-to-Live (TTL) of **24 hours**. The extension will automatically re-fetch the data if the cached version is older than this limit.
