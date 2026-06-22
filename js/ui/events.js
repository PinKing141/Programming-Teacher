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
    'run-code': element => app.runCode(element.dataset.key),
    'run-lab-code': () => app.runLabCode(),
    'run-editor-code': element => app.runEditorCode(element.dataset.editorId),
    'show-hint': element => app.showHint(element.dataset.key),
    'close-feedback': element => app.closeFeedback(element.dataset.key),
    'reveal-answer': element => app.revealAnswer(element.dataset.key),
    'clear-editor': element => app.clearEditor(element.dataset.editorId),
    'print-page': () => window.print(),
    'create-account': () => app.createAccount(),
    'open-profile-chooser': () => app.openProfileChooser(),
    'close-profile-chooser': () => app.closeProfileChooser(),
    'select-profile': element => app.switchAccount(element.dataset.profileId),
    'delete-account': () => app.deleteCurrentAccount(),
    'switch-account': element => app.switchAccount(element.value)
  };

  app.bindUIEvents = function bindUIEvents() {
    if (app._eventsBound) return;
    app._eventsBound = true;

    document.addEventListener('click', event => {
      const trigger = event.target.closest('[data-action]');
      if (!trigger || trigger.dataset.action === 'switch-account') return;

      const action = clickActions[trigger.dataset.action];
      if (!action) return;

      event.preventDefault();
      action(trigger, event);
    });

    document.addEventListener('change', event => {
      const trigger = event.target.closest('[data-action="switch-account"]');
      if (!trigger) return;

      const action = clickActions[trigger.dataset.action];
      if (!action) return;

      action(trigger, event);
    });

    document.addEventListener('submit', event => {
      const form = event.target.closest('#profile-create-form');
      if (!form) return;

      event.preventDefault();
      const input = form.querySelector('[name="profileName"]');
      app.createAccount(input ? input.value : '');
      form.reset();
    });
  };
})();
