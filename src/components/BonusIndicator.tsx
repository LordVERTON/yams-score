import { ArrowUpRight } from 'lucide-react'
import { getBonusIndicatorStatus, getUpperSectionRemaining } from '../game/scoring'
import type { Scores } from '../game/types'
import { useTranslation } from '../i18n'

interface BonusIndicatorProps {
  scores: Scores
}

export function BonusIndicator({ scores }: BonusIndicatorProps) {
  const { t } = useTranslation()
  const status = getBonusIndicatorStatus(scores)

  if (status === 'earned') return <span className="bonus-result earned">+35</span>
  if (status === 'missed') return <span className="bonus-result missed">0</span>

  const remaining = getUpperSectionRemaining(scores)
  return (
    <span className={`bonus-indicator ${status}`} aria-label={t('remainingBonus', { count: remaining })}>
      <span className="bonus-icon" aria-hidden="true"><ArrowUpRight size={14} strokeWidth={2.7} /></span>
      <span>{remaining}</span>
    </span>
  )
}
