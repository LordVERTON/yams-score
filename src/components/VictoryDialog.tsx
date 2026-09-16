import { useEffect, useId, type CSSProperties } from 'react'
import { Crown, PartyPopper, X } from 'lucide-react'
import { useTranslation } from '../i18n'
import type { Player } from '../game/types'

interface VictoryDialogProps {
  winner: Player
  score: number
  onClose: () => void
}

const confettiPieces = Array.from({ length: 42 }, (_, index) => index)
const fireworkSparks = Array.from({ length: 14 }, (_, index) => index)

export function VictoryDialog({ winner, score, onClose }: VictoryDialogProps) {
  const { t } = useTranslation()
  const titleId = useId()

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  return (
    <div className="victory-backdrop" role="presentation" onMouseDown={onClose}>
      <div className="celebration-effects" aria-hidden="true">
        <div className="confetti-field">{confettiPieces.map((piece) => <i key={piece} style={{ '--piece': piece } as CSSProperties} />)}</div>
        <div className="firework firework-left">{fireworkSparks.map((spark) => <i key={spark} style={{ '--spark': spark } as CSSProperties} />)}</div>
        <div className="firework firework-right">{fireworkSparks.map((spark) => <i key={spark} style={{ '--spark': spark } as CSSProperties} />)}</div>
      </div>
      <section className="victory-dialog" role="dialog" aria-modal="true" aria-labelledby={titleId} onMouseDown={(event) => event.stopPropagation()}>
        <button className="victory-close" type="button" aria-label={t('close')} onClick={onClose}><X size={20} /></button>
        <div className="victory-icon"><Crown size={39} aria-hidden="true" /></div>
        <p className="dialog-eyebrow"><PartyPopper size={16} aria-hidden="true" /> {t('winner')}</p>
        <h2 id={titleId}>{t('celebrationTitle', { name: winner.name })}</h2>
        <p>{t('celebrationMessage', { score })}</p>
        <button className="victory-confirm" type="button" onClick={onClose}>{t('close')}</button>
      </section>
    </div>
  )
}
