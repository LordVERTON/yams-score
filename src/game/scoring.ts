import { chanceCategories, mainCategories, upperCategories, validScores } from './rules'
import type { BonusStatus, CategoryId, GameState, Player, Scores } from './types'

export const BONUS_THRESHOLD = 63
export const BONUS_VALUE = 35
export const UPPER_TARGETS: Record<string, number> = {
  ones: 3,
  twos: 6,
  threes: 9,
  fours: 12,
  fives: 15,
  sixes: 18
}

// `crypto.randomUUID()` is unavailable in Safari when the app is opened over
// plain HTTP on a LAN IP.  Development URLs use HTTP, so keep a local fallback
// for game and player identifiers.
export function createId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') return crypto.randomUUID()
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`
}

export function upperSubtotal(scores: Scores): number {
  return upperCategories.reduce((sum, category) => sum + (scores[category.id] ?? 0), 0)
}

export function getUpperSectionScore(scores: Scores): number {
  return upperSubtotal(scores)
}

export function getUpperSectionRemaining(scores: Scores): number {
  return Math.max(0, BONUS_THRESHOLD - upperSubtotal(scores))
}

export function getBonusPaceDelta(scores: Scores): number {
  return upperCategories.reduce((delta, category) => {
    const score = scores[category.id]
    return typeof score === 'number' ? delta + score - UPPER_TARGETS[category.id] : delta
  }, 0)
}

export function areUpperCategoriesComplete(scores: Scores): boolean {
  return upperCategories.every((category) => scores[category.id] !== undefined && scores[category.id] !== null)
}

export function getBonusIndicatorStatus(scores: Scores): BonusStatus {
  if (areUpperCategoriesComplete(scores)) return upperSubtotal(scores) >= BONUS_THRESHOLD ? 'earned' : 'missed'
  const playedCount = upperCategories.filter((category) => scores[category.id] !== undefined && scores[category.id] !== null).length
  if (playedCount === 0) return 'neutral'
  const delta = getBonusPaceDelta(scores)
  if (delta >= 0) return 'good'
  if (delta >= -5) return 'warning'
  return 'danger'
}

export function calculateBonus(scores: Scores): number {
  return upperSubtotal(scores) >= BONUS_THRESHOLD ? BONUS_VALUE : 0
}

export const bonus = calculateBonus

export function upperTotal(scores: Scores): number {
  return upperSubtotal(scores) + bonus(scores)
}

export function chanceTotal(scores: Scores): number {
  return chanceCategories.reduce((sum, category) => sum + (scores[category.id] ?? 0), 0)
}

export function total(scores: Scores): number {
  return upperTotal(scores) + chanceTotal(scores) + mainCategories.reduce((sum, category) => sum + (scores[category.id] ?? 0), 0)
}

export function isValidScore(category: CategoryId, value: number, scores: Scores): boolean {
  return validScores(category, scores).includes(value)
}

export function isCustomScoreInRange(category: CategoryId, value: number): boolean {
  return (chanceCategories.some((candidate) => candidate.id === category) || mainCategories.some((candidate) => candidate.id === category))
    && Number.isInteger(value)
    && value >= 5
    && value <= 30
}

export function scoreValidationMessage(category: CategoryId, value: number, scores: Scores, isCustomScore = false): string | null {
  if (isCustomScore && isCustomScoreInRange(category, value)) return null
  if (isCustomScore) return 'Le score personnalisé doit être compris entre 5 et 30.'
  if (isValidScore(category, value, scores)) return null
  if (category === 'chancePlus' && typeof scores.chanceMinus === 'number' && scores.chanceMinus > 0) return 'Chance + doit être strictement supérieure à Chance -.'
  if (category === 'chanceMinus' && typeof scores.chancePlus === 'number' && scores.chancePlus > 0) return 'Chance - doit être strictement inférieure à Chance +.'
  return 'Score invalide pour cette catégorie.'
}

export function setScore(player: Player, category: CategoryId, value: number, isCustomScore = false): Player {
  const error = value === 0 ? null : scoreValidationMessage(category, value, player.scores, isCustomScore)
  if (error) throw new Error(error)
  return { ...player, scores: { ...player.scores, [category]: value } }
}

export function clearScore(player: Player, category: CategoryId): Player {
  return { ...player, scores: { ...player.scores, [category]: null } }
}

export function createPlayer(name: string, id = createId()): Player {
  return { id, name, scores: {} }
}

export function createGame(): GameState {
  return { id: createId(), version: 1, players: [createPlayer('Joueur 1'), createPlayer('Joueur 2')] }
}
