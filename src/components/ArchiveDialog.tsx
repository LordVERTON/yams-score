import { getPlayerStats } from '../game/history'
import type { GameArchive } from '../game/types'
import { BottomSheet } from './BottomSheet'
import { useTranslation } from '../i18n'

interface ArchiveDialogProps {
  mode: 'history' | 'stats'
  archives: GameArchive[]
  onClose: () => void
}

export function ArchiveDialog({ mode, archives, onClose }: ArchiveDialogProps) {
  const { language, t } = useTranslation()
  const isHistory = mode === 'history'
  const stats = getPlayerStats(archives)
  return (
    <BottomSheet title={isHistory ? t('history') : t('statistics')} eyebrow={isHistory ? t('historyEyebrow') : t('statsEyebrow')} onClose={onClose} className="archive-dialog">
        {isHistory ? <HistoryList archives={archives} locale={language} /> : <StatsList stats={stats} />}
    </BottomSheet>
  )
}

function HistoryList({ archives, locale }: { archives: GameArchive[]; locale: string }) {
  const { t } = useTranslation()
  if (!archives.length) return <p className="dialog-empty">{t('noArchive')}</p>
  return <div className="archive-list">{archives.map((archive) => <article className="archive-card" key={archive.id}><time dateTime={archive.archivedAt}>{new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(archive.archivedAt))}</time>{archive.players.map((player) => <div className="archive-player" key={player.id}><span>{player.rank}. {player.name}{archive.winnerIds.includes(player.id) ? ` · ${t('winner')}` : ''}</span><strong>{player.total}</strong></div>)}</article>)}</div>
}

function StatsList({ stats }: { stats: ReturnType<typeof getPlayerStats> }) {
  const { t } = useTranslation()
  if (!stats.length) return <p className="dialog-empty">{t('statsEmpty')}</p>
  return <div className="archive-list">{stats.map((player) => <article className="archive-card stats-card" key={player.id}><h3>{player.name}</h3><div><span>{t('games')}</span><strong>{player.gamesPlayed}</strong></div><div><span>{t('wins')}</span><strong>{player.wins}</strong></div><div><span>{t('average')}</span><strong>{player.averageScore}</strong></div><div><span>{t('bestScore')}</span><strong>{player.bestScore}</strong></div></article>)}</div>
}
