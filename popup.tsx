import React, { useState, useEffect } from 'react'
import { Search, Settings, RefreshCw, Copy, ExternalLink, AlertCircle, Filter, X, Check } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { usePrompts } from '@/hooks/usePrompts'

import "@/style.css"

interface Prompt {
  id: string
  filename: string
  content: string
  tags: string[]
  html_url: string
}

function Popup() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [copiedPromptId, setCopiedPromptId] = useState<string | null>(null)
  const { prompts, isLoading, error, refreshPrompts } = usePrompts()

  // Apply theme from storage on component mount
  useEffect(() => {
    const applyStoredTheme = async () => {
      try {
        const result = await chrome.storage.sync.get(['theme'])
        const storedTheme = result.theme || 'system'
        
        const html = document.documentElement
        html.classList.remove('light', 'dark')
        
        if (storedTheme === 'system') {
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
          html.classList.add(prefersDark ? 'dark' : 'light')
        } else {
          html.classList.add(storedTheme)
        }
      } catch (error) {
        console.error('Failed to apply theme:', error)
      }
    }
    
    applyStoredTheme()
  }, [])

  // Get unique tags from all prompts
  const allTags = [...new Set(prompts.flatMap(prompt => prompt.tags))].sort()

  // Filter prompts based on search query and selected tags
  const filteredPrompts = prompts.filter(prompt => {
    const matchesSearch = prompt.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         prompt.content.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTags = selectedTags.length === 0 || 
                       selectedTags.some(tag => prompt.tags.includes(tag))
    return matchesSearch && matchesTags
  })

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }

  const clearFilters = () => {
    setSelectedTags([])
    setSearchQuery('')
  }

  const handleCopyPrompt = async (content: string, promptId: string) => {
    try {
      await navigator.clipboard.writeText(content)
      setCopiedPromptId(promptId)
      // Clear the feedback after 2 seconds
      setTimeout(() => setCopiedPromptId(null), 2000)
    } catch (err) {
      console.error('Failed to copy prompt:', err)
    }
  }

  const handleOpenGitHub = (url: string) => {
    chrome.tabs.create({ url })
  }

  const handleOpenSettings = () => {
    chrome.runtime.openOptionsPage()
  }

  return (
    <div className="w-96 h-[500px] bg-background text-foreground rounded-lg border shadow-sm">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-border">
        <h1 className="text-lg font-semibold">PromptsReader</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {filteredPrompts.length} of {prompts.length}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={refreshPrompts}
            disabled={isLoading}
            aria-label="Refresh prompts"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleOpenSettings}
            aria-label="Open settings"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Search Bar and Filters */}
      <div className="p-4 border-b border-border space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search prompts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 rounded-lg"
          />
        </div>
        
        {/* Tags Filter */}
        {allTags.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Filter by tags:</span>
              {selectedTags.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="h-6 px-2 text-xs rounded-md hover:bg-accent"
                >
                  Clear all
                  <X className="h-3 w-3 ml-1" />
                </Button>
              )}
            </div>
            <ScrollArea className="max-h-20">
              <div className="flex flex-wrap gap-1.5">
                {allTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant={selectedTags.includes(tag) ? "default" : "outline"}
                    className="cursor-pointer text-xs rounded-full px-2 py-1 hover:bg-accent hover:text-accent-foreground transition-colors duration-200"
                    onClick={() => handleTagToggle(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="flex-1 p-4 overflow-hidden">
        {error ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <div className="text-destructive mb-4">
              <AlertCircle className="h-8 w-8 mx-auto mb-2" />
              <p className="text-sm font-medium mb-2">{error}</p>
            </div>
            <Button variant="outline" size="sm" onClick={handleOpenSettings} className="rounded-lg">
              Go to Settings
            </Button>
          </div>
        ) : isLoading ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-3" />
            <p className="text-sm">Loading prompts...</p>
          </div>
        ) : filteredPrompts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
            {prompts.length === 0 ? (
              <>
                <Search className="h-8 w-8 mx-auto mb-3 opacity-50" />
                <p className="text-sm font-medium mb-2">No prompts found.</p>
                <Button variant="outline" size="sm" onClick={handleOpenSettings} className="rounded-lg">
                  Configure Repository
                </Button>
              </>
            ) : (
              <>
                <Search className="h-8 w-8 mx-auto mb-3 opacity-50" />
                <p className="text-sm">No prompts match your search.</p>
              </>
            )}
          </div>
        ) : (
          <ScrollArea className="h-full">
            <div className="space-y-3 pr-3">
              {filteredPrompts.map((prompt) => (
                <Card key={prompt.id} className="rounded-lg hover:shadow-md hover:bg-accent/5 transition-all duration-200 border-border group">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center justify-between">
                      <button
                        onClick={() => handleOpenGitHub(prompt.html_url)}
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200 rounded-md p-1 -m-1 hover:bg-blue-50 dark:hover:bg-blue-950/30"
                      >
                        <span className="truncate max-w-[200px] font-medium">{prompt.filename}</span>
                        <ExternalLink className="h-3 w-3 flex-shrink-0" />
                      </button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopyPrompt(prompt.content, prompt.id)}
                        aria-label="Copy prompt content"
                        className="h-8 w-8 p-0 rounded-lg hover:bg-accent transition-colors duration-200 group-hover:bg-accent/50"
                      >
                        {copiedPromptId === prompt.id ? (
                          <Check className="h-3 w-3 text-green-600 dark:text-green-400" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 pb-4">
                    {prompt.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {prompt.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs rounded-full px-2 py-1 bg-secondary/60 hover:bg-secondary transition-colors duration-200">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {prompt.content.substring(0, 150)}...
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        )}
      </div>
    </div>
  )
}

export default Popup
