import { Monster, Dictionary, Ability } from '../types';

interface AbilitiesFormProps {
  readonly monster: Monster;
  readonly addAbility: () => void;
  readonly removeAbility: (id: string) => void;
  readonly updateAbility: (id: string, updates: Partial<Omit<Ability, 'id'>>) => void;
  readonly dict: Dictionary;
}

export function AbilitiesForm({ 
  monster, 
  addAbility, 
  removeAbility, 
  updateAbility, 
  dict 
}: AbilitiesFormProps) {
  return (
    <div>
      <div className="space-y-3">
        {monster.abilities.map((ability) => (
            <div key={ability.id} className="grid grid-cols-1 gap-2 p-3 bg-gray-50 rounded-md">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={ability.name}
                  onChange={(e) => updateAbility(ability.id, { name: e.target.value })}
                  placeholder={dict.abilityName}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
                <button
                  onClick={() => removeAbility(ability.id)}
                  className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
                >
                  ×
                </button>
              </div>
              <textarea
                value={ability.desc}
                onChange={(e) => updateAbility(ability.id, { desc: e.target.value })}
                placeholder={dict.abilityDesc}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
          ))}

          <button
            onClick={addAbility}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {dict.addAbility}
          </button>
        </div>
    </div>
  );
}