(function () {

    function initUNAHDesignTools() {
        if (document.getElementById('unah-design-panel')) return;

        const toggle = document.createElement('button');
        toggle.id = 'unah-design-toggle';
        toggle.textContent = 'Diseño';

        const panel = document.createElement('aside');
        panel.id = 'unah-design-panel';

        panel.innerHTML = `
      <h2>Mi panel de diseño</h2>
      <p>Herramientas institucionales para Canvas.</p>

      <button class="unah-tool-btn" data-template="card">
        Insertar tarjeta
      </button>

      <button class="unah-tool-btn" data-template="banner">
        Insertar banner
      </button>
    `;

        document.body.appendChild(toggle);
        document.body.appendChild(panel);

        toggle.addEventListener('click', function () {
            panel.classList.toggle('open');
        });

        panel.addEventListener('click', function (e) {
            const btn = e.target.closest('[data-template]');
            if (!btn) return;

            const template = btn.dataset.template;
            alert('Aquí insertaremos el componente: ' + template);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initUNAHDesignTools);
    } else {
        initUNAHDesignTools();
    }
})();