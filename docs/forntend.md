# Frontend Documentation

## 1. Core Technologies

* **Framework**: **Plasmo** with **React**.
* **Styling**: **Tailwind CSS**.
* **Component Library**: **shadcn/ui**.

## 2. Views & Navigation

* **Popup View**: The main interface, accessed via the extension icon or keyboard shortcut.
* **Options Page**: A separate page for user configuration.
* **Navigation**: A settings icon (⚙️) in the popup will open the options page in a new tab.

## 3. Component Breakdown

### 3.1. Popup View

* **Layout**: Header, search bar, prompt list, and footer.
* **Search Bar**: An `<Input>` component from `shadcn/ui`.
* **Prompt List**: A `<ScrollArea>` from `shadcn/ui`.
  * **List Item**: Each item will display:
    * The prompt's filename, which acts as a **clickable link**. Clicking it will open the source file on GitHub in a new tab.
    * **Tags** derived from the file's folder path.
    * A "Copy" `<Button>` from `shadcn/ui`.
* **Settings Button**: An icon button to open the options page.

### 3.2. Options Page

* **Layout**: A centered form.
* **Configuration Form**: An `<Input>` for the GitHub repo URL and a "Save" `<Button>`, with basic GitHub repository URL validation.
