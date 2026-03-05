(function () {
  'use strict';

  /* ── STATE ───────────────────────────────────────── */
  const state = {
    allPokemons:  [],
    displayed:    [],
    offset:       0,
    limit:        20,
    hasMore:      true,
    loading:      false,
    search:       '',
    activeType:   'all',
  };

  /* ── DOM REFS ────────────────────────────────────── */
  const pokemonList    = document.getElementById('pokemonList');
  const loadMoreBtn    = document.getElementById('loadMoreButton');
  const searchInput    = document.getElementById('searchInput');
  const clearSearchBtn = document.getElementById('clearSearch');
  const typeButtons    = document.querySelectorAll('.type-filter-btn');
  const resultCount    = document.getElementById('resultCount');
  const emptyState     = document.getElementById('emptyState');

  const modal       = document.getElementById('pokemonModal');
  const modalClose  = document.getElementById('modalClose');
  const modalHeader = document.getElementById('modalHeader');
  const modalImg    = document.getElementById('modalImg');
  const modalNumber = document.getElementById('modalNumber');
  const modalName   = document.getElementById('modalName');
  const modalTypes  = document.getElementById('modalTypes');
  const modalFlavor = document.getElementById('modalFlavor');
  const modalHeight = document.getElementById('modalHeight');
  const modalWeight = document.getElementById('modalWeight');
  const modalPower  = document.getElementById('modalPower');
  const modalExp    = document.getElementById('modalExp');
  const modalAbilities = document.getElementById('modalAbilities');
  const modalStats  = document.getElementById('modalStats');

  const STAT_LABELS = {
    'hp':              'HP',
    'attack':          'Ataque',
    'defense':         'Defesa',
    'special-attack':  'Sp. Atk',
    'special-defense': 'Sp. Def',
    'speed':           'Velocidade',
  };

  /* ── INIT ────────────────────────────────────────── */
  loadPokemons();

  /* ── LOAD POKEMONS ──────────────────────────────── */
  async function loadPokemons() {
    if (state.loading || !state.hasMore) return;
    state.loading = true;
    loadMoreBtn.disabled = true;
    loadMoreBtn.querySelector('span').textContent = 'Carregando...';

    // Show skeleton placeholders
    const skeletons = Array.from({ length: state.limit }, () => {
      const li = document.createElement('li');
      li.className = 'skeleton';
      pokemonList.appendChild(li);
      return li;
    });

    try {
      const { results, next } = await pokeApi.getPokemons(state.offset, state.limit);
      skeletons.forEach(s => s.remove());

      results.forEach(p => {
        state.allPokemons.push(p);
        renderCard(p);
      });

      state.offset += state.limit;
      state.hasMore = !!next;
      applyFilters(false);
    } catch (err) {
      console.error(err);
      skeletons.forEach(s => s.remove());
    }

    state.loading = false;
    loadMoreBtn.disabled = false;
    loadMoreBtn.querySelector('span').textContent = 'Carregar mais';

    if (!state.hasMore) {
      loadMoreBtn.disabled = true;
      loadMoreBtn.querySelector('span').textContent = 'Todos carregados!';
    }
  }

  /* ── RENDER CARD ─────────────────────────────────── */
  function renderCard(pokemon) {
    const li = document.createElement('li');
    li.className = `pokemon ${pokemon.mainType}`;
    li.dataset.id   = pokemon.id;
    li.dataset.name = pokemon.name;
    li.dataset.types = pokemon.types.join(',');

    li.innerHTML = `
      <span class="pokemon-number">${pokemon.formattedNumber}</span>
      <img src="${pokemon.photo}" alt="${pokemon.name}" loading="lazy">
      <p class="pokemon-name">${pokemon.name}</p>
      <div class="pokemon-types">
        ${pokemon.types.map(t => `<span class="type ${t}">${t}</span>`).join('')}
      </div>
    `;

    li.addEventListener('click', () => openModal(pokemon));
    pokemonList.appendChild(li);
  }

  /* ── FILTERS ─────────────────────────────────────── */
  function applyFilters(reRender = true) {
    const q    = state.search.toLowerCase().trim();
    const type = state.activeType;

    const cards = pokemonList.querySelectorAll('.pokemon');
    let visible = 0;

    cards.forEach(card => {
      const nameMatch = card.dataset.name.includes(q) || card.dataset.id.includes(q);
      const typeMatch = type === 'all' || card.dataset.types.split(',').includes(type);
      const show = nameMatch && typeMatch;
      card.style.display = show ? '' : 'none';
      if (show) visible++;
    });

    resultCount.textContent = visible > 0 ? `${visible} Pokémon(s) encontrado(s)` : '';
    emptyState.style.display = visible === 0 ? 'block' : 'none';
    loadMoreBtn.style.display = (type === 'all' && !q) ? 'flex' : 'none';
  }

  /* ── SEARCH ──────────────────────────────────────── */
  searchInput.addEventListener('input', () => {
    state.search = searchInput.value;
    clearSearchBtn.classList.toggle('visible', state.search.length > 0);
    applyFilters();
  });

  clearSearchBtn.addEventListener('click', () => {
    searchInput.value = '';
    state.search = '';
    clearSearchBtn.classList.remove('visible');
    applyFilters();
  });

  /* ── TYPE FILTER ─────────────────────────────────── */
  typeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      typeButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.activeType = btn.dataset.type;
      applyFilters();
    });
  });

  /* ── LOAD MORE ───────────────────────────────────── */
  loadMoreBtn.addEventListener('click', loadPokemons);

  /* ── MODAL ───────────────────────────────────────── */
  async function openModal(pokemon) {
    // Reset e abre
    modalFlavor.textContent = 'Carregando descrição...';
    modalStats.innerHTML = '';
    modalAbilities.innerHTML = '';
    modalTypes.innerHTML = '';

    // Header color
    const color = pokeApi.TYPE_COLORS[pokemon.mainType] || '#888';
    modalHeader.style.background =
      `linear-gradient(135deg, ${color}, ${color}99)`;
    modalImg.style.display = 'none';

    // Dados básicos
    modalNumber.textContent = pokemon.formattedNumber;
    modalName.textContent   = pokemon.name;
    modalHeight.textContent = pokemon.formattedHeight;
    modalWeight.textContent = pokemon.formattedWeight;
    modalPower.textContent  = pokemon.totalPower;
    modalExp.textContent    = pokemon.baseExperience ?? '—';

    // Types
    pokemon.types.forEach(t => {
      const span = document.createElement('span');
      span.className = `type ${t}`;
      span.textContent = t;
      modalTypes.appendChild(span);
    });

    // Imagem
    const img = new Image();
    img.src = pokemon.photo;
    img.onload = () => {
      modalImg.src = pokemon.photo;
      modalImg.alt = pokemon.name;
      modalImg.style.display = 'block';
    };

    // Abilities
    pokemon.abilities.forEach(a => {
      const chip = document.createElement('span');
      chip.className = 'ability-chip';
      chip.innerHTML = a.ability.name.replace('-', ' ') +
        (a.is_hidden ? ' <em>(oculta)</em>' : '');
      modalAbilities.appendChild(chip);
    });

    // Stats
    pokemon.stats.forEach(s => {
      const label = STAT_LABELS[s.stat.name] || s.stat.name;
      const pct   = Math.min((s.base_stat / 255) * 100, 100).toFixed(1);
      const row   = document.createElement('div');
      row.className = 'stat-row';
      row.innerHTML = `
        <span class="stat-label">${label}</span>
        <span class="stat-val">${s.base_stat}</span>
        <div class="stat-bar-track">
          <div class="stat-bar-fill"
               style="width:0; background:${color};"
               data-width="${pct}%">
          </div>
        </div>
      `;
      modalStats.appendChild(row);
    });

    // Atualiza a cor do título de seções
    document.getElementById('abilitiesTitle').style.color = color;
    document.getElementById('statsTitle').style.color     = color;
    modalFlavor.style.borderLeftColor = color;
    document.querySelector('.info-val.accent').style.color = color;

    // Mostra o modal
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    // Anima barras de stat após render
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        modalStats.querySelectorAll('.stat-bar-fill').forEach(bar => {
          bar.style.width = bar.dataset.width;
        });
      });
    });

    // Busca flavor text
    try {
      const flavor = await pokeApi.getPokemonSpecies(pokemon.speciesUrl);
      modalFlavor.textContent = flavor ? `"${flavor}"` : '';
    } catch {
      modalFlavor.textContent = '';
    }
  }

  function closeModal() {
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }

  modalClose.addEventListener('click', closeModal);
  modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

})();
