(function () {
  const app = window.App;
  const editorRegistry = app.runtime.editorRegistry;

  app.teardownEditorInstances = function teardownEditorInstances() {
    editorRegistry.forEach(editor => {
      if (editor && typeof editor.toTextArea === 'function') editor.toTextArea();
    });
    editorRegistry.clear();
  };

  app.handleFallbackEditorKeydown = function handleFallbackEditorKeydown(element, event) {
    if (event.key === 'Tab') {
      event.preventDefault();
      const start = element.selectionStart;
      const end = element.selectionEnd;
      element.value = element.value.substring(0, start) + '    ' + element.value.substring(end);
      element.selectionStart = element.selectionEnd = start + 4;
      return;
    }

    if (event.key === 'Enter') {
      const value = element.value;
      const caret = element.selectionStart;
      const previousLine = value.slice(0, caret).split('\n').pop() || '';
      const indent = previousLine.match(/^\s*/)?.[0] || '';
      const extraIndent = /\{\s*$/.test(previousLine.trimEnd()) ? '    ' : '';

      event.preventDefault();
      const insertion = `\n${indent}${extraIndent}`;
      element.value = value.substring(0, caret) + insertion + value.substring(element.selectionEnd);
      element.selectionStart = element.selectionEnd = caret + insertion.length;
    }
  };

  app.createCodeEditor = function createCodeEditor(textarea) {
    if (window.CodeMirror) {
      const editor = window.CodeMirror.fromTextArea(textarea, {
        mode: 'text/x-c++src',
        theme: 'material-darker',
        lineNumbers: true,
        indentUnit: 4,
        tabSize: 4,
        indentWithTabs: false,
        smartIndent: true,
        matchBrackets: true,
        autoCloseBrackets: true,
        lineWrapping: false,
        extraKeys: {
          Tab(cm) {
            cm.replaceSelection('    ', 'end');
          },
          Enter(cm) {
            cm.execCommand('newlineAndIndent');
          }
        }
      });

      editor.setSize(null, '220px');
      editor.on('change', cm => app.persistDraft(textarea.id, cm.getValue()));
      editorRegistry.set(textarea.id, editor);
      return;
    }

    textarea.addEventListener('input', () => app.persistDraft(textarea.id, textarea.value));
    textarea.addEventListener('keydown', event => app.handleFallbackEditorKeydown(textarea, event));
  };

  app.getEditorValue = function getEditorValue(id) {
    const editor = editorRegistry.get(id);
    if (editor) return editor.getValue();
    const element = document.getElementById(id);
    return element ? element.value : '';
  };

  app.setEditorReadOnly = function setEditorReadOnly(id, readOnly) {
    const editor = editorRegistry.get(id);
    if (editor) {
      editor.setOption('readOnly', readOnly ? 'nocursor' : false);
      return;
    }

    const element = document.getElementById(id);
    if (element) element.disabled = readOnly;
  };

  app.clearEditor = function clearEditor(id) {
    const editor = editorRegistry.get(id);
    if (editor) {
      editor.setValue('');
      editor.focus();
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.value = '';
        element.focus();
      }
      app.persistDraft(id, '');
    }

    const key = id.startsWith('ed-') ? id.slice(3) : null;
    if (key) {
      const feedback = document.getElementById('fb-' + key);
      const content = document.getElementById('fbc-' + key);
      if (feedback) feedback.className = 'feedback';
      if (content) content.innerHTML = '';
    }
  };

  app.attachEditorListeners = function attachEditorListeners() {
    app.teardownEditorInstances();
    document.querySelectorAll('.code-editor').forEach(textarea => {
      app.createCodeEditor(textarea);
      if (typeof app.ensureCompilerForEditor === 'function') app.ensureCompilerForEditor(textarea);
    });
  };
})();
