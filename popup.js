'use strict';

// Constants
const STORAGE_KEY = 'enabled';

// DOM Elements
const toggle = document.getElementById('toggleExtension');
const statusDiv = document.getElementById('status');

/**
 * Update the status indicator
 * @param {boolean} enabled - Current enabled state
 */
function updateStatus(enabled) {
  if (enabled) {
    statusDiv.textContent = 'Extension is ON';
    statusDiv.classList.add('active');
  } else {
    statusDiv.textContent = 'Extension is OFF';
    statusDiv.classList.remove('active');
  }
}

/**
 * Load saved state from storage
 */
function loadState() {
  chrome.storage.sync.get([STORAGE_KEY], (result) => {
    if (chrome.runtime.lastError) {
      console.error('Error loading state:', chrome.runtime.lastError);
      return;
    }

    const enabled = result[STORAGE_KEY] || false;
    toggle.checked = enabled;
    updateStatus(enabled);
  });
}

/**
 * Save state to storage
 * @param {boolean} enabled - New enabled state
 */
function saveState(enabled) {
  chrome.storage.sync.set({ [STORAGE_KEY]: enabled }, () => {
    if (chrome.runtime.lastError) {
      console.error('Error saving state:', chrome.runtime.lastError);
      return;
    }

    updateStatus(enabled);
  });
}

/**
 * Handle toggle change event
 */
function handleToggleChange() {
  const enabled = toggle.checked;
  saveState(enabled);
}

// Event Listeners
toggle.addEventListener('change', handleToggleChange);

// Initialize
loadState();
