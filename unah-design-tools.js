(function () {
    if (window.UNAHDesignToolsLoaded) return;
    window.UNAHDesignToolsLoaded = true;

    function isEditingCanvasContent() {
        return !!(
            document.querySelector('.tox-tinymce') ||
            document.querySelector('iframe.tox-edit-area__iframe') ||
            document.querySelector('.ic-RichContentEditor')
        );
    }

    function waitForEditor() {
        const observer = new MutationObserver(function () {
            const panelExists = document.getElementById('unah-design-panel');
            const toggleExists = document.getElementById('unah-design-toggle');

            if (isEditingCanvasContent()) {
                if (!panelExists && !toggleExists) {
                    createPanel();
                    enableBlockEditingUI();
                }
            } else {
                removePanel();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        if (isEditingCanvasContent()) {
            createPanel();
            enableBlockEditingUI();
        }
    }

    function removePanel() {
        const panel = document.getElementById('unah-design-panel');
        const toggle = document.getElementById('unah-design-toggle');

        if (panel) panel.remove();
        if (toggle) toggle.remove();
    }

    function createPanel() {
        if (document.getElementById('unah-design-panel')) return;

        const toggle = document.createElement('button');
        toggle.id = 'unah-design-toggle';
        toggle.type = 'button';
        toggle.textContent = 'Design Tools';

        const panel = document.createElement('aside');
        panel.id = 'unah-design-panel';

        panel.innerHTML = `
      <div class="unah-panel-header">
        <h2>Design Tools</h2>
        <button id="unah-close-panel" type="button">×</button>
      </div>

      <div class="unah-tabs">
        <button type="button" data-tab="blocks">Blocks</button>
        <button type="button" data-tab="templates">Templates</button>
        <button type="button" data-tab="styles">Styles</button>
      </div>

      <div class="unah-tab-content" id="unah-tab-content">
        ${getBlocksView()}
      </div>
    `;

        document.body.appendChild(toggle);
        document.body.appendChild(panel);

        toggle.addEventListener('click', function () {
            panel.classList.add('open');
        });

        panel.querySelector('#unah-close-panel').addEventListener('click', function () {
            panel.classList.remove('open');
        });

        panel.addEventListener('click', handlePanelClick);
    }

    function handlePanelClick(e) {
        const tabBtn = e.target.closest('[data-tab]');
        const insertBtn = e.target.closest('[data-insert]');

        if (tabBtn) {
            const tab = tabBtn.dataset.tab;
            const content = document.getElementById('unah-tab-content');

            if (tab === 'blocks') content.innerHTML = getBlocksView();
            if (tab === 'templates') content.innerHTML = getTemplatesView();
            if (tab === 'styles') content.innerHTML = getStylesView();

            return;
        }

        if (insertBtn) {
            insertTemplate(insertBtn.dataset.insert);
        }
    }

    function getBlocksView() {
        return `
      <h3>Basic Content</h3>

      <div class="unah-tool-grid">
        <button class="unah-tool-tile" type="button" data-insert="accordion">Accordion</button>
        <button class="unah-tool-tile" type="button" data-insert="tabs">Tabs</button>
        <button class="unah-tool-tile" type="button" data-insert="hero">Header</button>
        <button class="unah-tool-tile" type="button" data-insert="h2">Heading 2</button>
        <button class="unah-tool-tile" type="button" data-insert="h3">Heading 3</button>
        <button class="unah-tool-tile" type="button" data-insert="h4">Heading 4</button>
        <button class="unah-tool-tile" type="button" data-insert="callout">Callout</button>
        <button class="unah-tool-tile" type="button" data-insert="button">Button</button>
        <button class="unah-tool-tile" type="button" data-insert="divider">Divider</button>
      </div>
    `;
    }

    function getTemplatesView() {
        return `
      <h3>Templates</h3>

      <div class="unah-tool-grid">
        <button class="unah-tool-tile" type="button" data-insert="homepage">Homepage</button>
        <button class="unah-tool-tile" type="button" data-insert="module-intro">Module Intro</button>
      </div>
    `;
    }

    function getStylesView() {
        return `
      <h3>Styles</h3>
      <p>Próximamente: edición contextual del bloque seleccionado.</p>
    `;
    }

    function getTemplateHtml(type) {
        const uniqueId = Date.now();

        const templates = {
            accordion: `
<div class="unah-editor-block unah-accordion" data-unah-block="Accordion">
  <div class="unah-block-label">Accordion</div>
  <details open>
    <summary>Accordion Title</summary>
    <div class="unah-accordion-content">
      <p>Accordion content goes here.</p>
    </div>
  </details>
</div>
`,

            tabs: `
<div class="unah-editor-block unah-tabs-block" data-unah-block="Tabs">
  <div class="unah-block-label">Tabs</div>

  <div class="unah-tabs-nav">
    <a href="#tab-${uniqueId}-1">Tab 1</a>
    <a href="#tab-${uniqueId}-2">Tab 2</a>
    <a href="#tab-${uniqueId}-3">Tab 3</a>
  </div>

  <div class="unah-tab-panel" id="tab-${uniqueId}-1">
    <h3>Tab 1</h3>
    <p>Tab 1 content goes here.</p>
  </div>

  <div class="unah-tab-panel" id="tab-${uniqueId}-2">
    <h3>Tab 2</h3>
    <p>Tab 2 content goes here.</p>
  </div>

  <div class="unah-tab-panel" id="tab-${uniqueId}-3">
    <h3>Tab 3</h3>
    <p>Tab 3 content goes here.</p>
  </div>
</div>
`,

            hero: `
<div class="unah-editor-block unah-hero" data-unah-block="Header">
  <div class="unah-block-label">Header</div>
  <h2>Course Header Title</h2>
  <p>Short introductory text for this section.</p>
</div>
`,

            h2: `
<div class="unah-editor-block" data-unah-block="Heading">
  <div class="unah-block-label">Heading</div>
  <h2>Heading 2</h2>
</div>
`,

            h3: `
<div class="unah-editor-block" data-unah-block="Heading">
  <div class="unah-block-label">Heading</div>
  <h3>Heading 3</h3>
</div>
`,

            h4: `
<div class="unah-editor-block" data-unah-block="Heading">
  <div class="unah-block-label">Heading</div>
  <h4>Heading 4</h4>
</div>
`,

            callout: `
<div class="unah-editor-block unah-callout" data-unah-block="Callout">
  <div class="unah-block-label">Callout</div>
  <strong>Important Note</strong>
  <p>Highlighted content goes here.</p>
</div>
`,

            button: `
<div class="unah-editor-block" data-unah-block="Button">
  <div class="unah-block-label">Button</div>
  <p>
    <a class="unah-btn" href="#">Example Button</a>
  </p>
</div>
`,

            divider: `
<div class="unah-editor-block" data-unah-block="Divider">
  <div class="unah-block-label">Divider</div>
  <hr class="unah-divider">
</div>
`,

            homepage: `
<div class="unah-editor-block" data-unah-block="Homepage">
  <div class="unah-block-label">Homepage</div>
  <div class="unah-hero">
    <h2>Welcome to the Course</h2>
    <p>Course introductory text.</p>
  </div>
  <div class="unah-card-grid">
    <div class="unah-card">
      <h3>Start Here</h3>
      <p>Review the course information.</p>
    </div>
    <div class="unah-card">
      <h3>Modules</h3>
      <p>Access the weekly course content.</p>
    </div>
    <div class="unah-card">
      <h3>Assessments</h3>
      <p>Review assignments and evaluations.</p>
    </div>
  </div>
</div>
`,

            "module-intro": `
<div class="unah-editor-block" data-unah-block="Module Intro">
  <div class="unah-block-label">Module Intro</div>
  <h2>Module Introduction</h2>
  <p>In this module, you will study the main concepts of the topic.</p>
  <div class="unah-callout">
    <strong>Objective:</strong>
    <p>Module learning objective goes here.</p>
  </div>
</div>
`
        };

        return templates[type] || '';
    }

    function insertTemplate(type) {
        const html = getTemplateHtml(type);
        if (!html) return;

        const iframe =
            document.querySelector('iframe.tox-edit-area__iframe') ||
            document.querySelector('.tox-edit-area iframe');

        if (!iframe || !iframe.contentDocument) {
            alert('Canvas editor not found.');
            return;
        }

        iframe.contentDocument.body.focus();

        try {
            iframe.contentWindow.document.execCommand('insertHTML', false, html);
        } catch (e) {
            iframe.contentDocument.body.insertAdjacentHTML('beforeend', html);
        }
    }

    function enableBlockEditingUI() {
        const interval = setInterval(function () {
            const iframe =
                document.querySelector('iframe.tox-edit-area__iframe') ||
                document.querySelector('.tox-edit-area iframe');

            if (!iframe || !iframe.contentDocument) return;

            clearInterval(interval);

            const editorDoc = iframe.contentDocument;

            if (editorDoc.body.dataset.unahBlockUiEnabled === 'true') return;
            editorDoc.body.dataset.unahBlockUiEnabled = 'true';

            editorDoc.addEventListener('click', function (event) {
                const block = event.target.closest('[data-unah-block]');
                if (!block) return;

                editorDoc.querySelectorAll('.unah-selected-block').forEach(function (el) {
                    el.classList.remove('unah-selected-block');
                });

                block.classList.add('unah-selected-block');
                showBlockToolbar(block, editorDoc);
            }, true);
        }, 500);
    }

    function showBlockToolbar(block, editorDoc) {
        let toolbar = editorDoc.getElementById('unah-block-toolbar');

        if (!toolbar) {
            toolbar = editorDoc.createElement('div');
            toolbar.id = 'unah-block-toolbar';
            toolbar.innerHTML = `
        <button type="button" data-action="duplicate" title="Duplicate">⧉</button>
        <button type="button" data-action="up" title="Move up">↑</button>
        <button type="button" data-action="down" title="Move down">↓</button>
        <button type="button" data-action="delete" title="Delete">🗑</button>
      `;
            editorDoc.body.appendChild(toolbar);
        }

        const rect = block.getBoundingClientRect();

        toolbar.style.display = 'flex';
        toolbar.style.position = 'absolute';
        toolbar.style.top = `${rect.top + editorDoc.documentElement.scrollTop - 42}px`;
        toolbar.style.left = `${rect.left}px`;
        toolbar.style.zIndex = '999999';

        toolbar.onclick = function (e) {
            const action = e.target.dataset.action;
            if (!action) return;

            if (action === 'duplicate') {
                block.insertAdjacentHTML('afterend', block.outerHTML);
            }

            if (action === 'delete') {
                block.remove();
                toolbar.remove();
            }

            if (action === 'up' && block.previousElementSibling) {
                block.parentNode.insertBefore(block, block.previousElementSibling);
            }

            if (action === 'down' && block.nextElementSibling) {
                block.parentNode.insertBefore(block.nextElementSibling, block);
            }
        };
    }

    waitForEditor();
})();
