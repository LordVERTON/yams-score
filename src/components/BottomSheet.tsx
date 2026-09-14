import { useEffect, useId } from 'react'
import { X } from 'lucide-react'
import type { ReactNode } from 'react'
import { useTranslation } from '../i18n'

interface BottomSheetProps {
  title: string
  children: ReactNode
  onClose: () => void
  className?: string
  eyebrow?: string
  backLabel?: string
  onBack?: () => void
}

export function BottomSheet({ title, children, onClose, className = '', eyebrow, backLabel, onBack }: BottomSheetProps) {
  const { t } = useTranslation()
  const titleId = useId()
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose() }
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)
    return () => { document.body.style.overflow = previousOverflow; window.removeEventListener('keydown', onKeyDown) }
  }, [onClose])

  return <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
    <section className={`bottom-sheet ${className}`} role="dialog" aria-modal="true" aria-labelledby={titleId} onMouseDown={(event) => event.stopPropagation()}>
      <header className="sheet-header">
        <div className="sheet-header-side">{onBack && <button className="text-icon-button" type="button" onClick={onBack}>{backLabel ?? t('back')}</button>}</div>
        <div className="sheet-title">{eyebrow && <p className="dialog-eyebrow">{eyebrow}</p>}<h2 id={titleId}>{title}</h2></div>
        <button className="icon-button" type="button" onClick={onClose} aria-label={t('close')}><X size={21} /></button>
      </header>
      <div className="sheet-content">{children}</div>
    </section>
  </div>
}
