(function () {
  if (window.UNAHDesignToolsLoaded) return;
  window.UNAHDesignToolsLoaded = true;

  const CONFIG = {
    panelWidth: 420,
    bootstrapCssUrl: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css',
    bootstrapJsUrl: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js'
  };

  let selectedBlock = null;
  let selectedEditorDoc = null;

  function loadParentAsset(id, type, url) {
    if (document.getElementById(id)) return;

    if (type === 'css') {
      const link = document.createElement('link');
      link.id = id;
      link.rel = 'stylesheet';
      link.href = url;
      document.head.appendChild(link);
    }

    if (type === 'js') {
      const script = document.createElement('script');
      script.id = id;
      script.src = url;
      script.defer = true;
      document.head.appendChild(script);
    }
  }

  function loadBootstrapOnCanvasPage() {
    loadParentAsset('unah-bootstrap-css-parent', 'css', CONFIG.bootstrapCssUrl);
    loadParentAsset('unah-bootstrap-js-parent', 'js', CONFIG.bootstrapJsUrl);
  }

  function isEditingCanvasContent() {
    return !!(
      document.querySelector('.tox-tinymce') ||
      document.querySelector('iframe.tox-edit-area__iframe') ||
      document.querySelector('.ic-RichContentEditor')
    );
  }

  function getEditorIframe() {
    return (
      document.querySelector('iframe.tox-edit-area__iframe') ||
      document.querySelector('.tox-edit-area iframe')
    );
  }

  function getEditorDoc() {
    const iframe = getEditorIframe();
    return iframe && iframe.contentDocument ? iframe.contentDocument : null;
  }

  function waitForEditor() {
    loadBootstrapOnCanvasPage();
    enableSavedContentInteractions();

    const observer = new MutationObserver(function () {
      if (isEditingCanvasContent()) {
        if (!document.getElementById('unah-design-panel')) {
          createPanel();
        }

        applyEditorAssets();
        enableBlockSelection();
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
      applyEditorAssets();
      enableBlockSelection();
    }
  }

  function removePanel() {
    const panel = document.getElementById('unah-design-panel');
    const toggle = document.getElementById('unah-design-toggle');

    if (panel) panel.remove();
    if (toggle) toggle.remove();

    document.body.classList.remove('unah-design-panel-open');

    selectedBlock = null;
    selectedEditorDoc = null;
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
        <button id="unah-close-panel" type="button" aria-label="Close panel">×</button>
      </div>

      <div class="unah-tabs">
        <button type="button" data-tab="blocks" class="active">Blocks</button>
        <button type="button" data-tab="templates">Templates</button>
        <button type="button" data-tab="styles">Edit</button>
      </div>

      <div class="unah-tab-content" id="unah-tab-content">
        ${getBlocksView()}
      </div>
    `;

    document.body.appendChild(toggle);
    document.body.appendChild(panel);

    toggle.addEventListener('click', openPanel);

    panel.querySelector('#unah-close-panel').addEventListener('click', closePanel);

    panel.addEventListener('click', handlePanelClick);
    panel.addEventListener('input', handlePanelInput);
    panel.addEventListener('change', handlePanelInput);

    openPanel();
  }

  function openPanel() {
    const panel = document.getElementById('unah-design-panel');
    if (panel) panel.classList.add('open');
    document.body.classList.add('unah-design-panel-open');
  }

  function closePanel() {
    const panel = document.getElementById('unah-design-panel');
    if (panel) panel.classList.remove('open');
    document.body.classList.remove('unah-design-panel-open');
  }

  function setActiveTab(tabName) {
    document.querySelectorAll('#unah-design-panel [data-tab]').forEach(function (btn) {
      btn.classList.toggle('active', btn.dataset.tab === tabName);
    });
  }

  function handlePanelClick(e) {
    const tabBtn = e.target.closest('[data-tab]');
    const insertBtn = e.target.closest('[data-insert]');
    const actionBtn = e.target.closest('[data-action]');

    if (tabBtn) {
      const tab = tabBtn.dataset.tab;
      const content = document.getElementById('unah-tab-content');

      setActiveTab(tab);

      if (tab === 'blocks') content.innerHTML = getBlocksView();
      if (tab === 'templates') content.innerHTML = getTemplatesView();
      if (tab === 'styles') content.innerHTML = getStylesView();

      return;
    }

    if (insertBtn) {
      insertTemplate(insertBtn.dataset.insert);
      return;
    }

    if (actionBtn) {
      handleSelectedBlockAction(actionBtn.dataset.action);
    }
  }

  function handlePanelInput(e) {
    if (!selectedBlock) return;

    const field = e.target.dataset.field;
    if (!field) return;

    if (field === 'block-title') {
      const title = selectedBlock.querySelector('[data-unah-edit="title"]');
      if (title) title.textContent = e.target.value;
    }

    if (field === 'block-body') {
      const body = selectedBlock.querySelector('[data-unah-edit="body"]');
      if (body) body.textContent = e.target.value;
    }

    if (field === 'block-style') {
      selectedBlock.dataset.unahStyle = e.target.value;
    }
  }

  function getBlocksView() {
    return `
      <h3>Basic Content</h3>

      <div class="unah-tool-grid">
        <button class="unah-tool-tile" type="button" data-insert="accordion">
          <span class="unah-tool-icon">▾</span>
          Accordion
        </button>

        <button class="unah-tool-tile" type="button" data-insert="tabs">
          <span class="unah-tool-icon">▤</span>
          Tabs
        </button>

        <button class="unah-tool-tile" type="button" data-insert="hero">
          <span class="unah-tool-icon">H</span>
          Header
        </button>

        <button class="unah-tool-tile" type="button" data-insert="h2">
          <span class="unah-tool-icon">H2</span>
          Heading 2
        </button>

        <button class="unah-tool-tile" type="button" data-insert="h3">
          <span class="unah-tool-icon">H3</span>
          Heading 3
        </button>

        <button class="unah-tool-tile" type="button" data-insert="h4">
          <span class="unah-tool-icon">H4</span>
          Heading 4
        </button>

        <button class="unah-tool-tile" type="button" data-insert="callout">
          <span class="unah-tool-icon">!</span>
          Callout
        </button>

        <button class="unah-tool-tile" type="button" data-insert="button">
          <span class="unah-tool-icon">●</span>
          Button
        </button>

        <button class="unah-tool-tile" type="button" data-insert="divider">
          <span class="unah-tool-icon">—</span>
          Divider
        </button>
      </div>
    `;
  }

  function getTemplatesView() {
    return `
      <h3>Templates</h3>

      <div class="unah-tool-grid">
        <button class="unah-tool-tile" type="button" data-insert="homepage">
          <span class="unah-tool-icon">⌂</span>
          Homepage
        </button>

        <button class="unah-tool-tile" type="button" data-insert="module-intro">
          <span class="unah-tool-icon">M</span>
          Module Intro
        </button>
      </div>
    `;
  }

  function getStylesView() {
    if (!selectedBlock) {
      return `
        <h3>Edit Block</h3>
        <p class="unah-muted">Seleccione un bloque dentro del editor para modificarlo aquí.</p>
      `;
    }

    const title = selectedBlock.querySelector('[data-unah-edit="title"]');
    const body = selectedBlock.querySelector('[data-unah-edit="body"]');
    const style = selectedBlock.dataset.unahStyle || 'default';

    return `
      <h3>Edit ${selectedBlock.dataset.unahBlock || 'Block'}</h3>

      <div class="unah-edit-actions">
        <button type="button" data-action="duplicate">Duplicate</button>
        <button type="button" data-action="move-up">Move Up</button>
        <button type="button" data-action="move-down">Move Down</button>
        <button type="button" data-action="delete" class="danger">Delete</button>
      </div>

      <label class="unah-field">
        <span>Title</span>
        <input type="text" data-field="block-title" value="${escapeAttr(title ? title.textContent.trim() : '')}">
      </label>

      <label class="unah-field">
        <span>Content</span>
        <textarea data-field="block-body" rows="5">${escapeHtml(body ? body.textContent.trim() : '')}</textarea>
      </label>

      <label class="unah-field">
        <span>Style</span>
        <select data-field="block-style">
          <option value="default" ${style === 'default' ? 'selected' : ''}>Default</option>
          <option value="primary" ${style === 'primary' ? 'selected' : ''}>Primary</option>
          <option value="success" ${style === 'success' ? 'selected' : ''}>Success</option>
          <option value="warning" ${style === 'warning' ? 'selected' : ''}>Warning</option>
          <option value="danger" ${style === 'danger' ? 'selected' : ''}>Danger</option>
        </select>
      </label>
    `;
  }

  function escapeAttr(value) {
    return String(value || '')
      .replaceAll('&', '&amp;')
      .replaceAll('"', '&quot;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;');
  }

  function escapeHtml(value) {
    return String(value || '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;');
  }

  function getTemplateHtml(type) {
    const id = 'unah-' + Date.now() + '-' + Math.floor(Math.random() * 10000);

    const templates = {
      accordion: `
<div class="unah-editor-block unah-bs-block" data-unah-block="Accordion" data-unah-style="default">
  <div class="unah-block-label">Accordion</div>

  <div class="accordion" id="${id}">
    <div class="accordion-item">
      <h2 class="accordion-header" id="${id}-heading-1">
        <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#${id}-collapse-1" aria-expanded="true" aria-controls="${id}-collapse-1" data-unah-edit="title">
          Accordion Title
        </button>
      </h2>

      <div id="${id}-collapse-1" class="accordion-collapse collapse show" aria-labelledby="${id}-heading-1" data-bs-parent="#${id}">
        <div class="accordion-body" data-unah-edit="body">
          Accordion content goes here.
        </div>
      </div>
    </div>
  </div>
</div>
`,

      tabs: `
<div class="unah-editor-block unah-bs-block" data-unah-block="Tabs" data-unah-style="default">
  <div class="unah-block-label">Tabs</div>

  <ul class="nav nav-tabs" id="${id}" role="tablist">
    <li class="nav-item" role="presentation">
      <button class="nav-link active" id="${id}-tab-1" data-bs-toggle="tab" data-bs-target="#${id}-pane-1" type="button" role="tab" aria-controls="${id}-pane-1" aria-selected="true">
        Tab 1
      </button>
    </li>

    <li class="nav-item" role="presentation">
      <button class="nav-link" id="${id}-tab-2" data-bs-toggle="tab" data-bs-target="#${id}-pane-2" type="button" role="tab" aria-controls="${id}-pane-2" aria-selected="false">
        Tab 2
      </button>
    </li>

    <li class="nav-item" role="presentation">
      <button class="nav-link" id="${id}-tab-3" data-bs-toggle="tab" data-bs-target="#${id}-pane-3" type="button" role="tab" aria-controls="${id}-pane-3" aria-selected="false">
        Tab 3
      </button>
    </li>
  </ul>

  <div class="tab-content border border-top-0 p-3">
    <div class="tab-pane fade show active" id="${id}-pane-1" role="tabpanel" aria-labelledby="${id}-tab-1" tabindex="0">
      <h3 data-unah-edit="title">Tab 1 Title</h3>
      <p data-unah-edit="body">Tab 1 content goes here.</p>
    </div>

    <div class="tab-pane fade" id="${id}-pane-2" role="tabpanel" aria-labelledby="${id}-tab-2" tabindex="0">
      <h3>Tab 2 Title</h3>
      <p>Tab 2 content goes here.</p>
    </div>

    <div class="tab-pane fade" id="${id}-pane-3" role="tabpanel" aria-labelledby="${id}-tab-3" tabindex="0">
      <h3>Tab 3 Title</h3>
      <p>Tab 3 content goes here.</p>
    </div>
  </div>
</div>
`,

      hero: `
<div class="unah-editor-block unah-hero-block p-4 rounded-3 bg-light border" data-unah-block="Header" data-unah-style="default">
  <div class="unah-block-label">Header</div>
  <h2 class="display-6 fw-bold text-primary" data-unah-edit="title">Course Header Title</h2>
  <p class="lead mb-0" data-unah-edit="body">Short introductory text for this section.</p>
</div>
`,

      h2: `
<div class="unah-editor-block" data-unah-block="Heading 2" data-unah-style="default">
  <div class="unah-block-label">Heading 2</div>
  <h2 class="border-bottom pb-2 text-primary" data-unah-edit="title">Heading 2</h2>
</div>
`,

      h3: `
<div class="unah-editor-block" data-unah-block="Heading 3" data-unah-style="default">
  <div class="unah-block-label">Heading 3</div>
  <h3 class="text-primary" data-unah-edit="title">Heading 3</h3>
</div>
`,

      h4: `
<div class="unah-editor-block" data-unah-block="Heading 4" data-unah-style="default">
  <div class="unah-block-label">Heading 4</div>
  <h4 class="fw-bold" data-unah-edit="title">Heading 4</h4>
</div>
`,

      callout: `
<div class="unah-editor-block alert alert-info" role="alert" data-unah-block="Callout" data-unah-style="default">
  <div class="unah-block-label">Callout</div>
  <h4 class="alert-heading" data-unah-edit="title">Important Note</h4>
  <p data-unah-edit="body">Highlighted content goes here.</p>
</div>
`,

      button: `
<div class="unah-editor-block" data-unah-block="Button" data-unah-style="default">
  <div class="unah-block-label">Button</div>
  <p class="mb-0">
    <a class="btn btn-primary" href="#" data-unah-edit="title">Example Button</a>
  </p>
</div>
`,

      divider: `
<div class="unah-editor-block" data-unah-block="Divider" data-unah-style="default">
  <div class="unah-block-label">Divider</div>
  <hr class="border border-primary border-2 opacity-75">
</div>
`,

      homepage: `
<div class="unah-editor-block" data-unah-block="Homepage" data-unah-style="default">
  <div class="unah-block-label">Homepage</div>

  <div class="p-5 mb-4 bg-light rounded-3 border">
    <div class="container-fluid py-3">
      <h2 class="display-6 fw-bold text-primary" data-unah-edit="title">Welcome to the Course</h2>
      <p class="col-md-10 fs-5" data-unah-edit="body">Course introductory text.</p>
    </div>
  </div>

  <div class="row g-3">
    <div class="col-md-4">
      <div class="card h-100">
        <div class="card-body">
          <h3 class="card-title h5">Start Here</h3>
          <p class="card-text">Review the course information.</p>
        </div>
      </div>
    </div>

    <div class="col-md-4">
      <div class="card h-100">
        <div class="card-body">
          <h3 class="card-title h5">Modules</h3>
          <p class="card-text">Access the weekly course content.</p>
        </div>
      </div>
    </div>

    <div class="col-md-4">
      <div class="card h-100">
        <div class="card-body">
          <h3 class="card-title h5">Assessments</h3>
          <p class="card-text">Review assignments and evaluations.</p>
        </div>
      </div>
    </div>
  </div>
</div>
`,

      'module-intro': `
<div class="unah-editor-block" data-unah-block="Module Intro" data-unah-style="default">
  <div class="unah-block-label">Module Intro</div>

  <div class="card border-primary mb-3">
    <div class="card-header bg-primary text-white" data-unah-edit="title">Module Introduction</div>
    <div class="card-body">
      <p class="card-text" data-unah-edit="body">In this module, you will study the main concepts of the topic.</p>
    </div>
  </div>
</div>
`
    };

    return templates[type] || '';
  }

  function insertTemplate(type) {
    const html = getTemplateHtml(type);
    if (!html) return;

    const iframe = getEditorIframe();

    if (!iframe || !iframe.contentDocument) {
      alert('Canvas editor not found.');
      return;
    }

    applyEditorAssets();

    iframe.contentDocument.body.focus();

    try {
      iframe.contentWindow.document.execCommand('insertHTML', false, html);
    } catch (e) {
      iframe.contentDocument.body.insertAdjacentHTML('beforeend', html);
    }

    applyEditorAssets();
    enableBlockSelection();
  }

  function applyEditorAssets() {
    const editorDoc = getEditorDoc();
    if (!editorDoc) return;

    if (!editorDoc.getElementById('unah-bootstrap-css-editor')) {
      const bs = editorDoc.createElement('link');
      bs.id = 'unah-bootstrap-css-editor';
      bs.rel = 'stylesheet';
      bs.href = CONFIG.bootstrapCssUrl;
      editorDoc.head.appendChild(bs);
    }

    if (!editorDoc.getElementById('unah-editor-helper-css')) {
      const style = editorDoc.createElement('style');
      style.id = 'unah-editor-helper-css';
      style.textContent = `
        .unah-editor-block {
          position: relative !important;
          border: 2px dotted #0d6efd !important;
          padding: 22px !important;
          margin: 30px 0 !important;
          border-radius: 6px !important;
          background-clip: padding-box !important;
        }

        .unah-editor-block:hover {
          outline: 3px solid rgba(13,110,253,.20) !important;
        }

        .unah-selected-block {
          outline: 3px solid #0d6efd !important;
        }

        .unah-block-label {
          display: block !important;
          position: absolute !important;
          top: -20px !important;
          right: 8px !important;
          background: #0d6efd !important;
          color: #fff !important;
          font-size: 11px !important;
          line-height: 1 !important;
          padding: 5px 8px !important;
          border-radius: 4px 4px 0 0 !important;
          pointer-events: none !important;
          z-index: 20 !important;
          font-family: Arial, sans-serif !important;
        }

        .unah-editor-block[data-unah-style="primary"] {
          border-color: #0d6efd !important;
        }

        .unah-editor-block[data-unah-style="success"] {
          border-color: #198754 !important;
        }

        .unah-editor-block[data-unah-style="warning"] {
          border-color: #ffc107 !important;
        }

        .unah-editor-block[data-unah-style="danger"] {
          border-color: #dc3545 !important;
        }
      `;
      editorDoc.head.appendChild(style);
    }
  }

  function enableBlockSelection() {
    const editorDoc = getEditorDoc();
    if (!editorDoc || editorDoc.body.dataset.unahBlockUiEnabled === 'true') return;

    editorDoc.body.dataset.unahBlockUiEnabled = 'true';

    editorDoc.addEventListener('click', function (event) {
      const block = event.target.closest('[data-unah-block]');
      if (!block) return;

      selectedBlock = block;
      selectedEditorDoc = editorDoc;

      editorDoc.querySelectorAll('.unah-selected-block').forEach(function (el) {
        el.classList.remove('unah-selected-block');
      });

      block.classList.add('unah-selected-block');

      openPanel();
      setActiveTab('styles');

      const content = document.getElementById('unah-tab-content');
      if (content) content.innerHTML = getStylesView();
    }, true);
  }

  function handleSelectedBlockAction(action) {
    if (!selectedBlock || !selectedEditorDoc) return;

    if (action === 'duplicate') {
      selectedBlock.insertAdjacentHTML('afterend', selectedBlock.outerHTML);
    }

    if (action === 'delete') {
      const next = selectedBlock.nextElementSibling || selectedBlock.previousElementSibling;
      selectedBlock.remove();
      selectedBlock = next && next.matches('[data-unah-block]') ? next : null;
    }

    if (action === 'move-up' && selectedBlock.previousElementSibling) {
      selectedBlock.parentNode.insertBefore(selectedBlock, selectedBlock.previousElementSibling);
    }

    if (action === 'move-down' && selectedBlock.nextElementSibling) {
      selectedBlock.parentNode.insertBefore(selectedBlock.nextElementSibling, selectedBlock);
    }

    const content = document.getElementById('unah-tab-content');
    if (content) content.innerHTML = getStylesView();

    applyEditorAssets();
  }

  function enableSavedContentInteractions() {
    document.addEventListener('click', function (e) {
      const tabBtn = e.target.closest('[data-bs-toggle="tab"]');

      if (tabBtn && !window.bootstrap) {
        e.preventDefault();

        const targetSelector = tabBtn.getAttribute('data-bs-target');
        if (!targetSelector) return;

        const wrapper = tabBtn.closest('[data-unah-block]') || document;
        const tabList = tabBtn.closest('[role="tablist"]');

        if (tabList) {
          tabList.querySelectorAll('[data-bs-toggle="tab"]').forEach(function (btn) {
            btn.classList.remove('active');
            btn.setAttribute('aria-selected', 'false');
          });
        }

        wrapper.querySelectorAll('.tab-pane').forEach(function (pane) {
          pane.classList.remove('show', 'active');
        });

        tabBtn.classList.add('active');
        tabBtn.setAttribute('aria-selected', 'true');

        const pane = wrapper.querySelector(targetSelector);
        if (pane) pane.classList.add('show', 'active');
      }

      const collapseBtn = e.target.closest('[data-bs-toggle="collapse"]');

      if (collapseBtn && !window.bootstrap) {
        e.preventDefault();

        const targetSelector = collapseBtn.getAttribute('data-bs-target');
        if (!targetSelector) return;

        const wrapper = collapseBtn.closest('[data-unah-block]') || document;
        const target = wrapper.querySelector(targetSelector);

        if (target) {
          target.classList.toggle('show');
          const expanded = target.classList.contains('show');
          collapseBtn.setAttribute('aria-expanded', expanded ? 'true' : 'false');
          collapseBtn.classList.toggle('collapsed', !expanded);
        }
      }
    });
  }

  waitForEditor();
})();
