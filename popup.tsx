import React, { useState } from 'react'
import { Search, Settings, RefreshCw, Copy, ExternalLink, AlertCircle } from 'lucide-react'
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
  const { prompts, isLoading, error, refreshPrompts } = usePrompts()

  // Filter prompts based on search query
  const filteredPrompts = prompts.filter(prompt =>
    prompt.filename.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleCopyPrompt = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content)
      // TODO: Add toast notification for successful copy
    } catch (err) {
      console.error('Failed to copy prompt:', err)
      // TODO: Add error handling notification
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
        <div className="flex gap-2">
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

      {/* Search Bar */}
      <div className="p-4 border-b border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search prompts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 rounded-lg"
          />
        </div>
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
                <Card key={prompt.id} className="rounded-lg hover:shadow-md hover:bg-accent/5 transition-all duration-200 border-border">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center justify-between">
                      <button
                        onClick={() => handleOpenGitHub(prompt.html_url)}
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors rounded-md p-1 -m-1 hover:bg-blue-50 dark:hover:bg-blue-950/30"
                      >
                        <span className="truncate max-w-[200px] font-medium">{prompt.filename}</span>
                        <ExternalLink className="h-3 w-3 flex-shrink-0" />
                      </button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopyPrompt(prompt.content)}
                        aria-label="Copy prompt content"
                        className="h-8 w-8 p-0 rounded-lg hover:bg-accent"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 pb-4">
                    {prompt.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {prompt.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs rounded-full px-2 py-1">
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
