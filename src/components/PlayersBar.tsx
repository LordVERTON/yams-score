import { Plus, Users } from 'lucide-react'

interface PlayersBarProps {
  onAdd: () => void
}

export function PlayersBar({ onAdd }: PlayersBarProps) {
  return (
    <div className="toolbar">
      <div className="toolbar-copy"><Users size={18} aria-hidden="true" /><span>Joueurs</span></div>
      <div className="toolbar-actions">
        <button className="secondary-button" type="button" onClick={onAdd}><Plus size={18} /> Ajouter</button>
      </div>
    </div>
  )
}
