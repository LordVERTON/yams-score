import { FormEvent, useEffect, useId, useState } from 'react'
import { CircleX, PencilLine, Square, X } from 'lucide-react'
import { validScores } from '../game/rules'
import type { CategoryId, Player } from '../game/types'

interface ScoreModalProps {
  player: Player
  category: CategoryId
  label: string
  onClose: () => void
  onSave: (value: number) => string | null
  onClear: () => void
}

export function ScoreModal({ player, category, label, onClose, onSave, onClear }: ScoreModalProps) {
  const [customMode, setCustomMode] = useState(false)
  const [customValue, setCustomValue] = useState('')
  const [error, setError] = useState<string | null>(null)
  const titleId = useId()
  const options = validScores(category, player.scores)

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  const save = (value: number) => {
    const saveError = onSave(value)
    if (saveError) setError(saveError)
  }

  const submitCustom = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const value = Number(customValue)
    if (!customValue.trim() || !Number.isInteger(value)) {
      setError('Saisissez un score entier.')
      return
    }
    if (value === 0) {
      setError('Utilisez 0 / Raturer pour inscrire zéro.')
      return
    }
    save(value)
  }

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section className="score-modal" role="dialog" aria-modal="true" aria-labelledby={titleId} onMouseDown={(event) => event.stopPropagation()}>
        <header className="modal-header">
          <div className="modal-title">
            <p className="eyebrow">{player.name}</p>
            <h2 id={titleId}>{label}</h2>
          </div>
          <button className="icon-button" type="button" aria-label="Fermer" onClick={onClose}><X size={22} /></button>
        </header>
        <div className="modal-quick-actions" aria-label="Actions sur la case">
          <button type="button" className="modal-action scratch-action" onClick={() => save(0)}><CircleX size={19} /><span>0 / Raturer</span></button>
          <button type="button" className="modal-action" onClick={() => { setCustomMode(true); setError(null) }}><PencilLine size={19} /><span>Personnalisé</span></button>
          <button type="button" className="modal-action" onClick={onClear}><Square size={19} /><span>Case vide</span></button>
        </div>
        {customMode && <form className="custom-score-form" onSubmit={submitCustom}>
          <label htmlFor="custom-score">Score personnalisé</label>
          <div><input id="custom-score" autoFocus value={customValue} onChange={(event) => { setCustomValue(event.target.value); setError(null) }} type="number" inputMode="numeric" pattern="[0-9]*" min="0" step="1" /><button type="submit" className="confirm-button">Valider</button></div>
        </form>}
        {error && <p className="modal-error" role="alert">{error}</p>}
        <p className="modal-help">Scores proposés</p>
        {options.length ? (
          <div className="score-options" aria-label="Scores possibles">
            {options.map((value) => (
              <button key={value} type="button" className="score-option" onClick={() => save(value)}>{value}</button>
            ))}
          </div>
        ) : <p className="no-option">Aucune valeur compatible pour le moment.</p>}
      </section>
    </div>
  )
}
