import type { BackgroundThemeId, GridThemeId } from './types'

export interface ThemeOption<T extends string> { id: T; label: string; preview: string }

// L'ancien fond global était presque noir (#111418) : Nuit évite un changement
// visuel brutal lors de la migration des utilisateurs existants.
export const DEFAULT_BACKGROUND_THEME: BackgroundThemeId = 'night'
export const DEFAULT_GRID_THEME: GridThemeId = 'gold'

export const backgroundThemes: readonly ThemeOption<BackgroundThemeId>[] = [
  { id: 'night', label: 'Nuit', preview: '#101215' }, { id: 'forest', label: 'Forêt', preview: '#101917' },
  { id: 'slate', label: 'Ardoise', preview: '#171a20' }, { id: 'marine', label: 'Marine', preview: '#101721' },
  { id: 'aubergine', label: 'Aubergine', preview: '#1a131e' }, { id: 'sepia', label: 'Sépia', preview: '#1c1711' }
]

export const gridThemes: readonly ThemeOption<GridThemeId>[] = [
  { id: 'forest', label: 'Forêt', preview: '#89b997' }, { id: 'emerald', label: 'Émeraude', preview: '#65d0a0' },
  { id: 'slate', label: 'Ardoise', preview: '#aab8c7' }, { id: 'violet', label: 'Violet', preview: '#b89be5' },
  { id: 'rose', label: 'Rose', preview: '#e39ab6' }, { id: 'ocean', label: 'Océan', preview: '#75c9d8' },
  { id: 'ember', label: 'Braise', preview: '#dc8c67' }, { id: 'gold', label: 'Or', preview: '#e8b449' }, { id: 'coral', label: 'Corail', preview: '#ed9181' }
]

export function isBackgroundTheme(value: unknown): value is BackgroundThemeId { return backgroundThemes.some((theme) => theme.id === value) }
export function isGridTheme(value: unknown): value is GridThemeId { return gridThemes.some((theme) => theme.id === value) }
