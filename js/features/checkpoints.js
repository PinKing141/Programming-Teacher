(function () {
  const app = window.App;
  const state = app.state;

  app.getCurrentCheckpointQuestionKey = function getCurrentCheckpointQuestionKey(questionIndex) {
    return `checkpoint-${state.dayCheckpoint.attemptId}-${questionIndex}`;
  };

  app.startDayCheckpoint = function startDayCheckpoint(dayIndex) {
    const checkpoint = DAY_CHECKPOINTS[dayIndex];
    if (!checkpoint) return;

    if (state.dayCheckpointTimer) clearInterval(state.dayCheckpointTimer);

    state.dayCheckpoint = {
      dayIndex,
      attemptId: String(Date.now()),
      secondsLeft: checkpoint.timeMinutes * 60,
      submitted: false,
      result: null
    };

    app.saveState();
    app.showPanel('checkpoint');
    app.startCheckpointTimer();
  };

  app.startCheckpointTimer = function startCheckpointTimer() {
    if (!state.dayCheckpoint || state.dayCheckpoint.submitted) return;
    if (state.dayCheckpointTimer) clearInterval(state.dayCheckpointTimer);

    state.dayCheckpointTimer = setInterval(() => {
      if (!state.dayCheckpoint || state.dayCheckpoint.submitted) {
        clearInterval(state.dayCheckpointTimer);
        return;
      }

      state.dayCheckpoint.secondsLeft--;
      app.saveState();
      app.updateCheckpointTimerUI();

      if (state.dayCheckpoint.secondsLeft <= 0) {
        app.submitDayCheckpoint(true);
      }
    }, 1000);
  };

  app.updateCheckpointTimerUI = function updateCheckpointTimerUI() {
    if (!state.dayCheckpoint) {
      app.syncGlobalTimer();
      return;
    }

    const timerElement = document.getElementById('checkpoint-timer');
    const statusElement = document.getElementById('checkpoint-status');
    const headerElement = document.getElementById('checkpoint-header');
    const totalSeconds = (DAY_CHECKPOINTS[state.dayCheckpoint.dayIndex]?.timeMinutes || 30) * 60;
    const tone = state.dayCheckpoint.submitted ? 'ok' : state.dayCheckpoint.secondsLeft > 600 ? 'ok' : 'warn';

    if (timerElement) {
      app.setTimerProgress(timerElement, {
        text: state.dayCheckpoint.submitted ? '--:--' : app.formatSeconds(state.dayCheckpoint.secondsLeft),
        secondsLeft: state.dayCheckpoint.submitted ? 0 : state.dayCheckpoint.secondsLeft,
        totalSeconds,
        tone
      });
    }

    if (statusElement) {
      statusElement.textContent = state.dayCheckpoint.submitted
        ? (state.dayCheckpoint.result?.strong ? 'Checkpoint complete — strong enough to move on' : 'Checkpoint complete — review before moving on')
        : 'Checkpoint in progress';
    }

    if (headerElement) {
      headerElement.classList.add('sticky-header');
    }

    app.syncGlobalTimer();
  };

  app.submitDayCheckpoint = function submitDayCheckpoint(fromTimer) {
    if (!state.dayCheckpoint || state.dayCheckpoint.submitted) return;

    if (state.dayCheckpointTimer) clearInterval(state.dayCheckpointTimer);
    state.dayCheckpoint.submitted = true;

    const checkpoint = DAY_CHECKPOINTS[state.dayCheckpoint.dayIndex];
    const marks = app.getCheckpointMarks();
    let totalEarned = 0;
    let totalPossible = 0;

    const breakdown = checkpoint.questions.map((question, questionIndex) => {
      const key = app.getCurrentCheckpointQuestionKey(questionIndex);
      const possible = marks[questionIndex] || 25;
      totalPossible += possible;

      let earned = 0;
      if (question.type === 'mcq') {
        earned = state.answered[key] === true ? possible : 0;
      } else {
        const value = app.getEditorValue('ed-' + key).trim();
        const result = app.evaluateCodeAnswer(question, value);
        earned = Math.round(result.score * possible);
      }

      totalEarned += earned;
      return {
        label: `Q${questionIndex + 1}`,
        earned,
        possible,
        diff: question.diff
      };
    });

    const pct = Math.round((totalEarned / totalPossible) * 100);
    const strong = pct >= 70;

    state.dayCheckpoint.result = {
      timestamp: new Date().toISOString(),
      totalEarned,
      totalPossible,
      pct,
      strong,
      timedOut: !!fromTimer,
      breakdown
    };

    state.dayCheckpointHistory.unshift({
      dayIndex: state.dayCheckpoint.dayIndex,
      title: DAYS[state.dayCheckpoint.dayIndex].title,
      attemptId: state.dayCheckpoint.attemptId,
      ...state.dayCheckpoint.result
    });
    state.dayCheckpointHistory = state.dayCheckpointHistory.slice(0, 20);

    app.saveState();
    app.renderDayCheckpointPanel();
    app.syncGlobalTimer();
  };

  app.buildCheckpointHistory = function buildCheckpointHistory() {
    if (!state.dayCheckpointHistory.length) {
      return '<div class="checkpoint-history-wrap"><div class="page-sub section-sub-no-margin">Checkpoint attempts will appear here after you finish a day exam.</div></div>';
    }

    return `<div class="checkpoint-history-wrap">
      <div class="page-title section-title-compact">Checkpoint Review</div>
      <div class="page-sub section-sub-no-margin">See how your end-of-day procedural exams are improving.</div>
      ${state.dayCheckpointHistory.map(attempt => `
        <div class="attempt-item">
          <div class="attempt-top">
            <div>
              <div class="attempt-grade ${attempt.strong ? 'pass' : 'fail'}">${attempt.pct}%</div>
              <div class="attempt-meta">${attempt.title} · ${attempt.totalEarned} / ${attempt.totalPossible} marks${attempt.timedOut ? ' · Time elapsed' : ''}</div>
            </div>
            <div class="attempt-meta">${new Date(attempt.timestamp).toLocaleString()}</div>
          </div>
          <div class="attempt-breakdown">${attempt.breakdown.map(item => `<div class="rb-card"><div class="rb-num">${item.earned}/${item.possible}</div><div class="rb-label">${item.label} · ${item.diff}</div></div>`).join('')}</div>
        </div>`).join('')}
    </div>`;
  };

  app.renderDayCheckpointPanel = function renderDayCheckpointPanel() {
    const container = document.getElementById('checkpoint-content');
    if (!container) return;

    if (!state.dayCheckpoint) {
      container.innerHTML = `<div class="checkpoint-empty"><h3 class="empty-title">No day checkpoint running</h3><p class="empty-copy">Finish a study day, then click Complete Day to launch a short timed procedural exam.</p><button class="btn btn-primary" data-action="start-day-checkpoint" data-day="${Math.min(state.day, 4)}">Start Current Day Checkpoint</button></div>${app.buildCheckpointHistory()}`;
      return;
    }

    const checkpoint = DAY_CHECKPOINTS[state.dayCheckpoint.dayIndex];
    const marks = app.getCheckpointMarks();
    const statusText = state.dayCheckpoint.submitted
      ? (state.dayCheckpoint.result?.strong ? 'Checkpoint complete — strong enough to move on' : 'Checkpoint complete — review before moving on')
      : 'Checkpoint in progress';

    let questionsHtml = '';
    checkpoint.questions.forEach((question, questionIndex) => {
      questionsHtml += `<div class="checkpoint-question-block">${app.buildQuizCard(question, app.getCurrentCheckpointQuestionKey(questionIndex), questionIndex + 1)}</div>`;
    });

    const resultHtml = state.dayCheckpoint.result
      ? `<div class="result-screen result-screen-spaced">
        <div class="result-pct ${state.dayCheckpoint.result.strong ? 'pass' : 'fail'}">${state.dayCheckpoint.result.pct}%</div>
        <div class="result-grade">${state.dayCheckpoint.result.strong ? 'Checkpoint Cleared' : 'Needs Another Pass'}</div>
        <p class="result-summary-copy">${state.dayCheckpoint.result.totalEarned} / ${state.dayCheckpoint.result.totalPossible} marks${state.dayCheckpoint.result.timedOut ? ' · Timer ended before submission' : ''}</p>
        <div class="result-breakdown">${state.dayCheckpoint.result.breakdown.map(item => `<div class="rb-card"><div class="rb-num">${item.earned}/${item.possible}</div><div class="rb-label">${item.label} · ${item.diff}</div></div>`).join('')}</div>
        <div class="result-actions result-actions-wrap">
          <button class="btn btn-primary" data-action="start-day-checkpoint" data-day="${state.dayCheckpoint.dayIndex}">Retry Checkpoint</button>
          ${state.dayCheckpoint.dayIndex < 4 ? `<button class="btn btn-secondary" data-action="go-day" data-day="${state.dayCheckpoint.dayIndex + 1}">Continue to Next Day</button>` : '<button class="btn btn-secondary" data-action="show-panel" data-panel="exam">Go To Full Mock</button>'}
        </div>
      </div>`
      : '';

    container.innerHTML = `<div class="exam-header sticky-header" id="checkpoint-header">
      <div class="exam-timer ${state.dayCheckpoint.submitted ? 'ok' : state.dayCheckpoint.secondsLeft > 600 ? 'ok' : 'warn'}" id="checkpoint-timer" aria-label="Time remaining ${state.dayCheckpoint.submitted ? '--:--' : app.formatSeconds(state.dayCheckpoint.secondsLeft)}">
        <svg viewBox="0 0 72 72" aria-hidden="true" focusable="false">
          <circle class="timer-ring-track" cx="36" cy="36" r="30" pathLength="100"></circle>
          <circle class="timer-ring-progress" cx="36" cy="36" r="30" pathLength="100"></circle>
        </svg>
        <span class="timer-value">${state.dayCheckpoint.submitted ? '--:--' : app.formatSeconds(state.dayCheckpoint.secondsLeft)}</span>
      </div>
      <div class="exam-info">
        <h2>${DAYS[state.dayCheckpoint.dayIndex].title}</h2>
        <p class="exam-prog">4 Questions · 30 Minutes · ${marks.reduce((sum, item) => sum + item, 0)} marks</p>
        <p class="checkpoint-status-copy" id="checkpoint-status">${statusText}</p>
      </div>
      ${state.dayCheckpoint.submitted ? '' : '<button class="btn btn-primary exam-action-btn exam-submit-btn" data-action="submit-day-checkpoint">Submit Checkpoint</button>'}
    </div>
    ${state.dayCheckpoint.submitted ? '' : questionsHtml}
    ${resultHtml}
    ${app.buildCheckpointHistory()}`;

    app.attachEditorListeners();
    app.updateCheckpointTimerUI();
    hljs.highlightAll();
  };
})();
