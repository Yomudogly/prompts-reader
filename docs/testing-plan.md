# Testing Plan Documentation

## 1. Overall Strategy for MVP

* **Primary Method**: The project will rely exclusively on **manual, exploratory testing** to meet the one-week MVP timeline.
* **Goal**: To verify that all core features outlined in the Product Requirements Document (PRD) are functioning correctly and the user experience is smooth.
* **Automated Testing**: The implementation of automated tests (Unit, Integration, E2E) is deferred to post-MVP versions.

## 2. Manual Testing Checklist

The following areas must be thoroughly tested:

### 2.1. Installation & Setup

* [ ] Verify the extension can be loaded and installed from the packaged `.zip` file.
* [ ] **Options Page**:
  * [ ] Confirm a valid GitHub URL can be saved successfully.
  * [ ] Confirm an invalid or non-existent URL shows an appropriate error message.
  * [ ] Confirm the saved URL persists after closing and reopening the browser.

### 2.2. Core Functionality (Popup)

* [ ] Confirm the popup opens via the extension icon.
* [ ] Confirm the popup opens via the configured keyboard shortcut.
* [ ] **Data Display**:
  * [ ] Prompts from the repo are displayed correctly.
  * [ ] Tags are correctly generated from the repository's folder structure.
* [ ] **User Actions**:
  * [ ] Search correctly filters the prompt list by filename.
  * [ ] The "Copy" button copies the full prompt content to the clipboard.
  * [ ] Clicking a prompt's title opens the correct file on GitHub in a new tab.
  * [ ] The "Refresh" button clears the cache and fetches the latest data from the repository.

### 2.3. Error Handling

* [ ] Test with an invalid repository URL.
* [ ] Test with a private repository URL.
* [ ] Test with the network connection disabled.
* [ ] Verify that clear, user-friendly error messages are displayed in all error cases.
