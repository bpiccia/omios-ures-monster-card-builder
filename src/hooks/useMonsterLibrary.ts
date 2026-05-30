import { useState, useEffect, useCallback, useRef } from 'react';
import { Monster, SavedMonster } from '../types';

const STORAGE_KEY = 'ou_monster_library';

function monsterToSaved(monster: Monster): SavedMonster {
  return {
    ...monster,
    savedId: crypto.randomUUID(),
    savedAt: Date.now(),
  };
}

function savedToMonster(saved: SavedMonster): Monster {
  const { savedId: _, savedAt: __, ...monster } = saved;
  return monster;
}

export function useMonsterLibrary() {
  const [library, setLibrary] = useState<SavedMonster[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(library));
    } catch (error) {
      console.warn('Failed to save monster library:', error);
    }
  }, [library]);

  const saveMonster = useCallback((monster: Monster, existingId?: string): string => {
    if (existingId) {
      setLibrary(prev => prev.map(m =>
        m.savedId === existingId
          ? { ...monster, savedId: existingId, savedAt: Date.now() }
          : m
      ));
      return existingId;
    }
    const saved = monsterToSaved(monster);
    setLibrary(prev => [...prev, saved]);
    return saved.savedId;
  }, []);

  const deleteMonster = useCallback((id: string) => {
    setLibrary(prev => prev.filter(m => m.savedId !== id));
  }, []);

  const duplicateMonster = useCallback((id: string, newName: string): string => {
    let newId = '';
    setLibrary(prev => {
      const original = prev.find(m => m.savedId === id);
      if (!original) return prev;
      const duplicate = monsterToSaved(savedToMonster(original));
      duplicate.name = newName;
      duplicate.abilities = original.abilities.map(a => ({ ...a, id: crypto.randomUUID() }));
      duplicate.specialAttacks = original.specialAttacks.map(sa => ({ ...sa, id: crypto.randomUUID() }));
      duplicate.spells = original.spells.map(s => ({ ...s, id: crypto.randomUUID() }));
      newId = duplicate.savedId;
      return [...prev, duplicate];
    });
    return newId;
  }, []);

  const getMonster = useCallback((id: string): Monster | undefined => {
    const saved = library.find(m => m.savedId === id);
    return saved ? savedToMonster(saved) : undefined;
  }, [library]);

  const exportMonster = useCallback((id: string) => {
    const saved = library.find(m => m.savedId === id);
    if (!saved) return;
    const monster = savedToMonster(saved);
    const blob = new Blob([JSON.stringify(monster, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `${monster.name || 'monster'}.json`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  }, [library]);

  const exportAll = useCallback(() => {
    const monsters = library.map(savedToMonster);
    const blob = new Blob([JSON.stringify({ monsters }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = 'monster-library.json';
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  }, [library]);

  const importMonster = useCallback((json: string): boolean => {
    try {
      const monster: Monster = JSON.parse(json);
      if (typeof monster.name !== 'string') return false;
      const saved = monsterToSaved(monster);
      setLibrary(prev => [...prev, saved]);
      return true;
    } catch {
      return false;
    }
  }, []);

  const importAll = useCallback((json: string): boolean => {
    try {
      const data = JSON.parse(json);
      const monsters: Monster[] = data.monsters || data;
      if (!Array.isArray(monsters)) return false;
      const saved = monsters.map(monsterToSaved);
      setLibrary(prev => [...prev, ...saved]);
      return true;
    } catch {
      return false;
    }
  }, []);

  const clearAll = useCallback(() => {
    setLibrary([]);
  }, []);

  return {
    library,
    saveMonster,
    deleteMonster,
    duplicateMonster,
    getMonster,
    exportMonster,
    exportAll,
    importMonster,
    importAll,
    clearAll,
  };
}
