(function () {
  const app = window.App;
  const state = app.state;

  app.showPanel = function showPanel(panel) {
    state.panel = panel;
    document.querySelectorAll('.panel').forEach(element => element.classList.remove('active'));
    document.getElementById('panel-' + panel).classList.add('active');
    document.querySelectorAll('.mode-btn').forEach(button => {
      button.classList.toggle('active', button.dataset.panel === panel);
    });
    document.querySelectorAll('.mbn-item').forEach(button => {
      button.classList.toggle('active', button.dataset.panel === panel);
    });

    if (panel === 'pass') app.renderPassMode();
    if (panel === 'checkpoint') app.renderDayCheckpointPanel();
    if (panel === 'cheat') app.renderCheatSheet();
    if (panel === 'learn') app.renderLearnPanel();
    if (panel === 'exam') app.renderExamHistory();
    if (panel === 'lab') app.attachEditorListeners();
    if (panel !== 'practice') app.stopDrillTimer();

    app.syncGlobalTimer();
    app.saveState();
    hljs.highlightAll();
  };

  app.goDay = function goDay(dayIndex) {
    state.day = dayIndex;
    document.querySelectorAll('.nav-item').forEach(element => {
      if (element.id && element.id.startsWith('nav-')) {
        element.classList.toggle('active', element.id === 'nav-' + dayIndex);
      }
    });
    app.saveState();
    app.showPanel('learn');
  };

  app.renderLearnPanel = function renderLearnPanel() {
    const day = DAYS[state.day];
    document.getElementById('day-title').textContent = day.title;
    let html = '';

    day.lessons.forEach(lesson => {
      const tip = lesson.tip ? `<div class="tip">${app.formatPrompt(lesson.tip)}</div>` : '';
      const warn = lesson.warn ? `<div class="warn">${app.formatPrompt(lesson.warn)}</div>` : '';
      html += `<div class="lesson-card">
        <h2>${lesson.h} <span class="tag">LESSON</span></h2>
        <p>${app.formatPrompt(lesson.p)}</p>
        <pre><code class="language-cpp">${app.escapeHtml(lesson.code)}</code></pre>
        ${tip}${warn}
      </div>`;
    });

    html += '<div class="learn-section-label">Practice Questions Below ↓</div>';

    day.questions.forEach((question, questionIndex) => {
      html += app.buildQuizCard(question, `learn-${state.day}-${questionIndex}`, questionIndex + 1);
    });

    html += `<div class="learn-nav-actions">
      ${state.day > 0 ? `<button class="btn btn-secondary" data-action="go-day" data-day="${state.day - 1}">← Back</button>` : ''}
      ${state.day < 5 ? `<button class="btn btn-primary" data-action="start-day-checkpoint" data-day="${state.day}">Complete Day</button>` : ''}
      ${state.day < 5 ? `<button class="btn btn-primary" data-action="go-day" data-day="${state.day + 1}">Continue to Next Day →</button>` : '<button class="btn btn-primary" data-action="show-panel" data-panel="exam">Ready for Exam Sim →</button>'}
    </div>`;

    document.getElementById('learn-content').innerHTML = html;
    app.attachEditorListeners();
  };


  app.buildRunTestsPreview = function buildRunTestsPreview(question) {
    const tests = app.getQuestionRunTests(question).filter(test => test && test.call && !test.hidden);
    if (!tests.length) return '';
    return `<details class="run-tests-preview"><summary>Visible run tests</summary><ul>${tests.map(test => `<li><span class="inline-code">${app.escapeHtml(test.call)}</span> → <span class="inline-code">${app.escapeHtml(test.expected)}</span></li>`).join('')}</ul></details>`;
  };

  app.buildQuizCard = function buildQuizCard(question, key, number) {
    const diffClass = { easy: 'badge-easy', medium: 'badge-med', hard: 'badge-hard' }[question.diff];
    const typeLabel = question.type === 'mcq' ? 'mcq' : 'code';
    const done = state.answered[key];

    let body = '';
    if (question.type === 'mcq') {
      body = '<div class="mcq-grid">' + question.opts.map((option, optionIndex) => {
        let classes = '';
        if (done !== undefined) {
          if (optionIndex === question.ans) classes = 'correct';
          else if (optionIndex === state.answered[key + '_picked'] && done === false) classes = 'wrong';
        }
        return `<button class="mcq-opt ${classes}" data-action="answer-mcq" data-key="${key}" data-picked="${optionIndex}" data-correct="${question.ans}" ${done !== undefined ? 'disabled' : ''}>${app.formatPrompt(option)}</button>`;
      }).join('') + '</div>';
    } else {
      const editorId = `ed-${key}`;
      body = `<div class="editor-wrap">
        <textarea class="code-editor" id="${editorId}" placeholder="Write your C++ answer here...&#10;&#10;Tip: use Tab to indent" spellcheck="false">${app.escapeHtml(app.getDraftValue(editorId))}</textarea>
        <div class="editor-hint"><span>Use Tab for indentation</span><span>4 spaces = 1 tab</span></div>
        ${app.buildRunTestsPreview(question)}
      </div>
      <div class="action-row">
        <button class="btn btn-primary" data-action="check-code" data-key="${key}">Check Answer</button>
        <button class="btn btn-secondary" data-action="run-code" data-key="${key}">▶ Run Code</button>
        <button class="btn btn-secondary" data-action="show-hint" data-key="${key}">Hint</button>
        <button class="btn btn-secondary clear-btn" data-action="clear-editor" data-editor-id="${editorId}">Clear</button>
        <button class="btn btn-danger" data-action="reveal-answer" data-key="${key}">Show Answer</button>
      </div>
      <div class="run-output hint" id="run-output-${key}">Run output will appear here after you click Run Code.</div>`;
    }

    const feedbackHtml = done !== undefined && question.type === 'mcq'
      ? `<div class="feedback ${done ? 'pass' : 'fail'}">${done ? '✓ Correct! ' : '✗ Wrong. '}${app.formatPrompt(question.explain)}</div>`
      : `<div class="feedback" id="fb-${key}"><div class="feedback-content" id="fbc-${key}"></div></div>`;

    return `<div class="quiz-wrap" id="qw-${key}">
      <div class="quiz-header">
        <span class="quiz-type-badge ${typeLabel}">${typeLabel}</span>
        <span class="quiz-q-num">Q${number}</span>
        <span class="badge ${diffClass} quiz-diff-badge">${question.diff}</span>
        ${done === true ? '<span class="quiz-status quiz-status-correct">✓ Correct</span>' : done === false ? '<span class="quiz-status quiz-status-attempted">✗ Attempted</span>' : ''}
      </div>
      <div class="quiz-body">
        <div class="quiz-prompt">${app.formatPrompt(question.q)}</div>
        ${body}
        ${feedbackHtml}
      </div>
    </div>`;
  };

  app.answerMcq = function answerMcq(key, picked, correct) {
    const trackedKey = app.resolveTrackedKey(key);
    if (!state.retrySources[key] && state.answered[trackedKey] !== undefined) return;
    const isCorrect = picked === correct;
    const question = app.getQByKey(key);

    if (key.startsWith('rq-')) app.stopDrillTimer();

    state.answered[trackedKey] = isCorrect;
    state.answered[trackedKey + '_picked'] = picked;
    delete state.retrySources[key];
    app.recordScore(isCorrect);

    document.querySelectorAll(`#qw-${key} .mcq-opt`).forEach((button, index) => {
      button.disabled = true;
      if (index === correct) button.classList.add('correct');
      else if (index === picked && !isCorrect) button.classList.add('wrong');
    });

    const feedback = document.getElementById('fb-' + key);
    const content = document.getElementById('fbc-' + key);
    if (feedback) {
      feedback.className = `feedback ${isCorrect ? 'pass' : 'fail'}`;
      content.innerHTML = `<strong>${isCorrect ? '✓ Correct! ' : '✗ Wrong. '}</strong> ${app.formatPrompt(question.explain)}`;
    }
    app.updateDayBadge();
  };

  app.checkCode = function checkCode(key) {
    const question = app.getQByKey(key);
    if (!question) return;
    const trackedKey = app.resolveTrackedKey(key);
    const value = app.getEditorValue('ed-' + key).trim();
    const feedback = document.getElementById('fb-' + key);
    const content = document.getElementById('fbc-' + key);

    if (!value) {
      feedback.className = 'feedback hint';
      content.innerHTML = 'Write some code first, then click Check Answer.';
      return;
    }

    if (value.toLowerCase().includes('cout <<') || value.toLowerCase().includes('cout<<')) {
      feedback.className = 'feedback fail';
      content.innerHTML = '<strong>⚠️ Strict Syntax Error:</strong> You used <code>cout</code>. The exam strictly requires you to <code>return</code> the value, not print it.';
      if (state.answered[trackedKey] === undefined || state.retrySources[key]) {
        app.recordScore(false);
        state.answered[trackedKey] = false;
        app.updateDayBadge();
      }
      delete state.retrySources[key];
      return;
    }

    const result = app.evaluateCodeAnswer(question, value);
    if (result.syntaxIssues.length) {
      feedback.className = 'feedback fail';
      content.innerHTML = `<strong>⚠️ Syntax issue:</strong> ${result.syntaxIssues.join('<br>')}`;
      if (state.answered[trackedKey] === undefined || state.retrySources[key]) {
        app.recordScore(false);
        state.answered[trackedKey] = false;
        app.updateDayBadge();
      }
      delete state.retrySources[key];
      return;
    }

    if (key.startsWith('rq-')) app.stopDrillTimer();

    if (result.score >= 0.85) {
      feedback.className = 'feedback pass';
      content.innerHTML = `<strong>✓ Excellent!</strong> ${result.passed.length}/${app.getUniqueChecks(question.checks).length} key elements found. Your answer looks correct!`;
      if (state.answered[trackedKey] === undefined || state.retrySources[key]) {
        app.recordScore(true);
        state.answered[trackedKey] = true;
        app.updateDayBadge();
      }
    } else if (result.score >= 0.5) {
      feedback.className = 'feedback hint';
      content.innerHTML = `<strong>Almost there.</strong> ${result.passed.length}/${app.getUniqueChecks(question.checks).length} elements found.<br>Missing: <span class="inline-code">${result.missed.slice(0, 3).map(item => app.escapeHtml(item.label)).join('</span>, <span class="inline-code">')}</span><br>Try clicking Hint or fix what\'s missing.`;
      if (state.answered[trackedKey] === undefined || state.retrySources[key]) {
        app.recordScore(false);
        state.answered[trackedKey] = false;
        app.updateDayBadge();
      }
    } else {
      feedback.className = 'feedback fail';
      content.innerHTML = `<strong>Not quite.</strong> ${result.passed.length}/${app.getUniqueChecks(question.checks).length} elements found.<br>Key things missing: <span class="inline-code">${result.missed.slice(0, 4).map(item => app.escapeHtml(item.label)).join('</span>, <span class="inline-code">')}</span><br>Click Hint for a nudge, or Show Answer to see the full solution.`;
      if (state.answered[trackedKey] === undefined || state.retrySources[key]) {
        app.recordScore(false);
        state.answered[trackedKey] = false;
        app.updateDayBadge();
      }
    }

    delete state.retrySources[key];
  };

  app.buildGuidedHint = function buildGuidedHint(question) {
    const checks = app.getUniqueChecks(question.checks || []);
    const importantPieces = checks
      .map(check => `<li><span class="inline-code">${app.escapeHtml(check.label)}</span></li>`)
      .join('');
    const rawHint = question.hint || '';
    const rawAnswer = question.ans || '';
    const hintLooksLikeAnswer = rawHint && app.normalizeCodeFragment(rawHint) === app.normalizeCodeFragment(rawAnswer);
    const safeHint = hintLooksLikeAnswer
      ? rawHint
        .split('\n')
        .map(line => line.trim().startsWith('return') ? '    // TODO: decide the correct value to return here' : line)
        .join('\n')
      : rawHint;

    return `<div class="feedback-header">
        <strong>Guided Hint — try this before showing the answer</strong>
        <button class="feedback-close" type="button" data-action="close-feedback" data-key="${app.escapeHtml(question._activeKey || '')}" aria-label="Close hint">×</button>
      </div>
      <div class="hint-guide">
        <p><strong>Plan:</strong> Read the function name, parameters, and return type from the question. Then write only the code needed to produce the requested return value.</p>
        <ol>
          <li><strong>Signature:</strong> Start with the required return type and exact function name.</li>
          <li><strong>Inputs:</strong> Use the parameter names from the prompt; spelling matters.</li>
          <li><strong>Logic:</strong> Add the condition, loop, class member, or calculation the prompt asks for.</li>
          <li><strong>Return or set:</strong> Use <span class="inline-code">return</span> for value functions. Use assignment for setters. Do not use <span class="inline-code">cout</span>.</li>
        </ol>
        ${importantPieces ? `<p><strong>Your answer should include these key pieces:</strong></p><ul class="hint-checklist">${importantPieces}</ul>` : ''}
      </div>
      <details class="hint-structure" open>
        <summary>Show starter structure</summary>
        <pre><code class="language-cpp">${app.escapeHtml(safeHint || '// Start by matching the function or class shape from the question.')}</code></pre>
      </details>`;
  };

  app.showHint = function showHint(key) {
    const question = app.getQByKey(key);
    const feedback = document.getElementById('fb-' + key);
    const content = document.getElementById('fbc-' + key);
    if (feedback && question) {
      feedback.className = 'feedback info';
      question._activeKey = key;
      content.innerHTML = app.buildGuidedHint(question);
      const code = content.querySelector('code');
      if (code) hljs.highlightElement(code);
      delete question._activeKey;
    }
  };

  app.closeFeedback = function closeFeedback(key) {
    const feedback = document.getElementById('fb-' + key);
    const content = document.getElementById('fbc-' + key);
    if (!feedback || !content) return;
    feedback.className = 'feedback';
    content.innerHTML = '';
  };

  app.buildAnswerExplanation = function buildAnswerExplanation(question) {
    const checks = app.getUniqueChecks(question.checks || []);
    if (!checks.length) return '';

    const pieces = checks
      .map(check => `<li><span class="inline-code">${app.escapeHtml(check.label)}</span> — this is one required part the checker looks for.</li>`)
      .join('');

    return `<div class="answer-explanation">
      <p><strong>Why this works:</strong> The solution mirrors the prompt exactly: match the required function or class shape, use the named inputs, then apply the requested calculation, branch, loop, getter, setter, or inheritance rule.</p>
      <p><strong>Key parts in this answer:</strong></p>
      <ul>${pieces}</ul>
      <p><strong>Exam reminder:</strong> If the question asks for a value, return it. If it asks to update a field, assign the field. Do not print with <span class="inline-code">cout</span> unless the prompt explicitly asks for output.</p>
    </div>`;
  };

  app.revealAnswer = function revealAnswer(key) {
    const question = app.getQByKey(key);
    const feedback = document.getElementById('fb-' + key);
    const content = document.getElementById('fbc-' + key);
    if (feedback && question) {
      feedback.className = 'feedback info';
      content.innerHTML = `<div class="feedback-header">
        <strong>Model Answer</strong>
        <button class="feedback-close" type="button" data-action="close-feedback" data-key="${app.escapeHtml(key)}" aria-label="Close answer">×</button>
      </div><pre><code class="language-cpp">${app.escapeHtml(question.ans)}</code></pre>${app.buildAnswerExplanation(question)}`;
      hljs.highlightElement(content.querySelector('code'));
    }
  };

  app.renderCheatSheet = function renderCheatSheet() {
    const grid = document.getElementById('cheat-grid');
    grid.innerHTML = CHEATSHEET.map(card => `<div class="cheat-card">
      <h3>${card.title}</h3>
      <pre><code class="language-cpp">${app.escapeHtml(card.code)}</code></pre>
    </div>`).join('');
  };

  app.renderPassMode = function renderPassMode() {
    const passContent = document.getElementById('pass-content');
    const winCards = PASS_MODE.winCards.map(card => `<div class="pass-card">
      <div class="pass-meta">${card.meta}</div>
      <h3>${card.title}</h3>
      <p>${card.body}</p>
      <ul class="pass-list">${card.bullets.map(item => `<li>${app.formatPrompt(item)}</li>`).join('')}</ul>
    </div>`).join('');

    const schedule = PASS_MODE.schedule.map(item => `<div class="pass-card">
      <div class="pass-meta">Study block</div>
      <h3>${item.title}</h3>
      <p>${item.body}</p>
      <ul class="pass-list">${item.bullets.map(point => `<li>${app.formatPrompt(point)}</li>`).join('')}</ul>
    </div>`).join('');

    const templates = PASS_MODE.templates.map(template => `<div class="pass-template">
      <h3>${template.title}</h3>
      <p>${template.use}</p>
      <pre><code class="language-cpp">${app.escapeHtml(template.code)}</code></pre>
    </div>`).join('');

    passContent.innerHTML = `<div class="pass-hero">
      <h2>${PASS_MODE.heroTitle}</h2>
      <p>${PASS_MODE.heroText}</p>
      <div class="pass-chip-row">${PASS_MODE.targetChips.map(chip => `<span class="pass-chip">${chip}</span>`).join('')}</div>
      <div class="pass-actions">
        <button class="btn btn-primary" data-action="start-pass-drill">Start Pass Drill</button>
        <button class="btn btn-secondary" data-action="open-real-exam-day">Open Real Exam Day</button>
        <button class="btn btn-secondary" data-action="start-pass-mock">Start 40% Mock</button>
      </div>
    </div>

    <div class="pass-section-title">How To Get Over The Line</div>
    <div class="pass-grid">${winCards}</div>

    <div class="pass-section-title">What To Study Next</div>
    <div class="pass-grid">${schedule}</div>

    <div class="pass-section-title">Memorise These Templates</div>
    <div class="pass-code-grid">${templates}</div>

    <div class="pass-checklist">
      <div class="pass-section-title">10-second submit checklist</div>
      <ol>${PASS_MODE.checklist.map(item => `<li>${app.formatPrompt(item)}</li>`).join('')}</ol>
    </div>

    <p class="pass-note">If you are short on time, repeat only the templates on this page until you can write them without looking. That is the most efficient route to a capped pass.</p>`;

    hljs.highlightAll();
  };
})();
