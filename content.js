const STORAGE_KEY = 'enabled';
const CSS_LINK_ID = 'youtube-minimal-mode-css';

function toggleMinimalMode(enabled) {
  let linkElement = document.getElementById(CSS_LINK_ID);

  if (enabled) {
    if (!linkElement) {
      linkElement = document.createElement('link');
      linkElement.id = CSS_LINK_ID;
      linkElement.rel = 'stylesheet';
      linkElement.href = chrome.runtime.getURL('styles.css');
      document.head.appendChild(linkElement);
    }
  } else {
    if (linkElement) {
      linkElement.remove();
    }
  }
}

function applyCurrentState() {
  chrome.storage.sync.get([STORAGE_KEY], (result) => {
    const enabled = result[STORAGE_KEY] || false;
    toggleMinimalMode(enabled);
  });
}

chrome.storage.onChanged.addListener((changes) => {
  if (changes[STORAGE_KEY]) {
    toggleMinimalMode(changes[STORAGE_KEY].newValue);
  }
});

applyCurrentState();
