(function () {
  const app = window.App;
  const state = app.state;
  const runtime = app.runtime;

  app.renderPracticeQuestion = function renderPracticeQuestion(pick, headerText, labelText, customKey) {
    runtime.rqCurrent = pick.q;
    state.rqIndex++;
    const questionKey = customKey || 'rq-' + state.rqIndex;
    document.getElementById('rq-output').innerHTML = `<div class="practice-context-label">${headerText}</div>${app.buildQuizCard(pick.q, questionKey, labelText || state.rqIndex)}`;
    app.attachEditorListeners();
    hljs.highlightAll();
    return questionKey;
  };

  app.generateQuestion = function generateQuestion() {
    app.stopDrillTimer();
    const topicValue = document.getElementById('rq-topic').value;
    const difficulty = document.getElementById('rq-diff').value;
    const type = document.getElementById('rq-type').value;
    const output = document.getElementById('rq-output');

    const pool = [];
    const days = topicValue === 'all' ? DAYS : [DAYS[parseInt(topicValue, 10)]];
    days.forEach(day => day.questions.forEach(question => {
      if ((difficulty === 'all' || question.diff === difficulty) && (type === 'all' || question.type === type)) {
        pool.push({ q: question, dayTitle: day.title });
      }
    }));

    if (!pool.length) {
      output.innerHTML = '<div class="empty-state"><div class="es-icon">😕</div><h3>No questions match those filters</h3><p>Try changing the topic, difficulty, or type.</p></div>';
      return;
    }

    const pick = pool[Math.floor(Math.random() * pool.length)];
    app.renderPracticeQuestion(pick, `From: ${pick.dayTitle}`);
  };

  app.generateWeakness = function generateWeakness() {
    app.stopDrillTimer();
    const pool = [];

    DAYS.forEach((day, dayIndex) => {
      day.questions.forEach((question, questionIndex) => {
        const key = `learn-${dayIndex}-${questionIndex}`;
        if (state.answered[key] === false) {
          pool.push({ q: question, dayTitle: day.title, originalKey: key });
        }
      });
    });

    const output = document.getElementById('rq-output');
    if (!pool.length) {
      output.innerHTML = '<div class="empty-state"><div class="es-icon">💪</div><h3>No weaknesses found!</h3><p>You haven\'t gotten any questions wrong yet, or you\'ve fixed them all. Great job!</p></div>';
      return;
    }

    const pick = pool[Math.floor(Math.random() * pool.length)];
    const questionKey = 'rq-' + (state.rqIndex + 1);
    state.retrySources[questionKey] = pick.originalKey;

    app.renderPracticeQuestion(pick, `🎯 TARGETING WEAKNESS FROM: ${pick.dayTitle}`, 'WEAKNESS', questionKey);
  };

  app.getPassQuestionPool = function getPassQuestionPool() {
    return [
      { q: DAYS[0].questions.find(question => question.type === 'code' && typeof question.ans === 'string' && question.ans.includes('Update_Points')), dayTitle: DAYS[0].title },
      { q: DAYS[1].questions.find(question => question.type === 'code' && typeof question.ans === 'string' && question.ans.includes('Total_Sand_Diff')), dayTitle: DAYS[1].title },
      { q: DAYS[3].questions.find(question => question.type === 'code' && typeof question.ans === 'string' && question.ans.includes('class Ship')), dayTitle: DAYS[3].title },
      { q: DAYS[4].questions.find(question => question.type === 'code' && typeof question.ans === 'string' && question.ans.includes('EvilAccount')), dayTitle: DAYS[4].title },
      ...DAYS[5].questions.map(question => ({ q: question, dayTitle: DAYS[5].title }))
    ].filter(item => item.q);
  };

  app.startPassDrill = function startPassDrill() {
    app.stopDrillTimer();
    app.showPanel('practice');
    const pool = app.getPassQuestionPool();
    const pick = pool[Math.floor(Math.random() * pool.length)];
    app.renderPracticeQuestion(pick, `PASS DRILL: ${pick.dayTitle}`, 'PASS');
  };

  app.openRealExamDay = function openRealExamDay() {
    app.goDay(5);
  };

  app.startPassMock = function startPassMock() {
    app.showPanel('exam');
    app.startExam();
  };

  app.startSpeedDrill = function startSpeedDrill() {
    app.generateQuestion();
    const output = document.getElementById('rq-output');
    if (output.querySelector('.empty-state')) return;

    runtime.drillSeconds = 180;
    document.getElementById('drill-timer-container').style.display = 'block';
    app.updateDrillDisplay();

    if (runtime.drillTimer) clearInterval(runtime.drillTimer);
    runtime.drillTimer = setInterval(() => {
      runtime.drillSeconds--;
      app.updateDrillDisplay();
      if (runtime.drillSeconds <= 0) app.timeOutDrill();
    }, 1000);
  };

  app.updateDrillDisplay = function updateDrillDisplay() {
    const minutes = Math.floor(runtime.drillSeconds / 60);
    const seconds = runtime.drillSeconds % 60;
    document.getElementById('drill-timer').textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  app.timeOutDrill = function timeOutDrill() {
    clearInterval(runtime.drillTimer);
    const key = 'rq-' + state.rqIndex;

    if (state.answered[key] === undefined) {
      state.answered[key] = false;
      app.recordScore(false);

      const quizWrap = document.getElementById('qw-' + key);
      if (quizWrap) {
        quizWrap.querySelectorAll('button').forEach(element => {
          element.disabled = true;
        });
        app.setEditorReadOnly('ed-' + key, true);
        const feedback = document.getElementById('fb-' + key) || document.createElement('div');
        if (!document.getElementById('fb-' + key)) {
          feedback.id = 'fb-' + key;
          const content = document.createElement('div');
          content.className = 'feedback-content';
          content.id = 'fbc-' + key;
          feedback.appendChild(content);
          quizWrap.querySelector('.quiz-body').appendChild(feedback);
        }
        feedback.className = 'feedback fail';
        feedback.style.display = 'block';
        feedback.querySelector('.feedback-content').innerHTML = '<strong>⏰ TIME\'S UP!</strong> You must complete questions within 3 minutes for the real exam speed.';
      }
      app.updateDayBadge();
    }

    document.getElementById('drill-timer-container').style.display = 'none';
  };

  app.stopDrillTimer = function stopDrillTimer() {
    if (runtime.drillTimer) clearInterval(runtime.drillTimer);
    document.getElementById('drill-timer-container').style.display = 'none';
  };
})();
