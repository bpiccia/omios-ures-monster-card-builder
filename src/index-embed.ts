import { initEmbeddable } from './MonsterCardMaker';

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
