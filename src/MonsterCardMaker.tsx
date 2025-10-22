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
}: Readonly<MonsterCardMakerProps>) {
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
    resetForm
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
        {/* Header with title and language selector */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '20px' 
        }}>
          <h2 style={{ margin: 0, color: '#333' }}>{dict.form}</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <label style={{ fontWeight: 'bold', fontSize: '14px' }}>
              {dict.language}:
            </label>
            <select 
              value={language} 
              onChange={(e) => setLanguage(e.target.value as Language)}
              style={{ padding: '5px', fontSize: '14px' }}
            >
              {Object.keys(dictionaries).map((lang) => (
                <option key={lang} value={lang}>
                  {lang === 'en' ? 'English' : lang === 'pt-BR' ? 'Português (Brasil)' : lang}
                </option>
              ))}
            </select>
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
            addSpell={addSpell}
            removeSpell={removeSpell}
            updateSpell={updateSpell}
            dict={dict} 
          />
        )}
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
        <div id='monster-card-preview' style={{ transform: 'scale(1)', transformOrigin: 'top center' }}>
          <MonsterCard monster={monster} dict={dict} />
        </div>

        {/* Action buttons */}
        <div style={{ marginTop: '30px', display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button 
            onClick={exportPng}
            title="Export PNG"
            style={{ 
              padding: '12px', 
              backgroundColor: '#8B4513', 
              color: 'white', 
              border: '2px solid #654321', 
              borderRadius: '50%', 
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              background: 'linear-gradient(135deg, #8B4513 0%, #A0522D 100%)',
              width: '48px',
              height: '48px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#A0522D';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#8B4513';
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
            <img src="/download.svg" alt="Download" style={{ width: '24px', height: '24px', filter: 'brightness(0) invert(1)' }} />
          </button>
          <button 
            onClick={copyPng}
            title="Copy PNG to clipboard"
            style={{ 
              padding: '12px', 
              backgroundColor: '#556B2F', 
              color: 'white', 
              border: '2px solid #3E4B21', 
              borderRadius: '50%', 
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              background: 'linear-gradient(135deg, #556B2F 0%, #6B8E23 100%)',
              width: '48px',
              height: '48px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#6B8E23';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#556B2F';
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
            <img src="/clipboard.svg" alt="Copy" style={{ width: '24px', height: '24px', filter: 'brightness(0) invert(1)' }} />
          </button>
          <button 
            onClick={resetForm}
            title="Reset form"
            style={{ 
              padding: '12px', 
              backgroundColor: '#B22222', 
              color: 'white', 
              border: '2px solid #8B1A1A', 
              borderRadius: '50%', 
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              background: 'linear-gradient(135deg, #B22222 0%, #DC143C 100%)',
              width: '48px',
              height: '48px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#DC143C';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#B22222';
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
            <img src="/reset.svg" alt="Reset" style={{ width: '24px', height: '24px', filter: 'brightness(0) invert(1)' }} />
          </button>
        </div>
      </div>
    </div>
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