import { Crown, Pencil, Trash2 } from 'lucide-react'
import { BonusIndicator } from './BonusIndicator'
import { chanceCategories, mainCategories, upperCategories } from '../game/rules'
import { chanceTotal, total, upperTotal } from '../game/scoring'
import type { CategoryDefinition, CategoryId, Player } from '../game/types'
import { categoryText, useTranslation } from '../i18n'

interface ScoreSheetProps {
  players: Player[]
  onSelect: (player: Player, category: CategoryDefinition) => void
  onRename: (id: string, name: string) => void
  onDelete: (id: string) => void
}

export function ScoreSheet({ players, onSelect, onRename, onDelete }: ScoreSheetProps) {
  const { t } = useTranslation()
  const totals = players.map((player) => ({ id: player.id, value: total(player.scores) }))
  const highestTotal = Math.max(...totals.map(({ value }) => value))
  const leaders = totals.filter(({ value }) => value === highestTotal)
  const leaderId = leaders.length === 1 ? leaders[0].id : undefined
  return (
    <div className="sheet-scroll" aria-label={t('scoreSheet')}>
      <table className="score-sheet">
        <thead>
          <tr>
            <th scope="col" className="category-head" aria-label={t('categories')} />
            {players.map((player) => <PlayerHeader key={player.id} player={player} allowDelete={players.length > 1} onRename={onRename} onDelete={onDelete} />)}
          </tr>
        </thead>
        <tbody>
          <SectionLabel label={t('sectionOne')} count={players.length} />
          {upperCategories.map((category) => <ScoreRow key={category.id} category={category} players={players} onSelect={onSelect} />)}
          <BonusRow players={players} />
          <ComputedRow label={`${t('total')} I`} count={players.length} players={players} getScore={(player) => upperTotal(player.scores)} strong />
          <SectionLabel label={t('sectionTwo')} count={players.length} />
          {chanceCategories.map((category) => <ScoreRow key={category.id} category={category} players={players} onSelect={onSelect} />)}
          <ComputedRow label={`${t('total')} II`} count={players.length} players={players} getScore={(player) => chanceTotal(player.scores)} strong />
          <SectionLabel label={t('mainSection')} count={players.length} />
          {mainCategories.map((category) => <ScoreRow key={category.id} category={category} players={players} onSelect={onSelect} />)}
          <SectionLabel label={t('total').toUpperCase()} count={players.length} />
          <ComputedRow label={t('total')} count={players.length} players={players} getScore={(player) => total(player.scores)} leaderId={leaderId} strong final />
        </tbody>
      </table>
    </div>
  )
}

function PlayerHeader({ player, allowDelete, onRename, onDelete }: { player: Player; allowDelete: boolean; onRename: (id: string, name: string) => void; onDelete: (id: string) => void }) {
  const { t } = useTranslation()
  const rename = () => {
    const result = window.prompt(t('renamePlayer'), player.name)
    if (result?.trim()) onRename(player.id, result.trim())
  }
  const remove = () => {
    if (window.confirm(t('deletePlayer', { name: player.name }))) onDelete(player.id)
  }
  return <th scope="col" className="player-head"><span>{player.name}</span><div className="player-actions"><button type="button" aria-label={t('rename', { name: player.name })} onClick={rename}><Pencil size={14} /></button>{allowDelete && <button type="button" aria-label={t('delete', { name: player.name })} onClick={remove}><Trash2 size={14} /></button>}</div></th>
}

function SectionLabel({ label, count }: { label: string; count: number }) {
  return <tr className="section-row"><th scope="row">{label}</th>{Array.from({ length: count }, (_, index) => <td key={index} />)}</tr>
}

function ScoreRow({ category, players, onSelect }: { category: CategoryDefinition; players: Player[]; onSelect: (player: Player, category: CategoryDefinition) => void }) {
  const { language, t } = useTranslation()
  const label = categoryText(language, category.id).label
  return <tr><th scope="row">{label}</th>{players.map((player) => {
    const value = player.scores[category.id as CategoryId]
    const filled = value !== undefined && value !== null
    const unavailable = category.id === 'yamsBonus' && !filled && player.scores.yams !== 50
    return <td key={player.id}><button type="button" className={filled ? `score-cell ${value === 0 ? 'crossed' : ''}` : 'score-cell empty'} disabled={unavailable} onClick={() => onSelect(player, category)} aria-label={`${label}, ${player.name}${filled ? ` : ${value}` : unavailable ? `, ${t('unavailableWithoutYams')}` : `, ${t('enterScore')}`}`}>{filled ? value : ''}</button></td>
  })}</tr>
}

function BonusRow({ players }: { players: Player[] }) {
  const { t } = useTranslation()
  return <tr className="computed-row bonus-row"><th scope="row">{t('bonus')}<small>{t('bonusHint')}</small></th>{players.map((player) => <td key={player.id}><BonusIndicator scores={player.scores} /></td>)}</tr>
}

function ComputedRow({ label, count, players, getScore, hint, strong, final, leaderId }: { label: string; count: number; players: Player[]; getScore: (player: Player) => number; hint?: string; strong?: boolean; final?: boolean; leaderId?: string }) {
  return <tr className={`${strong ? 'computed-row strong-row' : 'computed-row'} ${final ? 'final-row' : ''}`}><th scope="row">{label}{hint && <small>{hint}</small>}</th>{players.slice(0, count).map((player) => {
    const score = getScore(player)
    const isLeader = final && player.id === leaderId
    return <td key={player.id} className={isLeader ? 'leading-total' : undefined}>{isLeader ? <span className="total-score"><Crown className="leader-crown" size={18} aria-hidden="true" /><span>{score}</span></span> : score}</td>
  })}</tr>
}
