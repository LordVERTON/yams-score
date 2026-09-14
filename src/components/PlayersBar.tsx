import { Plus, Users } from 'lucide-react'
import { useTranslation } from '../i18n'

interface PlayersBarProps {
  onAdd: () => void
}

export function PlayersBar({ onAdd }: PlayersBarProps) {
  const { t } = useTranslation()
  return (
    <div className="toolbar">
      <div className="toolbar-copy"><Users size={18} aria-hidden="true" /><span>{t('players')}</span></div>
      <div className="toolbar-actions">
        <button className="secondary-button" type="button" onClick={onAdd}><Plus size={18} /> {t('add')}</button>
      </div>
    </div>
  )
}
