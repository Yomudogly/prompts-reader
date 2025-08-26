# API Communication Documentation

## 1. Primary API

* **Service**: **GitHub REST API**.
* **Authentication**: All requests will be **unauthenticated**, targeting public repositories only.

## 2. Key Endpoints

The primary endpoint used will be the "Get repository content" endpoint: `GET /repos/{owner}/{repo}/contents/{path}`. The extension will use this recursively to traverse the repository, identify valid prompt files, and fetch their content.

## 3. Error Handling

The extension will implement robust error handling for API requests. It will gracefully handle common issues by displaying a clear message in the UI.

* **Invalid URL / Not Found (404)**: "Repository not found. Please check the URL in settings."
* **Private Repository / Rate Limit (403)**: "Could not access repository. It may be private or the API limit was reached. Please try again later."
* **Network Failure**: "Network error. Please check your internet connection."

## 4. Real-time Communication

* **WebSockets**: Not required for this application. All data is fetched via standard HTTPS requests.
