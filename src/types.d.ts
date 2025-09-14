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

export interface Monster {
  name: string;
  sizeType: string;
  hp: number | "";
  defense: number | "";
  speed: number | "";
  damage: string;
  body: number | "";
  mind: number | "";
  magic: number | "";
  abilities: Ability[];
  spells: Spell[];
  hasAbilities: boolean;
  hasSpells: boolean;
}

export type Language = "en" | "pt-BR";

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
  stats: string;
  body: string;
  mind: string;
  magic: string;
  abilities: string;
  spells: string;
  addAbility: string;
  addSpell: string;
  abilityName: string;
  abilityDesc: string;
  spellName: string;
  spellDesc: string;
  hasAbilities: string;
  hasSpells: string;
  language: string;
  exportPng: string;
  copyPng: string;
  reset: string;
  cardHeaders: {
    abilities: string;
    spells: string;
  };
}
