// Configuration manager for API keys and settings

/**
 * Application configuration interface
 */
export interface AppConfig {
    mistralApiKey: string | null
    geminiApiKey: string | null
    scrapingdogApiKey: string | null
    useLocalStorage: boolean
  }
  
  // Default configuration
  const defaultConfig: AppConfig = {
    mistralApiKey: null,
    geminiApiKey: null,
    scrapingdogApiKey: null, // Default from example
    useLocalStorage: true
  }
  
  // Storage key for persisted configuration
  const CONFIG_STORAGE_KEY = 'resume_job_search_config'
  
  /**
   * Load the configuration from local storage or use defaults
   */
  export function loadConfig(): AppConfig {
    if (typeof window === 'undefined' || !localStorage) {
      return { ...defaultConfig }
    }
  
    try {
      const storedConfig = localStorage.getItem(CONFIG_STORAGE_KEY)
      if (storedConfig) {
        return { ...defaultConfig, ...JSON.parse(storedConfig) }
      }
    } catch (error) {
      console.error('Error loading configuration:', error)
    }
  
    return { ...defaultConfig }
  }
  
  /**
   * Save the configuration to local storage
   */
  export function saveConfig(config: Partial<AppConfig>): AppConfig {
    const currentConfig = loadConfig()
    const updatedConfig = { ...currentConfig, ...config }
  
    if (typeof window !== 'undefined' && localStorage && updatedConfig.useLocalStorage) {
      try {
        localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(updatedConfig))
      } catch (error) {
        console.error('Error saving configuration:', error)
      }
    }
  
    return updatedConfig
  }
  
  /**
   * Check if the required API keys are set
   */
  export function hasRequiredApiKeys(config: AppConfig): boolean {
    return Boolean(config.mistralApiKey && config.geminiApiKey && config.scrapingdogApiKey)
  }
  
  /**
   * Get secure headers for API requests (includes API keys)
   */
  export function getApiHeaders(): Record<string, string> {
    const config = loadConfig()
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }
  
    // Add any authorization headers if needed
    // Note: It's better to handle the API keys on the server side for security
    // This is just for demonstration purposes
  
    return headers
  }