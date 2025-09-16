import { useState, useEffect, useCallback } from 'react';
import { Monster, Ability, SpecialAttack, Spell } from '../types';
import { defaultMonster } from '../constants';

export function useMonster() {
  const [monster, setMonster] = useState<Monster>(defaultMonster);

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

  const resetForm = useCallback(() => {
    setMonster(defaultMonster);
    localStorage.removeItem('ou_monster');
  }, []);

  return {
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
  };
}