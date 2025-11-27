const STORAGE_KEYS = {
  all: 'hideAll',
  metadata: 'hideMetadata',
  comments: 'hideComments',
  recommended: 'hideRecommended'
};

const CSS_LINK_ID = 'youtube-minimal-mode-css';
const CLASS_PREFIX = 'ytm-hide-';

function applyMinimalMode(state) {
  let linkElement = document.getElementById(CSS_LINK_ID);

  const anyEnabled = state.hideAll || state.hideMetadata || state.hideComments || state.hideRecommended;

  if (anyEnabled) {
    if (!linkElement) {
      linkElement = document.createElement('link');
      linkElement.id = CSS_LINK_ID;
      linkElement.rel = 'stylesheet';
      linkElement.href = chrome.runtime.getURL('styles.css');
      document.head.appendChild(linkElement);
    }

    const htmlElement = document.documentElement;

    if (state.hideAll) {
      htmlElement.classList.add(`${CLASS_PREFIX}all`);
      htmlElement.classList.remove(`${CLASS_PREFIX}metadata`, `${CLASS_PREFIX}comments`, `${CLASS_PREFIX}recommended`);
    } else {
      htmlElement.classList.remove(`${CLASS_PREFIX}all`);

      if (state.hideMetadata) {
        htmlElement.classList.add(`${CLASS_PREFIX}metadata`);
      } else {
        htmlElement.classList.remove(`${CLASS_PREFIX}metadata`);
      }

      if (state.hideComments) {
        htmlElement.classList.add(`${CLASS_PREFIX}comments`);
      } else {
        htmlElement.classList.remove(`${CLASS_PREFIX}comments`);
      }

      if (state.hideRecommended) {
        htmlElement.classList.add(`${CLASS_PREFIX}recommended`);
      } else {
        htmlElement.classList.remove(`${CLASS_PREFIX}recommended`);
      }
    }
  } else {
    if (linkElement) {
      linkElement.remove();
    }
    const htmlElement = document.documentElement;
    htmlElement.classList.remove(`${CLASS_PREFIX}all`, `${CLASS_PREFIX}metadata`, `${CLASS_PREFIX}comments`, `${CLASS_PREFIX}recommended`);
  }
}

function applyCurrentState() {
  chrome.storage.sync.get(Object.values(STORAGE_KEYS), (result) => {
    const state = {
      hideAll: result[STORAGE_KEYS.all] || false,
      hideMetadata: result[STORAGE_KEYS.metadata] || false,
      hideComments: result[STORAGE_KEYS.comments] || false,
      hideRecommended: result[STORAGE_KEYS.recommended] || false
    };
    applyMinimalMode(state);
  });
}

chrome.storage.onChanged.addListener((changes) => {
  const relevantChange = Object.values(STORAGE_KEYS).some(key => changes[key]);
  if (relevantChange) {
    applyCurrentState();
  }
});

applyCurrentState();
