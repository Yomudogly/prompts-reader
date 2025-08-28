// Enhanced Background script for PromptsReader Chrome Extension
// Handles data fetching, caching, and service worker lifecycle

import type { Prompt } from './types/prompt'

// Types for cache management
interface PromptCache {
  data: Prompt[]
  timestamp: number
  repoUrl: string
}

// Log that the background script is loaded
console.log('PromptsReader background script loaded')

// Constants
const CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 hours in milliseconds
const SUPPORTED_EXTENSIONS = ['.md', '.txt', '.xml']
const IGNORED_FILES = [
  'README.md', 'readme.md', 'Readme.md', 'README.txt', 'readme.txt',
  'LICENSE', 'license', 'License', 'LICENSE.md', 'license.md',
  '.gitignore', '.gitattributes', 'CHANGELOG.md', 'changelog.md',
  'CONTRIBUTING.md', 'contributing.md', 'CODE_OF_CONDUCT.md'
]
const DEFAULT_REPO_URL = 'https://github.com/Yomudogly/awesome-ai-prompts'

// Install event listener
chrome.runtime.onInstalled.addListener((details) => {
  console.log('PromptsReader extension installed:', details.reason)
  
  // Set up default settings if this is a fresh install
  if (details.reason === 'install') {
    chrome.storage.sync.set({
      settings: {
        repoUrl: DEFAULT_REPO_URL
      }
    })
    console.log('Default repository URL set:', DEFAULT_REPO_URL)
  }
})

// Handle extension startup
chrome.runtime.onStartup.addListener(() => {
  console.log('PromptsReader extension started')
})

// Enhanced message listener for data operations
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Background script received message:', request)
  
  if (request.action === 'fetchPrompts') {
    handleFetchPrompts(request.repoUrl)
      .then(prompts => sendResponse({ success: true, data: prompts }))
      .catch(error => sendResponse({ success: false, error: error.message }))
    return true // Keep message channel open for async response
  }
  
  if (request.action === 'refreshPrompts') {
    handleRefreshPrompts(request.repoUrl)
      .then(prompts => sendResponse({ success: true, data: prompts }))
      .catch(error => sendResponse({ success: false, error: error.message }))
    return true // Keep message channel open for async response
  }
  
  // Handle other future message-based communication
  sendResponse({ success: true })
})

// Handle keyboard shortcut (if configured in manifest)
if (chrome.commands && chrome.commands.onCommand) {
  chrome.commands.onCommand.addListener((command) => {
    if (command === 'open-popup') {
      chrome.action.openPopup()
    }
  })
} else {
  console.log('Commands API not available - keyboard shortcuts disabled')
}

// Main function to handle prompt fetching with caching
async function handleFetchPrompts(repoUrl: string): Promise<Prompt[]> {
  try {
    // Use default repository if no URL is provided
    const targetRepoUrl = repoUrl || DEFAULT_REPO_URL
    
    // Check cache first
    const cached = await getCachedPrompts(targetRepoUrl)
    if (cached) {
      console.log('Returning cached prompts')
      return cached
    }
    
    // Get API key if available
    const result = await chrome.storage.sync.get(['apiKey'])
    const apiKey = result.apiKey
    
    // Fetch fresh data if not cached or expired
    console.log('Fetching fresh prompts from GitHub')
    const prompts = await fetchPromptsFromGitHub(targetRepoUrl, apiKey)
    
    // Cache the results
    await cachePrompts(prompts, targetRepoUrl)
    
    return prompts
  } catch (error) {
    console.error('Error fetching prompts:', error)
    throw error
  }
}

// Function to force refresh prompts (bypass cache)
async function handleRefreshPrompts(repoUrl: string): Promise<Prompt[]> {
  try {
    // Use default repository if no URL is provided
    const targetRepoUrl = repoUrl || DEFAULT_REPO_URL
    
    // Get API key if available
    const result = await chrome.storage.sync.get(['apiKey'])
    const apiKey = result.apiKey
    
    console.log('Force refreshing prompts from GitHub')
    const prompts = await fetchPromptsFromGitHub(targetRepoUrl, apiKey)
    
    // Update cache with fresh data
    await cachePrompts(prompts, targetRepoUrl)
    
    return prompts
  } catch (error) {
    console.error('Error refreshing prompts:', error)
    throw error
  }
}

// Function to fetch prompts from GitHub API
async function fetchPromptsFromGitHub(repoUrl: string, apiKey?: string): Promise<Prompt[]> {
  // Use default repository if no URL is provided
  const targetRepoUrl = repoUrl || DEFAULT_REPO_URL
  
  if (!targetRepoUrl) {
    throw new Error('Repository URL is required')
  }
  
  // Extract owner and repo from URL
  const match = targetRepoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/)
  if (!match) {
    throw new Error('Invalid GitHub repository URL')
  }
  
  const [, owner, repo] = match
  const cleanRepo = repo.replace(/\.git$/, '') // Remove .git suffix if present
  
  try {
    const prompts = await fetchRepositoryContents(owner, cleanRepo, '', apiKey)
    console.log(`Fetched ${prompts.length} prompts from ${owner}/${cleanRepo}`)
    return prompts
  } catch (error) {
    console.error('GitHub API error:', error)
    if (error instanceof Error) {
      if (error.message.includes('404')) {
        throw new Error('Repository not found. Please check the URL and ensure the repository is public.')
      } else if (error.message.includes('403')) {
        throw new Error('Access denied. Please ensure the repository is public.')
      } else if (error.message.includes('rate limit')) {
        throw new Error('GitHub API rate limit exceeded. Please try again later.')
      }
    }
    throw new Error('Failed to fetch prompts from GitHub. Please check your connection and try again.')
  }
}

// Recursive function to fetch all files from repository
async function fetchRepositoryContents(owner: string, repo: string, path: string = '', apiKey?: string): Promise<Prompt[]> {
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`
  
  // Prepare headers
  const headers: Record<string, string> = {
    'Accept': 'application/vnd.github.v3+json'
  }
  
  // Add authorization header if API key is provided
  if (apiKey) {
    headers['Authorization'] = `Bearer ${apiKey}`
  }
  
  const response = await fetch(url, { headers })
  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status} ${response.statusText}`)
  }
  
  const contents = await response.json()
  const prompts: Prompt[] = []
  
  for (const item of contents) {
    if (item.type === 'file' && 
        SUPPORTED_EXTENSIONS.some(ext => item.name.endsWith(ext)) &&
        !IGNORED_FILES.includes(item.name)) {
      // Fetch file content with API key if available
      const fileHeaders: Record<string, string> = {}
      if (apiKey) {
        fileHeaders['Authorization'] = `Bearer ${apiKey}`
      }
      
      const fileResponse = await fetch(item.download_url, { headers: fileHeaders })
      if (fileResponse.ok) {
        const content = await fileResponse.text()
        
        // Extract tags from path (folder names)
        const pathParts = item.path.split('/').slice(0, -1) // Remove filename
        const tags = pathParts.filter((part: string) => part.length > 0)
        
        prompts.push({
          id: item.sha,
          filename: item.name,
          content: content,
          html_url: item.html_url,
          tags: tags
        })
      }
    } else if (item.type === 'dir') {
      // Recursively fetch directory contents
      const dirPrompts = await fetchRepositoryContents(owner, repo, item.path, apiKey)
      prompts.push(...dirPrompts)
    }
  }
  
  return prompts
}

// Function to get cached prompts if valid
async function getCachedPrompts(repoUrl: string): Promise<Prompt[] | null> {
  try {
    const result = await chrome.storage.local.get('promptsCache')
    const cache: PromptCache | undefined = result.promptsCache
    
    if (!cache) {
      return null
    }
    
    // Check if cache is for the same repo and not expired
    const isExpired = Date.now() - cache.timestamp > CACHE_DURATION
    const isSameRepo = cache.repoUrl === repoUrl
    
    if (isSameRepo && !isExpired) {
      return cache.data
    }
    
    return null
  } catch (error) {
    console.error('Error reading cache:', error)
    return null
  }
}

// Function to cache prompts
async function cachePrompts(prompts: Prompt[], repoUrl: string): Promise<void> {
  try {
    const cache: PromptCache = {
      data: prompts,
      timestamp: Date.now(),
      repoUrl: repoUrl
    }
    
    await chrome.storage.local.set({ promptsCache: cache })
    console.log('Prompts cached successfully')
  } catch (error) {
    console.error('Error caching prompts:', error)
  }
}
