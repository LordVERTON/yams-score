import { useEffect, useRef, useState } from 'react'
import { AppHeader } from '../components/AppHeader'
import { ArchiveDialog } from '../components/ArchiveDialog'
import { NewGameDialog } from '../components/NewGameDialog'
import { PlayersBar } from '../components/PlayersBar'
import { ScoreModal } from '../components/ScoreModal'
import { ScoreSheet } from '../components/ScoreSheet'
import { SettingsSheet } from '../components/SettingsSheet'
import { startNewGame } from '../game/history'
import { clearScore, createPlayer, setScore } from '../game/scoring'
import type { CategoryDefinition, CategoryId, GameState, Player } from '../game/types'
import { applyAppearance } from '../theme/applyTheme'
import { DEFAULT_BACKGROUND_THEME, DEFAULT_GRID_THEME } from '../theme/themes'
import type { AppearancePreferences } from '../theme/types'
import { clearArchives, loadArchives, loadGame, loadPreferences, saveArchives, saveGame, saveNewGameSession, savePreferences } from './storage'

interface Selection { playerId: string; category: CategoryDefinition }
type Dialog = 'newGame' | 'history' | 'stats' | 'settings' | 'appearance' | null

export default function App() {
  const [game, setGame] = useState<GameState>(loadGame)
  const [archives, setArchives] = useState(loadArchives)
  const [appearance, setAppearance] = useState<AppearancePreferences>(loadPreferences)
  const [selection, setSelection] = useState<Selection | null>(null)
  const [dialog, setDialog] = useState<Dialog>(null)
  const [isStartingNewGame, setIsStartingNewGame] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const newGameGuard = useRef(false)

  useEffect(() => { saveGame(game) }, [game])
  useEffect(() => { saveArchives(archives) }, [archives])
  useEffect(() => { applyAppearance(appearance); savePreferences(appearance) }, [appearance])
  useEffect(() => {
    if (!toast) return undefined
    const timer = window.setTimeout(() => setToast(null), 1800)
    return () => window.clearTimeout(timer)
  }, [toast])

  const updatePlayers = (recipe: (players: Player[]) => Player[]) => setGame((current) => ({ ...current, players: recipe(current.players) }))
  const addPlayer = () => updatePlayers((players) => [...players, createPlayer(`Joueur ${players.length + 1}`)])
  const renamePlayer = (id: string, name: string) => updatePlayers((players) => players.map((player) => player.id === id ? { ...player, name: name.slice(0, 32) } : player))
  const deletePlayer = (id: string) => updatePlayers((players) => players.length > 1 ? players.filter((player) => player.id !== id) : players)
  const select = (player: Player, category: CategoryDefinition) => setSelection({ playerId: player.id, category })
  const resetAppearance = () => setAppearance({ version: 1, backgroundTheme: DEFAULT_BACKGROUND_THEME, gridTheme: DEFAULT_GRID_THEME })

  const confirmNewGame = () => {
    if (newGameGuard.current) return
    newGameGuard.current = true
    setIsStartingNewGame(true)
    try {
      const result = startNewGame(game, archives, new Date().toISOString())
      saveNewGameSession(result.game, result.archives)
      setArchives(result.archives)
      setGame(result.game)
      setSelection(null)
      setDialog(null)
      setToast(result.archived ? 'Partie précédente archivée' : 'Nouvelle partie créée')
    } finally {
      newGameGuard.current = false
      setIsStartingNewGame(false)
    }
  }

  const saveScore = (category: CategoryId, value: number): string | null => {
    if (!selection) return null
    try {
      updatePlayers((players) => players.map((player) => player.id === selection.playerId ? setScore(player, category, value) : player))
      setSelection(null)
      return null
    } catch (error) {
      return error instanceof Error ? error.message : 'Score invalide pour cette catégorie.'
    }
  }
  const clearSelectedScore = () => {
    if (!selection) return
    updatePlayers((players) => players.map((player) => player.id === selection.playerId ? clearScore(player, selection.category.id) : player))
    setSelection(null)
  }
  const selectedPlayer = selection ? game.players.find((player) => player.id === selection.playerId) : undefined
  const openHistoryFromSettings = () => setDialog('history')
  const eraseHistory = () => { clearArchives(); setArchives([]); setDialog(null); setToast('Historique effacé') }

  return (
    <main className="app-shell">
      <AppHeader onSettings={() => setDialog('settings')} onPalette={() => setDialog('appearance')} onHistory={() => setDialog('history')} onStats={() => setDialog('stats')} onNewGame={() => setDialog('newGame')} />
      <PlayersBar onAdd={addPlayer} />
      <ScoreSheet players={game.players} onSelect={select} onRename={renamePlayer} onDelete={deletePlayer} />
      <footer className="app-footer"><span>Les scores sont enregistrés automatiquement sur cet appareil.</span><span className="footer-dot">•</span><span>Appuyez sur une case pour jouer</span></footer>
      {toast && <div className="app-toast" role="status">{toast}</div>}
      {selection && selectedPlayer && <ScoreModal player={selectedPlayer} category={selection.category.id} label={selection.category.label} onClose={() => setSelection(null)} onSave={(value) => saveScore(selection.category.id, value)} onClear={clearSelectedScore} />}
      {dialog === 'newGame' && <NewGameDialog isSubmitting={isStartingNewGame} onCancel={() => setDialog(null)} onConfirm={confirmNewGame} />}
      {(dialog === 'history' || dialog === 'stats') && <ArchiveDialog mode={dialog} archives={archives} onClose={() => setDialog(null)} />}
      {(dialog === 'settings' || dialog === 'appearance') && <SettingsSheet appearance={appearance} initialView={dialog === 'appearance' ? 'appearance' : 'home'} onAppearanceChange={setAppearance} onResetAppearance={resetAppearance} onOpenHistory={openHistoryFromSettings} onClearHistory={eraseHistory} onClose={() => setDialog(null)} />}
    </main>
  )
}
