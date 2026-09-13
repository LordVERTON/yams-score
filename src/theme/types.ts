export type BackgroundThemeId = 'night' | 'forest' | 'slate' | 'marine' | 'aubergine' | 'sepia'
export type GridThemeId = 'forest' | 'emerald' | 'slate' | 'violet' | 'rose' | 'ocean' | 'ember' | 'gold' | 'coral'

export interface AppearancePreferences {
  version: 1
  backgroundTheme: BackgroundThemeId
  gridTheme: GridThemeId
}
