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
}