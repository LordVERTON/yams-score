import { FormEvent, useEffect, useId, useState } from 'react'
import { CircleX, PencilLine, Square, X } from 'lucide-react'
import { categoryById, validScores } from '../game/rules'
import type { CategoryId, Player } from '../game/types'
import { categoryText, useTranslation } from '../i18n'

interface ScoreModalProps {
  player: Player
  category: CategoryId
  onClose: () => void
  onSave: (value: number, isCustomScore?: boolean) => string | null
  onClear: () => void
}

export function ScoreModal({ player, category, onClose, onSave, onClear }: ScoreModalProps) {
  const { language, t } = useTranslation()
  const [customMode, setCustomMode] = useState(false)
  const [customValue, setCustomValue] = useState('')
  const [error, setError] = useState<string | null>(null)
  const titleId = useId()
  const options = validScores(category, player.scores)
  const allowsRangedCustomScore = categoryById[category].section !== 'upper'
  const customScoreHint = allowsRangedCustomScore ? t('customRangeHint') : t('customDefaultHint')

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  const save = (value: number, isCustomScore = false) => {
    const saveError = onSave(value, isCustomScore)
    if (saveError) setError(saveError)
  }

  const submitCustom = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const value = Number(customValue)
    if (!customValue.trim() || !Number.isInteger(value)) {
      setError(t('enterInteger'))
      return
    }
    if (value === 0) {
      setError(t('useScratch'))
      return
    }
    if (allowsRangedCustomScore && (value < 5 || value > 30)) {
      setError(t('customRange'))
      return
    }
    save(value, allowsRangedCustomScore)
  }

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section className="score-modal" role="dialog" aria-modal="true" aria-labelledby={titleId} onMouseDown={(event) => event.stopPropagation()}>
        <header className="modal-header">
          <div className="modal-title">
            <p className="eyebrow">{player.name}</p>
            <h2 id={titleId}>{categoryText(language, category).label}</h2>
          </div>
          <button className="icon-button" type="button" aria-label={t('close')} onClick={onClose}><X size={22} /></button>
        </header>
        <div className="modal-quick-actions" aria-label={t('cellActions')}>
          <button type="button" className="modal-action scratch-action" onClick={() => save(0)}><CircleX size={19} /><span>{t('scratch')}</span></button>
          <button type="button" className="modal-action" onClick={() => { setCustomMode(true); setError(null) }}><PencilLine size={19} /><span>{t('custom')}</span></button>
          <button type="button" className="modal-action" onClick={onClear}><Square size={19} /><span>{t('emptyCell')}</span></button>
        </div>
        {customMode && <form className="custom-score-form" onSubmit={submitCustom}>
          <label htmlFor="custom-score">{t('customScore')}</label>
          <div><input id="custom-score" autoFocus value={customValue} onChange={(event) => { setCustomValue(event.target.value); setError(null) }} type="number" inputMode="numeric" pattern="[0-9]*" min={allowsRangedCustomScore ? 5 : 1} max={allowsRangedCustomScore ? 30 : undefined} step="1" aria-describedby="custom-score-hint" aria-invalid={Boolean(error)} /><button type="submit" className="confirm-button">{t('confirm')}</button></div>
          <small id="custom-score-hint">{customScoreHint}</small>
        </form>}
        {error && <p className="modal-error" role="alert">{error}</p>}
        <p className="modal-help">{t('proposedScores')}</p>
        {options.length ? (
          <div className="score-options" aria-label={t('possibleScores')}>
            {options.map((value) => (
              <button key={value} type="button" className="score-option" onClick={() => save(value)}>{value}</button>
            ))}
          </div>
        ) : <p className="no-option">{t('noCompatibleScore')}</p>}
      </section>
    </div>
  )
}
