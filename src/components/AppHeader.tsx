import { History, Palette, RotateCcw, Settings, Trophy } from 'lucide-react'
import { useTranslation } from '../i18n'

interface AppHeaderProps {
  onPalette: () => void
  onSettings: () => void
  onHistory: () => void
  onStats: () => void
  onNewGame: () => void
}

export function AppHeader({ onPalette, onSettings, onHistory, onStats, onNewGame }: AppHeaderProps) {
  const { t } = useTranslation()
  return (
    <header className="app-header">
      <div className="header-action-group">
        <button className="header-icon-button" type="button" onClick={onSettings} aria-label={t('openSettings')} title={t('settings')}><Settings size={20} /></button>
        <button className="header-icon-button palette-button" type="button" onClick={onPalette} aria-label={t('changeAppearance')} title={t('appearance')}><Palette size={20} /></button>
      </div>
      <div className="header-right-actions">
        <div className="header-action-group">
          <button className="header-icon-button" type="button" onClick={onHistory} aria-label={t('viewHistory')} title={t('history')}><History size={20} /></button>
          <button className="header-icon-button" type="button" onClick={onStats} aria-label={t('viewStats')} title={t('statistics')}><Trophy size={19} /></button>
        </div>
        <button className="header-icon-button new-game-button" type="button" onClick={onNewGame} aria-label={t('startGame')} title={t('newGame')}><RotateCcw size={23} /></button>
      </div>
    </header>
  )
}
