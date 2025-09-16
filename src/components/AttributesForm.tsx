import { Monster, Dictionary } from '../types';

interface AttributesFormProps {
  readonly monster: Monster;
  readonly updateMonster: (updates: Partial<Monster>) => void;
  readonly dict: Dictionary;
}

export function AttributesForm({ monster, updateMonster, dict }: AttributesFormProps) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <div>
        <label htmlFor="body" className="block text-sm font-medium text-gray-700 mb-1">
          {dict.body}
        </label>
        <input
          id="body"
          type="number"
          value={monster.body}
          onChange={(e) => updateMonster({ body: e.target.value ? parseInt(e.target.value) : "" })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label htmlFor="mind" className="block text-sm font-medium text-gray-700 mb-1">
          {dict.mind}
        </label>
        <input
          id="mind"
          type="number"
          value={monster.mind}
          onChange={(e) => updateMonster({ mind: e.target.value ? parseInt(e.target.value) : "" })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label htmlFor="magic" className="block text-sm font-medium text-gray-700 mb-1">
          {dict.magic}
        </label>
        <input
          id="magic"
          type="number"
          value={monster.magic}
          onChange={(e) => updateMonster({ magic: e.target.value ? parseInt(e.target.value) : "" })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );
}