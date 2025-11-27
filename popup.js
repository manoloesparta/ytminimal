const STORAGE_KEYS = {
  all: 'hideAll',
  metadata: 'hideMetadata',
  comments: 'hideComments',
  recommended: 'hideRecommended'
};

const toggleAll = document.getElementById('toggleAll');
const toggleMetadata = document.getElementById('toggleMetadata');
const toggleComments = document.getElementById('toggleComments');
const toggleRecommended = document.getElementById('toggleRecommended');
const statusDiv = document.getElementById('status');

function updateStatus(state) {
  const enabledFeatures = [];

  if (state.hideAll) {
    enabledFeatures.push('All');
  } else {
    if (state.hideMetadata) enabledFeatures.push('Metadata');
    if (state.hideComments) enabledFeatures.push('Comments');
    if (state.hideRecommended) enabledFeatures.push('Recommended');
  }

  if (enabledFeatures.length === 0) {
    statusDiv.textContent = 'All features disabled';
    statusDiv.classList.remove('active');
  } else {
    statusDiv.textContent = `Hiding: ${enabledFeatures.join(', ')}`;
    statusDiv.classList.add('active');
  }
}

function loadState() {
  chrome.storage.sync.get(Object.values(STORAGE_KEYS), (result) => {
    if (chrome.runtime.lastError) {
      console.error('Error loading state:', chrome.runtime.lastError);
      return;
    }

    const state = {
      hideAll: result[STORAGE_KEYS.all] || false,
      hideMetadata: result[STORAGE_KEYS.metadata] || false,
      hideComments: result[STORAGE_KEYS.comments] || false,
      hideRecommended: result[STORAGE_KEYS.recommended] || false
    };

    toggleAll.checked = state.hideAll;
    toggleMetadata.checked = state.hideMetadata;
    toggleComments.checked = state.hideComments;
    toggleRecommended.checked = state.hideRecommended;

    updateDisabledState(state.hideAll);
    updateStatus(state);
  });
}

function updateDisabledState(allEnabled) {
  toggleMetadata.disabled = allEnabled;
  toggleComments.disabled = allEnabled;
  toggleRecommended.disabled = allEnabled;

  const containers = [
    toggleMetadata.closest('.toggle-container'),
    toggleComments.closest('.toggle-container'),
    toggleRecommended.closest('.toggle-container')
  ];

  containers.forEach(container => {
    if (allEnabled) {
      container.style.opacity = '0.5';
    } else {
      container.style.opacity = '1';
    }
  });
}

function saveState(key, value) {
  chrome.storage.sync.set({ [key]: value }, () => {
    if (chrome.runtime.lastError) {
      console.error('Error saving state:', chrome.runtime.lastError);
      return;
    }

    chrome.storage.sync.get(Object.values(STORAGE_KEYS), (result) => {
      const state = {
        hideAll: result[STORAGE_KEYS.all] || false,
        hideMetadata: result[STORAGE_KEYS.metadata] || false,
        hideComments: result[STORAGE_KEYS.comments] || false,
        hideRecommended: result[STORAGE_KEYS.recommended] || false
      };
      updateStatus(state);
    });
  });
}

function handleToggleAll() {
  const enabled = toggleAll.checked;
  updateDisabledState(enabled);
  saveState(STORAGE_KEYS.all, enabled);
}

function handleToggleChange(key) {
  return function() {
    const toggle = this;
    saveState(key, toggle.checked);
  };
}

toggleAll.addEventListener('change', handleToggleAll);
toggleMetadata.addEventListener('change', handleToggleChange(STORAGE_KEYS.metadata));
toggleComments.addEventListener('change', handleToggleChange(STORAGE_KEYS.comments));
toggleRecommended.addEventListener('change', handleToggleChange(STORAGE_KEYS.recommended));

loadState();
