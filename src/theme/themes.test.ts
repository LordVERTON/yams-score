import { describe, expect, it } from 'vitest'
import { DEFAULT_BACKGROUND_THEME, DEFAULT_GRID_THEME, isBackgroundTheme, isGridTheme } from './themes'

describe('catalogue d’apparence', () => {
  it('définit des choix par défaut indépendants', () => {
    expect(DEFAULT_BACKGROUND_THEME).toBe('night')
    expect(DEFAULT_GRID_THEME).toBe('gold')
    expect(DEFAULT_BACKGROUND_THEME).not.toBe(DEFAULT_GRID_THEME)
  })

  it('accepte les thèmes connus et refuse les valeurs inconnues', () => {
    expect(isBackgroundTheme('marine')).toBe(true)
    expect(isBackgroundTheme('ivory')).toBe(true)
    expect(isGridTheme('rose')).toBe(true)
    expect(isBackgroundTheme('rose')).toBe(false)
    expect(isGridTheme('inconnu')).toBe(false)
  })
})
