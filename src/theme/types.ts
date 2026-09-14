export type BackgroundThemeId = 'night' | 'forest' | 'slate' | 'marine' | 'aubergine' | 'sepia' | 'ivory' | 'mist' | 'sand'
export type GridThemeId = 'forest' | 'emerald' | 'slate' | 'violet' | 'rose' | 'ocean' | 'ember' | 'gold' | 'coral'

export interface AppearancePreferences {
  version: 1
  backgroundTheme: BackgroundThemeId
  gridTheme: GridThemeId
  language: Language
}
import type { Language } from '../i18n'
