'use strict';

const STORAGE_KEY = 'enabled';
const CSS_LINK_ID = 'youtube-minimal-mode-css';

/**
 * Toggle CSS file based on enabled state
 */
function toggleMinimalMode(enabled) {
  let linkElement = document.getElementById(CSS_LINK_ID);

  if (enabled) {
    // Enable: inject CSS if not already present
    if (!linkElement) {
      linkElement = document.createElement('link');
      linkElement.id = CSS_LINK_ID;
      linkElement.rel = 'stylesheet';
      linkElement.href = chrome.runtime.getURL('styles.css');
      document.head.appendChild(linkElement);
    }
  } else {
    // Disable: remove CSS if present
    if (linkElement) {
      linkElement.remove();
    }
  }
}

/**
 * Load and apply current state from storage
 */
function applyCurrentState() {
  chrome.storage.sync.get([STORAGE_KEY], (result) => {
    const enabled = result[STORAGE_KEY] || false;
    toggleMinimalMode(enabled);
  });
}

/**
 * Listen for storage changes
 */
chrome.storage.onChanged.addListener((changes) => {
  if (changes[STORAGE_KEY]) {
    toggleMinimalMode(changes[STORAGE_KEY].newValue);
  }
});

// Initialize on load
applyCurrentState();
