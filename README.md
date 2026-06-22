# C++ Exam Tutor

Static exam-focused C++ revision app for local browser use. The main app entry is `index.html` and does not require a build step or local server.


## Running C++ Code

Code questions now include a **Run Code** button. The app wraps function-style answers in a small C++ test harness, sends the program to a real GCC-compatible sandbox, and prints compiler errors, runtime errors, raw output, and visible test-case results under the editor. A separate **Code Lab** tab lets learners run complete C++ programs outside the lesson flow.

The runner uses the public Piston execution API from the browser, so compiling code requires an internet connection and, when Piston requires authorization, an access token. To provide a token for local use, run `localStorage.setItem('cpp_tutor_piston_token', '<your-token>')` in the browser console before clicking **Run Code**. A host page can also set `window.CPP_TUTOR_PISTON_TOKEN` before loading `js/core/compiler.js`. If the sandbox is unavailable or rejects the request, the app keeps drafts and checker feedback available and shows a targeted error in the run-output panel.

## Test Harnesses

Open either harness page directly in the browser or VS Code integrated browser.

### `test-harness.html`

Purpose: lightweight logic and persistence checks.

Covers:

- grading normalization for equivalent correct answers
- syntax issue detection keeping broken answers below pass threshold
- C++ runner wrapper generation and output comparison
- checkpoint timer auto-submit when time reaches zero
- `localStorage` save/load round-trip for tutor state and drafts

### `ui-workflow-harness.html`

Purpose: workflow checks against the real app shell.

Covers:

- starting a day checkpoint from the Learn flow
- starting and submitting an Exam Sim attempt
- restoring a saved code draft after a full page reload

## Local Profiles

The app uses browser-only learner profiles instead of cloud accounts. On first run, learners choose or create a profile from the “Who is learning?” screen. Each profile keeps progress, drafts, scores, checkpoint history, and exam history separate in `localStorage` under `cpp_tutor_profile::<profile-id>` keys.

## Notes

- Both harnesses back up the existing `cpp_tutor_save` entry and restore it after each run.
- The main app is intended to be opened from `index.html` via a local `file:///` URL.
- No build tooling is required for app usage or harness usage.
