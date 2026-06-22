(function () {
  const app = window.App = window.App || {};

  app.getDefaultState = function getDefaultState() {
    return {
      day: 0,
      panel: 'learn',
      answered: {},
      codeDrafts: {},
      correct: 0,
      total: 0,
      streak: 0,
      bestStreak: 0,
      examActive: false,
      examSecondsLeft: 7200,
      dayCheckpoint: null,
      dayCheckpointHistory: [],
      rqIndex: 0,
      retrySources: {},
      examHistory: []
    };
  };

  app.state = app.getDefaultState();
  app.runtime = {
    drillTimer: null,
    drillSeconds: 180,
    rqCurrent: null,
    editorRegistry: new Map()
  };
})();
