import { createGame, createId, createPlayer } from '../game/scoring'
import type { GameArchive, GameState, Player, Scores } from '../game/types'
import { DEFAULT_BACKGROUND_THEME, DEFAULT_GRID_THEME, isBackgroundTheme, isGridTheme } from '../theme/themes'
import type { AppearancePreferences } from '../theme/types'

export const STORAGE_KEY = 'yams-score/game-v1'
export const ARCHIVES_STORAGE_KEY = 'yams-score/archives-v1'
export const PREFERENCES_STORAGE_KEY = 'yams-score/preferences-v1'
const LEGACY_THEME_STORAGE_KEY = 'yams-score/theme-v1'

function safeScores(value: unknown): Scores {
  if (!value || typeof value !== 'object') return {}
  return Object.fromEntries(Object.entries(value).filter(([, score]) => typeof score === 'number' || score === null)) as Scores
}

function safePlayer(value: unknown, index: number): Player {
  if (!value || typeof value !== 'object') return createPlayer(`Joueur ${index + 1}`)
  const candidate = value as Partial<Player>
  return {
    id: typeof candidate.id === 'string' && candidate.id ? candidate.id : createId(),
    name: typeof candidate.name === 'string' && candidate.name.trim() ? candidate.name.trim().slice(0, 32) : `Joueur ${index + 1}`,
    scores: safeScores(candidate.scores)
  }
}

export function loadGame(): GameState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return createGame()
    const parsed: unknown = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object' || !Array.isArray((parsed as { players?: unknown }).players)) return createGame()
    const players = (parsed as { players: unknown[] }).players.map(safePlayer)
    return { id: typeof (parsed as Partial<GameState>).id === 'string' ? (parsed as GameState).id : createId(), version: 1, players: players.length ? players : createGame().players }
  } catch {
    return createGame()
  }
}

export function saveGame(game: GameState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(game))
}

export function loadArchives(): GameArchive[] {
  try {
    const raw = localStorage.getItem(ARCHIVES_STORAGE_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter((archive): archive is GameArchive => Boolean(
      archive && typeof archive === 'object' &&
      typeof (archive as GameArchive).id === 'string' &&
      typeof (archive as GameArchive).archivedAt === 'string' &&
      Array.isArray((archive as GameArchive).players) &&
      Array.isArray((archive as GameArchive).winnerIds)
    ))
  } catch {
    return []
  }
}

export function saveArchives(archives: GameArchive[]): void {
  localStorage.setItem(ARCHIVES_STORAGE_KEY, JSON.stringify(archives))
}

function defaultPreferences(): AppearancePreferences {
  return { version: 1, backgroundTheme: DEFAULT_BACKGROUND_THEME, gridTheme: DEFAULT_GRID_THEME }
}

export function normalizePreferences(value: unknown, legacyTheme?: unknown): AppearancePreferences {
  if (value && typeof value === 'object') {
    const values = value as Partial<AppearancePreferences>
    return {
      version: 1,
      backgroundTheme: isBackgroundTheme(values.backgroundTheme) ? values.backgroundTheme : DEFAULT_BACKGROUND_THEME,
      gridTheme: isGridTheme(values.gridTheme) ? values.gridTheme : DEFAULT_GRID_THEME
    }
  }
  const gridTheme = legacyTheme === 'ocean' ? 'ocean' : legacyTheme === 'plum' ? 'violet' : DEFAULT_GRID_THEME
  return { ...defaultPreferences(), gridTheme }
}

export function loadPreferences(): AppearancePreferences {
  try {
    const raw = localStorage.getItem(PREFERENCES_STORAGE_KEY)
    if (raw) {
      const candidate: unknown = JSON.parse(raw)
      if (candidate && typeof candidate === 'object') return normalizePreferences(candidate)
    }
    // Migration de l'ancien thème unique : sa couleur reste l'accent et le fond
    // garde la direction sombre Forêt afin de ne pas surprendre les utilisateurs.
    const legacy = localStorage.getItem(LEGACY_THEME_STORAGE_KEY)
    const preferences = normalizePreferences(undefined, legacy)
    if (legacy) savePreferences(preferences)
    return preferences
  } catch {
    return defaultPreferences()
  }
}

export function savePreferences(preferences: AppearancePreferences): void {
  localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(preferences))
}

export function clearArchives(): void {
  localStorage.removeItem(ARCHIVES_STORAGE_KEY)
}

export function saveNewGameSession(game: GameState, archives: GameArchive[]): void {
  // Store the archive first so an interrupted reset never discards a completed game.
  saveArchives(archives)
  saveGame(game)
}
