import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircle, AlertCircle } from 'lucide-react'

import "@/style.css"

function Options() {
  const [repoUrl, setRepoUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    // Load saved repository URL on component mount
    loadSavedRepoUrl()
  }, [])

  const loadSavedRepoUrl = async () => {
    try {
      const result = await chrome.storage.sync.get(['settings'])
      if (result.settings?.repoUrl) {
        setRepoUrl(result.settings.repoUrl)
      }
    } catch (error) {
      console.error('Failed to load saved repository URL:', error)
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
      // Save the repository URL to chrome.storage.sync
      await chrome.storage.sync.set({
        settings: { repoUrl: repoUrl.trim() }
      })

      // Clear the cache to trigger a fresh fetch
      await chrome.storage.local.remove(['promptCache'])

      setMessage({
        type: 'success',
        text: 'Repository URL saved successfully! The extension will fetch prompts from this repository.'
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

        <Card className="rounded-xl border shadow-sm">
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

            {message && (
              <Alert className={`rounded-lg border-2 ${message.type === 'error' ? 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/30' : 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/30'}`}>
                {message.type === 'success' ? (
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
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

        <div className="mt-8 p-6 bg-accent/20 rounded-xl border">
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
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Options
