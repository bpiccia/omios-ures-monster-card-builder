import { initEmbeddable } from './MonsterCardMaker';

// Export the embeddable init function for library builds
export { initEmbeddable };

// Expose on window for immediate use
if (typeof window !== 'undefined') {
  window.OmiosUriesCardMaker = {
    init: initEmbeddable
  };
}
