/*
Install deps:
npm i html-to-image

If building embeddable bundle, expose init in window and output to dist/omios-uries-card-maker.js. Example Vite config snippet:

// vite.config.ts - library mode
export default defineConfig({
  build: {
    lib: { entry: 'src/MonsterCardMaker.tsx', name: 'OmiosUriesCardMaker', fileName: () => 'omios-uries-card-maker.js', formats: ['iife'] },
    rollupOptions: { output: { globals: { react: 'React', 'react-dom': 'ReactDOM' } } }
  }
})

Or create a tiny src/index-embed.ts that import './MonsterCardMaker' and re-exports initEmbeddable, then point Vite's lib.entry to it.
*/

import React, { useState, useEffect, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import { toPng } from 'html-to-image';
import type { Monster, Ability, SpecialAttack, Spell, Language, Dictionary } from './types';
import './fonts.css';

const dictionaries = {
  "en": {
    title: "Monster Card Maker",
    preview: "Preview",
    form: "Monster Data",
    name: "Name",
    sizeType: "Size / Type",
    hp: "HP",
    defense: "Defense",
    speed: "Speed",
    damage: "Damage",
    body: "Body",
    mind: "Mind",
    magic: "Magic",
    spellName: "Spell name",
    spellDesc: "Description",
    hasAbilities: "Has abilities",
    hasSpecialAttacks: "Has special attacks",
    hasSpells: "Has spells",
    language: "Language",
    exportPng: "Export PNG",
    copyPng: "Copy PNG",
    reset: "Reset",
    stats: "Stats",
    abilityName: "Ability name",
    abilityDesc: "Ability description",
    specialAttackName: "Special attack name",
    specialAttackDesc: "Special attack description",
    addAbility: "Add ability",
    addSpecialAttack: "Add special attack",
    addSpell: "Add spell",
    abilities: "Abilities",
    specialAttacks: "Special Attacks",
    spells: "Spells",
    cardHeaders: {
      abilities: "Abilities",
      specialAttacks: "Special Attacks",
      spells: "Spells"
    }
  },
  "pt-BR": {
    title: "Criador de Cartas de Monstro",
    preview: "Pré-visualização",
    form: "Dados do Monstro",
    name: "Nome",
    sizeType: "Porte / Tipo",
    hp: "PV",
    defense: "Defesa",
    speed: "Velocidade",
    damage: "Dano",
    body: "Corpo",
    mind: "Mente",
    magic: "Magia",
    spellName: "Nome da magia",
    spellDesc: "Descrição",
    hasAbilities: "Tem habilidades",
    hasSpecialAttacks: "Tem ataques especiais",
    hasSpells: "Tem magias",
    language: "Idioma",
    exportPng: "Exportar PNG",
    copyPng: "Copiar PNG",
    reset: "Resetar",
    stats: "Atributos",
    abilityName: "Nome da habilidade",
    abilityDesc: "Descrição da habilidade",
    specialAttackName: "Nome do ataque especial",
    specialAttackDesc: "Descrição do ataque especial",
    addAbility: "Adicionar habilidade",
    addSpecialAttack: "Adicionar ataque especial",
    addSpell: "Adicionar magia",
    abilities: "Habilidades",
    specialAttacks: "Ataques Especiais",
    spells: "Magias",
    cardHeaders: {
      abilities: "Habilidades",
      specialAttacks: "Ataques Especiais",
      spells: "Magias"
    }
  }
} as const satisfies Record<Language, Dictionary>;

const defaultMonster: Monster = {
  name: "",
  sizeType: "",
  hp: "",
  defense: "",
  speed: "",
  damage: "",
  body: "",
  mind: "",
  magic: "",
  abilities: [],
  specialAttacks: [],
  spells: [],
  hasAbilities: false,
  hasSpecialAttacks: false,
  hasSpells: false
};

interface MonsterCardMakerProps {
  initialLang?: Language;
}

// Separate MonsterCard component for cleaner code
interface MonsterCardProps {
  readonly monster: Monster;
  readonly dict: Dictionary;
  readonly onHeightChange?: (height: number) => void;
}

// Background component: renders seamless scroll background
function CardBackground({ height, contentHeight }: { readonly height: number, readonly contentHeight: number }) {
  // Adjusted values for smaller card size (360px max-width)
  // More aggressive middle image creation to prevent text overflow
  
  const baseScrollHeight = 250; // Further reduced to trigger middle images sooner
  const middleImageNaturalHeight = 100; // Smaller middle sections for tighter control
  
  // Create middle images more aggressively to prevent text overflow
  const extraSpaceNeeded = Math.max(0, height - baseScrollHeight);
  const middleImagesNeeded = extraSpaceNeeded > 0 ? Math.ceil(extraSpaceNeeded / middleImageNaturalHeight) : 0;
  
  console.log('CardBackground Heights:', {
    containerHeight: height,
    baseScrollHeight,
    extraSpaceNeeded,
    middleImageNaturalHeight,
    middleImagesNeeded,
    estimatedTotalHeight: baseScrollHeight + (middleImagesNeeded * middleImageNaturalHeight)
  });
  
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1, display: 'flex', flexDirection: 'column'}}>
      {/* Top image - natural aspect ratio at full width */}
      <img 
        src="/top.png" 
        alt="" 
        style={{ 
          width: '100%', 
          height: 'auto', 
          objectFit: 'contain', 
          display: 'block',
          flexShrink: 0
        }} 
      />
      
      {/* Middle images - repeat as needed */}
      {Array.from({ length: middleImagesNeeded }, (_, index) => (
        <img 
          key={index}
          src="/middle.png" 
          alt="" 
          style={{ 
            width: '100%', 
            height: 'auto', 
            objectFit: 'contain',
            display: 'block',
            flexShrink: 0,
          }} 
        />
      ))}
      
      {/* Bottom image - natural aspect ratio at full width */}
      <img 
        src="/bottom.png" 
        alt="" 
        style={{ 
          width: '100%', 
          height: 'auto', 
          objectFit: 'contain', 
          display: 'block',
          flexShrink: 0
        }} 
      />
    </div>
  );
}

// MonsterCard component (cleaned)
function MonsterCard({ monster, dict, onHeightChange }: MonsterCardProps) {
  const hasAbilities = monster.hasAbilities && monster.abilities.length > 0;
  const hasSpecialAttacks = monster.hasSpecialAttacks && monster.specialAttacks.length > 0;
  const hasSpells = monster.hasSpells && monster.spells.length > 0;

  // Text container ref to measure actual content height
  const textRef = React.useRef<HTMLDivElement>(null);
  const [textHeight, setTextHeight] = React.useState<number>(0);
  
  React.useEffect(() => {
    if (textRef.current) {
      // Use a small delay to ensure content is fully rendered
      const timer = setTimeout(() => {
        const measuredHeight = textRef.current!.scrollHeight;
        setTextHeight(measuredHeight);
        console.log('Measured text content height:', measuredHeight);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [monster, dict, hasAbilities, hasSpecialAttacks, hasSpells]);

  // Image heights - these should match CardBackground values exactly
  const topImageHeight = 120;
  const bottomImageHeight = 80;
  
  // Padding calculations - text should start inside top image and end inside bottom image
  const topPadding = 25; // reduced padding for top image to accommodate smaller card width
  const bottomPadding = 50; // Further reduced to prevent overflow into bottom section
  
  // Total height = measured content + padding for positioning within images
  // Adjusted for smaller card size - use more conservative minimums
  const calculatedMinHeight = 120; // Further reduced for smaller cards
  const effectiveTextHeight = Math.max(textHeight, calculatedMinHeight);
  const totalHeight = Math.max(350, effectiveTextHeight + topPadding + bottomPadding + 20); // Reduced minimums for smaller card
  
  // Report height changes to parent
  React.useEffect(() => {
    if (onHeightChange && totalHeight > 0) {
      onHeightChange(totalHeight);
    }
  }, [onHeightChange, totalHeight]);
  
  console.log('Final Height Calculation:', {
    rawTextHeight: textHeight,
    effectiveTextHeight,
    topPadding,
    bottomPadding,
    totalHeight,
    topImageHeight,
    bottomImageHeight
  });

  return (
    <div data-card className="w-full mx-auto" style={{ borderRadius: 16, boxShadow: '0 2px 16px #0002', overflow: 'visible', background: 'none', padding: 0, margin: 0, width: '100%', maxWidth: 360, position: 'relative', height: 'auto', minHeight: totalHeight+30}}>
      
      {/* Background Container - seamless scroll */}
      <CardBackground height={totalHeight} contentHeight={textHeight} />
      
      {/* Text Container - overlays background */}
      <div 
        style={{ 
          position: 'absolute', 
          top: 0, // Start at 0 instead of topPadding
          left: 0,
          zIndex: 2, 
          width: '100%', 
          height: '100%', // Use full height instead of calculated height
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'flex-start',
          paddingTop: topPadding, // Apply padding as internal padding instead
          paddingBottom: bottomPadding, // Apply padding as internal padding instead
          boxSizing: 'border-box' // Include padding in height calculation
        }}
      >
        <div 
          ref={textRef}
          style={{ width: '65%', textAlign: 'left', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}
        >
          
          {/* Title and basic info - starts in top image */}
          <div style={{ fontFamily: 'Sudbury, serif', color: '#000000', fontWeight: 700, fontSize: 22.5, textAlign: 'center', letterSpacing: '1px', marginBottom: 0, fontVariant: 'small-caps' }}>{monster.name || 'Xaracol'}</div>
          <div style={{ fontFamily: 'QueensPark, serif', fontStyle: 'italic', color: '#666666', fontSize: 11.7, textAlign: 'center', marginTop: '2px' }}>{monster.sizeType || 'Large Animal'}</div>
          <div style={{ display: 'flex', justifyContent: 'center', margin: '6px auto 0 auto' }}>
            <img src="/linebreak.png" alt="" style={{ width: '100%', height: 'auto', opacity: 0.7 }} />
          </div>
          
          {/* Stats block */}
          <div style={{ fontFamily: 'Sudbury, serif', marginTop: '4px', marginBottom: 0, width: '100%', textAlign: 'left' }}>
            <div style={{ fontWeight: 400, fontSize: 11.7, marginBottom: 2 }}><span style={{ color: '#b33a1a' }}><strong>{dict.hp}:</strong></span> <span style={{ color: '#000000' }}>{monster.hp || '22'}</span></div>
            <div style={{ fontWeight: 400, fontSize: 11.7, marginBottom: 2 }}><span style={{ color: '#b33a1a' }}><strong>{dict.defense}:</strong></span> <span style={{ color: '#000000' }}>{monster.defense || '6'}</span></div>
            <div style={{ fontWeight: 400, fontSize: 11.7, marginBottom: 2 }}><span style={{ color: '#b33a1a' }}><strong>{dict.speed}:</strong></span> <span style={{ color: '#000000' }}>{monster.speed || '5'}</span></div>
            <div style={{ fontWeight: 400, fontSize: 11.7 }}><span style={{ color: '#b33a1a' }}><strong>{dict.damage}:</strong></span> <span style={{ color: '#000000' }}>{monster.damage || '1d5 (Slimy Punting)'}</span></div>
          </div>
          
          {/* Attributes */}
          <div style={{ display: 'flex', justifyContent: 'center', margin: '6px 0 4px 0' }}>
            <img src="/linebreak.png" alt="" style={{ width: '100%', height: 'auto', opacity: 0.7 }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontFamily: 'Sudbury, serif', textAlign: 'center' }}>
            <div style={{ flex: 1 }}>
              <div style={{ color: '#b33a1a', fontWeight: 700, fontSize: 12.7, textTransform: 'uppercase', letterSpacing: '1px' }}>{dict.body}</div>
              <div style={{ color: '#000000', fontWeight: 400, fontSize: 14.9, fontVariant: 'small-caps' }}>{monster.body || '2'}</div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ color: '#b33a1a', fontWeight: 700, fontSize: 12.7, textTransform: 'uppercase', letterSpacing: '1px' }}>{dict.mind}</div>
              <div style={{ color: '#000000', fontWeight: 400, fontSize: 14.9, fontVariant: 'small-caps' }}>{monster.mind || '4'}</div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ color: '#b33a1a', fontWeight: 700, fontSize: 12.7, textTransform: 'uppercase', letterSpacing: '1px' }}>{dict.magic}</div>
              <div style={{ color: '#000000', fontWeight: 400, fontSize: 14.9, fontVariant: 'small-caps' }}>{monster.magic || '3'}</div>
            </div>
          </div>
          
          {/* Dynamic content - flows through middle into bottom */}
          {(hasAbilities || hasSpecialAttacks || hasSpells) && (
            <div style={{ display: 'flex', justifyContent: 'center', margin: '6px 0 4px 0' }}>
              <img src="/linebreak.png" alt="" style={{ width: '100%', height: 'auto', opacity: 0.7 }} />
            </div>
          )}

          {/* Abilities */}
          {hasAbilities && (
            <>
              <h3 style={{ color: '#b33a1a', fontFamily: 'Sudbury, serif', fontWeight: 700, fontSize: 10, textTransform: 'uppercase', marginBottom: 1, letterSpacing: '1px', textAlign: 'left' }}>{dict.cardHeaders.abilities}</h3>
              <div style={{ fontFamily: 'Sudbury, serif', fontSize: 10, textAlign: 'left' }}>
                {monster.abilities.filter(ability => ability.name).map((ability) => (
                  <div key={ability.id} style={{ fontSize: 10, marginBottom: 2 }}>
                    <span style={{ color: '#000000', fontWeight: 700, fontStyle: 'italic' }}>{ability.name}.</span>
                    {ability.desc && <span style={{ color: '#666666', marginLeft: 4, fontWeight: 400 }}>{ability.desc}</span>}
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Special Attacks */}
          {hasSpecialAttacks && (
            <>
              {hasAbilities && (
                <div style={{ display: 'flex', justifyContent: 'center', margin: '6px 0 4px 0' }}>
                  <img src="/linebreak.png" alt="" style={{ width: '100%', height: 'auto', opacity: 0.7 }} />
                </div>
              )}
              <h3 style={{ color: '#b33a1a', fontFamily: 'Sudbury, serif', fontWeight: 700, fontSize: 10, textTransform: 'uppercase', marginBottom: 1, letterSpacing: '1px', textAlign: 'left' }}>{dict.cardHeaders.specialAttacks}</h3>
              <div style={{ fontFamily: 'Sudbury, serif', fontSize: 10, textAlign: 'left' }}>
                {monster.specialAttacks.filter(specialAttack => specialAttack.name).map((specialAttack) => (
                  <div key={specialAttack.id} style={{ fontSize: 10, marginBottom: 2 }}>
                    <span style={{ color: '#000000', fontWeight: 700, fontStyle: 'italic' }}>{specialAttack.name}.</span>
                    {specialAttack.desc && <span style={{ color: '#666666', marginLeft: 4, fontWeight: 400 }}>{specialAttack.desc}</span>}
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Spells */}
          {hasSpells && (
            <>
              {(hasAbilities || hasSpecialAttacks) && (
                <div style={{ display: 'flex', justifyContent: 'center', margin: '6px 0 4px 0' }}>
                  <img src="/linebreak.png" alt="" style={{ width: '100%', height: 'auto', opacity: 0.7 }} />
                </div>
              )}
              <h3 style={{ color: '#b33a1a', fontFamily: 'Sudbury, serif', fontWeight: 700, fontSize: 10, textTransform: 'uppercase', marginBottom: 1, letterSpacing: '1px', textAlign: 'left' }}>{dict.cardHeaders.spells}</h3>
              <div style={{ fontFamily: 'Sudbury, serif', fontSize: 10, textAlign: 'left' }}>
                {monster.spells.filter(spell => spell.name).map((spell) => (
                  <div key={spell.id} style={{ fontSize: 10, marginBottom: 2 }}>
                    <span style={{ color: '#000000', fontWeight: 700, fontStyle: 'italic' }}>{spell.name}.</span>
                    {spell.desc && <span style={{ color: '#666666', marginLeft: 4, fontWeight: 400 }}>{spell.desc}</span>}
                  </div>
                ))}
              </div>
            </>
          )}
          
        </div>
      </div>
    </div>
  );
}

export default function MonsterCardMaker({ 
  initialLang = "en" 
}: MonsterCardMakerProps = {}) {
  const [monster, setMonster] = useState<Monster>(defaultMonster);
  const [language, setLanguage] = useState<Language>(initialLang);
  const [cardHeight, setCardHeight] = useState<number>(350); // Track card height for dynamic white container

  const dict = dictionaries[language];

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('ou_monster');
      if (saved) {
        const parsed = JSON.parse(saved);
        setMonster(parsed);
      }
    } catch (error) {
      console.warn('Failed to load monster from localStorage:', error);
    }
  }, []);

  // Save to localStorage on monster change
  useEffect(() => {
    try {
      localStorage.setItem('ou_monster', JSON.stringify(monster));
    } catch (error) {
      console.warn('Failed to save monster to localStorage:', error);
    }
  }, [monster]);

  const updateMonster = useCallback((updates: Partial<Monster>) => {
    setMonster(prev => ({ ...prev, ...updates }));
  }, []);

  const addAbility = useCallback(() => {
    const newAbility: Ability = {
      id: crypto.randomUUID(),
      name: "",
      desc: ""
    };
    updateMonster({ abilities: [...monster.abilities, newAbility] });
  }, [monster.abilities, updateMonster]);

  const removeAbility = useCallback((id: string) => {
    updateMonster({ abilities: monster.abilities.filter(a => a.id !== id) });
  }, [monster.abilities, updateMonster]);

  const updateAbility = useCallback((id: string, updates: Partial<Omit<Ability, 'id'>>) => {
    updateMonster({
      abilities: monster.abilities.map(a => 
        a.id === id ? { ...a, ...updates } : a
      )
    });
  }, [monster.abilities, updateMonster]);

  const addSpecialAttack = useCallback(() => {
    const newSpecialAttack: SpecialAttack = {
      id: crypto.randomUUID(),
      name: "",
      desc: ""
    };
    updateMonster({ specialAttacks: [...monster.specialAttacks, newSpecialAttack] });
  }, [monster.specialAttacks, updateMonster]);

  const removeSpecialAttack = useCallback((id: string) => {
    updateMonster({ specialAttacks: monster.specialAttacks.filter(sa => sa.id !== id) });
  }, [monster.specialAttacks, updateMonster]);

  const updateSpecialAttack = useCallback((id: string, updates: Partial<Omit<SpecialAttack, 'id'>>) => {
    updateMonster({
      specialAttacks: monster.specialAttacks.map(sa => 
        sa.id === id ? { ...sa, ...updates } : sa
      )
    });
  }, [monster.specialAttacks, updateMonster]);

  const addSpell = useCallback(() => {
    const newSpell: Spell = {
      id: crypto.randomUUID(),
      name: "",
      desc: ""
    };
    updateMonster({ spells: [...monster.spells, newSpell] });
  }, [monster.spells, updateMonster]);

  const removeSpell = useCallback((id: string) => {
    updateMonster({ spells: monster.spells.filter(s => s.id !== id) });
  }, [monster.spells, updateMonster]);

  const updateSpell = useCallback((id: string, updates: Partial<Omit<Spell, 'id'>>) => {
    updateMonster({
      spells: monster.spells.map(s => 
        s.id === id ? { ...s, ...updates } : s
      )
    });
  }, [monster.spells, updateMonster]);

  const exportPng = useCallback(async () => {
    try {
      const cardElement = document.querySelector('[data-card]') as HTMLElement;
      if (!cardElement) return;

      const dataUrl = await toPng(cardElement, {
        pixelRatio: 3,
        cacheBust: true,
        backgroundColor: '#f4f1e8'
      });

      const link = document.createElement('a');
      link.download = `${monster.name || 'monster'}-card.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Failed to export PNG:', error);
    }
  }, [monster.name]);

  const copyPng = useCallback(async () => {
    try {
      const cardElement = document.querySelector('[data-card]') as HTMLElement;
      if (!cardElement) return;

      const dataUrl = await toPng(cardElement, {
        pixelRatio: 3,
        cacheBust: true,
        backgroundColor: '#f4f1e8'
      });

      const response = await fetch(dataUrl);
      const blob = await response.blob();
      
      if (navigator.clipboard?.write) {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ]);
      }
    } catch (error) {
      console.error('Failed to copy PNG:', error);
    }
  }, []);

  const resetForm = useCallback(() => {
    setMonster(defaultMonster);
    localStorage.removeItem('ou_monster');
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-3xl font-bold text-gray-900">{dict.title}</h1>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label htmlFor="language-select" className="text-sm font-medium text-gray-700">
                {dict.language}:
              </label>
              <select
                id="language-select"
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="en">English</option>
                <option value="pt-BR">Português (Brasil)</option>
              </select>
            </div>

            <div className="flex gap-2">
              <button
                onClick={exportPng}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                {dict.exportPng}
              </button>
              <button
                onClick={copyPng}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
              >
                {dict.copyPng}
              </button>
              <button
                onClick={resetForm}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
              >
                {dict.reset}
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Panel */}
          <div className="bg-white rounded-lg shadow-lg p-6" style={{ minHeight: 900 }}>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">{dict.form}</h2>
            
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    {dict.name}
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={monster.name}
                    onChange={(e) => updateMonster({ name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="sizeType" className="block text-sm font-medium text-gray-700 mb-1">
                    {dict.sizeType}
                  </label>
                  <input
                    id="sizeType"
                    type="text"
                    value={monster.sizeType}
                    onChange={(e) => updateMonster({ sizeType: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Stats Grid */}
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-3">{dict.stats}</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <label htmlFor="hp" className="block text-sm font-medium text-gray-700 mb-1">
                      {dict.hp}
                    </label>
                    <input
                      id="hp"
                      type="number"
                      value={monster.hp}
                      onChange={(e) => updateMonster({ hp: e.target.value ? parseInt(e.target.value) : "" })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="defense" className="block text-sm font-medium text-gray-700 mb-1">
                      {dict.defense}
                    </label>
                    <input
                      id="defense"
                      type="number"
                      value={monster.defense}
                      onChange={(e) => updateMonster({ defense: e.target.value ? parseInt(e.target.value) : "" })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="speed" className="block text-sm font-medium text-gray-700 mb-1">
                      {dict.speed}
                    </label>
                    <input
                      id="speed"
                      type="number"
                      value={monster.speed}
                      onChange={(e) => updateMonster({ speed: e.target.value ? parseInt(e.target.value) : "" })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="damage" className="block text-sm font-medium text-gray-700 mb-1">
                      {dict.damage}
                    </label>
                    <input
                      id="damage"
                      type="text"
                      value={monster.damage}
                      onChange={(e) => updateMonster({ damage: e.target.value })}
                      placeholder="1d6"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Attributes */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label htmlFor="body" className="block text-sm font-medium text-gray-700 mb-1">
                    {dict.body}
                  </label>
                  <input
                    id="body"
                    type="number"
                    value={monster.body}
                    onChange={(e) => updateMonster({ body: e.target.value ? parseInt(e.target.value) : "" })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="mind" className="block text-sm font-medium text-gray-700 mb-1">
                    {dict.mind}
                  </label>
                  <input
                    id="mind"
                    type="number"
                    value={monster.mind}
                    onChange={(e) => updateMonster({ mind: e.target.value ? parseInt(e.target.value) : "" })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="magic" className="block text-sm font-medium text-gray-700 mb-1">
                    {dict.magic}
                  </label>
                  <input
                    id="magic"
                    type="number"
                    value={monster.magic}
                    onChange={(e) => updateMonster({ magic: e.target.value ? parseInt(e.target.value) : "" })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Abilities Toggle */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <input
                    id="hasAbilities"
                    type="checkbox"
                    checked={monster.hasAbilities}
                    onChange={(e) => updateMonster({ hasAbilities: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <label htmlFor="hasAbilities" className="text-sm font-medium text-gray-700">
                    {dict.hasAbilities}
                  </label>
                </div>
                
                {monster.hasAbilities && (
                  <div className="space-y-3">
                    {monster.abilities.map((ability) => (
                      <div key={ability.id} className="border rounded-lg p-4 bg-gray-50">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <input
                            type="text"
                            value={ability.name}
                            onChange={(e) => updateAbility(ability.id, { name: e.target.value })}
                            placeholder={dict.abilityName}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <button
                            onClick={() => removeAbility(ability.id)}
                            className="px-2 py-2 text-red-600 hover:bg-red-50 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                            aria-label="Remove ability"
                          >
                            ×
                          </button>
                        </div>
                        <textarea
                          value={ability.desc}
                          onChange={(e) => updateAbility(ability.id, { desc: e.target.value })}
                          placeholder={dict.abilityDesc}
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    ))}
                    <button
                      onClick={addAbility}
                      className="w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-300 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {dict.addAbility}
                    </button>
                  </div>
                )}
              </div>

              {/* Special Attacks Toggle */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <input
                    id="hasSpecialAttacks"
                    type="checkbox"
                    checked={monster.hasSpecialAttacks}
                    onChange={(e) => updateMonster({ hasSpecialAttacks: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <label htmlFor="hasSpecialAttacks" className="text-sm font-medium text-gray-700">
                    {dict.hasSpecialAttacks}
                  </label>
                </div>
                
                {monster.hasSpecialAttacks && (
                  <div className="space-y-3">
                    {monster.specialAttacks.map((specialAttack) => (
                      <div key={specialAttack.id} className="border rounded-lg p-4 bg-gray-50">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <input
                            type="text"
                            value={specialAttack.name}
                            onChange={(e) => updateSpecialAttack(specialAttack.id, { name: e.target.value })}
                            placeholder={dict.specialAttackName}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <button
                            onClick={() => removeSpecialAttack(specialAttack.id)}
                            className="px-2 py-2 text-red-600 hover:bg-red-50 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                            aria-label="Remove special attack"
                          >
                            ×
                          </button>
                        </div>
                        <textarea
                          value={specialAttack.desc}
                          onChange={(e) => updateSpecialAttack(specialAttack.id, { desc: e.target.value })}
                          placeholder={dict.specialAttackDesc}
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    ))}
                    <button
                      onClick={addSpecialAttack}
                      className="w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-300 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {dict.addSpecialAttack}
                    </button>
                  </div>
                )}
              </div>

              {/* Spells Toggle */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <input
                    id="hasSpells"
                    type="checkbox"
                    checked={monster.hasSpells}
                    onChange={(e) => updateMonster({ hasSpells: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <label htmlFor="hasSpells" className="text-sm font-medium text-gray-700">
                    {dict.hasSpells}
                  </label>
                </div>
                
                {monster.hasSpells && (
                  <div className="space-y-3">
                    {monster.spells.map((spell) => (
                      <div key={spell.id} className="border rounded-lg p-4 bg-gray-50">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <input
                            type="text"
                            value={spell.name}
                            onChange={(e) => updateSpell(spell.id, { name: e.target.value })}
                            placeholder={dict.spellName}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <button
                            onClick={() => removeSpell(spell.id)}
                            className="px-2 py-2 text-red-600 hover:bg-red-50 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                            aria-label="Remove spell"
                          >
                            ×
                          </button>
                        </div>
                        <textarea
                          value={spell.desc}
                          onChange={(e) => updateSpell(spell.id, { desc: e.target.value })}
                          placeholder={dict.spellDesc}
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    ))}
                    <button
                      onClick={addSpell}
                      className="w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-300 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {dict.addSpell}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="bg-white rounded-lg shadow-lg p-6" style={{ minHeight: cardHeight + 80 }}>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">{dict.preview}</h2>
            
            <div className="flex justify-center" style={{ paddingTop: 15, paddingBottom: 15 }}>
              <MonsterCard monster={monster} dict={dict} onHeightChange={setCardHeight} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Embeddable Modal API
export function initEmbeddable(options?: { lang?: Language }) {
  // Create modal container
  const modalId = 'ou-card-maker-modal';
  let existingModal = document.getElementById(modalId);
  
  if (existingModal) {
    existingModal.remove();
  }

  const modal = document.createElement('div');
  modal.id = modalId;
  modal.className = 'fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4';
  modal.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 9999; background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center; padding: 1rem;';

  const modalContent = document.createElement('div');
  modalContent.className = 'bg-white rounded-lg shadow-xl max-w-full max-h-full overflow-auto';
  modalContent.style.cssText = 'background: white; border-radius: 0.5rem; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); max-width: 100%; max-height: 100%; overflow: auto; position: relative;';

  // Close button
  const closeButton = document.createElement('button');
  closeButton.innerHTML = '×';
  closeButton.className = 'absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold z-10';
  closeButton.style.cssText = 'position: absolute; top: 1rem; right: 1rem; color: #6b7280; font-size: 1.5rem; font-weight: bold; z-index: 10; background: none; border: none; cursor: pointer; width: 2rem; height: 2rem; display: flex; align-items: center; justify-content: center; border-radius: 0.25rem;';
  closeButton.addEventListener('mouseenter', () => closeButton.style.color = '#374151');
  closeButton.addEventListener('mouseleave', () => closeButton.style.color = '#6b7280');

  const appContainer = document.createElement('div');
  modalContent.appendChild(closeButton);
  modalContent.appendChild(appContainer);
  modal.appendChild(modalContent);
  document.body.appendChild(modal);

  // Close modal function
  const closeModal = () => {
    if (modal.parentNode) {
      modal.parentNode.removeChild(modal);
    }
  };

  // Event listeners for closing
  closeButton.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // ESC key listener
  const handleEsc = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      closeModal();
      document.removeEventListener('keydown', handleEsc);
    }
  };
  document.addEventListener('keydown', handleEsc);

  // Mount React app
  const root = createRoot(appContainer);
  
  // Create a wrapper component to pass props properly
  const EmbeddableApp = () => React.createElement(MonsterCardMaker, { 
    initialLang: options?.lang 
  } as any);
  
  root.render(React.createElement(EmbeddableApp));
}

// Expose on window for embeddable usage
declare global {
  interface Window {
    OmiosUriesCardMaker?: {
      init: typeof initEmbeddable;
    };
  }
}

if (typeof window !== 'undefined') {
  window.OmiosUriesCardMaker = {
    init: initEmbeddable
  };
}
