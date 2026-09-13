import { Pencil, Trash2 } from 'lucide-react'
import { BonusIndicator } from './BonusIndicator'
import { chanceCategories, mainCategories, upperCategories } from '../game/rules'
import { chanceTotal, total, upperTotal } from '../game/scoring'
import type { CategoryDefinition, CategoryId, Player } from '../game/types'

interface ScoreSheetProps {
  players: Player[]
  onSelect: (player: Player, category: CategoryDefinition) => void
  onRename: (id: string, name: string) => void
  onDelete: (id: string) => void
}

export function ScoreSheet({ players, onSelect, onRename, onDelete }: ScoreSheetProps) {
  return (
    <div className="sheet-scroll" aria-label="Feuille de score">
      <table className="score-sheet">
        <thead>
          <tr>
            <th scope="col" className="category-head">Catégories</th>
            {players.map((player) => <PlayerHeader key={player.id} player={player} allowDelete={players.length > 1} onRename={onRename} onDelete={onDelete} />)}
          </tr>
        </thead>
        <tbody>
          <SectionLabel label="SECTION I" count={players.length} />
          {upperCategories.map((category) => <ScoreRow key={category.id} category={category} players={players} onSelect={onSelect} />)}
          <BonusRow players={players} />
          <ComputedRow label="Total I" count={players.length} players={players} getScore={(player) => upperTotal(player.scores)} strong />
          <SectionLabel label="SECTION II" count={players.length} />
          {chanceCategories.map((category) => <ScoreRow key={category.id} category={category} players={players} onSelect={onSelect} />)}
          <ComputedRow label="Total II" count={players.length} players={players} getScore={(player) => chanceTotal(player.scores)} strong />
          <SectionLabel label="SECTION PRINCIPALE" count={players.length} />
          {mainCategories.map((category) => <ScoreRow key={category.id} category={category} players={players} onSelect={onSelect} />)}
          <SectionLabel label="TOTAL" count={players.length} />
          <ComputedRow label="Total" count={players.length} players={players} getScore={(player) => total(player.scores)} strong final />
        </tbody>
      </table>
    </div>
  )
}

function PlayerHeader({ player, allowDelete, onRename, onDelete }: { player: Player; allowDelete: boolean; onRename: (id: string, name: string) => void; onDelete: (id: string) => void }) {
  const rename = () => {
    const result = window.prompt('Nom du joueur', player.name)
    if (result?.trim()) onRename(player.id, result.trim())
  }
  const remove = () => {
    if (window.confirm(`Supprimer ${player.name} et ses scores ?`)) onDelete(player.id)
  }
  return <th scope="col" className="player-head"><span>{player.name}</span><div className="player-actions"><button type="button" aria-label={`Renommer ${player.name}`} onClick={rename}><Pencil size={14} /></button>{allowDelete && <button type="button" aria-label={`Supprimer ${player.name}`} onClick={remove}><Trash2 size={14} /></button>}</div></th>
}

function SectionLabel({ label, count }: { label: string; count: number }) {
  return <tr className="section-row"><th scope="row">{label}</th>{Array.from({ length: count }, (_, index) => <td key={index} />)}</tr>
}

function ScoreRow({ category, players, onSelect }: { category: CategoryDefinition; players: Player[]; onSelect: (player: Player, category: CategoryDefinition) => void }) {
  return <tr><th scope="row">{category.label}</th>{players.map((player) => {
    const value = player.scores[category.id as CategoryId]
    const filled = value !== undefined && value !== null
    const unavailable = category.id === 'yamsBonus' && !filled && player.scores.yams !== 50
    return <td key={player.id}><button type="button" className={filled ? `score-cell ${value === 0 ? 'crossed' : ''}` : 'score-cell empty'} disabled={unavailable} onClick={() => onSelect(player, category)} aria-label={`${category.label}, ${player.name}${filled ? ` : ${value}` : unavailable ? ', indisponible sans Yams' : ', saisir'}`}>{filled ? value : ''}</button></td>
  })}</tr>
}

function BonusRow({ players }: { players: Player[] }) {
  return <tr className="computed-row bonus-row"><th scope="row">Bonus<small>35 pts dès 63</small></th>{players.map((player) => <td key={player.id}><BonusIndicator scores={player.scores} /></td>)}</tr>
}

function ComputedRow({ label, count, players, getScore, hint, strong, final }: { label: string; count: number; players: Player[]; getScore: (player: Player) => number; hint?: string; strong?: boolean; final?: boolean }) {
  return <tr className={`${strong ? 'computed-row strong-row' : 'computed-row'} ${final ? 'final-row' : ''}`}><th scope="row">{label}{hint && <small>{hint}</small>}</th>{players.slice(0, count).map((player) => <td key={player.id}>{getScore(player)}</td>)}</tr>
}
