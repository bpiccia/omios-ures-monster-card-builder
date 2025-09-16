import { Monster, Dictionary, Spell } from '../types';

interface SpellsFormProps {
  readonly monster: Monster;
  readonly updateMonster: (updates: Partial<Monster>) => void;
  readonly addSpell: () => void;
  readonly removeSpell: (id: string) => void;
  readonly updateSpell: (id: string, updates: Partial<Omit<Spell, 'id'>>) => void;
  readonly dict: Dictionary;
}

export function SpellsForm({ 
  monster, 
  updateMonster, 
  addSpell, 
  removeSpell, 
  updateSpell, 
  dict 
}: SpellsFormProps) {
  return (
    <div>
      <div className="space-y-3">
        {monster.spells.map((spell) => (
            <div key={spell.id} className="grid grid-cols-1 gap-2 p-3 bg-gray-50 rounded-md">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={spell.name}
                  onChange={(e) => updateSpell(spell.id, { name: e.target.value })}
                  placeholder={dict.spellName}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
                <button
                  onClick={() => removeSpell(spell.id)}
                  className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
                >
                  ×
                </button>
              </div>
              <textarea
                value={spell.desc}
                onChange={(e) => updateSpell(spell.id, { desc: e.target.value })}
                placeholder={dict.spellDesc}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
          ))}
          <button
            onClick={addSpell}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          >
            {dict.addSpell}
          </button>
        </div>
    </div>
  );
}