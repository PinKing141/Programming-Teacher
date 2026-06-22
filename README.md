# C++ Exam Tutor

Static exam-focused C++ revision app for local browser use. The main app entry is `index.html` and does not require a build step or local server.

## Test Harnesses

Open either harness page directly in the browser or VS Code integrated browser.

### `test-harness.html`

Purpose: lightweight logic and persistence checks.

Covers:

- grading normalization for equivalent correct answers
- syntax issue detection keeping broken answers below pass threshold
- checkpoint timer auto-submit when time reaches zero
- `localStorage` save/load round-trip for tutor state and drafts

### `ui-workflow-harness.html`

Purpose: workflow checks against the real app shell.

Covers:

- starting a day checkpoint from the Learn flow
- starting and submitting an Exam Sim attempt
- restoring a saved code draft after a full page reload

## Notes

- Both harnesses back up the existing `cpp_tutor_save` entry and restore it after each run.
- The main app is intended to be opened from `index.html` via a local `file:///` URL.
- No build tooling is required for app usage or harness usage.
