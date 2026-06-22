(function () {
  const app = window.App;
  const state = app.state;

  app.escapeHtml = function escapeHtml(unsafe) {
    return (unsafe || '').toString()
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };

  app.formatPrompt = function formatPrompt(value) {
    return app.escapeHtml(value)
      .replace(/\n/g, '<br>')
      .replace(/`([^`]+)`/g, '<span class="inline-code">$1</span>');
  };

  app.stripCodeComments = function stripCodeComments(code) {
    return (code || '')
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/\/\/.*$/gm, '');
  };

  app.normalizeCodeFragment = function normalizeCodeFragment(code) {
    return app.stripCodeComments(code).replace(/\s+/g, '');
  };

  app.getDraftValue = function getDraftValue(id) {
    return state.codeDrafts[id] || '';
  };

  app.persistDraft = function persistDraft(id, value) {
    if (!id) return;
    if (value) state.codeDrafts[id] = value;
    else delete state.codeDrafts[id];
    app.saveState();
  };

  app.getUniqueChecks = function getUniqueChecks(checks) {
    const seen = new Set();
    return (checks || []).reduce((acc, check) => {
      const normalized = app.normalizeCodeFragment(check);
      if (!normalized || seen.has(normalized)) return acc;
      seen.add(normalized);
      acc.push({ label: check, normalized });
      return acc;
    }, []);
  };

  app.findSyntaxIssues = function findSyntaxIssues(code, question) {
    const issues = [];
    const stripped = app.stripCodeComments(code);
    const count = token => (stripped.match(token) || []).length;

    if (count(/\{/g) !== count(/\}/g)) issues.push('Unbalanced braces');
    if (count(/\(/g) !== count(/\)/g)) issues.push('Unbalanced parentheses');
    if (count(/\[/g) !== count(/\]/g)) issues.push('Unbalanced square brackets');

    const badReturn = stripped
      .split('\n')
      .map(line => line.trim())
      .find(line => line.startsWith('return') && !line.endsWith(';'));

    if (badReturn) {
      issues.push(`Missing semicolon after \`${badReturn}\``);
    }

    if (question?.ans && question.ans.includes('{') && !stripped.includes('{')) {
      issues.push('Missing function or class body braces');
    }

    return issues;
  };

  app.evaluateCodeAnswer = function evaluateCodeAnswer(question, value) {
    const normalizedAnswer = app.normalizeCodeFragment(value);
    const checks = app.getUniqueChecks(question?.checks || []);
    const passed = checks.filter(check => normalizedAnswer.includes(check.normalized));
    const missed = checks.filter(check => !normalizedAnswer.includes(check.normalized));
    const syntaxIssues = app.findSyntaxIssues(value, question);
    const rawScore = checks.length ? passed.length / checks.length : 0;
    const adjustedScore = syntaxIssues.length ? Math.min(rawScore, 0.49) : rawScore;

    return {
      score: adjustedScore,
      rawScore,
      passed,
      missed,
      syntaxIssues
    };
  };

  app.formatSeconds = function formatSeconds(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  app.getCheckpointMarks = function getCheckpointMarks() {
    return [10, 20, 30, 40];
  };

  app.resolveTrackedKey = function resolveTrackedKey(key) {
    return state.retrySources[key] || key;
  };

  app.setTimerProgress = function setTimerProgress(element, options) {
    if (!element) return;

    const secondsLeft = Math.max(0, options?.secondsLeft ?? 0);
    const totalSeconds = Math.max(1, options?.totalSeconds ?? 1);
    const progress = Math.max(0, Math.min(100, (secondsLeft / totalSeconds) * 100));
    const tone = options?.tone || '';
    const valueElement = element.querySelector('.timer-value');
    const progressRing = element.querySelector('.timer-ring-progress');
    const text = options?.text ?? app.formatSeconds(secondsLeft);

    element.classList.add('exam-timer');
    element.classList.remove('ok', 'warn');
    if (tone) element.classList.add(tone);
    element.style.setProperty('--timer-progress', `${progress}`);
    if (valueElement) valueElement.textContent = text;
    else element.textContent = text;
    if (progressRing) progressRing.style.strokeDashoffset = String(100 - progress);
    element.setAttribute('aria-label', `Time remaining ${text}`);
  };

  app.setGlobalTimer = function setGlobalTimer(options) {
    const shell = document.getElementById('global-timer-shell');
    const timer = document.getElementById('global-timer');
    const label = document.getElementById('global-timer-label');
    const mode = document.getElementById('global-timer-mode');

    if (!shell || !timer) return;

    if (!options || options.visible === false) {
      shell.classList.add('hidden');
      return;
    }

    shell.classList.remove('hidden');
    if (label) label.textContent = options.label || 'Active Timer';
    if (mode) mode.textContent = options.mode || '';
    app.setTimerProgress(timer, options);
  };

  app.syncGlobalTimer = function syncGlobalTimer() {
    const examTotalSeconds = app.getDefaultState().examSecondsLeft;

    if (state.examActive) {
      const hours = Math.floor(state.examSecondsLeft / 3600);
      const minutes = Math.floor((state.examSecondsLeft % 3600) / 60);
      const seconds = state.examSecondsLeft % 60;
      const text = hours > 0
        ? `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
        : `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

      app.setGlobalTimer({
        visible: true,
        label: 'Active Timer',
        mode: 'Exam Simulator',
        text,
        secondsLeft: state.examSecondsLeft,
        totalSeconds: examTotalSeconds,
        tone: state.examSecondsLeft > 1800 ? 'ok' : state.examSecondsLeft > 300 ? 'warn' : ''
      });
      return;
    }

    if (state.dayCheckpoint && !state.dayCheckpoint.submitted) {
      const totalSeconds = (DAY_CHECKPOINTS[state.dayCheckpoint.dayIndex]?.timeMinutes || 30) * 60;
      app.setGlobalTimer({
        visible: true,
        label: 'Active Timer',
        mode: `Checkpoint · ${DAYS[state.dayCheckpoint.dayIndex]?.title || 'Current Day'}`,
        text: app.formatSeconds(state.dayCheckpoint.secondsLeft),
        secondsLeft: state.dayCheckpoint.secondsLeft,
        totalSeconds,
        tone: state.dayCheckpoint.secondsLeft > 600 ? 'ok' : 'warn'
      });
      return;
    }

    app.setGlobalTimer({ visible: false });
  };
})();
