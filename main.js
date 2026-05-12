const TRANSLATIONS = {
  pt: {
    'alert.noSerial': '<strong>Ops!</strong> Seu navegador não suporta Web Serial 😭. Use o Google Chrome.',
    'btn.customFirmware': 'Gravar Custom Firmware',
    'modal.customFirmware.title': 'Gravar Custom Firmware',
    'btn.connect': 'Conectar',
    'modal.instructions.html': `<strong>Instruções:</strong><ol><li>Conecte a sua placa Franzininho a uma das portas USB de seu computador;</li><li>Coloque sua placa em modo DFU:<ul><li>Pressione e segure a tecla BOOT.</li><li>Pressione rapidamente e solte a tecla RESET.</li><li>Solte a tecla BOOT.</li></ul></li><li>Clique no botão Conectar logo abaixo.</li></ol>`,
    'filter.search': 'Buscar por nome, descrição ou tag...',
    'filter.categories': 'Categorias',
    'filter.tags': 'Tags',
    'filter.boards': 'Placas',
    'filter.soc': 'SoC',
    'filter.clear': 'Limpar filtros',
    'filter.toggle': 'Filtros',
    'card.install': 'Gravar na placa',
    'card.comingSoon': 'Em breve',
    'btn.howToFlash': 'Como gravar na Franzininho WiFi',
    'howToFlash.html': `<strong>Como gravar na Franzininho WiFi:</strong><ol class='mb-0'><li>Conecte a sua placa Franzininho a uma das portas USB de seu computador;</li><li>Coloque sua placa em modo DFU:<ul><li>Pressione e segure a tecla BOOT.</li><li>Pressione rapidamente e solte a tecla RESET.</li><li>Solte a tecla BOOT.</li></ul></li><li>Clique no botão <strong>Gravar na placa</strong> no app desejado.</li></ol>`,
    'footer.rights': '© 2025 Franzininho. Todos os direitos reservados.',
    'modal.about.developers': 'Desenvolvedores:',
    'modal.about.basedOn': 'Baseado:',
    'btn.close': 'Fechar',
  },
  en: {
    'alert.noSerial': "<strong>Oops!</strong> Your browser doesn't support Web Serial 😭. Please use Google Chrome.",
    'btn.customFirmware': 'Flash Custom Firmware',
    'modal.customFirmware.title': 'Flash Custom Firmware',
    'btn.connect': 'Connect',
    'modal.instructions.html': `<strong>Instructions:</strong><ol><li>Connect your Franzininho board to one of your computer's USB ports;</li><li>Put your board in DFU mode:<ul><li>Press and hold the BOOT key.</li><li>Quickly press and release the RESET key.</li><li>Release the BOOT key.</li></ul></li><li>Click the Connect button below.</li></ol>`,
    'filter.search': 'Search by name, description or tag...',
    'filter.categories': 'Categories',
    'filter.tags': 'Tags',
    'filter.boards': 'Boards',
    'filter.soc': 'SoC',
    'filter.clear': 'Clear filters',
    'filter.toggle': 'Filters',
    'card.install': 'Flash to board',
    'card.comingSoon': 'Coming soon',
    'btn.howToFlash': 'How to flash the Franzininho WiFi',
    'howToFlash.html': `<strong>How to flash the Franzininho WiFi:</strong><ol class='mb-0'><li>Connect your Franzininho board to one of your computer's USB ports;</li><li>Put your board in DFU mode:<ul><li>Press and hold the BOOT key.</li><li>Quickly press and release the RESET key.</li><li>Release the BOOT key.</li></ul></li><li>Click the <strong>Flash to board</strong> button on the desired app.</li></ol>`,
    'footer.rights': '© 2025 Franzininho. All rights reserved.',
    'modal.about.developers': 'Developers:',
    'modal.about.basedOn': 'Based on:',
    'btn.close': 'Close',
  }
};

let currentLang = localStorage.getItem('franzininho_lang') || 'pt';

function t(key) {
  return TRANSLATIONS[currentLang][key] || key;
}

function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    el.textContent = t(el.getAttribute('data-i18n'));
  });
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    el.innerHTML = t(el.getAttribute('data-i18n-html'));
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    el.placeholder = t(el.getAttribute('data-i18n-placeholder'));
  });
}

function updateLangButtons() {
  const ptBtn = document.getElementById('lang-pt');
  const enBtn = document.getElementById('lang-en');
  if (!ptBtn || !enBtn) return;
  ptBtn.className = currentLang === 'pt' ? 'btn btn-sm btn-light' : 'btn btn-sm btn-outline-light';
  enBtn.className = currentLang === 'en' ? 'btn btn-sm btn-light' : 'btn btn-sm btn-outline-light';
}

let _reRenderApps = null;

function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('franzininho_lang', lang);
  updateLangButtons();
  applyTranslations();
  if (_reRenderApps) _reRenderApps();
}

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
      builds: [{ chipFamily: "ESP32-S2", parts: files }]
    };
    const customInstallButton = document.getElementById('customInstallButton');
    customInstallButton.manifest = URL.createObjectURL(new Blob([JSON.stringify(manifest)], { type: 'application/json' }));
  } else {
    alert('Please select at least one binary file and specify its offset.');
    event.preventDefault();
  }
});

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

function createAppCard(app) {
  const desc = (currentLang === 'en' && app.description_en) ? app.description_en : app.description;
  let versionOptions = '';
  let defaultManifest = '';
  if (app.versions && app.versions.length > 0) {
    versionOptions = app.versions.map((v, idx) => `<option value="${v.manifest}"${idx === app.versions.length - 1 ? ' selected' : ''}>${v.label}</option>`).join('');
    defaultManifest = app.versions[app.versions.length - 1].manifest;
  }
  const categoryBadge = app.category ? `<span class="badge badge-pill badge-primary mr-1 mb-1">${app.category}</span>` : '';
  const tagBadges = app.tags ? app.tags.map(tag => `<span class="badge badge-pill badge-info mr-1 mb-1">${tag}</span>`).join('') : '';
  const boardBadges = app.boards ? app.boards.map(board => `<span class="badge badge-pill badge-success mr-1 mb-1">${board}</span>`).join('') : '';
  const socBadges = app.soc ? app.soc.map(soc => `<span class="badge badge-pill badge-warning text-dark mr-1 mb-1">${soc}</span>`).join('') : '';
  const infoBtn = app.url ? `<a href="${app.url}" target="_blank" class="btn btn-link p-0 ml-0 mb-2 d-inline-block" style="font-size:0.97em;"><i class="bi bi-info-circle"></i> +info</a>` : '';
  const author = app.author ? `<div class='text-muted mb-1' style='font-size:0.93em;'><i class="bi bi-person"></i> ${app.author}</div>` : '';

  return `
    <div class="col-md-4 mb-4">
      <div class="card h-100 shadow-sm border-success">
        <img src="${app.image}" class="card-img-top p-3" alt="${app.name}" style="max-height:120px;object-fit:contain;">
        <div class="card-body">
          <h5 class="card-title font-weight-bold text-success">${app.name}</h5>
          ${versionOptions ? `<select class="form-control mb-2 version-select" data-app-id="${app.id}">${versionOptions}</select>` : ''}
          <div class="mb-2">${categoryBadge}${tagBadges}${boardBadges}${socBadges}</div>
          ${author}
          ${infoBtn}
          <p class="card-text">${desc}</p>
        </div>
        <div class="card-footer bg-transparent border-top-0 d-flex justify-content-between align-items-center">
          ${defaultManifest
            ? `<esp-web-install-button class="install-btn" manifest="${defaultManifest}"><button slot="activate" class="btn btn-success w-100">${t('card.install')}</button></esp-web-install-button>`
            : `<span class="text-muted">${t('card.comingSoon')}</span>`}
        </div>
      </div>
    </div>
  `;
}

function createFilterBar() {
  const categories = ["Plataformas", "Automação", "Exemplos", "Jogos"];
  const tags = ["sensores", "atuadores", "automação", "demo", "fabrica"];
  const boards = ["Franzininho WiFi", "Franzininho WiFi LAB01"];
  const socs = ["ESP32-S2", "ESP32-S3"];
  return `
    <div class="row mb-4">
      <div class="col-12 col-md-3 order-md-2 mb-3 mb-md-0">
        <div id="advancedFilters" class="card p-3 mb-2 d-none d-md-block" style="background: #f8f9fa; border-radius: 12px;">
          <input type="text" id="searchInput" class="form-control mb-3" data-i18n-placeholder="filter.search" placeholder="${t('filter.search')}">
          <div class="mb-2"><strong data-i18n="filter.categories">${t('filter.categories')}</strong></div>
          <div class="mb-3 d-flex flex-wrap">
            ${categories.map(cat => `
              <div class="form-check mr-3 mb-1">
                <input class="form-check-input category-checkbox" type="checkbox" value="${cat}" id="cat-${cat}">
                <label class="form-check-label" for="cat-${cat}">${cat}</label>
              </div>
            `).join('')}
          </div>
          <div class="mb-2"><strong data-i18n="filter.tags">${t('filter.tags')}</strong></div>
          <div class="d-flex flex-wrap">
            ${tags.map(tag => `
              <div class="form-check mr-3 mb-1">
                <input class="form-check-input tag-checkbox" type="checkbox" value="${tag}" id="tag-${tag}">
                <label class="form-check-label" for="tag-${tag}">${tag}</label>
              </div>
            `).join('')}
          </div>
          <div class="mb-2 mt-2"><strong data-i18n="filter.boards">${t('filter.boards')}</strong></div>
          <div class="d-flex flex-wrap mb-2">
            ${boards.map(board => `
              <div class="form-check mr-3 mb-1">
                <input class="form-check-input board-checkbox" type="checkbox" value="${board}" id="board-${board}">
                <label class="form-check-label" for="board-${board}">${board}</label>
              </div>
            `).join('')}
          </div>
          <div class="mb-2 mt-2"><strong data-i18n="filter.soc">${t('filter.soc')}</strong></div>
          <div class="d-flex flex-wrap">
            ${socs.map(soc => `
              <div class="form-check mr-3 mb-1">
                <input class="form-check-input soc-checkbox" type="checkbox" value="${soc}" id="soc-${soc}">
                <label class="form-check-label" for="soc-${soc}">${soc}</label>
              </div>
            `).join('')}
          </div>
          <div class="mt-2 text-right">
            <button id="clearFilters" class="btn btn-sm btn-link text-secondary" style="text-decoration: underline; font-size: 0.95em;" data-i18n="filter.clear">${t('filter.clear')}</button>
          </div>
        </div>
        <!-- Filtro mobile -->
        <div id="advancedFiltersMobile" class="card p-3 mb-2 d-md-none" style="display:none; background: #f8f9fa; border-radius: 12px;">
          <input type="text" id="searchInputMobile" class="form-control mb-3" data-i18n-placeholder="filter.search" placeholder="${t('filter.search')}">
          <div class="mb-2"><strong data-i18n="filter.categories">${t('filter.categories')}</strong></div>
          <div class="mb-3 d-flex flex-wrap">
            ${categories.map(cat => `
              <div class="form-check mr-3 mb-1">
                <input class="form-check-input category-checkbox" type="checkbox" value="${cat}" id="cat-mob-${cat}">
                <label class="form-check-label" for="cat-mob-${cat}">${cat}</label>
              </div>
            `).join('')}
          </div>
          <div class="mb-2"><strong data-i18n="filter.tags">${t('filter.tags')}</strong></div>
          <div class="d-flex flex-wrap">
            ${tags.map(tag => `
              <div class="form-check mr-3 mb-1">
                <input class="form-check-input tag-checkbox" type="checkbox" value="${tag}" id="tag-mob-${tag}">
                <label class="form-check-label" for="tag-mob-${tag}">${tag}</label>
              </div>
            `).join('')}
          </div>
          <div class="mb-2 mt-2"><strong data-i18n="filter.boards">${t('filter.boards')}</strong></div>
          <div class="d-flex flex-wrap mb-2">
            ${boards.map(board => `
              <div class="form-check mr-3 mb-1">
                <input class="form-check-input board-checkbox" type="checkbox" value="${board}" id="board-mob-${board}">
                <label class="form-check-label" for="board-mob-${board}">${board}</label>
              </div>
            `).join('')}
          </div>
          <div class="mb-2 mt-2"><strong data-i18n="filter.soc">${t('filter.soc')}</strong></div>
          <div class="d-flex flex-wrap">
            ${socs.map(soc => `
              <div class="form-check mr-3 mb-1">
                <input class="form-check-input soc-checkbox" type="checkbox" value="${soc}" id="soc-mob-${soc}">
                <label class="form-check-label" for="soc-mob-${soc}">${soc}</label>
              </div>
            `).join('')}
          </div>
          <div class="mt-2 text-right">
            <button id="clearFiltersMobile" class="btn btn-sm btn-link text-secondary" style="text-decoration: underline; font-size: 0.95em;" data-i18n="filter.clear">${t('filter.clear')}</button>
          </div>
        </div>
        <button id="expandFilters" class="btn btn-outline-secondary d-md-none w-100 mt-2" type="button">
          <i class="bi bi-funnel"></i> <span data-i18n="filter.toggle">${t('filter.toggle')}</span>
        </button>
      </div>
      <div class="col-12 col-md-9 order-md-1" id="cards-area"></div>
    </div>
  `;
}

async function renderAppStore() {
  const response = await fetch('./src/data/apps.json');
  const apps = await response.json();
  const filtersContainer = document.getElementById('app-store-filters');

  let filteredApps = apps;
  let selectedCategories = [];
  let selectedTags = [];
  let selectedBoards = [];
  let selectedSocs = [];

  filtersContainer.innerHTML = createFilterBar();
  attachFilterEvents();

  function applyFilters() {
    const searchInput = document.getElementById('searchInput') || document.getElementById('searchInputMobile');
    const search = searchInput ? searchInput.value.toLowerCase() : '';
    filteredApps = apps.filter(app => {
      const desc = (currentLang === 'en' && app.description_en) ? app.description_en : app.description;
      const matchesSearch = app.name.toLowerCase().includes(search) || desc.toLowerCase().includes(search) || (app.tags && app.tags.some(tag => tag.toLowerCase().includes(search)));
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
    let allCards = [];
    Object.keys(grouped).forEach(mainCat => {
      Object.keys(grouped[mainCat]).forEach(subCat => {
        allCards = allCards.concat(grouped[mainCat][subCat]);
      });
    });
    const helpBtn = `<button id='showInstructions' class='btn btn-outline-info mb-3'><i class='bi bi-info-circle'></i> ${t('btn.howToFlash')}</button>`;
    const instructions = `<div id='instructionsBox' class='alert alert-info mb-4' style='display:none;'>${t('howToFlash.html')}</div>`;
    const html = `<div class="row">${allCards.map(app => createAppCard(app)).join('')}</div>`;
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

  _reRenderApps = applyFilters;
  renderFilteredApps();
}

document.addEventListener('DOMContentLoaded', function() {
  applyTranslations();
  updateLangButtons();

  document.getElementById('lang-pt').addEventListener('click', () => setLanguage('pt'));
  document.getElementById('lang-en').addEventListener('click', () => setLanguage('en'));

  const customAboveBtn = document.getElementById('custom-above-btn');
  if (customAboveBtn) {
    customAboveBtn.addEventListener('click', function() {
      $('#customToolModal').modal('show');
    });
  }

  renderAppStore();
});
