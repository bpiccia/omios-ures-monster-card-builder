import { Language, Dictionary, Monster } from './types';

// Asset URL helper for embedded usage
export const getAssetUrl = (path: string): string => {
  // Check if we're in an embedded environment (different domain than the app)
  const isEmbedded = window.location.hostname !== 'omios-ures-monster-card-builder.vercel.app' && 
                     window.location.hostname !== 'localhost';
  
  if (isEmbedded) {
    return `https://omios-ures-monster-card-builder.vercel.app${path}`;
  }
  
  return path;
};

export const dictionaries: Record<Language, Dictionary> = {
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
    },
    library: "Library",
    saveMonster: "Save",
    deleteMonster: "Delete",
    duplicateMonster: "Duplicate",
    exportJson: "Export JSON",
    importJson: "Import Monster",
    exportAll: "Export All",
    importAll: "Import All",
    clearAll: "Clear All",
    confirmClear: "Are you sure you want to clear the entire library?",
    confirmDelete: "Are you sure you want to delete this monster?",
    duplicatePrompt: "Enter a name for the duplicated monster:",
    emptyLibrary: "No saved monsters yet",
    monsterSaved: "Monster saved!",
    noName: "Unnamed Monster"
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
    },
    library: "Biblioteca",
    saveMonster: "Salvar",
    deleteMonster: "Excluir",
    duplicateMonster: "Duplicar",
    exportJson: "Exportar JSON",
    importJson: "Importar JSON",
    exportAll: "Exportar Todos",
    importAll: "Importar Todos",
    clearAll: "Limpar Tudo",
    confirmClear: "Tem certeza que deseja limpar toda a biblioteca?",
    confirmDelete: "Tem certeza que deseja excluir este monstro?",
    duplicatePrompt: "Digite um nome para o monstro duplicado:",
    emptyLibrary: "Nenhum monstro salvo ainda",
    monsterSaved: "Monstro salvo!",
    noName: "Monstro Sem Nome"
  }
} as const;

export const defaultMonster: Monster = {
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