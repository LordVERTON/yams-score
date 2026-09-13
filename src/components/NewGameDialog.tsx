interface NewGameDialogProps {
  isSubmitting: boolean
  onCancel: () => void
  onConfirm: () => void
}

export function NewGameDialog({ isSubmitting, onCancel, onConfirm }: NewGameDialogProps) {
  return (
    <BottomSheet title="Commencer une nouvelle partie ?" eyebrow="Nouvelle partie" onClose={onCancel} className="confirm-sheet">
        <p>Les scores actuels seront archivés avant de commencer une nouvelle partie.</p>
        <div className="dialog-actions">
          <button type="button" className="dialog-cancel" onClick={onCancel} disabled={isSubmitting}>Annuler</button>
          <button type="button" className="dialog-confirm" onClick={onConfirm} disabled={isSubmitting}>Nouvelle partie</button>
        </div>
    </BottomSheet>
  )
}
import { BottomSheet } from './BottomSheet'
