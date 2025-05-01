"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Settings, KeyRound, Save, X } from "lucide-react"
import { loadConfig, saveConfig, AppConfig } from "@/lib/config"

export function SettingsModal() {
  const [open, setOpen] = useState(false)
  const [config, setConfig] = useState<AppConfig>(loadConfig())

  useEffect(() => {
    // Load config when modal opens
    if (open) {
      setConfig(loadConfig())
    }
  }, [open])

  const handleSave = () => {
    saveConfig(config)
    setOpen(false)
  }

  const handleCancel = () => {
    setConfig(loadConfig())
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-emerald-800/50">
          <Settings className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-emerald-950/90 border-emerald-800/30 text-white">
        <DialogHeader>
          <DialogTitle className="text-emerald-300">API Keys and Settings</DialogTitle>
          <DialogDescription className="text-gray-300">
            Configure your API keys for resume analysis and job search functionality.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="mistral-api-key" className="text-emerald-300">
              Mistral AI API Key
            </Label>
            <div className="relative">
              <KeyRound className="h-4 w-4 absolute left-3 top-3 text-emerald-600" />
              <Input
                id="mistral-api-key"
                type="password"
                placeholder="sk-..."
                className="bg-emerald-950 border-emerald-800/50 pl-10 text-gray-300 placeholder:text-gray-500"
                value={config.mistralApiKey || ""}
                onChange={(e) => setConfig({ ...config, mistralApiKey: e.target.value })}
              />
            </div>
            <p className="text-gray-400 text-xs">Required for OCR processing of resumes</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="gemini-api-key" className="text-emerald-300">
              Gemini API Key
            </Label>
            <div className="relative">
              <KeyRound className="h-4 w-4 absolute left-3 top-3 text-emerald-600" />
              <Input
                id="gemini-api-key"
                type="password"
                placeholder="AI..."
                className="bg-emerald-950 border-emerald-800/50 pl-10 text-gray-300 placeholder:text-gray-500"
                value={config.geminiApiKey || ""}
                onChange={(e) => setConfig({ ...config, geminiApiKey: e.target.value })}
              />
            </div>
            <p className="text-gray-400 text-xs">Required for job position suggestions</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="scrapingdog-api-key" className="text-emerald-300">
              ScrapingDog API Key
            </Label>
            <div className="relative">
              <KeyRound className="h-4 w-4 absolute left-3 top-3 text-emerald-600" />
              <Input
                id="scrapingdog-api-key"
                type="password"
                placeholder="681..."
                className="bg-emerald-950 border-emerald-800/50 pl-10 text-gray-300 placeholder:text-gray-500"
                value={config.scrapingdogApiKey || ""}
                onChange={(e) => setConfig({ ...config, scrapingdogApiKey: e.target.value })}
              />
            </div>
            <p className="text-gray-400 text-xs">Required for LinkedIn job searches</p>
          </div>

          <div className="flex items-center justify-between pt-4">
            <div className="space-y-0.5">
              <Label htmlFor="storage-option" className="text-emerald-300">
                Save API Keys Locally
              </Label>
              <p className="text-gray-400 text-xs">Store API keys in your browser's local storage</p>
            </div>
            <Switch
              id="storage-option"
              checked={config.useLocalStorage}
              onCheckedChange={(checked) => setConfig({ ...config, useLocalStorage: checked })}
              className="data-[state=checked]:bg-emerald-600"
            />
          </div>
        </div>

        <DialogFooter className="flex justify-between sm:justify-between">
          <Button variant="outline" onClick={handleCancel} className="border-emerald-800 text-gray-300 hover:bg-emerald-900/50">
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-700 text-white">
            <Save className="h-4 w-4 mr-2" />
            Save Settings
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}