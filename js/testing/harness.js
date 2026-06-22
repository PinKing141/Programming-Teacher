(function () {
  const app = window.App;
  const state = app.state;
  const resultsElement = document.getElementById('test-results');
  const summaryElement = document.getElementById('test-summary');
  const runButton = document.getElementById('run-tests');
  const storageKey = 'cpp_tutor_save';

  function wait(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
  }

  function assert(condition, message) {
    if (!condition) {
      throw new Error(message);
    }
  }

  function cloneState() {
    return JSON.parse(JSON.stringify(state));
  }

  function restoreState(snapshot) {
    Object.keys(state).forEach(key => delete state[key]);
    Object.assign(state, snapshot);
  }

  function resetTransientRuntime() {
    if (state.dayCheckpointTimer) {
      clearInterval(state.dayCheckpointTimer);
      state.dayCheckpointTimer = null;
    }
    if (state.examTimer) {
      clearInterval(state.examTimer);
      state.examTimer = null;
    }
  }

  async function runTests() {
    runButton.disabled = true;
    resultsElement.innerHTML = '';
    summaryElement.textContent = 'Running...';

    const storageBackup = localStorage.getItem(storageKey);
    const stateBackup = cloneState();
    const tests = [
      {
        name: 'Grading accepts normalized correct code',
        run() {
          const question = {
            ans: 'int AddFive(int n) { return n + 5; }',
            checks: ['int AddFive(int n)', 'return n + 5;']
          };
          const result = app.evaluateCodeAnswer(question, 'int AddFive(int n)\n{\n    return n+5;\n}');
          assert(result.score === 1, 'Expected a perfect score for equivalent formatting.');
          assert(result.syntaxIssues.length === 0, 'Expected no syntax issues.');
        }
      },
      {
        name: 'Grading caps broken syntax below pass threshold',
        run() {
          const question = {
            ans: 'int AddFive(int n) { return n + 5; }',
            checks: ['int AddFive(int n)', 'return n + 5;']
          };
          const result = app.evaluateCodeAnswer(question, 'int AddFive(int n)\n{\n    return n + 5\n');
          assert(result.syntaxIssues.length > 0, 'Expected syntax issues to be detected.');
          assert(result.score < 0.5, 'Expected syntax issues to keep the score below pass.');
        }
      },
      {
        name: 'Checkpoint timer decrements and auto-submits',
        async run() {
          const originalSubmit = app.submitDayCheckpoint;
          let submitted = false;

          app.submitDayCheckpoint = function submitDayCheckpointTestDouble() {
            submitted = true;
            if (state.dayCheckpointTimer) {
              clearInterval(state.dayCheckpointTimer);
              state.dayCheckpointTimer = null;
            }
          };

          state.panel = 'learn';
          state.dayCheckpoint = {
            dayIndex: 0,
            attemptId: 'test-attempt',
            secondsLeft: 1,
            submitted: false,
            result: null
          };

          app.startCheckpointTimer();
          await wait(1150);

          assert(submitted, 'Expected the checkpoint timer to trigger submission at zero.');
          assert(state.dayCheckpoint.secondsLeft <= 0, 'Expected checkpoint seconds to reach zero or below.');

          app.submitDayCheckpoint = originalSubmit;
        }
      },
      {
        name: 'State save and load round-trip through localStorage',
        run() {
          Object.assign(state, app.getDefaultState());
          state.day = 3;
          state.panel = 'exam';
          state.correct = 7;
          state.total = 9;
          state.codeDrafts['ed-learn-0-0'] = 'return 42;';

          app.saveState();
          Object.assign(state, app.getDefaultState());
          app.loadState();

          assert(state.day === 3, 'Expected day to restore from storage.');
          assert(state.panel === 'exam', 'Expected panel to restore from storage.');
          assert(state.correct === 7 && state.total === 9, 'Expected score counters to restore from storage.');
          assert(state.codeDrafts['ed-learn-0-0'] === 'return 42;', 'Expected code drafts to restore from storage.');
        }
      }
    ];

    let passed = 0;

    try {
      for (const test of tests) {
        const item = document.createElement('li');
        item.className = 'test-item running';
        item.textContent = test.name;
        resultsElement.appendChild(item);

        try {
          await test.run();
          item.className = 'test-item pass';
          item.textContent = `${test.name} - PASS`;
          passed++;
        } catch (error) {
          item.className = 'test-item fail';
          item.textContent = `${test.name} - FAIL: ${error.message}`;
        } finally {
          resetTransientRuntime();
        }
      }
    } finally {
      resetTransientRuntime();
      restoreState(stateBackup);
      if (storageBackup === null) {
        localStorage.removeItem(storageKey);
      } else {
        localStorage.setItem(storageKey, storageBackup);
      }
      summaryElement.textContent = `${passed} / ${tests.length} tests passed`;
      runButton.disabled = false;
    }
  }

  runButton.addEventListener('click', runTests);
  runTests();
})();
