import React from 'react';
import { createRoot } from 'react-dom/client';
import { toPng } from 'html-to-image';
import { Language } from './types';
import { dictionaries, getAssetUrl } from './constants';
import { useMonster } from './hooks/useMonster';
import { useMonsterLibrary } from './hooks/useMonsterLibrary';
import { MonsterCard } from './components/MonsterCard';
import { MonsterLibrary } from './components/MonsterLibrary';
import { BasicInfoForm } from './components/BasicInfoForm';
import { StatsForm } from './components/StatsForm';
import { AttributesForm } from './components/AttributesForm';
import { AbilitiesForm } from './components/AbilitiesForm';
import { SpecialAttacksForm } from './components/SpecialAttacksForm';
import { SpellsForm } from './components/SpellsForm';
import './fonts.css';

function useDarkMode() {
  const [darkMode, setDarkMode] = React.useState(() => {
    const stored = localStorage.getItem('ou_dark_mode');
    if (stored !== null) return stored === 'true';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  React.useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('ou_dark_mode', String(darkMode));
  }, [darkMode]);

  return [darkMode, () => setDarkMode(prev => !prev)] as const;
}

function useFileImport(onImport: (content: string) => boolean) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  const trigger = React.useCallback(() => {
    inputRef.current?.click();
  }, []);

  const handleChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onImport(reader.result);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  }, [onImport]);

  const input = React.createElement('input', {
    ref: inputRef,
    type: 'file',
    accept: '.json',
    style: { display: 'none' },
    onChange: handleChange,
  });

  return { trigger, input };
}

interface MonsterCardMakerProps {
  initialLang?: Language;
}

export default function MonsterCardMaker({
  initialLang = "en"
}: Readonly<MonsterCardMakerProps>) {
  const [language, setLanguage] = React.useState<Language>(initialLang);
  const [darkMode, toggleDarkMode] = useDarkMode();
  const [currentMonsterId, setCurrentMonsterId] = React.useState<string | null>(() => {
    try {
      return localStorage.getItem('ou_current_monster_id') || null;
    } catch {
      return null;
    }
  });

  React.useEffect(() => {
    if (currentMonsterId) {
      localStorage.setItem('ou_current_monster_id', currentMonsterId);
    } else {
      localStorage.removeItem('ou_current_monster_id');
    }
  }, [currentMonsterId]);
  const {
    monster,
    updateMonster,
    addAbility,
    removeAbility,
    updateAbility,
    addSpecialAttack,
    removeSpecialAttack,
    updateSpecialAttack,
    addSpell,
    removeSpell,
    updateSpell,
    resetForm,
    loadMonster,
  } = useMonster();

  const {
    library,
    saveMonster: saveToLibrary,
    deleteMonster: deleteFromLibrary,
    duplicateMonster: duplicateInLibrary,
    getMonster: getFromLibrary,
    exportMonster: exportFromLibrary,
    exportAll,
    importMonster: importToLibrary,
    importAll: importAllToLibrary,
    clearAll,
  } = useMonsterLibrary();

  const dict = dictionaries[language];

  const importOneFile = useFileImport(importToLibrary);
  const importAllFile = useFileImport(importAllToLibrary);

  // Auto-save: track refs to avoid stale closures in the effect
  const currentMonsterIdRef = React.useRef(currentMonsterId);
  currentMonsterIdRef.current = currentMonsterId;
  const skipNextSave = React.useRef(true); // skip initial mount
  const isMonsterEmpty = (m: typeof monster) =>
    !m.name && !m.sizeType && m.hp === "" && m.defense === "" &&
    m.speed === "" && !m.damage && m.body === "" && m.mind === "" &&
    m.magic === "" && m.abilities.length === 0 &&
    m.specialAttacks.length === 0 && m.spells.length === 0;

  React.useEffect(() => {
    if (skipNextSave.current) {
      skipNextSave.current = false;
      return;
    }
    if (isMonsterEmpty(monster)) return;

    const id = saveToLibrary(monster, currentMonsterIdRef.current ?? undefined);
    if (!currentMonsterIdRef.current) {
      setCurrentMonsterId(id);
    }
  }, [monster, saveToLibrary]);

  const handleLoadMonster = React.useCallback((id: string) => {
    const m = getFromLibrary(id);
    if (m) {
      skipNextSave.current = true;
      loadMonster(m);
      setCurrentMonsterId(id);
    }
  }, [getFromLibrary, loadMonster]);

  const handleDeleteMonster = React.useCallback((id: string) => {
    if (!window.confirm(dict.confirmDelete)) return;
    deleteFromLibrary(id);
    if (currentMonsterId === id) {
      setCurrentMonsterId(null);
    }
  }, [deleteFromLibrary, currentMonsterId, dict.confirmDelete]);

  const handleDuplicateMonster = React.useCallback((id: string) => {
    const original = library.find(m => m.savedId === id);
    const defaultName = original?.name ? `${original.name} (copy)` : '';
    const name = window.prompt(dict.duplicatePrompt, defaultName);
    if (name === null) return;
    duplicateInLibrary(id, name);
  }, [duplicateInLibrary, library, dict.duplicatePrompt]);

  const handleClearAll = React.useCallback(() => {
    if (!window.confirm(dict.confirmClear)) return;
    clearAll();
    setCurrentMonsterId(null);
  }, [clearAll, dict.confirmClear]);

  const handleNewMonster = React.useCallback(() => {
    skipNextSave.current = true;
    resetForm();
    setCurrentMonsterId(null);
  }, [resetForm]);

  const handleReset = handleNewMonster;

  const exportPng = async (): Promise<void> => {
    const element = document.getElementById('monster-card-preview');
    if (!element) return;

    try {
      const dataUrl = await toPng(element, {
        backgroundColor: 'transparent',
        pixelRatio: 2
      });
      const link = document.createElement('a');
      link.download = `${monster.name || 'monster'}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Error exporting PNG:', error);
    }
  };

  const copyPng = async (): Promise<void> => {
    const element = document.getElementById('monster-card-preview');
    if (!element) return;

    try {
      const dataUrl = await toPng(element, {
        backgroundColor: 'transparent',
        pixelRatio: 2
      });

      const response = await fetch(dataUrl);
      const blob = await response.blob();

      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ]);
    } catch (error) {
      console.error('Error copying PNG:', error);
    }
  };

  return (
    <div className="flex gap-3 p-5 font-sans transition-colors duration-300">
      {importOneFile.input}
      {importAllFile.input}

      {/* Left side - Monster Library */}
      <MonsterLibrary
        library={library}
        currentMonsterId={currentMonsterId}
        dict={dict}
        onLoad={handleLoadMonster}
        onDelete={handleDeleteMonster}
        onDuplicate={handleDuplicateMonster}
        onExportOne={exportFromLibrary}
        onImportOne={importOneFile.trigger}
        onExportAll={exportAll}
        onImportAll={importAllFile.trigger}
        onClearAll={handleClearAll}
        onNewMonster={handleNewMonster}
      />

      {/* Middle - Form */}
      <div className="flex-1 min-w-[350px] max-w-[500px] bg-[#f5f5f5] dark:bg-gray-800 p-5 rounded-lg max-h-[90vh] overflow-y-auto transition-colors duration-300">
        {/* Header with title, dark mode toggle, and language selector */}
        <div className="flex justify-between items-center mb-5">
          <h2 className="m-0 text-gray-700 dark:text-gray-200 transition-colors">{dict.form}</h2>
          <div className="flex items-center gap-3">
            {/* Dark mode toggle */}
            <button
              onClick={toggleDarkMode}
              className="relative w-14 h-7 rounded-full bg-gray-300 dark:bg-gray-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 flex-shrink-0"
              aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              <span
                className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-md transition-transform duration-300 flex items-center justify-center ${
                  darkMode ? 'translate-x-[30px]' : 'translate-x-0.5'
                }`}
              >
                {darkMode ? (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                    <circle cx="12" cy="12" r="5"/>
                    <line x1="12" y1="1" x2="12" y2="3"/>
                    <line x1="12" y1="21" x2="12" y2="23"/>
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                    <line x1="1" y1="12" x2="3" y2="12"/>
                    <line x1="21" y1="12" x2="23" y2="12"/>
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                  </svg>
                )}
              </span>
            </button>
            {/* Language selector */}
            <div className="flex items-center gap-2">
              <label className="font-bold text-sm text-gray-700 dark:text-gray-300 transition-colors">
                {dict.language}:
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="p-[5px] text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 transition-colors"
              >
                {Object.keys(dictionaries).map((lang) => (
                  <option key={lang} value={lang}>
                    {lang === 'en' ? 'English' : lang === 'pt-BR' ? 'Português (Brasil)' : lang}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Basic Info Form */}
        <BasicInfoForm
          monster={monster}
          updateMonster={updateMonster}
          dict={dict}
        />

        {/* Stats Form */}
        <StatsForm
          monster={monster}
          updateMonster={updateMonster}
          dict={dict}
        />

        {/* Attributes Form */}
        <AttributesForm
          monster={monster}
          updateMonster={updateMonster}
          dict={dict}
        />

        {/* Abilities Toggle */}
        <div className="mt-5 mb-5">
          <div className="flex items-center gap-2 mb-3">
            <input
              id="hasAbilities"
              type="checkbox"
              checked={monster.hasAbilities}
              onChange={(e) => updateMonster({ hasAbilities: e.target.checked })}
              className="w-4 h-4 accent-blue-500"
            />
            <label htmlFor="hasAbilities" className="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors">
              {dict.hasAbilities}
            </label>
          </div>
        </div>

        {/* Abilities Form */}
        {monster.hasAbilities && (
          <AbilitiesForm
            monster={monster}
            addAbility={addAbility}
            removeAbility={removeAbility}
            updateAbility={updateAbility}
            dict={dict}
          />
        )}

        {/* Special Attacks Toggle */}
        <div className="mt-5 mb-5">
          <div className="flex items-center gap-2 mb-3">
            <input
              id="hasSpecialAttacks"
              type="checkbox"
              checked={monster.hasSpecialAttacks}
              onChange={(e) => updateMonster({ hasSpecialAttacks: e.target.checked })}
              className="w-4 h-4 accent-blue-500"
            />
            <label htmlFor="hasSpecialAttacks" className="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors">
              {dict.hasSpecialAttacks}
            </label>
          </div>
        </div>

        {/* Special Attacks Form */}
        {monster.hasSpecialAttacks && (
          <SpecialAttacksForm
            monster={monster}
            addSpecialAttack={addSpecialAttack}
            removeSpecialAttack={removeSpecialAttack}
            updateSpecialAttack={updateSpecialAttack}
            dict={dict}
          />
        )}

        {/* Spells Toggle */}
        <div className="mt-5 mb-5">
          <div className="flex items-center gap-2 mb-3">
            <input
              id="hasSpells"
              type="checkbox"
              checked={monster.hasSpells}
              onChange={(e) => updateMonster({ hasSpells: e.target.checked })}
              className="w-4 h-4 accent-blue-500"
            />
            <label htmlFor="hasSpells" className="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors">
              {dict.hasSpells}
            </label>
          </div>
        </div>

        {/* Spells Form */}
        {monster.hasSpells && (
          <SpellsForm
            monster={monster}
            addSpell={addSpell}
            removeSpell={removeSpell}
            updateSpell={updateSpell}
            dict={dict}
          />
        )}
      </div>

      {/* Right side - Preview */}
      <div className="flex-1 min-w-[350px] flex flex-col items-center bg-[#f9f9f9] dark:bg-gray-900 p-5 rounded-lg transition-colors duration-300">
        <h2 className="mt-0 mb-5 text-gray-700 dark:text-gray-200 transition-colors">{dict.preview}</h2>
        <div id='monster-card-preview' style={{ transform: 'scale(1)', transformOrigin: 'top center' }}>
          <MonsterCard monster={monster} dict={dict} />
        </div>

        {/* Action buttons */}
        <div style={{ marginTop: '30px', display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {/* Export PNG */}
          <RoundButton
            onClick={exportPng}
            title={dict.exportPng}
            bgFrom="#8B4513"
            bgTo="#A0522D"
            borderColor="#654321"
          >
            <img src={getAssetUrl("/download.svg")} alt="Download" style={{ width: '24px', height: '24px', filter: 'brightness(0) invert(1)' }} />
          </RoundButton>
          {/* Copy PNG */}
          <RoundButton
            onClick={copyPng}
            title={dict.copyPng}
            bgFrom="#556B2F"
            bgTo="#6B8E23"
            borderColor="#3E4B21"
          >
            <img src={getAssetUrl("/clipboard.svg")} alt="Copy" style={{ width: '24px', height: '24px', filter: 'brightness(0) invert(1)' }} />
          </RoundButton>
        </div>
      </div>
    </div>
  );
}

function RoundButton({
  onClick,
  title,
  bgFrom,
  bgTo,
  borderColor,
  children,
}: {
  readonly onClick: () => void;
  readonly title: string;
  readonly bgFrom: string;
  readonly bgTo: string;
  readonly borderColor: string;
  readonly children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        padding: '12px',
        color: 'white',
        border: `2px solid ${borderColor}`,
        borderRadius: '50%',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        background: `linear-gradient(135deg, ${bgFrom} 0%, ${bgTo} 100%)`,
        width: '48px',
        height: '48px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
      }}
      onMouseDown={(e) => {
        e.currentTarget.style.transform = 'translateY(1px)';
        e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)';
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.15)';
      }}
    >
      {children}
    </button>
  );
}

// For embedding in other applications
export function initEmbeddable(containerId: string, props: MonsterCardMakerProps = { initialLang: "en" }) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Container with id "${containerId}" not found`);
    return;
  }

  const root = createRoot(container);
  root.render(React.createElement(MonsterCardMaker, props));
  return root;
}

// For global access when used as a script
if (typeof window !== 'undefined') {
  (window as any).OmiosUriesCardMaker = { initEmbeddable };
}
