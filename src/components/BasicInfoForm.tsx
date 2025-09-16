import { Monster, Dictionary } from '../types';

interface BasicInfoFormProps {
  readonly monster: Monster;
  readonly updateMonster: (updates: Partial<Monster>) => void;
  readonly dict: Dictionary;
}

export function BasicInfoForm({ monster, updateMonster, dict }: BasicInfoFormProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" >
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          {dict.name}
        </label>
        <input
          id="name"
          type="text"
          value={monster.name}
          onChange={(e) => updateMonster({ name: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label htmlFor="sizeType" className="block text-sm font-medium text-gray-700 mb-1">
          {dict.sizeType}
        </label>
        <input
          id="sizeType"
          type="text"
          value={monster.sizeType}
          onChange={(e) => updateMonster({ sizeType: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );
}