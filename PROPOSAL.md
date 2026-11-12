
# YouTube Study Focus — Project Proposal

## What I am building

YouTube Study Focus is a small Chrome extension that hides YouTube recommendations and comments while I study, and optionally runs a focus timer.

## Who it is for

I am building this for myself, Alice Zhu, a college student who watches tutorials on YouTube and gets distracted by recommendations and comments.

## Where it runs

The content script runs only on `https://www.youtube.com/*`, the YouTube pages whose recommendations and comments it can hide. The popup can be opened on any page, but it reports when the current tab is unsupported rather than trying to change that page. It does not need access to other sites.

## What the user does

The user opens a YouTube page, clicks the extension icon, turns Focus Mode on or off, and optionally starts a timer from 1 to 180 minutes.

## What it does

When Focus Mode is on, the content script hides recommendations and comments. The popup saves the mode and timer end time so the mode survives page refreshes and the timer continues while the popup is closed. Turning Focus Mode off restores the hidden page sections.

## Features

1. Hide YouTube recommendations and comments while Focus Mode is on.
2. Turn Focus Mode on and off from the popup.
3. Keep the chosen mode after a YouTube page refresh.
4. Start and display a focus countdown with a whole-number duration from 1 to 180 minutes.
5. Explain when the popup is open on an unsupported page.

## What I do not know yet

I need to learn how Chrome content scripts interact with YouTube's changing page and how extension storage can share settings between the popup and content script. I will verify the selectors on YouTube and keep the supported URL scope narrow.

## States and tests

This extension does not call a model or use a key, so loading, request error, long-answer, and no-key states do not apply.

### Empty
**Design:** On a supported YouTube page before the user changes anything, Focus Mode is off, recommendations and comments remain visible, and the timer duration field is ready with a 25-minute default.
**Test:** Install the extension, open a YouTube video in a fresh profile, and open the popup. **Expected:** the mode is off, the default duration is 25 minutes, and the page's recommendations and comments are not hidden.

### In use
**Design:** When Focus Mode is on, the popup shows that it is on, and YouTube recommendations and comments are hidden.
**Test:** On a YouTube video, turn Focus Mode on. **Expected:** the popup reflects the on state and the recommendation/sidebar and comments sections disappear from the page.

### Unsupported page
**Design:** The popup stays usable but explains that Focus Mode works only on YouTube when opened on a page outside the extension's matches, including `chrome://extensions`.
**Test:** Open the popup on a normal non-YouTube page, then on `chrome://extensions`. **Expected:** each time, the popup explains that the active page is unsupported and does not offer a working page toggle.

### Invalid input
**Design:** The timer accepts only whole numbers from 1 through 180. Blank, fractional, non-numeric, zero, or over-limit values are rejected with a clear message; no timer starts.
**Test:** On YouTube, try submitting a blank value, `1.5`, `0`, and `181`. **Expected:** each value is refused, an error explains the valid range, and no countdown starts.

### Persistence
**Design:** Focus Mode state is stored and reapplied after a YouTube refresh.
**Test:** Turn Focus Mode on, refresh the YouTube page, and reopen the popup. **Expected:** recommendations/comments remain hidden and the popup still shows Focus Mode on.

### Timer
**Design:** The popup shows a countdown after a valid duration is started. The end time persists independently of the popup, and an expired timer returns to its inactive state.
**Test:** Start a 1-minute timer, close the popup, wait at least 10 seconds, and reopen it. **Expected:** the remaining time is lower than 1 minute. Wait until it expires and reopen the popup. **Expected:** the timer is inactive and no negative time is shown.
