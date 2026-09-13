import { describe, expect, it } from 'vitest'
import { getPlayerStats, startNewGame } from './history'
import type { GameArchive, GameState } from './types'

function game(scoresA: GameState['players'][number]['scores'] = {}, scoresB: GameState['players'][number]['scores'] = {}): GameState {
  return {
    id: 'game-1',
    version: 1,
    players: [
      { id: 'chou', name: 'Chou', scores: scoresA },
      { id: 'moumi', name: 'Moumi', scores: scoresB }
    ]
  }
}

function start(currentGame: GameState, archives: GameArchive[] = []) {
  return startNewGame(currentGame, archives, '2026-09-14T12:00:00.000Z', 'game-2')
}

describe('nouvelle partie et archivage', () => {
  it('ne crée aucune archive pour une partie vide', () => {
    const result = start(game())
    expect(result.archived).toBe(false)
    expect(result.archives).toEqual([])
  })

  it('archive une partie contenant au moins un score', () => {
    const result = start(game({ yams: 50 }))
    expect(result.archived).toBe(true)
    expect(result.archives).toHaveLength(1)
  })

  it('considère une rature à zéro comme une partie jouée', () => {
    const result = start(game({ sixes: 0 }))
    expect(result.archived).toBe(true)
    expect(result.archives).toHaveLength(1)
  })

  it('remet tous les scores à vide après la nouvelle partie', () => {
    const result = start(game({ yams: 50 }, { pair: 12 }))
    expect(result.game.players.map((player) => player.scores)).toEqual([{}, {}])
  })

  it('conserve les noms et les identifiants des joueurs', () => {
    const result = start(game({ yams: 50 }))
    expect(result.game.players.map((player) => ({ id: player.id, name: player.name }))).toEqual([
      { id: 'chou', name: 'Chou' },
      { id: 'moumi', name: 'Moumi' }
    ])
  })

  it('enregistre les bons totaux dans l’historique', () => {
    const result = start(game({ yams: 50, pair: 12 }, { pair: 2 }))
    expect(result.archives[0].players.map((player) => ({ name: player.name, total: player.total }))).toEqual([
      { name: 'Chou', total: 62 },
      { name: 'Moumi', total: 2 }
    ])
  })

  it('enregistre le classement et le gagnant', () => {
    const result = start(game({ yams: 50, pair: 12 }, { pair: 2 }))
    expect(result.archives[0].players.map((player) => player.rank)).toEqual([1, 2])
    expect(result.archives[0].winnerIds).toEqual(['chou'])
  })

  it('évite un doublon lors d’un double déclenchement', () => {
    const currentGame = game({ yams: 50 })
    const first = start(currentGame)
    const second = startNewGame(currentGame, first.archives, '2026-09-14T12:00:01.000Z', 'game-3')
    expect(second.archives).toHaveLength(1)
    expect(second.archived).toBe(false)
  })

  it('alimente les statistiques avec la partie archivée', () => {
    const result = start(game({ yams: 50, pair: 12 }, { pair: 2 }))
    expect(getPlayerStats(result.archives)).toEqual([
      { id: 'chou', name: 'Chou', gamesPlayed: 1, wins: 1, totalScore: 62, bestScore: 62, averageScore: 62 },
      { id: 'moumi', name: 'Moumi', gamesPlayed: 1, wins: 0, totalScore: 2, bestScore: 2, averageScore: 2 }
    ])
  })
})
