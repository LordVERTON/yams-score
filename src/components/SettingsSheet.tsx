import { Archive, ChevronRight, CircleHelp, Palette, RotateCcw, Trash2 } from 'lucide-react'
import { useState } from 'react'
import type { ReactNode } from 'react'
import { backgroundThemes, gridThemes } from '../theme/themes'
import type { AppearancePreferences } from '../theme/types'
import { BottomSheet } from './BottomSheet'
import { chanceCategories, mainCategories, upperCategories } from '../game/rules'

type SettingsView = 'home' | 'appearance' | 'rules' | 'clearHistory'

interface SettingsSheetProps {
  appearance: AppearancePreferences
  onClose: () => void
  onAppearanceChange: (appearance: AppearancePreferences) => void
  onResetAppearance: () => void
  onOpenHistory: () => void
  onClearHistory: () => void
  initialView?: 'home' | 'appearance'
}

export function SettingsSheet(props: SettingsSheetProps) {
  const [view, setView] = useState<SettingsView>(props.initialView ?? 'home')
  const title = view === 'appearance' ? 'Apparence' : view === 'rules' ? "Règles du Yam's" : view === 'clearHistory' ? 'Effacer l’historique' : 'Paramètres'
  return <BottomSheet title={title} onClose={props.onClose} onBack={view === 'home' ? undefined : () => setView('home')} className="settings-sheet">
    {view === 'home' && <SettingsHome onAppearance={() => setView('appearance')} onRules={() => setView('rules')} onHistory={props.onOpenHistory} onReset={props.onResetAppearance} onClearHistory={() => setView('clearHistory')} />}
    {view === 'appearance' && <AppearancePicker appearance={props.appearance} onChange={props.onAppearanceChange} />}
    {view === 'rules' && <RulesView />}
    {view === 'clearHistory' && <ClearHistory onCancel={() => setView('home')} onConfirm={props.onClearHistory} />}
  </BottomSheet>
}

export function AppearancePicker({ appearance, onChange }: { appearance: AppearancePreferences; onChange: (appearance: AppearancePreferences) => void }) {
  return <div className="appearance-picker">
    <p className="sheet-intro">Le fond et les accents de la grille sont indépendants.</p>
    <ThemeOptions title="Couleur de la grille" options={gridThemes} selected={appearance.gridTheme} onSelect={(gridTheme) => onChange({ ...appearance, gridTheme })} />
    <ThemeOptions title="Thème de fond" options={backgroundThemes} selected={appearance.backgroundTheme} onSelect={(backgroundTheme) => onChange({ ...appearance, backgroundTheme })} />
  </div>
}

function ThemeOptions<T extends string>({ title, options, selected, onSelect }: { title: string; options: readonly { id: T; label: string; preview: string }[]; selected: T; onSelect: (id: T) => void }) {
  return <section className="appearance-section"><h3>{title}</h3><div className="theme-options">{options.map((option) => <button type="button" className={`theme-option ${selected === option.id ? 'selected' : ''}`} key={option.id} onClick={() => onSelect(option.id)} aria-pressed={selected === option.id}><span className="theme-swatch" style={{ background: option.preview }} /><span>{option.label}</span></button>)}</div></section>
}

function SettingsHome({ onAppearance, onRules, onHistory, onReset, onClearHistory }: { onAppearance: () => void; onRules: () => void; onHistory: () => void; onReset: () => void; onClearHistory: () => void }) {
  return <div className="settings-home">
    <SettingsSection title="Apparence"><SettingsRow icon={<Palette size={19} />} label="Apparence" detail="Thème de fond et couleur de la grille" onClick={onAppearance} /></SettingsSection>
    <SettingsSection title="Jeu"><SettingsRow icon={<CircleHelp size={19} />} label="Règles du Yam's" onClick={onRules} /></SettingsSection>
    <SettingsSection title="Données"><SettingsRow icon={<Archive size={19} />} label="Historique" onClick={onHistory} /><SettingsRow icon={<Trash2 size={19} />} label="Effacer l’historique" danger onClick={onClearHistory} /><button className="settings-reset" type="button" onClick={onReset}><RotateCcw size={18} />Réinitialiser l’apparence</button></SettingsSection>
    <SettingsSection title="Application"><div className="settings-version"><span>Version de l’application</span><strong>1.0.0</strong></div></SettingsSection>
  </div>
}

function SettingsSection({ title, children }: { title: string; children: ReactNode }) { return <section className="settings-section"><h3>{title}</h3><div className="settings-card">{children}</div></section> }
function SettingsRow({ icon, label, detail, danger, onClick }: { icon: ReactNode; label: string; detail?: string; danger?: boolean; onClick: () => void }) { return <button type="button" className={`settings-row ${danger ? 'danger' : ''}`} onClick={onClick}><span className="settings-row-icon">{icon}</span><span className="settings-row-copy"><strong>{label}</strong>{detail && <small>{detail}</small>}</span><ChevronRight size={18} /></button> }

function ClearHistory({ onCancel, onConfirm }: { onCancel: () => void; onConfirm: () => void }) { return <div className="confirm-content"><p>Effacer tout l’historique ?</p><p className="sheet-intro">Les statistiques basées sur les anciennes parties seront également supprimées.</p><div className="dialog-actions"><button className="dialog-cancel" type="button" onClick={onCancel}>Annuler</button><button className="dialog-danger" type="button" onClick={onConfirm}>Effacer</button></div></div> }

function RulesView() {
  return <div className="rules-view"><p className="sheet-intro">Les scores proposés et validés dans la partie suivent exactement ces règles.</p><RuleSection title="Section I" categories={upperCategories} /><section className="rules-section"><h3>Bonus section I</h3><article className="rule-card"><strong>63 points donnent +35.</strong><p>La référence est de trois dés par valeur : 3, 6, 9, 12, 15 et 18. La flèche du Bonus est verte dès un delta de 0, orange de -1 à -5, rouge à -6 ou moins. Avant la fin, elle affiche les points restant pour atteindre 63.</p></article></section><RuleSection title="Combinaisons" categories={mainCategories} /><RuleSection title="Chances" categories={chanceCategories} /><section className="rules-section"><h3>Règles supplémentaires</h3><article className="rule-card"><strong>Raturer</strong><p>Une rature vaut 0 : la catégorie est jouée.</p></article><article className="rule-card"><strong>Case vide</strong><p>Une case vide vaut null : la catégorie n’est pas jouée.</p></article></section></div>
}
function RuleSection({ title, categories }: { title: string; categories: readonly { id: string; label: string; description: string; scoreSummary: string }[] }) { return <section className="rules-section"><h3>{title}</h3><div className="rules-cards">{categories.map((category) => <article className="rule-card" key={category.id}><strong>{category.label}</strong><p>{category.description}</p><small>{category.scoreSummary}</small></article>)}</div></section> }
