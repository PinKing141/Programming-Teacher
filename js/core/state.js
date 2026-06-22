(function () {
  const app = window.App;
  const state = app.state;
  const LEGACY_SAVE_KEY = 'cpp_tutor_save';
  const ACCOUNT_META_KEY = 'cpp_tutor_accounts';
  const CURRENT_ACCOUNT_KEY = 'cpp_tutor_current_account';
  const ACCOUNT_SAVE_PREFIX = 'cpp_tutor_save::';
  const PROFILE_SAVE_PREFIX = 'cpp_tutor_profile::';

  function makeAccountId(name) {
    return (name || 'learner')
      .toString()
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'learner';
  }

  function getAccountSaveKey(accountId = app.currentAccountId) {
    return `${PROFILE_SAVE_PREFIX}${accountId}`;
  }

  function getStoredAccounts() {
    try {
      const parsed = JSON.parse(localStorage.getItem(ACCOUNT_META_KEY) || '[]');
      return Array.isArray(parsed) ? parsed.filter(account => account && account.id && account.name) : [];
    } catch (error) {
      console.error('Failed to load accounts', error);
      return [];
    }
  }

  function storeAccounts(accounts) {
    localStorage.setItem(ACCOUNT_META_KEY, JSON.stringify(accounts));
  }

  function ensureAccounts() {
    let accounts = getStoredAccounts();

    if (!accounts.length) {
      accounts = [{ id: 'default', name: 'Default' }];
      const legacySave = localStorage.getItem(LEGACY_SAVE_KEY);
      const oldAccountSave = localStorage.getItem(`${ACCOUNT_SAVE_PREFIX}default`);
      if ((legacySave || oldAccountSave) && !localStorage.getItem(getAccountSaveKey('default'))) {
        localStorage.setItem(getAccountSaveKey('default'), legacySave || oldAccountSave);
      }
      storeAccounts(accounts);
    }

    const hadSavedChoice = Boolean(localStorage.getItem(CURRENT_ACCOUNT_KEY));
    let currentId = localStorage.getItem(CURRENT_ACCOUNT_KEY);
    if (!accounts.some(account => account.id === currentId)) currentId = accounts[0].id;
    app.profileChoiceNeeded = app.profileChoiceNeeded || !hadSavedChoice;
    localStorage.setItem(CURRENT_ACCOUNT_KEY, currentId);

    app.accounts = accounts;
    app.currentAccountId = currentId;
    return accounts;
  }

  function getSerializableState() {
    return {
      day: state.day,
      panel: state.panel,
      answered: state.answered,
      codeDrafts: state.codeDrafts,
      correct: state.correct,
      total: state.total,
      streak: state.streak,
      bestStreak: state.bestStreak,
      dayCheckpoint: state.dayCheckpoint,
      dayCheckpointHistory: state.dayCheckpointHistory,
      examHistory: state.examHistory
    };
  }

  function stopActiveTimers() {
    if (app.runtime.drillTimer) {
      clearInterval(app.runtime.drillTimer);
      app.runtime.drillTimer = null;
    }
    if (state.examTimer) clearInterval(state.examTimer);
    if (state.dayCheckpointTimer) clearInterval(state.dayCheckpointTimer);
  }

  function getCurrentAccount() {
    ensureAccounts();
    return app.accounts.find(account => account.id === app.currentAccountId) || app.accounts[0];
  }

  app.renderAccountPicker = function renderAccountPicker() {
    const select = document.getElementById('account-select');
    const currentName = document.getElementById('current-profile-name');
    ensureAccounts();

    if (select) {
      select.innerHTML = app.accounts
        .map(account => `<option value="${app.escapeHtml(account.id)}" ${account.id === app.currentAccountId ? 'selected' : ''}>${app.escapeHtml(account.name)}</option>`)
        .join('');
    }

    if (currentName) currentName.textContent = getCurrentAccount().name;
    app.renderProfileChooser();
  };

  app.renderProfileChooser = function renderProfileChooser() {
    const list = document.getElementById('profile-list');
    if (!list) return;

    ensureAccounts();
    list.innerHTML = app.accounts.map(account => {
      const isCurrent = account.id === app.currentAccountId;
      return `
        <button type="button" class="profile-choice ${isCurrent ? 'active' : ''}" data-action="select-profile" data-profile-id="${app.escapeHtml(account.id)}">
          <span>${app.escapeHtml(account.name)}</span>
          <small>${isCurrent ? 'Current profile' : 'Use this profile'}</small>
        </button>`;
    }).join('');
  };

  app.openProfileChooser = function openProfileChooser(force = false) {
    const gate = document.getElementById('profile-gate');
    const closeButton = document.getElementById('profile-close-btn');
    if (!gate) return;

    app.renderProfileChooser();
    gate.classList.remove('hidden');
    if (closeButton) closeButton.classList.toggle('hidden', force);
    const input = document.getElementById('new-profile-name');
    if (input) input.focus();
  };

  app.closeProfileChooser = function closeProfileChooser() {
    const gate = document.getElementById('profile-gate');
    if (gate) gate.classList.add('hidden');
  };

  app.refreshForCurrentAccount = function refreshForCurrentAccount() {
    const rqOutput = document.getElementById('rq-output');
    const examQuestions = document.getElementById('exam-questions');
    const examResults = document.getElementById('exam-results');
    const startExamButton = document.getElementById('start-exam-btn');
    const submitExamButton = document.getElementById('submit-exam-btn');
    const examStatus = document.getElementById('exam-status-text');
    const examProgress = document.getElementById('exam-prog-text');

    if (rqOutput) rqOutput.innerHTML = '<div class="empty-state"><div class="es-icon">🎲</div><h3>Click Generate Question to start</h3><p>Questions are picked randomly based on your filters.</p></div>';
    if (examQuestions) examQuestions.innerHTML = '';
    if (examResults) examResults.classList.add('hidden');
    if (startExamButton) {
      startExamButton.classList.remove('hidden');
      startExamButton.textContent = 'Start Exam';
    }
    if (submitExamButton) submitExamButton.classList.add('hidden');
    if (examStatus) examStatus.textContent = 'Ready to start';
    if (examProgress) examProgress.textContent = '3 Scenarios · 6 Questions · 100 marks';
    app.setTimerProgress(document.getElementById('exam-timer'), {
      text: '120:00',
      secondsLeft: app.getDefaultState().examSecondsLeft,
      totalSeconds: app.getDefaultState().examSecondsLeft,
      tone: 'ok'
    });

    if (state.dayCheckpoint && !state.dayCheckpoint.submitted) app.startCheckpointTimer();
    if (state.panel === 'checkpoint') app.renderDayCheckpointPanel();
    else app.renderLearnPanel();
    app.showPanel(state.panel || 'learn');
    app.updateDayBadge();
    app.renderExamHistory();
    app.renderDayCheckpointPanel();
    app.syncGlobalTimer();
    app.renderAccountPicker();
  };

  app.saveState = function saveState() {
    ensureAccounts();
    localStorage.setItem(getAccountSaveKey(), JSON.stringify(getSerializableState()));
  };

  app.loadState = function loadState() {
    try {
      ensureAccounts();
      const saved = localStorage.getItem(getAccountSaveKey());
      if (saved) {
        const parsed = JSON.parse(saved);
        state.day = Number.isInteger(parsed.day) ? parsed.day : 0;
        state.panel = parsed.panel || 'learn';
        state.answered = parsed.answered || {};
        state.codeDrafts = parsed.codeDrafts || {};
        state.correct = parsed.correct || 0;
        state.total = parsed.total || 0;
        state.streak = parsed.streak || 0;
        state.bestStreak = parsed.bestStreak || 0;
        state.dayCheckpoint = parsed.dayCheckpoint || null;
        state.dayCheckpointHistory = parsed.dayCheckpointHistory || [];
        state.examHistory = parsed.examHistory || [];
      }
    } catch (error) {
      console.error('Failed to load saved state', error);
    }
  };

  app.createAccount = function createAccount(profileName) {
    const name = typeof profileName === 'string' ? profileName : window.prompt('New local profile name (saved only in this browser):');
    if (!name || !name.trim()) return;

    const accounts = ensureAccounts();
    const baseId = makeAccountId(name);
    let id = baseId;
    let suffix = 2;
    while (accounts.some(account => account.id === id)) id = `${baseId}-${suffix++}`;

    accounts.push({ id, name: name.trim() });
    storeAccounts(accounts);
    app.saveState();
    app.currentAccountId = id;
    localStorage.setItem(CURRENT_ACCOUNT_KEY, id);
    stopActiveTimers();
    Object.assign(state, app.getDefaultState());
    app.saveState();
    app.refreshForCurrentAccount();
    app.closeProfileChooser();
  };

  app.switchAccount = function switchAccount(accountId) {
    ensureAccounts();
    if (!app.accounts.some(account => account.id === accountId)) return;
    if (accountId === app.currentAccountId) {
      app.closeProfileChooser();
      return;
    }

    app.saveState();
    app.currentAccountId = accountId;
    localStorage.setItem(CURRENT_ACCOUNT_KEY, accountId);
    stopActiveTimers();
    Object.assign(state, app.getDefaultState());
    app.loadState();
    app.refreshForCurrentAccount();
    app.closeProfileChooser();
  };

  app.deleteCurrentAccount = function deleteCurrentAccount() {
    const accounts = ensureAccounts();
    const current = accounts.find(account => account.id === app.currentAccountId);
    if (accounts.length === 1) {
      window.alert('Create another profile before deleting this one.');
      return;
    }
    if (!window.confirm(`Delete the local profile "${current.name}" and its saved progress from this browser?`)) return;

    localStorage.removeItem(getAccountSaveKey(current.id));
    const remaining = accounts.filter(account => account.id !== current.id);
    storeAccounts(remaining);
    app.currentAccountId = remaining[0].id;
    localStorage.setItem(CURRENT_ACCOUNT_KEY, app.currentAccountId);
    stopActiveTimers();
    Object.assign(state, app.getDefaultState());
    app.loadState();
    app.refreshForCurrentAccount();
  };

  app.resetEverything = function resetEverything() {
    const confirmed = window.confirm('Reset this profile\'s saved progress, code drafts, scores, streaks, answered questions, and past test history? Other profiles will not be changed.');
    if (!confirmed) return;

    ensureAccounts();
    localStorage.removeItem(getAccountSaveKey());
    stopActiveTimers();

    Object.assign(state, app.getDefaultState());
    app.saveState();
    app.refreshForCurrentAccount();
  };

  app.recordScore = function recordScore(correct) {
    state.total++;
    if (correct) {
      state.correct++;
      state.streak++;
      state.bestStreak = Math.max(state.streak, state.bestStreak);
    } else {
      state.streak = 0;
    }
    app.saveState();
    app.updateScoreBar();
  };

  app.updateScoreBar = function updateScoreBar() {
    const totalQuestions = DAYS.reduce((sum, day) => sum + day.questions.length, 0);
    const done = Object.keys(state.answered).filter(key => !key.includes('_picked') && key.startsWith('learn')).length;
    const correctLearn = Object.keys(state.answered).filter(key => key.startsWith('learn') && !key.includes('_picked') && state.answered[key] === true).length;
    const pct = Math.round((done / totalQuestions) * 100);

    document.getElementById('prog-fill').style.width = pct + '%';
    document.getElementById('prog-label').textContent = `${done} / ${totalQuestions} learn questions completed`;
    document.getElementById('score-chip').textContent = `✓ ${state.correct} correct attempts`;
    document.getElementById('streak-chip').textContent = `🔥 ${state.streak} streak`;
    document.getElementById('sidebar-stats').innerHTML = `Learn Done: ${done}<br>Learn Correct: ${correctLearn}<br>Attempts: ${state.total}<br>Accuracy: ${state.total ? Math.round((state.correct / state.total) * 100) + '%' : '—'}<br>Best Streak: ${state.bestStreak}`;
  };

  app.updateDayBadge = function updateDayBadge() {
    DAYS.forEach((day, dayIndex) => {
      const total = day.questions.length;
      const done = day.questions.filter((_, questionIndex) => state.answered[`learn-${dayIndex}-${questionIndex}`] === true).length;
      const pct = Math.round((done / total) * 100);
      const pctElement = document.getElementById('pct-' + dayIndex);
      if (pctElement) pctElement.textContent = pct + '%';
      const navElement = document.getElementById('nav-' + dayIndex);
      if (navElement) {
        if (pct === 100) navElement.classList.add('done');
        else navElement.classList.remove('done');
      }
    });
    app.updateScoreBar();
  };

  app.getQByKey = function getQByKey(key) {
    const parts = key.split('-');
    if (parts[0] === 'learn') {
      const [, dayIndex, questionIndex] = parts;
      return DAYS[parseInt(dayIndex, 10)]?.questions[parseInt(questionIndex, 10)];
    }

    if (parts[0] === 'checkpoint' && state.dayCheckpoint) {
      const [, attemptId, questionIndex] = parts;
      if (String(state.dayCheckpoint.attemptId) === attemptId) {
        return DAY_CHECKPOINTS[state.dayCheckpoint.dayIndex]?.questions[parseInt(questionIndex, 10)];
      }
    }

    return app.runtime.rqCurrent;
  };
})();
