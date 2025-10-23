import { initEmbeddable } from './MonsterCardMaker';
// Import CSS and fonts for embedded version
import './index.css';
import './fonts.css';

// Export the embeddable init function for library builds
export { initEmbeddable };

// Declare the window interface for proper typing
declare global {
  interface Window {
    OmiosUriesCardMaker?: {
      init: typeof initEmbeddable;
    };
  }
}

// Expose on window for immediate use
if (typeof window !== 'undefined') {
  window.OmiosUriesCardMaker = {
    init: initEmbeddable
  };
}
