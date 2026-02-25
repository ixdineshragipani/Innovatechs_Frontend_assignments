import React, { useState, useEffect } from "react";
import axios from "axios";
import PokemonModal from "./components/PokemonModal";
import PokemonCard from "./components/PokemonCard";

const LIMIT = 10;

export default function App() {
  const [pokemons, setPokemons] = useState([]);
  const [allList, setAllList] = useState([]); // full name+url list
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPokemon, setSelectedPokemon] = useState(null);

  const totalPages = Math.ceil(total / LIMIT);

  // cache for fetched pokemon details to avoid refetching
  const detailsCache = new Map();

  // Fetch Pokemon List (Pagination)
  const fetchPokemons = async () => {
    setLoading(true);
    const offset = (page - 1) * LIMIT;
    // If searching or filtering across all pokemons, we'll handle differently
    if (search || typeFilter) {
      // handled in useEffect below by calling fetchSearchOrFilter
      setLoading(false);
      return;
    }

    const res = await fetch(
      `https://pokeapi.co/api/v2/pokemon?limit=${LIMIT}&offset=${offset}`
    );
    const data = await res.json();

    setTotal(data.count);

    // Fetch details for each pokemon (with cache)
    const detailedData = await Promise.all(
      data.results.map(async (p) => {
        if (detailsCache.has(p.url)) return detailsCache.get(p.url);
        const d = await fetch(p.url).then((r) => r.json());
        detailsCache.set(p.url, d);
        return d;
      })
    );

    setPokemons(detailedData);
    setLoading(false);
  };

  // Fetch Types
  const fetchTypes = async () => {
    const res = await fetch("https://pokeapi.co/api/v2/type");
    const data = await res.json();
    setTypes(data.results);
  };

  // fetch master list of all pokemon (name) once
  const fetchAllList = async () => {
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=3000&offset=0`);
      const data = await res.json();
      setAllList(data.results || []);
    } catch (e) {
      e.printStackTarce();
    }
  };

  // Fetch details for a slice of list entries
  const fetchDetailsForSlice = async (listSlice) => {
    setLoading(true);
    const detailed = await Promise.all(
      listSlice.map(async (p) => {
        const url = `https://pokeapi.co/api/v2/pokemon/${p.name}`;
        if (detailsCache.has(url)) return detailsCache.get(url);
        const d = await fetch(url).then((r) => r.json());
        detailsCache.set(url, d);
        return d;
      })
    );
    setPokemons(detailed);
    setLoading(false);
  };

  // Handle search or type filter across all pokemons
  const fetchSearchOrFilter = async () => {
    // Build a working list of entries {name, url}
    let working = allList;
    
    // If search is set, filter by name against working list
    if (search) {
      const q = search.toLowerCase();
      working = working.filter((p) => p.name.includes(q));
    }

    // If typeFilter is set, fetch the type endpoint which lists pokemons for that type
    if (typeFilter) {
      const res = await fetch(`https://pokeapi.co/api/v2/type/${typeFilter}`);
      const data = await res.json();
      working = data.pokemon.map((p) => p.pokemon);
    }


    setTotal(working.length);
    const start = (page - 1) * LIMIT;
    const slice = working.slice(start, start + LIMIT);
    await fetchDetailsForSlice(slice);
  };

  useEffect(() => {
    // If searching or filtering, use search handler, else use page fetch
    if (search || typeFilter) fetchSearchOrFilter();
    else fetchPokemons();
  }, [page]);

  useEffect(() => {
    fetchTypes();
    fetchAllList();
  }, []);

  // re-run when search or filter changes (reset to page 1)
  useEffect(() => {
    setPage(1);
    if (search || typeFilter) fetchSearchOrFilter();
    else fetchPokemons();
  }, [search, typeFilter]);

  // close modal on Escape
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setSelectedPokemon(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Search + Filter Logic
  const filteredPokemons = pokemons.filter((p) => {
    const matchesSearch = p.name.includes(search.toLowerCase());
    const matchesType = typeFilter? p.types.some((t) => t.type.name === typeFilter) : true;
    return matchesSearch && matchesType;
  });

  return (
    <div className="align-center min-h-screen p-6">
      <div className="w-full">
        <header className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
          <h1 className="text-4xl font-extrabold">Pokedex</h1>

          <div className="flex gap-3 w-full md:w-auto">
            <input
              className="p-3 rounded-lg shadow w-full md:w-72 border border-slate-200"
              placeholder="Search Pokemon..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div><button className="bg-blue-400 hover:bg-blue-500 font-bold py-2 px-4 rounded-lg">Search</button></div>

            <select
              className="p-3 rounded-lg shadow w-40 border border-slate-200 bg-white"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="">All Types</option>
              {types.map((t) => (
                <option key={t.name} value={t.name}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
        </header>

        {/* Pokemon Grid */}
        {loading ? (<p className="text-center">Loading...</p>) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {filteredPokemons.map((p) => (
              <PokemonCard key={p.id} pokemon={p} onClick={(pk) => setSelectedPokemon(pk)} />
            ))}
          </div>
        )}
        <div className="flex justify-center items-center gap-2 mt-8 flex-wrap">
          <button
            disabled={page === 1}
            onClick={() => setPage((s) => Math.max(1, s - 1))}
            className="px-3 py-1 bg-white/60 border rounded disabled:opacity-50"
          >
            Prev
          </button>

          {(() => {
            if (totalPages <= 3) {
              return Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  onClick={() => setPage(n)}
                  className={`px-3 py-1 rounded ${page === n ? 'bg-blue-600 text-white' : 'bg-white/60 border'}`}
                >
                  {n}
                </button>
              ));
            }

            let start;
            if (page <= 2) start = 1;
            else if (page >= totalPages - 1) start = totalPages - 2;
            else start = page - 1;

            const pages = [start, start + 1, Math.min(start + 2, totalPages)];

            return (
              <>
                {start > 1 && (
                  <>
                    <button onClick={() => setPage(1)} className="px-3 py-1 rounded bg-white/60 border">1</button>
                    {start > 2 && <span className="px-2">...</span>}
                  </>
                )}

                {pages.map((n) => (
                  <button
                    key={n}
                    onClick={() => setPage(n)}
                    className={`px-3 py-1 rounded ${page === n ? 'bg-blue-600 text-white' : 'bg-white/60 border'}`}
                  >
                    {n}
                  </button>
                ))}

                {start + 2 < totalPages && (
                  <>
                    {start + 2 < totalPages - 1 && <span className="px-2">...</span>}
                    <button onClick={() => setPage(totalPages)} className="px-3 py-1 rounded bg-white/60 border">{totalPages}</button>
                  </>
                )}
              </>
            );
          })()}

          <button
            disabled={page === totalPages}
            onClick={() => setPage((s) => Math.min(totalPages, s + 1))}
            className="px-3 py-1 bg-white/60 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
      {selectedPokemon && (
        <React.Suspense fallback={null}>
          {/* lazy show modal */}
          <PokemonModal pokemon={selectedPokemon} onClose={() => setSelectedPokemon(null)} />
        </React.Suspense>
      )}
    </div>
  );
}