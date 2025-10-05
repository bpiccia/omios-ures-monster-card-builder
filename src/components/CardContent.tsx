import React from 'react';
import { Monster, Dictionary } from '../types';
import './CardContent.css';

interface CardContentProps {
  readonly monster: Monster;
  readonly dict: Dictionary;
  readonly textRef: React.RefObject<HTMLDivElement>;
  readonly topPadding: number;
  readonly totalHeight: number;
  readonly bottomPadding: number;
}

export function CardContent({ 
  monster, 
  dict, 
  textRef, 
  topPadding, 
  totalHeight, 
  bottomPadding 
}: CardContentProps) {
  const hasAbilities = monster.hasAbilities && monster.abilities.length > 0;
  const hasSpecialAttacks = monster.hasSpecialAttacks && monster.specialAttacks.length > 0;
  const hasSpells = monster.hasSpells && monster.spells.length > 0;

  return (
    <div 
      style={{ 
        position: 'absolute', 
        top: 0,
        left: 0,
        zIndex: 2, 
        width: '100%', 
        height: totalHeight,
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'flex-start'
      }}
    >
      <div 
        ref={textRef}
        style={{ paddingTop: topPadding, paddingBottom: bottomPadding, width: '69%', textAlign: 'left', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}
      >
        
        {/* Title and basic info */}
        <div className="monster-title">{monster.name || 'Monster Name'}</div>
        <div className="monster-size-type">{monster.sizeType || 'Size / Type'}</div>
        
        <div className="linebreak-container linebreak-small">
          <img src="/linebreak.png" alt="" className="linebreak-image" />
        </div>
        
        {/* Stats block */}
        <div className="stats-container">
          <div className="stat-row"><span className="stat-label">{dict.hp}:</span> <span className="stat-value">{monster.hp || '10'}</span></div>
          <div className="stat-row"><span className="stat-label">{dict.defense}:</span> <span className="stat-value">{monster.defense || '10'}</span></div>
          <div className="stat-row"><span className="stat-label">{dict.speed}:</span> <span className="stat-value">{monster.speed || '10'}</span></div>
          <div className="stat-row"><span className="stat-label">{dict.damage}:</span> <span className="stat-value">{monster.damage || '1d6'}</span></div>
        </div>
        
        <div className="linebreak-container">
          <img src="/linebreak.png" alt="" className="linebreak-image" />
        </div>
        
        {/* Attributes */}
        <div className="attributes-container">
          <div className="attribute-item">
            <div className="attribute-label">{dict.body}</div>
            <div className="attribute-value">{monster.body || '10'}</div>
          </div>
          <div className="attribute-item">
            <div className="attribute-label">{dict.mind}</div>
            <div className="attribute-value">{monster.mind || '10'}</div>
          </div>
          <div className="attribute-item">
            <div className="attribute-label">{dict.magic}</div>
            <div className="attribute-value">{monster.magic || '10'}</div>
          </div>
        </div>
        
        {/* Dynamic content separator */}
        {(hasAbilities || hasSpecialAttacks || hasSpells) && (
          <div className="linebreak-container">
            <img src="/linebreak.png" alt="" className="linebreak-image" />
          </div>
        )}

        {/* Abilities */}
        {hasAbilities && (
          <>
            <h3 className="section-header">{dict.cardHeaders.abilities}</h3>
            <div className="section-content">
              {monster.abilities.filter(ability => ability.name).map((ability) => (
                <div key={ability.id} className="ability-item">
                  <span className="ability-name">{ability.name}.</span>
                  {ability.desc && <span className="ability-desc">{ability.desc}</span>}
                </div>
              ))}
            </div>
          </>
        )}

        {/* Special Attacks */}
        {hasSpecialAttacks && (
          <>
            {hasAbilities && (
              <div className="linebreak-container linebreak-large">
                <img src="/linebreak.png" alt="" className="linebreak-image" />
              </div>
            )}
            <h3 className="section-header">{dict.cardHeaders.specialAttacks}</h3>
            <div className="section-content">
              {monster.specialAttacks.filter(specialAttack => specialAttack.name).map((specialAttack) => (
                <div key={specialAttack.id} className="ability-item">
                  <span className="ability-name">{specialAttack.name}.</span>
                  {specialAttack.desc && <span className="ability-desc">{specialAttack.desc}</span>}
                </div>
              ))}
            </div>
          </>
        )}

        {/* Spells */}
        {hasSpells && (
          <>
            {(hasAbilities || hasSpecialAttacks) && (
              <div className="linebreak-container linebreak-large">
                <img src="/linebreak.png" alt="" className="linebreak-image" />
              </div>
            )}
            <h3 className="section-header">{dict.cardHeaders.spells}</h3>
            <div className="section-content">
              {monster.spells.filter(spell => spell.name).map((spell) => (
                <div key={spell.id} className="ability-item">
                  <span className="ability-name">{spell.name}.</span>
                  {spell.desc && <span className="ability-desc">{spell.desc}</span>}
                </div>
              ))}
            </div>
          </>
        )}
        
      </div>
    </div>
  );
}
