const pageMessage = document.querySelector("#page-message");
const controls = document.querySelector("#controls");
const focusToggle = document.querySelector("#focus-toggle");
const focusStatus = document.querySelector("#focus-status");
const timerForm = document.querySelector("#timer-form");
const durationInput = document.querySelector("#duration");
const timerMessage = document.querySelector("#timer-message");
const timerError = document.querySelector("#timer-error");
const remainingTime = document.querySelector("#remaining-time");
const settingsMessage = document.querySelector("#settings-message");

let focusModeEnabled = false;
let timerEndTime = null;
let expiryUpdateStarted = false;

function showSettingsError(message) {
  settingsMessage.textContent = message;
  settingsMessage.hidden = false;
}

function renderFocusMode() {
  focusToggle.setAttribute("aria-pressed", String(focusModeEnabled));
  focusToggle.textContent = focusModeEnabled
    ? "Turn Focus Mode off"
    : "Turn Focus Mode on";
  focusStatus.textContent = focusModeEnabled
    ? "Focus Mode is on."
    : "Focus Mode is off.";
  focusToggle.disabled = false;
}

function renderTimer() {
  if (timerEndTime === null) {
    timerMessage.textContent = "No timer running.";
    remainingTime.hidden = true;
    return;
  }

  const secondsLeft = Math.max(0, Math.ceil((timerEndTime - Date.now()) / 1000));
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  timerMessage.textContent = "Timer running.";
  remainingTime.textContent = `Time remaining: ${minutes}:${String(seconds).padStart(2, "0")}`;
  remainingTime.hidden = false;

  if (secondsLeft === 0 && !expiryUpdateStarted) {
    expiryUpdateStarted = true;
    timerEndTime = null;
    chrome.storage.local.set({ timerEndTime: null })
      .then(() => {
        expiryUpdateStarted = false;
        renderTimer();
      })
      .catch((error) => {
        showSettingsError("The timer expired, but its saved state could not be updated.");
        console.error("YouTube Study Focus could not clear its expired timer:", error);
      });
  }
}

async function initializePopup() {
  try {
    const [activeTab] = await chrome.tabs.query({
      active: true,
      currentWindow: true
    });

    let activeUrl;
    try {
      activeUrl = new URL(activeTab && activeTab.url);
    } catch {
      pageMessage.textContent = "This page is not supported. Open YouTube to use Focus Mode.";
      return;
    }

    if (activeUrl.protocol !== "https:" || activeUrl.hostname !== "www.youtube.com") {
      pageMessage.textContent = "This page is not supported. Open YouTube to use Focus Mode.";
      return;
    }

    const settings = await chrome.storage.local.get([
      "focusModeEnabled",
      "timerEndTime"
    ]);

    focusModeEnabled = settings.focusModeEnabled === true;
    timerEndTime = typeof settings.timerEndTime === "number"
      && settings.timerEndTime > Date.now()
      ? settings.timerEndTime
      : null;

    controls.hidden = false;
    pageMessage.hidden = true;
    renderFocusMode();
    renderTimer();
    window.setInterval(renderTimer, 1000);
  } catch (error) {
    pageMessage.textContent = "Could not load this page or your settings. Close and reopen the popup.";
    console.error("YouTube Study Focus could not initialize:", error);
  }
}

focusToggle.addEventListener("click", async () => {
  const nextValue = !focusModeEnabled;

  try {
    await chrome.storage.local.set({ focusModeEnabled: nextValue });
    focusModeEnabled = nextValue;
    renderFocusMode();
    settingsMessage.hidden = true;
  } catch (error) {
    showSettingsError("Focus Mode could not be saved. Try again.");
    console.error("YouTube Study Focus could not save Focus Mode:", error);
  }
});

timerForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const value = durationInput.value.trim();

  if (!/^\d+$/.test(value) || Number(value) < 1 || Number(value) > 180) {
    timerError.textContent = "Enter a whole number from 1 to 180 minutes.";
    timerError.hidden = false;
    return;
  }

  const endTime = Date.now() + Number(value) * 60 * 1000;
  try {
    await chrome.storage.local.set({ timerEndTime: endTime });
    timerEndTime = endTime;
    timerError.hidden = true;
    settingsMessage.hidden = true;
    renderTimer();
  } catch (error) {
    showSettingsError("The timer could not be saved. Try again.");
    console.error("YouTube Study Focus could not save its timer:", error);
  }
});

durationInput.addEventListener("input", () => {
  if (!timerError.hidden) {
    timerError.hidden = true;
  }
});

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName !== "local") {
    return;
  }

  if (changes.focusModeEnabled) {
    focusModeEnabled = changes.focusModeEnabled.newValue === true;
    renderFocusMode();
  }

  if (changes.timerEndTime) {
    const value = changes.timerEndTime.newValue;
    timerEndTime = typeof value === "number" && value > Date.now()
      ? value
      : null;
    renderTimer();
  }
});

initializePopup();
