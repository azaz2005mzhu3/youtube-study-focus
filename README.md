# YouTube Study Focus

> I wish my browser would hide YouTube's recommendations and comments when I am on a YouTube video.

YouTube Study Focus hides YouTube recommendations and comments so **Alice Zhu**, a college student who watches tutorials while studying, can focus instead of following distractions.

## What it does

Open the extension popup on YouTube to switch Focus Mode on or off. When it is on, the extension hides the recommendation sidebar and comments. The popup also starts a study timer for a whole-number duration from 1 to 180 minutes; the countdown continues while the popup is closed.

The content script runs only on `https://www.youtube.com/*`, because its page styles target YouTube's recommendation and comment sections. The extension does not read or modify pages on other sites.

## Permissions

- `storage` saves the Focus Mode setting and timer end time so they remain available after closing the popup or refreshing YouTube.
- `activeTab` lets the popup read the current tab's URL, only for the moment the user opens the popup, so it can tell whether that page is YouTube or an unsupported page (including `chrome://extensions`). This is narrower than the `tabs` permission, which would allow reading every open tab at any time.
- The content script's host match is limited to `https://www.youtube.com/*`; no additional site access is requested.

## Install in Chrome

1. On this repository's GitHub page, click **Code → Download ZIP**, then unzip the downloaded file.
2. Open `chrome://extensions` and turn on **Developer mode** (top right).
3. Click **Load unpacked** and pick the unzipped folder that holds `manifest.json`.

Open a YouTube page, click the extension icon, then turn Focus Mode on or start a timer.

## Live link

[YouTube Study Focus project page](https://azaz2005mzhu3.github.io/youtube-study-focus/)

The repository's GitHub Actions workflow publishes `index.html` to GitHub Pages when changes are pushed to `main`. Enable Pages with **Settings → Pages → Build and deployment → GitHub Actions** if it is not already enabled.

## Tests

These are the proposal's acceptance tests, run from a ZIP downloaded from this repository and loaded with **Load unpacked**, the same way a classmate would install it.

- **Empty:** On a fresh YouTube video, open the popup. Expected: Focus Mode is off, the duration defaults to 25 minutes, and recommendations and comments are visible.
- **In use:** Turn Focus Mode on while watching a YouTube video. Expected: the popup shows it is on and the recommendation/sidebar and comments sections disappear.
- **Unsupported page:** Open the popup on a normal non-YouTube page, then on `chrome://extensions`. Expected: each shows the unsupported-page message and does not offer a working page toggle.
- **Invalid input:** On YouTube, submit blank, `1.5`, `0`, and `181` as timer values. Expected: every value is rejected with a whole-number range message and none starts a countdown.
- **Persistence:** Turn Focus Mode on, refresh YouTube, and reopen the popup. Expected: recommendations/comments remain hidden and the popup still shows Focus Mode on.
- **Timer:** Start a 1-minute timer, close the popup, wait at least 10 seconds, and reopen it. Expected: less than 1 minute remains. Wait for expiry and reopen. Expected: the timer is inactive and shows no negative time.

**Status:** not yet run. This environment cannot launch a real Chrome window to load an unpacked extension (no Node.js/Python toolchain, and the sandbox's embedded browser blocks `chrome://` pages), so I could not perform these installs myself. I reviewed the manifest and traced each test through `popup.js`, `content.js`, and `content.css` and did not find a logic gap, but that is not the same as running them. **Before you submit, please run all six tests yourself from a downloaded ZIP** (see Install steps above) and replace this status line with what actually happened, fixing anything that fails.

## User test

**Pending:** A classmate must download and install the project from this repository and use it while Alice watches, without help. Record the participant's name, what they tried, where they got stuck, what changed in response, and link the commit containing that change here after the test. This test and its follow-up commit have not happened yet.

## Required AI-output question

In commit [`71fa439`](https://github.com/azaz2005mzhu3/youtube-study-focus/commit/71fa439), the agent's first outline said only that turning Focus Mode on would hide distractions. I changed that into separate state designs and tests that name the action and what should appear. I knew the first version needed changing because it did not say how to reproduce a state or how to tell whether it worked. I checked that every state in the proposal now has a test action and expected result; the Chrome behavior tests above still need to be run before I can claim the extension passed them.