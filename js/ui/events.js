(function () {
  const app = window.App;

  const clickActions = {
    'show-panel': element => app.showPanel(element.dataset.panel),
    'go-day': element => app.goDay(parseInt(element.dataset.day, 10)),
    'reset-everything': () => app.resetEverything(),
    'generate-question': () => app.generateQuestion(),
    'generate-weakness': () => app.generateWeakness(),
    'start-speed-drill': () => app.startSpeedDrill(),
    'start-day-checkpoint': element => app.startDayCheckpoint(parseInt(element.dataset.day, 10)),
    'submit-day-checkpoint': () => app.submitDayCheckpoint(),
    'start-pass-drill': () => app.startPassDrill(),
    'open-real-exam-day': () => app.openRealExamDay(),
    'start-pass-mock': () => app.startPassMock(),
    'start-exam': () => app.startExam(),
    'submit-exam': () => app.submitExam(),
    'answer-mcq': element => app.answerMcq(element.dataset.key, parseInt(element.dataset.picked, 10), parseInt(element.dataset.correct, 10)),
    'check-code': element => app.checkCode(element.dataset.key),
    'show-hint': element => app.showHint(element.dataset.key),
    'reveal-answer': element => app.revealAnswer(element.dataset.key),
    'clear-editor': element => app.clearEditor(element.dataset.editorId),
    'print-page': () => window.print()
  };

  app.bindUIEvents = function bindUIEvents() {
    if (app._eventsBound) return;
    app._eventsBound = true;

    document.addEventListener('click', event => {
      const trigger = event.target.closest('[data-action]');
      if (!trigger) return;

      const action = clickActions[trigger.dataset.action];
      if (!action) return;

      event.preventDefault();
      action(trigger, event);
    });
  };
})();
