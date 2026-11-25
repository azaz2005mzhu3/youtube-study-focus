function applyFocusMode(enabled) {
  document.documentElement.classList.toggle("study-focus-mode", enabled);
}

chrome.storage.local.get("focusModeEnabled")
  .then((settings) => {
    applyFocusMode(settings.focusModeEnabled === true);
  })
  .catch((error) => {
    console.error("YouTube Study Focus could not load its settings:", error);
  });

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === "local" && changes.focusModeEnabled) {
    applyFocusMode(changes.focusModeEnabled.newValue === true);
  }
});
