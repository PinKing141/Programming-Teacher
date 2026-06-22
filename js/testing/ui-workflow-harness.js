(function () {
  const frame = document.getElementById('app-frame');
  const resultsElement = document.getElementById('ui-test-results');
  const summaryElement = document.getElementById('ui-test-summary');
  const runButton = document.getElementById('run-ui-tests');
  const storageKey = 'cpp_tutor_save';

  function wait(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
  }

  function waitForFrameLoad() {
    return new Promise(resolve => {
      frame.addEventListener('load', () => resolve(frame.contentWindow), { once: true });
    });
  }

  function ensureFrameReady() {
    if (frame.contentWindow && frame.contentDocument && frame.contentDocument.readyState === 'complete') {
      return Promise.resolve(frame.contentWindow);
    }
    return waitForFrameLoad();
  }

  async function reloadApp() {
    const loadPromise = waitForFrameLoad();
    frame.src = `index.html?workflowHarness=${Date.now()}`;
    return loadPromise;
  }

  function getAppWindow() {
    return frame.contentWindow;
  }

  function getApp() {
    return getAppWindow().App;
  }

  function assert(condition, message) {
    if (!condition) {
      throw new Error(message);
    }
  }

  function dispatchAppClick(selector) {
    const target = frame.contentDocument.querySelector(selector);
    assert(target, `Expected to find element: ${selector}`);
    target.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
  }

  async function bootCleanApp() {
    localStorage.removeItem(storageKey);
    await reloadApp();
    return getApp();
  }

  function cleanupAppTimers(app) {
    if (!app) return;
    if (app.state.dayCheckpointTimer) {
      clearInterval(app.state.dayCheckpointTimer);
      app.state.dayCheckpointTimer = null;
    }
    if (app.state.examTimer) {
      clearInterval(app.state.examTimer);
      app.state.examTimer = null;
    }
  }

  async function runTests() {
    runButton.disabled = true;
    resultsElement.innerHTML = '';
    summaryElement.textContent = 'Running...';

    const storageBackup = localStorage.getItem(storageKey);
    let app = null;

    const tests = [
      {
        name: 'Starts the day checkpoint from the Learn flow',
        async run() {
          app = await bootCleanApp();
          dispatchAppClick('#learn-content [data-action="start-day-checkpoint"]');
          await wait(80);

          assert(app.state.panel === 'checkpoint', 'Expected the checkpoint panel to become active.');
          assert(Boolean(app.state.dayCheckpoint), 'Expected an active day checkpoint state.');
          assert(frame.contentDocument.getElementById('checkpoint-timer')?.textContent === '30:00', 'Expected a fresh 30 minute checkpoint timer.');
        }
      },
      {
        name: 'Starts and submits the exam simulator',
        async run() {
          app = await bootCleanApp();
          dispatchAppClick('.mode-btn[data-panel="exam"]');
          dispatchAppClick('#start-exam-btn');
          await wait(80);

          assert(app.state.examActive === true, 'Expected the exam to become active after starting.');
          dispatchAppClick('#submit-exam-btn');
          await wait(80);

          assert(app.state.examActive === false, 'Expected the exam to stop after submission.');
          assert(app.state.examHistory.length === 1, 'Expected an exam history record after submission.');
          assert(!frame.contentDocument.getElementById('exam-results')?.classList.contains('hidden'), 'Expected exam results to become visible.');
        }
      },
      {
        name: 'Restores a saved code draft after a reload',
        async run() {
          app = await bootCleanApp();
          const firstEditor = frame.contentDocument.querySelector('.code-editor');
          assert(firstEditor, 'Expected a code editor on the Learn panel.');

          const draftId = firstEditor.id;
          const draftValue = 'int DraftProbe(int x)\n{\n    return x + 1;\n}';
          app.persistDraft(draftId, draftValue);

          await reloadApp();
          app = getApp();
          const restoredEditor = frame.contentDocument.getElementById(draftId);

          assert(app.getDraftValue(draftId) === draftValue, 'Expected the draft value to persist in state after reload.');
          assert(restoredEditor && restoredEditor.value.includes('DraftProbe'), 'Expected the rendered editor to restore the saved draft.');
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
          cleanupAppTimers(app);
        }
      }
    } finally {
      cleanupAppTimers(app);
      if (storageBackup === null) {
        localStorage.removeItem(storageKey);
      } else {
        localStorage.setItem(storageKey, storageBackup);
      }
      await reloadApp();
      summaryElement.textContent = `${passed} / ${tests.length} UI tests passed`;
      runButton.disabled = false;
    }
  }

  ensureFrameReady().then(() => runTests());
  runButton.addEventListener('click', runTests);
})();
