import { useState, useEffect } from 'react'

export interface Prompt {
  id: string
  filename: string
  content: string
  tags: string[]
  html_url: string
}

interface PromptCache {
  timestamp: number
  prompts: Prompt[]
}

interface UsePromptsReturn {
  prompts: Prompt[]
  isLoading: boolean
  error: string | null
  refreshPrompts: () => Promise<void>
}

// Cache expiration time: 24 hours in milliseconds
const CACHE_EXPIRATION_TIME = 24 * 60 * 60 * 1000

export function usePrompts(): UsePromptsReturn {
  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load prompts from cache or fetch from API
  const loadPrompts = async (forceRefresh = false) => {
    setIsLoading(true)
    setError(null)

    try {
      // Get the repository URL from settings
      const settingsResult = await chrome.storage.sync.get(['settings'])
      const repoUrl = settingsResult.settings?.repoUrl

      if (!repoUrl) {
        setPrompts([])
        setError('No repository configured. Please set up your GitHub repository in settings.')
        return
      }

      // Check cache first (unless forcing refresh)
      if (!forceRefresh) {
        const cacheResult = await chrome.storage.local.get(['promptCache'])
        const cache: PromptCache | undefined = cacheResult.promptCache

        if (cache && cache.timestamp && cache.prompts) {
          const cacheAge = Date.now() - cache.timestamp
          if (cacheAge < CACHE_EXPIRATION_TIME) {
            setPrompts(cache.prompts)
            return
          }
        }
      }

      // Fetch fresh data from GitHub API
      const fetchedPrompts = await fetchPromptsFromGitHub(repoUrl)
      
      // Cache the results
      const cache: PromptCache = {
        timestamp: Date.now(),
        prompts: fetchedPrompts
      }
      await chrome.storage.local.set({ promptCache: cache })

      setPrompts(fetchedPrompts)
    } catch (err) {
      console.error('Error loading prompts:', err)
      setError(err instanceof Error ? err.message : 'Failed to load prompts')
      setPrompts([])
    } finally {
      setIsLoading(false)
    }
  }

  // Manual refresh function
  const refreshPrompts = async () => {
    await loadPrompts(true)
  }

  // Load prompts on component mount
  useEffect(() => {
    loadPrompts()
  }, [])

  return {
    prompts,
    isLoading,
    error,
    refreshPrompts
  }
}

// Helper function to fetch prompts from GitHub API
async function fetchPromptsFromGitHub(repoUrl: string): Promise<Prompt[]> {
  try {
    // Extract owner and repo from URL
    const url = new URL(repoUrl)
    const pathParts = url.pathname.split('/').filter(Boolean)
    
    if (pathParts.length < 2) {
      throw new Error('Invalid repository URL format')
    }

    const owner = pathParts[0]
    const repo = pathParts[1]

    // Recursively fetch all files from the repository
    const prompts = await fetchRepositoryContents(owner, repo, '')
    
    return prompts
  } catch (error) {
    if (error instanceof Error) {
      // Handle specific API errors
      if (error.message.includes('404')) {
        throw new Error('Repository not found. Please check the URL in settings.')
      } else if (error.message.includes('403')) {
        throw new Error('Could not access repository. It may be private or the API limit was reached.')
      } else if (error.message.includes('NetworkError') || error.message.includes('Failed to fetch')) {
        throw new Error('Network error. Please check your internet connection.')
      }
    }
    throw error
  }
}

// Recursively fetch repository contents
async function fetchRepositoryContents(
  owner: string,
  repo: string,
  path: string,
  currentTags: string[] = []
): Promise<Prompt[]> {
  const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`
  
  const response = await fetch(apiUrl)
  
  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status}`)
  }

  const contents = await response.json()
  const prompts: Prompt[] = []

  for (const item of contents) {
    if (item.type === 'file') {
      // Check if the file is a supported prompt file
      const filename = item.name.toLowerCase()
      if (filename.endsWith('.md') || filename.endsWith('.txt') || filename.endsWith('.xml')) {
        try {
          // Fetch the file content
          const fileResponse = await fetch(item.download_url)
          if (fileResponse.ok) {
            const content = await fileResponse.text()
            
            prompts.push({
              id: item.sha,
              filename: item.name,
              content: content,
              tags: [...currentTags], // Use folder names as tags
              html_url: item.html_url
            })
          }
        } catch (fileError) {
          console.warn(`Failed to fetch file ${item.name}:`, fileError)
          // Continue with other files even if one fails
        }
      }
    } else if (item.type === 'dir') {
      // Recursively fetch directory contents, adding directory name as a tag
      const newTags = [...currentTags, item.name]
      const subPrompts = await fetchRepositoryContents(owner, repo, item.path, newTags)
      prompts.push(...subPrompts)
    }
  }

  return prompts
}
