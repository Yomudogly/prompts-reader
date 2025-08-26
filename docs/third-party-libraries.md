# Third-Party Libraries & Services

This document lists the key third-party npm packages and external services the project depends on.

## 1. NPM Packages

These are the primary libraries that will be installed via a package manager.

* **`plasmo`**: The core framework for building, running, and packaging the browser extension.
* **`react` & `react-dom`**: The UI library used to build the extension's user interface components.
* **`tailwindcss`**: A utility-first CSS framework for all styling.
* **`shadcn/ui`**: A collection of pre-built, accessible UI components (Input, Button, etc.) that are styled with Tailwind CSS.

## 2. Service Dependencies

These are the external APIs the extension will communicate with.

* **GitHub REST API**: The external service used to fetch the contents of the user's public prompt repository.
