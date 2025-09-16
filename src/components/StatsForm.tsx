import { Monster, Dictionary } from '../types';

interface StatsFormProps {
  readonly monster: Monster;
  readonly updateMonster: (updates: Partial<Monster>) => void;
  readonly dict: Dictionary;
}

export function StatsForm({ monster, updateMonster, dict }: StatsFormProps) {
  return (
    <div>
      <h3 className="text-lg font-medium text-gray-800 mb-3">{dict.stats}</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div>
          <label htmlFor="hp" className="block text-sm font-medium text-gray-700 mb-1">
            {dict.hp}
          </label>
          <input
            id="hp"
            type="number"
            value={monster.hp}
            onChange={(e) => updateMonster({ hp: e.target.value ? parseInt(e.target.value) : "" })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="defense" className="block text-sm font-medium text-gray-700 mb-1">
            {dict.defense}
          </label>
          <input
            id="defense"
            type="number"
            value={monster.defense}
            onChange={(e) => updateMonster({ defense: e.target.value ? parseInt(e.target.value) : "" })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="speed" className="block text-sm font-medium text-gray-700 mb-1">
            {dict.speed}
          </label>
          <input
            id="speed"
            type="number"
            value={monster.speed}
            onChange={(e) => updateMonster({ speed: e.target.value ? parseInt(e.target.value) : "" })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="damage" className="block text-sm font-medium text-gray-700 mb-1">
            {dict.damage}
          </label>
          <input
            id="damage"
            type="text"
            value={monster.damage}
            onChange={(e) => updateMonster({ damage: e.target.value })}
            placeholder="1d6"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
}