import type { AppearancePreferences } from './types'

export function applyAppearance(preferences: AppearancePreferences): void {
  document.documentElement.dataset.backgroundTheme = preferences.backgroundTheme
  document.documentElement.dataset.gridTheme = preferences.gridTheme
}
