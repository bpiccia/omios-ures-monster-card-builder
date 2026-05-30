export type Language = "en" | "pt-BR";

export interface Ability {
  id: string;
  name: string;
  desc: string;
}

export interface Spell {
  id: string;
  name: string;
  desc: string;
}

export interface SpecialAttack {
  id: string;
  name: string;
  desc: string;
}

export interface Monster {
  name: string;
  sizeType: string;
  hp: string | number;
  defense: string | number;
  speed: string | number;
  damage: string;
  body: string | number;
  mind: string | number;
  magic: string | number;
  abilities: Ability[];
  specialAttacks: SpecialAttack[];
  spells: Spell[];
  hasAbilities: boolean;
  hasSpecialAttacks: boolean;
  hasSpells: boolean;
}

export interface SavedMonster extends Monster {
  savedId: string;
  savedAt: number;
}

export interface Dictionary {
  title: string;
  preview: string;
  form: string;
  name: string;
  sizeType: string;
  hp: string;
  defense: string;
  speed: string;
  damage: string;
  body: string;
  mind: string;
  magic: string;
  spellName: string;
  spellDesc: string;
  hasAbilities: string;
  hasSpecialAttacks: string;
  hasSpells: string;
  language: string;
  exportPng: string;
  copyPng: string;
  reset: string;
  stats: string;
  abilityName: string;
  abilityDesc: string;
  specialAttackName: string;
  specialAttackDesc: string;
  addAbility: string;
  addSpecialAttack: string;
  addSpell: string;
  abilities: string;
  specialAttacks: string;
  spells: string;
  cardHeaders: {
    abilities: string;
    specialAttacks: string;
    spells: string;
  };
  library: string;
  saveMonster: string;
  deleteMonster: string;
  duplicateMonster: string;
  exportJson: string;
  importJson: string;
  exportAll: string;
  importAll: string;
  clearAll: string;
  confirmClear: string;
  confirmDelete: string;
  duplicatePrompt: string;
  emptyLibrary: string;
  monsterSaved: string;
  noName: string;
  newMonster: string;
  defaultName: string;
  defaultSizeType: string;
}