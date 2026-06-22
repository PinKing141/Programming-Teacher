(function () {
  const app = window.App;

  app.isPhoneLayout = function isPhoneLayout() {
    return window.matchMedia('(max-width: 760px), (pointer: coarse) and (max-width: 900px)').matches;
  };

  app.syncDeviceLayout = function syncDeviceLayout() {
    document.body.classList.toggle('phone-layout', app.isPhoneLayout());
    app.runtime.editorRegistry.forEach(editor => {
      editor.setOption('lineWrapping', app.isPhoneLayout());
      editor.setSize(null, app.isPhoneLayout() ? '260px' : '220px');
      editor.refresh();
    });
  };

  app.init = function init() {
    app.syncDeviceLayout();
    app.bindUIEvents();
    app.loadState();
    app.renderAccountPicker();

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
    if (app.profileChoiceNeeded) app.openProfileChooser(true);
    hljs.highlightAll();

    window.addEventListener('resize', app.syncDeviceLayout);
    window.addEventListener('orientationchange', app.syncDeviceLayout);
  };

  window.onload = app.init;
})();
