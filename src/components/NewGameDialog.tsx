interface NewGameDialogProps {
  isSubmitting: boolean
  onCancel: () => void
  onConfirm: () => void
}

export function NewGameDialog({ isSubmitting, onCancel, onConfirm }: NewGameDialogProps) {
  const { t } = useTranslation()
  return (
    <BottomSheet title={t('startNewGame')} eyebrow={t('newGame')} onClose={onCancel} className="confirm-sheet">
        <p>{t('currentScoresArchived')}</p>
        <div className="dialog-actions">
          <button type="button" className="dialog-cancel" onClick={onCancel} disabled={isSubmitting}>{t('cancel')}</button>
          <button type="button" className="dialog-confirm" onClick={onConfirm} disabled={isSubmitting}>{t('newGame')}</button>
        </div>
    </BottomSheet>
  )
}
import { BottomSheet } from './BottomSheet'
import { useTranslation } from '../i18n'
