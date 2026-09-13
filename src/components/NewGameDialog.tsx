interface NewGameDialogProps {
  isSubmitting: boolean
  onCancel: () => void
  onConfirm: () => void
}

export function NewGameDialog({ isSubmitting, onCancel, onConfirm }: NewGameDialogProps) {
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onCancel}>
      <section className="app-dialog" role="dialog" aria-modal="true" aria-labelledby="new-game-title" onMouseDown={(event) => event.stopPropagation()}>
        <p className="dialog-eyebrow">Nouvelle partie</p>
        <h2 id="new-game-title">Commencer une nouvelle partie ?</h2>
        <p>Les scores actuels seront archivés avant de commencer une nouvelle partie.</p>
        <div className="dialog-actions">
          <button type="button" className="dialog-cancel" onClick={onCancel} disabled={isSubmitting}>Annuler</button>
          <button type="button" className="dialog-confirm" onClick={onConfirm} disabled={isSubmitting}>Nouvelle partie</button>
        </div>
      </section>
    </div>
  )
}
