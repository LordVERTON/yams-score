import type { CategoryDefinition, CategoryId, MainCategoryId, Scores, UpperCategoryId } from './types'

export const upperCategories: readonly CategoryDefinition[] = [
  { id: 'ones', label: 'As', section: 'upper', description: 'Somme des dés affichant 1.', scoreSummary: '1, 2, 3, 4 ou 5.' },
  { id: 'twos', label: 'Deux', section: 'upper', description: 'Somme des dés affichant 2.', scoreSummary: '2, 4, 6, 8 ou 10.' },
  { id: 'threes', label: 'Trois', section: 'upper', description: 'Somme des dés affichant 3.', scoreSummary: '3, 6, 9, 12 ou 15.' },
  { id: 'fours', label: 'Quatre', section: 'upper', description: 'Somme des dés affichant 4.', scoreSummary: '4, 8, 12, 16 ou 20.' },
  { id: 'fives', label: 'Cinq', section: 'upper', description: 'Somme des dés affichant 5.', scoreSummary: '5, 10, 15, 20 ou 25.' },
  { id: 'sixes', label: 'Six', section: 'upper', description: 'Somme des dés affichant 6.', scoreSummary: '6, 12, 18, 24 ou 30.' }
]

export const mainCategories: readonly CategoryDefinition[] = [
  { id: 'pair', label: 'Paire', section: 'main', description: 'Valeur des deux dés de la paire.', scoreSummary: '2, 4, 6, 8, 10 ou 12.' },
  { id: 'twoPairs', label: 'Double paire', section: 'main', description: 'Deux paires, y compris de même valeur.', scoreSummary: '4 à 24, de 2 en 2.' },
  { id: 'threeKind', label: 'Brelan', section: 'main', description: 'Trois dés de même valeur.', scoreSummary: '20 points.' },
  { id: 'fourKind', label: 'Carré', section: 'main', description: 'Quatre dés de même valeur.', scoreSummary: '30 points.' },
  { id: 'fullHouse', label: 'Full', section: 'main', description: 'Un brelan et une paire.', scoreSummary: '25 points.' },
  { id: 'smallStraight', label: 'Petite suite', section: 'main', description: 'Suite de quatre dés.', scoreSummary: '30 points.' },
  { id: 'largeStraight', label: 'Grande suite', section: 'main', description: 'Suite de cinq dés.', scoreSummary: '40 points.' },
  { id: 'yams', label: 'Yams', section: 'main', description: 'Cinq dés de même valeur.', scoreSummary: '50 points.' },
  { id: 'yamsBonus', label: 'Yams Bonus', section: 'main', description: 'Chaque Yams supplémentaire après un Yams à 50.', scoreSummary: '100 points par Yams, cumulés.' }
]

export const chanceCategories: readonly CategoryDefinition[] = [
  { id: 'chancePlus', label: 'Chance +', section: 'chance', description: 'Somme des cinq dés.', scoreSummary: '5 à 30, strictement supérieure à Chance -.' },
  { id: 'chanceMinus', label: 'Chance -', section: 'chance', description: 'Somme des cinq dés.', scoreSummary: '5 à 30, strictement inférieure à Chance +.' }
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
  if (category === 'twoPairs') return range(4, 24).filter((value) => value % 2 === 0)
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
