import React from 'react';
import { createRoot } from 'react-dom/client';
import { toPng } from 'html-to-image';
import { Language } from './types';
import { dictionaries } from './constants';
import { useMonster } from './hooks/useMonster';
import { MonsterCard } from './components/MonsterCard';
import { BasicInfoForm } from './components/BasicInfoForm';
import { StatsForm } from './components/StatsForm';
import { AttributesForm } from './components/AttributesForm';
import { AbilitiesForm } from './components/AbilitiesForm';
import { SpecialAttacksForm } from './components/SpecialAttacksForm';
import { SpellsForm } from './components/SpellsForm';
import './fonts.css';

interface MonsterCardMakerProps {
  initialLang?: Language;
}

export default function MonsterCardMaker({ 
  initialLang = "en" 
}: MonsterCardMakerProps = {}) {
  const [language, setLanguage] = React.useState<Language>(initialLang);
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
    resetMonster
  } = useMonster();

  const dict = dictionaries[language];

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
      
      // Convert data URL to blob
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      
      // Copy to clipboard
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ]);
    } catch (error) {
      console.error('Error copying PNG:', error);
    }
  };

  return (
    <div style={{ display: 'flex', gap: '20px', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      {/* Left side - Form */}
      <div style={{ 
        flex: '1', 
        minWidth: '350px',
        maxWidth: '500px',
        backgroundColor: '#f5f5f5', 
        padding: '20px', 
        borderRadius: '8px',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        <h2 style={{ marginTop: 0, marginBottom: '20px', color: '#333' }}>{dict.form}</h2>
        
        {/* Language selector */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            {dict.language}:
          </label>
          <select 
            value={language} 
            onChange={(e) => setLanguage(e.target.value as Language)}
            style={{ padding: '5px', fontSize: '14px' }}
          >
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="de">Deutsch</option>
          </select>
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
        <div style={{ marginTop: '20px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <input
              id="hasAbilities"
              type="checkbox"
              checked={monster.hasAbilities}
              onChange={(e) => updateMonster({ hasAbilities: e.target.checked })}
              style={{ width: '16px', height: '16px', accentColor: '#007bff' }}
            />
            <label htmlFor="hasAbilities" style={{ fontSize: '14px', fontWeight: '500', color: '#333' }}>
              {dict.hasAbilities}
            </label>
          </div>
        </div>

        {/* Abilities Form */}
        {monster.hasAbilities && (
          <AbilitiesForm 
            monster={monster} 
            updateMonster={updateMonster}
            addAbility={addAbility}
            removeAbility={removeAbility}
            updateAbility={updateAbility}
            dict={dict} 
          />
        )}

        {/* Special Attacks Toggle */}
        <div style={{ marginTop: '20px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <input
              id="hasSpecialAttacks"
              type="checkbox"
              checked={monster.hasSpecialAttacks}
              onChange={(e) => updateMonster({ hasSpecialAttacks: e.target.checked })}
              style={{ width: '16px', height: '16px', accentColor: '#007bff' }}
            />
            <label htmlFor="hasSpecialAttacks" style={{ fontSize: '14px', fontWeight: '500', color: '#333' }}>
              {dict.hasSpecialAttacks}
            </label>
          </div>
        </div>

        {/* Special Attacks Form */}
        {monster.hasSpecialAttacks && (
          <SpecialAttacksForm 
            monster={monster} 
            updateMonster={updateMonster}
            addSpecialAttack={addSpecialAttack}
            removeSpecialAttack={removeSpecialAttack}
            updateSpecialAttack={updateSpecialAttack}
            dict={dict} 
          />
        )}

        {/* Spells Toggle */}
        <div style={{ marginTop: '20px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <input
              id="hasSpells"
              type="checkbox"
              checked={monster.hasSpells}
              onChange={(e) => updateMonster({ hasSpells: e.target.checked })}
              style={{ width: '16px', height: '16px', accentColor: '#007bff' }}
            />
            <label htmlFor="hasSpells" style={{ fontSize: '14px', fontWeight: '500', color: '#333' }}>
              {dict.hasSpells}
            </label>
          </div>
        </div>

        {/* Spells Form */}
        {monster.hasSpells && (
          <SpellsForm 
            monster={monster} 
            updateMonster={updateMonster}
            addSpell={addSpell}
            removeSpell={removeSpell}
            updateSpell={updateSpell}
            dict={dict} 
          />
        )}

        {/* Action buttons */}
        <div style={{ marginTop: '30px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button 
            onClick={exportPng}
            style={{ 
              padding: '10px 15px', 
              backgroundColor: '#007bff', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px', 
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            {dict.exportPng}
          </button>
          <button 
            onClick={copyPng}
            style={{ 
              padding: '10px 15px', 
              backgroundColor: '#28a745', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px', 
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            {dict.copyPng}
          </button>
          <button 
            onClick={resetMonster}
            style={{ 
              padding: '10px 15px', 
              backgroundColor: '#dc3545', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px', 
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            {dict.reset}
          </button>
        </div>
      </div>

      {/* Right side - Preview */}
      <div style={{ 
        flex: '1', 
        minWidth: '350px',
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        backgroundColor: '#f9f9f9', 
        padding: '20px', 
        borderRadius: '8px'
      }}>
        <h2 style={{ marginTop: 0, marginBottom: '20px', color: '#333' }}>{dict.preview}</h2>
        <div style={{ transform: 'scale(1)', transformOrigin: 'top center' }}>
          <MonsterCard monster={monster} dict={dict} />
        </div>
      </div>
    </div>
  );
}

// For embedding in other applications
export function initEmbeddable(containerId: string, props: MonsterCardMakerProps = {}) {
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