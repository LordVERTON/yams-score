import { createId, total } from './scoring'
import type { GameArchive, GameState, PlayerStats, Scores, ThemeName } from './types'

function cloneScores(scores: Scores): Scores {
  return { ...scores }
}

export function gameHasPlayedScore(game: GameState): boolean {
  return game.players.some((player) => Object.values(player.scores).some((score) => typeof score === 'number'))
}

export function getGameSourceKey(game: GameState): string {
  return JSON.stringify({ gameId: game.id, players: game.players.map((player) => ({ id: player.id, name: player.name, scores: player.scores })) })
}

export function createArchive(game: GameState, archivedAt: string, id = `${archivedAt}-${getGameSourceKey(game)}`): GameArchive {
  const archivedPlayers = game.players.map((player) => ({
    id: player.id,
    name: player.name,
    scores: cloneScores(player.scores),
    total: total(player.scores),
    rank: 0
  })).sort((left, right) => right.total - left.total)

  let previousTotal: number | undefined
  let previousRank = 0
  archivedPlayers.forEach((player, index) => {
    player.rank = player.total === previousTotal ? previousRank : index + 1
    previousTotal = player.total
    previousRank = player.rank
  })

  const bestTotal = archivedPlayers[0]?.total ?? 0
  return {
    id,
    archivedAt,
    sourceKey: getGameSourceKey(game),
    players: archivedPlayers,
    winnerIds: archivedPlayers.filter((player) => player.total === bestTotal).map((player) => player.id)
  }
}

export function createNewGameWithPlayers(game: GameState, id: string = createId()): GameState {
  return {
    id,
    version: 1,
    players: game.players.map((player) => ({ id: player.id, name: player.name, scores: {} }))
  }
}

export function startNewGame(game: GameState, archives: GameArchive[], theme: ThemeName, archivedAt: string, nextGameId?: string): { game: GameState; archives: GameArchive[]; theme: ThemeName; archived: boolean } {
  const nextGame = () => createNewGameWithPlayers(game, nextGameId)
  if (!gameHasPlayedScore(game)) return { game: nextGame(), archives, theme, archived: false }

  const sourceKey = getGameSourceKey(game)
  const alreadyArchived = archives.some((archive) => archive.sourceKey === sourceKey)
  const nextArchives = alreadyArchived ? archives : [createArchive(game, archivedAt), ...archives]
  return { game: nextGame(), archives: nextArchives, theme, archived: !alreadyArchived }
}

export function getPlayerStats(archives: GameArchive[]): PlayerStats[] {
  const stats = new Map<string, PlayerStats>()
  archives.forEach((archive) => archive.players.forEach((player) => {
    const current = stats.get(player.id) ?? { id: player.id, name: player.name, gamesPlayed: 0, wins: 0, totalScore: 0, bestScore: 0, averageScore: 0 }
    current.gamesPlayed += 1
    current.wins += archive.winnerIds.includes(player.id) ? 1 : 0
    current.totalScore += player.total
    current.bestScore = Math.max(current.bestScore, player.total)
    current.averageScore = Math.round(current.totalScore / current.gamesPlayed)
    stats.set(player.id, current)
  }))
  return [...stats.values()].sort((left, right) => right.wins - left.wins || right.averageScore - left.averageScore || left.name.localeCompare(right.name))
}
