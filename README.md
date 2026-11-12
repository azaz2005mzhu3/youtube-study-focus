# YouTube Study Focus

YouTube Study Focus hides YouTube recommendations and comments so **Alice Zhu**, a college student who watches tutorials while studying, can focus instead of following distractions.

## What it does

Open the extension popup on YouTube to switch Focus Mode on or off. When it is on, the extension hides the recommendation sidebar and comments. The popup also starts a study timer for a whole-number duration from 1 to 180 minutes; the countdown continues while the popup is closed.

The content script runs only on `https://www.youtube.com/*`, because its page styles target YouTube's recommendation and comment sections. The extension does not read or modify pages on other sites.

## Permissions

- `storage` saves the Focus Mode setting and timer end time so they remain available after closing the popup or refreshing YouTube.
- `tabs` reads the active tab's URL so the popup can explain when it is opened on an unsupported page, including `chrome://extensions`.
- The content script's host match is limited to `https://www.youtube.com/*`; no additional site access is requested.

## Install in Chrome

1. Click **Code** on this repository's GitHub page.
2. Click **Download ZIP**.
3. Unzip the downloaded file.
4. Open `chrome://extensions`.
5. Turn on **Developer mode**.
6. Click **Load unpacked**.
7. Pick the unzipped folder that holds `manifest.json`.

Open a YouTube page, click the extension icon, then turn Focus Mode on or start a timer.

## Live link

[YouTube Study Focus project page](https://azaz2005mzhu3.github.io/youtube-study-focus/)

The repository's GitHub Actions workflow publishes `index.html` to GitHub Pages when changes are pushed to `main`. Enable Pages with **Settings → Pages → Build and deployment → GitHub Actions** if it is not already enabled.

## Tests

These are the proposal's acceptance tests. I created and extracted a ZIP of the pushed commit and verified the manifest and referenced files. The available headless Chrome launch rejected its unpacked-extension command-line flags, so the extension was not installed and none of these UI acceptance tests has been run. Run each one from a ZIP downloaded from the repository and replace its status with what happened before submission.

- **Empty:** On a fresh YouTube video, open the popup. Expected: Focus Mode is off, the duration defaults to 25 minutes, and recommendations and comments are visible. **Not run yet.**
- **In use:** Turn Focus Mode on while watching a YouTube video. Expected: the popup shows it is on and the recommendation/sidebar and comments sections disappear. **Not run yet.**
- **Unsupported page:** Open the popup on a normal non-YouTube page, then on `chrome://extensions`. Expected: each shows the unsupported-page message and does not offer a working page toggle. **Not run yet.**
- **Invalid input:** On YouTube, submit blank, `1.5`, `0`, and `181` as timer values. Expected: every value is rejected with a whole-number range message and none starts a countdown. **Not run yet.**
- **Persistence:** Turn Focus Mode on, refresh YouTube, and reopen the popup. Expected: recommendations/comments remain hidden and the popup still shows Focus Mode on. **Not run yet.**
- **Timer:** Start a 1-minute timer, close the popup, wait at least 10 seconds, and reopen it. Expected: less than 1 minute remains. Wait for expiry and reopen. Expected: the timer is inactive and shows no negative time. **Not run yet.**

## User test

**Pending:** A classmate must download and install the project from this repository and use it while Alice watches, without help. Record the participant's name, what they tried, where they got stuck, what changed in response, and link the commit containing that change here after the test. This test and its follow-up commit have not happened yet.

## Required AI-output question

In commit [`71fa439`](https://github.com/azaz2005mzhu3/youtube-study-focus/commit/71fa439), the agent's first outline said only that turning Focus Mode on would hide distractions. I changed that into separate state designs and tests that name the action and what should appear. I knew the first version needed changing because it did not say how to reproduce a state or how to tell whether it worked. I checked that every state in the proposal now has a test action and expected result; the Chrome behavior tests above still need to be run before I can claim the extension passed them.