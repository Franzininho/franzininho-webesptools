document.getElementById('customInstallButton').addEventListener('click', async (event) => {
    const files = [];
    for (let i = 1; i <= 4; i++) {
      const binInput = document.getElementById(`bin${i}`);
      const offsetInput = document.getElementById(`offset${i}`);
      if (binInput.files.length > 0 && offsetInput.value) {
        files.push({
          path: URL.createObjectURL(binInput.files[0]),
          offset: offsetInput.value
        });
      }
    }
  
    if (files.length > 0) {
      const manifest = {
        name: "Custom Firmware",
        builds: [
          {
            chipFamily: "ESP32-S2",
            parts: files
          }
        ]
      };
  
      const customInstallButton = document.getElementById('customInstallButton');
      customInstallButton.manifest = URL.createObjectURL(new Blob([JSON.stringify(manifest)], { type: 'application/json' }));
    } else {
      alert('Please select at least one binary file and specify its offset.');
      event.preventDefault(); // Prevent the default action if no files are selected
    }
  });
  
  window.onload = function() {
    if (navigator.serial) {
      document.getElementById("notSupported").style.display = 'none';
      document.getElementById("main").style.display = 'block';
    } else {
      document.getElementById("notSupported").style.display = 'block';
      document.getElementById("main").style.display = 'none';
    }
  };
  
  // Função para agrupar apps por categoria e subcategoria
  function groupByCategory(apps) {
    const grouped = {};
    apps.forEach(app => {
      const [mainCat, subCat] = app.category.split('>').map(s => s.trim());
      if (!grouped[mainCat]) grouped[mainCat] = {};
      if (!grouped[mainCat][subCat || '']) grouped[mainCat][subCat || ''] = [];
      grouped[mainCat][subCat || ''].push(app);
    });
    return grouped;
  }
  
  // Função para buscar a versão do manifesto de cada app
  async function fetchAppVersions(apps) {
    const versionMap = {};
    await Promise.all(apps.map(async (app) => {
      if (app.manifest) {
        try {
          const resp = await fetch(app.manifest);
          const manifest = await resp.json();
          versionMap[app.id] = manifest.version || '';
        } catch (e) {
          versionMap[app.id] = '';
        }
      } else {
        versionMap[app.id] = '';
      }
    }));
    return versionMap;
  }
  
  // Função para criar o HTML dos cards com seletor de versão
  function createAppCard(app) {
    let versionOptions = '';
    let defaultManifest = '';
    if (app.versions && app.versions.length > 0) {
      versionOptions = app.versions.map((v, idx) => `<option value="${v.manifest}"${idx === app.versions.length - 1 ? ' selected' : ''}>${v.label}</option>`).join('');
      defaultManifest = app.versions[app.versions.length - 1].manifest;
    }
    // Badges para categoria, tags, boards e soc
    const categoryBadge = app.category ? `<span class="badge badge-pill badge-primary mr-1 mb-1">${app.category}</span>` : '';
    const tagBadges = app.tags ? app.tags.map(tag => `<span class="badge badge-pill badge-info mr-1 mb-1">${tag}</span>`).join('') : '';
    const boardBadges = app.boards ? app.boards.map(board => `<span class="badge badge-pill badge-success mr-1 mb-1">${board}</span>`).join('') : '';
    const socBadges = app.soc ? app.soc.map(soc => `<span class="badge badge-pill badge-warning text-dark mr-1 mb-1">${soc}</span>`).join('') : '';

    return `
      <div class="col-md-4 mb-4">
        <div class="card h-100 shadow-sm border-success">
          <img src="${app.image}" class="card-img-top p-3" alt="${app.name}" style="max-height:120px;object-fit:contain;">
          <div class="card-body">
            <h5 class="card-title font-weight-bold text-success">${app.name}</h5>
            ${versionOptions ? `<select class="form-control mb-2 version-select" data-app-id="${app.id}">${versionOptions}</select>` : ''}
            <div class="mb-2">${categoryBadge}${tagBadges}${boardBadges}${socBadges}</div>
            <p class="card-text">${app.description}</p>
          </div>
          <div class="card-footer bg-transparent border-top-0">
            ${defaultManifest ? `<esp-web-install-button class="install-btn" manifest="${defaultManifest}"><button slot="activate" class="btn btn-success w-100">Gravar na placa</button></esp-web-install-button>` : '<span class="text-muted">Em breve</span>'}
          </div>
        </div>
      </div>
    `;
  }
  
  // Função para criar o HTML dos filtros com botão de filtro expansível
  function createFilterBar(apps) {
    const categories = ["Plataformas", "Automação", "Exemplos", "Jogos"];
    const tags = ["sensores", "atuadores", "automação", "demo", "fabrica"];
    const boards = ["Franzininho WiFi", "Franzininho WiFi LAB01"];
    const socs = ["ESP32-S2", "ESP32-S3"];
    return `
      <div class="row mb-4">
        <div class="col-12 col-md-3 order-md-2 mb-3 mb-md-0">
          <div id="advancedFilters" class="card p-3 mb-2 d-none d-md-block" style="background: #f8f9fa; border-radius: 12px;">
            <input type="text" id="searchInput" class="form-control mb-3" placeholder="Buscar por nome, descrição ou tag...">
            <div class="mb-2"><strong>Categorias</strong></div>
            <div class="mb-3 d-flex flex-wrap">
              ${categories.map(cat => `
                <div class="form-check mr-3 mb-1">
                  <input class="form-check-input category-checkbox" type="checkbox" value="${cat}" id="cat-${cat}">
                  <label class="form-check-label" for="cat-${cat}">${cat}</label>
                </div>
              `).join('')}
            </div>
            <div class="mb-2"><strong>Tags</strong></div>
            <div class="d-flex flex-wrap">
              ${tags.map(tag => `
                <div class="form-check mr-3 mb-1">
                  <input class="form-check-input tag-checkbox" type="checkbox" value="${tag}" id="tag-${tag}">
                  <label class="form-check-label" for="tag-${tag}">${tag}</label>
                </div>
              `).join('')}
            </div>
            <div class="mb-2 mt-2"><strong>Placas</strong></div>
            <div class="d-flex flex-wrap mb-2">
              ${boards.map(board => `
                <div class="form-check mr-3 mb-1">
                  <input class="form-check-input board-checkbox" type="checkbox" value="${board}" id="board-${board}">
                  <label class="form-check-label" for="board-${board}">${board}</label>
                </div>
              `).join('')}
            </div>
            <div class="mb-2 mt-2"><strong>SoC</strong></div>
            <div class="d-flex flex-wrap">
              ${socs.map(soc => `
                <div class="form-check mr-3 mb-1">
                  <input class="form-check-input soc-checkbox" type="checkbox" value="${soc}" id="soc-${soc}">
                  <label class="form-check-label" for="soc-${soc}">${soc}</label>
                </div>
              `).join('')}
            </div>
            <div class="mt-2 text-right">
              <button id="clearFilters" class="btn btn-sm btn-link text-secondary" style="text-decoration: underline; font-size: 0.95em;">Limpar filtros</button>
            </div>
          </div>
          <!-- Filtro mobile -->
          <div id="advancedFiltersMobile" class="card p-3 mb-2 d-md-none" style="display:none; background: #f8f9fa; border-radius: 12px;">
            <input type="text" id="searchInputMobile" class="form-control mb-3" placeholder="Buscar por nome, descrição ou tag...">
            <div class="mb-2"><strong>Categorias</strong></div>
            <div class="mb-3 d-flex flex-wrap">
              ${categories.map(cat => `
                <div class="form-check mr-3 mb-1">
                  <input class="form-check-input category-checkbox" type="checkbox" value="${cat}" id="cat-mob-${cat}">
                  <label class="form-check-label" for="cat-mob-${cat}">${cat}</label>
                </div>
              `).join('')}
            </div>
            <div class="mb-2"><strong>Tags</strong></div>
            <div class="d-flex flex-wrap">
              ${tags.map(tag => `
                <div class="form-check mr-3 mb-1">
                  <input class="form-check-input tag-checkbox" type="checkbox" value="${tag}" id="tag-mob-${tag}">
                  <label class="form-check-label" for="tag-mob-${tag}">${tag}</label>
                </div>
              `).join('')}
            </div>
            <div class="mb-2 mt-2"><strong>Placas</strong></div>
            <div class="d-flex flex-wrap mb-2">
              ${boards.map(board => `
                <div class="form-check mr-3 mb-1">
                  <input class="form-check-input board-checkbox" type="checkbox" value="${board}" id="board-mob-${board}">
                  <label class="form-check-label" for="board-mob-${board}">${board}</label>
                </div>
              `).join('')}
            </div>
            <div class="mb-2 mt-2"><strong>SoC</strong></div>
            <div class="d-flex flex-wrap">
              ${socs.map(soc => `
                <div class="form-check mr-3 mb-1">
                  <input class="form-check-input soc-checkbox" type="checkbox" value="${soc}" id="soc-mob-${soc}">
                  <label class="form-check-label" for="soc-mob-${soc}">${soc}</label>
                </div>
              `).join('')}
            </div>
            <div class="mt-2 text-right">
              <button id="clearFiltersMobile" class="btn btn-sm btn-link text-secondary" style="text-decoration: underline; font-size: 0.95em;">Limpar filtros</button>
            </div>
          </div>
          <button id="expandFilters" class="btn btn-outline-secondary d-md-none w-100 mt-2" type="button" title="Filtros avançados"><i class="bi bi-funnel"></i> Filtros</button>
        </div>
        <div class="col-12 col-md-9 order-md-1" id="cards-area"></div>
      </div>
    `;
  }
  
  // Função para renderizar os apps na página, agrupando por categoria e subcategoria, sem header 'Firmware'
  async function renderAppStore() {
    const response = await fetch('./src/data/apps.json');
    const apps = await response.json();
    const filtersContainer = document.getElementById('app-store-filters');
    const container = document.getElementById('app-store-list');
  
    let filteredApps = apps;
    let selectedCategories = [];
    let selectedTags = [];
    let selectedBoards = [];
    let selectedSocs = [];
  
    // Renderiza filtros apenas uma vez
    filtersContainer.innerHTML = createFilterBar(apps);
    attachFilterEvents();
  
    function applyFilters() {
      const search = (document.getElementById('searchInput') || document.getElementById('searchInputMobile')).value.toLowerCase();
      filteredApps = apps.filter(app => {
        const matchesSearch = app.name.toLowerCase().includes(search) || app.description.toLowerCase().includes(search) || (app.tags && app.tags.some(t => t.toLowerCase().includes(search)));
        const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(app.category);
        const matchesTag = selectedTags.length === 0 || (app.tags && selectedTags.every(tag => app.tags.includes(tag)));
        const matchesBoard = selectedBoards.length === 0 || (app.boards && selectedBoards.some(board => app.boards.includes(board)));
        const matchesSoc = selectedSocs.length === 0 || (app.soc && selectedSocs.some(soc => app.soc.includes(soc)));
        return matchesSearch && matchesCategory && matchesTag && matchesBoard && matchesSoc;
      });
      renderFilteredApps();
    }
  
    function renderFilteredApps() {
      const grouped = groupByCategory(filteredApps);
      let html = '';
      Object.keys(grouped).forEach(mainCat => {
        Object.keys(grouped[mainCat]).forEach(subCat => {
          html += `<div class="row">${grouped[mainCat][subCat].map(app => createAppCard(app)).join('')}</div>`;
        });
      });
      // Botão de ajuda para instruções
      const helpBtn = `<button id='showInstructions' class='btn btn-outline-info mb-3'><i class='bi bi-info-circle'></i> Como gravar na Franzininho WiFi</button>`;
      // Instruções ocultas
      const instructions = `<div id='instructionsBox' class='alert alert-info mb-4' style='display:none;'><strong>Como gravar na Franzininho WiFi:</strong><ol class='mb-0'><li>Conecte a sua placa Franzininho a uma das portas USB de seu computador;</li><li>Coloque sua placa em modo DFU:<ul><li>Pressione e segure a tecla BOOT.</li><li>Pressione rapidamente e solte a tecla RESET.</li><li>Solte a tecla BOOT.</li></ul></li><li>Clique no botão <strong>Gravar na placa</strong> no app desejado.</li></ol></div>`;
      document.getElementById('cards-area').innerHTML = helpBtn + instructions + html;
      document.getElementById('showInstructions').onclick = function() {
        const box = document.getElementById('instructionsBox');
        box.style.display = box.style.display === 'none' ? 'block' : 'none';
      };
      attachVersionSelectEvents();
    }
  
    function attachFilterEvents() {
      const searchInput = document.getElementById('searchInput');
      if (searchInput) searchInput.addEventListener('input', applyFilters);
      const searchInputMobile = document.getElementById('searchInputMobile');
      if (searchInputMobile) searchInputMobile.addEventListener('input', applyFilters);
      const expandBtn = document.getElementById('expandFilters');
      const advMobile = document.getElementById('advancedFiltersMobile');
      if (expandBtn && advMobile) {
        expandBtn.addEventListener('click', function() {
          advMobile.style.display = advMobile.style.display === 'none' ? 'block' : 'none';
        });
      }
      // Desktop
      document.querySelectorAll('#advancedFilters .category-checkbox').forEach(cb => {
        cb.addEventListener('change', function() {
          selectedCategories = Array.from(document.querySelectorAll('#advancedFilters .category-checkbox:checked')).map(c => c.value);
          applyFilters();
        });
      });
      document.querySelectorAll('#advancedFilters .tag-checkbox').forEach(cb => {
        cb.addEventListener('change', function() {
          selectedTags = Array.from(document.querySelectorAll('#advancedFilters .tag-checkbox:checked')).map(c => c.value);
          applyFilters();
        });
      });
      document.querySelectorAll('#advancedFilters .board-checkbox').forEach(cb => {
        cb.addEventListener('change', function() {
          selectedBoards = Array.from(document.querySelectorAll('#advancedFilters .board-checkbox:checked')).map(c => c.value);
          applyFilters();
        });
      });
      document.querySelectorAll('#advancedFilters .soc-checkbox').forEach(cb => {
        cb.addEventListener('change', function() {
          selectedSocs = Array.from(document.querySelectorAll('#advancedFilters .soc-checkbox:checked')).map(c => c.value);
          applyFilters();
        });
      });
      const clearBtn = document.getElementById('clearFilters');
      if (clearBtn) {
        clearBtn.addEventListener('click', (e) => {
          e.preventDefault();
          if (searchInput) searchInput.value = '';
          selectedCategories = [];
          selectedTags = [];
          selectedBoards = [];
          selectedSocs = [];
          document.querySelectorAll('#advancedFilters .category-checkbox, #advancedFilters .tag-checkbox, #advancedFilters .board-checkbox, #advancedFilters .soc-checkbox').forEach(cb => cb.checked = false);
          applyFilters();
        });
      }
      // Mobile
      document.querySelectorAll('#advancedFiltersMobile .category-checkbox').forEach(cb => {
        cb.addEventListener('change', function() {
          selectedCategories = Array.from(document.querySelectorAll('#advancedFiltersMobile .category-checkbox:checked')).map(c => c.value);
          applyFilters();
        });
      });
      document.querySelectorAll('#advancedFiltersMobile .tag-checkbox').forEach(cb => {
        cb.addEventListener('change', function() {
          selectedTags = Array.from(document.querySelectorAll('#advancedFiltersMobile .tag-checkbox:checked')).map(c => c.value);
          applyFilters();
        });
      });
      document.querySelectorAll('#advancedFiltersMobile .board-checkbox').forEach(cb => {
        cb.addEventListener('change', function() {
          selectedBoards = Array.from(document.querySelectorAll('#advancedFiltersMobile .board-checkbox:checked')).map(c => c.value);
          applyFilters();
        });
      });
      document.querySelectorAll('#advancedFiltersMobile .soc-checkbox').forEach(cb => {
        cb.addEventListener('change', function() {
          selectedSocs = Array.from(document.querySelectorAll('#advancedFiltersMobile .soc-checkbox:checked')).map(c => c.value);
          applyFilters();
        });
      });
      const clearBtnMob = document.getElementById('clearFiltersMobile');
      if (clearBtnMob) {
        clearBtnMob.addEventListener('click', (e) => {
          e.preventDefault();
          if (searchInputMobile) searchInputMobile.value = '';
          selectedCategories = [];
          selectedTags = [];
          selectedBoards = [];
          selectedSocs = [];
          document.querySelectorAll('#advancedFiltersMobile .category-checkbox, #advancedFiltersMobile .tag-checkbox, #advancedFiltersMobile .board-checkbox, #advancedFiltersMobile .soc-checkbox').forEach(cb => cb.checked = false);
          applyFilters();
        });
      }
    }
  
    function attachVersionSelectEvents() {
      document.querySelectorAll('.version-select').forEach(select => {
        select.addEventListener('change', function() {
          const card = this.closest('.card');
          const manifest = this.value;
          const installBtn = card.querySelector('esp-web-install-button');
          if (installBtn) installBtn.setAttribute('manifest', manifest);
        });
      });
    }
  
    // Inicialização
    renderFilteredApps();
  }
  
  document.addEventListener('DOMContentLoaded', function() {
    const appStoreDiv = document.createElement('div');
    appStoreDiv.id = 'app-store-list';
    appStoreDiv.className = 'container';
    document.body.insertBefore(appStoreDiv, document.getElementById('main'));
    renderAppStore();
  });
  // Ao adicionar novo firmware, coloque a imagem do card na mesma pasta do firmware e aponte o campo 'image' no apps.json para esse caminho.