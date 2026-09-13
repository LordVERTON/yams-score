import { ChartNoAxesColumnIncreasing, History, Palette, RotateCcw } from 'lucide-react'

interface AppHeaderProps {
  onPalette: () => void
  onHistory: () => void
  onStats: () => void
  onNewGame: () => void
}

export function AppHeader({ onPalette, onHistory, onStats, onNewGame }: AppHeaderProps) {
  return (
    <header className="app-header">
      <button className="header-icon-button palette-button" type="button" onClick={onPalette} aria-label="Changer la couleur de la grille" title="Changer la couleur de la grille"><Palette size={21} /></button>
      <div className="header-right-actions">
        <div className="header-action-group">
          <button className="header-icon-button" type="button" onClick={onHistory} aria-label="Voir l'historique des parties" title="Historique"><History size={20} /></button>
          <button className="header-icon-button" type="button" onClick={onStats} aria-label="Voir les statistiques des joueurs" title="Statistiques"><ChartNoAxesColumnIncreasing size={20} /></button>
        </div>
        <button className="header-icon-button new-game-button" type="button" onClick={onNewGame} aria-label="Commencer une nouvelle partie" title="Nouvelle partie"><RotateCcw size={23} /></button>
      </div>
    </header>
  )
}
