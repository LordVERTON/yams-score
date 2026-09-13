import { X } from 'lucide-react'
import { getPlayerStats } from '../game/history'
import type { GameArchive } from '../game/types'

interface ArchiveDialogProps {
  mode: 'history' | 'stats'
  archives: GameArchive[]
  onClose: () => void
}

export function ArchiveDialog({ mode, archives, onClose }: ArchiveDialogProps) {
  const isHistory = mode === 'history'
  const stats = getPlayerStats(archives)
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section className="app-dialog archive-dialog" role="dialog" aria-modal="true" aria-labelledby="archive-title" onMouseDown={(event) => event.stopPropagation()}>
        <header className="dialog-header"><div><p className="dialog-eyebrow">{isHistory ? 'Parties terminées' : 'Résultats cumulés'}</p><h2 id="archive-title">{isHistory ? 'Historique' : 'Statistiques'}</h2></div><button className="icon-button" type="button" onClick={onClose} aria-label="Fermer"><X size={20} /></button></header>
        {isHistory ? <HistoryList archives={archives} /> : <StatsList stats={stats} />}
      </section>
    </div>
  )
}

function HistoryList({ archives }: { archives: GameArchive[] }) {
  if (!archives.length) return <p className="dialog-empty">Aucune partie archivée.</p>
  return <div className="archive-list">{archives.map((archive) => <article className="archive-card" key={archive.id}><time dateTime={archive.archivedAt}>{new Intl.DateTimeFormat('fr-CH', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(archive.archivedAt))}</time>{archive.players.map((player) => <div className="archive-player" key={player.id}><span>{player.rank}. {player.name}{archive.winnerIds.includes(player.id) ? ' · Gagnant' : ''}</span><strong>{player.total}</strong></div>)}</article>)}</div>
}

function StatsList({ stats }: { stats: ReturnType<typeof getPlayerStats> }) {
  if (!stats.length) return <p className="dialog-empty">Les statistiques apparaîtront après la première partie archivée.</p>
  return <div className="archive-list">{stats.map((player) => <article className="archive-card stats-card" key={player.id}><h3>{player.name}</h3><div><span>Parties</span><strong>{player.gamesPlayed}</strong></div><div><span>Victoires</span><strong>{player.wins}</strong></div><div><span>Moyenne</span><strong>{player.averageScore}</strong></div><div><span>Meilleur score</span><strong>{player.bestScore}</strong></div></article>)}</div>
}
