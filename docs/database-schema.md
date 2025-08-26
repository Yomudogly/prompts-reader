# Database Schema (chrome.storage)

## 1. `chrome.storage.sync`

This storage is used for user settings that should sync across devices.

* **Key**: `settings`
* **Value**: An object with the following structure:

    ```json
    {
      "repoUrl": "[https://github.com/user/my-prompts-repo](https://github.com/user/my-prompts-repo)"
    }
    ```

## 2. `chrome.storage.local`

This storage is used for caching data specific to this browser instance.

* **Key**: `promptCache`
* **Value**: An object containing the fetched prompts and a timestamp for cache invalidation:

    ```json
    {
      "timestamp": 1672531200000,
      "prompts": [
        {
          "id": "file_sha_from_github_api",
          "filename": "summarize.md",
          "content": "Summarize the following text...",
          "tags": ["Gemini"],
          "html_url": "[https://github.com/user/repo/blob/main/Gemini/summarize.md](https://github.com/user/repo/blob/main/Gemini/summarize.md)"
        }
      ]
    }
    ```
