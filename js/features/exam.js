(function () {
  const app = window.App;
  const state = app.state;
  const EXAM_TOTAL_SECONDS = 7200;
  app.EXAM_TOTAL_SECONDS = EXAM_TOTAL_SECONDS;

  app.updateExamTimerUI = function updateExamTimerUI() {
    const timer = document.getElementById('exam-timer');

    if (!state.examActive) {
      if (timer) {
        const timerText = timer.querySelector('.timer-value')?.textContent || '120:00';
        app.setTimerProgress(timer, {
          text: timerText,
          secondsLeft: timerText === '--:--' ? 0 : EXAM_TOTAL_SECONDS,
          totalSeconds: EXAM_TOTAL_SECONDS,
          tone: timerText === '--:--' ? '' : 'ok'
        });
      }
      app.syncGlobalTimer();
      return;
    }

    const hours = Math.floor(state.examSecondsLeft / 3600);
    const minutes = Math.floor((state.examSecondsLeft % 3600) / 60);
    const seconds = state.examSecondsLeft % 60;
    const timeString = hours > 0
      ? `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
      : `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    const tone = state.examSecondsLeft > 1800 ? 'ok' : state.examSecondsLeft > 300 ? 'warn' : '';

    if (timer) {
      app.setTimerProgress(timer, {
        text: timeString,
        secondsLeft: state.examSecondsLeft,
        totalSeconds: EXAM_TOTAL_SECONDS,
        tone
      });
    }
    app.syncGlobalTimer();
  };

  app.startExam = function startExam() {
    state.examActive = true;
    state.examSecondsLeft = EXAM_TOTAL_SECONDS;
    document.getElementById('start-exam-btn').classList.add('hidden');
    document.getElementById('submit-exam-btn').classList.remove('hidden');
    document.getElementById('exam-status-text').textContent = 'Exam in progress — good luck!';

    const marks = [10, 15, 15, 15, 25, 20];
    let html = '';

    EXAM_Q.forEach((question, index) => {
      if (!question) return;
      html += `<div class="quiz-wrap">
        <div class="quiz-header">
          <span class="quiz-type-badge code">code</span>
          <span class="quiz-q-num">S${Math.floor(index / 2) + 1}-Q${(index % 2) + 1}</span>
          <span class="quiz-mark-label">${marks[index]} marks</span>
        </div>
        <div class="quiz-body">
          <div class="quiz-prompt">${app.formatPrompt(question.q)}</div>
          <textarea class="code-editor" id="exam-ed-${index}" placeholder="Write your answer here..." spellcheck="false">${app.escapeHtml(app.getDraftValue(`exam-ed-${index}`))}</textarea>
          <div class="action-row"><button class="btn btn-secondary" data-action="run-code" data-key="exam-${index}">▶ Run Code</button><button class="btn btn-secondary clear-btn" data-action="clear-editor" data-editor-id="exam-ed-${index}">Clear</button></div><div class="run-output hint" id="run-output-exam-${index}">Run output will appear here after you click Run Code.</div>
        </div>
      </div>`;
    });

    document.getElementById('exam-questions').innerHTML = html;
    document.getElementById('exam-results').classList.add('hidden');
  app.updateExamTimerUI();
    app.attachEditorListeners();

    if (state.examTimer) clearInterval(state.examTimer);
    state.examTimer = setInterval(app.tickExam, 1000);
  };

  app.tickExam = function tickExam() {
    state.examSecondsLeft--;
    app.updateExamTimerUI();

    const hours = Math.floor(state.examSecondsLeft / 3600);
    const minutes = Math.floor((state.examSecondsLeft % 3600) / 60);

    document.getElementById('exam-prog-text').textContent = `${(hours * 60) + minutes} minutes remaining`;

    if (state.examSecondsLeft <= 0) {
      clearInterval(state.examTimer);
      app.submitExam();
    }
  };

  app.submitExam = function submitExam() {
    clearInterval(state.examTimer);
    state.examActive = false;
    document.getElementById('start-exam-btn').classList.remove('hidden');
    document.getElementById('submit-exam-btn').classList.add('hidden');
    document.getElementById('start-exam-btn').textContent = 'Retake Exam';

    const marks = [10, 15, 15, 15, 25, 20];
    let totalEarned = 0;
    let totalPossible = 0;
    let breakdownHtml = '';
    const breakdownData = [];

    EXAM_Q.forEach((question, index) => {
      if (!question) return;
      totalPossible += marks[index];
      const value = app.getEditorValue('exam-ed-' + index).trim();
      const result = app.evaluateCodeAnswer(question, value);
      const earned = Math.round(result.score * marks[index]);
      totalEarned += earned;
      breakdownData.push({
        label: `S${Math.floor(index / 2) + 1}-Q${(index % 2) + 1}`,
        earned,
        possible: marks[index]
      });
      breakdownHtml += `<div class="rb-card"><div class="rb-num">${earned}/${marks[index]}</div><div class="rb-label">S${Math.floor(index / 2) + 1}-Q${(index % 2) + 1}</div></div>`;
    });

    const pct = Math.round((totalEarned / totalPossible) * 100);
    const pass = pct >= 40;

    state.examHistory.unshift({
      timestamp: new Date().toISOString(),
      totalEarned,
      totalPossible,
      pct,
      pass,
      breakdown: breakdownData
    });
    state.examHistory = state.examHistory.slice(0, 12);
    app.saveState();

    document.getElementById('exam-questions').innerHTML = '';
    const resultsElement = document.getElementById('exam-results');
    resultsElement.classList.remove('hidden');
    resultsElement.innerHTML = `<div class="result-screen">
      <div class="result-pct ${pass ? 'pass' : 'fail'}">${pct}%</div>
      <div class="result-grade">${pass ? '✓ PASS — Target met!' : '✗ Not yet — keep practising'}</div>
      <p class="result-summary-copy">${totalEarned} / ${totalPossible} marks &nbsp;·&nbsp; ${pass ? 'You\'re exam-ready!' : 'You need ' + Math.ceil((totalPossible * 0.4) - totalEarned) + ' more marks for a pass'}</p>
      <div class="result-breakdown">${breakdownHtml}</div>
      <div class="result-actions">
        <button class="btn btn-primary" data-action="start-exam">Retake Exam</button>
        <button class="btn btn-secondary" data-action="show-panel" data-panel="practice">More Practice</button>
      </div>
    </div>`;

    document.getElementById('exam-status-text').textContent = 'Exam complete';
    app.setTimerProgress(document.getElementById('exam-timer'), {
      text: '--:--',
      secondsLeft: 0,
      totalSeconds: EXAM_TOTAL_SECONDS,
      tone: ''
    });
    app.syncGlobalTimer();
    app.renderExamHistory();
  };

  app.renderExamHistory = function renderExamHistory() {
    const historyElement = document.getElementById('exam-history');
    if (!historyElement) return;

    if (!state.examHistory.length) {
      historyElement.innerHTML = '<div class="exam-history-wrap"><div class="page-sub section-sub-no-margin">Past test review will appear here after you submit exam attempts.</div></div>';
      return;
    }

    const scores = state.examHistory.map(item => item.pct);
    const best = Math.max(...scores);
    const average = Math.round(scores.reduce((sum, item) => sum + item, 0) / scores.length);
    const recent = state.examHistory[0].pct;

    historyElement.innerHTML = `<div class="exam-history-wrap">
      <div class="page-title section-title-compact">Past Test Review</div>
      <div class="page-sub section-sub-no-margin">Track how your mock exam results are moving over time.</div>
      <div class="exam-history-summary">
        <div class="exam-history-card"><strong>${state.examHistory.length}</strong><span>Attempts</span></div>
        <div class="exam-history-card"><strong>${best}%</strong><span>Best Score</span></div>
        <div class="exam-history-card"><strong>${average}%</strong><span>Average Score</span></div>
        <div class="exam-history-card"><strong>${recent}%</strong><span>Latest Score</span></div>
      </div>
      <div class="attempt-list">${state.examHistory.map(attempt => `
        <div class="attempt-item">
          <div class="attempt-top">
            <div>
              <div class="attempt-grade ${attempt.pass ? 'pass' : 'fail'}">${attempt.pct}%</div>
              <div class="attempt-meta">${attempt.totalEarned} / ${attempt.totalPossible} marks · ${attempt.pass ? 'Pass target met' : 'Below pass target'}</div>
            </div>
            <div class="attempt-meta">${new Date(attempt.timestamp).toLocaleString()}</div>
          </div>
          <div class="attempt-breakdown">${attempt.breakdown.map(item => `<div class="rb-card"><div class="rb-num">${item.earned}/${item.possible}</div><div class="rb-label">${item.label}</div></div>`).join('')}</div>
        </div>`).join('')}
      </div>
    </div>`;
  };
})();
