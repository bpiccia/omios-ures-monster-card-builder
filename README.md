# Omios Uries – Monster Card Maker

A React + TypeScript component for creating monster cards with a parchment-style design. Can be used both as a normal React component and as an embeddable modal widget.

## Features

- **Live Preview**: Real-time card preview as you type
- **Bilingual**: English and Portuguese (Brasil) support
- **Export Options**: Export to PNG or copy to clipboard
- **Persistence**: Auto-saves to localStorage
- **Embeddable**: Can be embedded as a modal on any website
- **Customizable**: Configurable background and language

## Quick Start

### Install Dependencies

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

### Build Embeddable Version

```bash
npm run build:embed
```

## Usage

### As a React Component

```tsx
import MonsterCardMaker from './MonsterCardMaker';

function App() {
  return (
    <MonsterCardMaker 
      backgroundUrl="/custom-parchment.png"
      initialLang="pt-BR"
    />
  );
}
```

### As an Embeddable Modal

Include React, ReactDOM, and the built bundle on your page:

```html
<script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
<script src="./dist/omios-uries-card-maker.js"></script>

<button onclick="window.OmiosUriesCardMaker.init()">
  Open Monster Card Maker
</button>
```

#### Embeddable Options

```javascript
// Basic usage
window.OmiosUriesCardMaker.init();

// With options
window.OmiosUriesCardMaker.init({
  lang: 'pt-BR',
  backgroundUrl: '/custom-background.png'
});
```

## Card Features

### Form Fields
- **Name**: Monster name (displayed in uppercase)
- **Size/Type**: Creature size and type (italic subheader)
- **Stats**: HP, Defense, Speed, Damage
- **Attributes**: Body, Mind, Magic scores

### Dynamic Sections
- **Abilities**: Toggle to show/hide ability list with add/remove functionality
- **Spells**: Toggle to show/hide spell list with add/remove functionality

### Export Options
- **Export PNG**: Downloads a high-resolution PNG (3x pixel ratio)
- **Copy PNG**: Copies the image to clipboard (where supported)
- **Reset**: Clears all form data and localStorage

## Customization

### Background Images
The card supports custom background images. The default is `/parchment.svg`, but you can specify any image URL:

```tsx
<MonsterCardMaker backgroundUrl="/my-custom-background.png" />
```

### Languages
Currently supports:
- `en` - English
- `pt-BR` - Português (Brasil)

### Card Dimensions
The card is designed at 420px width for crisp rendering and optimal export quality.

## File Structure

```
src/
├── MonsterCardMaker.tsx    # Main component
├── types.d.ts             # TypeScript interfaces
├── index-embed.ts         # Embeddable bootstrap
├── main.tsx              # React app entry point
└── index.css             # Tailwind CSS imports

public/
├── parchment.svg         # Default background
└── demo.html            # Embeddable demo page
```

## Development

### Adding New Languages

1. Extend the `dictionaries` object in `MonsterCardMaker.tsx`
2. Update the `Language` type in `types.d.ts`
3. Add the new option to the language selector

### Customizing Card Design

The card preview is styled with Tailwind CSS classes. Key areas:
- Title styling: `.text-2xl.font-bold.uppercase`
- Stats grid: `.grid.grid-cols-4.gap-2`
- Attributes: `.grid.grid-cols-3.gap-2`
- Section headers: `.text-sm.font-bold.uppercase`

### Export Quality

PNG exports use `html-to-image` with these settings:
- `pixelRatio: 3` for high-DPI displays
- `cacheBust: true` to avoid caching issues
- `backgroundColor: '#f4f1e8'` for parchment tone

## Browser Support

- Modern browsers with ES2020+ support
- Clipboard API support for copy functionality
- Canvas API for PNG export

## License

This project is part of the Omios Uries game system.
