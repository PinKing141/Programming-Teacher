(function () {
  const app = window.App;
  const state = app.state;

  app.saveState = function saveState() {
    localStorage.setItem('cpp_tutor_save', JSON.stringify({
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
    }));
  };

  app.loadState = function loadState() {
    try {
      const saved = localStorage.getItem('cpp_tutor_save');
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

  app.resetEverything = function resetEverything() {
    const confirmed = window.confirm('Reset all saved progress, code drafts, scores, streaks, answered questions, and past test history?');
    if (!confirmed) return;

    localStorage.removeItem('cpp_tutor_save');

    if (app.runtime.drillTimer) {
      clearInterval(app.runtime.drillTimer);
      app.runtime.drillTimer = null;
    }

    if (state.examTimer) clearInterval(state.examTimer);
    if (state.dayCheckpointTimer) clearInterval(state.dayCheckpointTimer);

    Object.assign(state, app.getDefaultState());

    document.getElementById('rq-output').innerHTML = '<div class="empty-state"><div class="es-icon">🎲</div><h3>Click Generate Question to start</h3><p>Questions are picked randomly based on your filters.</p></div>';
    document.getElementById('exam-questions').innerHTML = '';
    document.getElementById('exam-results').classList.add('hidden');
    document.getElementById('start-exam-btn').classList.remove('hidden');
    document.getElementById('start-exam-btn').textContent = 'Start Exam';
    document.getElementById('submit-exam-btn').classList.add('hidden');
    document.getElementById('exam-status-text').textContent = 'Ready to start';
    document.getElementById('exam-prog-text').textContent = '3 Scenarios · 6 Questions · 100 marks';
    app.setTimerProgress(document.getElementById('exam-timer'), {
      text: '120:00',
      secondsLeft: app.getDefaultState().examSecondsLeft,
      totalSeconds: app.getDefaultState().examSecondsLeft,
      tone: 'ok'
    });
    app.syncGlobalTimer();

    app.goDay(0);
    app.updateDayBadge();
    app.renderExamHistory();
    app.renderDayCheckpointPanel();
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
