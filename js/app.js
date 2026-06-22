(function () {
  const app = window.App;

  app.init = function init() {
    app.bindUIEvents();
    app.loadState();

    if (app.state.dayCheckpoint && !app.state.dayCheckpoint.submitted) {
      app.startCheckpointTimer();
    }

    if (app.state.panel === 'checkpoint') app.renderDayCheckpointPanel();
    else app.renderLearnPanel();

    app.updateDayBadge();

    if (app.state.panel && document.getElementById('panel-' + app.state.panel)) {
      app.showPanel(app.state.panel);
    }

    app.syncGlobalTimer();
    hljs.highlightAll();
  };

  window.onload = app.init;
})();
