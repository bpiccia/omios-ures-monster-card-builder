import React from 'react';
import { SavedMonster, Dictionary } from '../types';

interface MonsterLibraryProps {
  readonly library: SavedMonster[];
  readonly currentMonsterId: string | null;
  readonly dict: Dictionary;
  readonly onLoad: (id: string) => void;
  readonly onDelete: (id: string) => void;
  readonly onDuplicate: (id: string) => void;
  readonly onExportOne: (id: string) => void;
  readonly onImportOne: () => void;
  readonly onExportAll: () => void;
  readonly onImportAll: () => void;
  readonly onClearAll: () => void;
  readonly onNewMonster: () => void;
}

export function MonsterLibrary({
  library,
  currentMonsterId,
  dict,
  onLoad,
  onDelete,
  onDuplicate,
  onExportOne,
  onImportOne,
  onExportAll,
  onImportAll,
  onClearAll,
  onNewMonster,
}: MonsterLibraryProps) {
  return (
    <div className="w-80 flex-shrink-0 bg-[#f0f0f0] dark:bg-[#1a1a2e] rounded-lg flex flex-col max-h-[90vh] transition-colors duration-300">
      {/* Header */}
      <div className="p-3 border-b border-gray-300 dark:border-gray-700">
        <h3 className="text-sm font-bold text-gray-700 dark:text-gray-200 mb-2 text-center transition-colors">
          {dict.library}
        </h3>

        {/* Global action buttons */}
        <div className="flex flex-col gap-1">
          <HeaderButton onClick={onImportOne} title={dict.importJson}>
            <ImportIcon />
            <span>{dict.importJson}</span>
          </HeaderButton>
          <HeaderButton onClick={onExportAll} title={dict.exportAll} disabled={library.length === 0}>
            <ExportIcon />
            <span>{dict.exportAll}</span>
          </HeaderButton>
          <HeaderButton onClick={onImportAll} title={dict.importAll}>
            <ImportIcon />
            <span>{dict.importAll}</span>
          </HeaderButton>
          <HeaderButton onClick={onClearAll} title={dict.clearAll} variant="danger" disabled={library.length === 0}>
            <TrashIcon />
            <span>{dict.clearAll}</span>
          </HeaderButton>
        </div>
      </div>

      {/* Monster list */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {library.map((monster) => (
          <MonsterItem
            key={monster.savedId}
            monster={monster}
            isActive={monster.savedId === currentMonsterId}
            dict={dict}
            onLoad={() => onLoad(monster.savedId)}
            onDelete={() => onDelete(monster.savedId)}
            onDuplicate={() => onDuplicate(monster.savedId)}
            onExport={() => onExportOne(monster.savedId)}
          />
        ))}

        {/* New Monster entry */}
        <button
          onClick={onNewMonster}
          className={`w-full rounded-md text-xs px-2 py-2 text-center font-medium transition-colors border border-dashed ${
            currentMonsterId === null
              ? 'bg-blue-100 dark:bg-blue-900/40 border-blue-400 dark:border-blue-600 text-blue-700 dark:text-blue-300'
              : 'bg-transparent border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-400 dark:hover:border-gray-500'
          }`}
        >
          {dict.newMonster}
        </button>
      </div>
    </div>
  );
}

function MonsterItem({
  monster,
  isActive,
  dict,
  onLoad,
  onDelete,
  onDuplicate,
  onExport,
}: {
  readonly monster: SavedMonster;
  readonly isActive: boolean;
  readonly dict: Dictionary;
  readonly onLoad: () => void;
  readonly onDelete: () => void;
  readonly onDuplicate: () => void;
  readonly onExport: () => void;
}) {
  const displayName = monster.name || dict.noName;

  return (
    <div
      className={`rounded-md text-xs transition-colors ${
        isActive
          ? 'bg-blue-100 dark:bg-blue-900/40 border border-blue-400 dark:border-blue-600'
          : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
      }`}
    >
      <div className="flex items-center px-2 py-1.5 gap-1">
        <span
          className="truncate font-medium text-gray-800 dark:text-gray-200 flex-1 cursor-pointer"
          onClick={onLoad}
          title={displayName}
        >
          {displayName}
        </span>
        <div className="flex-shrink-0 flex items-center gap-0.5">
          <IconButton onClick={onDuplicate} title={dict.duplicateMonster}>
            <DuplicateIcon />
          </IconButton>
          <IconButton onClick={onExport} title={dict.exportJson}>
            <ExportIcon />
          </IconButton>
          <IconButton onClick={onDelete} title={dict.deleteMonster} variant="danger">
            <TrashIcon />
          </IconButton>
        </div>
      </div>
    </div>
  );
}

function IconButton({
  onClick,
  title,
  children,
  variant = 'default',
}: {
  readonly onClick: () => void;
  readonly title: string;
  readonly children: React.ReactNode;
  readonly variant?: 'default' | 'danger';
}) {
  const classes = variant === 'danger'
    ? 'text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400'
    : 'text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400';

  return (
    <button
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      title={title}
      className={`p-1 rounded transition-colors ${classes}`}
    >
      {children}
    </button>
  );
}

function HeaderButton({
  onClick,
  title,
  children,
  variant = 'default',
  disabled = false,
}: {
  readonly onClick: () => void;
  readonly title: string;
  readonly children: React.ReactNode;
  readonly variant?: 'default' | 'danger';
  readonly disabled?: boolean;
}) {
  const variantClasses = variant === 'danger'
    ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50'
    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600';

  return (
    <button
      onClick={onClick}
      title={title}
      disabled={disabled}
      className={`flex items-center justify-center gap-1.5 px-2 py-1.5 rounded text-[11px] font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${variantClasses}`}
    >
      {children}
    </button>
  );
}

function ImportIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 flex-shrink-0">
      <path fillRule="evenodd" d="M10 3a.75.75 0 01.75.75v10.638l3.96-4.158a.75.75 0 111.08 1.04l-5.25 5.5a.75.75 0 01-1.08 0l-5.25-5.5a.75.75 0 111.08-1.04l3.96 4.158V3.75A.75.75 0 0110 3z" clipRule="evenodd"/>
    </svg>
  );
}

function ExportIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 flex-shrink-0">
      <path fillRule="evenodd" d="M10 17a.75.75 0 01-.75-.75V5.612L5.29 9.77a.75.75 0 01-1.08-1.04l5.25-5.5a.75.75 0 011.08 0l5.25 5.5a.75.75 0 11-1.08 1.04l-3.96-4.158V16.25A.75.75 0 0110 17z" clipRule="evenodd"/>
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 flex-shrink-0">
      <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.519.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 01.7.797l-.5 6a.75.75 0 01-1.497-.124l.5-6a.75.75 0 01.797-.672zm2.84 0a.75.75 0 01.797.672l.5 6a.75.75 0 11-1.497.124l-.5-6a.75.75 0 01.7-.797z" clipRule="evenodd"/>
    </svg>
  );
}

function DuplicateIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 flex-shrink-0">
      <path d="M7 3.5A1.5 1.5 0 018.5 2h3.879a1.5 1.5 0 011.06.44l3.122 3.12A1.5 1.5 0 0117 6.622V12.5a1.5 1.5 0 01-1.5 1.5h-1v-3.379a3 3 0 00-.879-2.121L10.5 5.379A3 3 0 008.379 4.5H7v-1z"/>
      <path d="M4.5 6A1.5 1.5 0 003 7.5v9A1.5 1.5 0 004.5 18h7a1.5 1.5 0 001.5-1.5v-5.879a1.5 1.5 0 00-.44-1.06L9.44 6.439A1.5 1.5 0 008.378 6H4.5z"/>
    </svg>
  );
}
