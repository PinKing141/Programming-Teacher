(function () {
  const app = window.App;
  const runtime = app.runtime;

  const PISTON_ENDPOINT = 'https://emkc.org/api/v2/piston/execute';
  const CPP_VERSION = '10.2.0';
  const CPP_LANGUAGE = 'cpp';

  runtime.runResults = runtime.runResults || {};

  app.getCompilerProviderLabel = function getCompilerProviderLabel() {
    return 'Real C++ compile/run via the Piston GCC sandbox';
  };

  app.hasMainFunction = function hasMainFunction(code) {
    return /\bint\s+main\s*\(/.test(code || '');
  };

  app.normalizeProgramOutput = function normalizeProgramOutput(value) {
    return (value || '').toString().replace(/\r\n/g, '\n').trim();
  };

  app.getQuestionRunTests = function getQuestionRunTests(question) {
    if (Array.isArray(question?.runTests) && question.runTests.length) return question.runTests;
    return [{ name: 'Compile check', call: null, expected: '', hidden: false }];
  };

  app.getCodePrelude = function getCodePrelude() {
    return [
      '#include <iostream>',
      '#include <vector>',
      '#include <string>',
      '#include <algorithm>',
      '#include <cmath>',
      'using namespace std;',
      '',
      'class BankAccount { public: float balance; string name; BankAccount(float b, string n) { balance = b; name = n; } };',
      'class Vehicle { public: float price; string name; Vehicle(float p, string n) { price = p; name = n; } };',
      'class Device { public: float price; string name; Device(float p, string n) { price = p; name = n; } };'
    ].join('\n');
  };

  app.buildCppProgram = function buildCppProgram(userCode, tests) {
    const code = userCode || '';
    if (app.hasMainFunction(code)) return code;

    const runnableTests = (tests || []).filter(test => test && test.call);
    const body = runnableTests.length
      ? runnableTests.map(test => `    std::cout << (${test.call}) << std::endl;`).join('\n')
      : '    return 0;';

    return `${app.getCodePrelude()}\n\n${code}\n\nint main()\n{\n${body}\n${runnableTests.length ? '    return 0;\n' : ''}}`;
  };


  app.getCompilerTargetFromEditorId = function getCompilerTargetFromEditorId(editorId) {
    if (!editorId) return null;
    if (editorId === 'lab-editor') return { key: 'lab', mode: 'lab' };
    if (editorId.startsWith('exam-ed-')) return { key: `exam-${editorId.replace('exam-ed-', '')}`, mode: 'question' };
    if (editorId.startsWith('ed-')) return { key: editorId.slice(3), mode: 'question' };
    return { key: `editor-${editorId}`, mode: 'standalone', editorId };
  };

  app.ensureCompilerForEditor = function ensureCompilerForEditor(textarea) {
    if (!textarea || textarea.dataset.compilerAttached === 'true') return;
    const target = app.getCompilerTargetFromEditorId(textarea.id);
    if (!target) return;

    textarea.dataset.compilerAttached = 'true';
    if (target.mode !== 'standalone') return;

    const actions = document.createElement('div');
    actions.className = 'action-row compiler-action-row';
    actions.innerHTML = `<button class="btn btn-primary" data-action="run-editor-code" data-editor-id="${app.escapeHtml(textarea.id)}">▶ Run Code</button>`;

    const output = document.createElement('div');
    output.className = 'run-output hint';
    output.id = 'run-output-' + target.key;
    output.textContent = 'Run output will appear here after you click Run Code.';

    textarea.insertAdjacentElement('afterend', output);
    textarea.insertAdjacentElement('afterend', actions);
  };

  app.runEditorCode = async function runEditorCode(editorId) {
    const target = app.getCompilerTargetFromEditorId(editorId);
    if (!target) return;
    if (target.mode === 'lab') {
      await app.runLabCode();
      return;
    }
    if (target.mode === 'question') {
      await app.runCode(target.key);
      return;
    }

    const value = app.getEditorValue(editorId).trim();
    if (!value) {
      app.setRunOutput(target.key, 'hint', 'Write a complete C++ program, then click Run Code.');
      return;
    }

    app.setRunOutput(target.key, 'running', `<strong>Running real C++...</strong><p>${app.getCompilerProviderLabel()}</p>`);
    try {
      const result = await app.executeCppProgram(value, '');
      const rendered = app.renderRunResult(result, []);
      runtime.runResults[target.key] = { result, tests: [], rendered, timestamp: new Date().toISOString() };
      app.setRunOutput(target.key, rendered.tone, rendered.html);
    } catch (error) {
      app.setRunOutput(target.key, 'fail', `<strong>Could not reach the compiler sandbox.</strong><p>${app.escapeHtml(error.message)}</p>`);
    }
  };

  app.getRunOutputElement = function getRunOutputElement(key) {
    return document.getElementById('run-output-' + key);
  };

  app.setRunOutput = function setRunOutput(key, tone, html) {
    const output = app.getRunOutputElement(key);
    if (!output) return;
    output.className = `run-output ${tone || ''}`.trim();
    output.innerHTML = html;
  };

  app.executeCppProgram = async function executeCppProgram(program, stdin) {
    const response = await fetch(PISTON_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        language: CPP_LANGUAGE,
        version: CPP_VERSION,
        files: [{ name: 'main.cpp', content: program }],
        stdin: stdin || '',
        args: [],
        compile_timeout: 10000,
        run_timeout: 3000,
        compile_memory_limit: -1,
        run_memory_limit: -1
      })
    });

    if (!response.ok) {
      throw new Error(`Compiler service returned HTTP ${response.status}.`);
    }

    return response.json();
  };

  app.compareRunResults = function compareRunResults(output, tests) {
    const runnableTests = (tests || []).filter(test => test && test.call);
    if (!runnableTests.length) return [];

    const lines = app.normalizeProgramOutput(output).split('\n');
    return runnableTests.map((test, index) => {
      const actual = app.normalizeProgramOutput(lines[index] || '');
      const expected = app.normalizeProgramOutput(test.expected);
      return {
        name: test.name || `Test ${index + 1}`,
        call: test.call,
        expected,
        actual,
        passed: actual === expected,
        hidden: Boolean(test.hidden)
      };
    });
  };

  app.renderRunResult = function renderRunResult(result, tests) {
    const compile = result.compile || {};
    const run = result.run || {};
    const compileText = app.normalizeProgramOutput([compile.stdout, compile.stderr].filter(Boolean).join('\n'));
    const runText = app.normalizeProgramOutput([run.stdout, run.stderr].filter(Boolean).join('\n'));
    const exitCode = typeof run.code === 'number' ? run.code : 0;

    if (compileText) {
      return {
        tone: 'fail',
        html: `<strong>Compiler error</strong><pre>${app.escapeHtml(compileText)}</pre>`
      };
    }

    if (exitCode !== 0 || run.stderr) {
      return {
        tone: 'fail',
        html: `<strong>Runtime error</strong><pre>${app.escapeHtml(runText || `Program exited with code ${exitCode}`)}</pre>`
      };
    }

    const comparisons = app.compareRunResults(run.stdout || '', tests);
    if (comparisons.length) {
      const passed = comparisons.filter(item => item.passed).length;
      const rows = comparisons.map(item => `<li class="${item.passed ? 'pass' : 'fail'}"><strong>${app.escapeHtml(item.name)}</strong> <span class="inline-code">${app.escapeHtml(item.hidden ? 'hidden test' : item.call)}</span><br>Expected: <span class="inline-code">${app.escapeHtml(item.expected)}</span> · Got: <span class="inline-code">${app.escapeHtml(item.actual)}</span></li>`).join('');
      return {
        tone: passed === comparisons.length ? 'pass' : 'fail',
        html: `<strong>${passed === comparisons.length ? '✓ All run tests passed' : '✗ Some run tests failed'}</strong><ul class="run-test-list">${rows}</ul><details><summary>Raw program output</summary><pre>${app.escapeHtml(run.stdout || '(no output)')}</pre></details>`
      };
    }

    return {
      tone: 'pass',
      html: `<strong>✓ Compiled and ran successfully</strong><pre>${app.escapeHtml(run.stdout || '(no output)')}</pre>`
    };
  };

  app.runCode = async function runCode(key) {
    const question = key.startsWith('exam-') ? EXAM_Q[parseInt(key.replace('exam-', ''), 10)] : app.getQByKey(key);
    const editorId = key.startsWith('exam-') ? 'exam-ed-' + key.replace('exam-', '') : 'ed-' + key;
    const value = app.getEditorValue(editorId).trim();

    if (!value) {
      app.setRunOutput(key, 'hint', 'Write some C++ first, then click Run Code.');
      return;
    }

    const tests = app.getQuestionRunTests(question);
    const program = app.buildCppProgram(value, tests);
    app.setRunOutput(key, 'running', `<strong>Running real C++...</strong><p>${app.getCompilerProviderLabel()}</p>`);

    try {
      const result = await app.executeCppProgram(program, '');
      const rendered = app.renderRunResult(result, tests);
      runtime.runResults[key] = { result, tests, rendered, timestamp: new Date().toISOString() };
      app.setRunOutput(key, rendered.tone, rendered.html);
    } catch (error) {
      app.setRunOutput(key, 'fail', `<strong>Could not reach the compiler sandbox.</strong><p>${app.escapeHtml(error.message)}</p><p>Check your internet connection, then try again.</p>`);
    }
  };

  app.runLabCode = async function runLabCode() {
    const key = 'lab';
    const value = app.getEditorValue('lab-editor').trim();
    if (!value) {
      app.setRunOutput(key, 'hint', 'Write a complete C++ program with int main(), then click Run Code.');
      return;
    }
    app.setRunOutput(key, 'running', `<strong>Running real C++...</strong><p>${app.getCompilerProviderLabel()}</p>`);
    try {
      const result = await app.executeCppProgram(value, '');
      const rendered = app.renderRunResult(result, []);
      runtime.runResults[key] = { result, tests: [], rendered, timestamp: new Date().toISOString() };
      app.setRunOutput(key, rendered.tone, rendered.html);
    } catch (error) {
      app.setRunOutput(key, 'fail', `<strong>Could not reach the compiler sandbox.</strong><p>${app.escapeHtml(error.message)}</p>`);
    }
  };
})();
