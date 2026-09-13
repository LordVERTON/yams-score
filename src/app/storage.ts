import { createGame, createId, createPlayer } from '../game/scoring'
import type { GameArchive, GameState, Player, Scores, ThemeName } from '../game/types'

export const STORAGE_KEY = 'yams-score/game-v1'
export const ARCHIVES_STORAGE_KEY = 'yams-score/archives-v1'
export const THEME_STORAGE_KEY = 'yams-score/theme-v1'

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

export function loadTheme(): ThemeName {
  const theme = localStorage.getItem(THEME_STORAGE_KEY)
  return theme === 'ocean' || theme === 'plum' ? theme : 'amber'
}

export function saveTheme(theme: ThemeName): void {
  localStorage.setItem(THEME_STORAGE_KEY, theme)
}

export function saveNewGameSession(game: GameState, archives: GameArchive[]): void {
  // Store the archive first so an interrupted reset never discards a completed game.
  saveArchives(archives)
  saveGame(game)
}
