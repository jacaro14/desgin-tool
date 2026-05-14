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
    const observer = new MutationObserver(() => {
      const panelExists = document.getElementById('unah-design-panel');
      const toggleExists = document.getElementById('unah-design-toggle');

      if (isEditingCanvasContent()) {
        if (!panelExists && !toggleExists) {
          createPanel();
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
        <button type="button" data-tab="templates">Templates</button>
        <button type="button" data-tab="blocks">Blocks</button>
        <button type="button" data-tab="styles">Styles</button>
      </div>

      <div class="unah-tab-content" id="unah-tab-content">
        ${getTemplatesView()}
      </div>
    `;

    document.body.appendChild(toggle);
    document.body.appendChild(panel);

    toggle.addEventListener('click', () => {
      panel.classList.add('open');
    });

    panel.querySelector('#unah-close-panel').addEventListener('click', () => {
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

      if (tab === 'templates') content.innerHTML = getTemplatesView();
      if (tab === 'blocks') content.innerHTML = getBlocksView();
      if (tab === 'styles') content.innerHTML = getStylesView();

      return;
    }

    if (insertBtn) {
      insertTemplate(insertBtn.dataset.insert);
    }
  }

  function getTemplatesView() {
    return `
      <h3>Page Templates</h3>

      <button class="unah-tool-btn" type="button" data-insert="homepage">
        Course Homepage
      </button>

      <button class="unah-tool-btn" type="button" data-insert="module-intro">
        Module Introduction
      </button>
    `;
  }

  function getBlocksView() {
    return `
      <h3>Content Blocks</h3>

      <button class="unah-tool-btn" type="button" data-insert="banner">
        Banner
      </button>

      <button class="unah-tool-btn" type="button" data-insert="card">
        Card
      </button>

      <button class="unah-tool-btn" type="button" data-insert="callout">
        Callout
      </button>

      <button class="unah-tool-btn" type="button" data-insert="button">
        Button
      </button>

      <button class="unah-tool-btn" type="button" data-insert="objectives">
        Learning Objectives
      </button>
    `;
  }

  function getStylesView() {
    return `
      <h3>Styles</h3>
      <p>Esta sección se usará después para aplicar estilos al contenido seleccionado.</p>
    `;
  }

  function getTemplateHtml(type) {
    const templates = {
      banner: `
<div class="unah-banner">
  <h2>Título del banner</h2>
  <p>Descripción breve del contenido.</p>
</div>
`,

      card: `
<div class="unah-card">
  <h3>Título de la tarjeta</h3>
  <p>Contenido de ejemplo para la tarjeta.</p>
</div>
`,

      callout: `
<div class="unah-callout">
  <strong>Nota importante:</strong>
  <p>Escriba aquí la información destacada.</p>
</div>
`,

      button: `
<p>
  <a class="unah-btn" href="#">Botón de ejemplo</a>
</p>
`,

      objectives: `
<div class="unah-objectives">
  <h3>Objetivos de aprendizaje</h3>
  <ul>
    <li>Objetivo de aprendizaje 1.</li>
    <li>Objetivo de aprendizaje 2.</li>
    <li>Objetivo de aprendizaje 3.</li>
  </ul>
</div>
`,

      homepage: `
<div class="unah-course-home">
  <div class="unah-banner">
    <h2>Bienvenido al curso</h2>
    <p>En este espacio encontrará los recursos, actividades y evaluaciones del curso.</p>
  </div>

  <div class="unah-card-grid">
    <div class="unah-card">
      <h3>Inicio</h3>
      <p>Revise la información general del curso.</p>
    </div>

    <div class="unah-card">
      <h3>Módulos</h3>
      <p>Acceda al contenido organizado por unidades.</p>
    </div>

    <div class="unah-card">
      <h3>Evaluaciones</h3>
      <p>Consulte las actividades evaluativas disponibles.</p>
    </div>
  </div>
</div>
`,

      'module-intro': `
<div class="unah-module-intro">
  <h2>Introducción al módulo</h2>
  <p>En este módulo usted estudiará los conceptos principales del tema.</p>

  <div class="unah-callout">
    <strong>Objetivo:</strong>
    <p>Al finalizar, podrá aplicar los conocimientos en una actividad práctica.</p>
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
      alert('No se encontró el editor. Abra una página en modo edición.');
      return;
    }

    const editorBody = iframe.contentDocument.body;

    editorBody.focus();

    try {
      iframe.contentWindow.document.execCommand('insertHTML', false, html);
    } catch (e) {
      editorBody.insertAdjacentHTML('beforeend', html);
    }
  }

  waitForEditor();
})();
