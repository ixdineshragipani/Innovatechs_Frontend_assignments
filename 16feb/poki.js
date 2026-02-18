document.addEventListener('DOMContentLoaded', () => {
    const base = 'https://pokeapi.co/api/v2/pokemon/';
    const content = document.getElementById('content');
    const form = document.getElementById('searchForm');
    const input = document.getElementById('searchInput');

    function showLoading(text = 'Loading…') {
        content.innerHTML = `<div class="text-center text-sm text-slate-500">${text}</div><div class="loader mx-auto mt-4" role="status" aria-hidden></div>`;
    }

    function renderPokemon(p) {
        const img = (p.sprites && (p.sprites.other?.['official-artwork']?.front_default || p.sprites.front_default)) || '';
        const name = p.name || 'unknown';
        const id = p.id ? `#${p.id}` : '';
        const types = (p.types || []).map(t => t.type.name);
        const abilities = (p.abilities || []).map(a => a.ability.name);
        const stats = {};
        const weight=p.weight/10;
        (p.stats || []).forEach(s => { stats[s.stat.name] = s.base_stat; });
        content.innerHTML = `
            <div class="relative bg-gradient-to-br from-red-300 to-slate-100 p-6 rounded-[20px] shadow-xl border">
                <div class="flex items-center gap-2">
                    <div class="w-24 h-24 rounded-xl bg-white/80 flex items-center justify-center shadow-xl border">
                        <img class="w-20 h-20 object-contain" src="${img}" alt="${name}">
                    </div>
                    <div class="flex-1">
                        <h1 class="text-xl font-bold text-slate-900">${name.replace(/^./, c => c.toUpperCase())} <span class="text-sm text-black-500 ml-2">${id}</span></h1>
                        <p class="text-sm text-slate-500">A playful Pokemon</p>
                    </div>
                </div>

                <div class="flex gap-2 mt-4">type:
                    ${types.map(t => `<div class="px-3 py-1 rounded-full bg-gray-100 text-sm text-slate-700 border">${t}</div>`).join('')}
                </div>

                <div class="flex gap-3 mt-4">
                    <div class="flex-1 bg-white p-3 rounded-lg text-center border">
                        <div class="text-sky-500 font-semibold text-lg">${stats.hp || '-'}</div>
                        <div class="text-xs text-slate-500">HP</div>
                    </div>
                    <div class="flex-1 bg-white p-3 rounded-lg text-center border">
                        <div class="text-sky-500 font-semibold text-lg">${stats.attack || '-'}</div>
                        <div class="text-xs text-slate-500">Atk</div>
                    </div>
                    <div class="flex-1 bg-white p-3 rounded-lg text-center border">
                        <div class="text-sky-500 font-semibold text-lg">${stats.defense || '-'}</div>
                        <div class="text-xs text-slate-500">Def</div>
                    </div>
                </div>

                <div class="mt-3"> Abilities:
                    ${abilities.map(a => `<span class="inline-block bg-gray-100 px-3 py-1 rounded-lg text-sm mr-2">${a}</span>`).join('')}
                </div>
                <div>Weight:
                ${weight ? `<div class="inline-block bg-gray-100 px-3 py-1 rounded-lg text-sm mt-2"> ${weight}</div>` : 'No content of weight in dataset'}
                </div>
            </div>
        `;
    }

    async function fetchAndRender(name) {
        const q = (name || 'Bulbasaur').toString().trim().toLowerCase();
        if (!q) return;
        showLoading(`Searching “${q}”…`);
        try {
            const res = await fetch(base + encodeURIComponent(q));
            if (res.status === 404) {
                content.innerHTML = `<div class="text-center text-orange-500">No Pokemon found for <strong class=\"text-slate-700\">${q}</strong></div>`;
                return;
            }
            if (!res.ok) throw new Error(res.statusText || 'Network error');
            const p = await res.json();
            renderPokemon(p);
        } catch (err) {
            content.innerHTML = `<div class="text-center text-red-500">Failed to load Pokemon.<div class=\"text-sm text-slate-500\">${err.message}</div></div>`;
            console.error('Error fetching Pokemon:', err);
        }
    }

    // initial load
    fetchAndRender('Bulbasaur');

    form.addEventListener('submit', (ev) => {
        ev.preventDefault();
        fetchAndRender(input.value || '');
    });
});

