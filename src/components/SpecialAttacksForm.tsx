import { Monster, Dictionary, SpecialAttack } from '../types';

interface SpecialAttacksFormProps {
  readonly monster: Monster;
  readonly updateMonster: (updates: Partial<Monster>) => void;
  readonly addSpecialAttack: () => void;
  readonly removeSpecialAttack: (id: string) => void;
  readonly updateSpecialAttack: (id: string, updates: Partial<Omit<SpecialAttack, 'id'>>) => void;
  readonly dict: Dictionary;
}

export function SpecialAttacksForm({ 
  monster, 
  updateMonster, 
  addSpecialAttack, 
  removeSpecialAttack, 
  updateSpecialAttack, 
  dict 
}: SpecialAttacksFormProps) {
  return (
    <div>
      <div className="space-y-3">
        {monster.specialAttacks.map((specialAttack) => (
            <div key={specialAttack.id} className="grid grid-cols-1 gap-2 p-3 bg-gray-50 rounded-md">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={specialAttack.name}
                  onChange={(e) => updateSpecialAttack(specialAttack.id, { name: e.target.value })}
                  placeholder={dict.specialAttackName}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
                <button
                  onClick={() => removeSpecialAttack(specialAttack.id)}
                  className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
                >
                  ×
                </button>
              </div>
              <textarea
                value={specialAttack.desc}
                onChange={(e) => updateSpecialAttack(specialAttack.id, { desc: e.target.value })}
                placeholder={dict.specialAttackDesc}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
          ))}
          <button
            onClick={addSpecialAttack}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          >
            {dict.addSpecialAttack}
          </button>
        </div>
    </div>
  );
}
