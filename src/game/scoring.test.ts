import { describe, expect, it } from 'vitest'
import { validScores } from './rules'
import {
  areUpperCategoriesComplete,
  bonus,
  clearScore,
  getBonusIndicatorStatus,
  getBonusPaceDelta,
  getUpperSectionRemaining,
  isValidScore,
  setScore,
  total,
  upperSubtotal,
  upperTotal
} from './scoring'
import type { Player, Scores } from './types'

describe('indicateur du bonus', () => {
  it('est neutre avec 63 points restants quand la section I est vide', () => {
    expect(getUpperSectionRemaining({})).toBe(63)
    expect(getBonusIndicatorStatus({})).toBe('neutral')
  })

  it('indique une bonne progression avec Trois 12, Quatre 8 et Cinq 25', () => {
    const scores: Scores = { threes: 12, fours: 8, fives: 25 }
    expect(upperSubtotal(scores)).toBe(45)
    expect(getUpperSectionRemaining(scores)).toBe(18)
    expect(getBonusPaceDelta(scores)).toBe(9)
    expect(getBonusIndicatorStatus(scores)).toBe('good')
  })

  it('indique un retard important avec As 1 et Deux 2', () => {
    const scores: Scores = { ones: 1, twos: 2 }
    expect(getBonusPaceDelta(scores)).toBe(-6)
    expect(getBonusIndicatorStatus(scores)).toBe('danger')
  })

  it('indique un retard léger avec As 3 et Deux 4', () => {
    const scores: Scores = { ones: 3, twos: 4 }
    expect(getBonusPaceDelta(scores)).toBe(-2)
    expect(getBonusIndicatorStatus(scores)).toBe('warning')
  })

  it('ne donne jamais un nombre de points restants négatif', () => {
    expect(getUpperSectionRemaining({ sixes: 30, fives: 25, fours: 20 })).toBe(0)
    expect(getUpperSectionRemaining({ ones: 5, twos: 10, threes: 15, fours: 20, fives: 25, sixes: 30 })).toBe(0)
  })

  it('affiche le bonus gagné lorsque les six catégories sont complétées à 63', () => {
    const scores: Scores = { ones: 3, twos: 6, threes: 9, fours: 12, fives: 15, sixes: 18 }
    expect(areUpperCategoriesComplete(scores)).toBe(true)
    expect(bonus(scores)).toBe(35)
    expect(upperTotal(scores)).toBe(98)
    expect(getBonusIndicatorStatus(scores)).toBe('earned')
  })

  it('affiche un bonus manqué lorsque les six catégories sont complétées sous 63', () => {
    const scores: Scores = { ones: 1, twos: 2, threes: 3, fours: 4, fives: 5, sixes: 6 }
    expect(bonus(scores)).toBe(0)
    expect(getBonusIndicatorStatus(scores)).toBe('missed')
  })

  it('compte une rature comme une catégorie jouée dans le rythme', () => {
    const scores: Scores = { sixes: 0 }
    expect(areUpperCategoriesComplete(scores)).toBe(false)
    expect(getBonusPaceDelta(scores)).toBe(-18)
    expect(getBonusIndicatorStatus(scores)).toBe('danger')
  })
})

describe('valeurs autorisées', () => {
  it('conserve les scores prédéfinis de la partie supérieure et des paires', () => {
    expect(validScores('ones', {})).toEqual([1, 2, 3, 4, 5])
    expect(validScores('fours', {})).toEqual([4, 8, 12, 16, 20])
    expect(validScores('pair', {})).toEqual([2, 4, 6, 8, 10, 12])
    expect(validScores('twoPairs', {})).toEqual([6, 8, 10, 12, 14, 16, 18, 20, 22])
    expect(validScores('yams', {})).toEqual([50])
  })

  it('contraint Chance + au-dessus de Chance -', () => {
    expect(validScores('chancePlus', { chanceMinus: 16 })).toEqual([17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30])
    expect(isValidScore('chancePlus', 16, { chanceMinus: 16 })).toBe(false)
  })

  it('contraint Chance - au-dessous de Chance +', () => {
    expect(validScores('chanceMinus', { chancePlus: 8 })).toEqual([5, 6, 7])
    expect(isValidScore('chanceMinus', 8, { chancePlus: 8 })).toBe(false)
  })

  it('laisse toutes les Chances disponibles si l’autre est vide ou raturée', () => {
    expect(validScores('chancePlus', {})).toEqual(Array.from({ length: 26 }, (_, index) => index + 5))
    expect(validScores('chanceMinus', { chancePlus: 0 })).toEqual(Array.from({ length: 26 }, (_, index) => index + 5))
  })

  it('propose 100 points par Yams supplémentaire après un Yams', () => {
    expect(validScores('yamsBonus', {})).toEqual([])
    expect(validScores('yamsBonus', { yams: 50 })).toEqual([100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500])
  })
})

describe('saisie, rature et remise à vide', () => {
  const player: Player = { id: 'player', name: 'Test', scores: {} }

  it('enregistre une rature à 0', () => {
    const scratched = setScore(player, 'yams', 0)
    expect(scratched.scores.yams).toBe(0)
  })

  it('remet une catégorie à null avec Case vide', () => {
    const scored = setScore(player, 'yams', 50)
    const cleared = clearScore(scored, 'yams')
    expect(cleared.scores.yams).toBeNull()
  })

  it('accepte un score personnalisé valide et refuse un score invalide', () => {
    expect(setScore(player, 'pair', 12).scores.pair).toBe(12)
    expect(() => setScore(player, 'pair', 3)).toThrow('Score invalide pour cette catégorie.')
  })

  it('calcule le total complet avec le Yams Bonus', () => {
    expect(total({ ones: 1, pair: 12, yams: 50, yamsBonus: 200, chancePlus: 25, chanceMinus: 10 })).toBe(298)
  })
})
