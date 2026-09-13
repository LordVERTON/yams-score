import type { CategoryDefinition, CategoryId, MainCategoryId, Scores, UpperCategoryId } from './types'

export const upperCategories: readonly CategoryDefinition[] = [
  { id: 'ones', label: 'As', section: 'upper' },
  { id: 'twos', label: 'Deux', section: 'upper' },
  { id: 'threes', label: 'Trois', section: 'upper' },
  { id: 'fours', label: 'Quatre', section: 'upper' },
  { id: 'fives', label: 'Cinq', section: 'upper' },
  { id: 'sixes', label: 'Six', section: 'upper' }
]

export const mainCategories: readonly CategoryDefinition[] = [
  { id: 'pair', label: 'Paire', section: 'main' },
  { id: 'twoPairs', label: 'Double paire', section: 'main' },
  { id: 'threeKind', label: 'Brelan', section: 'main' },
  { id: 'fourKind', label: 'Carré', section: 'main' },
  { id: 'fullHouse', label: 'Full', section: 'main' },
  { id: 'smallStraight', label: 'Petite suite', section: 'main' },
  { id: 'largeStraight', label: 'Grande suite', section: 'main' },
  { id: 'yams', label: 'Yams', section: 'main' },
  { id: 'yamsBonus', label: 'Yams Bonus', section: 'main' }
]

export const chanceCategories: readonly CategoryDefinition[] = [
  { id: 'chancePlus', label: 'Chance +', section: 'chance' },
  { id: 'chanceMinus', label: 'Chance -', section: 'chance' }
]

export const categoryById = Object.fromEntries([...upperCategories, ...chanceCategories, ...mainCategories].map((category) => [category.id, category])) as Record<CategoryId, CategoryDefinition>

const fixedValues: Record<Exclude<MainCategoryId, 'pair' | 'twoPairs' | 'yamsBonus' | 'chancePlus' | 'chanceMinus'>, readonly number[]> = {
  threeKind: [20],
  fourKind: [30],
  fullHouse: [25],
  smallStraight: [30],
  largeStraight: [40],
  yams: [50]
}

export function validScores(category: CategoryId, scores: Scores): number[] {
  if (category === 'yamsBonus') {
    return scores.yams === 50 ? Array.from({ length: 15 }, (_, index) => (index + 1) * 100) : []
  }
  if (category in fixedValues) return [...fixedValues[category as keyof typeof fixedValues]]
  if (category === 'pair') return [2, 4, 6, 8, 10, 12]
  if (category === 'twoPairs') return [6, 8, 10, 12, 14, 16, 18, 20, 22]
  if (category === 'chancePlus') {
    const minimum = isPositiveScore(scores.chanceMinus) ? scores.chanceMinus + 1 : 5
    return range(minimum, 30)
  }
  if (category === 'chanceMinus') {
    const maximum = isPositiveScore(scores.chancePlus) ? scores.chancePlus - 1 : 30
    return range(5, maximum)
  }

  const upperIndex = (['ones', 'twos', 'threes', 'fours', 'fives', 'sixes'] as UpperCategoryId[]).indexOf(category as UpperCategoryId)
  const face = upperIndex + 1
  return range(1, 5).map((count) => count * face)
}

function range(start: number, end: number): number[] {
  if (end < start) return []
  return Array.from({ length: end - start + 1 }, (_, index) => start + index)
}

function isPositiveScore(value: number | null | undefined): value is number {
  return typeof value === 'number' && value > 0
}
