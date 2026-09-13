import { History, Palette, RotateCcw, Settings, Trophy } from 'lucide-react'

interface AppHeaderProps {
  onPalette: () => void
  onSettings: () => void
  onHistory: () => void
  onStats: () => void
  onNewGame: () => void
}

export function AppHeader({ onPalette, onSettings, onHistory, onStats, onNewGame }: AppHeaderProps) {
  return (
    <header className="app-header">
      <div className="header-action-group">
        <button className="header-icon-button" type="button" onClick={onSettings} aria-label="Ouvrir les paramètres" title="Paramètres"><Settings size={20} /></button>
        <button className="header-icon-button palette-button" type="button" onClick={onPalette} aria-label="Changer l'apparence" title="Apparence"><Palette size={20} /></button>
      </div>
      <div className="header-right-actions">
        <div className="header-action-group">
          <button className="header-icon-button" type="button" onClick={onHistory} aria-label="Voir l'historique des parties" title="Historique"><History size={20} /></button>
          <button className="header-icon-button" type="button" onClick={onStats} aria-label="Voir les statistiques des joueurs" title="Statistiques"><Trophy size={19} /></button>
        </div>
        <button className="header-icon-button new-game-button" type="button" onClick={onNewGame} aria-label="Commencer une nouvelle partie" title="Nouvelle partie"><RotateCcw size={23} /></button>
      </div>
    </header>
  )
}
