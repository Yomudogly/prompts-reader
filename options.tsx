import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircle, AlertCircle, Sun, Moon, Monitor } from 'lucide-react'

import "@/style.css"

function Options() {
  const [repoUrl, setRepoUrl] = useState('')
  const [apiKey, setApiKey] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isTestingKey, setIsTestingKey] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [keyMessage, setKeyMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [theme, setTheme] = useState<'system' | 'light' | 'dark'>('system')

  useEffect(() => {
    // Load saved repository URL and theme on component mount
    loadSavedSettings()
  }, [])

  const loadSavedSettings = async () => {
    try {
      const result = await chrome.storage.sync.get(['settings', 'theme', 'apiKey'])
      if (result.settings?.repoUrl) {
        setRepoUrl(result.settings.repoUrl)
      }
      if (result.apiKey) {
        setApiKey(result.apiKey)
      }
      if (result.theme) {
        setTheme(result.theme)
        applyTheme(result.theme)
      } else {
        // Default to system theme
        applyTheme('system')
      }
    } catch (error) {
      console.error('Failed to load saved settings:', error)
    }
  }

  const applyTheme = (newTheme: 'system' | 'light' | 'dark') => {
    const html = document.documentElement
    html.classList.remove('light', 'dark')
    
    if (newTheme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      html.classList.add(prefersDark ? 'dark' : 'light')
    } else {
      html.classList.add(newTheme)
    }
  }

  const handleThemeChange = async (newTheme: 'system' | 'light' | 'dark') => {
    setTheme(newTheme)
    applyTheme(newTheme)
    
    try {
      await chrome.storage.sync.set({ theme: newTheme })
    } catch (error) {
      console.error('Failed to save theme preference:', error)
    }
  }

  const isValidGitHubUrl = (url: string): boolean => {
    try {
      const urlObj = new URL(url)
      return (
        urlObj.hostname === 'github.com' &&
        urlObj.pathname.split('/').filter(Boolean).length >= 2
      )
    } catch {
      return false
    }
  }

  const handleSave = async () => {
    if (!repoUrl.trim()) {
      setMessage({ type: 'error', text: 'Please enter a repository URL.' })
      return
    }

    if (!isValidGitHubUrl(repoUrl)) {
      setMessage({
        type: 'error',
        text: 'Please enter a valid GitHub repository URL (e.g., https://github.com/username/repo)'
      })
      return
    }

    setIsLoading(true)
    setMessage(null)

    try {
      // Save the repository URL and API key to chrome.storage.sync
      await chrome.storage.sync.set({
        settings: { repoUrl: repoUrl.trim() },
        apiKey: apiKey.trim() || undefined // Store undefined if empty to remove the key
      })

      // Clear the cache to trigger a fresh fetch
      await chrome.storage.local.remove(['promptCache'])

      setMessage({
        type: 'success',
        text: 'Settings saved successfully! The extension will fetch prompts from this repository.'
      })
    } catch (error) {
      console.error('Failed to save repository URL:', error)
      setMessage({
        type: 'error',
        text: 'Failed to save repository URL. Please try again.'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleTestApiKey = async () => {
    if (!apiKey.trim()) {
      setKeyMessage({ type: 'error', text: 'Please enter an API key first.' })
      return
    }

    setIsTestingKey(true)
    setKeyMessage(null)

    try {
      // Test the GitHub API key by making a request to the user endpoint
      const response = await fetch('https://api.github.com/user', {
        headers: {
          'Authorization': `Bearer ${apiKey.trim()}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      })
      
      if (response.ok) {
        const userData = await response.json()
        setKeyMessage({
          type: 'success',
          text: `API key is valid! Authenticated as: ${userData.login}`
        })
      } else if (response.status === 401) {
        setKeyMessage({
          type: 'error',
          text: 'Invalid API key. Please check your GitHub personal access token.'
        })
      } else if (response.status === 403) {
        setKeyMessage({
          type: 'error',
          text: 'API key does not have sufficient permissions or rate limit exceeded.'
        })
      } else {
        setKeyMessage({
          type: 'error',
          text: 'Failed to validate API key. Please try again later.'
        })
      }
    } catch (error) {
      console.error('API key validation failed:', error)
      setKeyMessage({
        type: 'error',
        text: 'Network error. Please check your internet connection.'
      })
    } finally {
      setIsTestingKey(false)
    }
  }

  const handleTestConnection = async () => {
    if (!repoUrl.trim()) {
      setMessage({ type: 'error', text: 'Please enter a repository URL first.' })
      return
    }

    if (!isValidGitHubUrl(repoUrl)) {
      setMessage({
        type: 'error',
        text: 'Please enter a valid GitHub repository URL.'
      })
      return
    }

    setIsLoading(true)
    setMessage(null)

    try {
      // Extract owner and repo from URL
      const url = new URL(repoUrl.trim())
      const pathParts = url.pathname.split('/').filter(Boolean)
      const owner = pathParts[0]
      const repo = pathParts[1]

      // Test the GitHub API connection
      const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`)
      
      if (response.ok) {
        const repoData = await response.json()
        setMessage({
          type: 'success',
          text: `Connection successful! Found repository: ${repoData.full_name}`
        })
      } else if (response.status === 404) {
        setMessage({
          type: 'error',
          text: 'Repository not found. Please check the URL and ensure the repository is public.'
        })
      } else if (response.status === 403) {
        setMessage({
          type: 'error',
          text: 'Access denied. The repository may be private or rate limits exceeded.'
        })
      } else {
        setMessage({
          type: 'error',
          text: 'Failed to connect to repository. Please try again later.'
        })
      }
    } catch (error) {
      console.error('Connection test failed:', error)
      setMessage({
        type: 'error',
        text: 'Network error. Please check your internet connection.'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">PromptsReader Settings</h1>
          <p className="text-muted-foreground">
            Configure your GitHub repository to access your prompt library.
          </p>
        </div>

        <Card className="rounded-xl border shadow-sm mb-8">
          <CardHeader className="pb-6">
            <CardTitle className="text-xl">GitHub Repository Configuration</CardTitle>
            <CardDescription className="text-base">
              Enter the URL of your public GitHub repository containing your prompts.
              The extension will fetch .md, .xml, and .txt files from this repository.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="repo-url" className="text-sm font-medium">Repository URL</Label>
              <Input
                id="repo-url"
                type="url"
                placeholder="https://github.com/username/my-prompts-repo"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                className="rounded-lg h-11 text-base"
              />
              <p className="text-sm text-muted-foreground">
                Example: https://github.com/username/my-prompts-repo
              </p>
            </div>

            <div className="space-y-3">
              <Label htmlFor="api-key" className="text-sm font-medium">
                GitHub API Key <span className="text-muted-foreground font-normal">(Optional)</span>
              </Label>
              <Input
                id="api-key"
                type="password"
                placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="rounded-lg h-11 text-base font-mono"
              />
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Personal access token for higher rate limits (5,000 requests/hour vs 60 requests/hour)
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleTestApiKey}
                    disabled={isTestingKey || !apiKey.trim()}
                    className="rounded-lg h-9 px-4 text-xs"
                  >
                    {isTestingKey ? 'Testing...' : 'Test API Key'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open('https://github.com/settings/tokens', '_blank')}
                    className="rounded-lg h-9 px-4 text-xs"
                  >
                    Generate Token
                  </Button>
                </div>
              </div>
              
              {keyMessage && (
                <Alert className={`rounded-lg border-2 ${keyMessage.type === 'error' ? 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/30' : 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/30'}`}>
                  {keyMessage.type === 'success' ? (
                    <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                  )}
                  <AlertDescription className={`text-sm font-medium ${keyMessage.type === 'error' ? 'text-red-800 dark:text-red-200' : 'text-green-800 dark:text-green-200'}`}>
                    {keyMessage.text}
                  </AlertDescription>
                </Alert>
              )}
            </div>

            {message && (
              <Alert className={`rounded-lg border-2 ${message.type === 'error' ? 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/30' : 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/30'}`}>
                {message.type === 'success' ? (
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                )}
                <AlertDescription className={`text-sm font-medium ${message.type === 'error' ? 'text-red-800 dark:text-red-200' : 'text-green-800 dark:text-green-200'}`}>
                  {message.text}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter className="flex gap-3 pt-6">
            <Button
              onClick={handleSave}
              disabled={isLoading}
              className="rounded-lg h-11 px-6 font-medium"
            >
              {isLoading ? 'Saving...' : 'Save Configuration'}
            </Button>
            <Button
              variant="outline"
              onClick={handleTestConnection}
              disabled={isLoading}
              className="rounded-lg h-11 px-6 font-medium"
            >
              {isLoading ? 'Testing...' : 'Test Connection'}
            </Button>
          </CardFooter>
        </Card>

        {/* Theme Settings Card */}
        <Card className="rounded-xl border shadow-sm mb-8">
          <CardHeader>
            <CardTitle className="text-xl">Theme Preferences</CardTitle>
            <CardDescription>
              Choose your preferred color scheme for the extension.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Label className="text-sm font-medium">Color Scheme</Label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'system', label: 'System', icon: Monitor },
                  { value: 'light', label: 'Light', icon: Sun },
                  { value: 'dark', label: 'Dark', icon: Moon }
                ].map(({ value, label, icon: Icon }) => (
                  <Button
                    key={value}
                    variant={theme === value ? 'default' : 'outline'}
                    className="h-16 flex flex-col gap-2 rounded-lg"
                    onClick={() => handleThemeChange(value as 'system' | 'light' | 'dark')}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="text-sm">{label}</span>
                  </Button>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                System theme will follow your operating system's appearance settings.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="p-6 bg-accent/20 rounded-xl border">
          <h3 className="font-semibold mb-3 text-foreground">How it works:</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></div>
              <span>The extension fetches prompt files (.md, .xml, .txt) from your public GitHub repository</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></div>
              <span>Folder names in your repository become tags for better organization</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></div>
              <span>Data is cached locally for 24 hours to improve performance</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></div>
              <span>You can manually refresh the cache using the refresh button in the popup</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></div>
              <span><strong>API Key Benefits:</strong> Without a key, you're limited to 60 requests/hour. With a personal access token, you get 5,000 requests/hour and better performance for large repositories</span>
            </li>
          </ul>
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
            <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Creating a GitHub Personal Access Token:</h4>
            <ol className="space-y-1 text-sm text-blue-800 dark:text-blue-200">
              <li>1. Go to GitHub Settings → Developer settings → Personal access tokens</li>
              <li>2. Click "Generate new token (classic)"</li>
              <li>3. Select "public_repo" scope (read access to public repositories)</li>
              <li>4. Copy and paste the token into the API key field above</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Options
