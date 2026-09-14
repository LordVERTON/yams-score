import { describe, expect, it } from 'vitest'
import { normalizePreferences } from './storage'

describe('préférences d’apparence', () => {
  it('utilise les valeurs par défaut si les données sont inconnues', () => {
    expect(normalizePreferences({ backgroundTheme: 'inconnu', gridTheme: 'inconnu' })).toEqual({ version: 1, backgroundTheme: 'night', gridTheme: 'gold', language: 'fr' })
  })

  it('préserve séparément le fond et la grille', () => {
    expect(normalizePreferences({ backgroundTheme: 'marine', gridTheme: 'rose', language: 'en' })).toEqual({ version: 1, backgroundTheme: 'marine', gridTheme: 'rose', language: 'en' })
  })

  it('migre l’ancien thème unique vers la couleur de grille correspondante', () => {
    expect(normalizePreferences(undefined, 'ocean')).toEqual({ version: 1, backgroundTheme: 'night', gridTheme: 'ocean', language: 'fr' })
    expect(normalizePreferences(undefined, 'plum')).toEqual({ version: 1, backgroundTheme: 'night', gridTheme: 'violet', language: 'fr' })
  })
})
