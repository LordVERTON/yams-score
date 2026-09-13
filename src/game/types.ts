export type UpperCategoryId = 'ones' | 'twos' | 'threes' | 'fours' | 'fives' | 'sixes'
export type MainCategoryId =
  | 'pair'
  | 'twoPairs'
  | 'threeKind'
  | 'fourKind'
  | 'fullHouse'
  | 'smallStraight'
  | 'largeStraight'
  | 'yams'
  | 'yamsBonus'
  | 'chancePlus'
  | 'chanceMinus'
export type CategoryId = UpperCategoryId | MainCategoryId
export type ComputedCategoryId = 'bonus' | 'upperTotal' | 'total'
export type ScoreValue = number | null
export type Scores = Partial<Record<CategoryId, ScoreValue>>

export type BonusStatus = 'neutral' | 'good' | 'warning' | 'danger' | 'earned' | 'missed'

export interface Player {
  id: string
  name: string
  scores: Scores
}

export interface GameState {
  id: string
  version: 1
  players: Player[]
}

export interface ArchivedPlayer {
  id: string
  name: string
  scores: Scores
  total: number
  rank: number
}

export interface GameArchive {
  id: string
  archivedAt: string
  sourceKey: string
  players: ArchivedPlayer[]
  winnerIds: string[]
}

export interface PlayerStats {
  id: string
  name: string
  gamesPlayed: number
  wins: number
  totalScore: number
  bestScore: number
  averageScore: number
}

export interface CategoryDefinition {
  id: CategoryId
  label: string
  section: 'upper' | 'chance' | 'main'
  description: string
  scoreSummary: string
}
